const fs = require('fs');
const path = require('path');

const scriptPath = path.join(__dirname, '..', 'scripts', 'generate_tutorial_video.js');
let code = fs.readFileSync(scriptPath, 'utf8');

// Replace fetchTTSAudio function with natural US Studio Voice implementation
const newFetchTTSAudio = `function fetchTTSChunk(chunk, lang = 'en-US', retries = 4) {
  return new Promise((resolve, reject) => {
    function attempt(n) {
      const encoded = encodeURIComponent(chunk);
      const url = \`https://translate.google.com/translate_tts?ie=UTF-8&tl=\${encodeURIComponent(lang)}&client=tw-ob&q=\${encoded}\`;
      const req = https.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://translate.google.com/'
        },
        timeout: 10000
      }, res => {
        if (res.statusCode !== 200) {
          if (n > 1) {
            console.log(\`   ⚠️ Retrying chunk TTS (\${n - 1} attempts left)... status \${res.statusCode}\`);
            return setTimeout(() => attempt(n - 1), 1200);
          }
          return reject(new Error(\`TTS error status \${res.statusCode}\`));
        }
        const data = [];
        res.on('data', d => data.push(d));
        res.on('end', () => resolve(Buffer.concat(data)));
      });
      req.on('error', err => {
        if (n > 1) {
          console.log(\`   ⚠️ Network drop, retrying in 1.2s (\${n - 1} left)...\`);
          setTimeout(() => attempt(n - 1), 1200);
        } else {
          reject(err);
        }
      });
    }
    attempt(retries);
  });
}

async function fetchTTSAudio(text, outputFile) {
  // Split narration into natural sentence clauses for optimal pacing and studio inflection
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const buffers = [];
  for (const s of sentences) {
    const trimmed = s.trim();
    if (!trimmed) continue;
    const b = await fetchTTSChunk(trimmed, 'en-US');
    buffers.push(b);
    await new Promise(r => setTimeout(r, 150));
  }
  const rawMp3 = Buffer.concat(buffers);
  const rawFile = outputFile + '.raw.mp3';
  fs.writeFileSync(rawFile, rawMp3);

  // Apply broadcast studio mastering: vocal warmth, harmonic clarity, and EBU R128 loudness normalization
  try {
    execSync(\`"\${ffmpegPath}" -i "\${rawFile}" -af "equalizer=f=120:width_type=o:width=1.5:g=2.5,equalizer=f=3400:width_type=o:width=1.5:g=2,loudnorm=I=-16:TP=-1.5:LRA=11" -c:a aac -b:a 192k -y "\${outputFile}"\`, { stdio: 'ignore' });
  } catch (err) {
    console.error('Mastering filter fallback:', err.message);
    fs.copyFileSync(rawFile, outputFile);
  } finally {
    if (fs.existsSync(rawFile)) fs.unlinkSync(rawFile);
  }
}`;

// Replace the old fetchTTSAudio implementation
const startIdx = code.indexOf('function fetchTTSAudio(');
const endIdx = code.indexOf('function getRightMockupSVG(');

if (startIdx !== -1 && endIdx > startIdx) {
  code = code.substring(0, startIdx) + newFetchTTSAudio + '\n\n' + code.substring(endIdx);
  fs.writeFileSync(scriptPath, code, 'utf8');
  console.log('Successfully patched generate_tutorial_video.js with Natural Studio English voice!');
} else {
  console.error('Could not find function markers in script');
}
