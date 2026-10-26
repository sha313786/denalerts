const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const os = require('os');

const IS_VERCEL = !!process.env.VERCEL;
const DATA_DIR = IS_VERCEL ? path.join(os.tmpdir(), 'denalerts_data') : path.join(__dirname, 'data');
const BUNDLED_ACCOUNTS_FILE = path.join(__dirname, 'data', 'accounts.json');
const ACCOUNTS_FILE = path.join(DATA_DIR, 'accounts.json');

// Ensure data directory exists safely
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
} catch (e) {
  console.warn('[Auth] Warning creating data dir:', e.message);
}

// In-memory accounts cache
let accounts = [];

function loadAccounts() {
  try {
    if (fs.existsSync(ACCOUNTS_FILE)) {
      accounts = JSON.parse(fs.readFileSync(ACCOUNTS_FILE, 'utf-8'));
    } else if (fs.existsSync(BUNDLED_ACCOUNTS_FILE)) {
      accounts = JSON.parse(fs.readFileSync(BUNDLED_ACCOUNTS_FILE, 'utf-8'));
      saveAccounts();
    } else {
      accounts = [];
      saveAccounts();
    }
  } catch (err) {
    console.error('[Auth] Error reading accounts file:', err.message);
    accounts = [];
  }
}

function saveAccounts() {
  try {
    fs.writeFileSync(ACCOUNTS_FILE, JSON.stringify(accounts, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Auth] Error writing accounts file:', err.message);
  }
}

loadAccounts();

const AUTH_SECRET = process.env.ADMIN_SECRET_KEY || 'srb_denalerts_auth_secret_2026_supersecure';

/**
 * Generate 6-digit numeric pairing PIN (e.g. 482910)
 */
function generatePairingPin() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/**
 * Generate cryptographically signed stateless session token (HMAC-SHA256)
 */
function generateToken(payload = null) {
  if (!payload) {
    return 'dat_' + crypto.randomBytes(32).toString('hex');
  }
  const payloadStr = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('base64url');
  return `dat_${payloadStr}.${signature}`;
}

/**
 * Hash password with per-user salt using scrypt
 */
function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}

/**
 * Verify password against salt + hash
 */
function verifyPassword(password, salt, storedHash) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(storedHash, 'hex'));
}

/**
 * Clean & normalize channel/streamer name into a safe alphanumeric key
 */
function sanitizeId(name) {
  return String(name || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9_]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '') || 'streamer';
}

/**
 * Register a new user account
 */
function register({ email, password, channelName, defaultUpiId, preferredLang }) {
  if (!email || !password || !channelName) {
    throw new Error('Email, password, and channel name are required.');
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanName = String(channelName).trim();

  // Basic email validation
  if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
    throw new Error('Please enter a valid email address.');
  }

  if (password.length < 6) {
    throw new Error('Password must be at least 6 characters long.');
  }

  // Check uniqueness
  if (accounts.some(a => a.email.toLowerCase() === cleanEmail)) {
    throw new Error('An account with this email already exists.');
  }

  // Generate unique streamerKey (channelName sanitized)
  const baseId = sanitizeId(cleanName);
  let streamerKey = baseId;
  let counter = 1;
  while (accounts.some(a => a.streamerKey === streamerKey)) {
    streamerKey = `${baseId}_${counter++}`;
  }

  // Check if session file has a pre-existing pairingCode
  let pairingPin = generatePairingPin();
  const sessionPath = path.join(DATA_DIR, 'sessions', `${streamerKey}.json`);
  const bundledSessionPath = path.join(__dirname, 'data', 'sessions', `${streamerKey}.json`);
  const targetSessionPath = fs.existsSync(sessionPath) ? sessionPath : (fs.existsSync(bundledSessionPath) ? bundledSessionPath : null);
  if (targetSessionPath) {
    try {
      const sData = JSON.parse(fs.readFileSync(targetSessionPath, 'utf-8'));
      if (sData.pairingCode && /^\d{6}$/.test(sData.pairingCode)) {
        pairingPin = String(sData.pairingCode);
      }
    } catch (_) {}
  }

  const salt = crypto.randomBytes(16).toString('hex');
  const passwordHash = hashPassword(password, salt);
  const now = Date.now();
  const expiresAt = now + (30 * 24 * 60 * 60 * 1000); // 30 days
  const userId = 'usr_' + crypto.randomBytes(8).toString('hex');

  const tokenPayload = {
    id: userId,
    email: cleanEmail,
    channelName: cleanName,
    streamerKey,
    pairingPin,
    exp: expiresAt
  };
  const token = generateToken(tokenPayload);

  const user = {
    id: userId,
    email: cleanEmail,
    channelName: cleanName,
    streamerKey,
    pairingPin,
    salt,
    passwordHash,
    createdAt: now,
    tokens: [
      {
        token,
        createdAt: now,
        expiresAt
      }
    ]
  };

  accounts.push(user);
  saveAccounts();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      channelName: user.channelName,
      streamerKey: user.streamerKey,
      pairingPin: user.pairingPin
    }
  };
}

/**
 * Authenticate existing user by email & password
 */
function login({ email, password }) {
  if (!email || !password) {
    throw new Error('Email and password are required.');
  }
  const cleanEmail = String(email).trim().toLowerCase();
  const user = accounts.find(a => a.email.toLowerCase() === cleanEmail);

  if (!user) {
    // Artificial scrypt hash to prevent timing attacks / user enumeration
    hashPassword('dummy_password_timing_pad', '00112233445566778899aabbccddeeff');
    throw new Error('Invalid email or password.');
  }

  const valid = verifyPassword(password, user.salt, user.passwordHash);
  if (!valid) {
    throw new Error('Invalid email or password.');
  }

  const now = Date.now();
  const expiresAt = now + (30 * 24 * 60 * 60 * 1000);

  const tokenPayload = {
    id: user.id,
    email: user.email,
    channelName: user.channelName,
    streamerKey: user.streamerKey,
    pairingPin: user.pairingPin,
    exp: expiresAt
  };
  const token = generateToken(tokenPayload);

  // Prune expired tokens & add new
  user.tokens = (user.tokens || []).filter(t => t.expiresAt && t.expiresAt > now);
  user.tokens.push({ token, createdAt: now, expiresAt });
  saveAccounts();

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      channelName: user.channelName,
      streamerKey: user.streamerKey,
      pairingPin: user.pairingPin
    }
  };
}

/**
 * Authenticate via Session Token (Stateless Signed Token + In-Memory Fallback)
 */
function verifyToken(token) {
  if (!token || typeof token !== 'string') return null;
  const cleanToken = token.trim();
  const now = Date.now();

  // 1. Stateless HMAC-signed token (persists across all Vercel Lambdas, cold starts, and reboots)
  if (cleanToken.startsWith('dat_') && cleanToken.includes('.')) {
    try {
      const stripped = cleanToken.slice(4);
      const dotIdx = stripped.indexOf('.');
      if (dotIdx !== -1) {
        const payloadStr = stripped.slice(0, dotIdx);
        const signature = stripped.slice(dotIdx + 1);
        const expectedSig = crypto.createHmac('sha256', AUTH_SECRET).update(payloadStr).digest('base64url');
        const sigBuf = Buffer.from(signature);
        const expBuf = Buffer.from(expectedSig);
        if (sigBuf.length === expBuf.length && crypto.timingSafeEqual(sigBuf, expBuf)) {
          const payload = JSON.parse(Buffer.from(payloadStr, 'base64url').toString('utf-8'));
          if (payload && payload.exp && payload.exp > now) {
            const foundUser = accounts.find(a => a.id === payload.id || (payload.email && a.email.toLowerCase() === payload.email.toLowerCase()));
            if (foundUser) {
              return {
                id: foundUser.id,
                email: foundUser.email,
                channelName: foundUser.channelName,
                streamerKey: foundUser.streamerKey,
                pairingPin: foundUser.pairingPin
              };
            }
            return {
              id: payload.id,
              email: payload.email,
              channelName: payload.channelName,
              streamerKey: payload.streamerKey,
              pairingPin: payload.pairingPin
            };
          }
        }
      }
    } catch (e) {
      console.warn('[Auth] Error decoding stateless token:', e.message);
    }
  }

  // 2. Fallback to in-memory accounts array for legacy tokens
  const user = accounts.find(a => 
    a.tokens && a.tokens.some(t => t.token === cleanToken && t.expiresAt > now)
  );

  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    channelName: user.channelName,
    streamerKey: user.streamerKey,
    pairingPin: user.pairingPin
  };
}

/**
 * Revoke Token (Logout)
 */
function logout(token) {
  if (!token) return false;
  let modified = false;
  accounts.forEach(u => {
    if (u.tokens) {
      const before = u.tokens.length;
      u.tokens = u.tokens.filter(t => t.token !== token);
      if (u.tokens.length !== before) modified = true;
    }
  });
  if (modified) saveAccounts();
  return true;
}

/**
 * Get account by pairing PIN (for Android mobile app matching)
 */
function getAccountByPairingPin(pin) {
  if (!pin) return null;
  return accounts.find(a => a.pairingPin === String(pin).trim()) || null;
}

/**
 * Get account by Streamer Key
 */
function getAccountByStreamerKey(key) {
  if (!key) return null;
  const clean = sanitizeId(key);
  return accounts.find(a => a.streamerKey === clean) || null;
}

/**
 * Delete account by Streamer Key or Email
 */
function deleteAccount(keyOrEmail) {
  if (!keyOrEmail) return false;
  const target = String(keyOrEmail).trim().toLowerCase();
  const cleanKey = sanitizeId(keyOrEmail);
  const before = accounts.length;
  accounts = accounts.filter(a => a.streamerKey !== cleanKey && a.email.toLowerCase() !== target);
  if (accounts.length !== before) {
    saveAccounts();
    return true;
  }
  return false;
}

module.exports = {
  register,
  login,
  verifyToken,
  logout,
  getAccountByPairingPin,
  getAccountByStreamerKey,
  deleteAccount,
  generateToken,
  getAllAccounts: () => accounts
};
