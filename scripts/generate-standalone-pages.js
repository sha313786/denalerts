const fs = require('fs');
const path = require('path');

const baseDir = path.resolve(__dirname, '..');
const publicDir = path.join(baseDir, 'public');

// Common Head Components
function getHead(title, description, pathUrl) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - DenAlerts</title>
  <meta name="description" content="${description}">
  <link rel="canonical" href="https://alerts.denbooks.in${pathUrl}">
  <meta name="robots" content="index, follow">

  <!-- Open Graph -->
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://alerts.denbooks.in${pathUrl}">
  <meta property="og:site_name" content="SRB STUDIOS">
  <meta property="og:title" content="${title} - DenAlerts">
  <meta property="og:description" content="${description}">
  <meta property="og:image" content="https://alerts.denbooks.in/og-banner.png">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta name="theme-color" content="#6366f1">

  <link rel="icon" type="image/svg+xml" href="/denalerts-logo.svg">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Sora:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@500;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/landing.css?v=44">
  <style>
    .page-hero-header {
      padding: 130px 0 40px;
      text-align: center;
    }
    .page-hero-header .section-meta-tag {
      margin-bottom: 12px;
      display: inline-block;
    }
    .page-hero-header .section-heading {
      font-size: clamp(32px, 4.5vw, 48px);
      font-weight: 800;
      color: #fff;
      margin-bottom: 14px;
      letter-spacing: -0.02em;
    }
    .page-hero-header .section-description {
      font-size: clamp(15px, 1.8vw, 17px);
      color: var(--text-secondary);
      max-width: 680px;
      margin: 0 auto;
      line-height: 1.6;
    }
    .nav-menu a.active {
      color: #00f0ff !important;
      text-shadow: 0 0 12px rgba(0, 240, 255, 0.6);
    }
  </style>
</head>
<body>

  <!-- Ambient Glow -->
  <div class="ambient-glow-sphere sphere-1"></div>
  <div class="ambient-glow-sphere sphere-2"></div>
  <div class="ambient-glow-sphere sphere-3"></div>
`;
}

// Common Navigation Bar
function getNavbar(activePage) {
  return `
  <!-- Navigation -->
  <nav class="navbar scrolled" id="main-nav">
    <div class="container nav-wrap">
      <a href="/" class="nav-brand">
        <div class="brand-icon-box">
          <img src="/denalerts-logo.svg" alt="DenAlerts Logo" width="24" height="24">
        </div>
        <div class="brand-name">Den<span>Alerts</span></div>
        <span class="brand-version-pill">v2.5</span>
      </a>

      <ul class="nav-menu">
        <li><a href="/" class="${activePage === 'home' ? 'active' : ''}">Home</a></li>
        <li><a href="/about" class="${activePage === 'about' ? 'active' : ''}">About</a></li>
        <li><a href="/features" class="${activePage === 'features' ? 'active' : ''}">Features</a></li>
        <li><a href="/pricing" class="${activePage === 'pricing' ? 'active' : ''}">Pricing</a></li>
        <li><a href="/tutorial" class="${activePage === 'tutorial' ? 'active' : ''}">Tutorial</a></li>
        <li><a href="/faq" class="${activePage === 'faq' ? 'active' : ''}">FAQ</a></li>
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
          <svg width="15" height="15" viewBox="0 0 24 24" fill="#5865F2" style="vertical-align:middle; margin-right:4px;">
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
`;
}

// Common Footer
function getFooter() {
  return `
  <!-- Developer & Community Support Section -->
  <section class="dev-support-section" id="developer-support" style="margin-top:40px;">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag" style="color:#ec4899;">Developer &amp; Support</span>
        <h2 class="section-heading">Backed by SRB STUDIOS &bull; Built For Creators</h2>
        <p class="section-description">
          DenAlerts is actively maintained with rapid updates whenever UPI apps push notification changes.
        </p>
      </div>

      <div class="support-cards-grid">
        <div class="developer-card">
          <div>
            <div class="dev-profile-header">
              <div class="dev-avatar-circle">SRB</div>
              <div class="dev-info">
                <h3>SRB STUDIOS</h3>
                <p>Developer of DenAlerts &bull; <a href="https://denbooks.in" target="_blank" style="color:var(--accent-cyan); text-decoration:none;">denbooks.in</a></p>
              </div>
            </div>
            <p class="dev-note-text">
              "We maintain DenAlerts actively. When UPI apps roll out Android UI changes or update notification formats, we push rapid companion app patches to keep your stream alerts flawless."
            </p>
          </div>
          <div class="dev-links-row">
            <a href="mailto:support@denbooks.in" class="dev-link" title="Email Developer">
              ✉️ support@denbooks.in
            </a>
            <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="dev-link">
              💬 Discord Support
            </a>
            <a href="https://denbooks.in" target="_blank" class="dev-link" style="color:var(--text-tertiary);">
              🌐 denbooks.in Suite
            </a>
          </div>
        </div>

        <div class="discord-widget-card">
          <div>
            <div class="discord-widget-header">
              <div class="discord-widget-brand">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#5865F2">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
                <span style="font-weight:800; font-size:15px; color:#fff;">Discord Community</span>
              </div>
              <div class="discord-online-pill">
                <span class="discord-online-dot"></span>
                <span>Active Server</span>
              </div>
            </div>
            <h3>Connect With Fellow Streamers on Discord</h3>
            <p>
              Join the official DenAlerts Discord for real-time setup troubleshooting, APK update drops, stream overlay sharing, and feature discussions.
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

  <!-- Reference-Matched Footer -->
  <footer class="site-footer">
    <div class="container">
      <div class="footer-ref-grid">
        <div>
          <div class="footer-brand-title">DenAlerts</div>
          <p class="footer-brand-text">
            DenAlerts is Platform as service which monitor notification on your mobile app and email/webhook monitoring to send alert to your Streamlab, Streamelements, and OBS Studio setups. A MUST have application for every streamer. Simple to use and Easy to setup. Google Pay, Paytm, Phonepe, BHIM UPI, Paytm Business, Fampay, BharatPe, Gpay Business, PhonePe Business, and bank SMS direct to your live stream.
          </p>
        </div>

        <div>
          <div class="footer-col-header">USEFUL LINKS</div>
          <ul class="footer-ref-links">
            <li><a href="/"><span class="footer-ref-arrow">&rsaquo;</span> Home</a></li>
            <li><a href="/about"><span class="footer-ref-arrow">&rsaquo;</span> About Us</a></li>
            <li><a href="/features"><span class="footer-ref-arrow">&rsaquo;</span> Features</a></li>
            <li><a href="/pricing"><span class="footer-ref-arrow">&rsaquo;</span> Pricing</a></li>
            <li><a href="/tutorial"><span class="footer-ref-arrow">&rsaquo;</span> Setup Guide &amp; Tutorial</a></li>
            <li><a href="/faq"><span class="footer-ref-arrow">&rsaquo;</span> FAQ</a></li>
            <li><a href="/terms"><span class="footer-ref-arrow">&rsaquo;</span> Terms of Service</a></li>
            <li><a href="/privacy"><span class="footer-ref-arrow">&rsaquo;</span> Privacy Policy</a></li>
            <li><a href="/refund-and-cancellation"><span class="footer-ref-arrow">&rsaquo;</span> Cancellation &amp; Refund</a></li>
          </ul>
        </div>

        <div>
          <div class="footer-col-header">CONTACT US</div>
          <div class="footer-ref-contact">
            <div class="footer-email-reveal-wrap">
              For Email : <a href="mailto:support@denbooks.in" class="footer-email-link" title="Click to email support">support@denbooks.in</a>
            </div>
            <div class="footer-dev-address">
              <strong>SRB STUDIOS</strong><br>
              Developer of DenAlerts &bull; denbooks.in<br>
              You can contact us on Discord as well.
            </div>
            <div class="footer-social-row">
              <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="footer-social-btn" title="Join Discord">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a>
              <a href="mailto:support@denbooks.in" class="footer-social-btn" title="Send Email">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                  <polyline points="22,6 12,13 2,6"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom-bar">
        <div>
          &copy; 2026 DenAlerts &bull; Operated by <strong>SRB STUDIOS</strong> (<a href="https://denbooks.in" target="_blank" style="color:#818cf8; text-decoration:none;">denbooks.in</a>). All rights reserved.
        </div>
        <div>
          Universal 0% Platform Commission UPI Alert System for Indian Broadcasters.
        </div>
      </div>
    </div>
  </footer>

  <script>
    const navbar = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
      if (window.scrollY > 20) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });
  </script>
</body>
</html>
`;
}

// 1. Build About Page
function buildAboutPage() {
  const head = getHead(
    "About DenAlerts - 0% Commission UPI Live Stream Platform",
    "Discover DenAlerts by SRB STUDIOS. Purpose-built zero commission UPI donation alerts, companion notification tools, and OBS overlay system for Indian gaming broadcasters.",
    "/about"
  );
  const navbar = getNavbar("about");

  const body = `
  <header class="page-hero-header">
    <div class="container">
      <span class="section-meta-tag">ABOUT DENALERTS</span>
      <h1 class="section-heading">Purpose-Built Live Alerts for Indian Creators</h1>
      <p class="section-description">
        DenAlerts was developed by SRB STUDIOS to eliminate unfair 5%–30% platform commission cuts. 100% of your viewer donations go directly to your personal bank account via NPCI UPI with instant OBS overlay notifications.
      </p>
    </div>
  </header>

  <section class="about-section" id="about" style="padding-top:10px;">
    <div class="container">
      <div class="about-grid">
        <div class="about-promo-card">
          <div>
            <h3>Make every stream more engaging.</h3>
            <p>Bring supported UPI payment alerts into your creator workflow with a simple, purpose-built alert solution.</p>
          </div>
          <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="about-discord-btn">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
            </svg>
            <span>Join our Discord</span>
          </a>
        </div>

        <div class="about-content-box">
          <div class="about-eyebrow">ABOUT DENALERTS</div>
          <h2 class="about-heading">A Purpose-Built Donation Alert Tool for Live Streamers</h2>
          <p class="about-desc-lead">
            DenAlerts helps creators display real-time UPI payment alerts during live streams. The lightweight Android companion app syncs incoming transaction notifications with your OBS Studio or Streamlabs browser source with sub-second latency.
          </p>
          <p class="about-desc-sub">
            Before using the service, review the setup instructions and test your UPI payment alert setup with our live simulator or test mode.
          </p>
          <ul class="about-checklist">
            <li>
              <span class="about-bullet-dot"></span>
              <span>Designed specifically for creators and live-streaming communities across India.</span>
            </li>
            <li>
              <span class="about-bullet-dot"></span>
              <span>Supports a wide range of popular Indian UPI payment apps (Google Pay, PhonePe, Paytm, BHIM).</span>
            </li>
            <li>
              <span class="about-bullet-dot"></span>
              <span>Provides access to step-by-step setup guidance, video tutorials, and direct community support.</span>
            </li>
            <li class="about-compliance-tag">
              <span class="about-bullet-dot" style="background:#f59e0b;"></span>
              <span><strong>Compliance Notice:</strong> DenAlerts does not provide subscriber, follower, view, or watch-hour growth services.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </section>

  <!-- Technical Integrity & Security Principles -->
  <section class="two-ways-section" style="padding:40px 0 60px;">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">CORE ARCHITECTURE</span>
        <h2 class="section-heading">How DenAlerts Protects Streamers</h2>
        <p class="section-description">
          Engineered for privacy, zero wallet lock-in, and instant bank settlement.
        </p>
      </div>

      <div class="two-ways-grid">
        <div class="two-ways-card">
          <div class="two-ways-step-num">01</div>
          <h3>100% Peer-to-Peer UPI Settlement</h3>
          <p>
            Unlike middleman services that hold your funds in an escrow wallet and deduct high fees, DenAlerts never touches your money. Viewers scan your personal UPI QR code, and funds move directly from bank to bank via official NPCI UPI rails.
          </p>
        </div>

        <div class="two-ways-card">
          <div class="two-ways-step-num">02</div>
          <h3>Zero Banking Credentials Needed</h3>
          <p>
            DenAlerts operates purely as a notification bridge. We never ask for, access, or store your bank passwords, debit cards, OTPs, or UPI PINs. The Android app only inspects credit notifications when you turn on Live Stream Mode.
          </p>
        </div>

        <div class="two-ways-card">
          <div class="two-ways-step-num">03</div>
          <h3>Active Developer Maintenance</h3>
          <p>
            Whenever PhonePe, GPay, or Paytm update their Android notification layouts, SRB STUDIOS deploys immediate companion app patches to ensure your stream alerts remain uninterrupted.
          </p>
        </div>
      </div>
    </div>
  </section>
  `;

  return head + navbar + body + getFooter();
}

// 2. Build Features Page
function buildFeaturesPage() {
  const head = getHead(
    "Features & Streamer Toolkit - DenAlerts OBS Overlays",
    "Explore DenAlerts features: custom sound alertboxes, Indian voice TTS, live goal progress bars, OBS custom docks, and Streamlabs event relay.",
    "/features"
  );
  const navbar = getNavbar("features");

  const body = `
  <header class="page-hero-header">
    <div class="container">
      <span class="section-meta-tag">STREAMER TOOLKIT</span>
      <h1 class="section-heading">Built Specially for the OBS Stream Screen</h1>
      <p class="section-description">
        Everything Indian creators need to engage their live stream audience with professional on-screen widgets, custom sound chimes, and regional synthetic voice speech.
      </p>
    </div>
  </header>

  <section class="toolkit-section" id="features" style="padding-top:10px;">
    <div class="container">
      <div class="toolkit-grid">
        <div class="toolkit-card">
          <div class="toolkit-icon-box">🎨</div>
          <h3>Custom Alertbox + TTS</h3>
          <p>
            Upload GIFs, WebM videos, and custom sounds. Enable Hindi/English TTS with Indian regional voice accents that read viewer messages aloud on stream.
          </p>
        </div>

        <div class="toolkit-card">
          <div class="toolkit-icon-box">🎯</div>
          <h3>Live Donation Goals</h3>
          <p>
            Set a custom target amount, goal title, accent gradient, and progress bar to motivate your community to support stream milestones.
          </p>
        </div>

        <div class="toolkit-card">
          <div class="toolkit-icon-box">👑</div>
          <h3>Top Supporters Leaderboard</h3>
          <p>
            Reward your biggest fans with dynamic top tipper widgets. Features real-time monthly rankings and supporter badges.
          </p>
        </div>

        <div class="toolkit-card">
          <div class="toolkit-icon-box">📜</div>
          <h3>Recent Tips Overlay</h3>
          <p>
            Show continuous recent donations as sleek spotlight cards, compact pills, or ticker overlays directly on your stream scene.
          </p>
        </div>

        <div class="toolkit-card">
          <div class="toolkit-icon-box">🔌</div>
          <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
            <h3 style="margin-bottom:0;">Streamlabs &amp; StreamElements</h3>
            <span style="background:linear-gradient(135deg, #6366f1, #8b5cf6); color:#fff; font-size:10px; font-weight:800; padding:2px 8px; border-radius:99px; letter-spacing:0.5px;">PRO</span>
          </div>
          <p>
            Connect your existing Streamlabs or StreamElements setups in one click. DenAlerts Pro seamlessly pushes live UPI payment events to your external overlays.
          </p>
        </div>

        <div class="toolkit-card">
          <div class="toolkit-icon-box">🖥️</div>
          <h3>OBS Custom Activity Dock</h3>
          <p>
            Keep a real-time activity dock open inside OBS Studio so you can read tips, donor names, and messages while gaming without alt-tabbing.
          </p>
        </div>
      </div>
    </div>
  </section>

  <!-- Supported Apps -->
  <section class="supported-section" id="apps" style="padding:40px 0;">
    <div class="container">
      <div class="supported-header">Supported UPI Applications &amp; Indian Banking SMS</div>
      <div class="supported-marquee">
        <div class="supported-track">
          <div class="app-chip"><span class="app-chip-icon">⚡</span> Google Pay (GPay)</div>
          <div class="app-chip"><span class="app-chip-icon">💜</span> PhonePe UPI</div>
          <div class="app-chip"><span class="app-chip-icon">💙</span> Paytm Payments Bank</div>
          <div class="app-chip"><span class="app-chip-icon">🇮🇳</span> BHIM NPCI UPI</div>
          <div class="app-chip"><span class="app-chip-icon">🏦</span> HDFC, SBI, ICICI, Axis SMS</div>
          <div class="app-chip"><span class="app-chip-icon">💼</span> Paytm / PhonePe Merchant</div>
        </div>
      </div>
    </div>
  </section>

  <!-- Interactive Live Demo Section -->
  <section class="watch-it-work-section" id="watch-it-work">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">INTERACTIVE SIMULATOR</span>
        <h2 class="section-heading">Test Drive the Alert Box Right Now</h2>
        <p class="section-description">
          Click any preset button below to simulate an incoming superchat on the OBS broadcast frame.
        </p>
      </div>

      <div class="simulator-wrapper">
        <div class="stream-frame">
          <div class="stream-header-bar">
            <div class="window-dots">
              <span class="dot red"></span>
              <span class="dot yellow"></span>
              <span class="dot green"></span>
            </div>
            <div class="stream-title-text">OBS Studio 1080p60 Canvas &bull; DenAlerts Overlay Output</div>
            <div class="rec-badge"><span class="rec-dot"></span> LIVE 60 FPS</div>
          </div>

          <div class="stream-canvas" id="canvas-area">
            <div class="live-alert-card" id="demo-alert-card">
              <div class="alert-top-row">
                <span class="alert-app-badge" id="demo-badge"><span>PhonePe UPI</span></span>
                <span class="alert-live-tag">LIVE SUPERCHAT</span>
              </div>
              <div class="alert-body">
                <div class="alert-avatar" id="demo-avatar">₹</div>
                <div class="alert-details">
                  <div class="alert-donor-name" id="demo-donor">Rahul Sharma</div>
                  <div class="alert-amount" id="demo-amount">₹500</div>
                  <div class="alert-message" id="demo-message">"OP 1v4 clutch in pochinki bhai! Stream highlights worth it 🔥"</div>
                </div>
              </div>
              <div class="alert-waveform-row">
                <div class="waveform-label">INDIAN VOICE TTS</div>
                <div class="waveform-bars" id="waveform-bars">
                  <span></span><span></span><span></span><span></span><span></span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="simulator-controls-card">
          <h3>Simulate Incoming Superchat</h3>
          <p style="font-size:13.5px; color:var(--text-secondary); margin-bottom:16px;">
            Choose a quick preset or type custom values to test on-screen alert rendering.
          </p>

          <div class="preset-buttons-row">
            <button type="button" class="btn-preset active" data-donor="Rahul Sharma" data-amount="500" data-app="PhonePe" data-note="OP 1v4 clutch in pochinki bhai! 🔥">₹500 PhonePe</button>
            <button type="button" class="btn-preset" data-donor="Sneha Patel" data-amount="200" data-app="Google Pay" data-note="Love the stream vibes! Always watching from Mumbai 💜">₹200 GPay</button>
            <button type="button" class="btn-preset" data-donor="Vikramaditya" data-amount="2000" data-app="Paytm" data-note="Tournament winning celebration fund! Let's go team India 🇮🇳">₹2,000 Paytm</button>
          </div>

          <div class="sim-input-grid">
            <div class="sim-field">
              <label>Donor Name</label>
              <input type="text" id="sim-donor" class="sim-input" value="Aakash Verma">
            </div>
            <div class="sim-field">
              <label>Amount (₹)</label>
              <input type="number" id="sim-amount" class="sim-input" value="100">
            </div>
            <div class="sim-field">
              <label>App Source</label>
              <select id="sim-app" class="sim-input">
                <option value="PhonePe">PhonePe</option>
                <option value="Google Pay">Google Pay</option>
                <option value="Paytm">Paytm</option>
                <option value="BHIM UPI">BHIM UPI</option>
              </select>
            </div>
            <div class="sim-field" style="grid-column: 1 / -1;">
              <label>Superchat Note</label>
              <input type="text" id="sim-note" class="sim-input" value="Next match play sniper only challenge! GG bhai 🎯">
            </div>
          </div>

          <button type="button" id="btn-fire-test" class="btn btn-primary" style="width:100%; justify-content:center; margin-top:8px;">
            <span>Trigger Live Alert on Screen</span>
          </button>
        </div>
      </div>
    </div>
  </section>

  <!-- Audio Element -->
  <audio id="demo-chime" src="/alert.wav" preload="auto"></audio>

  <script>
    const demoCard = document.getElementById('demo-alert-card');
    const demoDonor = document.getElementById('demo-donor');
    const demoAmount = document.getElementById('demo-amount');
    const demoMessage = document.getElementById('demo-message');
    const demoBadge = document.getElementById('demo-badge');
    const waveform = document.getElementById('waveform-bars');
    const demoChime = document.getElementById('demo-chime');

    function fireAlert(donor, amount, app, note) {
      demoDonor.textContent = donor;
      demoAmount.textContent = '₹' + amount;
      demoMessage.textContent = '"' + note + '"';
      demoBadge.innerHTML = '<span>' + app + ' UPI</span>';

      demoCard.classList.remove('pop-animate');
      void demoCard.offsetWidth;
      demoCard.classList.add('pop-animate');

      try {
        demoChime.currentTime = 0;
        demoChime.play().catch(() => {});
      } catch (_) {}

      waveform.classList.add('playing');
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utter = new SpeechSynthesisUtterance(donor + ' donated ₹' + amount + '. ' + note);
        utter.onend = () => waveform.classList.remove('playing');
        window.speechSynthesis.speak(utter);
      } else {
        setTimeout(() => waveform.classList.remove('playing'), 2500);
      }
    }

    document.querySelectorAll('.btn-preset').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.btn-preset').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        fireAlert(
          btn.getAttribute('data-donor'),
          btn.getAttribute('data-amount'),
          btn.getAttribute('data-app'),
          btn.getAttribute('data-note')
        );
      });
    });

    document.getElementById('btn-fire-test').addEventListener('click', () => {
      const donor = document.getElementById('sim-donor').value || 'Aakash Verma';
      const amount = document.getElementById('sim-amount').value || '100';
      const app = document.getElementById('sim-app').value;
      const note = document.getElementById('sim-note').value || 'GG bhai!';
      fireAlert(donor, amount, app, note);
    });
  </script>
  `;

  return head + navbar + body + getFooter();
}

// 3. Build Pricing Page
function buildPricingPage() {
  const head = getHead(
    "Pricing & Plans - DenAlerts 0% Commission UPI Superchats",
    "DenAlerts pricing: 100% Free Forever tier for Indian live streamers. Upgrade to Creator Pro for ₹99/mo for unbranded overlays and custom voice models.",
    "/pricing"
  );
  const navbar = getNavbar("pricing");

  const body = `
  <header class="page-hero-header">
    <div class="container">
      <span class="section-meta-tag">PLANS &amp; PRICING</span>
      <h1 class="section-heading">Transparent, Creator-Friendly Pricing</h1>
      <p class="section-description">
        100% of your superchat money stays in your personal bank account on every plan. No percentage cuts, no wallet locks, no hidden deductions.
      </p>
    </div>
  </header>

  <section class="pricing-section" id="pricing" style="padding-top:10px;">
    <div class="container">
      <div class="pricing-grid">
        <!-- Creator Free -->
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
            <li class="dimmed">
              <svg class="cross-svg" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>Custom MP4 Video &amp; GIF meme overlays</span>
            </li>
            <li class="dimmed">
              <svg class="cross-svg" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>Live Goal Progress Bars &amp; Discord Webhook</span>
            </li>
            <li class="dimmed">
              <svg class="cross-svg" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              <span>Streamlabs &amp; StreamElements Event Relay (Pro Only)</span>
            </li>
          </ul>

          <a href="/login" class="btn btn-secondary" style="width:100%; text-align:center;">Start Free Forever</a>
        </div>

        <!-- Creator Pro -->
        <div class="pricing-card featured">
          <span class="card-top-tag">RECOMMENDED FOR STREAMERS</span>
          <div class="plan-tier-name">Creator Pro</div>
          <div class="plan-price-wrap">
            <span class="plan-price">₹99</span>
            <span class="plan-duration">/month</span>
          </div>
          <p class="plan-explanation">
            For esports broadcasters and power creators wanting unbranded overlays and custom voices.
          </p>

          <ul class="plan-features-list">
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>Everything in Free, plus:</strong></span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>Zero Watermarks:</strong> Remove "SRB STUDIOS" branding completely</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>Pro Voice Personas:</strong> Tournament Hype, Deep Bass, Anime &amp; Cyber Synth</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>Custom Voice Pitch &amp; Audio Modulation</strong></span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Custom Sound, GIF &amp; MP4 Video meme uploads</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>On-stream live goal bars (Superchat target tracker)</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Instant Discord Webhook integration</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span><strong>Streamlabs &amp; StreamElements 1-Click Event Relay</strong> (Forward UPI to external overlays)</span>
            </li>
            <li>
              <svg class="check-svg" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>
              <span>Priority ultra-low latency WebSocket pipe</span>
            </li>
          </ul>

          <a href="/login" class="btn btn-primary" style="width:100%; text-align:center;">Upgrade to Creator Pro</a>
        </div>
      </div>
    </div>
  </section>

  <!-- Broadcaster Guarantees -->
  <section class="guarantees-section" id="guarantees" style="padding:40px 0 60px;">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">OUR COMMITMENT</span>
        <h2 class="section-heading">Broadcaster Peace of Mind Guarantees</h2>
        <p class="section-description">
          Built with complete transparency by creators, for creators.
        </p>
      </div>

      <div class="two-ways-grid">
        <div class="two-ways-card">
          <div class="two-ways-step-num">01</div>
          <h3>0% Cut Forever Guarantee</h3>
          <p>
            We will never take a percentage cut of your donations. 100% of viewer money transfers peer-to-peer into your own bank account.
          </p>
        </div>

        <div class="two-ways-card">
          <div class="two-ways-step-num">02</div>
          <h3>7-Day Patch SLA Guarantee</h3>
          <p>
            If an Android or UPI app update disrupts notification reading, our developers deploy an updated APK within 7 business days or refund Pro subscribers.
          </p>
        </div>

        <div class="two-ways-card">
          <div class="two-ways-step-num">03</div>
          <h3>Cancel Anytime With 1 Click</h3>
          <p>
            No minimum lock-in periods or cumbersome cancellation workflows. Cancel Creator Pro anytime directly from your Cockpit.
          </p>
        </div>
      </div>
    </div>
  </section>
  `;

  return head + navbar + body + getFooter();
}

// 4. Build FAQ Page
function buildFaqPage() {
  const head = getHead(
    "FAQ - Frequently Asked Questions - DenAlerts",
    "Frequently asked questions about DenAlerts zero commission UPI alerts for Indian streamers. Setup in OBS, supported UPI apps, security, and banking details.",
    "/faq"
  );
  const navbar = getNavbar("faq");

  const body = `
  <header class="page-hero-header">
    <div class="container">
      <span class="section-meta-tag">FREQUENTLY ASKED QUESTIONS</span>
      <h1 class="section-heading">Got Questions? We've Got Answers.</h1>
      <p class="section-description">
        Everything you need to know about setting up DenAlerts on your gaming stream and receiving direct-to-bank UPI Superchats.
      </p>
    </div>
  </header>

  <section class="faq-section" id="faq" style="padding-top:10px;">
    <div class="container">
      <div class="faq-grid">
        <div class="faq-item active">
          <div class="faq-question">
            <span>How does DenAlerts offer 0% commission?</span>
            <svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            Traditional platforms sit in the middle of transactions, hold funds in an escrow wallet, and deduct 5% to 30%. DenAlerts is a direct notification bridge: your viewers scan your personal UPI QR code directly. The money moves peer-to-peer into your personal bank account, and our companion app detects the transaction to fire the alert on OBS.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Will my personal messages or bank transfers show on stream?</span>
            <svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            No! The Android companion app has a dedicated <strong>Live Stream Mode</strong> toggle. When you're off-stream, it completely ignores notifications. Additionally, our parser only recognizes incoming credits and ignores all outgoing debit messages and personal transactions.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Do I need a commercial GST or merchant account?</span>
            <svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            Not at all. You can use your ordinary personal UPI ID (e.g. from Google Pay, PhonePe, or BHIM) that is linked to your normal savings bank account. No business registration or KYC approval is required.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>How do I add the alerts to OBS Studio?</span>
            <svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            In your DenAlerts Cockpit, you get a unique Overlay URL. In OBS Studio, simply click <strong>+ &gt; Browser Source</strong>, paste the URL, set the resolution to 1920x1080, and check "Shutdown source when not visible". It works instantly!
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Can I use DenAlerts with Streamlabs Desktop or Prism Live?</span>
            <svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            Yes! DenAlerts works seamlessly with OBS Studio, Streamlabs Desktop, Prism Live Studio, vMix, and any broadcasting software that supports standard HTML/CSS browser sources.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Does DenAlerts ask for my bank password or UPI PIN?</span>
            <svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            Never! DenAlerts will never ask for your bank login, debit card details, OTPs, or UPI PINs. The app only listens to incoming transaction notifications that your bank or UPI app displays on your phone.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>What happens if an Indian UPI app changes its notification format?</span>
            <svg class="faq-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            SRB STUDIOS actively monitors UPI application updates. When an app changes its layout, our development team tests and deploys a companion APK patch rapidly to keep your stream alerts functional.
          </div>
        </div>
      </div>
    </div>
  </section>

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
  `;

  return head + navbar + body + getFooter();
}

// Write the files
fs.writeFileSync(path.join(publicDir, 'about.html'), buildAboutPage(), 'utf8');
console.log('Created public/about.html');

fs.writeFileSync(path.join(publicDir, 'features.html'), buildFeaturesPage(), 'utf8');
console.log('Created public/features.html');

fs.writeFileSync(path.join(publicDir, 'pricing.html'), buildPricingPage(), 'utf8');
console.log('Created public/pricing.html');

fs.writeFileSync(path.join(publicDir, 'faq.html'), buildFaqPage(), 'utf8');
console.log('Created public/faq.html');
