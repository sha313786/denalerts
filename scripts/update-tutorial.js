const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'tutorial.html');
let html = fs.readFileSync(filePath, 'utf8');

const navHtml = `
  <!-- Main Website Navigation Bar -->
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
        <a href="https://discord.gg/XyKNuC4hBd" target="_blank" class="btn btn-secondary" title="Join Discord Community">
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

if (!html.includes('id="main-nav"')) {
  html = html.replace('<body>', '<body>' + navHtml);
}

// Add Home button to header-links
const homeBtn = '<a href="/" class="btn btn-secondary" style="margin-right:6px;"><span>🏠 Home</span></a>\n        ';
if (!html.includes('href="/" class="btn btn-secondary"')) {
  html = html.replace('<div class="header-links">', '<div class="header-links">\n        ' + homeBtn);
}
html = html.replace('/dashboard.html', '/dashboard');

fs.writeFileSync(filePath, html, 'utf8');
console.log('Successfully updated tutorial.html with full navbar and Home button!');
