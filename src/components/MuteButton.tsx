// ============================================================
// AoE IV Roulette – MuteButton Component
// ============================================================

import { motion } from 'framer-motion';
import { useRouletteStore } from '../store/useRouletteStore';

export function MuteButton() {
  const muted = useRouletteStore((s) => s.muted);
  const toggleMuted = useRouletteStore((s) => s.toggleMuted);

  return (
    <motion.button
      id="mute-toggle-btn"
      onClick={toggleMuted}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.92 }}
      aria-label={muted ? 'Unmute sound' : 'Mute sound'}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
        bg-casino-800/80 border border-gold-700/40 text-gold-400
        hover:border-gold-500/70 hover:text-gold-300
        transition-colors text-sm font-semibold"
    >
      {muted ? (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M15.536 8.464a5 5 0 010 7.072M12 6v12M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
      <span>{muted ? 'Muted' : 'Sound On'}</span>
    </motion.button>
  );
}
