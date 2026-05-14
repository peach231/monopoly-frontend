const AudioContext = window.AudioContext || window.webkitAudioContext;
let ctx = null;

function getCtx() {
  if (!ctx) ctx = new AudioContext();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

function playTone({ frequency = 440, duration = 0.1, type = 'sine', volume = 0.1, attack = 0.01, decay = 0.05 }) {
  try {
    const audioCtx = getCtx();
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    const now = audioCtx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, now);

    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(volume, now + attack);
    gain.gain.exponentialRampToValueAtTime(0.001, now + attack + decay + duration);

    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + attack + decay + duration + 0.05);
  } catch (e) {
    // Silently fail
  }
}

function playNoise({ duration = 0.1, volume = 0.08 }) {
  try {
    const audioCtx = getCtx();
    const bufferSize = audioCtx.sampleRate * duration;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * volume;
    }
    const noise = audioCtx.createBufferSource();
    noise.buffer = buffer;
    const gain = audioCtx.createGain();
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
    noise.connect(gain);
    gain.connect(audioCtx.destination);
    noise.start();
  } catch (e) {}
}

// ===== GAME SOUNDS =====

export function diceRoll() {
  // Realistic dice throw: white noise rattle with decay + low thud at end
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;

  // Phase 1: Shaking rattle (0-0.35s) — rapid filtered noise bursts
  const shakeDuration = 0.35;
  const shakeBufferSize = audioCtx.sampleRate * shakeDuration;
  const shakeBuffer = audioCtx.createBuffer(1, shakeBufferSize, audioCtx.sampleRate);
  const shakeData = shakeBuffer.getChannelData(0);
  for (let i = 0; i < shakeBufferSize; i++) {
    const t = i / audioCtx.sampleRate;
    const envelope = Math.exp(-t * 8) * (0.6 + 0.4 * Math.sin(t * 60)); // decay + flutter
    shakeData[i] = (Math.random() * 2 - 1) * envelope * 0.15;
  }
  const shake = audioCtx.createBufferSource();
  shake.buffer = shakeBuffer;
  const shakeFilter = audioCtx.createBiquadFilter();
  shakeFilter.type = 'bandpass';
  shakeFilter.frequency.value = 2500;
  shakeFilter.Q.value = 0.8;
  const shakeGain = audioCtx.createGain();
  shakeGain.gain.setValueAtTime(0.12, now);
  shakeGain.gain.exponentialRampToValueAtTime(0.001, now + shakeDuration);
  shake.connect(shakeFilter);
  shakeFilter.connect(shakeGain);
  shakeGain.connect(audioCtx.destination);
  shake.start(now);

  // Phase 2: Dice hitting table (0.3s) — short noise burst + low thud
  const hitTime = now + 0.3;
  const hitBufferSize = audioCtx.sampleRate * 0.08;
  const hitBuffer = audioCtx.createBuffer(1, hitBufferSize, audioCtx.sampleRate);
  const hitData = hitBuffer.getChannelData(0);
  for (let i = 0; i < hitBufferSize; i++) {
    const t = i / audioCtx.sampleRate;
    hitData[i] = (Math.random() * 2 - 1) * Math.exp(-t * 40) * 0.2;
  }
  const hit = audioCtx.createBufferSource();
  hit.buffer = hitBuffer;
  const hitFilter = audioCtx.createBiquadFilter();
  hitFilter.type = 'highpass';
  hitFilter.frequency.value = 3000;
  const hitGain = audioCtx.createGain();
  hitGain.gain.setValueAtTime(0.1, hitTime);
  hitGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.08);
  hit.connect(hitFilter);
  hitFilter.connect(hitGain);
  hitGain.connect(audioCtx.destination);
  hit.start(hitTime);

  // Phase 3: Low table thud resonance
  const thudOsc = audioCtx.createOscillator();
  const thudGain = audioCtx.createGain();
  thudOsc.type = 'sine';
  thudOsc.frequency.setValueAtTime(120, hitTime);
  thudOsc.frequency.exponentialRampToValueAtTime(60, hitTime + 0.15);
  thudGain.gain.setValueAtTime(0, hitTime);
  thudGain.gain.linearRampToValueAtTime(0.1, hitTime + 0.005);
  thudGain.gain.exponentialRampToValueAtTime(0.001, hitTime + 0.2);
  thudOsc.connect(thudGain);
  thudGain.connect(audioCtx.destination);
  thudOsc.start(hitTime);
  thudOsc.stop(hitTime + 0.25);
}

export function tokenMove() {
  // Soft piece sliding then tapping — deeper, gentler
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;

  // Soft slide (very subtle friction)
  const slideSize = audioCtx.sampleRate * 0.06;
  const slideBuffer = audioCtx.createBuffer(1, slideSize, audioCtx.sampleRate);
  const slideData = slideBuffer.getChannelData(0);
  for (let i = 0; i < slideSize; i++) {
    const t = i / audioCtx.sampleRate;
    slideData[i] = (Math.random() * 2 - 1) * Math.exp(-t * 25) * 0.04;
  }
  const slide = audioCtx.createBufferSource();
  slide.buffer = slideBuffer;
  const slideFilter = audioCtx.createBiquadFilter();
  slideFilter.type = 'lowpass';
  slideFilter.frequency.value = 800;
  const slideGain = audioCtx.createGain();
  slideGain.gain.setValueAtTime(0.04, now);
  slideGain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
  slide.connect(slideFilter);
  slideFilter.connect(slideGain);
  slideGain.connect(audioCtx.destination);
  slide.start(now);

  // Gentle tap — low sine, very short, soft
  const tapOsc = audioCtx.createOscillator();
  const tapGain = audioCtx.createGain();
  tapOsc.type = 'sine';
  tapOsc.frequency.setValueAtTime(280, now + 0.02);
  tapGain.gain.setValueAtTime(0, now + 0.02);
  tapGain.gain.linearRampToValueAtTime(0.04, now + 0.025);
  tapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  tapOsc.connect(tapGain);
  tapGain.connect(audioCtx.destination);
  tapOsc.start(now + 0.02);
  tapOsc.stop(now + 0.1);
}

export function tokenLand() {
  // Heavy piece landing on board: impact + wood resonance + subtle reverb
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;

  // Impact — sharp noise burst (the "clack")
  const impactSize = audioCtx.sampleRate * 0.04;
  const impactBuffer = audioCtx.createBuffer(1, impactSize, audioCtx.sampleRate);
  const impactData = impactBuffer.getChannelData(0);
  for (let i = 0; i < impactSize; i++) {
    impactData[i] = (Math.random() * 2 - 1) * Math.exp(-(i / audioCtx.sampleRate) * 80) * 0.25;
  }
  const impact = audioCtx.createBufferSource();
  impact.buffer = impactBuffer;
  const impactFilter = audioCtx.createBiquadFilter();
  impactFilter.type = 'bandpass';
  impactFilter.frequency.value = 3500;
  impactFilter.Q.value = 1.2;
  const impactGain = audioCtx.createGain();
  impactGain.gain.setValueAtTime(0.1, now);
  impactGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
  impact.connect(impactFilter);
  impactFilter.connect(impactGain);
  impactGain.connect(audioCtx.destination);
  impact.start(now);

  // Wood board resonance — low sine with quick attack, slow decay
  const woodOsc = audioCtx.createOscillator();
  const woodGain = audioCtx.createGain();
  woodOsc.type = 'sine';
  woodOsc.frequency.setValueAtTime(90, now);
  woodOsc.frequency.exponentialRampToValueAtTime(70, now + 0.25);
  woodGain.gain.setValueAtTime(0, now);
  woodGain.gain.linearRampToValueAtTime(0.1, now + 0.008);
  woodGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
  woodOsc.connect(woodGain);
  woodGain.connect(audioCtx.destination);
  woodOsc.start(now);
  woodOsc.stop(now + 0.4);

  // Subtle reverb tail — delayed quieter copy
  const reverbDelay = audioCtx.createDelay();
  reverbDelay.delayTime.value = 0.06;
  const reverbGain = audioCtx.createGain();
  reverbGain.gain.value = 0.15;
  const reverbFilter = audioCtx.createBiquadFilter();
  reverbFilter.type = 'lowpass';
  reverbFilter.frequency.value = 2000;
  woodOsc.connect(reverbDelay);
  reverbDelay.connect(reverbFilter);
  reverbFilter.connect(reverbGain);
  reverbGain.connect(audioCtx.destination);
}

export function buyProperty() {
  // Cash register cha-ching
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  [1200, 1600, 2000].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.08);
    gain.gain.setValueAtTime(0, now + i * 0.08);
    gain.gain.linearRampToValueAtTime(0.08, now + i * 0.08 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.08 + 0.15);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + i * 0.08);
    osc.stop(now + i * 0.08 + 0.2);
  });
}

export function payRent() {
  // Coin clink descending
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  [900, 700, 500].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.1);
    gain.gain.setValueAtTime(0.07, now + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.15);
  });
}

export function goToJail() {
  // Siren / warning wobble
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, now);
  osc.frequency.linearRampToValueAtTime(300, now + 0.2);
  osc.frequency.linearRampToValueAtTime(400, now + 0.4);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.55);
}

export function drawCard() {
  // Paper flip / whoosh
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  const bufferSize = audioCtx.sampleRate * 0.2;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const t = i / audioCtx.sampleRate;
    data[i] = (Math.random() * 2 - 1) * 0.1 * Math.exp(-t * 15) * Math.sin(t * 50);
  }
  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;
  const filter = audioCtx.createBiquadFilter();
  filter.type = 'bandpass';
  filter.frequency.value = 2000;
  filter.Q.value = 1;
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);
  noise.start(now);
}

export function buildHouse() {
  // Hammer tap + wood creak
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  // Hammer
  const osc1 = audioCtx.createOscillator();
  const gain1 = audioCtx.createGain();
  osc1.type = 'square';
  osc1.frequency.setValueAtTime(200, now);
  gain1.gain.setValueAtTime(0.1, now);
  gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
  osc1.connect(gain1);
  gain1.connect(audioCtx.destination);
  osc1.start(now);
  osc1.stop(now + 0.1);
  // Wood creak
  const osc2 = audioCtx.createOscillator();
  const gain2 = audioCtx.createGain();
  osc2.type = 'sine';
  osc2.frequency.setValueAtTime(800, now + 0.05);
  osc2.frequency.exponentialRampToValueAtTime(400, now + 0.15);
  gain2.gain.setValueAtTime(0.05, now + 0.05);
  gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
  osc2.connect(gain2);
  gain2.connect(audioCtx.destination);
  osc2.start(now + 0.05);
  osc2.stop(now + 0.25);
}

export function tradeComplete() {
  // Handshake / deal sealed
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  [500, 750, 1000, 1250].forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now + i * 0.06);
    gain.gain.setValueAtTime(0, now + i * 0.06);
    gain.gain.linearRampToValueAtTime(0.07, now + i * 0.06 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.06 + 0.12);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + i * 0.06);
    osc.stop(now + i * 0.06 + 0.15);
  });
}

export function freeParking() {
  // Jackpot / coins shower
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  for (let i = 0; i < 8; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800 + Math.random() * 600, now + i * 0.05);
    gain.gain.setValueAtTime(0, now + i * 0.05);
    gain.gain.linearRampToValueAtTime(0.06, now + i * 0.05 + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.05 + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + i * 0.05);
    osc.stop(now + i * 0.05 + 0.1);
  }
}

export function bankruptcy() {
  // Sad trombone / descending slide
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.6);
  gain.gain.setValueAtTime(0.1, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start(now);
  osc.stop(now + 0.75);
}

export function gameOver() {
  // Victory fanfare
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  const notes = [
    { f: 523, t: 0, d: 0.2 },
    { f: 659, t: 0.15, d: 0.2 },
    { f: 784, t: 0.3, d: 0.2 },
    { f: 1047, t: 0.5, d: 0.4 }
  ];
  notes.forEach(n => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(n.f, now + n.t);
    gain.gain.setValueAtTime(0, now + n.t);
    gain.gain.linearRampToValueAtTime(0.1, now + n.t + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, now + n.t + n.d);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + n.t);
    osc.stop(now + n.t + n.d + 0.05);
  });
}

// ===== CHAT SOUNDS (existing) =====

export function chatReceive() {
  playTone({ frequency: 880, duration: 0.1, volume: 0.08, type: 'sine' });
}

export function chatSend() {
  playTone({ frequency: 1200, duration: 0.05, volume: 0.06, type: 'sine' });
}
