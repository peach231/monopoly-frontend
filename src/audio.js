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
  // Rattling sound — rapid noise bursts
  const audioCtx = getCtx();
  const now = audioCtx.currentTime;
  for (let i = 0; i < 6; i++) {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300 + Math.random() * 400, now + i * 0.04);
    gain.gain.setValueAtTime(0, now + i * 0.04);
    gain.gain.linearRampToValueAtTime(0.06, now + i * 0.04 + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.08);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now + i * 0.04);
    osc.stop(now + i * 0.04 + 0.1);
  }
}

export function tokenMove() {
  // Light hop — short blip
  playTone({ frequency: 600 + Math.random() * 200, duration: 0.03, volume: 0.06, type: 'sine', attack: 0.005, decay: 0.02 });
}

export function tokenLand() {
  // Satisfying thud
  playTone({ frequency: 180, duration: 0.15, volume: 0.12, type: 'triangle', attack: 0.02, decay: 0.1 });
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
