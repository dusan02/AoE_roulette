// ============================================================
// AoE IV Roulette – PlayerReel
// Single reel column per player: shows civ name in their color
// ============================================================

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { SlotReel } from './SlotReel';
import { InlineNameEditor } from './InlineNameEditor';
import type { Civilization, PlayerColor } from '../types';

interface PlayerReelProps {
  playerName: string;
  onSetName: (name: string) => void;
  civPool: Civilization[];
  civTargetIdx: number;
  isSpinning: boolean;
  spinDuration: number;
  onStop: () => void;
  /** Defined only once all reels have stopped */
  resultColor: PlayerColor | undefined;
}

export function PlayerReel({
  playerName, onSetName, civPool,
  civTargetIdx, isSpinning, spinDuration, onStop, resultColor,
}: PlayerReelProps) {
  const [hasStopped, setHasStopped] = useState(!isSpinning);

  useEffect(() => {
    if (isSpinning) {
      setHasStopped(false);
    } else {
      // Fallback: if the global spin state ends, forcefully reveal
      setHasStopped(true);
    }
  }, [isSpinning]);

  const handleStop = () => {
    setHasStopped(true);
    onStop();
  };

  const revealed = hasStopped && !!resultColor;
  const hex = resultColor?.hex;
  const borderColor = revealed ? `${hex}55` : 'rgba(200,168,75,0.12)';
  const bgColor     = revealed ? `${hex}0d` : 'rgba(0,0,0,0)';
  const boxShadow   = revealed ? `0 0 18px ${hex}22` : 'none';

  return (
    <div
      className="rounded-xl border p-3 transition-all duration-700"
      style={{ borderColor, backgroundColor: bgColor, boxShadow }}
    >
      <div className="flex items-center justify-center gap-3 mb-2 min-h-[24px]">
        <InlineNameEditor
          value={playerName}
          onChange={onSetName}
          colorClass={revealed ? '' : 'text-gold-500/70'}
          colorHex={revealed ? hex : undefined}
          disabled={isSpinning}
        />
        {revealed && resultColor && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 300 }}
            className="flex items-center gap-1.5"
          >
            <div
              className="w-3 h-3 rounded-full border border-white/30"
              style={{
                backgroundColor: resultColor.hex,
                boxShadow: `0 0 8px ${resultColor.hex}`,
              }}
            />
            <span
              className="text-[10px] font-semibold tracking-wider"
              style={{ color: resultColor.hex }}
            >
              {resultColor.name}
            </span>
          </motion.div>
        )}
      </div>

      <SlotReel
        items={civPool.map((c) => c.name)}
        targetIndex={civTargetIdx}
        isSpinning={isSpinning}
        spinDuration={spinDuration}
        onStop={handleStop}
        className="w-full h-[160px]"
        renderItem={(label, stopped) => {
          const color = stopped && resultColor ? resultColor.hex : undefined;
          const civ = civPool.find((c) => c.name === label);
          return (
            <div className="flex flex-col items-center justify-center px-2 gap-4">
              <div className="flex items-center justify-center h-16 w-full">
                <span
                  className={`text-center font-cinzel font-bold transition-all duration-300 leading-tight
                    ${stopped ? 'text-xl mb-1' : 'text-lg text-gray-400 blur-[0.5px]'}`}
                  style={color ? { color, textShadow: `0 0 20px ${color}60` } : undefined}
                >
                  {label}
                </span>
              </div>
              {civ && (
                <img
                  src={`/flags/${civ.id}.png`}
                  alt={label}
                  className={`object-contain transition-all duration-300 ${
                    stopped
                      ? 'w-16 h-16 opacity-100 drop-shadow-[0_0_8px_rgba(200,168,75,0.4)]'
                      : 'w-12 h-12 opacity-30 blur-[1px]'
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
            </div>
          );
        }}
      />
    </div>
  );
}
