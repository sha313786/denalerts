require('dotenv').config();
const express = require('express');
const http = require('http');
const https = require('https');
const WebSocket = require('ws');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const os = require('os');
const url = require('url');
const crypto = require('crypto');
const auth = require('./auth');
const discordBot = require('./discord_bot');

const PORT = process.env.PORT || 3333;
const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? path.join(os.tmpdir(), 'denalerts_data') : path.join(__dirname, 'data');
const SESSIONS_DIR = path.join(DATA_DIR, 'sessions');
const BUNDLED_DATA_DIR = path.join(__dirname, 'data');
const BUNDLED_SESSIONS_DIR = path.join(BUNDLED_DATA_DIR, 'sessions');
const UPLOADS_DIR = IS_VERCEL ? path.join(os.tmpdir(), 'denalerts_data', 'uploads') : path.join(__dirname, 'public', 'uploads');

const app = express();
app.get(['/health', '/healthz'], (req, res) => res.status(200).json({ status: 'ok', uptime: process.uptime(), timestamp: Date.now() }));
const server = http.createServer(app);
let wss = null;
try {
  wss = new WebSocket.Server({ server });
} catch (e) {
  console.warn('[WebSocket] Warning initializing WebSocket server:', e.message);
}

try {
  if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[Storage] Warning creating sessions dir:', e.message);
}

try {
  if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[Storage] Warning creating uploads dir:', e.message);
}

// In-memory sessions map
const sessions = new Map();
const ipRateLimits = new Map();
const loginRateLimits = new Map();
const registerRateLimits = new Map();
const ttsRateLimits = new Map();
const adminRateLimits = new Map();
const recentPaymentHashes = new Map();

function getClientIp(req) {
  if (!req) return '127.0.0.1';
  return req.headers['cf-connecting-ip'] || 
         (req.headers['x-forwarded-for'] ? req.headers['x-forwarded-for'].split(',')[0].trim() : null) || 
         req.socket.remoteAddress || 
         'unknown';
}

function safeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false;
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto.timingSafeEqual(bufA, bufB);
}

// Profanity / Abuse filter patterns
const BANNED_PATTERNS = [
  /\b(fuck|shit|bitch|asshole|bastard|dick|pussy|cunt|nigger|nigga|whore|slut)\b/gi,
  /\b(mc|bc|bsdk|chutiya|gand|gandu|madarchod|bhenchod|lodu|lavde|bhosdike|harami|kutte)\b/gi
];

function filterProfanity(text) {
  if (!text) return '';
  let cleaned = String(text);
  BANNED_PATTERNS.forEach((pattern) => {
    cleaned = cleaned.replace(pattern, '***');
  });
  return cleaned;
}

function sanitizeText(text) {
  if (!text) return '';
  let clean = String(text).trim();
  // Collapse repeating characters: "aaaaaaa" -> "aaa"
  clean = clean.replace(/(.)\1{4,}/g, '$1$1$1');
  if (clean.length > 120) {
    clean = clean.substring(0, 120) + '...';
  }
  return clean;
}

function cleanDonorNote(note) {
  if (!note || typeof note !== 'string') return '';
  let clean = note.trim();

  // Strip common bank/app/notification prefixes repeatedly
  const prefixRegex = /^(?:for\s+)?(?:note|message|msg|remarks?)[\s:\-–—]+|^सन्देश[:\s]+|^संदेश[:\s]+|^செய்தி[:\s]+|^సందేశం[:\s]+|^ಸಂದೇಶ[:\s]+|^സന്ദേശം[:\s]+/i;
  while (prefixRegex.test(clean)) {
    clean = clean.replace(prefixRegex, '').trim();
  }

  // Strip standalone leading "note " or "message " or "msg "
  clean = clean.replace(/^(?:note|msg|message)\s+/i, '').trim();

  // Strip any leading punctuation left over (like "- ", ": ", etc.)
  clean = clean.replace(/^[\s:\-–—,.]+/, '').trim();

  // Strip system/fallback placeholders so TTS and overlay don't speak useless text
  const lower = clean.toLowerCase();
  const placeholders = [
    'no message provided',
    'payment received',
    'live upi superchat',
    'tested live from streamer app!',
    'tested live from streamer companion app!',
    'tested live from streamer app',
    'upi',
    'payment'
  ];
  if (placeholders.includes(lower)) {
    return '';
  }

  return clean;
}

function cleanId(raw) {
  if (!raw) return 'default';
  const cleaned = String(raw).toLowerCase().replace(/[^a-z0-9_-]/g, '').trim();
  return cleaned.length > 0 ? cleaned : 'default';
}

// Pairing PIN Mapping: 6-Digit PIN <-> Account StreamId
const pairingCodeToStreamId = new Map();

function scanSessionsDir(dir) {
  try {
    if (fs.existsSync(dir)) {
      const sessionFiles = fs.readdirSync(dir);
      sessionFiles.forEach((file) => {
        if (file.endsWith('.json')) {
          const sid = file.replace('.json', '');
          try {
            const content = JSON.parse(fs.readFileSync(path.join(dir, file), 'utf-8'));
            if (content.pairingCode) {
              pairingCodeToStreamId.set(String(content.pairingCode).toLowerCase(), sid);
            }
          } catch (_) {}
        }
      });
    }
  } catch (_) {}
}

scanSessionsDir(BUNDLED_SESSIONS_DIR);
scanSessionsDir(SESSIONS_DIR);

function resolveStreamId(raw) {
  const safe = cleanId(raw);
  if (pairingCodeToStreamId.has(safe)) {
    return pairingCodeToStreamId.get(safe);
  }
  return safe;
}

function getSession(streamId) {
  const safeId = resolveStreamId(streamId);
  if (!sessions.has(safeId)) {
    const sessionFile = path.join(SESSIONS_DIR, `${safeId}.json`);
    let data = {
      history: [],
      settings: {
        voiceSpeed: 1.00,
        voiceEnabled: true,
        voiceLanguage: 'en-IN', // Regional language (en-IN, hi, ta, te, kn, ml, bn, mr, gu, pa, hinglish)
        voicePersona: 'standard', // Pro Custom Voices: 'standard' | 'own_voice' | 'esports_caster' | 'deep_bass' | 'anime' | 'cyber_robot' | 'custom'
        voicePitch: 1.0,         // Custom pitch: 0.60x to 1.60x
        ownVoiceUrl: null,       // URL of streamer's recorded/uploaded voice
        ownVoiceMode: 'intro',   // 'intro' (Own voice shoutout + TTS) | 'alert_sound' (Own voice chime) | 'full' (Own voice full takeover)
        ownVoiceOriginalName: null,
        customAlertSoundUrl: null, // Custom alert sound MP3/WAV (null = default chime)
        customAlertSoundName: 'Default Chime',
        customMediaUrl: null,      // Custom GIF / Video / Image URL
        customMediaType: null,     // 'gif' | 'video' | 'image'
        customMediaName: 'Default Pulse',
        soundVolume: 0.9,
        minAlertAmount: 1,  // Minimum ₹ to trigger stream alert
        minTtsAmount: 1,    // Minimum ₹ to speak voice TTS
        censorProfanity: true,
        discordWebhookUrl: '',
        discordWebhookEnabled: false,
        streamlabsEnabled: false,
        streamlabsToken: '',
        streamElementsEnabled: false,
        streamElementsToken: '',
        streamElementsChannelId: '',
        goalTitle: 'Live Stream Goal',
        goalTarget: 1000,
        goalCurrent: 0,
        goalTheme: 'default',
        goalCustomColors: {
          barStart: '#00f0ff',
          barEnd: '#ec4899',
          glow: '#00f0ff',
          text: '#00f0ff'
        },
        goalEnabled: true
      },
      subscription: {
        plan: 'pro_trial',
        status: 'active',
        tierName: 'Creator Pro (Trial)',
        startedAt: Date.now(),
        expiresAt: Date.now() + (14 * 24 * 60 * 60 * 1000), // 14 Days from creation
        features: {
          watermark: true, // Trial & Free Version display SRB STUDIOS watermark
          customAudio: true,
          aiVoiceTts: true,
          discordWebhook: true,
          goalBars: true,
          zeroCommission: true
        }
      }
    };
    try {
      const bundledSessionFile = path.join(BUNDLED_SESSIONS_DIR, `${safeId}.json`);
      const targetSessionFile = fs.existsSync(sessionFile) ? sessionFile : (fs.existsSync(bundledSessionFile) ? bundledSessionFile : null);
      if (targetSessionFile) {
        const loaded = JSON.parse(fs.readFileSync(targetSessionFile, 'utf-8'));
        data = { 
          ...data, 
          ...loaded, 
          settings: { ...data.settings, ...(loaded.settings || {}) },
          subscription: { ...data.subscription, ...(loaded.subscription || {}) }
        };

        if (data.settings.customMediaUrl && data.settings.customMediaUrl.includes('giphy.com')) {
          if (data.settings.customMediaUrl.includes('jpbnoe3UIa8TU8LM13')) data.settings.customMediaUrl = '/presets/cat_jam.gif';
          else if (data.settings.customMediaUrl.includes('l3q2zVr6ET95U3ITm')) data.settings.customMediaUrl = '/presets/party_parrot.gif';
          else if (data.settings.customMediaUrl.includes('LdOyjZ7io5Msw')) data.settings.customMediaUrl = '/presets/money_rain.gif';
          else if (data.settings.customMediaUrl.includes('26u4cqiYI30juCOGY')) data.settings.customMediaUrl = '/presets/trophy.gif';
          else if (data.settings.customMediaUrl.includes('11sBLVxNs7v6WA')) data.settings.customMediaUrl = '/presets/anime_hype.gif';
          else data.settings.customMediaUrl = '/presets/cat_jam.gif';
        }

        // Automatic Expiration Check:
        if (data.subscription) {
          if (data.subscription.expiresAt && Date.now() > data.subscription.expiresAt && data.subscription.plan !== 'free') {
            console.log(`[Subscription Auto-Expiry] Plan expired for [${safeId}]. Auto-downgrading to Free Tier.`);
            data.subscription.plan = 'free';
            data.subscription.status = 'expired';
            data.subscription.tierName = 'Creator Free';
            data.subscription.features = {
              watermark: true,
              customAudio: false,
              aiVoiceTts: false,
              discordWebhook: false,
              goalBars: false,
              zeroCommission: true
            };
          }
          // Enforce watermark rule: Trial and Free have watermark, only paid pro is unbranded
          const isPaidPro = data.subscription.plan === 'pro';
          if (!data.subscription.features) data.subscription.features = {};
          data.subscription.features.watermark = !isPaidPro;
        }
      }
    } catch (_) {}

    // Ensure persistent 6-digit pairing code
    if (!data.pairingCode) {
      if (/^\d{6}$/.test(safeId)) {
        data.pairingCode = safeId;
      } else {
        let hash = 0;
        for (let i = 0; i < safeId.length; i++) {
          hash = ((hash << 5) - hash) + safeId.charCodeAt(i);
          hash |= 0;
        }
        data.pairingCode = String(Math.abs(hash) % 900000 + 100000);
      }
    }
    if (!data.accountName) {
      data.accountName = safeId;
    }
    pairingCodeToStreamId.set(String(data.pairingCode), safeId);
    pairingCodeToStreamId.set(safeId, safeId);

    sessions.set(safeId, data);
  }
  return { streamId: safeId, session: sessions.get(safeId) };
}

function saveSession(rawId) {
  try {
    const safeId = resolveStreamId(rawId);
    const session = sessions.get(safeId);
    if (session) {
      const sessionFile = path.join(SESSIONS_DIR, `${safeId}.json`);
      fs.writeFileSync(sessionFile, JSON.stringify({
        settings: session.settings,
        subscription: session.subscription,
        pairingCode: session.pairingCode,
        accountName: session.accountName,
        history: session.history.slice(-200)
      }, null, 2), 'utf-8');
    }
  } catch (_) {}
}

function getSummaryStats(history) {
  const list = history || [];
  const total = list.reduce((sum, item) => sum + (parseFloat(item.amount) || 0), 0);
  const count = list.length;
  const donorCounts = {};
  list.forEach((p) => {
    const name = p.senderName || 'Anonymous';
    donorCounts[name] = (donorCounts[name] || 0) + (parseFloat(p.amount) || 0);
  });

  let topDonor = { name: 'None', amount: 0 };
  for (const [name, amt] of Object.entries(donorCounts)) {
    if (amt > topDonor.amount) topDonor = { name, amount: amt };
  }

  return {
    totalAmount: total,
    count,
    topDonor,
    average: count > 0 ? (total / count).toFixed(2) : 0
  };
}

function sendDiscordAlert(session, alertData) {
  try {
    if (!session || !session.settings) return;
    const { discordWebhookUrl, discordWebhookEnabled } = session.settings;
    if (!discordWebhookEnabled || !discordWebhookUrl) return;

    const cleanUrl = String(discordWebhookUrl).trim();
    if (!cleanUrl.startsWith('https://discord.com/api/webhooks/') && !cleanUrl.startsWith('https://canary.discord.com/api/webhooks/')) {
      return;
    }

    const amt = parseFloat(alertData.amount) || 0;
    const donor = alertData.senderName || 'Anonymous Supporter';
    const note = alertData.note || 'No message provided';
    const app = alertData.appName || 'UPI';

    const embed = {
      title: '🎉 New Live UPI Donation Received!',
      description: `**${donor}** just contributed **₹${amt.toLocaleString('en-IN')}** directly to bank!`,
      color: 0x10b981,
      fields: [
        { name: '💰 Amount', value: `₹${amt.toLocaleString('en-IN')}`, inline: true },
        { name: '👤 Supporter', value: donor, inline: true },
        { name: '📱 Payment App', value: app, inline: true },
        { name: '💬 Message', value: note.length > 500 ? note.slice(0, 497) + '...' : note }
      ],
      footer: {
        text: 'DenAlerts Live Stream Engine • SRB STUDIOS'
      },
      timestamp: new Date().toISOString()
    };

    const payload = JSON.stringify({
      username: 'DenAlerts Live Bot',
      avatar_url: 'https://alerts.denbooks.in/icon-192.png',
      embeds: [embed]
    });

    const parsed = new URL(cleanUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      res.resume();
    });
    req.on('error', (e) => {
      console.warn('[Discord Webhook Error]', e.message);
    });
    req.write(payload);
    req.end();
  } catch (err) {
    console.warn('[Discord Webhook Exception]', err.message);
  }
}

function relayToStreamlabs(session, alertData) {
  try {
    if (!session || !session.settings) return;
    const isPro = session.subscription && (session.subscription.plan === 'pro' || session.subscription.plan === 'pro_trial');
    if (!isPro) return;
    const { streamlabsEnabled, streamlabsToken } = session.settings;
    if (!streamlabsEnabled || !streamlabsToken) return;

    const amt = parseFloat(alertData.amount) || 0;
    const donor = alertData.senderName || 'Anonymous Supporter';
    const note = alertData.note || 'Live UPI Superchat';

    const payload = JSON.stringify({
      name: donor,
      identifier: `${donor.toLowerCase().replace(/[^a-z0-9]/g, '') || 'supporter'}@upi`,
      amount: amt,
      currency: 'INR',
      message: note
    });

    const cleanToken = String(streamlabsToken).trim();
    const options = {
      hostname: 'streamlabs.com',
      path: '/api/v1.0/donations',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(`[Streamlabs Relay][HTTP ${res.statusCode}]`, data.slice(0, 100));
      });
    });
    req.on('error', (e) => {
      console.warn('[Streamlabs Relay Error]', e.message);
    });
    req.write(payload);
    req.end();
  } catch (err) {
    console.warn('[Streamlabs Relay Exception]', err.message);
  }
}

function relayToStreamElements(session, alertData) {
  try {
    if (!session || !session.settings) return;
    const isPro = session.subscription && (session.subscription.plan === 'pro' || session.subscription.plan === 'pro_trial');
    if (!isPro) return;
    const { streamElementsEnabled, streamElementsToken, streamElementsChannelId } = session.settings;
    if (!streamElementsEnabled || !streamElementsToken || !streamElementsChannelId) return;

    const amt = parseFloat(alertData.amount) || 0;
    const donor = alertData.senderName || 'Anonymous Supporter';
    const note = alertData.note || 'Live UPI Superchat';

    const payload = JSON.stringify({
      user: {
        username: donor
      },
      donation: {
        amount: amt,
        message: note,
        currency: 'INR'
      }
    });

    const channel = encodeURIComponent(String(streamElementsChannelId).trim());
    const cleanToken = String(streamElementsToken).trim();
    const options = {
      hostname: 'api.streamelements.com',
      path: `/kappa/v2/tips/${channel}`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${cleanToken}`,
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => {
        console.log(`[StreamElements Relay][HTTP ${res.statusCode}]`, data.slice(0, 100));
      });
    });
    req.on('error', (e) => {
      console.warn('[StreamElements Relay Error]', e.message);
    });
    req.write(payload);
    req.end();
  } catch (err) {
    console.warn('[StreamElements Relay Exception]', err.message);
  }
}

function broadcastToStream(streamId, type, data) {
  if (!wss || !wss.clients) return;
  const message = JSON.stringify({ type, data, timestamp: Date.now() });
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.streamId === streamId) {
      client.send(message);
    }
  });
}

function extractAuthToken(req) {
  if (!req) return null;
  const authHeader = req.headers && req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim();
  }
  if (req.headers && req.headers['x-auth-token']) {
    return String(req.headers['x-auth-token']).trim();
  }
  if (req.query && req.query.token) {
    return String(req.query.token).trim();
  }
  return null;
}

function extractStreamId(req) {
  // If request contains verified session token, strictly bind to that creator
  const token = extractAuthToken(req);
  if (token) {
    const verifiedUser = auth.verifyToken(token);
    if (verifiedUser && verifiedUser.streamerKey) {
      return verifiedUser.streamerKey;
    }
  }

  const raw = req.query.code || req.query.stream || req.query.streamer || req.query.channel || (req.body && (req.body.code || req.body.stream || req.body.streamer));
  if (!raw || String(raw).trim().length === 0 || String(raw).trim().toLowerCase() === 'default') {
    return null;
  }
  return resolveStreamId(raw);
}

function requireStreamerAuth(req, res, next) {
  const streamId = extractStreamId(req);
  if (!streamId) {
    return res.status(401).json({ success: false, error: 'Creator streamId or authentication token required.' });
  }

  const token = extractAuthToken(req);
  if (token) {
    const user = auth.verifyToken(token);
    if (!user) {
      return res.status(401).json({ success: false, error: 'Session expired. Please log in again.' });
    }
    const adminEmail = (process.env.ADMIN_EMAIL || 'srbstudiosofficial@gmail.com').toLowerCase();
    const isAdmin = user.email && user.email.toLowerCase() === adminEmail;
    if (!isAdmin && user.streamerKey && user.streamerKey !== streamId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to modify settings for another streamer.' });
    }
  }

  req.streamId = streamId;
  next();
}

function getLocalIpAddresses() {
  const interfaces = os.networkInterfaces();
  const ips = [];
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        ips.push(net.address);
      }
    }
  }
  return ips.length > 0 ? ips : ['127.0.0.1'];
}

app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  // Allow framing ONLY on the OBS overlay route so OBS browser sources load correctly
  if (!req.path.startsWith('/overlay')) {
    res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  }
  next();
});

app.use(cors());
app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(UPLOADS_DIR));

// Synchronize registered accounts pairing PINs
try {
  auth.getAllAccounts().forEach((u) => {
    if (u.pairingPin && u.streamerKey) {
      pairingCodeToStreamId.set(String(u.pairingPin).toLowerCase(), u.streamerKey);
    }
  });
} catch (_) {}

if (wss) {
  wss.on('connection', (ws, req) => {
    const parsed = url.parse(req.url, true);
    let rawId = parsed.query.code || parsed.query.stream || parsed.query.streamer || parsed.query.channel;

    // Support secure authenticated token in WS query
    if (parsed.query.token) {
      const verified = auth.verifyToken(parsed.query.token);
      if (verified && verified.streamerKey) {
        rawId = verified.streamerKey;
      }
    }

    if (!rawId || String(rawId).trim().length === 0 || String(rawId).trim().toLowerCase() === 'default') {
      rawId = String(Math.floor(100000 + Math.random() * 900000));
    }
    const streamId = resolveStreamId(rawId);
    ws.streamId = streamId;

    const { session } = getSession(streamId);

    ws.send(JSON.stringify({
      type: 'INIT',
      data: {
        streamId,
        pairingCode: session.pairingCode,
        accountName: session.accountName || streamId,
        stats: getSummaryStats(session.history),
        settings: session.settings,
        subscription: session.subscription || { plan: 'pro_trial', status: 'active', tierName: 'Creator Pro' },
        recent: session.history.slice(-20).reverse()
      }
    }));

    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) ws.ping();
    }, 25000);

    ws.on('close', () => clearInterval(pingInterval));
  });
}

// ==========================================
// User Authentication Endpoints (Real scrypt)
// ==========================================
app.post('/api/auth/register', (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const regRecord = registerRateLimits.get(ip) || { count: 0, resetAt: now + 3600000 };
  if (now > regRecord.resetAt) {
    regRecord.count = 0;
    regRecord.resetAt = now + 3600000;
  }
  regRecord.count++;
  registerRateLimits.set(ip, regRecord);
  if (regRecord.count > 5) {
    return res.status(429).json({ success: false, error: 'Registration limit reached for this IP. Please try again later.' });
  }

  try {
    const { email, password, channelName } = req.body || {};
    const result = auth.register({ email, password, channelName });

    // Automatically bind/create the session file for this creator
    const { session } = getSession(result.user.streamerKey);
    session.accountName = result.user.channelName;
    session.pairingCode = result.user.pairingPin;
    pairingCodeToStreamId.set(String(result.user.pairingPin).toLowerCase(), result.user.streamerKey);
    saveSession(result.user.streamerKey);

    console.log(`[Auth Register] Registered account: ${result.user.email} (Streamer: ${result.user.streamerKey}, PIN: ${result.user.pairingPin})`);
    res.json({ success: true, token: result.token, user: result.user });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/auth/login', (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const rec = loginRateLimits.get(ip) || { count: 0, resetAt: now + 60000 };
  if (now > rec.resetAt) {
    rec.count = 0;
    rec.resetAt = now + 60000;
  }
  rec.count++;
  loginRateLimits.set(ip, rec);
  if (rec.count > 10) {
    return res.status(429).json({ success: false, error: 'Too many login attempts. Please wait 1 minute before retrying.' });
  }

  try {
    const { email, password } = req.body || {};
    const result = auth.login({ email, password });
    rec.count = 0;
    loginRateLimits.set(ip, rec);

    // Ensure pairing code is linked
    pairingCodeToStreamId.set(String(result.user.pairingPin).toLowerCase(), result.user.streamerKey);

    console.log(`[Auth Login] Successful login: ${result.user.email} (Streamer: ${result.user.streamerKey})`);
    res.json({ success: true, token: result.token, user: result.user });
  } catch (err) {
    res.status(401).json({ success: false, error: err.message });
  }
});

app.get('/api/auth/me', (req, res) => {
  const token = extractAuthToken(req);
  if (!token) {
    return res.status(401).json({ success: false, error: 'Authentication required. No session token provided.' });
  }
  const user = auth.verifyToken(token);
  if (!user) {
    return res.status(401).json({ success: false, error: 'Session expired or invalid.' });
  }
  const statelessToken = auth.generateToken ? auth.generateToken({
    id: user.id,
    email: user.email,
    channelName: user.channelName,
    streamerKey: user.streamerKey,
    pairingPin: user.pairingPin,
    exp: Date.now() + (30 * 24 * 60 * 60 * 1000)
  }) : token;
  res.json({ success: true, user, token: statelessToken });
});

app.post('/api/auth/logout', (req, res) => {
  const token = extractAuthToken(req);
  if (token) {
    auth.logout(token);
  }
  res.json({ success: true });
});

// API Routes
app.post('/api/payment', (req, res) => {
  const rawCode = req.query.code || req.query.stream || (req.body && req.body.code);
  const streamId = extractStreamId(req);
  if (!streamId) {
    return res.status(400).json({ success: false, error: 'Valid 6-digit Streamer PIN required. Please enter your code in the app.' });
  }
  const { session } = getSession(streamId);

  // 1. IP Rate Limiting (Max 5 requests in 5 seconds per IP)
  const clientIp = req.headers['cf-connecting-ip'] || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
  console.log(`[Incoming Payment] rawCode="${rawCode}" -> streamId="${streamId}" (IP: ${clientIp}, Amount: ₹${req.body && req.body.amount}, Sender: "${req.body && req.body.senderName}")`);
  const now = Date.now();
  const ipData = ipRateLimits.get(clientIp) || { count: 0, resetAt: now + 5000 };
  if (now > ipData.resetAt) {
    ipData.count = 0;
    ipData.resetAt = now + 5000;
  }
  ipData.count++;
  ipRateLimits.set(clientIp, ipData);
  if (ipData.count > 6) {
    return res.status(429).json({ success: false, error: 'Too many requests. Slow down.' });
  }

  const { appName, amount, senderName, note, timestamp } = req.body;
  if (!amount) return res.status(400).json({ success: false, error: 'Amount required' });

  const cleanAmount = String(amount).replace(/[^0-9.]/g, '');
  const cleanSenderRaw = (senderName && senderName.trim().length > 0 ? senderName.trim() : 'Anonymous Supporter');

  // 2. Duplicate Transaction Guard (8 seconds cooldown)
  const dupKey = `${streamId}_${cleanAmount}_${cleanSenderRaw.toLowerCase()}`;
  const lastTime = recentPaymentHashes.get(dupKey) || 0;
  if (now - lastTime < 8000) {
    console.warn(`[Anti-Spam] Duplicate payment blocked for [${streamId}]: ${dupKey}`);
    return res.json({ success: true, ignored: true, reason: 'Duplicate notification ignored' });
  }
  recentPaymentHashes.set(dupKey, now);

  // 3. Profanity & Message Flood Sanitization + Prefix Removal ("Note: ", "note: ", etc.)
  let cleanSender = sanitizeText(cleanSenderRaw);
  let cleanNote = cleanDonorNote(sanitizeText(note || ''));

  if (session.settings.censorProfanity !== false) {
    cleanSender = filterProfanity(cleanSender);
    if (cleanNote) cleanNote = filterProfanity(cleanNote);
  }

  // 4. Minimum Alert & TTS Threshold Check
  const numericAmount = parseFloat(cleanAmount) || 0;
  const minAlert = parseFloat(session.settings.minAlertAmount) || 1;
  const minTts = parseFloat(session.settings.minTtsAmount) || 1;
  const isBelowMin = numericAmount < minAlert;
  const shouldSpeak = numericAmount >= minTts;

  const record = {
    id: 'pay_' + Date.now(),
    streamId,
    appName: appName || 'UPI',
    amount: cleanAmount,
    senderName: cleanSender,
    note: cleanNote,
    timestamp: timestamp ? parseInt(timestamp, 10) : Date.now(),
    isBelowMin,
    shouldSpeak
  };

  if (session.settings.goalEnabled !== false) {
    session.settings.goalCurrent = (parseFloat(session.settings.goalCurrent) || 0) + (parseFloat(record.amount) || 0);
  }

  session.history.push(record);
  saveSession(streamId);

  console.log(`[Payment][${streamId}] ₹${record.amount} from ${record.senderName} (Min: ₹${minAlert}, BelowMin: ${isBelowMin}, TTS: ${shouldSpeak})`);

  // Only broadcast to stream overlay if meets streamer's minimum alert threshold
  if (!isBelowMin) {
    broadcastToStream(streamId, 'NEW_PAYMENT', record);
  }

  // Broadcast live goal update to goal widgets & dashboard
  broadcastToStream(streamId, 'GOAL_UPDATED', {
    title: session.settings.goalTitle,
    target: session.settings.goalTarget,
    current: session.settings.goalCurrent,
    enabled: session.settings.goalEnabled,
    theme: session.settings.goalTheme || 'default',
    goalTheme: session.settings.goalTheme || 'default',
    goalCustomColors: session.settings.goalCustomColors || null,
    customColors: session.settings.goalCustomColors || null,
    goalTitle: session.settings.goalTitle,
    goalTarget: session.settings.goalTarget,
    goalCurrent: session.settings.goalCurrent,
    goalEnabled: session.settings.goalEnabled
  });

  // Always broadcast to dashboard table so streamer has full audit record
  broadcastToStream(streamId, 'TABLE_UPDATED', record);
  broadcastToStream(streamId, 'STATS_UPDATED', getSummaryStats(session.history));
  sendDiscordAlert(session, record);
  relayToStreamlabs(session, record);
  relayToStreamElements(session, record);

  res.json({ success: true, payment: record, stream: streamId, isBelowMin, shouldSpeak, goalCurrent: session.settings.goalCurrent });
});

app.post('/api/test', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  const { appName, amount, senderName, note, testGoal } = req.body;

  let cleanSender = sanitizeText(senderName || 'Stream Fan');
  let rawNote = (note !== undefined && note !== null && String(note).trim().length > 0) ? String(note) : 'Clutch this 1v3 bro!';
  let cleanNote = cleanDonorNote(sanitizeText(rawNote));
  if (session.settings.censorProfanity !== false) {
    cleanSender = filterProfanity(cleanSender);
    if (cleanNote) cleanNote = filterProfanity(cleanNote);
  }

  const numericAmount = parseFloat(amount || '100') || 100;
  const shouldSpeak = numericAmount >= (parseFloat(session.settings.minTtsAmount) || 1);

  if (session.settings.goalEnabled !== false) {
    session.settings.goalCurrent = (parseFloat(session.settings.goalCurrent) || 0) + numericAmount;
    broadcastToStream(streamId, 'GOAL_UPDATED', {
      title: session.settings.goalTitle,
      target: session.settings.goalTarget,
      current: session.settings.goalCurrent,
      enabled: session.settings.goalEnabled,
      theme: session.settings.goalTheme || 'default',
      goalTheme: session.settings.goalTheme || 'default',
      goalTitle: session.settings.goalTitle,
      goalTarget: session.settings.goalTarget,
      goalCurrent: session.settings.goalCurrent,
      goalEnabled: session.settings.goalEnabled
    });
  }

  const testPayment = {
    id: 'test_' + Date.now(),
    streamId,
    appName: appName || 'PhonePe',
    amount: String(numericAmount),
    senderName: cleanSender,
    note: cleanNote,
    timestamp: Date.now(),
    isTest: true,
    shouldSpeak
  };

  session.history.push(testPayment);
  saveSession(streamId);

  broadcastToStream(streamId, 'NEW_PAYMENT', testPayment);
  broadcastToStream(streamId, 'TABLE_UPDATED', testPayment);
  broadcastToStream(streamId, 'STATS_UPDATED', getSummaryStats(session.history));
  sendDiscordAlert(session, testPayment);
  relayToStreamlabs(session, testPayment);
  relayToStreamElements(session, testPayment);
  res.json({
    success: true,
    payment: testPayment,
    stream: streamId,
    stats: getSummaryStats(session.history),
    goalCurrent: session.settings.goalCurrent
  });
});

app.post('/api/replay', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  const { id } = req.body;
  const payment = session.history.find(p => p.id === id);
  if (!payment) return res.status(404).json({ success: false, error: 'Not found' });
  broadcastToStream(streamId, 'NEW_PAYMENT', { ...payment, isReplay: true, shouldSpeak: true });
  res.json({ success: true });
});

app.get('/api/history', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  res.json({
    streamId,
    stats: getSummaryStats(session.history),
    history: session.history.slice(-50).reverse()
  });
});

app.post('/api/clear', requireStreamerAuth, (req, res) => {
  const streamId = req.streamId || extractStreamId(req);
  const { session } = getSession(streamId);
  session.history = [];
  saveSession(streamId);
  broadcastToStream(streamId, 'STATS_UPDATED', getSummaryStats(session.history));
  broadcastToStream(streamId, 'HISTORY_CLEARED', {});
  res.json({ success: true });
});

app.get('/api/settings', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  res.json(session.settings);
});

app.post('/api/settings', requireStreamerAuth, (req, res) => {
  const streamId = req.streamId || extractStreamId(req);
  const { session } = getSession(streamId);
  const { voiceSpeed, voiceEnabled, voiceLanguage, voicePersona, voicePitch, soundVolume, minAlertAmount, minTtsAmount, censorProfanity, ownVoiceMode, ownVoiceUrl, ownVoiceOriginalName } = req.body;

  if (voiceSpeed !== undefined) session.settings.voiceSpeed = parseFloat(voiceSpeed);
  if (voiceEnabled !== undefined) session.settings.voiceEnabled = Boolean(voiceEnabled);
  if (voiceLanguage !== undefined) session.settings.voiceLanguage = String(voiceLanguage).trim();

  // Custom Voice Persona (Pro Feature)
  if (voicePersona !== undefined) {
    const isPro = session.subscription && (session.subscription.plan === 'pro' || session.subscription.plan === 'pro_trial');
    if (isPro || voicePersona === 'standard') {
      session.settings.voicePersona = String(voicePersona).trim();
    }
  }

  // Custom Voice Pitch
  if (voicePitch !== undefined) {
    session.settings.voicePitch = Math.max(0.60, Math.min(1.60, parseFloat(voicePitch) || 1.0));
  }

  if (ownVoiceMode !== undefined) session.settings.ownVoiceMode = String(ownVoiceMode).trim();
  if (ownVoiceUrl !== undefined) session.settings.ownVoiceUrl = ownVoiceUrl;
  if (ownVoiceOriginalName !== undefined) session.settings.ownVoiceOriginalName = ownVoiceOriginalName;

  if (soundVolume !== undefined) session.settings.soundVolume = parseFloat(soundVolume);
  if (minAlertAmount !== undefined) session.settings.minAlertAmount = Math.max(1, parseFloat(minAlertAmount) || 1);
  if (minTtsAmount !== undefined) session.settings.minTtsAmount = Math.max(1, parseFloat(minTtsAmount) || 1);
  if (censorProfanity !== undefined) session.settings.censorProfanity = Boolean(censorProfanity);

  if (req.body.discordWebhookUrl !== undefined) session.settings.discordWebhookUrl = String(req.body.discordWebhookUrl).trim();
  if (req.body.discordWebhookEnabled !== undefined) session.settings.discordWebhookEnabled = Boolean(req.body.discordWebhookEnabled);

  // Streamlabs & StreamElements Relay (PRO Feature Gated)
  const isProPlan = session.subscription && (session.subscription.plan === 'pro' || session.subscription.plan === 'pro_trial');
  if (req.body.streamlabsEnabled !== undefined) {
    if (isProPlan || !req.body.streamlabsEnabled) {
      session.settings.streamlabsEnabled = Boolean(req.body.streamlabsEnabled);
    }
  }
  if (req.body.streamlabsToken !== undefined) {
    if (isProPlan) session.settings.streamlabsToken = String(req.body.streamlabsToken).trim();
  }
  if (req.body.streamElementsEnabled !== undefined) {
    if (isProPlan || !req.body.streamElementsEnabled) {
      session.settings.streamElementsEnabled = Boolean(req.body.streamElementsEnabled);
    }
  }
  if (req.body.streamElementsToken !== undefined) {
    if (isProPlan) session.settings.streamElementsToken = String(req.body.streamElementsToken).trim();
  }
  if (req.body.streamElementsChannelId !== undefined) {
    if (isProPlan) session.settings.streamElementsChannelId = String(req.body.streamElementsChannelId).trim();
  }

  if (req.body.goalTitle !== undefined && req.body.goalTitle !== null) session.settings.goalTitle = String(req.body.goalTitle).trim();
  if (req.body.goalTarget !== undefined && req.body.goalTarget !== null && !isNaN(parseFloat(req.body.goalTarget))) {
    session.settings.goalTarget = Math.max(1, parseFloat(req.body.goalTarget));
  }
  if (req.body.goalCurrentManuallySet === true && req.body.goalCurrent !== undefined && !isNaN(parseFloat(req.body.goalCurrent))) {
    session.settings.goalCurrent = Math.max(0, parseFloat(req.body.goalCurrent));
  } else if (req.body.goalCurrent !== undefined && req.body.goalCurrent !== null && !isNaN(parseFloat(req.body.goalCurrent))) {
    const candidateCurrent = Math.max(0, parseFloat(req.body.goalCurrent));
    if (candidateCurrent > (parseFloat(session.settings.goalCurrent) || 0)) {
      session.settings.goalCurrent = candidateCurrent;
    }
  }
  if (req.body.goalTheme !== undefined && req.body.goalTheme !== null) session.settings.goalTheme = String(req.body.goalTheme).trim();
  if (req.body.goalCustomColors !== undefined && typeof req.body.goalCustomColors === 'object') {
    session.settings.goalCustomColors = {
      barStart: String(req.body.goalCustomColors.barStart || '#00f0ff'),
      barEnd: String(req.body.goalCustomColors.barEnd || '#ec4899'),
      glow: String(req.body.goalCustomColors.glow || '#00f0ff'),
      text: String(req.body.goalCustomColors.text || '#00f0ff')
    };
  }
  if (req.body.goalEnabled !== undefined) session.settings.goalEnabled = Boolean(req.body.goalEnabled);

  saveSession(streamId);
  broadcastToStream(streamId, 'SETTINGS_UPDATED', session.settings);
  broadcastToStream(streamId, 'GOAL_UPDATED', {
    title: session.settings.goalTitle,
    target: session.settings.goalTarget,
    current: session.settings.goalCurrent,
    enabled: session.settings.goalEnabled,
    theme: session.settings.goalTheme || 'default',
    goalTheme: session.settings.goalTheme || 'default',
    goalCustomColors: session.settings.goalCustomColors || null,
    customColors: session.settings.goalCustomColors || null,
    goalTitle: session.settings.goalTitle,
    goalTarget: session.settings.goalTarget,
    goalCurrent: session.settings.goalCurrent,
    goalEnabled: session.settings.goalEnabled
  });
  res.json({ success: true, settings: session.settings });
});

// Dedicated Goal Endpoints for OBS & Dashboard
app.get('/api/goal', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  const isPro = session.subscription && (
    session.subscription.plan === 'pro' || 
    session.subscription.plan === 'pro_trial' || 
    (session.subscription.features && session.subscription.features.goalBars)
  );

  res.json({
    streamId,
    isPro: Boolean(isPro),
    plan: session.subscription ? session.subscription.plan : 'free',
    tierName: session.subscription ? session.subscription.tierName : 'Creator Free',
    goal: {
      title: session.settings.goalTitle || 'Live Stream Goal',
      target: parseFloat(session.settings.goalTarget) || 1000,
      current: parseFloat(session.settings.goalCurrent) || 0,
      theme: session.settings.goalTheme || 'default',
      goalTheme: session.settings.goalTheme || 'default',
      goalCustomColors: session.settings.goalCustomColors || null,
      customColors: session.settings.goalCustomColors || null,
      enabled: session.settings.goalEnabled !== false
    }
  });
});

app.post('/api/goal/reset', requireStreamerAuth, (req, res) => {
  const streamId = req.streamId || extractStreamId(req);
  const { session } = getSession(streamId);
  session.settings.goalCurrent = 0;
  saveSession(streamId);
  broadcastToStream(streamId, 'GOAL_UPDATED', {
    title: session.settings.goalTitle,
    target: session.settings.goalTarget,
    current: 0,
    enabled: session.settings.goalEnabled,
    theme: session.settings.goalTheme || 'default',
    goalTheme: session.settings.goalTheme || 'default',
    goalCustomColors: session.settings.goalCustomColors || null,
    customColors: session.settings.goalCustomColors || null,
    goalTitle: session.settings.goalTitle,
    goalTarget: session.settings.goalTarget,
    goalCurrent: 0,
    goalEnabled: session.settings.goalEnabled
  });
  broadcastToStream(streamId, 'SETTINGS_UPDATED', session.settings);
  res.json({ success: true, goalCurrent: 0, settings: session.settings });
});

app.post('/api/goal/bump', requireStreamerAuth, (req, res) => {
  const streamId = req.streamId || extractStreamId(req);
  const { session } = getSession(streamId);
  const amount = parseFloat(req.body.amount || 100) || 100;
  session.settings.goalCurrent = (parseFloat(session.settings.goalCurrent) || 0) + amount;
  saveSession(streamId);
  broadcastToStream(streamId, 'GOAL_UPDATED', {
    title: session.settings.goalTitle,
    target: session.settings.goalTarget,
    current: session.settings.goalCurrent,
    enabled: session.settings.goalEnabled,
    theme: session.settings.goalTheme || 'default',
    goalTheme: session.settings.goalTheme || 'default',
    goalCustomColors: session.settings.goalCustomColors || null,
    customColors: session.settings.goalCustomColors || null,
    goalTitle: session.settings.goalTitle,
    goalTarget: session.settings.goalTarget,
    goalCurrent: session.settings.goalCurrent,
    goalEnabled: session.settings.goalEnabled
  });
  broadcastToStream(streamId, 'SETTINGS_UPDATED', session.settings);
  res.json({ success: true, goalCurrent: session.settings.goalCurrent, settings: session.settings });
});

app.post('/api/goal/update', requireStreamerAuth, (req, res) => {
  const streamId = req.streamId || extractStreamId(req);
  const { session } = getSession(streamId);
  const { title, target, current, enabled, theme, customColors, manuallySetCurrent } = req.body;

  if (title !== undefined && title !== null) session.settings.goalTitle = String(title).trim();
  if (target !== undefined && target !== null && !isNaN(parseFloat(target))) {
    session.settings.goalTarget = Math.max(1, parseFloat(target));
  }
  if (manuallySetCurrent === true && current !== undefined && !isNaN(parseFloat(current))) {
    session.settings.goalCurrent = Math.max(0, parseFloat(current));
  } else if (current !== undefined && !isNaN(parseFloat(current))) {
    const candidateCurrent = Math.max(0, parseFloat(current));
    if (candidateCurrent > (parseFloat(session.settings.goalCurrent) || 0)) {
      session.settings.goalCurrent = candidateCurrent;
    }
  }
  if (enabled !== undefined) session.settings.goalEnabled = Boolean(enabled);
  if (theme !== undefined && theme !== null) session.settings.goalTheme = String(theme).trim();
  if (customColors && typeof customColors === 'object') {
    session.settings.goalCustomColors = {
      barStart: String(customColors.barStart || '#00f0ff'),
      barEnd: String(customColors.barEnd || '#ec4899'),
      glow: String(customColors.glow || '#00f0ff'),
      text: String(customColors.text || '#00f0ff')
    };
  }

  saveSession(streamId);
  broadcastToStream(streamId, 'GOAL_UPDATED', {
    title: session.settings.goalTitle,
    target: session.settings.goalTarget,
    current: session.settings.goalCurrent,
    enabled: session.settings.goalEnabled,
    theme: session.settings.goalTheme || 'default',
    goalTheme: session.settings.goalTheme || 'default',
    goalCustomColors: session.settings.goalCustomColors || null,
    customColors: session.settings.goalCustomColors || null,
    goalTitle: session.settings.goalTitle,
    goalTarget: session.settings.goalTarget,
    goalCurrent: session.settings.goalCurrent,
    goalEnabled: session.settings.goalEnabled
  });
  broadcastToStream(streamId, 'SETTINGS_UPDATED', session.settings);
  res.json({ success: true, settings: session.settings, goalCurrent: session.settings.goalCurrent });
});

app.post('/api/test-discord', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  const webhookUrl = (req.body && req.body.webhookUrl) || (session.settings && session.settings.discordWebhookUrl);

  if (!webhookUrl || (!webhookUrl.startsWith('https://discord.com/api/webhooks/') && !webhookUrl.startsWith('https://canary.discord.com/api/webhooks/'))) {
    return res.status(400).json({ success: false, error: 'Please enter a valid Discord Webhook URL (must start with https://discord.com/api/webhooks/...)' });
  }

  const payload = JSON.stringify({
    username: 'DenAlerts Live Bot',
    avatar_url: 'https://alerts.denbooks.in/icon-192.png',
    embeds: [{
      title: '✅ Discord Stream Announcements Linked!',
      description: 'Your stream alerts are now linked to this Discord channel. When live UPI superchats arrive on your stream, they will be posted here automatically!',
      color: 0x10b981,
      fields: [
        { name: 'Streamer / Channel', value: session.accountName || streamId || 'Creator', inline: true },
        { name: 'Status', value: '🟢 Live & Verified', inline: true }
      ],
      footer: { text: 'DenAlerts • SRB STUDIOS' },
      timestamp: new Date().toISOString()
    }]
  });

  try {
    const parsed = new URL(webhookUrl);
    const options = {
      hostname: parsed.hostname,
      path: parsed.pathname + parsed.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    const dReq = https.request(options, (dRes) => {
      let data = '';
      dRes.on('data', c => data += c);
      dRes.on('end', () => {
        if (dRes.statusCode >= 200 && dRes.statusCode < 300) {
          res.json({ success: true, message: 'Test announcement sent to your Discord channel!' });
        } else {
          res.status(400).json({ success: false, error: `Discord rejected webhook (HTTP ${dRes.statusCode})` });
        }
      });
    });

    dReq.on('error', (e) => {
      res.status(500).json({ success: false, error: 'Could not connect to Discord: ' + e.message });
    });
    dReq.write(payload);
    dReq.end();
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

app.post('/api/test-streamlabs', requireStreamerAuth, (req, res) => {
  const streamId = req.streamId || extractStreamId(req);
  const { session } = getSession(streamId);
  const isPro = session.subscription && (session.subscription.plan === 'pro' || session.subscription.plan === 'pro_trial');
  if (!isPro) {
    return res.status(403).json({ success: false, error: 'PRO_REQUIRED', message: 'Streamlabs Event Relay is an exclusive Creator Pro feature.' });
  }

  const token = (req.body && req.body.token) || (session.settings && session.settings.streamlabsToken);
  if (!token) {
    return res.status(400).json({ success: false, error: 'Please enter your Streamlabs API Socket Token or Access Token.' });
  }

  const payload = JSON.stringify({
    name: 'DenAlerts Test',
    identifier: 'test@upi',
    amount: 100,
    currency: 'INR',
    message: 'Testing Streamlabs Relay from DenAlerts!'
  });

  const options = {
    hostname: 'streamlabs.com',
    path: '/api/v1.0/donations',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.trim()}`,
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const slReq = https.request(options, (slRes) => {
    let data = '';
    slRes.on('data', c => data += c);
    slRes.on('end', () => {
      if (slRes.statusCode >= 200 && slRes.statusCode < 300) {
        res.json({ success: true, message: 'Test alert forwarded to your Streamlabs setup!' });
      } else {
        res.status(400).json({ success: false, error: `Streamlabs returned HTTP ${slRes.statusCode}: ${data.slice(0, 120)}` });
      }
    });
  });

  slReq.on('error', (e) => {
    res.status(500).json({ success: false, error: 'Could not connect to Streamlabs: ' + e.message });
  });
  slReq.write(payload);
  slReq.end();
});

app.post('/api/test-streamelements', requireStreamerAuth, (req, res) => {
  const streamId = req.streamId || extractStreamId(req);
  const { session } = getSession(streamId);
  const isPro = session.subscription && (session.subscription.plan === 'pro' || session.subscription.plan === 'pro_trial');
  if (!isPro) {
    return res.status(403).json({ success: false, error: 'PRO_REQUIRED', message: 'StreamElements Event Relay is an exclusive Creator Pro feature.' });
  }

  const token = (req.body && req.body.token) || (session.settings && session.settings.streamElementsToken);
  const channel = (req.body && req.body.channelId) || (session.settings && session.settings.streamElementsChannelId);
  if (!token || !channel) {
    return res.status(400).json({ success: false, error: 'Please enter both your StreamElements Channel ID and JWT Token.' });
  }

  const payload = JSON.stringify({
    user: {
      username: 'DenAlerts Test'
    },
    donation: {
      amount: 100,
      message: 'Testing StreamElements Relay from DenAlerts!',
      currency: 'INR'
    }
  });

  const options = {
    hostname: 'api.streamelements.com',
    path: `/kappa/v2/tips/${encodeURIComponent(channel.trim())}`,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token.trim()}`,
      'Content-Length': Buffer.byteLength(payload)
    }
  };

  const seReq = https.request(options, (seRes) => {
    let data = '';
    seRes.on('data', c => data += c);
    seRes.on('end', () => {
      if (seRes.statusCode >= 200 && seRes.statusCode < 300) {
        res.json({ success: true, message: 'Test alert forwarded to your StreamElements setup!' });
      } else {
        res.status(400).json({ success: false, error: `StreamElements returned HTTP ${seRes.statusCode}: ${data.slice(0, 120)}` });
      }
    });
  });

  seReq.on('error', (e) => {
    res.status(500).json({ success: false, error: 'Could not connect to StreamElements: ' + e.message });
  });
  seReq.write(payload);
  seReq.end();
});

app.post('/api/upload-voice', (req, res) => {
  try {
    const streamId = extractStreamId(req);
    const { session } = getSession(streamId);
    const isPro = session.subscription && (session.subscription.plan === 'pro' || session.subscription.plan === 'pro_trial');
    if (!isPro) {
      return res.status(403).json({ success: false, error: 'Custom Own Voice is a Creator Pro feature' });
    }

    const { audioData, fileName, ownVoiceMode } = req.body;
    if (!audioData) {
      return res.status(400).json({ success: false, error: 'No audio data received' });
    }

    let ext = 'webm';
    let base64Content = audioData;
    let mimeType = 'audio/webm';
    if (audioData.includes(',')) {
      const parts = audioData.split(',');
      const match = parts[0].match(/data:(audio\/[a-zA-Z0-9_-]+);/);
      if (match && match[1]) {
        mimeType = match[1];
        const detected = mimeType.toLowerCase();
        if (detected.includes('wav')) ext = 'wav';
        else if (detected.includes('mp3') || detected.includes('mpeg')) ext = 'mp3';
        else if (detected.includes('ogg')) ext = 'ogg';
        else if (detected.includes('m4a') || detected.includes('mp4')) ext = 'm4a';
        else ext = 'webm';
      }
      base64Content = parts[1];
    } else if (fileName && fileName.includes('.')) {
      ext = fileName.split('.').pop().toLowerCase();
      if (ext === 'wav') mimeType = 'audio/wav';
      else if (ext === 'mp3') mimeType = 'audio/mpeg';
      else if (ext === 'ogg') mimeType = 'audio/ogg';
    }

    // Direct Data URL guarantees 100% immediate playback on any browser, OBS, or serverless container
    let publicUrl = `data:${mimeType};base64,${base64Content}`;

    // Also attempt disk write safely if running on persistent server or tmpdir
    try {
      if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      const targetFileName = `own_voice_${streamId}.${ext}`;
      fs.writeFileSync(path.join(UPLOADS_DIR, targetFileName), Buffer.from(base64Content, 'base64'));
      if (!IS_VERCEL) {
        publicUrl = `/uploads/${targetFileName}?v=${Date.now()}`;
      }
    } catch (e) {
      console.warn('[Upload Voice] File disk write skipped, using Data URL:', e.message);
    }

    session.settings.voicePersona = 'own_voice';
    session.settings.ownVoiceUrl = publicUrl;
    session.settings.ownVoiceMode = ownVoiceMode || session.settings.ownVoiceMode || 'intro';
    session.settings.ownVoiceOriginalName = fileName || 'My Voice Recording';
    saveSession(streamId);

    broadcastToStream(streamId, 'SETTINGS_UPDATED', session.settings);
    res.json({
      success: true,
      url: publicUrl,
      settings: session.settings
    });
  } catch (err) {
    console.error('[Upload Voice Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reset-voice', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  session.settings.voicePersona = 'standard';
  session.settings.ownVoiceUrl = null;
  session.settings.ownVoiceOriginalName = null;
  saveSession(streamId);
  broadcastToStream(streamId, 'SETTINGS_UPDATED', session.settings);
  res.json({ success: true, settings: session.settings });
});

app.post('/api/upload-media', (req, res) => {
  try {
    const streamId = extractStreamId(req);
    const { session } = getSession(streamId);
    const isPro = session.subscription && (session.subscription.plan === 'pro' || session.subscription.plan === 'pro_trial');
    if (!isPro) {
      return res.status(403).json({ success: false, error: 'Custom Sound, GIF & Video Memes is a Creator Pro feature' });
    }

    const { mediaCategory, fileData, fileName, mediaUrl, mediaName } = req.body;

    if (mediaCategory === 'sound') {
      if (mediaUrl) {
        session.settings.customAlertSoundUrl = mediaUrl;
        session.settings.customAlertSoundName = mediaName || 'Preset Sound';
      } else if (fileData) {
        let ext = 'mp3';
        let base64Content = fileData;
        let mimeType = 'audio/mpeg';
        if (fileData.includes(',')) {
          const parts = fileData.split(',');
          const match = parts[0].match(/data:(audio\/[a-zA-Z0-9_-]+);/);
          if (match && match[1]) {
            mimeType = match[1];
            const detected = mimeType.toLowerCase();
            if (detected.includes('wav')) ext = 'wav';
            else if (detected.includes('ogg')) ext = 'ogg';
            else if (detected.includes('m4a') || detected.includes('mp4')) ext = 'm4a';
            else ext = 'mp3';
          }
          base64Content = parts[1];
        } else if (fileName && fileName.includes('.')) {
          ext = fileName.split('.').pop().toLowerCase();
          if (ext === 'wav') mimeType = 'audio/wav';
        }
        let soundUrl = `data:${mimeType};base64,${base64Content}`;
        try {
          if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          const targetFileName = `alert_sound_${streamId}_${Date.now()}.${ext}`;
          fs.writeFileSync(path.join(UPLOADS_DIR, targetFileName), Buffer.from(base64Content, 'base64'));
          if (!IS_VERCEL) soundUrl = `/uploads/${targetFileName}`;
        } catch (e) {
          console.warn('[Upload Sound] Disk write skipped, using Data URL:', e.message);
        }
        session.settings.customAlertSoundUrl = soundUrl;
        session.settings.customAlertSoundName = fileName || 'Uploaded Audio';
      } else {
        return res.status(400).json({ success: false, error: 'No audio data or URL provided' });
      }
    } else if (mediaCategory === 'visual') {
      if (mediaUrl) {
        session.settings.customMediaUrl = mediaUrl;
        const lowerUrl = mediaUrl.toLowerCase();
        if (lowerUrl.includes('.mp4') || lowerUrl.includes('.webm')) {
          session.settings.customMediaType = 'video';
        } else if (lowerUrl.includes('.gif') || lowerUrl.includes('giphy') || lowerUrl.includes('tenor')) {
          session.settings.customMediaType = 'gif';
        } else {
          session.settings.customMediaType = 'image';
        }
        session.settings.customMediaName = mediaName || 'Preset Visual';
      } else if (fileData) {
        let ext = 'gif';
        let type = 'image';
        let base64Content = fileData;
        let mimeType = 'image/gif';
        if (fileData.includes(',')) {
          const parts = fileData.split(',');
          const match = parts[0].match(/data:(image|video)\/([a-zA-Z0-9_-]+);/);
          if (match) {
            const mainType = match[1];
            const subType = match[2].toLowerCase();
            mimeType = `${mainType}/${subType}`;
            if (mainType === 'video' || subType.includes('mp4') || subType.includes('webm')) {
              type = 'video';
              ext = subType.includes('webm') ? 'webm' : 'mp4';
            } else if (subType.includes('gif')) {
              type = 'gif';
              ext = 'gif';
            } else {
              type = 'image';
              ext = subType.includes('png') ? 'png' : (subType.includes('webp') ? 'webp' : 'jpg');
            }
          }
          base64Content = parts[1];
        } else if (fileName && fileName.includes('.')) {
          ext = fileName.split('.').pop().toLowerCase();
          if (ext === 'mp4' || ext === 'webm') type = 'video';
          else if (ext === 'gif') type = 'gif';
          else type = 'image';
        }
        let visualUrl = `data:${mimeType};base64,${base64Content}`;
        try {
          if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
          const targetFileName = `alert_visual_${streamId}_${Date.now()}.${ext}`;
          fs.writeFileSync(path.join(UPLOADS_DIR, targetFileName), Buffer.from(base64Content, 'base64'));
          if (!IS_VERCEL) visualUrl = `/uploads/${targetFileName}`;
        } catch (e) {
          console.warn('[Upload Visual] Disk write skipped, using Data URL:', e.message);
        }
        session.settings.customMediaUrl = visualUrl;
        session.settings.customMediaType = type;
        session.settings.customMediaName = fileName || 'Uploaded Meme';
      } else {
        return res.status(400).json({ success: false, error: 'No visual file data or URL provided' });
      }
    } else {
      return res.status(400).json({ success: false, error: 'Invalid mediaCategory. Must be sound or visual.' });
    }

    saveSession(streamId);
    broadcastToStream(streamId, 'SETTINGS_UPDATED', session.settings);
    res.json({ success: true, settings: session.settings });
  } catch (err) {
    console.error('[Upload Media Error]', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/reset-media', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  const { target } = req.body || {};
  if (!target || target === 'sound' || target === 'all') {
    session.settings.customAlertSoundUrl = null;
    session.settings.customAlertSoundName = 'Default Chime';
  }
  if (!target || target === 'visual' || target === 'all') {
    session.settings.customMediaUrl = null;
    session.settings.customMediaType = null;
    session.settings.customMediaName = 'Default Pulse';
  }
  saveSession(streamId);
  broadcastToStream(streamId, 'SETTINGS_UPDATED', session.settings);
  res.json({ success: true, settings: session.settings });
});

app.get('/api/info', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  const localIps = getLocalIpAddresses();
  let streamClientCount = 0;
  if (wss && wss.clients) {
    wss.clients.forEach((c) => {
      if (c.streamId === streamId) streamClientCount++;
    });
  }
  const rawCode = req.query.code || session.pairingCode || streamId;
  const host = req.headers['x-forwarded-host'] || req.headers.host || `localhost:${PORT}`;
  const proto = req.headers['x-forwarded-proto'] || (req.secure ? 'https' : 'http');
  const isCloud = !host.includes('localhost') && !host.includes('127.0.0.1') && !host.includes('192.168.');

  res.json({
    status: 'ok',
    port: PORT,
    streamId: rawCode,
    account: streamId,
    pairingCode: session.pairingCode || getDeterministicPin(streamId),
    streamClients: streamClientCount,
    serverUrl: isCloud ? `${proto}://${host}` : `http://${localIps[0]}:${PORT}`,
    endpoint: isCloud ? `${proto}://${host}/api/payment?code=${session.pairingCode || streamId}` : `http://${localIps[0]}:${PORT}/api/payment?code=${session.pairingCode || streamId}`,
    cloudUrl: isCloud ? `${proto}://${host}` : null,
    localIps,
    connectedClients: (wss && wss.clients) ? wss.clients.size : 0,
    activeStreamIds: (wss && wss.clients) ? Array.from(wss.clients).map(c => c.streamId) : []
  });
});

app.get('/api/subscription', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  res.json({
    streamId,
    subscription: session.subscription || { plan: 'free', status: 'active', tierName: 'Creator Free' }
  });
});

app.post('/api/subscription/upgrade', (req, res) => {
  const streamId = extractStreamId(req);
  const { session } = getSession(streamId);
  const { plan } = req.body; // 'pro' | 'pro_trial' | 'free'

  const isPaidPro = plan === 'pro';
  const isTrial = plan === 'pro_trial';
  session.subscription = {
    plan: plan,
    status: 'active',
    tierName: isPaidPro ? 'Creator Pro (Paid)' : (isTrial ? 'Creator Pro (Trial)' : 'Creator Free'),
    updatedAt: Date.now(),
    features: {
      watermark: !isPaidPro, // Watermark enabled for Trial & Free Version; disabled for paid Pro
      customAudio: isPaidPro || isTrial,
      aiVoiceTts: isPaidPro || isTrial,
      discordWebhook: isPaidPro || isTrial,
      goalBars: isPaidPro || isTrial,
      zeroCommission: true
    }
  };

  saveSession(streamId);
  broadcastToStream(streamId, 'SUBSCRIPTION_UPDATED', session.subscription);
  res.json({ success: true, subscription: session.subscription });
});

// Live UPI QR Checkout Info for Creator Pro (₹99/month)
app.get('/api/subscription/checkout-info', (req, res) => {
  const streamId = extractStreamId(req);
  const upiId = process.env.ADMIN_UPI_ID || 'srbstudiosofficial@okaxis';
  const payeeName = process.env.ADMIN_PAYEE_NAME || 'SRB Studios';
  const amount = 99.00;
  const orderId = 'PRO_' + Date.now().toString(36).toUpperCase();
  const upiUri = `upi://pay?pa=${encodeURIComponent(upiId)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('DenAlerts Pro Pass (' + (streamId || 'Creator') + ')')}&tr=${orderId}`;

  res.json({
    success: true,
    upiId,
    payeeName,
    amount,
    currency: 'INR',
    orderId,
    upiUri,
    note: `DenAlerts Pro Pass (30 Days)`
  });
});

// Submit UPI Payment (UTR Verification & Pro Activation)
app.post('/api/subscription/submit-payment', (req, res) => {
  const streamId = extractStreamId(req);
  if (!streamId) {
    return res.status(400).json({ success: false, error: 'Creator streamId required' });
  }

  const { utr, orderId, appName } = req.body || {};
  const cleanUtr = String(utr || '').replace(/[^a-zA-Z0-9]/g, '').trim();

  if (cleanUtr.length < 6) {
    return res.status(400).json({ success: false, error: 'Please enter a valid 12-digit UPI Reference / UTR Number from your payment app.' });
  }

  const { session } = getSession(streamId);
  const now = Date.now();
  const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000;
  const newExpiry = (session.subscription && session.subscription.expiresAt && session.subscription.expiresAt > now && session.subscription.plan === 'pro')
    ? (session.subscription.expiresAt + thirtyDaysMs)
    : (now + thirtyDaysMs);

  session.subscription = {
    plan: 'pro',
    status: 'active',
    tierName: 'Creator Pro (Paid)',
    startedAt: now,
    expiresAt: newExpiry,
    updatedAt: now,
    lastPayment: {
      utr: cleanUtr,
      orderId: orderId || ('ORD_' + Date.now()),
      amount: 99,
      appName: appName || 'UPI',
      paidAt: now
    },
    features: {
      watermark: false, // Paid Pro has zero watermark
      customAudio: true,
      aiVoiceTts: true,
      discordWebhook: true,
      goalBars: true,
      zeroCommission: true
    }
  };

  saveSession(streamId);
  broadcastToStream(streamId, 'SUBSCRIPTION_UPDATED', session.subscription);

  console.log(`[Subscription Paid] Creator [${streamId}] upgraded to Creator Pro (30 Days) via UPI (UTR: ${cleanUtr})`);

  res.json({
    success: true,
    message: '🎉 Congratulations! Your Creator Pro pass is now activated for 30 days.',
    subscription: session.subscription
  });
});

const ttsCache = new Map();

function splitTextForTTS(text, maxLen = 170) {
  if (text.length <= maxLen) return [text];

  // Try splitting along natural sentence ends (. ! ?)
  const sentences = text.match(/[^.!?]+[.!?]+|[^.!?]+$/g) || [text];
  const chunks = [];
  let current = '';

  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    if ((current + ' ' + trimmed).trim().length <= maxLen) {
      current = (current + ' ' + trimmed).trim();
    } else {
      if (current) chunks.push(current);
      if (trimmed.length <= maxLen) {
        current = trimmed;
      } else {
        // Fallback: split along commas or words
        const words = trimmed.split(/\s+/);
        let sub = '';
        for (const w of words) {
          if ((sub + ' ' + w).trim().length <= maxLen) {
            sub = (sub + ' ' + w).trim();
          } else {
            if (sub) chunks.push(sub);
            sub = w;
          }
        }
        current = sub;
      }
    }
  }
  if (current) chunks.push(current);
  return chunks.length > 0 ? chunks : [text];
}

function fetchSingleTTSChunk(chunk, lang, retries = 3) {
  return new Promise((resolve, reject) => {
    function attempt(remaining) {
      const encoded = encodeURIComponent(chunk);
      const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=${encodeURIComponent(lang)}&client=tw-ob&q=${encoded}`;
      const req = https.get(ttsUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        },
        timeout: 8000
      }, (ttsRes) => {
        if (ttsRes.statusCode !== 200) {
          if (remaining > 1) {
            return setTimeout(() => attempt(remaining - 1), 500);
          }
          return reject(new Error(`TTS upstream error: ${ttsRes.statusCode}`));
        }
        const data = [];
        ttsRes.on('data', c => data.push(c));
        ttsRes.on('end', () => resolve(Buffer.concat(data)));
      });

      req.on('error', (err) => {
        if (remaining > 1) {
          setTimeout(() => attempt(remaining - 1), 600);
        } else {
          reject(err);
        }
      });

      req.on('timeout', () => {
        req.destroy();
        if (remaining > 1) {
          setTimeout(() => attempt(remaining - 1), 600);
        } else {
          reject(new Error('TTS request timed out'));
        }
      });
    }

    attempt(retries);
  });
}

app.get('/api/tts', async (req, res) => {
  const ip = getClientIp(req);
  const now = Date.now();
  const rec = ttsRateLimits.get(ip) || { count: 0, resetAt: now + 60000 };
  if (now > rec.resetAt) {
    rec.count = 0;
    rec.resetAt = now + 60000;
  }
  rec.count++;
  ttsRateLimits.set(ip, rec);
  if (rec.count > 45) {
    return res.status(429).send('Too many TTS requests. Please slow down.');
  }

  let text = (req.query.text || '').trim();
  const lang = (req.query.lang || 'en-IN').trim();
  if (!text) return res.status(400).send('No text provided');

  // Strip rupee symbols (words like "rupees" are already used in templates), quotes, brackets, and emojis
  text = text
    .replace(/[₹]/g, '')
    .replace(/[\(\)\[\]\{\}\"\'\`]/g, '')
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (text.length > 250) {
    text = text.substring(0, 250);
  }

  const cacheKey = `${lang}:${text}`;
  if (ttsCache.has(cacheKey)) {
    const cached = ttsCache.get(cacheKey);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    return res.send(cached);
  }

  try {
    const chunks = splitTextForTTS(text, 170);
    const audioBuffers = [];
    for (const chunk of chunks) {
      const buf = await fetchSingleTTSChunk(chunk, lang);
      audioBuffers.push(buf);
    }
    const finalMp3 = Buffer.concat(audioBuffers);
    ttsCache.set(cacheKey, finalMp3);
    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(finalMp3);
  } catch (err) {
    console.error('TTS generation error:', err.message);
    res.status(500).send('TTS error: ' + err.message);
  }
});

// ===================================================
// MASTER ADMIN PORTAL API (SRB STUDIOS)
// ===================================================
const ADMIN_KEY = process.env.ADMIN_SECRET_KEY || process.env.ADMIN_KEY || 'srb2026';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'srbstudiosofficial@gmail.com';

function requireAdmin(req, res, next) {
  const ip = getClientIp(req);
  const now = Date.now();
  const blockRecord = adminRateLimits.get(ip) || { failed: 0, lockedUntil: 0 };
  if (now < blockRecord.lockedUntil) {
    const waitSec = Math.ceil((blockRecord.lockedUntil - now) / 1000);
    return res.status(429).json({ success: false, error: `Too many failed admin attempts. IP temporarily locked for ${waitSec}s.` });
  }

  // Check if caller possesses valid session token for srbstudiosofficial@gmail.com
  const token = extractAuthToken(req);
  if (token) {
    const user = auth.verifyToken(token);
    if (user && user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) {
      blockRecord.failed = 0;
      adminRateLimits.set(ip, blockRecord);
      return next();
    }
  }

  // Fallback to x-admin-key / query key with timing-safe comparison
  const key = req.headers['x-admin-key'] || req.query.key || (req.body && req.body.key);
  if (key && safeCompare(String(key).trim(), ADMIN_KEY)) {
    blockRecord.failed = 0;
    adminRateLimits.set(ip, blockRecord);
    return next();
  }

  blockRecord.failed = (blockRecord.failed || 0) + 1;
  if (blockRecord.failed >= 5) {
    blockRecord.lockedUntil = now + (15 * 60 * 1000); // Lock for 15 minutes after 5 failures
    console.warn(`[Security Alert] IP ${ip} locked out of admin portal due to repeated failed attempts.`);
  }
  adminRateLimits.set(ip, blockRecord);

  return res.status(401).json({ success: false, error: 'Unauthorized. Admin access restricted.' });
}

app.get('/admin', (req, res) => res.sendFile(path.join(__dirname, 'public', 'admin.html')));

app.get('/api/admin/creators', requireAdmin, (req, res) => {
  try {
    const files = fs.readdirSync(SESSIONS_DIR).filter(f => f.endsWith('.json'));
    const allAccounts = auth.getAllAccounts ? auth.getAllAccounts() : [];
    const accountsMap = new Map();
    allAccounts.forEach(acc => {
      accountsMap.set(acc.streamerKey, acc);
      if (acc.pairingPin) accountsMap.set(acc.pairingPin, acc);
    });

    // Collect all unique streamer IDs from session files + registered accounts
    const streamIdsSet = new Set();
    files.forEach(f => streamIdsSet.add(f.replace('.json', '')));
    allAccounts.forEach(acc => streamIdsSet.add(acc.streamerKey));

    const creators = [];
    let totalRevenue = 0;
    let paidProCount = 0;
    let proTrialCount = 0;
    let freeCount = 0;
    let totalDonationsCount = 0;

    streamIdsSet.forEach(streamId => {
      const { session } = getSession(streamId);
      const stats = getSummaryStats(session.history);
      const sub = session.subscription || { plan: 'free', tierName: 'Creator Free' };
      const acc = accountsMap.get(streamId);

      const now = Date.now();
      let daysRemaining = 0;
      let isExpired = false;

      if (sub.expiresAt) {
        const diffMs = sub.expiresAt - now;
        daysRemaining = Math.max(0, Math.ceil(diffMs / (24 * 60 * 60 * 1000)));
        if (diffMs <= 0 && sub.plan !== 'free') {
          isExpired = true;
        }
      }

      if (sub.plan === 'pro') paidProCount++;
      else if (sub.plan === 'pro_trial') proTrialCount++;
      else freeCount++;

      totalRevenue += stats.totalAmount;
      totalDonationsCount += stats.count;

      creators.push({
        streamId,
        channelName: acc ? acc.channelName : (session.accountName || streamId),
        email: acc ? acc.email : null,
        pairingPin: acc ? acc.pairingPin : (session.pairingCode || '—'),
        createdAt: acc ? acc.createdAt : null,
        plan: sub.plan || 'free',
        tierName: sub.tierName || 'Creator Free',
        status: sub.status || 'active',
        daysRemaining,
        expiresAt: sub.expiresAt,
        watermark: sub.features ? sub.features.watermark !== false : true,
        voicePersona: session.settings.voicePersona || 'standard',
        voiceLanguage: session.settings.voiceLanguage || 'en-IN',
        hasOwnVoice: Boolean(session.settings.ownVoiceUrl),
        stats,
        lastPayment: sub.lastPayment || null,
        lastUpdated: sub.updatedAt || (session.history.length > 0 ? session.history[session.history.length - 1].timestamp : null)
      });
    });

    creators.sort((a, b) => b.stats.totalAmount - a.stats.totalAmount);

    res.json({
      success: true,
      summary: {
        totalCreators: creators.length,
        paidProCount,
        proTrialCount,
        freeCount,
        totalDonationsAmount: totalRevenue,
        totalDonationsCount
      },
      creators
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.post('/api/admin/set-plan', requireAdmin, (req, res) => {
  const { streamId, plan, days } = req.body;
  if (!streamId || !plan) {
    return res.status(400).json({ success: false, error: 'Missing streamId or plan' });
  }

  const safeId = cleanId(streamId);
  const { session } = getSession(safeId);

  const durationDays = parseInt(days, 10) || (plan === 'pro' ? 30 : 14);
  const isPaidPro = plan === 'pro';
  const isTrial = plan === 'pro_trial';

  session.subscription = {
    plan,
    status: 'active',
    tierName: isPaidPro ? 'Creator Pro (Paid)' : (isTrial ? 'Creator Pro (Trial)' : 'Creator Free'),
    startedAt: Date.now(),
    expiresAt: plan === 'free' ? null : (Date.now() + durationDays * 24 * 60 * 60 * 1000),
    updatedAt: Date.now(),
    features: {
      watermark: !isPaidPro,
      customAudio: isPaidPro || isTrial,
      aiVoiceTts: isPaidPro || isTrial,
      discordWebhook: isPaidPro || isTrial,
      goalBars: isPaidPro || isTrial,
      zeroCommission: true
    }
  };

  saveSession(safeId);
  broadcastToStream(safeId, 'SUBSCRIPTION_UPDATED', session.subscription);
  res.json({ success: true, streamId: safeId, subscription: session.subscription });
});

app.post('/api/admin/delete-creator', requireAdmin, (req, res) => {
  const { streamId } = req.body;
  if (!streamId) return res.status(400).json({ success: false, error: 'Missing streamId' });
  const safeId = cleanId(streamId);
  const file = path.join(SESSIONS_DIR, `${safeId}.json`);
  if (fs.existsSync(file)) {
    fs.unlinkSync(file);
  }
  sessions.delete(safeId);
  if (auth.deleteAccount) {
    auth.deleteAccount(safeId);
  }
  res.json({ success: true, deleted: safeId });
});

app.get('/robots.txt', (req, res) => res.sendFile(path.join(__dirname, 'public', 'robots.txt')));
app.get('/sitemap.xml', (req, res) => {
  res.type('application/xml');
  res.sendFile(path.join(__dirname, 'public', 'sitemap.xml'));
});
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));
app.get('/login', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get('/sign-in', (req, res) => res.sendFile(path.join(__dirname, 'public', 'login.html')));
app.get([
  '/dashboard',
  '/dashboard/:section',
  '/dashboard/*',
  '/simulator',
  '/voice',
  '/media',
  '/goal-settings',
  '/integrations',
  '/guide'
], (req, res) => res.sendFile(path.join(__dirname, 'public', 'dashboard.html')));
app.get('/overlay', (req, res) => res.sendFile(path.join(__dirname, 'public', 'overlay.html')));
app.get('/goal', (req, res) => res.sendFile(path.join(__dirname, 'public', 'goal.html')));
app.get('/tutorial', (req, res) => res.sendFile(path.join(__dirname, 'public', 'tutorial.html')));
app.get('/terms', (req, res) => res.sendFile(path.join(__dirname, 'public', 'terms.html')));
app.get('/terms-of-service', (req, res) => res.sendFile(path.join(__dirname, 'public', 'terms.html')));
app.get('/privacy', (req, res) => res.sendFile(path.join(__dirname, 'public', 'privacy.html')));
app.get('/privacy-policy', (req, res) => res.sendFile(path.join(__dirname, 'public', 'privacy.html')));
app.get('/refund-and-cancellation', (req, res) => res.sendFile(path.join(__dirname, 'public', 'refund-and-cancellation.html')));
app.get('/refund', (req, res) => res.sendFile(path.join(__dirname, 'public', 'refund-and-cancellation.html')));

// Polling fallback endpoint for environments without persistent WebSockets (e.g. Vercel Serverless or proxy firewalls)
app.get('/api/poll-alerts', (req, res) => {
  const streamId = resolveStreamId(req.query.code || req.query.token);
  const { session } = getSession(streamId);
  const since = parseInt(req.query.since || '0', 10);

  const alerts = (session.history || []).filter(item => (item.timestamp || 0) > since);
  res.json({
    success: true,
    streamId,
    alerts,
    history: (session.history || []).slice(-50).reverse(),
    stats: getSummaryStats(session.history || []),
    settings: session.settings,
    serverTime: Date.now()
  });
});

if (require.main === module && !process.env.VERCEL) {
  server.listen(PORT, () => {
    console.log('========================================================');
    console.log('   🔴 LIVE STREAM UPI ALERTS RUNNING                   ');
    console.log('========================================================');
    console.log(` > Dashboard:      http://localhost:${PORT}/dashboard`);
    console.log(` > Stream Overlay: http://localhost:${PORT}/overlay`);
    console.log(` > Goal Widget:    http://localhost:${PORT}/goal`);
    console.log(` > Master Admin:   http://localhost:${PORT}/admin`);
    console.log('========================================================');
  });
}

module.exports = app;
