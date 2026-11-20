// scripts/rework_all_subpages.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

console.log('Reworking all subpages (features, pricing, tutorial, faq) with Clean Minimal Dark design...');

// ============================================================================
// 1. REWORK features.html
// ============================================================================
const featuresHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Features & Broadcaster Toolkit — DenAlerts</title>
  <meta name="description" content="Explore DenAlerts features: transparent 1080p 60fps OBS overlays, Indian regional voice TTS, live donation goals, and 0% fee UPI alerts for Indian live streamers.">
  <link rel="canonical" href="https://alerts.denbooks.in/features">
  <meta name="robots" content="index, follow">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://alerts.denbooks.in/features">
  <meta property="og:site_name" content="SRB STUDIOS">
  <meta property="og:title" content="Features & Broadcaster Toolkit — DenAlerts">
  <meta property="og:description" content="Transparent 1080p 60fps OBS overlays, Indian regional voice TTS, and direct P2P UPI superchats.">
  <meta property="og:image" content="https://alerts.denbooks.in/og-banner.png">
  <meta name="theme-color" content="#000000">

  <link rel="icon" type="image/svg+xml" href="/denalerts-logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/landing.css?v=55">
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar" id="main-nav">
    <div class="container nav-wrap">
      <a href="/" class="nav-brand">
        <div class="brand-icon-box">
          <img src="/denalerts-logo.svg" alt="DenAlerts Logo" width="22" height="22">
        </div>
        <div class="brand-name">Den<span>Alerts</span></div>
        <span class="brand-version-pill">v2.5</span>
      </a>

      <ul class="nav-menu">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/features" class="active">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/tutorial">Tutorial</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>

      <div class="nav-cta-group">
        <a href="/DenAlerts.apk" download class="btn btn-secondary" title="Download Official Android Companion App">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Get APK</span>
        </a>
        <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="btn btn-secondary" title="Join Discord Community & Live Support">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#5865F2" style="vertical-align:middle;">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Discord</span>
        </a>
        <a href="/login" class="btn btn-primary">
          <span>Open Cockpit</span>
          <svg class="btn-icon" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Header -->
  <header class="page-hero-header">
    <div class="container">
      <span class="section-meta-tag">BROADCASTER TOOLKIT</span>
      <h1 class="section-heading">Engineered for 60fps Live Streaming</h1>
      <p class="section-description">
        Everything Indian creators need to captivate their audience with transparent OBS overlays, bilingual synthetic speech, live donation goal bars, and robust anti-spam filters.
      </p>
    </div>
  </header>

  <!-- Bento Feature Cards Grid -->
  <section class="toolkit-section" style="padding-top:10px;">
    <div class="container">
      <div class="toolkit-grid">
        <!-- 1. Alert Box + TTS -->
        <div class="toolkit-card">
          <div class="toolkit-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ffffff" stroke-width="2" fill="none"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </div>
          <h3>Custom Alertbox + Voice TTS</h3>
          <p>
            Upload GIFs, MP4 memes, and custom sound chimes. Features bilingual speech synthesis that pronounces Indian names and reads donor messages aloud on stream.
          </p>
        </div>

        <!-- 2. Donation Goals -->
        <div class="toolkit-card">
          <div class="toolkit-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ffffff" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          </div>
          <h3>Dynamic Donation Goals</h3>
          <p>
            Motivate your community with live goal progress bars (PC upgrades, charity milestones, gaming setup). Automatically updates the second a viewer scans your QR.
          </p>
        </div>

        <!-- 3. Top Supporters -->
        <div class="toolkit-card">
          <div class="toolkit-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ffffff" stroke-width="2" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <h3>Supporter Leaderboards</h3>
          <p>
            Reward your most loyal supporters with dynamic leaderboards. Features real-time monthly rankings, top tipper crowns, and animated supporter spotlight badges.
          </p>
        </div>

        <!-- 4. Privacy & Live Mode -->
        <div class="toolkit-card">
          <div class="toolkit-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ffffff" stroke-width="2" fill="none"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          </div>
          <h3>Strict Privacy &amp; Live Mode</h3>
          <p>
            The companion app only captures payment events when Live Stream Mode is active. Personal WhatsApp chats, banking OTPs, and personal debits are never broadcast.
          </p>
        </div>

        <!-- 5. Anti-Spam & Filters -->
        <div class="toolkit-card">
          <div class="toolkit-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ffffff" stroke-width="2" fill="none"><circle cx="12" cy="12" r="10"/><line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/></svg>
          </div>
          <h3>Anti-Spam &amp; Word Guard</h3>
          <p>
            Protect your stream from trolls with minimum donation thresholds for voice speech, custom keyword blocklists, and automated profanity suppression.
          </p>
        </div>

        <!-- 6. Streamlabs & External Relay -->
        <div class="toolkit-card">
          <div class="toolkit-icon-box">
            <svg viewBox="0 0 24 24" width="18" height="18" stroke="#ffffff" stroke-width="2" fill="none"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </div>
          <h3>Streamlabs &amp; StreamElements Relay</h3>
          <p>
            Already using custom overlays on Streamlabs or StreamElements? DenAlerts seamlessly pushes live UPI credit webhook events directly into your existing setup.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Supported Payment Rails -->
  <section class="supported-section" style="margin-top:20px;">
    <div class="container">
      <div class="supported-header">Supported UPI Applications &amp; Indian Banking Rails</div>
      <div class="app-cards-flex">
        <div class="app-brand-chip"><span>PhonePe UPI</span></div>
        <div class="app-brand-chip"><span>Google Pay</span></div>
        <div class="app-brand-chip"><span>Paytm UPI</span></div>
        <div class="app-brand-chip"><span>BHIM UPI</span></div>
        <div class="app-brand-chip"><span>Bank SMS (SBI, HDFC, ICICI, Axis)</span></div>
      </div>
    </div>
  </section>

  <!-- Discord & Community -->
  <section class="discord-section">
    <div class="container">
      <div class="discord-widget-card">
        <div>
          <div class="discord-widget-brand">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span style="font-weight:700; font-size:15px; color:#fff;">Official Broadcaster Discord</span>
            <span class="discord-online-pill">
              <span class="discord-online-dot"></span>
              <span>Community Live</span>
            </span>
          </div>
          <h3>Join the Indian Streamer Community</h3>
          <p>
            Get real-time setup troubleshooting, APK update drops, stream overlay asset packs, and direct feature support.
          </p>
        </div>
        <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="btn-join-discord-card">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Join Official Discord</span>
          </a>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-ref-grid">
        <div>
          <div class="footer-brand-title">DenAlerts</div>
          <p class="footer-brand-text">
            DenAlerts is a broadcaster-grade notification relay that monitors Android notifications and bank SMS to trigger instant, transparent alerts in OBS Studio, Streamlabs, and vMix. Zero commission, direct P2P bank settlement.
          </p>
        </div>

        <div>
          <div class="footer-col-header">Platform</div>
          <ul class="footer-ref-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing Plans</a></li>
            <li><a href="/tutorial">Setup Tutorial</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Legal &amp; Policy</div>
          <ul class="footer-ref-links">
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/refund-and-cancellation">Refund &amp; Cancellation</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Community</div>
          <ul class="footer-ref-links">
            <li><a href="https://discord.gg/XyKNuC4hBd" target="_blank">Discord Server</a></li>
            <li><a href="mailto:support@denbooks.in">support@denbooks.in</a></li>
            <li><a href="https://denbooks.in" target="_blank">SRB STUDIOS Suite</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-ref-bottom">
        <div>&copy; 2026 DenAlerts. All rights reserved.</div>
        <div>Engineered with precision by <strong>SRB STUDIOS</strong> (<a href="https://denbooks.in" target="_blank">denbooks.in</a>)</div>
      </div>
    </div>
  </footer>

</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'features.html'), featuresHtml, 'utf8');
console.log('✓ Wrote Clean Minimal Dark public/features.html');

// ============================================================================
// 2. REWORK pricing.html
// ============================================================================
const pricingHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plans & Pricing — DenAlerts 0% Fee UPI Superchats</title>
  <meta name="description" content="DenAlerts pricing: 100% Free Forever tier for Indian live streamers. Upgrade to Creator Pro for ₹99/mo for unbranded overlays and custom voice models.">
  <link rel="canonical" href="https://alerts.denbooks.in/pricing">
  <meta name="robots" content="index, follow">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://alerts.denbooks.in/pricing">
  <meta property="og:site_name" content="SRB STUDIOS">
  <meta property="og:title" content="Plans & Pricing — DenAlerts 0% Fee UPI Superchats">
  <meta property="og:description" content="DenAlerts pricing: 100% Free Forever tier for Indian live streamers. Zero commission, direct P2P bank settlement.">
  <meta property="og:image" content="https://alerts.denbooks.in/og-banner.png">
  <meta name="theme-color" content="#000000">

  <link rel="icon" type="image/svg+xml" href="/denalerts-logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/landing.css?v=55">
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar" id="main-nav">
    <div class="container nav-wrap">
      <a href="/" class="nav-brand">
        <div class="brand-icon-box">
          <img src="/denalerts-logo.svg" alt="DenAlerts Logo" width="22" height="22">
        </div>
        <div class="brand-name">Den<span>Alerts</span></div>
        <span class="brand-version-pill">v2.5</span>
      </a>

      <ul class="nav-menu">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing" class="active">Pricing</a></li>
        <li><a href="/tutorial">Tutorial</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>

      <div class="nav-cta-group">
        <a href="/DenAlerts.apk" download class="btn btn-secondary" title="Download Official Android Companion App">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Get APK</span>
        </a>
        <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="btn btn-secondary" title="Join Discord Community & Live Support">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#5865F2" style="vertical-align:middle;">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Discord</span>
        </a>
        <a href="/login" class="btn btn-primary">
          <span>Open Cockpit</span>
          <svg class="btn-icon" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Header -->
  <header class="page-hero-header">
    <div class="container">
      <span class="section-meta-tag">PLANS &amp; PRICING</span>
      <h1 class="section-heading">Transparent, Creator-Friendly Pricing</h1>
      <p class="section-description">
        100% of your superchat money stays in your personal bank account on every plan. No percentage cuts, no wallet locks, zero hidden deductions.
      </p>
    </div>
  </header>

  <!-- Pricing Cards Grid -->
  <section class="pricing-section" style="padding-top:10px;">
    <div class="container">
      <div class="pricing-grid">
        <!-- Creator Free Tier -->
        <div class="pricing-card">
          <div class="plan-tier-name">Creator Free</div>
          <div class="plan-price-wrap">
            <span class="plan-price">₹0</span>
            <span class="plan-duration">/forever</span>
          </div>
          <p class="plan-explanation">
            The permanent, zero-cost foundation for any Indian live streamer.
          </p>

          <ul class="plan-features-list">
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>0% Platform Commission</strong> direct to your bank</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Unlimited PhonePe, GPay, Paytm superchats</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Transparent 1080p 60fps OBS &amp; Streamlabs overlay</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Companion Android App with 6-digit PIN pairing</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Standard Indian English Voice TTS engine</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>5-layer anti-spam and profanity filter</span>
            </li>
            <li class="dimmed">
              <svg class="cross-svg" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>100% Unbranded (Free displays "SRB STUDIOS" watermark)</span>
            </li>
            <li class="dimmed">
              <svg class="cross-svg" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>Custom Voice Models (Hype, Deep Bass, Anime)</span>
            </li>
          </ul>

          <a href="/login" class="btn btn-secondary" style="width:100%; text-align:center;">Start Free Forever</a>
        </div>

        <!-- Creator Pro Tier -->
        <div class="pricing-card featured">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div class="plan-tier-name" style="margin-bottom:0;">Creator Pro</div>
            <span style="background:rgba(255,255,255,0.1); color:#fff; font-size:10px; font-weight:700; padding:2px 8px; border-radius:99px; letter-spacing:0.5px;">RECOMMENDED</span>
          </div>
          <div class="plan-price-wrap">
            <span class="plan-price">₹99</span>
            <span class="plan-duration">/month</span>
          </div>
          <p class="plan-explanation">
            For serious broadcasters who want completely unbranded overlays and custom soundpacks.
          </p>

          <ul class="plan-features-list">
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>Everything in Free</strong> with 0% platform fee</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>100% Unbranded Overlays</strong> (no watermark)</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Custom Voice Models (Hype Caster, Chill, Anime)</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Custom Video MP4 / WebM meme alerts</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Priority low-latency WebSocket channel</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Discord Superchat notification webhook</span>
            </li>
          </ul>

          <a href="/login" class="btn btn-primary" style="width:100%; text-align:center;">Upgrade to Pro</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Platform Comparison Table -->
  <section class="comparison-section" style="margin-top:40px;">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">FEE COMPARISON</span>
        <h2 class="section-heading">Why Streamers Switch to DenAlerts</h2>
        <p class="section-description">
          See the stark mathematical difference between YouTube Super Chat, traditional alert aggregators, and DenAlerts.
        </p>
      </div>

      <div class="comparison-table-wrap">
        <table class="comparison-table">
          <thead>
            <tr>
              <th style="width:30%;">Feature / Capability</th>
              <th class="col-highlight" style="width:25%;">DenAlerts</th>
              <th style="width:25%;">YouTube Super Chat</th>
              <th style="width:20%;">Streamlabs</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><strong>Platform Commission</strong></td>
              <td class="col-highlight tag-win">0% (Keep 100%)</td>
              <td class="tag-lose">30% Revenue Cut</td>
              <td class="tag-lose">2.9% + ₹30 / txn</td>
            </tr>
            <tr>
              <td><strong>Payout Settlement Time</strong></td>
              <td class="col-highlight tag-win">Instant (0 seconds)</td>
              <td class="tag-lose">Net-30 Days Delay</td>
              <td class="tag-lose">2 - 5 Business Days</td>
            </tr>
            <tr>
              <td><strong>Where Funds Land</strong></td>
              <td class="col-highlight tag-win">Direct into Savings Account</td>
              <td>Google AdSense Escrow</td>
              <td>Payment Gateway Balance</td>
            </tr>
            <tr>
              <td><strong>Setup Requirements</strong></td>
              <td class="col-highlight tag-win">Any Personal UPI ID</td>
              <td class="tag-lose">AdSense KYC &amp; Tax Forms</td>
              <td class="tag-lose">Merchant KYC &amp; GSTIN</td>
            </tr>
            <tr>
              <td><strong>Supported UPI Apps</strong></td>
              <td class="col-highlight tag-win">GPay, PhonePe, Paytm, BHIM</td>
              <td>Credit Cards / Limited UPI</td>
              <td>Cards / Gateways</td>
            </tr>
            <tr>
              <td><strong>TTS &amp; Sound Overlay</strong></td>
              <td class="col-highlight tag-win">Indian Voice &amp; Custom Overlays</td>
              <td class="tag-lose">Chat Text Only</td>
              <td>English Only Defaults</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-ref-grid">
        <div>
          <div class="footer-brand-title">DenAlerts</div>
          <p class="footer-brand-text">
            DenAlerts is a broadcaster-grade notification relay that monitors Android notifications and bank SMS to trigger instant, transparent alerts in OBS Studio, Streamlabs, and vMix. Zero commission, direct P2P bank settlement.
          </p>
        </div>

        <div>
          <div class="footer-col-header">Platform</div>
          <ul class="footer-ref-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing Plans</a></li>
            <li><a href="/tutorial">Setup Tutorial</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Legal &amp; Policy</div>
          <ul class="footer-ref-links">
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/refund-and-cancellation">Refund &amp; Cancellation</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Community</div>
          <ul class="footer-ref-links">
            <li><a href="https://discord.gg/XyKNuC4hBd" target="_blank">Discord Server</a></li>
            <li><a href="mailto:support@denbooks.in">support@denbooks.in</a></li>
            <li><a href="https://denbooks.in" target="_blank">SRB STUDIOS Suite</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-ref-bottom">
        <div>&copy; 2026 DenAlerts. All rights reserved.</div>
        <div>Engineered with precision by <strong>SRB STUDIOS</strong> (<a href="https://denbooks.in" target="_blank">denbooks.in</a>)</div>
      </div>
    </div>
  </footer>

</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'pricing.html'), pricingHtml, 'utf8');
console.log('✓ Wrote Clean Minimal Dark public/pricing.html');

// ============================================================================
// 3. REWORK tutorial.html
// ============================================================================
const tutorialHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Setup Tutorial & Master Walkthrough — DenAlerts</title>
  <meta name="description" content="Step-by-step master video guide to set up DenAlerts zero-commission UPI live stream alerts: register, download companion APK, pair 6-digit PIN, configure OBS overlay, and go live.">
  <link rel="canonical" href="https://alerts.denbooks.in/tutorial">
  <meta name="robots" content="index, follow">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://alerts.denbooks.in/tutorial">
  <meta property="og:site_name" content="SRB STUDIOS">
  <meta property="og:title" content="Setup Tutorial & Master Walkthrough — DenAlerts">
  <meta property="og:description" content="Master video guide and 5-step walkthrough to set up 0% commission UPI stream alerts in OBS Studio in under 3 minutes.">
  <meta property="og:image" content="https://alerts.denbooks.in/og-banner.png">
  <meta name="theme-color" content="#000000">

  <link rel="icon" type="image/svg+xml" href="/denalerts-logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/landing.css?v=55">
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar" id="main-nav">
    <div class="container nav-wrap">
      <a href="/" class="nav-brand">
        <div class="brand-icon-box">
          <img src="/denalerts-logo.svg" alt="DenAlerts Logo" width="22" height="22">
        </div>
        <div class="brand-name">Den<span>Alerts</span></div>
        <span class="brand-version-pill">v2.5</span>
      </a>

      <ul class="nav-menu">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/tutorial" class="active">Tutorial</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>

      <div class="nav-cta-group">
        <a href="/DenAlerts.apk" download class="btn btn-secondary" title="Download Official Android Companion App">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Get APK</span>
        </a>
        <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="btn btn-secondary" title="Join Discord Community & Live Support">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#5865F2" style="vertical-align:middle;">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Discord</span>
        </a>
        <a href="/login" class="btn btn-primary">
          <span>Open Cockpit</span>
          <svg class="btn-icon" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Header -->
  <header class="page-hero-header">
    <div class="container">
      <span class="section-meta-tag">SETUP WALKTHROUGH</span>
      <h1 class="section-heading">Get Started in Under 3 Minutes</h1>
      <p class="section-description">
        Watch our 1080p master walkthrough video or follow the 5 simple steps below to connect your personal UPI QR code to OBS Studio.
      </p>
    </div>
  </header>

  <!-- Video Player Box -->
  <section style="padding: 10px 0 40px;">
    <div class="container" style="max-width:960px;">
      <div class="video-player-card">
        <div class="video-card-header">
          <div class="video-card-title">
            <span style="width:7px; height:7px; border-radius:50%; background:#10b981; display:inline-block;"></span>
            <span>DenAlerts Setup Masterclass &bull; Official Video Guide</span>
          </div>
          <span class="video-quality-tag">1080p 60fps &bull; English Voiceover</span>
        </div>
        <div style="position:relative; width:100%; aspect-ratio:16/9; background:#000;">
          <video controls preload="metadata" style="width:100%; height:100%; display:block;" poster="/og-banner.png">
            <source src="/downloads/DenAlerts_Setup_Tutorial.mp4" type="video/mp4">
            Your browser does not support the video tag.
          </video>
        </div>
      </div>
    </div>
  </section>

  <!-- 5-Step Cards Grid -->
  <section style="padding: 20px 0 70px;">
    <div class="container">
      <div style="text-align:center; margin-bottom:32px;">
        <span class="section-meta-tag">STEP-BY-STEP</span>
        <h2 class="section-heading">5 Easy Steps to Go Live</h2>
      </div>

      <div style="display:flex; flex-direction:column; gap:16px; max-width:860px; margin:0 auto;">
        <div class="tutorial-step-card">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <span style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px; color:#10b981; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); padding:2px 8px; border-radius:99px;">STEP 01</span>
            <h3 style="margin-bottom:0;">Register &amp; Launch Creator Cockpit</h3>
          </div>
          <p>
            Visit <a href="/login" style="color:#ffffff; font-weight:600;">alerts.denbooks.in/login</a>. Sign in to your dashboard to get your persistent Overlay URL and unique 6-digit companion PIN.
          </p>
        </div>

        <div class="tutorial-step-card">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <span style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px; color:#10b981; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); padding:2px 8px; border-radius:99px;">STEP 02</span>
            <h3 style="margin-bottom:0;">Download &amp; Pair Android Companion APK</h3>
          </div>
          <p>
            Download the official DenAlerts APK (v2.5) on the Android phone where you receive your UPI payments. Enter your 6-digit PIN and tap "Connect".
          </p>
        </div>

        <div class="tutorial-step-card">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <span style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px; color:#10b981; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); padding:2px 8px; border-radius:99px;">STEP 03</span>
            <h3 style="margin-bottom:0;">Add Browser Source into OBS Studio</h3>
          </div>
          <p>
            In OBS Studio, click <strong>+ &gt; Browser</strong> in your Sources pane. Name it "DenAlerts", paste your Overlay URL, set resolution to <strong>1920x1080</strong>, and check "Shutdown source when not visible".
          </p>
        </div>

        <div class="tutorial-step-card">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <span style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px; color:#10b981; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); padding:2px 8px; border-radius:99px;">STEP 04</span>
            <h3 style="margin-bottom:0;">Display Your Personal UPI QR on Stream</h3>
          </div>
          <p>
            Place your personal Google Pay, PhonePe, or Paytm QR code image in your stream scene corner. Viewers scan directly to pay straight into your bank.
          </p>
        </div>

        <div class="tutorial-step-card">
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <span style="font-family:'JetBrains Mono'; font-weight:800; font-size:14px; color:#10b981; background:rgba(16,185,129,0.1); border:1px solid rgba(16,185,129,0.25); padding:2px 8px; border-radius:99px;">STEP 05</span>
            <h3 style="margin-bottom:0;">Toggle Live Stream Mode ON &amp; Go Live!</h3>
          </div>
          <p>
            Whenever you start broadcasting, toggle <strong>Live Stream Mode ON</strong> in the Android app. Incoming tips will fire with instant animated graphics and Indian voice TTS!
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-ref-grid">
        <div>
          <div class="footer-brand-title">DenAlerts</div>
          <p class="footer-brand-text">
            DenAlerts is a broadcaster-grade notification relay that monitors Android notifications and bank SMS to trigger instant, transparent alerts in OBS Studio, Streamlabs, and vMix. Zero commission, direct P2P bank settlement.
          </p>
        </div>

        <div>
          <div class="footer-col-header">Platform</div>
          <ul class="footer-ref-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing Plans</a></li>
            <li><a href="/tutorial">Setup Tutorial</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Legal &amp; Policy</div>
          <ul class="footer-ref-links">
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/refund-and-cancellation">Refund &amp; Cancellation</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Community</div>
          <ul class="footer-ref-links">
            <li><a href="https://discord.gg/XyKNuC4hBd" target="_blank">Discord Server</a></li>
            <li><a href="mailto:support@denbooks.in">support@denbooks.in</a></li>
            <li><a href="https://denbooks.in" target="_blank">SRB STUDIOS Suite</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-ref-bottom">
        <div>&copy; 2026 DenAlerts. All rights reserved.</div>
        <div>Engineered with precision by <strong>SRB STUDIOS</strong> (<a href="https://denbooks.in" target="_blank">denbooks.in</a>)</div>
      </div>
    </div>
  </footer>

</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'tutorial.html'), tutorialHtml, 'utf8');
console.log('✓ Wrote Clean Minimal Dark public/tutorial.html');

// ============================================================================
// 4. REWORK faq.html
// ============================================================================
const faqHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Frequently Asked Questions — DenAlerts</title>
  <meta name="description" content="Answers to common questions about DenAlerts: 0% fee UPI architecture, privacy mode, bank SMS support, and OBS Studio integration.">
  <link rel="canonical" href="https://alerts.denbooks.in/faq">
  <meta name="robots" content="index, follow">

  <meta property="og:type" content="website">
  <meta property="og:url" content="https://alerts.denbooks.in/faq">
  <meta property="og:site_name" content="SRB STUDIOS">
  <meta property="og:title" content="Frequently Asked Questions — DenAlerts">
  <meta property="og:description" content="Everything you need to know about setting up DenAlerts on your gaming stream.">
  <meta property="og:image" content="https://alerts.denbooks.in/og-banner.png">
  <meta name="theme-color" content="#000000">

  <link rel="icon" type="image/svg+xml" href="/denalerts-logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/landing.css?v=55">
</head>
<body>

  <!-- Navigation -->
  <nav class="navbar" id="main-nav">
    <div class="container nav-wrap">
      <a href="/" class="nav-brand">
        <div class="brand-icon-box">
          <img src="/denalerts-logo.svg" alt="DenAlerts Logo" width="22" height="22">
        </div>
        <div class="brand-name">Den<span>Alerts</span></div>
        <span class="brand-version-pill">v2.5</span>
      </a>

      <ul class="nav-menu">
        <li><a href="/">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/tutorial">Tutorial</a></li>
        <li><a href="/faq" class="active">FAQ</a></li>
      </ul>

      <div class="nav-cta-group">
        <a href="/DenAlerts.apk" download class="btn btn-secondary" title="Download Official Android Companion App">
          <svg class="btn-icon" viewBox="0 0 24 24">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Get APK</span>
        </a>
        <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="btn btn-secondary" title="Join Discord Community & Live Support">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#5865F2" style="vertical-align:middle;">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
          </svg>
          <span>Discord</span>
        </a>
        <a href="/login" class="btn btn-primary">
          <span>Open Cockpit</span>
          <svg class="btn-icon" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
      </div>
    </div>
  </nav>

  <!-- Hero Header -->
  <header class="page-hero-header">
    <div class="container">
      <span class="section-meta-tag">FREQUENTLY ASKED QUESTIONS</span>
      <h1 class="section-heading">Frequently Asked Questions</h1>
      <p class="section-description">
        Clear answers about UPI compatibility, bank safety, OBS overlay settings, and 0% fee architecture.
      </p>
    </div>
  </header>

  <!-- FAQ Accordion -->
  <section class="faq-section" style="padding-top:10px;">
    <div class="container">
      <div class="faq-grid">
        <div class="faq-item active">
          <div class="faq-question">
            <span>How does DenAlerts offer 0% commission on donations?</span>
            <svg style="width:16px; height:16px; stroke:currentColor; fill:none;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            Traditional platforms sit in the middle of transactions, hold funds in an escrow wallet, and deduct 5% to 30%. DenAlerts is a direct notification bridge: your viewers scan your personal UPI QR code directly. The money moves peer-to-peer into your personal bank account, and our companion app detects the transaction to fire the alert on OBS.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Will my personal messages, private transfers, or OTPs show on stream?</span>
            <svg style="width:16px; height:16px; stroke:currentColor; fill:none;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            No! The Android companion app features a dedicated <strong>Live Stream Mode</strong> toggle. When you're off-stream, it completely ignores notifications. Additionally, our parser only recognizes incoming verified credits and ignores all outgoing debits and personal chats.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Which Indian UPI apps and banks are supported?</span>
            <svg style="width:16px; height:16px; stroke:currentColor; fill:none;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            DenAlerts supports Google Pay (GPay), PhonePe, Paytm, BHIM UPI, Paytm Business, PhonePe Business, and bank credit SMS notifications from HDFC, SBI, ICICI, Axis, and others.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Do I need a GST number or business merchant account?</span>
            <svg style="width:16px; height:16px; stroke:currentColor; fill:none;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            Not at all. You can use your normal personal savings account and standard UPI QR code. No merchant paperwork, GSTIN, or gateway integration needed.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>How do I add DenAlerts to OBS Studio, Streamlabs, or vMix?</span>
            <svg style="width:16px; height:16px; stroke:currentColor; fill:none;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            In your Creator Cockpit, copy your unique Overlay URL. In OBS Studio, click <strong>+ &gt; Browser Source</strong>, paste the URL, set width to 1920 and height to 1080. It renders with transparent background at 60fps.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Does my Android phone need to stay awake during the stream?</span>
            <svg style="width:16px; height:16px; stroke:currentColor; fill:none;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            No, the companion app runs as an official Android background service with a persistent notification. It continues listening even when the phone screen is turned off or while charging.
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-ref-grid">
        <div>
          <div class="footer-brand-title">DenAlerts</div>
          <p class="footer-brand-text">
            DenAlerts is a broadcaster-grade notification relay that monitors Android notifications and bank SMS to trigger instant, transparent alerts in OBS Studio, Streamlabs, and vMix. Zero commission, direct P2P bank settlement.
          </p>
        </div>

        <div>
          <div class="footer-col-header">Platform</div>
          <ul class="footer-ref-links">
            <li><a href="/">Home</a></li>
            <li><a href="/about">About Us</a></li>
            <li><a href="/features">Features</a></li>
            <li><a href="/pricing">Pricing Plans</a></li>
            <li><a href="/tutorial">Setup Tutorial</a></li>
            <li><a href="/faq">FAQ</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Legal &amp; Policy</div>
          <ul class="footer-ref-links">
            <li><a href="/terms">Terms of Service</a></li>
            <li><a href="/privacy">Privacy Policy</a></li>
            <li><a href="/refund-and-cancellation">Refund &amp; Cancellation</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">Community</div>
          <ul class="footer-ref-links">
            <li><a href="https://discord.gg/XyKNuC4hBd" target="_blank">Discord Server</a></li>
            <li><a href="mailto:support@denbooks.in">support@denbooks.in</a></li>
            <li><a href="https://denbooks.in" target="_blank">SRB STUDIOS Suite</a></li>
          </ul>
        </div>
      </div>

      <div class="footer-ref-bottom">
        <div>&copy; 2026 DenAlerts. All rights reserved.</div>
        <div>Engineered with precision by <strong>SRB STUDIOS</strong> (<a href="https://denbooks.in" target="_blank">denbooks.in</a>)</div>
      </div>
    </div>
  </footer>

  <script>
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
  </script>

</body>
</html>
`;

fs.writeFileSync(path.join(PUBLIC, 'faq.html'), faqHtml, 'utf8');
console.log('✓ Wrote Clean Minimal Dark public/faq.html');

console.log('All 4 subpages successfully reworked!');
