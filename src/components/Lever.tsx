// ============================================================
// AoE IV Roulette – Lever Component
// Animated SVG lever on the side of the machine
// ============================================================

import { useRef } from 'react';
import { motion, useAnimate } from 'framer-motion';

interface LeverProps {
  onPull: () => void;
  disabled?: boolean;
}

export function Lever({ onPull, disabled = false }: LeverProps) {
  const [scope, animate] = useAnimate();
  const pulling = useRef(false);

  const handlePull = async () => {
    if (disabled || pulling.current) return;
    pulling.current = true;

    // Lever pull-down animation
    await animate(scope.current, { rotate: 40 }, { duration: 0.15, ease: 'easeOut' });
    onPull();
    // Snap back up
    await animate(scope.current, { rotate: -10 }, { duration: 0.1, ease: 'easeIn' });
    await animate(scope.current, { rotate: 0 }, { duration: 0.2, ease: 'easeOut' });

    pulling.current = false;
  };

  return (
    <button
      onClick={handlePull}
      disabled={disabled}
      aria-label="Pull lever"
      className={`flex flex-col items-center gap-1 select-none focus:outline-none
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
      {/* Lever ball */}
      <motion.div
        ref={scope}
        style={{ transformOrigin: 'bottom center' }}
        className="flex flex-col items-center"
        whileHover={disabled ? {} : { scale: 1.05 }}
      >
        {/* Ball */}
        <div className="relative w-10 h-10 rounded-full bg-gradient-to-br from-red-400 via-red-600 to-red-900
          border-2 border-red-300/50 shadow-[0_0_15px_rgba(239,68,68,0.6),inset_0_2px_4px_rgba(255,255,255,0.3)]
          flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-red-200/40" />
        </div>

        {/* Lever rod */}
        <div className="w-2.5 h-24 bg-gradient-to-b from-gold-300 via-gold-500 to-gold-700
          rounded-b-sm shadow-[0_0_8px_rgba(200,168,75,0.4),inset_1px_0_2px_rgba(255,255,255,0.3)]
          border-x border-gold-600/50" />
      </motion.div>

      {/* Lever base mount */}
      <div className="w-8 h-4 bg-gradient-to-b from-gray-600 to-gray-800
        rounded-md border border-gray-500/50 shadow-inner" />

      {/* Label */}
      <span className="text-[10px] font-cinzel tracking-widest text-gold-500/70 uppercase mt-1">
        Pull
      </span>
    </button>
  );
}
