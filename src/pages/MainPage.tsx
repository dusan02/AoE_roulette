// ============================================================
// AoE IV Roulette – Main Page
// Simplified: 3 reels — Map | Player 1 | Player 2
// Each player reel shows the civ name colored in the player's color
// ============================================================

import { useEffect, useCallback, useRef, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouletteStore } from '../store/useRouletteStore';
import { useSound } from '../hooks/useSound';
import { useConfetti } from '../hooks/useConfetti';
import { SlotReel } from '../components/SlotReel';
import { PlayerReel } from '../components/PlayerReel';
import { Lever } from '../components/Lever';
import { SettingsPanel } from '../components/SettingsPanel';
import { MuteButton } from '../components/MuteButton';
import { StatsPanel } from '../components/StatsPanel';
import CIVS from '../data/civilizations';
import MAPS from '../data/maps';
import PLAYER_COLORS from '../data/colors';

// 3 reels: Map stops first, then P1, then P2
const REEL_SPIN_DURATIONS = [2800, 3600, 4400];

export function MainPage() {
  const [activeTab, setActiveTab] = useState<'roulette' | 'stats'>('roulette');

  const {
    spin, spinPhase, setSpinPhase, result,
    player1Name, player2Name, setPlayer1Name, setPlayer2Name,
    player1EnabledCivIds, player2EnabledCivIds, enabledMapIds,
    spinError, clearError,
    createPendingMatch,
  } = useRouletteStore();

  const { playLeverSound, playStopSound, startSpinSound, stopSpinSound, playCelebrationSound } = useSound();
  const { triggerConfetti } = useConfetti();

  // Track how many of the 3 reels have stopped
  const stoppedReelsRef = useRef(0);
  const TOTAL_REELS = 3;

  // Derive filtered pools
  const p1CivPool = useMemo(
    () => CIVS.filter((c) => player1EnabledCivIds.includes(c.id)),
    [player1EnabledCivIds]
  );
  const p2CivPool = useMemo(
    () => CIVS.filter((c) => player2EnabledCivIds.includes(c.id)),
    [player2EnabledCivIds]
  );
  const mapPool = useMemo(
    () => MAPS.filter((m) => enabledMapIds.includes(m.id)),
    [enabledMapIds]
  );

  // Final result values (fallback to first item when no result yet)
  const resultMap    = result?.map                    ?? mapPool[0]   ?? MAPS[0];
  const resultP1Civ  = result?.player1.civilization   ?? p1CivPool[0] ?? CIVS[0];
  const resultP1Color = result?.player1.color         ?? PLAYER_COLORS[0];
  const resultP2Civ  = result?.player2.civilization   ?? p2CivPool[1] ?? CIVS[1];
  const resultP2Color = result?.player2.color         ?? PLAYER_COLORS[1];

  // Reel target indices
  const mapIdx = mapPool.findIndex((m) => m.id === resultMap.id);
  const p1CivIdx = p1CivPool.findIndex((c) => c.id === resultP1Civ.id);
  const p2CivIdx = p2CivPool.findIndex((c) => c.id === resultP2Civ.id);

  const isSpinning = spinPhase === 'spinning';

  // Called by each reel when it stops
  const handleReelStop = useCallback(() => {
    playStopSound();
    stoppedReelsRef.current += 1;
    if (stoppedReelsRef.current >= TOTAL_REELS) {
      stopSpinSound();
      setSpinPhase('done');
      playCelebrationSound();
      triggerConfetti();
    }
  }, [playStopSound, stopSpinSound, setSpinPhase, playCelebrationSound, triggerConfetti]);

  // Pull lever → spin
  const handlePull = useCallback(() => {
    if (isSpinning) return;
    stoppedReelsRef.current = 0;
    clearError();
    spin();
    playLeverSound();
  }, [isSpinning, spin, playLeverSound, clearError]);

  // Spin sound lifecycle
  useEffect(() => {
    if (isSpinning) startSpinSound();
    return () => stopSpinSound();
  }, [isSpinning, startSpinSound, stopSpinSound]);

  // When spin completes, create a pending draft match and switch to stats tab
  useEffect(() => {
    if (spinPhase === 'done' && result) {
      createPendingMatch();
      setActiveTab('stats');
    }
  }, [spinPhase, result, createPendingMatch]);

  return (
    <div className="min-h-screen bg-casino-950 text-white relative overflow-hidden">
      {/* Background ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,168,75,0.08)_0%,transparent_70%)] pointer-events-none" />

      {/* ── Tabs ── */}
      <div className="absolute top-20 left-0 right-0 z-30 flex justify-center gap-2 px-4">
        <button
          onClick={() => setActiveTab('roulette')}
          className={`px-5 py-2 rounded-t-lg text-xs font-cinzel font-bold uppercase tracking-wider transition-colors border-t border-l border-r ${
            activeTab === 'roulette'
              ? 'bg-casino-800/90 text-gold-300 border-gold-600/50'
              : 'bg-casino-900/60 text-gold-500/60 border-gold-700/30 hover:text-gold-400'
          }`}
        >
          🎰 Roulette
        </button>
        <button
          onClick={() => setActiveTab('stats')}
          className={`px-5 py-2 rounded-t-lg text-xs font-cinzel font-bold uppercase tracking-wider transition-colors border-t border-l border-r relative ${
            activeTab === 'stats'
              ? 'bg-casino-800/90 text-gold-300 border-gold-600/50'
              : 'bg-casino-900/60 text-gold-500/60 border-gold-700/30 hover:text-gold-400'
          }`}
        >
          🏆 Štatistiky
          {useRouletteStore.getState().matchHistory.length > 0 && (
            <span className="ml-2 bg-gold-500 text-casino-950 text-[9px] font-black rounded-full min-w-[16px] h-[16px] inline-flex items-center justify-center px-1">
              {useRouletteStore.getState().matchHistory.length}
            </span>
          )}
        </button>
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(139,0,0,0.06)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.5) 2px, rgba(255,255,255,0.5) 4px)' }}
      />

      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gold-700/20">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gold-400 to-gold-700
            flex items-center justify-center text-lg shadow-[0_0_15px_rgba(200,168,75,0.5)]">
            ⚔
          </div>
          <div>
            <h1 className="font-cinzel font-black text-gold-300 text-lg sm:text-xl tracking-wider leading-none">
              AoE IV Roulette
            </h1>
            <p className="text-[10px] text-gray-500 tracking-widest uppercase">Anniversary Edition</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <MuteButton />
          <SettingsPanel />
        </div>
      </header>

      {/* Main */}
      <main className={`flex flex-col items-center justify-center gap-6 px-4 sm:px-6 py-8 mx-auto pt-16 ${
        activeTab === 'roulette' ? 'max-w-3xl' : 'max-w-6xl w-full'
      }`}>

        {activeTab === 'roulette' && (
          <>

        {/* ── Machine frame ── */}
        <div className="w-full rounded-2xl border border-gold-600/40
          bg-gradient-to-b from-casino-800/80 to-casino-900/80
          shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(200,168,75,0.3)]
          overflow-hidden">

          <div className="h-1 bg-gradient-to-r from-gold-700 via-gold-400 to-gold-700" />

          {/* Title row */}
          <div className="text-center pt-5 pb-4 px-6">
            <div className="flex items-center justify-center gap-3">
              <div className="flex-1 h-px bg-gradient-to-r from-transparent to-gold-600/40" />
              <span className="text-[10px] font-cinzel tracking-[0.3em] text-gold-500 uppercase">
                🎲 Fortune of War 🎲
              </span>
              <div className="flex-1 h-px bg-gradient-to-l from-transparent to-gold-600/40" />
            </div>
          </div>

          <div className="px-4 pb-6 space-y-4">

            {/* ── MAP reel ── */}
            <ReelSection label="🗺 Map">
              <SlotReel
                items={mapPool.map((m) => m.name)}
                targetIndex={mapIdx}
                isSpinning={isSpinning}
                spinDuration={REEL_SPIN_DURATIONS[0]}
                onStop={handleReelStop}
                className="w-full h-[180px]"
                renderItem={(label, stopped) => {
                  const mapObj = mapPool.find((m) => m.name === label);
                  return (
                    <div className="flex flex-col items-center gap-[26px]">
                      <div className="flex items-center justify-center h-16 w-full">
                        <span className={`text-center font-cinzel font-bold transition-all duration-300 leading-tight
                          ${stopped ? 'text-gold-300 text-2xl' : 'text-gray-400 text-xl blur-[0.5px]'}`}>
                          {label}
                        </span>
                      </div>
                      {mapObj && (
                        <img 
                          src={`/maps/${mapObj.id}.png`}
                          alt={label}
                          className={`object-cover rounded-md border border-gold-700/50 transition-all duration-300
                            ${stopped ? 'w-24 h-16 opacity-100 drop-shadow-[0_0_8px_rgba(200,168,75,0.3)]' : 'w-16 h-10 opacity-30 blur-[1px]'}`}
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                    </div>
                  );
                }}
              />
            </ReelSection>

            {/* ── VS divider ── */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-gold-700/20" />
              <span className="text-[10px] text-gold-600/60 font-cinzel tracking-widest uppercase">vs</span>
              <div className="flex-1 h-px bg-gold-700/20" />
            </div>

            {/* ── Player reels (2 columns) ── */}
            <div className="grid grid-cols-2 gap-4">
              {/* Player 1 */}
              <PlayerReel
                playerName={player1Name}
                onSetName={setPlayer1Name}
                civPool={p1CivPool}
                civTargetIdx={p1CivIdx}
                isSpinning={isSpinning}
                spinDuration={REEL_SPIN_DURATIONS[1]}
                onStop={handleReelStop}
                resultColor={resultP1Color}
              />
              {/* Player 2 */}
              <PlayerReel
                playerName={player2Name}
                onSetName={setPlayer2Name}
                civPool={p2CivPool}
                civTargetIdx={p2CivIdx}
                isSpinning={isSpinning}
                spinDuration={REEL_SPIN_DURATIONS[2]}
                onStop={handleReelStop}
                resultColor={resultP2Color}
              />
            </div>

            {/* ── Error ── */}
            <AnimatePresence>
              {spinError && (
                <motion.div
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 px-4 py-3 rounded-lg
                    bg-red-900/40 border border-red-700/50 text-red-300 text-sm"
                >
                  <span>⚠</span>
                  <span>{spinError}. Check your settings.</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Pull section ── */}
          <div className="border-t border-gold-700/30 bg-casino-950/60 px-6 py-5">
            <div className="flex items-center justify-center gap-6">
              <Lever onPull={handlePull} disabled={isSpinning} />

              <motion.button
                id="pull-lever-btn"
                onClick={handlePull}
                disabled={isSpinning}
                whileHover={isSpinning ? {} : { scale: 1.03, y: -2 }}
                whileTap={isSpinning ? {} : { scale: 0.97 }}
                className={`relative px-10 py-5 rounded-2xl font-cinzel font-black text-xl
                  tracking-[0.15em] uppercase transition-all duration-300 overflow-hidden
                  ${isSpinning
                    ? 'bg-casino-800 text-gray-500 cursor-not-allowed border border-gray-700'
                    : 'bg-gradient-to-b from-gold-400 via-gold-500 to-gold-700 text-casino-950 cursor-pointer border-b-4 border-gold-800 shadow-[0_0_30px_rgba(200,168,75,0.5),0_8px_20px_rgba(0,0,0,0.5)]'
                  }`}
              >
                {!isSpinning && (
                  <div className="absolute inset-0 bg-gradient-to-b from-white/20 to-transparent rounded-2xl pointer-events-none" />
                )}
                <span className="relative z-10">
                  {isSpinning ? '⚔ Spinning...' : '🎲 Pull Lever'}
                </span>
                {!isSpinning && spinPhase === 'idle' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl bg-gold-400/20"
                    animate={{ opacity: [0, 0.4, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
              </motion.button>

              <div className="scale-x-[-1]">
                <Lever onPull={handlePull} disabled={isSpinning} />
              </div>
            </div>
          </div>

          <div className="h-1 bg-gradient-to-r from-gold-700 via-gold-400 to-gold-700" />
        </div>
          </>
        )}

        {activeTab === 'stats' && <StatsPanel />}

      </main>

      <footer className="text-center pb-6 text-[10px] text-gray-600 font-cinzel tracking-wider mt-12">
        AoE IV Roulette • Anniversary Edition • Local App
      </footer>
    </div>
  );
}

// ── Helper components ─────────────────────────────────────────

function ReelSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[10px] font-cinzel tracking-[0.25em] text-gold-500/70 uppercase mb-2 text-center">
        {label}
      </div>
      {children}
    </div>
  );
}


