const fs = require('fs');
const path = require('path');

function createWav(filename, duration, synthFn) {
  const sampleRate = 44100;
  const numSamples = Math.floor(sampleRate * duration);
  const buffer = Buffer.alloc(44 + numSamples * 2);

  buffer.write('RIFF', 0);
  buffer.writeUInt32LE(36 + numSamples * 2, 4);
  buffer.write('WAVE', 8);
  buffer.write('fmt ', 12);
  buffer.writeUInt32LE(16, 16);
  buffer.writeUInt16LE(1, 20); // PCM
  buffer.writeUInt16LE(1, 22); // Mono
  buffer.writeUInt32LE(sampleRate, 24);
  buffer.writeUInt32LE(sampleRate * 2, 28);
  buffer.writeUInt16LE(2, 32);
  buffer.writeUInt16LE(16, 34);
  buffer.write('data', 36);
  buffer.writeUInt32LE(numSamples * 2, 40);

  for (let i = 0; i < numSamples; i++) {
    const t = i / sampleRate;
    let s = synthFn(t, duration);
    s = Math.max(-0.95, Math.min(0.95, s));
    buffer.writeInt16LE(Math.floor(s * 32767), 44 + i * 2);
  }

  const outPath = path.join(__dirname, '..', 'public', 'sounds', filename);
  fs.writeFileSync(outPath, buffer);
  console.log(`Created sound: ${filename} (${buffer.length} bytes)`);
}

// 1. Arcade Coin Drop (Mario style 987Hz -> 1319Hz)
createWav('coin.wav', 0.6, (t) => {
  if (t < 0.08) {
    return Math.sin(2 * Math.PI * 987.77 * t) * 0.4;
  } else {
    const dt = t - 0.08;
    const env = Math.exp(-dt * 7.0);
    return Math.sin(2 * Math.PI * 1318.51 * dt) * env * 0.45;
  }
});

// 2. Victory Level Up Fanfare
createWav('level_up.wav', 1.2, (t) => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  const step = 0.12;
  const noteIdx = Math.min(notes.length - 1, Math.floor(t / step));
  const dt = t - noteIdx * step;
  const f = notes[noteIdx];
  const env = Math.exp(-dt * (noteIdx === 3 ? 3.0 : 6.0));
  return (Math.sin(2 * Math.PI * f * dt) + 0.3 * Math.sin(2 * Math.PI * f * 2 * dt)) * env * 0.35;
});

// 3. Cash Register Cha-Ching
createWav('cash.wav', 1.0, (t) => {
  let s = 0;
  // initial metallic click
  if (t < 0.08) {
    s += (Math.random() * 2 - 1) * Math.exp(-t * 30.0) * 0.3;
  }
  // double chime ring
  if (t >= 0.08) {
    const dt1 = t - 0.08;
    s += Math.sin(2 * Math.PI * 1760.0 * dt1) * Math.exp(-dt1 * 4.5) * 0.3;
  }
  if (t >= 0.18) {
    const dt2 = t - 0.18;
    s += Math.sin(2 * Math.PI * 2637.0 * dt2) * Math.exp(-dt2 * 3.5) * 0.35;
  }
  return s;
});
