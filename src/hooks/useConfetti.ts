// ============================================================
// AoE IV Roulette – Confetti Hook
// Wraps canvas-confetti for celebration effect
// ============================================================

import { useCallback } from 'react';
import confetti from 'canvas-confetti';

/** Gold and medieval-themed colors for confetti */
const CONFETTI_COLORS = ['#c8a84b', '#f0c060', '#e8d090', '#ffffff', '#8b1a1a', '#2a5f8f'];

export function useConfetti() {
  const triggerConfetti = useCallback(() => {
    // Left side burst
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.1, y: 0.6 },
      colors: CONFETTI_COLORS,
      startVelocity: 45,
      gravity: 1.2,
    });

    // Right side burst
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { x: 0.9, y: 0.6 },
      colors: CONFETTI_COLORS,
      startVelocity: 45,
      gravity: 1.2,
    });

    // Center top burst (delayed)
    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { x: 0.5, y: 0.3 },
        colors: CONFETTI_COLORS,
        startVelocity: 30,
        gravity: 1.0,
      });
    }, 300);
  }, []);

  return { triggerConfetti };
}
