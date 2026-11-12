const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'index.html');
let html = fs.readFileSync(filePath, 'utf8');

// 1. Remove setup-video-section (#setup-guide)
const setupGuideStart = html.indexOf('<section class="setup-video-section" id="setup-guide">');
const setupGuideEnd = html.indexOf('</section>', setupGuideStart) + '</section>'.length;

if (setupGuideStart !== -1 && setupGuideEnd > setupGuideStart) {
  html = html.substring(0, setupGuideStart) + html.substring(setupGuideEnd);
  console.log('Removed duplicate setup-video-section');
}

// 2. Remove toolkit-section, comparison-section, guarantees-section, about-section, pricing-section, faq-section
const toolkitStart = html.indexOf('<section class="toolkit-section" id="features">');
const devSupportStart = html.indexOf('<section class="dev-support-section" id="developer-support">');

if (toolkitStart !== -1 && devSupportStart > toolkitStart) {
  const hubSection = `
  <!-- Explore Dedicated Pages Hub (No Duplicates) -->
  <section class="two-ways-section" id="explore-hub" style="padding: 50px 0 70px;">
    <div class="container">
      <div style="text-align:center;">
        <span class="section-meta-tag">EXPLORE DENALERTS</span>
        <h2 class="section-heading">Dedicated Broadcaster Hub</h2>
        <p class="section-description">
          Each feature, guide, and pricing plan is now available on its own dedicated standalone page.
        </p>
      </div>

      <div class="two-ways-grid" style="grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-top: 32px;">
        <a href="/features" class="two-ways-card" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="two-ways-step-num" style="font-size:22px; width:48px; height:48px;">🎨</div>
            <h3 style="color:#fff; margin-top:14px; font-size:18px;">Features &amp; Overlays</h3>
            <p style="font-size:14px; color:var(--text-secondary); line-height:1.6; margin:8px 0 16px;">
              Custom alertbox, regional voice TTS, dynamic goal bars, and OBS custom docks.
            </p>
          </div>
          <span style="color:var(--accent-cyan); font-weight:700; font-size:13.5px; display:inline-flex; align-items:center; gap:6px;">
            Open Features Page &rarr;
          </span>
        </a>

        <a href="/pricing" class="two-ways-card" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="two-ways-step-num" style="font-size:22px; width:48px; height:48px;">💳</div>
            <h3 style="color:#fff; margin-top:14px; font-size:18px;">Transparent Pricing</h3>
            <p style="font-size:14px; color:var(--text-secondary); line-height:1.6; margin:8px 0 16px;">
              100% Free Forever tier + Creator Pro at ₹99/mo with zero commission cuts.
            </p>
          </div>
          <span style="color:var(--accent-cyan); font-weight:700; font-size:13.5px; display:inline-flex; align-items:center; gap:6px;">
            Open Pricing Page &rarr;
          </span>
        </a>

        <a href="/tutorial" class="two-ways-card" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="two-ways-step-num" style="font-size:22px; width:48px; height:48px;">📺</div>
            <h3 style="color:#fff; margin-top:14px; font-size:18px;">Setup Video Guide</h3>
            <p style="font-size:14px; color:var(--text-secondary); line-height:1.6; margin:8px 0 16px;">
              1080p master walkthrough &amp; interactive step simulator to set up in 3 minutes.
            </p>
          </div>
          <span style="color:var(--accent-cyan); font-weight:700; font-size:13.5px; display:inline-flex; align-items:center; gap:6px;">
            Watch Tutorial &rarr;
          </span>
        </a>

        <a href="/about" class="two-ways-card" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="two-ways-step-num" style="font-size:22px; width:48px; height:48px;">🛡️</div>
            <h3 style="color:#fff; margin-top:14px; font-size:18px;">About &amp; Security</h3>
            <p style="font-size:14px; color:var(--text-secondary); line-height:1.6; margin:8px 0 16px;">
              Purpose-built by SRB STUDIOS with zero banking access and direct P2P UPI rails.
            </p>
          </div>
          <span style="color:var(--accent-cyan); font-weight:700; font-size:13.5px; display:inline-flex; align-items:center; gap:6px;">
            About Platform &rarr;
          </span>
        </a>

        <a href="/faq" class="two-ways-card" style="text-decoration:none; color:inherit; display:flex; flex-direction:column; justify-content:space-between;">
          <div>
            <div class="two-ways-step-num" style="font-size:22px; width:48px; height:48px;">❓</div>
            <h3 style="color:#fff; margin-top:14px; font-size:18px;">Streamer FAQ</h3>
            <p style="font-size:14px; color:var(--text-secondary); line-height:1.6; margin:8px 0 16px;">
              Got questions about OBS setup, phone permissions, or Indian UPI apps? We've got answers.
            </p>
          </div>
          <span style="color:var(--accent-cyan); font-weight:700; font-size:13.5px; display:inline-flex; align-items:center; gap:6px;">
            Browse FAQ &rarr;
          </span>
        </a>
      </div>
    </div>
  </section>

  `;

  html = html.substring(0, toolkitStart) + hubSection + html.substring(devSupportStart);
  console.log('Replaced duplicate sections on home page with clean Hub grid');
}

fs.writeFileSync(filePath, html, 'utf8');
console.log('public/index.html updated successfully!');
