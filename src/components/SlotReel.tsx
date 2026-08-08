// ============================================================
// AoE IV Roulette – SlotReel Component
// Individual reel with Framer Motion spin animation
// ============================================================

import { motion, AnimatePresence } from 'framer-motion';
import { useReelAnimation } from '../hooks/useSlotMachine';

interface SlotReelProps {
  /** All items in the reel pool (displayed labels) */
  items: string[];
  /** Final index to land on */
  targetIndex: number;
  /** Whether spinning is active */
  isSpinning: boolean;
  /** Delay before this reel starts (ms) */
  startDelay?: number;
  /** Duration for this reel to spin before stopping (ms) */
  spinDuration: number;
  /** Callback when reel stops */
  onStop?: () => void;
  /** Custom render for each item */
  renderItem?: (label: string, isStopped: boolean) => React.ReactNode;
  /** Additional class names for the reel window */
  className?: string;
  /** Label shown above the reel */
  label?: string;
}

export function SlotReel({
  items,
  targetIndex,
  isSpinning,
  startDelay = 0,
  spinDuration,
  onStop,
  renderItem,
  className = '',
  label,
}: SlotReelProps) {
  const { displayIndex, stopped, tickKey } = useReelAnimation({
    itemCount: items.length,
    targetIndex,
    startDelay,
    spinDuration,
    isSpinning,
    onStop,
  });

  const displayLabel = items[displayIndex] ?? '';

  return (
    <div className="flex flex-col items-center gap-2">
      {label && (
        <span className="text-xs font-semibold tracking-widest uppercase text-gold-400 opacity-70">
          {label}
        </span>
      )}

      {/* Reel Window */}
      <div
        className={`relative overflow-hidden rounded-lg border border-gold-700/50 bg-casino-900/80
          shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_10px_rgba(200,168,75,0.15)]
          ${stopped ? 'shadow-[inset_0_0_20px_rgba(0,0,0,0.8),0_0_20px_rgba(200,168,75,0.35)]' : ''}
          ${className}`}
      >
        {/* Top/bottom fade masks */}
        <div className="absolute inset-x-0 top-0 z-10 h-8 bg-gradient-to-b from-casino-900 to-transparent pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 z-10 h-8 bg-gradient-to-t from-casino-900 to-transparent pointer-events-none" />

        {/* Center highlight line */}
        <div className="absolute inset-x-0 top-1/2 z-20 h-px -translate-y-1/2 bg-gold-400/30 pointer-events-none" />

        {/* Spinning blur overlay */}
        {isSpinning && !stopped && (
          <div className="absolute inset-0 z-5 bg-casino-900/10 backdrop-blur-[0.5px] pointer-events-none" />
        )}

        {/* Content */}
        <AnimatePresence mode="popLayout">
          <motion.div
            key={`${displayIndex}-${tickKey}-${isSpinning}`}
            className="flex items-center justify-center h-full w-full px-4"
            initial={{ y: !stopped ? -30 : 0, opacity: !stopped ? 0.3 : 1 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            transition={{
              duration: !stopped ? 0.04 : 0.3,
              ease: stopped ? [0.34, 1.56, 0.64, 1] : 'linear',
            }}
          >
            {renderItem ? (
              renderItem(displayLabel, stopped)
            ) : (
              <span
                className={`text-center font-cinzel font-bold transition-all duration-300
                  ${stopped
                    ? 'text-gold-300 text-shadow-gold text-xl'
                    : 'text-gray-400 text-lg blur-[0.5px]'
                  }`}
              >
                {displayLabel}
              </span>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Stopped glow ring */}
        {stopped && (
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-gold-400/60 pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </div>
    </div>
  );
}
