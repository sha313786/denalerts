const fs = require('fs');
const path = require('path');
const https = require('https');
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
    tag: "STEP 1 • SIGN UP",
    title: "CREATE YOUR ACCOUNT",
    sub: "Get your personalized Creator Cockpit at alerts.denbooks.in",
    narration: "Step 1: Create your free creator account. Head over to alerts.denbooks.in, click Sign Up, and enter your email and password. In less than 30 seconds, your personal Creator Cockpit is ready with zero setup fees.",
    bullet1: "🌐 Visit alerts.denbooks.in in your browser",
    bullet2: "⚡ Free 14-day Creator Pro trial included",
    bullet3: "🔒 Instant private streamer key and dashboard",
    accent: "#00f0ff",
    type: "register"
  },
  {
    num: "02",
    tag: "STEP 2 • DOWNLOAD",
    title: "DOWNLOAD COMPANION APK",
    sub: "Get the lightweight 2MB Android notification listener",
    narration: "Step 2: Download the DenAlerts companion app. On your dashboard or homepage, click Download APK to save DenAlerts dot apk directly onto the Android phone where you receive your UPI payments.",
    bullet1: "📥 1-Click direct APK download from dashboard",
    bullet2: "📱 Lightweight 2 megabyte battery-efficient app",
    bullet3: "🛡️ 100% Secure - No bank login or password needed",
    accent: "#3b82f6",
    type: "download"
  },
  {
    num: "03",
    tag: "STEP 3 • PERMISSIONS",
    title: "INSTALL & GRANT ACCESS",
    sub: "Enable Android Notification Access to capture superchats",
    narration: "Step 3: Install the app and grant notification access. Open the APK on your phone, tap Install, then open DenAlerts. Tap Enable Notification Access and toggle the switch for DenAlerts in Android Settings so it can read your incoming superchats.",
    bullet1: "⚙️ Tap Enable Notification Access in the app",
    bullet2: "✅ Allow DenAlerts in Android Notification Listener",
    bullet3: "🔋 Disable Battery Optimization for zero dropouts",
    accent: "#10b981",
    type: "access"
  },
  {
    num: "04",
    tag: "STEP 4 • PAIRING",
    title: "ENTER YOUR 6-DIGIT PIN",
    sub: "Link your smartphone directly to your broadcast stream",
    narration: "Step 4: Pair your smartphone. Find your unique six-digit Pairing PIN on your cockpit dashboard. Type this PIN into the DenAlerts Android app and toggle the Stream Mode switch to On. Your phone is now paired and listening live.",
    bullet1: "🔢 Copy 6-digit PIN from your web dashboard",
    bullet2: "📲 Enter PIN into DenAlerts Android app",
    bullet3: "🟢 Toggle Stream Mode ON to begin forwarding",
    accent: "#f59e0b",
    type: "pairing"
  },
  {
    num: "05",
    tag: "STEP 5 • OVERLAY",
    title: "ADD 1080P BROWSER SOURCE",
    sub: "Paste your transparent overlay URL into OBS Studio or Streamlabs",
    narration: "Step 5: Add your live overlay to OBS Studio. In your dashboard, click Copy Overlay Link. Open OBS, click the plus icon in Sources, select Browser, set width to 1920 and height to 1080, and paste your URL. The canvas remains completely transparent until someone donates.",
    bullet1: "📋 Click Copy Overlay URL in your cockpit",
    bullet2: "🖥️ In OBS Sources, add Browser Source",
    bullet3: "📐 Set Width 1920, Height 1080 • 100% Transparent",
    accent: "#a855f7",
    type: "overlay"
  },
  {
    num: "06",
    tag: "STEP 6 • GO LIVE",
    title: "TEST ALERT & START STREAMING",
    sub: "0% Commission Direct UPI Alerts with Natural Voice TTS",
    narration: "Step 6: Test and go live! Click Trigger Test Alert on your dashboard. Your glowing alert card instantly pops up in OBS with your donor's name, amount, and message, announced in your chosen voice. Show your UPI QR code on stream and keep 100 percent of your earnings!",
    bullet1: "🧪 Click Trigger Test Alert to verify audio & visuals",
    bullet2: "🗣️ Crisp regional voice announcement in your language",
    bullet3: "🎉 0% Commission direct bank alerts ready for your live stream",
    accent: "#ec4899",
    type: "live"
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
      const url = `https://alerts.denbooks.in/api/tts?text=${encodeURIComponent(text)}&lang=en-IN&speed=0.88`;
      const file = fs.createWriteStream(outputFile);
      const req = https.get(url, (res) => {
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

function getRightMockupSVG(chap) {
  switch (chap.type) {
    case 'register':
      return `
        <!-- Window Frame -->
        <rect x="0" y="0" width="740" height="560" rx="20" fill="#0b1120" stroke="rgba(0,240,255,0.3)" stroke-width="2"/>
        <rect x="0" y="0" width="740" height="50" rx="20" fill="#131c33"/>
        <circle cx="35" cy="25" r="7" fill="#ef4444"/>
        <circle cx="60" cy="25" r="7" fill="#f59e0b"/>
        <circle cx="85" cy="25" r="7" fill="#10b981"/>
        <text x="370" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8" text-anchor="middle">alerts.denbooks.in/login.html</text>

        <!-- Form Container -->
        <g transform="translate(60, 90)">
          <text x="0" y="30" font-family="'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#ffffff">Create Streamer Account</text>
          <text x="0" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">Start receiving instant zero-commission UPI superchats</text>

          <!-- Email Input -->
          <text x="0" y="110" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#cbd5e1">EMAIL ADDRESS</text>
          <rect x="0" y="125" width="620" height="54" rx="10" fill="#060913" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
          <text x="20" y="160" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="500" fill="#ffffff">streamer@denbooks.in</text>

          <!-- Password Input -->
          <text x="0" y="220" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#cbd5e1">PASSWORD</text>
          <rect x="0" y="235" width="620" height="54" rx="10" fill="#060913" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
          <text x="20" y="272" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="900" fill="#00f0ff">••••••••••••</text>

          <!-- Sign Up Button -->
          <rect x="0" y="325" width="620" height="60" rx="12" fill="url(#accentGrad)"/>
          <text x="310" y="363" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#000000" text-anchor="middle">CREATE STREAMER ACCOUNT →</text>

          <!-- Bottom Feature Pills -->
          <g transform="translate(0, 415)">
            <rect x="0" y="0" width="290" height="36" rx="8" fill="rgba(16,185,129,0.15)"/>
            <text x="145" y="23" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#10b981" text-anchor="middle">✓ 14-Day Free Pro Trial Included</text>

            <rect x="310" y="0" width="310" height="36" rx="8" fill="rgba(0,240,255,0.12)"/>
            <text x="465" y="23" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="800" fill="#00f0ff" text-anchor="middle">✓ Instant Private Streamer PIN</text>
          </g>
        </g>
      `;

    case 'download':
      return `
        <!-- APK Download Card -->
        <rect x="0" y="0" width="740" height="560" rx="20" fill="#0b1120" stroke="rgba(59,130,246,0.3)" stroke-width="2"/>
        <rect x="0" y="0" width="740" height="50" rx="20" fill="#131c33"/>
        <circle cx="35" cy="25" r="7" fill="#ef4444"/>
        <circle cx="60" cy="25" r="7" fill="#f59e0b"/>
        <circle cx="85" cy="25" r="7" fill="#10b981"/>
        <text x="370" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8" text-anchor="middle">DenAlerts Mobile Companion</text>

        <g transform="translate(60, 90)">
          <!-- App Icon & Title -->
          <rect x="0" y="10" width="90" height="90" rx="20" fill="url(#accentGrad)"/>
          <text x="45" y="65" font-family="'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#000" text-anchor="middle">⚡</text>
          
          <text x="110" y="50" font-family="'Segoe UI', Roboto, sans-serif" font-size="30" font-weight="900" fill="#ffffff">DenAlerts for Android</text>
          <text x="110" y="80" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="600" fill="#3b82f6">Official Stream Notification Listener • v2.4</text>

          <!-- Download Box -->
          <rect x="0" y="130" width="620" height="150" rx="16" fill="#060913" stroke="rgba(59,130,246,0.3)" stroke-width="1.5"/>
          <text x="30" y="175" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#ffffff">📦 DenAlerts.apk</text>
          <text x="30" y="205" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#94a3b8">File Size: 2.4 MB • Android 8.0 to Android 15</text>
          <rect x="420" y="160" width="170" height="50" rx="10" fill="#10b981"/>
          <text x="505" y="192" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="900" fill="#000000" text-anchor="middle">DOWNLOAD APK ⬇</text>
          <text x="30" y="250" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#10b981">✓ Safe &amp; Verified • No Special Root Required</text>

          <!-- Supported UPI Badges -->
          <g transform="translate(0, 315)">
            <text x="0" y="0" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8">CAPTURES PAYMENTS INSTANTLY FROM:</text>
            <rect x="0" y="15" width="145" height="42" rx="8" fill="#1a1c30"/>
            <text x="72" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#c084fc" text-anchor="middle">🟣 PhonePe</text>

            <rect x="155" y="15" width="145" height="42" rx="8" fill="#16253b"/>
            <text x="227" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#38bdf8" text-anchor="middle">🔵 Google Pay</text>

            <rect x="310" y="15" width="145" height="42" rx="8" fill="#0f2b33"/>
            <text x="382" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#00f0ff" text-anchor="middle">🔷 Paytm</text>

            <rect x="465" y="15" width="155" height="42" rx="8" fill="#1e1b4b"/>
            <text x="542" y="42" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#fb923c" text-anchor="middle">🟠 BHIM &amp; Banks</text>
          </g>
        </g>
      `;

    case 'access':
      return `
        <!-- Android Settings Permission Mockup -->
        <rect x="0" y="0" width="740" height="560" rx="20" fill="#0b1120" stroke="rgba(16,185,129,0.3)" stroke-width="2"/>
        <rect x="0" y="0" width="740" height="50" rx="20" fill="#131c33"/>
        <circle cx="35" cy="25" r="7" fill="#ef4444"/>
        <circle cx="60" cy="25" r="7" fill="#f59e0b"/>
        <circle cx="85" cy="25" r="7" fill="#10b981"/>
        <text x="370" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8" text-anchor="middle">Android System Settings • Permissions</text>

        <g transform="translate(60, 80)">
          <text x="0" y="30" font-family="'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#ffffff">Notification Listener Access</text>
          <text x="0" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="500" fill="#94a3b8">Allows DenAlerts to detect UPI superchat notifications</text>

          <!-- Toggle Row 1: DenAlerts Notification Access -->
          <rect x="0" y="85" width="620" height="85" rx="14" fill="#060913" stroke="rgba(16,185,129,0.4)" stroke-width="2"/>
          <circle cx="45" cy="127" r="22" fill="#10b981"/>
          <text x="45" y="135" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#000" text-anchor="middle">⚡</text>
          <text x="85" y="120" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#ffffff">DenAlerts Listener</text>
          <text x="85" y="145" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#94a3b8">Read incoming donation notifications</text>
          <!-- Switch ON -->
          <rect x="520" y="112" width="70" height="36" rx="18" fill="#10b981"/>
          <circle cx="568" cy="130" r="14" fill="#ffffff"/>

          <!-- Toggle Row 2: Battery Optimization -->
          <rect x="0" y="190" width="620" height="85" rx="14" fill="#060913" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
          <circle cx="45" cy="232" r="22" fill="#3b82f6"/>
          <text x="45" y="240" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="900" fill="#000" text-anchor="middle">🔋</text>
          <text x="85" y="225" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="800" fill="#ffffff">Battery Optimization</text>
          <text x="85" y="250" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="500" fill="#10b981">Don't optimize (Unrestricted background run)</text>
          <!-- Switch ON -->
          <rect x="520" y="217" width="70" height="36" rx="18" fill="#10b981"/>
          <circle cx="568" cy="235" r="14" fill="#ffffff"/>

          <!-- Important Note Callout -->
          <rect x="0" y="295" width="620" height="110" rx="12" fill="#0c172a" stroke="rgba(16,185,129,0.25)" stroke-width="1.5"/>
          <text x="25" y="330" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="800" fill="#10b981">🔒 PRIVACY &amp; SECURITY GUARANTEE</text>
          <text x="25" y="360" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">All notification parsing runs 100% locally on your smartphone.</text>
          <text x="25" y="385" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">Personal messages and unrelated apps remain completely private.</text>
        </g>
      `;

    case 'pairing':
      return `
        <!-- Phone Pairing Screen Mockup -->
        <rect x="0" y="0" width="740" height="560" rx="20" fill="#0b1120" stroke="rgba(245,158,11,0.3)" stroke-width="2"/>
        <rect x="0" y="0" width="740" height="50" rx="20" fill="#131c33"/>
        <circle cx="35" cy="25" r="7" fill="#ef4444"/>
        <circle cx="60" cy="25" r="7" fill="#f59e0b"/>
        <circle cx="85" cy="25" r="7" fill="#10b981"/>
        <text x="370" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8" text-anchor="middle">DenAlerts Mobile App • Live Stream Mode</text>

        <g transform="translate(60, 80)">
          <!-- Status Banner -->
          <rect x="0" y="10" width="620" height="55" rx="12" fill="rgba(16,185,129,0.15)" stroke="#10b981" stroke-width="1.5"/>
          <circle cx="30" cy="37" r="7" fill="#10b981"/>
          <text x="50" y="43" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#10b981">STREAM MODE: ACTIVE &amp; FORWARDING</text>
          <text x="590" y="43" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#34d399" text-anchor="end">⚡ 12ms</text>

          <!-- 6-Digit PIN Display -->
          <text x="0" y="110" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#94a3b8">YOUR 6-DIGIT PAIRING PIN (FROM COCKPIT)</text>
          <g transform="translate(0, 125)">
            <rect x="0" y="0" width="90" height="80" rx="12" fill="#060913" stroke="#f59e0b" stroke-width="2"/>
            <text x="45" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">1</text>

            <rect x="105" y="0" width="90" height="80" rx="12" fill="#060913" stroke="#f59e0b" stroke-width="2"/>
            <text x="150" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">2</text>

            <rect x="210" y="0" width="90" height="80" rx="12" fill="#060913" stroke="#f59e0b" stroke-width="2"/>
            <text x="255" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">9</text>

            <rect x="315" y="0" width="90" height="80" rx="12" fill="#060913" stroke="#f59e0b" stroke-width="2"/>
            <text x="360" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">0</text>

            <rect x="420" y="0" width="90" height="80" rx="12" fill="#060913" stroke="#f59e0b" stroke-width="2"/>
            <text x="465" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">9</text>

            <rect x="525" y="0" width="90" height="80" rx="12" fill="#060913" stroke="#f59e0b" stroke-width="2"/>
            <text x="570" y="55" font-family="'Segoe UI', Roboto, sans-serif" font-size="38" font-weight="900" fill="#ffffff" text-anchor="middle">3</text>
          </g>

          <!-- Ping Test Box -->
          <rect x="0" y="235" width="620" height="90" rx="12" fill="#060913" stroke="rgba(255,255,255,0.1)" stroke-width="1.5"/>
          <text x="25" y="270" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#ffffff">Server Endpoint: https://alerts.denbooks.in</text>
          <text x="25" y="300" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#10b981">✓ Connected to OBS Overlay (200 OK - WebSocket Linked)</text>

          <!-- Stream Switch -->
          <rect x="0" y="350" width="620" height="60" rx="12" fill="#10b981"/>
          <text x="310" y="388" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="900" fill="#000000" text-anchor="middle">✓ PAIRED &amp; STREAMING LIVE</text>
        </g>
      `;

    case 'overlay':
      return `
        <!-- OBS Studio Browser Source Mockup -->
        <rect x="0" y="0" width="740" height="560" rx="20" fill="#0b1120" stroke="rgba(168,85,247,0.3)" stroke-width="2"/>
        <rect x="0" y="0" width="740" height="50" rx="20" fill="#131c33"/>
        <circle cx="35" cy="25" r="7" fill="#ef4444"/>
        <circle cx="60" cy="25" r="7" fill="#f59e0b"/>
        <circle cx="85" cy="25" r="7" fill="#10b981"/>
        <text x="370" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8" text-anchor="middle">OBS Studio • Properties for 'DenAlerts Overlay'</text>

        <g transform="translate(60, 80)">
          <!-- URL Field -->
          <text x="0" y="25" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#cbd5e1">BROWSER SOURCE URL</text>
          <rect x="0" y="38" width="620" height="54" rx="10" fill="#060913" stroke="#a855f7" stroke-width="1.5"/>
          <text x="20" y="72" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="600" fill="#c084fc">https://alerts.denbooks.in/overlay.html?code=129093</text>

          <!-- Width & Height -->
          <g transform="translate(0, 115)">
            <text x="0" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#cbd5e1">WIDTH (PX)</text>
            <rect x="0" y="35" width="295" height="54" rx="10" fill="#060913" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
            <text x="20" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#ffffff">1920</text>

            <text x="325" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="700" fill="#cbd5e1">HEIGHT (PX)</text>
            <rect x="325" y="35" width="295" height="54" rx="10" fill="#060913" stroke="rgba(255,255,255,0.15)" stroke-width="1.5"/>
            <text x="345" y="70" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="800" fill="#ffffff">1080</text>
          </g>

          <!-- OBS Checkboxes -->
          <g transform="translate(0, 235)">
            <rect x="0" y="0" width="20" height="20" rx="4" fill="#a855f7"/>
            <text x="8" y="16" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#000">✓</text>
            <text x="35" y="16" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc">Shutdown source when not visible</text>

            <rect x="0" y="35" width="20" height="20" rx="4" fill="#a855f7"/>
            <text x="8" y="51" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#000">✓</text>
            <text x="35" y="51" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="600" fill="#f8fafc">Refresh browser when scene becomes active</text>
          </g>

          <!-- Transparent Hint Box -->
          <rect x="0" y="315" width="620" height="90" rx="12" fill="#060913" stroke="rgba(16,185,129,0.3)" stroke-width="1.5"/>
          <text x="25" y="350" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#10b981">✨ 100% TRANSPARENT CANVAS</text>
          <text x="25" y="380" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="500" fill="#cbd5e1">The overlay stays completely invisible until a donation is sent!</text>
        </g>
      `;

    case 'live':
      return `
        <!-- Live Alert Popup Simulation -->
        <rect x="0" y="0" width="740" height="560" rx="20" fill="#0b1120" stroke="rgba(236,72,153,0.3)" stroke-width="2"/>
        <rect x="0" y="0" width="740" height="50" rx="20" fill="#131c33"/>
        <circle cx="35" cy="25" r="7" fill="#ef4444"/>
        <circle cx="60" cy="25" r="7" fill="#f59e0b"/>
        <circle cx="85" cy="25" r="7" fill="#10b981"/>
        <text x="370" y="32" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#94a3b8" text-anchor="middle">Live Broadcast Stream View</text>

        <g transform="translate(60, 75)">
          <!-- Top Tag -->
          <rect x="0" y="10" width="200" height="32" rx="16" fill="rgba(236,72,153,0.15)" stroke="#ec4899" stroke-width="1.5"/>
          <text x="100" y="31" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="900" fill="#ec4899" text-anchor="middle">🟣 PHONEPE ALERT</text>

          <rect x="470" y="10" width="150" height="32" rx="8" fill="rgba(16,185,129,0.15)"/>
          <text x="545" y="31" font-family="'Segoe UI', Roboto, sans-serif" font-size="12" font-weight="800" fill="#10b981" text-anchor="middle">✓ VERIFIED UPI</text>

          <!-- Donor Name & Amount -->
          <g transform="translate(0, 65)">
            <text x="0" y="50" font-family="'Segoe UI', Roboto, sans-serif" font-size="44" font-weight="900" fill="#ffffff">Rohit Sharma</text>
            <text x="620" y="50" font-family="'Segoe UI', Roboto, sans-serif" font-size="52" font-weight="900" fill="#34d399" text-anchor="end">₹500</text>
          </g>

          <!-- Donor Message Quote Box -->
          <rect x="0" y="140" width="620" height="110" rx="14" fill="#060913" stroke="rgba(255,255,255,0.12)" stroke-width="1.5"/>
          <text x="25" y="180" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="600" fill="#f8fafc">"Clutch this 1v3 bro! Let's go!"</text>
          <text x="25" y="225" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#38bdf8">🔊 Announced in Natural Voice: "Thank you Rohit! Received 500 rupees..."</text>

          <!-- Goal Bar Preview -->
          <g transform="translate(0, 275)">
            <text x="0" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="700" fill="#cbd5e1">STREAM GOAL: NEW MIC FUND</text>
            <text x="620" y="20" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="800" fill="#00f0ff" text-anchor="end">₹1,500 / ₹5,000 (30%)</text>
            <rect x="0" y="30" width="620" height="16" rx="8" fill="#131c33"/>
            <rect x="0" y="30" width="186" height="16" rx="8" fill="url(#accentGrad)"/>
          </g>

          <!-- Footer Zero Cut Guarantee -->
          <rect x="0" y="345" width="620" height="60" rx="12" fill="#0c172a" stroke="rgba(16,185,129,0.3)" stroke-width="1.5"/>
          <text x="310" y="382" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="800" fill="#34d399" text-anchor="middle">⚡ 0% Platform Commission • 100% Direct Bank Superchats</text>
        </g>
      `;

    default:
      return '';
  }
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

  <!-- Subtle Ambient Glow Orbs -->
  <circle cx="200" cy="150" r="300" fill="${chap.accent}" opacity="0.06" filter="url(#glow)"/>
  <circle cx="1700" cy="900" r="400" fill="#a855f7" opacity="0.05" filter="url(#glow)"/>

  <!-- Top Brand Header Bar -->
  <rect x="80" y="50" width="1760" height="70" rx="14" fill="#0d1527" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
  <text x="120" y="95" font-family="'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="900" fill="#00f0ff" letter-spacing="2">⚡ DENALERTS</text>
  <text x="340" y="94" font-family="'Segoe UI', Roboto, sans-serif" font-size="18" font-weight="600" fill="#94a3b8">|  OFFICIAL STEP-BY-STEP SETUP GUIDE</text>
  <rect x="1560" y="65" width="240" height="40" rx="20" fill="url(#accentGrad)"/>
  <text x="1680" y="91" font-family="'Segoe UI', Roboto, sans-serif" font-size="14" font-weight="900" fill="#000" text-anchor="middle" letter-spacing="1.5">COMPLETE TUTORIAL</text>

  <!-- Main Left Content Box -->
  <g transform="translate(100, 200)">
    <!-- Chapter Tag Badge -->
    <rect x="0" y="0" width="240" height="38" rx="19" fill="rgba(0,240,255,0.12)" stroke="${chap.accent}" stroke-width="1.5"/>
    <text x="120" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-size="13" font-weight="900" fill="${chap.accent}" text-anchor="middle" letter-spacing="2">${escapeXml(chap.tag)}</text>

    <!-- Main Title -->
    <text x="0" y="110" font-family="'Segoe UI', Roboto, sans-serif" font-size="54" font-weight="900" fill="#ffffff" letter-spacing="0.5">${escapeXml(chap.title)}</text>
    
    <!-- Subtitle -->
    <text x="0" y="165" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="500" fill="#94a3b8">${escapeXml(chap.sub)}</text>

    <!-- Key Benefit Pills / Feature List -->
    <g transform="translate(0, 235)">
      <!-- Bullet 1 -->
      <rect x="0" y="0" width="800" height="74" rx="12" fill="#0c1222" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
      <rect x="0" y="0" width="6" height="74" rx="3" fill="${chap.accent}"/>
      <text x="30" y="45" font-family="'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet1)}</text>

      <!-- Bullet 2 -->
      <rect x="0" y="94" width="800" height="74" rx="12" fill="#0c1222" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
      <rect x="0" y="94" width="6" height="74" rx="3" fill="#3b82f6"/>
      <text x="30" y="139" font-family="'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet2)}</text>

      <!-- Bullet 3 -->
      <rect x="0" y="188" width="800" height="74" rx="12" fill="#0c1222" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
      <rect x="0" y="188" width="6" height="74" rx="3" fill="#10b981"/>
      <text x="30" y="233" font-family="'Segoe UI', Roboto, sans-serif" font-size="21" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet3)}</text>
    </g>
  </g>

  <!-- Right Side Visual Card Mockup -->
  <g transform="translate(1080, 240)">
    ${getRightMockupSVG(chap)}
  </g>

  <!-- Bottom Timeline & Status Indicator -->
  <g transform="translate(100, 950)">
    <rect x="0" y="0" width="1720" height="8" rx="4" fill="rgba(255,255,255,0.1)"/>
    <rect x="0" y="0" width="${(parseInt(chap.num,10)/6)*1720}" height="8" rx="4" fill="url(#accentGrad)"/>
    <text x="0" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="#94a3b8">DENALERTS OFFICIAL SETUP WALKTHROUGH</text>
    <text x="1720" y="35" font-family="'Segoe UI', Roboto, sans-serif" font-size="15" font-weight="700" fill="${chap.accent}" text-anchor="end">STEP ${chap.num} OF 06</text>
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
    <text x="40" y="58" font-family="'Segoe UI', Roboto, sans-serif" font-size="34" font-weight="900" fill="#00f0ff" letter-spacing="2">⚡ DENALERTS</text>
    <rect x="740" y="20" width="180" height="50" rx="25" fill="url(#accentGradV)"/>
    <text x="830" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="#000" text-anchor="middle">STEP-BY-STEP</text>
  </g>

  <!-- Chapter Indicator -->
  <g transform="translate(60, 240)">
    <rect x="0" y="0" width="280" height="44" rx="22" fill="rgba(0,240,255,0.12)" stroke="${chap.accent}" stroke-width="1.5"/>
    <text x="140" y="28" font-family="'Segoe UI', Roboto, sans-serif" font-size="16" font-weight="900" fill="${chap.accent}" text-anchor="middle" letter-spacing="2">${escapeXml(chap.tag)}</text>
  </g>

  <!-- Main Headline -->
  <g transform="translate(60, 330)">
    <text x="0" y="50" font-family="'Segoe UI', Roboto, sans-serif" font-size="48" font-weight="900" fill="#ffffff" letter-spacing="1">${escapeXml(chap.title)}</text>
    <text x="0" y="105" font-family="'Segoe UI', Roboto, sans-serif" font-size="22" font-weight="500" fill="#94a3b8">${escapeXml(chap.sub)}</text>
  </g>

  <!-- Scaled Mockup Graphic -->
  <g transform="translate(170, 520) scale(0.95)">
    ${getRightMockupSVG(chap)}
  </g>

  <!-- 3 Big Feature Highlights (Reels / Shorts Format) -->
  <g transform="translate(60, 1220)">
    <rect x="0" y="0" width="960" height="100" rx="16" fill="#0d1424" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <rect x="0" y="0" width="8" height="100" rx="4" fill="${chap.accent}"/>
    <text x="40" y="60" font-family="'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet1)}</text>

    <rect x="0" y="125" width="960" height="100" rx="16" fill="#0d1424" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <rect x="0" y="125" width="8" height="100" rx="4" fill="#3b82f6"/>
    <text x="40" y="185" font-family="'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet2)}</text>

    <rect x="0" y="250" width="960" height="100" rx="16" fill="#0d1424" stroke="rgba(255,255,255,0.08)" stroke-width="1.5"/>
    <rect x="0" y="250" width="8" height="100" rx="4" fill="#10b981"/>
    <text x="40" y="310" font-family="'Segoe UI', Roboto, sans-serif" font-size="24" font-weight="700" fill="#f8fafc">${escapeXml(chap.bullet3)}</text>
  </g>

  <!-- Footer Call To Action Bar -->
  <g transform="translate(60, 1680)">
    <rect x="0" y="0" width="960" height="120" rx="24" fill="url(#accentGradV)"/>
    <text x="480" y="52" font-family="'Segoe UI', Roboto, sans-serif" font-size="26" font-weight="900" fill="#000" text-anchor="middle">START RECEIVING 0% UPI ALERTS TODAY</text>
    <text x="480" y="90" font-family="'Segoe UI', Roboto, sans-serif" font-size="20" font-weight="700" fill="#1e1b4b" text-anchor="middle">👉 Visit alerts.denbooks.in to register free</text>
  </g>
</svg>`;
}

async function renderSVGToPNG(svgString, outputPath, width) {
  const resvg = new Resvg(svgString, { fitTo: { mode: 'width', value: width } });
  const pngData = resvg.render();
  fs.writeFileSync(outputPath, pngData.asPng());
}

async function buildTutorialVideo() {
  console.log('🚀 Starting DenAlerts Master Tutorial Video Build...');

  const partFilesLandscape = [];
  const partFilesVertical = [];

  for (let i = 0; i < CHAPTERS.length; i++) {
    const chap = CHAPTERS[i];
    console.log(`\n🎬 Processing Chapter ${chap.num}: ${chap.title}...`);

    // 1. Fetch TTS Audio
    const audioPath = path.join(TMP_DIR, `audio_${chap.num}.mp3`);
    console.log(` - Fetching Voiceover Audio (${chap.narration.length} chars)...`);
    await fetchTTSAudio(chap.narration, audioPath);
    await new Promise(r => setTimeout(r, 600));

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
    console.log(` - Encoding 16:9 Chapter Video (${partL})...`);
    execSync(`"${ffmpegPath}" -loop 1 -i "${pngL}" -i "${audioPath}" -c:v libx264 -preset ultrafast -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -y "${partL}"`, { stdio: 'ignore' });
    partFilesLandscape.push(partL);

    // 5. Render Chapter Video Part (Vertical 9:16)
    const partV = path.join(TMP_DIR, `part_V_${chap.num}.mp4`);
    console.log(` - Encoding 9:16 Chapter Reel Video (${partV})...`);
    execSync(`"${ffmpegPath}" -loop 1 -i "${pngV}" -i "${audioPath}" -c:v libx264 -preset ultrafast -tune stillimage -c:a aac -b:a 192k -pix_fmt yuv420p -shortest -y "${partV}"`, { stdio: 'ignore' });
    partFilesVertical.push(partV);
  }

  // 6. Concatenate Landscape Chapters into Master YouTube MP4
  const listFilePathL = path.join(TMP_DIR, 'concat_list_L.txt');
  fs.writeFileSync(listFilePathL, partFilesLandscape.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'));

  const finalYouTubeMP4 = path.join(DOWNLOADS_DIR, 'DenAlerts_Setup_Tutorial.mp4');
  console.log(`\n🎥 Concatenating Final 16:9 YouTube Tutorial: ${finalYouTubeMP4}...`);
  execSync(`"${ffmpegPath}" -f concat -safe 0 -i "${listFilePathL}" -c copy -y "${finalYouTubeMP4}"`, { stdio: 'inherit' });

  // 7. Concatenate Vertical Chapters into Master Instagram Reels MP4
  const listFilePathV = path.join(TMP_DIR, 'concat_list_V.txt');
  fs.writeFileSync(listFilePathV, partFilesVertical.map(f => `file '${f.replace(/\\/g, '/')}'`).join('\n'));

  const finalReelMP4 = path.join(DOWNLOADS_DIR, 'DenAlerts_Setup_Reel.mp4');
  console.log(`\n📱 Concatenating Final 9:16 Instagram Reel Video: ${finalReelMP4}...`);
  execSync(`"${ffmpegPath}" -f concat -safe 0 -i "${listFilePathV}" -c copy -y "${finalReelMP4}"`, { stdio: 'inherit' });

  // Also maintain backwards compatibility with existing links
  const legacyYouTubeMP4 = path.join(DOWNLOADS_DIR, 'SRB_STUDIOS_StreamAlerts_Tutorial.mp4');
  const legacyReelMP4 = path.join(DOWNLOADS_DIR, 'SRB_STUDIOS_StreamAlerts_Reel.mp4');
  fs.copyFileSync(finalYouTubeMP4, legacyYouTubeMP4);
  fs.copyFileSync(finalReelMP4, legacyReelMP4);

  console.log('\n✅ ALL TUTORIAL VIDEOS GENERATED SUCCESSFULLY!');
  console.log(' - YouTube 16:9 Landscape MP4:', finalYouTubeMP4, `(${Math.round(fs.statSync(finalYouTubeMP4).size / 1024)} KB)`);
  console.log(' - Instagram Reels 9:16 Vertical MP4:', finalReelMP4, `(${Math.round(fs.statSync(finalReelMP4).size / 1024)} KB)`);
}

buildTutorialVideo().catch(err => {
  console.error('❌ Build failed:', err);
  process.exit(1);
});
