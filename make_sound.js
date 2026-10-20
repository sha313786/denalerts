const fs = require('fs');
const path = require('path');

const sampleRate = 44100;
const duration = 1.6;
const numSamples = Math.floor(sampleRate * duration);
const buffer = Buffer.alloc(44 + numSamples * 2);

// WAV Header
buffer.write('RIFF', 0);
buffer.writeUInt32LE(36 + numSamples * 2, 4);
buffer.write('WAVE', 8);
buffer.write('fmt ', 12);
buffer.writeUInt32LE(16, 16); // Subchunk1Size
buffer.writeUInt16LE(1, 20);  // PCM format
buffer.writeUInt16LE(1, 22);  // Mono
buffer.writeUInt32LE(sampleRate, 24);
buffer.writeUInt32LE(sampleRate * 2, 28);
buffer.writeUInt16LE(2, 32);
buffer.writeUInt16LE(16, 34);
buffer.write('data', 36);
buffer.writeUInt32LE(numSamples * 2, 40);

// Cash chime triad + high bell harmonics
const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98, 2093.00];
for (let i = 0; i < numSamples; i++) {
  const t = i / sampleRate;
  let sample = 0;
  freqs.forEach((f, idx) => {
    const delay = idx * 0.06;
    if (t >= delay) {
      const dt = t - delay;
      const env = Math.exp(-dt * 3.8);
      sample += Math.sin(2 * Math.PI * f * dt) * env * 0.22;
    }
  });
  sample = Math.max(-0.95, Math.min(0.95, sample));
  const intSample = Math.floor(sample * 32767);
  buffer.writeInt16LE(intSample, 44 + i * 2);
}

const targetPath = path.join(__dirname, 'public', 'alert.wav');
fs.writeFileSync(targetPath, buffer);
console.log('alert.wav generated at:', targetPath, 'Size:', buffer.length);
