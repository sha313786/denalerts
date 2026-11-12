const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'public', 'tutorial.html');
let html = fs.readFileSync(filePath, 'utf8');

// Find and remove the extra Home button in header-links
const targetRegex = /<a href="\/" class="btn btn-secondary"[^>]*><span>.*?<\/span><\/a>\s*/;
if (targetRegex.test(html)) {
  html = html.replace(targetRegex, '');
  fs.writeFileSync(filePath, html, 'utf8');
  console.log('Successfully removed redundant Home button from tutorial.html!');
} else {
  console.log('Target pattern not found');
}
