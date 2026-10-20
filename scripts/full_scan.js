const fs = require('fs');

const files = ['public/index.html', 'public/tutorial.html'];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  console.log(`=== File: ${f} ===`);
  console.log(' - Has "Live Overlay":', content.includes('Live Overlay'));
  console.log(' - Has "Live Stream Overlay":', content.includes('Live Stream Overlay'));
  console.log(' - Has "Admin Portal":', content.includes('Admin Portal'));
  console.log(' - Has "Stream Cockpit":', content.includes('Stream Cockpit'));
  console.log(' - Has "player-watermark":', content.includes('player-watermark'));
  console.log(' - Has Malayalam option:', content.includes('value="ml"'));
});
