const fs = require('fs');
const path = require('path');
const html = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

console.log('has explore-hub:', html.includes('explore-hub'));
console.log('has id="pricing":', html.includes('id="pricing"'));
console.log('has id="tutorial":', html.includes('id="tutorial"'));
console.log('has id="faq":', html.includes('id="faq"'));
console.log('nav menu:\n', html.match(/<ul class="nav-menu">[\s\S]*?<\/ul>/)[0]);
