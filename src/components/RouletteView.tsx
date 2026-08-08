import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { maps } from '../data/maps';
import { civilizations } from '../data/civilizations';
import { colors } from '../data/colors';
import { motion } from 'framer-motion';
import { Skull } from 'lucide-react';

export const RouletteView = () => {
  const [showResult, setShowResult] = useState(false);
  const { isSpinning, currentResult, spin, resetResult, settings, setSpinning, recordWin } = useStore();

  const playSpinSound = (duration: number) => {
    if (!settings.soundEnabled) return;
    try {
      const ctx = new AudioContext();
      let interval = 70;
      let elapsed = 0;
      const tick = () => {
        if (elapsed >= duration) { ctx.close(); return; }
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.value = 350 + Math.random() * 180;
        gain.gain.setValueAtTime(0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.045);
        osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.045);
        elapsed += interval;
        if (elapsed > duration * 0.55) interval = 110;
        if (elapsed > duration * 0.78) interval = 170;
        setTimeout(tick, interval);
      };
      tick();
    } catch (_) { /* AudioContext unavailable */ }
  };

  useEffect(() => {
    if (!isSpinning) {
      if (currentResult) setShowResult(true);
      return;
    }
    setShowResult(false);
    playSpinSound(1500);
    const t = setTimeout(() => setSpinning(false), 1500);
    return () => clearTimeout(t);
  }, [isSpinning, currentResult]);

  const handlePull = () => {
    if (isSpinning) return;
    resetResult();
    setShowResult(false);
    spin();
  };

  const handleRecordWin = (winner: 'player1' | 'player2') => {
    recordWin(winner);
    setShowResult(false);
    resetResult();
  };

  const mapData = currentResult ? maps.find(m => m.id === currentResult.map) : undefined;
  const p1Civ = currentResult ? civilizations.find(c => c.id === currentResult.player1.civilization) : undefined;
  const p2Civ = currentResult ? civilizations.find(c => c.id === currentResult.player2.civilization) : undefined;
  const p1Color = currentResult ? colors.find(c => c.id === currentResult.player1.color) : undefined;
  const p2Color = currentResult ? colors.find(c => c.id === currentResult.player2.color) : undefined;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 text-aoe-gold text-sm uppercase tracking-[0.4em] font-bold">
          <Skull size={16} />
          Fortune of War
          <Skull size={16} />
        </div>
      </div>

      {/* Map card */}
      <motion.div
        initial={false}
        animate={isSpinning ? { scale: [1, 1.02, 1] } : {}}
        transition={{ duration: 0.5, repeat: isSpinning ? Infinity : 0 }}
        className="rounded-2xl border-2 border-aoe-gold bg-aoe-bgLight shadow-[0_0_40px_rgba(212,175,55,0.15)] overflow-hidden mb-4"
      >
        <div className="p-6 text-center">
          <div className="text-xs uppercase tracking-[0.3em] text-aoe-textDim mb-2">Map</div>
          <div className="text-2xl font-black text-aoe-gold uppercase tracking-wider min-h-[2rem]">
            {isSpinning ? '???' : (mapData?.name ?? '???')}
          </div>
        </div>
        <div className="h-40 bg-aoe-panel border-t border-aoe-border flex items-center justify-center overflow-hidden relative">
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'radial-gradient(circle, #2a4a6e 1px, transparent 1px)',
            backgroundSize: '20px 20px',
          }} />
          <span className="text-6xl relative z-10 filter drop-shadow-[0_0_12px_rgba(212,175,55,0.5)]">
            {isSpinning ? '?' : '🗺'}
          </span>
        </div>
      </motion.div>

      <div className="text-center my-3">
        <span className="text-aoe-textDim text-xs uppercase tracking-[0.4em]">vs</span>
      </div>

      {/* Player cards */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        {[1, 2].map((num) => {
          const isP1 = num === 1;
          const civ = isP1 ? p1Civ : p2Civ;
          const color = isP1 ? p1Color : p2Color;
          const baseColor = color?.hex ?? (isP1 ? '#3B82F6' : '#EF4444');

          return (
            <motion.div
              key={num}
              initial={false}
              animate={isSpinning ? { y: [0, -4, 0] } : {}}
              transition={{ duration: 0.6, delay: isP1 ? 0 : 0.15, repeat: isSpinning ? Infinity : 0 }}
              className="rounded-2xl border-2 p-5 bg-aoe-bgLight overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.4)]"
              style={{ borderColor: baseColor + '55' }}
            >
              <div className="text-center mb-3">
                <div className="text-xs uppercase tracking-wider text-aoe-textDim">Player {num}</div>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="h-3 w-3 rounded-full border border-white/20" style={{ backgroundColor: baseColor }} />
                  <span className="text-sm font-bold" style={{ color: baseColor }}>{color?.name ?? (isP1 ? 'Blue' : 'Red')}</span>
                </div>
              </div>
              <div className="text-center min-h-[2.5rem]">
                <div className="text-xl font-black" style={{ color: baseColor }}>
                  {isSpinning ? '???' : (civ?.name ?? '???')}
                </div>
              </div>
              <div className="h-24 mt-4 rounded-lg flex items-center justify-center relative overflow-hidden" style={{ backgroundColor: baseColor + '15' }}>
                <div className="absolute inset-0 opacity-30" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, ${baseColor}22 10px, ${baseColor}22 20px)`,
                }} />
                <span className="text-4xl relative z-10">{isSpinning ? '?' : '🏁'}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Pull Lever */}
      <div className="flex justify-center relative mb-6">
        <button
          onClick={handlePull}
          disabled={isSpinning}
          className="relative flex items-center justify-center gap-3 font-black text-lg tracking-widest uppercase py-4 px-12 rounded-2xl disabled:opacity-60 disabled:cursor-not-allowed"
          style={{
            background: 'linear-gradient(170deg, #e8c447 0%, #c8a020 40%, #a07810 100%)',
            color: '#1a0a00',
            border: '2px solid #c8a020',
            boxShadow: '0 10px 28px rgba(0,0,0,0.45), 0 2px 0 #7a5a08, inset 0 1px 0 rgba(255,255,255,0.3)',
          }}
        >
          <span className="absolute -left-7 top-1/2 -translate-y-1/2 rounded-full" style={{ width: 22, height: 68, background: 'linear-gradient(90deg, #3a1e06, #5c3010, #3a1e06)', border: '2px solid #a07030' }} />
          <span className="absolute -left-9 -top-1.5 rounded-full" style={{ width: 28, height: 28, background: 'radial-gradient(circle at 35% 30%, #ff6060, #cc1010)', border: '2px solid #ff9090', boxShadow: '0 4px 14px rgba(200,0,0,0.55)' }} />
          PULL LEVER
          <span className="absolute -right-7 top-1/2 -translate-y-1/2 rounded-full" style={{ width: 22, height: 68, background: 'linear-gradient(90deg, #3a1e06, #5c3010, #3a1e06)', border: '2px solid #a07030' }} />
          <span className="absolute -right-9 -top-1.5 rounded-full" style={{ width: 28, height: 28, background: 'radial-gradient(circle at 35% 30%, #ff6060, #cc1010)', border: '2px solid #ff9090', boxShadow: '0 4px 14px rgba(200,0,0,0.55)' }} />
        </button>
      </div>

      {/* Winner recording */}
      {showResult && currentResult && !isSpinning && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="text-sm text-aoe-textDim uppercase tracking-wider">Zaznamenaj víťaza</div>
          <div className="flex gap-4">
            <button
              onClick={() => handleRecordWin('player1')}
              className="px-6 py-2 rounded-lg border-2 font-bold text-sm uppercase tracking-wider transition-all hover:scale-105"
              style={{ borderColor: p1Color?.hex ?? '#3B82F6', color: p1Color?.hex ?? '#3B82F6' }}
            >
              {settings.player1Name}
            </button>
            <button
              onClick={() => handleRecordWin('player2')}
              className="px-6 py-2 rounded-lg border-2 font-bold text-sm uppercase tracking-wider transition-all hover:scale-105"
              style={{ borderColor: p2Color?.hex ?? '#EF4444', color: p2Color?.hex ?? '#EF4444' }}
            >
              {settings.player2Name}
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
};
