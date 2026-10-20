const fs = require('fs');
const path = require('path');
const http = require('http');
const { execSync } = require('child_process');
const { Resvg } = require('@resvg/resvg-js');

const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
console.log('Using ffmpeg from:', ffmpegPath);

const DOWNLOADS_DIR = path.join(__dirname, '..', 'public', 'downloads');
const TMP_DIR = path.join(__dirname, 'tmp_video_build');

if (!fs.existsSync(DOWNLOADS_DIR)) fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
if (!fs.existsSync(TMP_DIR)) fs.mkdirSync(TMP_DIR, { recursive: true });

const CHAPTERS = [
  {
    num: "01",
    tag: "INTRODUCTION",
    title: "SRB STUDIOS STREAMALERTS",
    sub: "Zero-Commission Live UPI Donation Alerts For Indian Streamers",
    narration: "Welcome to SRB STUDIOS StreamAlerts! The revolutionary zero-commission live UPI donation platform built exclusively for Indian creators. Receive 100 percent of your superchats directly to your bank account with instant voice announcements.",
    bullet1: "⚡ 0% Bank Commission - Direct to your account",
    bullet2: "💳 Supports PhonePe, GPay, Paytm, BHIM & All Banks",
    bullet3: "🇮🇳 Multi-Lingual Regional Voice Synthesis",
    accent: "#00f0ff"
  },
  {
    num: "02",
    tag: "STREAM SETUP",
    title: "1-CLICK STREAM OVERLAY",
    sub: "Clean 1080p Browser Source for Your Live Stream",
    narration: "Setting up your live overlay takes less than two minutes. Copy your personalized browser link from your cockpit and add it as a browser source. The canvas remains completely transparent until a viewer sends a donation.",
    bullet1: "🖥️ Seamless 1920x1080 High Definition Canvas",
    bullet2: "✨ 100% Transparent until donation arrives",
    bullet3: "🔥 Compatible with all modern streaming studios",
    accent: "#3b82f6"
  },
  {
    num: "03",
    tag: "MOBILE INTEGRATION",
    title: "ANDROID NOTIFICATION LISTENER",
    sub: "Instant Millisecond Sync Without Middlemen",
    narration: "When viewers scan your on-screen QR code and pay via PhonePe, Google Pay, or Paytm, the lightweight StreamAlerts Android app captures the notification locally on your phone and triggers the alert in real time.",
    bullet1: "📱 Lightweight APK reads bank notifications locally",
    bullet2: "⚡ Zero Cloud Storage of payment data",
    bullet3: "🔒 Safe, private, and fully bank-compliant",
    accent: "#10b981"
  },
  {
    num: "04",
    tag: "LIVE EXPERIENCE",
    title: "INSTANT POPUP & VOICE TTS",
    sub: "Dynamic Visual Cards with Instant Voice Announcements",
    narration: "The alert card pops up on stream featuring the donor's name, donation amount, and message, announced instantly in crystal-clear voice text-to-speech in your preferred Indian language or English.",
    bullet1: "🔊 High-fidelity voice text-to-speech",
    bullet2: "🛡️ Built-in anti-spam and profanity censor",
    bullet3: "🎨 Glowing neon alert cards and animated pulse dots",
    accent: "#a855f7"
  },
  {
    num: "05",
    tag: "CREATOR PRO EXCLUSIVE",
    title: "OWN VOICE STUDIO ⭐",
    sub: "Personally Shout Out Donors in YOUR Real Voice",
    narration: "With Creator Pro, you can record or upload your own real voice. Set personal intro greetings or custom sound alerts so every donor gets a personalized shoutout from you on stream.",
    bullet1: "🎙️ In-browser live microphone recorder",
    bullet2: "📁 Direct MP3 and WAV audio file upload",
    bullet3: "⭐ Dual Voice Mode: Streamer Greeting + Donor Note",
    accent: "#f59e0b"
  },
  {
    num: "06",
    tag: "GET STARTED",
    title: "START STREAMING TODAY 🚀",
    sub: "Receive Direct UPI Superchats in 2 Minutes",
    narration: "Ready to go live with donation alerts? Create your free streamer account, download the Android app, add your browser overlay, and start receiving direct-to-bank UPI alerts on your very next live stream!",
    bullet1: "① Sign Up Free in less than 30 seconds",
    bullet2: "② Install Android Notification App",
    bullet3: "③ Add 1080p Overlay & Go Live Instantly",
    accent: "#10b981"
  }
];

function escapeXml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function fetchTTSAudio(text, outputFile, retries = 4) {
  return new Promise((resolve, reject) => {
    function attempt(n) {
      const url = `http://localhost:3333/api/tts?text=${encodeURIComponent(text)}&lang=en-IN&speed=0.88`;
      const file = fs.createWriteStream(outputFile);
      const req = http.get(url, (res) => {
        if (res.statusCode !== 200) {
          file.close();
          fs.unlink(outputFile, () => {});
          if (n > 1) {
            console.log(` ⚠️ Retrying TTS fetch (${n - 1} left)...`);
            return setTimeout(() => attempt(n - 1), 1500);
          }
          return reject(new Error(`TTS failed with status ${res.statusCode}`));
        }
        res.pipe(file);
        file.on('finish', () => {
          file.close(resolve);
        });
      });
      req.on('error', (err) => {
        file.close();
        fs.unlink(outputFile, () => {});
        if (n > 1) {
          console.log(` ⚠️ Network drop, retrying TTS in 1.5s (${n - 1} left)...`);
          setTimeout(() => attempt(n - 1), 1500);
        } else {
          reject(err);
        }
      });
    }
    attempt(retries);
  });
}

function generateLandscapeSVG(chap) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1920" height="1080" viewBox="0 0 1920 1080">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#050811"/>
      <stop offset="50%" stop-color="#090e1c"/>
      <stop offset="100%" stop-color="#04060c"/>
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${chap.accent}"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="25" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1920" height="1080" fill="url(#bgGrad)"/>

  <!-- Subtle Cyber Grid Elements -->
  <circle cx="200" cy="150" r="300" fill="${chap.accent}" opacity="0.05" filter="url(#glow)"/>
  <circle cx="1700" cy="900" r="400" fill="#a855f7" opacity="0.04" filter="url(#glow)"/>

  <!-- Top Brand Header Bar -->
  <rect x="80" y="50" width="1760" height="70" rx="14" fill="#0d1527" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <text x="120" y="95" font-family="'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#00f0ff" letter-spacing="2">⚡ SRB STUDIOS</text>
  <text x="360" y="94" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#94a3b8">|  LIVE STREAM ALERTS SYSTEM</text>
  <rect x="1600" y="65" width="200" height="40" rx="20" fill="url(#accentGrad)"/>
  <text x="1700" y="91" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#000" text-anchor="middle" letter-spacing="1.5">OFFICIAL GUIDE</text>

  <!-- Main Left Content Box -->
  <g transform="translate(100, 200)">
    <!-- Chapter Tag Badge -->
    <rect x="0" y="0" width="220" height="38" rx="19" fill="rgba(0,240,255,0.12)" stroke="${chap.accent}" stroke-width="1.5"/>
    <text x="110" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="${chap.accent}" text-anchor="middle" letter-spacing="2">CHAPTER ${chap.num} • ${escapeXml(chap.tag)}</text>

    <!-- Main Title -->
    <text x="0" y="110" font-family="'Segoe UI', Roboto, sans-serif" font-size="62" font-weight="900" fill="#ffffff" letter-spacing="1">${escapeXml(chap.title)}</text>
    
    <!-- Subtitle -->
    <text x="0" y="170" font-family="'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="500" fill="#94a3b8">${escapeXml(chap.sub)}</text>

    <!-- Key Benefit Pills / Feature List -->
    <g transform="translate(0, 240)">
      <!-- Bullet 1 -->
      <rect x="0" y="0" width="800" height="74" rx="12" fill="#0c1222" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
      <rect x="0" y="0" width="6" height="74" rx="3" fill="${chap.accent}"/>
      <text x="30" y="45" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet1)}</text>

      <!-- Bullet 2 -->
      <rect x="0" y="94" width="800" height="74" rx="12" fill="#0c1222" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
      <rect x="0" y="94" width="6" height="74" rx="3" fill="#3b82f6"/>
      <text x="30" y="139" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet2)}</text>

      <!-- Bullet 3 -->
      <rect x="0" y="188" width="800" height="74" rx="12" fill="#0c1222" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
      <rect x="0" y="188" width="6" height="74" rx="3" fill="#10b981"/>
      <text x="30" y="233" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet3)}</text>
    </g>
  </g>

  <!-- Right Side Visual Card Mockup -->
  <g transform="translate(1080, 240)">
    <!-- Main Outer Glow Container -->
    <rect x="0" y="0" width="740" height="560" rx="24" fill="#0d1424" stroke="rgba(0,240,255,0.3)" stroke-width="2" filter="url(#glow)"/>
    <rect x="0" y="0" width="740" height="560" rx="24" fill="#0c1322"/>

    <!-- Simulated Live Alert Card -->
    <rect x="40" y="40" width="660" height="12" rx="6" fill="url(#accentGrad)"/>
    
    <!-- Card Inner Header -->
    <g transform="translate(50, 80)">
      <rect x="0" y="0" width="220" height="32" rx="16" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1"/>
      <circle cx="20" cy="16" r="5" fill="#10b981"/>
      <text x="35" y="22" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#10b981" letter-spacing="1">LIVE DONATION ON STREAM</text>

      <rect x="430" y="0" width="130" height="32" rx="8" fill="rgba(16,185,129,0.15)"/>
      <text x="495" y="21" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#10b981" text-anchor="middle">✓ VERIFIED UPI</text>
    </g>

    <!-- Donor Name & Amount -->
    <g transform="translate(50, 150)">
      <text x="0" y="40" font-family="'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#ffffff">Alex Martin</text>
      <text x="640" y="40" font-family="'Segoe UI', Roboto, sans-serif" font-size="46" font-weight="900" fill="#34d399" text-anchor="end">₹500</text>
    </g>

    <!-- Message Quote Box -->
    <g transform="translate(50, 220)">
      <rect x="0" y="0" width="640" height="90" rx="12" fill="#141c2e" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="25" y="38" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="500" fill="#cbd5e1">"Incredible stream! Keep up the fantastic gameplay!"</text>
      <text x="25" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#38bdf8">🔊 Voice Text-to-Speech synthesizer active</text>
    </g>

    <!-- Apps Supported Ribbon -->
    <g transform="translate(50, 340)">
      <rect x="0" y="0" width="190" height="44" rx="10" fill="#1a1c30"/>
      <text x="95" y="28" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#c084fc" text-anchor="middle">🟣 PhonePe Instant</text>

      <rect x="210" y="0" width="190" height="44" rx="10" fill="#16253b"/>
      <text x="305" y="28" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#38bdf8" text-anchor="middle">🔵 Google Pay</text>

      <rect x="420" y="0" width="220" height="44" rx="10" fill="#0f2b33"/>
      <text x="530" y="28" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#00f0ff" text-anchor="middle">💠 Paytm Business</text>
    </g>

    <!-- Footer Security / 0-DB Bar -->
    <g transform="translate(50, 420)">
      <rect x="0" y="0" width="640" height="70" rx="12" fill="#080c16" stroke="rgba(16,185,129,0.3)" stroke-width="1.5"/>
      <text x="30" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="700" fill="#34d399">🔒 0% Fees • Direct Bank Settlement • Instant Delivery</text>
    </g>
  </g>

  <!-- Bottom Timeline & Status Indicator -->
  <g transform="translate(100, 950)">
    <rect x="0" y="0" width="1720" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
    <rect x="0" y="0" width="${(parseInt(chap.num,10)/6)*1720}" height="8" rx="4" fill="url(#accentGrad)"/>
    <text x="0" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#94a3b8">SRB STUDIOS OFFICIAL TUTORIAL WALKTHROUGH</text>
    <text x="1720" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="${chap.accent}" text-anchor="end">PART ${chap.num} OF 06</text>
  </g>
</svg>`;
}

function generateVerticalSVG(chap) {
  // 1080 x 1920 9:16 format for Instagram Reels, YouTube Shorts, WhatsApp Status
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs>
    <linearGradient id="bgGradV" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#050811"/>
      <stop offset="40%" stop-color="#0a1020"/>
      <stop offset="100%" stop-color="#04060c"/>
    </linearGradient>
    <linearGradient id="accentGradV" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${chap.accent}"/>
      <stop offset="100%" stop-color="#a855f7"/>
    </linearGradient>
    <filter id="glowV" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="30" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="1080" height="1920" fill="url(#bgGradV)"/>
  <circle cx="540" cy="400" r="350" fill="${chap.accent}" opacity="0.06" filter="url(#glowV)"/>
  <circle cx="540" cy="1500" r="400" fill="#a855f7" opacity="0.05" filter="url(#glowV)"/>

  <!-- Top Brand Tag -->
  <g transform="translate(60, 100)">
    <rect x="0" y="0" width="960" height="90" rx="18" fill="#0d1527" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
    <text x="40" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#00f0ff" letter-spacing="2">⚡ SRB STUDIOS</text>
    <rect x="740" y="20" width="180" height="50" rx="25" fill="url(#accentGradV)"/>
    <text x="830" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#000" text-anchor="middle">STREAMALERTS</text>
  </g>

  <!-- Chapter Indicator -->
  <g transform="translate(60, 240)">
    <rect x="0" y="0" width="260" height="44" rx="22" fill="rgba(0,240,255,0.12)" stroke="${chap.accent}" stroke-width="1.5"/>
    <text x="130" y="28" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="${chap.accent}" text-anchor="middle" letter-spacing="2">CHAPTER ${chap.num} • ${escapeXml(chap.tag)}</text>
  </g>

  <!-- Main Headline -->
  <g transform="translate(60, 330)">
    <text x="0" y="50" font-family="'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#ffffff" letter-spacing="1">${escapeXml(chap.title)}</text>
    <text x="0" y="105" font-family="'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="500" fill="#94a3b8">${escapeXml(chap.sub)}</text>
  </g>

  <!-- Simulated Phone Live Overlay Screen Mockup -->
  <g transform="translate(100, 500)">
    <!-- Outer Card -->
    <rect x="0" y="0" width="880" height="660" rx="28" fill="#0d1424" stroke="rgba(0,240,255,0.3)" stroke-width="2" filter="url(#glowV)"/>
    <rect x="0" y="0" width="880" height="660" rx="28" fill="#0c1322"/>
    <rect x="40" y="40" width="800" height="14" rx="7" fill="url(#accentGradV)"/>

    <g transform="translate(50, 90)">
      <rect x="0" y="0" width="240" height="36" rx="18" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1"/>
      <circle cx="22" cy="18" r="6" fill="#10b981"/>
      <text x="40" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#10b981">LIVE DONATION ON AIR</text>
    </g>

    <g transform="translate(50, 180)">
      <text x="0" y="40" font-family="'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#ffffff">Alex Martin</text>
      <text x="780" y="40" font-family="'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#34d399" text-anchor="end">₹1,000</text>
    </g>

    <g transform="translate(50, 270)">
      <rect x="0" y="0" width="780" height="120" rx="16" fill="#141c2e" stroke="rgba(255,255,255,0.06)" stroke-width="1"/>
      <text x="30" y="48" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#f8fafc">"Incredible stream! Keep up the high energy gameplay!"</text>
      <text x="30" y="90" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#38bdf8">🔊 Voice Text-to-Speech Synthesized Instantly</text>
    </g>

    <g transform="translate(50, 440)">
      <rect x="0" y="0" width="240" height="54" rx="12" fill="#1a1c30"/>
      <text x="120" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#c084fc" text-anchor="middle">🟣 PhonePe</text>

      <rect x="270" y="0" width="240" height="54" rx="12" fill="#16253b"/>
      <text x="390" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#38bdf8" text-anchor="middle">🔵 Google Pay</text>

      <rect x="540" y="0" width="240" height="54" rx="12" fill="#0f2b33"/>
      <text x="660" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-size="17" font-weight="700" fill="#00f0ff" text-anchor="middle">💠 Paytm</text>
    </g>

    <g transform="translate(50, 535)">
      <rect x="0" y="0" width="780" height="70" rx="14" fill="#080c16" stroke="rgba(16,185,129,0.3)" stroke-width="1.5"/>
      <text x="40" y="43" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="700" fill="#34d399">⚡ 0% Cut • Direct To Bank • Instant Alert</text>
    </g>
  </g>

  <!-- 3 Big Feature Highlights (Reels / Shorts Format) -->
  <g transform="translate(60, 1220)">
    <rect x="0" y="0" width="960" height="100" rx="16" fill="#0d1424" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <rect x="0" y="0" width="8" height="100" rx="4" fill="${chap.accent}"/>
    <text x="40" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="25" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet1)}</text>

    <rect x="0" y="125" width="960" height="100" rx="16" fill="#0d1424" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <rect x="0" y="125" width="8" height="100" rx="4" fill="#3b82f6"/>
    <text x="40" y="185" font-family="'Segoe UI', Roboto, sans-serif" font-size="25" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet2)}</text>

    <rect x="0" y="250" width="960" height="100" rx="16" fill="#0d1424" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <rect x="0" y="250" width="8" height="100" rx="4" fill="#10b981"/>
    <text x="40" y="310" font-family="'Segoe UI', Roboto, sans-serif" font-size="25" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet3)}</text>
  </g>

  <!-- Footer Call To Action Bar -->
  <g transform="translate(60, 1680)">
    <rect x="0" y="0" width="960" height="120" rx="24" fill="url(#accentGradV)"/>
    <text x="480" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#000" text-anchor="middle">JOIN THOUSANDS OF INDIAN STREAMERS</text>
    <text x="480" y="90" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#1e1b4b" text-anchor="middle">👉 Visit SRB STUDIOS StreamAlerts Portal</text>
  </g>
</svg>`;
}

async function renderSVGToPNG(svgString, outputPath, width) {
  const resvg = new Resvg(svgString, { fitTo: { mode: 'width', value: width } });
  const pngData = resvg.render();
  fs.writeFileSync(outputPath, pngData.asPng());
}

async function buildTutorialVideo() {
  console.log('🚀 Starting SRB STUDIOS Tutorial Video Build...');

  const partFilesLandscape = [];
  const partFilesVertical = [];

  for (let i = 0; i < CHAPTERS.length; i++) {
    const chap = CHAPTERS[i];
    console.log(`\n🎬 Processing Chapter ${chap.num}: ${chap.title}...`);

    // 1. Fetch TTS Audio (use cached file if already downloaded)
    const audioPath = path.join(TMP_DIR, `audio_${chap.num}.mp3`);
    if (fs.existsSync(audioPath) && fs.statSync(audioPath).size > 1000) {
      console.log(` - Using cached voiceover audio (${fs.statSync(audioPath).size} bytes)`);
    } else {
      console.log(` - Fetching Voiceover Audio (${chap.narration.length} chars)...`);
      await fetchTTSAudio(chap.narration, audioPath);
      await new Promise(r => setTimeout(r, 600)); // Gentle spacing between chapters
    }

    // 2. Generate 16:9 Landscape SVG & PNG
    const svgL = generateLandscapeSVG(chap);
    const pngL = path.join(TMP_DIR, `slide_L_${chap.num}.png`);
    await renderSVGToPNG(svgL, pngL, 1920);

    // 3. Generate 9:16 Vertical SVG & PNG
    const svgV = generateVerticalSVG(chap);
    const pngV = path.join(TMP_DIR, `slide_V_${chap.num}.png`);
    await renderSVGToPNG(svgV, pngV, 1080);

    // 4. Render Chapter Video Part (Landscape 16:9)
    const partL = path.join(TMP_DIR, `part_L_${chap.num}.mp4`);
    if (fs.existsSync(partL) && fs.statSync(partL).size > 20000) {
      console.log(` - Using cached 16:9 video (${fs.statSync(partL).size} bytes)`);
    } else {
      console.log(` - Encoding 16:9 Chapter Video (${partL})...`);
      execSync(`"${ffmpegPath}" -loop 1 -i "${pngL}" -i "${audioPath}" -c:v libx264 -preset ultrafast -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -y "${partL}"`, { stdio: 'ignore' });
    }
    partFilesLandscape.push(partL);

    // 5. Render Chapter Video Part (Vertical 9:16)
    const partV = path.join(TMP_DIR, `part_V_${chap.num}.mp4`);
    if (fs.existsSync(partV) && fs.statSync(partV).size > 20000) {
      console.log(` - Using cached 9:16 reel video (${fs.statSync(partV).size} bytes)`);
    } else {
      console.log(` - Encoding 9:16 Chapter Reel Video (${partV})...`);
      execSync(`"${ffmpegPath}" -loop 1 -i "${pngV}" -i "${audioPath}" -c:v libx264 -preset ultrafast -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -y "${partV}"`, { stdio: 'ignore' });
    }
    partFilesVertical.push(partV);
  }

  // 6. Concatenate Landscape Chapters into Master YouTube MP4
  const listFilePathL = path.join(TMP_DIR, 'concat_list_L.txt');
  fs.writeFileSync(listFilePathL, partFilesLandscape.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'));

  const finalYouTubeMP4 = path.join(DOWNLOADS_DIR, 'SRB_STUDIOS_StreamAlerts_Tutorial.mp4');
  console.log(`\n🎥 Concatenating Final 16:9 YouTube Tutorial: ${finalYouTubeMP4}...`);
  execSync(`"${ffmpegPath}" -f concat -safe 0 -i "${listFilePathL}" -c copy -y "${finalYouTubeMP4}"`, { stdio: 'inherit' });

  // 7. Concatenate Vertical Chapters into Master Instagram Reels MP4
  const listFilePathV = path.join(TMP_DIR, 'concat_list_V.txt');
  fs.writeFileSync(listFilePathV, partFilesVertical.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'));

  const finalReelMP4 = path.join(DOWNLOADS_DIR, 'SRB_STUDIOS_StreamAlerts_Reel.mp4');
  console.log(`\n📱 Concatenating Final 9:16 Instagram Reel Video: ${finalReelMP4}...`);
  execSync(`"${ffmpegPath}" -f concat -safe 0 -i "${listFilePathV}" -c copy -y "${finalReelMP4}"`, { stdio: 'inherit' });

  console.log('\n✅ TUTORIAL VIDEOS GENERATED SUCCESSFULLY!');
  console.log(' - YouTube 16:9 Landscape MP4:', finalYouTubeMP4, `(${Math.round(fs.statSync(finalYouTubeMP4).size / 1024)} KB)`);
  console.log(' - Instagram Reels 9:16 Vertical MP4:', finalReelMP4, `(${Math.round(fs.statSync(finalReelMP4).size / 1024)} KB)`);
}

buildTutorialVideo().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
