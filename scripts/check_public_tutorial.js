const https = require('https');

https.get('https://cincinnati-restore-prize-immigration.trycloudflare.com/tutorial', res => {
  let d = '';
  res.on('data', c => d += c);
  res.on('end', () => {
    console.log('=== Public Tunnel (/tutorial) ===');
    console.log('HTTP Status:', res.statusCode);
    console.log('Has Home Page button:', d.includes('Home Page'));
    console.log('Has Admin Portal button:', d.includes('Admin Portal'));
    console.log('Has Live Overlay button:', d.includes('Live Overlay'));
    console.log('Has Malayalam option:', d.includes('value="ml"'));
    console.log('Has Player Watermark:', d.includes('class="player-watermark"'));
  });
}).on('error', e => console.error(e.message));
