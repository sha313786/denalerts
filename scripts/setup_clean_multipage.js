// scripts/setup_clean_multipage.js
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(ROOT, 'public');

console.log('Configuring clean multi-page architecture with dedicated standalone pages...');

// 1. UPDATE index.html
let indexHtml = fs.readFileSync(path.join(PUBLIC, 'index.html'), 'utf8');

// Set Nav menu to dedicated pages
const indexNav = `<ul class="nav-menu">
        <li><a href="/" class="active">Home</a></li>
        <li><a href="/about">About</a></li>
        <li><a href="/features">Features</a></li>
        <li><a href="/pricing">Pricing</a></li>
        <li><a href="/tutorial">Tutorial</a></li>
        <li><a href="/faq">FAQ</a></li>
      </ul>`;

indexHtml = indexHtml.replace(/<ul class="nav-menu">[\s\S]*?<\/ul>/, indexNav);

// Remove pricing-section from home (since it has dedicated /pricing page)
indexHtml = indexHtml.replace(/<!-- Plans & Pricing Section \(#pricing\) -->[\s\S]*?<\/section>/, '');
indexHtml = indexHtml.replace(/<section class="pricing-section" id="pricing"[\s\S]*?<\/section>/, '');

// Remove tutorial-section from home (since it has dedicated /tutorial page)
indexHtml = indexHtml.replace(/<!-- Step-by-Step Setup Video Guide Section \(#tutorial\) -->[\s\S]*?<\/section>/, '');
indexHtml = indexHtml.replace(/<section class="tutorial-section" id="tutorial"[\s\S]*?<\/section>/, '');

// Remove faq-section from home (since it has dedicated /faq page)
indexHtml = indexHtml.replace(/<!-- Frequently Asked Questions Section \(#faq\) -->[\s\S]*?<\/section>/, '');
indexHtml = indexHtml.replace(/<section class="faq-section" id="faq"[\s\S]*?<\/section>/, '');

// Remove explore-hub if still present
indexHtml = indexHtml.replace(/<!-- Standalone Hub Navigation \(#explore-hub\) -->[\s\S]*?<\/section>/, '');
indexHtml = indexHtml.replace(/<section class="hub-section" id="explore-hub"[\s\S]*?<\/section>/, '');

fs.writeFileSync(path.join(PUBLIC, 'index.html'), indexHtml, 'utf8');
console.log('✓ Cleaned public/index.html (Home is now streamlined & links to separate pages)');

// 2. Standardize Navigation on all separate pages
const pages = [
  { file: 'about.html', active: 'About' },
  { file: 'features.html', active: 'Features' },
  { file: 'pricing.html', active: 'Pricing' },
  { file: 'tutorial.html', active: 'Tutorial' },
  { file: 'faq.html', active: 'FAQ' }
];

pages.forEach(({ file, active }) => {
  const filePath = path.join(PUBLIC, file);
  if (!fs.existsSync(filePath)) return;

  let content = fs.readFileSync(filePath, 'utf8');

  const pageNav = `<ul class="nav-menu">
        <li><a href="/" class="${active === 'Home' ? 'active' : ''}">Home</a></li>
        <li><a href="/about" class="${active === 'About' ? 'active' : ''}">About</a></li>
        <li><a href="/features" class="${active === 'Features' ? 'active' : ''}">Features</a></li>
        <li><a href="/pricing" class="${active === 'Pricing' ? 'active' : ''}">Pricing</a></li>
        <li><a href="/tutorial" class="${active === 'Tutorial' ? 'active' : ''}">Tutorial</a></li>
        <li><a href="/faq" class="${active === 'FAQ' ? 'active' : ''}">FAQ</a></li>
      </ul>`;

  content = content.replace(/<ul class="nav-menu">[\s\S]*?<\/ul>/, pageNav);
  
  // Make sure navbar has clean class and no glow text
  content = content.replace(/class="navbar[^"]*"/, 'class="navbar"');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`✓ Updated navigation on dedicated page: ${file} (active: ${active})`);
});

console.log('All standalone pages and navigation successfully configured!');
