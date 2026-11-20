const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const indexPath = path.join(PUBLIC, 'index.html');

console.log('Rebuilding home page with on-page scroll sections and removing duplicate hub...');

let html = fs.readFileSync(indexPath, 'utf8');

// 1. Update navigation menu on index.html so clicking each link scrolls to that section
const oldNav = `<ul class="nav-menu">
        <li><a href="/" class="active">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/tutorial">Tutorial</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>`;

const newNav = `<ul class="nav-menu">
        <li><a href="#" class="active">Home</a></li>
        <li><a href="#features">Features</a></li>
        <li><a href="#architecture">Architecture</a></li>
        <li><a href="#watch-it-work">Simulator</a></li>
        <li><a href="#comparison">Comparison</a></li>
        <li><a href="#pricing">Pricing</a></li>
        <li><a href="#tutorial">Tutorial</a></li>
        <li><a href="#faq">FAQ</a></li>
      </ul>`;

if (html.includes(oldNav)) {
  html = html.replace(oldNav, newNav);
} else {
  // Regex fallback
  html = html.replace(/<ul class="nav-menu">[\s\S]*?<\/ul>/, newNav);
}

// 2. Remove explore-hub section
const exploreHubRegex = /<!-- Standalone Hub Navigation \(#explore-hub\) -->[\s\S]*?<\/section>/;
const exploreHubRegexAlt = /<section class="hub-section" id="explore-hub">[\s\S]*?<\/section>/;

if (exploreHubRegex.test(html)) {
  html = html.replace(exploreHubRegex, '');
} else if (exploreHubRegexAlt.test(html)) {
  html = html.replace(exploreHubRegexAlt, '');
}

// 3. Define the new dedicated sections: Pricing, Tutorial, FAQ
const additionalSections = `
  <!-- Plans & Pricing Section (#pricing) -->
  <section class="pricing-section" id="pricing" style="padding: 80px 0; border-top: 1px solid var(--border-subtle);">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">PLANS &amp; PRICING</span>
        <h2 class="section-heading">Transparent, Creator-Friendly Pricing</h2>
        <p class="section-description">
          100% of your superchat money stays in your personal bank account on every plan. No percentage cuts, no wallet locks, zero hidden deductions.
        </p>
      </div>

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

  <!-- Step-by-Step Setup Video Guide Section (#tutorial) -->
  <section class="tutorial-section" id="tutorial" style="padding: 80px 0; border-top: 1px solid var(--border-subtle); background: rgba(10, 10, 12, 0.4);">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">QUICK SETUP GUIDE</span>
        <h2 class="section-heading">Go Live in Under 3 Minutes</h2>
        <p class="section-description">
          Follow these three simple steps to connect your personal UPI QR code to OBS Studio.
        </p>
      </div>

      <!-- 3 Step Cards Grid -->
      <div class="bento-grid" style="margin-top: 36px;">
        <div class="bento-card">
          <div class="bento-icon">
            <span style="font-family:'JetBrains Mono'; font-weight:800; font-size:16px;">01</span>
          </div>
          <h3>1. Create Account &amp; Copy URL</h3>
          <p>
            Sign in to your Creator Cockpit. Generate your unique, persistent Browser Source URL and 6-digit companion PIN.
          </p>
        </div>

        <div class="bento-card">
          <div class="bento-icon">
            <span style="font-family:'JetBrains Mono'; font-weight:800; font-size:16px;">02</span>
          </div>
          <h3>2. Install Android Companion</h3>
          <p>
            Download DenAlerts APK on your phone. Enter your 6-digit PIN and toggle <strong>Live Stream Mode ON</strong> to relay payment alerts.
          </p>
        </div>

        <div class="bento-card">
          <div class="bento-icon">
            <span style="font-family:'JetBrains Mono'; font-weight:800; font-size:16px;">03</span>
          </div>
          <h3>3. Add Browser Source in OBS</h3>
          <p>
            In OBS Studio, click <strong>+ &gt; Browser Source</strong>, paste your overlay URL, set resolution to 1920x1080, and start streaming!
          </p>
        </div>
      </div>

      <div style="text-align:center; margin-top:32px;">
        <a href="/tutorial" class="btn btn-secondary">
          <svg class="btn-icon" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
          <span>Watch Full 1080p Video Tutorial</span>
        </a>
      </div>
    </div>
  </section>

  <!-- Frequently Asked Questions Section (#faq) -->
  <section class="faq-section" id="faq" style="padding: 80px 0; border-top: 1px solid var(--border-subtle);">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">FREQUENTLY ASKED QUESTIONS</span>
        <h2 class="section-heading">Frequently Asked Questions</h2>
        <p class="section-description">
          Everything you need to know about setting up DenAlerts on your gaming stream.
        </p>
      </div>

      <div class="faq-grid" style="max-width: 860px; margin: 36px auto 0;">
        <div class="faq-item active">
          <div class="faq-question">
            <span>How does DenAlerts offer 0% commission?</span>
            <svg style="width:16px; height:16px; stroke:currentColor; fill:none;" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"/></svg>
          </div>
          <div class="faq-answer">
            Traditional platforms sit in the middle of transactions, hold funds in an escrow wallet, and deduct 5% to 30%. DenAlerts is a direct notification bridge: your viewers scan your personal UPI QR code directly. The money moves peer-to-peer into your bank account, and our companion app detects the transaction to fire the alert on OBS.
          </div>
        </div>

        <div class="faq-item">
          <div class="faq-question">
            <span>Will my personal messages or private transfers show on stream?</span>
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
      </div>
    </div>
  </section>
`;

// Insert additionalSections right before Discord Section
const discordSectionIndex = html.indexOf('<!-- Discord & Developer Section -->');
if (discordSectionIndex !== -1) {
  html = html.slice(0, discordSectionIndex) + additionalSections + '\n' + html.slice(discordSectionIndex);
} else {
  // Insert before footer
  const footerIndex = html.indexOf('<footer class="site-footer">');
  html = html.slice(0, footerIndex) + additionalSections + '\n' + html.slice(footerIndex);
}

// 4. Ensure FAQ accordion click handler is present in the scripts block
if (!html.includes('document.querySelectorAll(\'.faq-item\')')) {
  const scriptEndIndex = html.lastIndexOf('</script>');
  const faqScript = `
    // FAQ Accordion click handler
    document.querySelectorAll('.faq-item').forEach(item => {
      item.addEventListener('click', () => {
        const isActive = item.classList.contains('active');
        document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
        if (!isActive) {
          item.classList.add('active');
        }
      });
    });
`;
  html = html.slice(0, scriptEndIndex) + faqScript + html.slice(scriptEndIndex);
}

fs.writeFileSync(indexPath, html, 'utf8');
console.log('✓ Successfully rebuilt index.html with smooth scroll sections and no duplicate hub!');
