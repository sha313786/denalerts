const https = require('https');
https.get('https://cincinnati-restore-prize-immigration.trycloudflare.com/', res => {
  let d = '';
  res.on('data', c => { d += c; });
  res.on('end', () => {
    console.log('HTTP Status:', res.statusCode);
    console.log('Has #tutorial section:', d.includes('id="tutorial"'));
    console.log('Has smooth scroll:', d.includes('scroll-behavior:smooth'));
    console.log('Nav #tutorial link:', d.includes('href="#tutorial"') ? 'YES' : 'NOT FOUND');
    console.log('Download MP4 link:', d.includes('SRB_STUDIOS_StreamAlerts_Tutorial') ? 'YES' : 'NOT FOUND');
    console.log('JS Engine (TUTORIAL_SCENES):', d.includes('TUTORIAL_SCENES') ? 'YES' : 'NOT FOUND');
  });
}).on('error', e => console.error('ERR:', e.message));
