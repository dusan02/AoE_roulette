import { motion, useAnimation } from 'framer-motion';
import { useEffect, useRef, useMemo } from 'react';
import { ReelState } from '../types';

interface ReelProps {
  reel: ReelState;
  label: string;
  accent?: string;
  swatch?: string;
}

const SPIN_SYMBOLS = ['⚔', '🏰', '⚜', '🛡', '👑', '🗡', '🔱', '⚡', '🏹', '⚔', '🏰', '⚜'];
const ITEM_H = 80;
const N = SPIN_SYMBOLS.length;

function dynSize(text: string): string {
  if (text.length > 20) return '0.8rem';
  if (text.length > 14) return '1.0rem';
  if (text.length > 9)  return '1.22rem';
  return '1.5rem';
}

function stableIdx(seed: string, salt: number): number {
  let h = salt * 997;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  return Math.abs(h) % N;
}

export const Reel = ({ reel, label, accent = '#D4AF37', swatch }: ReelProps) => {
  const controls = useAnimation();
  const spinning = useRef(false);

  const topSym = useMemo(() => SPIN_SYMBOLS[stableIdx(reel.currentValue, 1)], [reel.currentValue]);
  const botSym = useMemo(() => SPIN_SYMBOLS[stableIdx(reel.currentValue, 2)], [reel.currentValue]);

  useEffect(() => {
    if (reel.isSpinning && !spinning.current) {
      spinning.current = true;
      controls.start({
        y: [-(ITEM_H * N), 0],
        transition: { duration: 0.55, repeat: Infinity, ease: 'linear' },
      });
    } else if (!reel.isSpinning && spinning.current) {
      spinning.current = false;
      controls.stop();
      controls.set({ y: 0 });
    }
  }, [reel.isSpinning, controls]);

  const sep = `${accent}30`;

  return (
    <div className="flex flex-col gap-3">
      {/* label chip */}
      <div className="flex items-center gap-2 px-1 h-6">
        {swatch && (
          <span
            className="h-4 w-4 rounded-full flex-shrink-0 border-2 border-white/20"
            style={{ backgroundColor: swatch, boxShadow: `0 0 10px ${swatch}99` }}
          />
        )}
        <span className="text-xs font-bold uppercase tracking-[0.18em] truncate" style={{ color: accent }}>
          {label}
        </span>
      </div>

      {/* drum window — 3 rows */}
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          height: `${ITEM_H * 3}px`,
          background: 'linear-gradient(170deg, #162336 0%, #0c1826 50%, #162336 100%)',
          border: `2px solid ${accent}55`,
          boxShadow: `inset 0 4px 24px rgba(0,0,0,0.6),
                      inset 0 -4px 16px rgba(0,0,0,0.45),
                      0 8px 32px rgba(0,0,0,0.5)`,
        }}
      >
        {/* Top fade */}
        <div className="absolute inset-x-0 top-0 pointer-events-none z-20"
          style={{ height: ITEM_H * 0.85, background: 'linear-gradient(to bottom, rgba(0,0,0,0.78), transparent)' }} />
        {/* Bottom fade */}
        <div className="absolute inset-x-0 bottom-0 pointer-events-none z-20"
          style={{ height: ITEM_H * 0.85, background: 'linear-gradient(to top, rgba(0,0,0,0.78), transparent)' }} />

        {/* Center cell highlight + separator lines */}
        <div className="absolute inset-x-0 z-10 pointer-events-none" style={{
          top: ITEM_H,
          height: ITEM_H,
          background: `${accent}0d`,
          borderTop: `1px solid ${sep}`,
          borderBottom: `1px solid ${sep}`,
        }} />

        {reel.isSpinning ? (
          /* Spinning strip scrolls DOWNWARD (y from -N*ITEM_H to 0) */
          <motion.div
            animate={controls}
            className="absolute left-0 right-0 top-0"
            style={{ filter: 'blur(2.5px)' }}
          >
            {[...SPIN_SYMBOLS, ...SPIN_SYMBOLS].map((sym, i) => (
              <div
                key={i}
                className="flex items-center justify-center"
                style={{ height: ITEM_H }}
              >
                <span className="text-3xl" style={{ opacity: 0.55 }}>{sym}</span>
              </div>
            ))}
          </motion.div>
        ) : (
          /* Stopped: top dim row / center result / bottom dim row */
          <div className="absolute inset-0">
            <div className="flex items-center justify-center"
              style={{ height: ITEM_H, opacity: 0.22, filter: 'blur(1.5px)' }}>
              <span className="text-3xl">{topSym}</span>
            </div>

            <motion.div
              key={reel.currentValue}
              initial={{ y: -ITEM_H * 0.45, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 320, damping: 20 }}
              className="flex items-center justify-center px-3"
              style={{ height: ITEM_H }}
            >
              <span
                className="font-black text-center leading-tight"
                style={{
                  color: accent,
                  fontSize: dynSize(reel.currentValue),
                  textShadow: `0 0 24px ${accent}88, 0 2px 8px rgba(0,0,0,0.6)`,
                }}
              >
                {reel.currentValue}
              </span>
            </motion.div>

            <div className="flex items-center justify-center"
              style={{ height: ITEM_H, opacity: 0.22, filter: 'blur(1.5px)' }}>
              <span className="text-3xl">{botSym}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
