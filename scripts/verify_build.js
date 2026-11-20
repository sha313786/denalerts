const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

console.log('Verifying HTML and CSS files...');

const index = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');
const checks = [
  'id="sim-donor"',
  'id="sim-note"',
  'id="sim-app"',
  'id="btn-trigger-sim"',
  'id="display-donor"',
  'id="display-amount"',
  'id="display-msg"',
  'id="live-alert-card"',
  'id="waveform-bars"',
  'id="demo-chime"',
  'id="btn-toggle-sound"',
  'Plus+Jakarta+Sans',
  '0% Platform Cut',
  'Zero Escrow Architecture',
  'Why Streamers Switch to DenAlerts'
];

let allPassed = true;
checks.forEach(c => {
  const exists = index.includes(c);
  console.log(`Check [${c}]: ${exists ? 'PASS' : 'FAIL'}`);
  if (!exists) allPassed = false;
});

// Check css link
if (index.includes('landing.css?v=50')) {
  console.log('landing.css version 50 linked: PASS');
} else {
  console.log('landing.css version 50 linked: FAIL');
  allPassed = false;
}

// Check subpages
const subpages = ['about.html', 'features.html', 'pricing.html', 'tutorial.html', 'faq.html'];
subpages.forEach(sub => {
  const subContent = fs.readFileSync(path.join(PUBLIC, sub), 'utf8');
  const hasGlowSphere = subContent.includes('ambient-glow-sphere');
  console.log(`Subpage ${sub} ambient-glow-sphere check: ${!hasGlowSphere ? 'CLEAN (PASS)' : 'FOUND (FAIL)'}`);
  if (hasGlowSphere) allPassed = false;
});

if (allPassed) {
  console.log('All verification checks passed successfully!');
} else {
  console.error('Some checks failed.');
  process.exit(1);
}
