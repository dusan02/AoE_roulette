// ============================================================
// AoE IV Roulette – Settings Panel Component
// Slide-out panel rendered via React Portal (fixes z-index stacking bug)
// ============================================================

import { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouletteStore } from '../store/useRouletteStore';
import CIVS from '../data/civilizations';
import MAPS from '../data/maps';
import type { DlcName } from '../types';

const DLC_ORDER: DlcName[] = [
  'base',
  'The Sultans Ascend',
  'Knights of Cross and Rose',
  'Dynasties of the East',
  "Yue Fei's Legacy",
];

const DLC_LABELS: Record<DlcName, string> = {
  base: '⚔ Base Game',
  'The Sultans Ascend': '🌙 The Sultans Ascend',
  'Knights of Cross and Rose': '✝ Knights of Cross and Rose',
  'Dynasties of the East': '🐉 Dynasties of the East',
  "Yue Fei's Legacy": "🏹 Yue Fei's Legacy",
};

export function SettingsPanel() {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'civs' | 'maps' | 'rules'>('civs');

  const {
    player1Name, player2Name, setPlayer1Name, setPlayer2Name,
    player1EnabledCivIds, player2EnabledCivIds, enabledMapIds,
    allowDuplicateCivs,
    togglePlayer1Civ, togglePlayer2Civ, toggleMap,
    setAllPlayer1Civs, setAllPlayer2Civs, setAllMaps,
    toggleAllowDuplicateCivs,
  } = useRouletteStore();

  // The modal is portalled directly to document.body to escape any parent
  // stacking context (e.g. header's z-10 creating a new stacking context that
  // would clip the panel below the main content's z-10).
  const modalContent = (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            style={{ zIndex: 1000 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />

          {/* Panel */}
          <motion.aside
            className="fixed right-0 top-0 bottom-0 w-full max-w-md
              bg-casino-950 border-l border-gold-700/40
              shadow-[-20px_0_60px_rgba(0,0,0,0.8)]
              flex flex-col"
            style={{ zIndex: 1001 }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Panel Header */}
            <div className="flex items-center justify-between p-5 border-b border-gold-700/30 flex-shrink-0">
              <div>
                <h2 className="font-cinzel font-bold text-gold-300 text-lg tracking-wide">Settings</h2>
                <p className="text-xs text-gray-500 mt-0.5">Saved automatically</p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gold-700/30 flex-shrink-0">
              {(['civs', 'maps', 'rules'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-3 text-xs font-semibold tracking-widest uppercase transition-colors
                    ${activeTab === tab
                      ? 'text-gold-300 border-b-2 border-gold-400 bg-gold-900/20'
                      : 'text-gray-500 hover:text-gray-300'
                    }`}
                >
                  {tab === 'civs' ? '⚔ Civs' : tab === 'maps' ? '🗺 Maps' : '📋 Rules'}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto">
              {activeTab === 'civs' && (
                <CivsTab
                  player1Name={player1Name}
                  player2Name={player2Name}
                  onSetPlayer1Name={setPlayer1Name}
                  onSetPlayer2Name={setPlayer2Name}
                  p1Enabled={player1EnabledCivIds}
                  p2Enabled={player2EnabledCivIds}
                  onToggleP1={togglePlayer1Civ}
                  onToggleP2={togglePlayer2Civ}
                  onSetAllP1={setAllPlayer1Civs}
                  onSetAllP2={setAllPlayer2Civs}
                />
              )}
              {activeTab === 'maps' && (
                <MapsTab
                  enabledMapIds={enabledMapIds}
                  onToggle={toggleMap}
                  onSetAll={setAllMaps}
                />
              )}
              {activeTab === 'rules' && (
                <RulesTab
                  allowDuplicateCivs={allowDuplicateCivs}
                  onToggleDuplicates={toggleAllowDuplicateCivs}
                />
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Settings Toggle Button */}
      <motion.button
        id="settings-toggle-btn"
        onClick={() => setOpen((o) => !o)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full
          bg-casino-800/80 border border-gold-700/40 text-gold-400
          hover:border-gold-500/70 hover:text-gold-300
          transition-colors text-sm font-semibold"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Settings
      </motion.button>

      {/* Modal rendered at document.body level via Portal */}
      {createPortal(modalContent, document.body)}
    </>
  );
}

// ── Sub-tabs ──────────────────────────────────────────────────

interface CivsTabProps {
  player1Name: string;
  player2Name: string;
  onSetPlayer1Name: (name: string) => void;
  onSetPlayer2Name: (name: string) => void;
  p1Enabled: string[];
  p2Enabled: string[];
  onToggleP1: (id: string) => void;
  onToggleP2: (id: string) => void;
  onSetAllP1: (enabled: boolean) => void;
  onSetAllP2: (enabled: boolean) => void;
}

function CivsTab({
  player1Name, player2Name, onSetPlayer1Name, onSetPlayer2Name,
  p1Enabled, p2Enabled, onToggleP1, onToggleP2, onSetAllP1, onSetAllP2,
}: CivsTabProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Player 1 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <PlayerNameInput
            value={player1Name}
            onChange={onSetPlayer1Name}
            accentClass="text-blue-300 border-blue-700/50 focus:border-blue-400"
            placeholder="Player 1"
            id="player1-name-input"
          />
          <div className="flex gap-2 ml-3 flex-shrink-0">
            <button onClick={() => onSetAllP1(true)} className="text-[10px] text-gold-500 hover:text-gold-300 font-semibold uppercase">All</button>
            <span className="text-gray-600">|</span>
            <button onClick={() => onSetAllP1(false)} className="text-[10px] text-gray-500 hover:text-gray-300 font-semibold uppercase">None</button>
          </div>
        </div>
        <CivList civIds={p1Enabled} onToggle={onToggleP1} />
      </section>

      <div className="h-px bg-gold-700/20" />

      {/* Player 2 */}
      <section>
        <div className="flex items-center justify-between mb-3">
          <PlayerNameInput
            value={player2Name}
            onChange={onSetPlayer2Name}
            accentClass="text-red-300 border-red-700/50 focus:border-red-400"
            placeholder="Player 2"
            id="player2-name-input"
          />
          <div className="flex gap-2 ml-3 flex-shrink-0">
            <button onClick={() => onSetAllP2(true)} className="text-[10px] text-gold-500 hover:text-gold-300 font-semibold uppercase">All</button>
            <span className="text-gray-600">|</span>
            <button onClick={() => onSetAllP2(false)} className="text-[10px] text-gray-500 hover:text-gray-300 font-semibold uppercase">None</button>
          </div>
        </div>
        <CivList civIds={p2Enabled} onToggle={onToggleP2} />
      </section>
    </div>
  );
}

interface PlayerNameInputProps {
  value: string;
  onChange: (v: string) => void;
  accentClass: string;
  placeholder: string;
  id: string;
}

function PlayerNameInput({ value, onChange, accentClass, placeholder, id }: PlayerNameInputProps) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      maxLength={20}
      className={`bg-transparent border-b font-cinzel font-bold text-sm tracking-wide
        outline-none transition-colors w-full max-w-[160px]
        ${accentClass}`}
    />
  );
}

function CivList({ civIds, onToggle }: { civIds: string[]; onToggle: (id: string) => void }) {
  return (
    <div className="space-y-4">
      {DLC_ORDER.map((dlc) => {
        const civs = CIVS.filter((c) => c.dlc === dlc);
        if (civs.length === 0) return null;
        return (
          <div key={dlc}>
            <div className="text-[10px] font-semibold tracking-widest uppercase text-gold-600/80 mb-2">
              {DLC_LABELS[dlc]}
            </div>
            <div className="space-y-0.5">
              {civs.map((civ) => {
                const checked = civIds.includes(civ.id);
                return (
                  <label
                    key={civ.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                      hover:bg-white/5 transition-colors select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(civ.id)}
                      className="w-4 h-4 cursor-pointer flex-shrink-0"
                    />
                    <span className={`text-sm transition-colors leading-tight
                      ${checked ? 'text-white' : 'text-gray-500'}`}>
                      {civ.name}
                    </span>
                    {civ.type === 'variant' && (
                      <span className="ml-auto text-[9px] text-purple-400/70 font-semibold uppercase tracking-wider flex-shrink-0">
                        Variant
                      </span>
                    )}
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface MapsTabProps {
  enabledMapIds: string[];
  onToggle: (id: string) => void;
  onSetAll: (enabled: boolean) => void;
}

function MapsTab({ enabledMapIds, onToggle, onSetAll }: MapsTabProps) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-cinzel font-bold text-gold-300">Available Maps</h3>
        <div className="flex gap-2">
          <button onClick={() => onSetAll(true)} className="text-[10px] text-gold-500 hover:text-gold-300 font-semibold uppercase">All</button>
          <span className="text-gray-600">|</span>
          <button onClick={() => onSetAll(false)} className="text-[10px] text-gray-500 hover:text-gray-300 font-semibold uppercase">None</button>
        </div>
      </div>

      {(['land', 'hybrid', 'water'] as const).map((type) => {
        const typeMaps = MAPS.filter((m) => m.type === type);
        const typeLabels = { land: '⛰ Land Maps', hybrid: '💧 Hybrid Maps', water: '🌊 Water Maps' };
        return (
          <div key={type} className="mb-5">
            <div className="text-[10px] font-semibold tracking-widest uppercase text-gold-600/80 mb-2">
              {typeLabels[type]}
            </div>
            <div className="space-y-0.5">
              {typeMaps.map((map) => {
                const checked = enabledMapIds.includes(map.id);
                return (
                  <label
                    key={map.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer
                      hover:bg-white/5 transition-colors select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => onToggle(map.id)}
                      className="w-4 h-4 cursor-pointer flex-shrink-0"
                    />
                    <span className={`text-sm transition-colors
                      ${checked ? 'text-white' : 'text-gray-500'}`}>
                      {map.name}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface RulesTabProps {
  allowDuplicateCivs: boolean;
  onToggleDuplicates: () => void;
}

function RulesTab({ allowDuplicateCivs, onToggleDuplicates }: RulesTabProps) {
  return (
    <div className="p-4 space-y-4">
      <h3 className="text-sm font-cinzel font-bold text-gold-300 mb-4">Game Rules</h3>

      <ToggleRow
        id="allow-duplicate-civs-toggle"
        label="Allow Duplicate Civilizations"
        description="Both players may be assigned the same civilization"
        checked={allowDuplicateCivs}
        onChange={onToggleDuplicates}
      />
    </div>
  );
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}

function ToggleRow({ id, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <div className="flex items-start gap-4 p-3 rounded-xl bg-casino-900/60 border border-white/5">
      {/* Native checkbox hidden, custom toggle visual */}
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 mt-0.5 cursor-pointer
          ${checked ? 'bg-gold-500' : 'bg-gray-700'}`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200
            ${checked ? 'translate-x-5' : 'translate-x-0'}`}
        />
      </button>
      <div className="flex-1">
        <div className="text-sm font-semibold text-white">{label}</div>
        <div className="text-xs text-gray-500 mt-0.5">{description}</div>
      </div>
    </div>
  );
}
