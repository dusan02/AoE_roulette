// ============================================================
// AoE IV Roulette – Slot Machine Hook
// Controls the multi-reel spin animation sequence
// ============================================================

import { useState, useEffect, useRef, useCallback } from 'react';
import type { SpinPhase } from '../types';

export interface ReelState {
  /** The value currently displayed (changes rapidly while spinning) */
  displayIndex: number;
  /** Whether this specific reel has stopped */
  stopped: boolean;
}

export interface UseSlotMachineOptions {
  /** Total items in the reel's pool */
  itemCount: number;
  /** Index of the final result to land on */
  targetIndex: number;
  /** How many ms before this reel starts (stagger offset) */
  startDelay?: number;
  /** How many ms this reel spins before stopping */
  spinDuration: number;
  /** Whether to start spinning */
  isSpinning: boolean;
  /** Callback when reel stops */
  onStop?: () => void;
}

export function useReelAnimation({
  itemCount,
  targetIndex,
  startDelay = 0,
  spinDuration,
  isSpinning,
  onStop,
}: UseSlotMachineOptions): ReelState & { tickKey: number } {
  const [displayIndex, setDisplayIndex] = useState(targetIndex);
  const [stopped, setStopped] = useState(true);
  const [tickKey, setTickKey] = useState(0);

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimers = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (startTimerRef.current) clearTimeout(startTimerRef.current);
    if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
  }, []);

  useEffect(() => {
    if (!isSpinning) {
      clearTimers();
      setStopped(true);
      setDisplayIndex(targetIndex);
      return;
    }

    setStopped(false);

    // Delay before this reel starts
    startTimerRef.current = setTimeout(() => {
      let currentIdx = displayIndex;
      let tickInterval = 40; // Start fast (40ms per tick = ~25fps)

      const startTick = () => {
        intervalRef.current = setInterval(() => {
          currentIdx = (currentIdx + 1) % itemCount;
          setDisplayIndex(currentIdx);
          setTickKey((k) => k + 1);
        }, tickInterval);
      };

      startTick();

      // Schedule reel stop
      stopTimerRef.current = setTimeout(() => {
        // Gradually slow down: restart interval with increasing delay
        clearTimers();
        let slowInterval = 60;
        const slow = () => {
          if (slowInterval > 250) {
            // Final stop
            setDisplayIndex(targetIndex);
            setStopped(true);
            onStop?.();
            return;
          }
          clearTimers();
          currentIdx = (currentIdx + 1) % itemCount;
          setDisplayIndex(currentIdx);
          setTickKey((k) => k + 1);
          slowInterval = Math.floor(slowInterval * 1.4);
          stopTimerRef.current = setTimeout(slow, slowInterval);
        };
        slow();
      }, spinDuration);
    }, startDelay);

    return clearTimers;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning]);

  return { displayIndex, stopped, tickKey };
}

/** Orchestrates the full spin sequence across all reels */
export function useSlotMachine(options: {
  totalDuration: number;
  reelCount: number;
  onAllStopped: () => void;
}) {
  const { totalDuration, reelCount, onAllStopped } = options;
  const [spinPhase, setSpinPhase] = useState<SpinPhase>('idle');
  const stoppedCountRef = useRef(0);

  const startSpin = useCallback(() => {
    stoppedCountRef.current = 0;
    setSpinPhase('spinning');
  }, []);

  const handleReelStop = useCallback(() => {
    stoppedCountRef.current += 1;
    if (stoppedCountRef.current >= reelCount) {
      setSpinPhase('done');
      onAllStopped();
    }
  }, [reelCount, onAllStopped]);

  /** Stagger each reel's stop time evenly across totalDuration */
  const getReelSpinDuration = useCallback(
    (reelIndex: number) => {
      // Reels stop sequentially: first after 60%, last at 100% of totalDuration
      const base = totalDuration * 0.6;
      const extra = (totalDuration * 0.4 * reelIndex) / Math.max(reelCount - 1, 1);
      return base + extra;
    },
    [totalDuration, reelCount]
  );

  return {
    spinPhase,
    startSpin,
    handleReelStop,
    getReelSpinDuration,
    isSpinning: spinPhase === 'spinning',
  };
}
