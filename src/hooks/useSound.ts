// ============================================================
// AoE IV Roulette – Sound Hook (Web Audio API)
// Procedurally synthesized sounds – no external files needed
// ============================================================

import { useCallback, useRef } from 'react';
import { useRouletteStore } from '../store/useRouletteStore';

// Singleton AudioContext – created lazily on first user interaction
let sharedCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!sharedCtx) sharedCtx = new AudioContext();
  return sharedCtx;
}

/**
 * Ensure the AudioContext is in 'running' state.
 * Returns a Promise so callers can await before scheduling audio.
 */
async function ensureRunning(ctx: AudioContext): Promise<void> {
  if (ctx.state === 'suspended' || ctx.state === 'interrupted') {
    await ctx.resume();
  }
}

// ── Sound synthesis functions ─────────────────────────────────

/** Short noise burst – used as a mechanical click */
function playClick(ctx: AudioContext, time = 0, volume = 1) {
  const buf = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
  const data = buf.getChannelData(0);
  for (let i = 0; i < data.length; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.01));
  }
  const src = ctx.createBufferSource();
  src.buffer = buf;
  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.5 * volume, ctx.currentTime + time);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + time + 0.05);
  src.connect(gain);
  gain.connect(ctx.destination);
  src.start(ctx.currentTime + time);
}

/** Descending mechanical thunk – lever pull */
function playLever(ctx: AudioContext) {
  const dur = 0.35;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(200, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(55, ctx.currentTime + dur);
  gain.gain.setValueAtTime(0.55, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + dur);
  playClick(ctx, 0.01);
  playClick(ctx, 0.09);
}

/** Reel tick burst – called on repeat while spinning (30% volume) */
function playSpinTick(ctx: AudioContext) {
  playClick(ctx, 0, 0.3);
  playClick(ctx, 0.07, 0.3);
  playClick(ctx, 0.14, 0.3);
}

/** Ascending fanfare – celebration */
function playCelebration(ctx: AudioContext) {
  const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    const t = ctx.currentTime + i * 0.13;
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, t);
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.22, t + 0.025);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.28);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.3);
  });
}

// ── Hook ─────────────────────────────────────────────────────

export function useSound() {
  const muted = useRouletteStore((s) => s.muted);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * Safely play a sound:
   * 1. Skip if muted
   * 2. Await AudioContext.resume() so it's actually running
   * 3. Then schedule the audio nodes
   */
  const play = useCallback(
    async (fn: (ctx: AudioContext) => void) => {
      if (muted) return;
      try {
        const ctx = getAudioContext();
        await ensureRunning(ctx);
        fn(ctx);
      } catch {
        // Silently ignore – browser may block audio entirely
      }
    },
    [muted]
  );

  const playLeverSound = useCallback(() => play(playLever), [play]);

  const playStopSound = useCallback(() => play(playClick), [play]);

  const startSpinSound = useCallback(() => {
    if (muted) return;
    // Clear any previous interval first
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }
    spinIntervalRef.current = setInterval(() => {
      void play(playSpinTick);
    }, 190);
  }, [muted, play]);

  const stopSpinSound = useCallback(() => {
    if (spinIntervalRef.current) {
      clearInterval(spinIntervalRef.current);
      spinIntervalRef.current = null;
    }
  }, []);

  const playCelebrationSound = useCallback(() => play(playCelebration), [play]);

  return { playLeverSound, playStopSound, startSpinSound, stopSpinSound, playCelebrationSound };
}
