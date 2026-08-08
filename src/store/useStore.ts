import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { civilizations } from '../data/civilizations';
import { maps } from '../data/maps';
import { colors } from '../data/colors';
import { Settings, RouletteResult, ReelState, MatchRecord, CivilizationId, MapId } from '../types';

interface RouletteStore {
  // Settings
  settings: Settings;
  setAllowDuplicateCivilizations: (value: boolean) => void;
  togglePlayer1Civilization: (civId: CivilizationId) => void;
  togglePlayer2Civilization: (civId: CivilizationId) => void;
  toggleMap: (mapId: MapId) => void;
  setSoundEnabled: (value: boolean) => void;
  setPlayer1Name: (name: string) => void;
  setPlayer2Name: (name: string) => void;

  // Game state
  isSpinning: boolean;
  currentResult: RouletteResult | null;
  reels: ReelState[];
  spin: () => void;
  resetResult: () => void;
  updateReel: (index: number, value: string, isSpinning: boolean) => void;
  setSpinning: (value: boolean) => void;

  // Match history
  matchHistory: MatchRecord[];
  recordWin: (winner: 'player1' | 'player2') => void;
  addMatch: (match: MatchRecord) => void;
  updateMatch: (match: MatchRecord) => void;
  deleteMatch: (id: string) => void;
  clearHistory: () => void;
}

const defaultSettings: Settings = {
  allowDuplicateCivilizations: false,
  player1AvailableCivilizations: civilizations.map(c => c.id),
  player2AvailableCivilizations: civilizations.map(c => c.id),
  availableMaps: maps.map(m => m.id),
  soundEnabled: true,
  player1Name: 'Dušan',
  player2Name: 'Michal',
};

export const useStore = create<RouletteStore>()(
  persist(
    (set, get) => ({
      // Settings
      settings: defaultSettings,
      setAllowDuplicateCivilizations: (value) =>
        set((state) => ({
          settings: { ...state.settings, allowDuplicateCivilizations: value },
        })),
      togglePlayer1Civilization: (civId) =>
        set((state) => {
          const civs = state.settings.player1AvailableCivilizations;
          const newCivs = civs.includes(civId)
            ? civs.filter((id) => id !== civId)
            : [...civs, civId];
          return {
            settings: { ...state.settings, player1AvailableCivilizations: newCivs },
          };
        }),
      togglePlayer2Civilization: (civId) =>
        set((state) => {
          const civs = state.settings.player2AvailableCivilizations;
          const newCivs = civs.includes(civId)
            ? civs.filter((id) => id !== civId)
            : [...civs, civId];
          return {
            settings: { ...state.settings, player2AvailableCivilizations: newCivs },
          };
        }),
      toggleMap: (mapId) =>
        set((state) => {
          const mapList = state.settings.availableMaps;
          const newMaps = mapList.includes(mapId)
            ? mapList.filter((id) => id !== mapId)
            : [...mapList, mapId];
          return {
            settings: { ...state.settings, availableMaps: newMaps },
          };
        }),
      setSoundEnabled: (value) =>
        set((state) => ({
          settings: { ...state.settings, soundEnabled: value },
        })),
      setPlayer1Name: (name) =>
        set((state) => ({
          settings: { ...state.settings, player1Name: name },
        })),
      setPlayer2Name: (name) =>
        set((state) => ({
          settings: { ...state.settings, player2Name: name },
        })),

      // Game state
      isSpinning: false,
      currentResult: null,
      reels: [
        { type: 'map', isSpinning: false, currentValue: 'Map' },
        { type: 'player1', isSpinning: false, currentValue: 'Player 1' },
        { type: 'player2', isSpinning: false, currentValue: 'Player 2' },
      ],
      spin: () => {
        const state = get();
        const { settings } = state;

        // Validate settings
        if (settings.availableMaps.length === 0) {
          alert('Please select at least one map');
          return;
        }
        if (settings.player1AvailableCivilizations.length === 0) {
          alert('Please select at least one civilization for Player 1');
          return;
        }
        if (settings.player2AvailableCivilizations.length === 0) {
          alert('Please select at least one civilization for Player 2');
          return;
        }

        // Random selection
        const randomMap = settings.availableMaps[Math.floor(Math.random() * settings.availableMaps.length)];
        
        const player1Civ = settings.player1AvailableCivilizations[Math.floor(Math.random() * settings.player1AvailableCivilizations.length)];
        let player2Civ = settings.player2AvailableCivilizations[Math.floor(Math.random() * settings.player2AvailableCivilizations.length)];

        // Enforce no duplicate civilizations if setting is disabled
        if (!settings.allowDuplicateCivilizations && player1Civ === player2Civ) {
          const availableForPlayer2 = settings.player2AvailableCivilizations.filter(id => id !== player1Civ);
          if (availableForPlayer2.length > 0) {
            player2Civ = availableForPlayer2[Math.floor(Math.random() * availableForPlayer2.length)];
          }
        }

        // Random colors (always unique)
        const availableColors = colors.map(c => c.id);
        const player1Color = availableColors[Math.floor(Math.random() * availableColors.length)];
        const availableColorsForPlayer2 = availableColors.filter(id => id !== player1Color);
        const player2Color = availableColorsForPlayer2[Math.floor(Math.random() * availableColorsForPlayer2.length)];

        const result: RouletteResult = {
          map: randomMap,
          player1: { civilization: player1Civ, color: player1Color },
          player2: { civilization: player2Civ, color: player2Color },
        };

        set({
          isSpinning: true,
          currentResult: result,
          reels: [
            { type: 'map', isSpinning: true, currentValue: 'Spinning...' },
            { type: 'player1', isSpinning: true, currentValue: 'Spinning...' },
            { type: 'player2', isSpinning: true, currentValue: 'Spinning...' },
          ],
        });
      },
      resetResult: () =>
        set({
          currentResult: null,
          isSpinning: false,
          reels: [
            { type: 'map', isSpinning: false, currentValue: 'Map' },
            { type: 'player1', isSpinning: false, currentValue: 'Player 1' },
            { type: 'player2', isSpinning: false, currentValue: 'Player 2' },
          ],
        }),

      updateReel: (index, value, isSpinning) =>
        set((state) => ({
          reels: state.reels.map((reel, i) =>
            i === index ? { ...reel, currentValue: value, isSpinning } : reel
          ),
        })),
      setSpinning: (value) => set({ isSpinning: value }),

      // Match history
      matchHistory: [],
      recordWin: (winner) => {
        const state = get();
        if (!state.currentResult) return;
        const r = state.currentResult;
        const record: MatchRecord = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          date: new Date().toISOString(),
          map: r.map,
          player1Name: state.settings.player1Name,
          player1Civilization: r.player1.civilization,
          player1Color: r.player1.color,
          player2Name: state.settings.player2Name,
          player2Civilization: r.player2.civilization,
          player2Color: r.player2.color,
          winner,
        };
        set((s) => ({ matchHistory: [record, ...s.matchHistory] }));
      },
      addMatch: (match) =>
        set((s) => ({ matchHistory: [match, ...s.matchHistory] })),
      updateMatch: (match) =>
        set((s) => ({
          matchHistory: s.matchHistory.map((m) => (m.id === match.id ? match : m)),
        })),
      deleteMatch: (id) =>
        set((s) => ({ matchHistory: s.matchHistory.filter((m) => m.id !== id) })),
      clearHistory: () => set({ matchHistory: [] }),
    }),
    {
      name: 'aoe4-roulette-storage',
      partialize: (state) => ({ settings: state.settings, matchHistory: state.matchHistory }),
    }
  )
);
