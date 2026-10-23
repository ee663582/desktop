/**
 * ee663582.OS sound system.
 * Everything is synthesised with the Web Audio API — no audio files to load.
 */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicGain: GainNode | null = null;
let humNodes: { osc: OscillatorNode; gain: GainNode } | null = null;
let musicTimer: ReturnType<typeof setInterval> | null = null;

function ac(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
    master = ctx.createGain();
    master.gain.value = 0.6;
    master.connect(ctx.destination);
    musicGain = ctx.createGain();
    musicGain.gain.value = 0.0;
    musicGain.connect(master);
  }
  return ctx;
}

export function resumeAudio() {
  const c = ac();
  if (c && c.state === "suspended") void c.resume();
}

export function setMasterVolume(v: number) {
  const c = ac();
  if (c && master) master.gain.value = Math.max(0, Math.min(1, v));
}

export function setMuted(muted: boolean, volume: number) {
  setMasterVolume(muted ? 0 : volume);
}

type ToneOpts = {
  freq: number;
  dur?: number;
  type?: OscillatorType;
  gain?: number;
  delay?: number;
  sweepTo?: number;
};

export function tone({ freq, dur = 0.08, type = "square", gain = 0.12, delay = 0, sweepTo }: ToneOpts) {
  const c = ac();
  if (!c || !master) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  if (sweepTo) osc.frequency.exponentialRampToValueAtTime(Math.max(20, sweepTo), t0 + dur);
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  osc.connect(g);
  g.connect(master);
  osc.start(t0);
  osc.stop(t0 + dur + 0.05);
}

function noise(dur = 0.06, gain = 0.05, delay = 0) {
  const c = ac();
  if (!c || !master) return;
  const len = Math.floor(c.sampleRate * dur);
  const buf = c.createBuffer(1, len, c.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
  const src = c.createBufferSource();
  src.buffer = buf;
  const g = c.createGain();
  g.gain.value = gain;
  const filt = c.createBiquadFilter();
  filt.type = "bandpass";
  filt.frequency.value = 2200;
  src.connect(filt);
  filt.connect(g);
  g.connect(master);
  src.start(c.currentTime + delay);
}

export const sfx = {
  biosBeep() {
    tone({ freq: 1046, dur: 0.22, type: "square", gain: 0.1 });
  },
  post() {
    noise(0.04, 0.02);
  },
  click() {
    noise(0.025, 0.035);
    tone({ freq: 1800, dur: 0.02, type: "square", gain: 0.02 });
  },
  openWindow() {
    tone({ freq: 420, dur: 0.1, type: "sine", gain: 0.06, sweepTo: 760 });
  },
  closeWindow() {
    tone({ freq: 700, dur: 0.1, type: "sine", gain: 0.05, sweepTo: 320 });
  },
  minimize() {
    tone({ freq: 640, dur: 0.09, type: "triangle", gain: 0.05, sweepTo: 300 });
  },
  error() {
    tone({ freq: 330, dur: 0.16, type: "square", gain: 0.07 });
    tone({ freq: 247, dur: 0.22, type: "square", gain: 0.07, delay: 0.17 });
  },
  startup() {
    // five soft notes, the shape of an old logon sound
    const notes = [523.25, 784, 659.25, 880, 1046.5];
    notes.forEach((f, i) =>
      tone({ freq: f, dur: 0.85, type: "sine", gain: 0.075, delay: i * 0.22 }),
    );
    notes.forEach((f, i) =>
      tone({ freq: f / 2, dur: 1.1, type: "triangle", gain: 0.035, delay: i * 0.22 }),
    );
  },
  shutdown() {
    const notes = [880, 659.25, 523.25, 392];
    notes.forEach((f, i) => tone({ freq: f, dur: 0.6, type: "sine", gain: 0.07, delay: i * 0.18 }));
  },
};

export function startHum() {
  const c = ac();
  if (!c || !master || humNodes) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = "sawtooth";
  osc.frequency.value = 62;
  const filt = c.createBiquadFilter();
  filt.type = "lowpass";
  filt.frequency.value = 160;
  g.gain.value = 0.012;
  osc.connect(filt);
  filt.connect(g);
  g.connect(master);
  osc.start();
  humNodes = { osc, gain: g };
}

export function stopHum() {
  if (!humNodes) return;
  try {
    humNodes.osc.stop();
  } catch {
    /* already stopped */
  }
  humNodes = null;
}

/* ---- ambient music: a slow, quiet arpeggio in a minor key ---- */

const SCALE = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33];
let step = 0;

export function startMusic() {
  const c = ac();
  if (!c || !musicGain || musicTimer) return;
  musicGain.gain.setTargetAtTime(0.5, c.currentTime, 1.5);
  const play = () => {
    const cc = ac();
    if (!cc || !musicGain) return;
    const idx = [0, 2, 4, 6, 4, 2, 3, 5][step % 8] ?? 0;
    const f = (SCALE[idx] ?? 220) * (step % 16 < 8 ? 1 : 0.75);
    const t0 = cc.currentTime;
    const osc = cc.createOscillator();
    const g = cc.createGain();
    osc.type = "triangle";
    osc.frequency.value = f;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(0.05, t0 + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 2.4);
    osc.connect(g);
    g.connect(musicGain);
    osc.start(t0);
    osc.stop(t0 + 2.6);
    step++;
  };
  play();
  musicTimer = setInterval(play, 1400);
}

export function stopMusic() {
  if (musicTimer) clearInterval(musicTimer);
  musicTimer = null;
  const c = ac();
  if (c && musicGain) musicGain.gain.setTargetAtTime(0, c.currentTime, 0.4);
}
