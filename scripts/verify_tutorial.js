const http = require('http');

function checkPage(urlPath, name) {
  http.get('http://localhost:3333' + urlPath, res => {
    let d = '';
    res.on('data', c => d += c);
    res.on('end', () => {
      console.log(`=== ${name} (${urlPath}) ===`);
      console.log('HTTP Status:', res.statusCode);
      console.log('Has Malayalam option:', d.includes('value="ml"'));
      console.log('Has Admin Portal button:', d.includes('Admin Portal'));
      console.log('Has Player Watermark:', d.includes('player-watermark'));
      console.log('Has Go Live Chapter 6:', d.includes('Go Live Today'));
      console.log('Has Clean English Alex Martin:', d.includes('Alex Martin'));
    });
  });
}

checkPage('/tutorial', 'Tutorial Page');
checkPage('/', 'Landing Page');
