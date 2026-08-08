// ============================================================
// AoE IV Roulette – Zustand Store
// Central state management with localStorage persistence
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import CIVS from '../data/civilizations';
import MAPS from '../data/maps';
import PLAYER_COLORS from '../data/colors';
import { generateResult } from '../utils/roulette';
import type { AppSettings, MatchRecord, RouletteResult, SpinPhase } from '../types';

// Default settings: all base-game civs enabled for both players, all maps enabled
const defaultEnabledCivIds = CIVS.filter((c) => c.dlc === 'base').map((c) => c.id);
const defaultEnabledMapIds = MAPS.map((m) => m.id);

interface RouletteState extends AppSettings {
  // Player display names
  player1Name: string;
  player2Name: string;

  // Current spin result
  result: RouletteResult | null;
  // Spin animation phase
  spinPhase: SpinPhase;
  // Last spin error message (e.g., not enough civs/maps)
  spinError: string | null;

  // Match history for statistics
  matchHistory: MatchRecord[];

  // ── Actions ───────────────────────────────────────────────
  spin: () => void;
  setSpinPhase: (phase: SpinPhase) => void;
  clearError: () => void;
  recordMatch: (winner: 'player1' | 'player2') => void;
  addMatch: (match: MatchRecord) => void;
  updateMatch: (match: MatchRecord) => void;
  deleteMatch: (id: string) => void;
  clearHistory: () => void;

  // Player name actions
  setPlayer1Name: (name: string) => void;
  setPlayer2Name: (name: string) => void;

  // Settings actions
  togglePlayer1Civ: (civId: string) => void;
  togglePlayer2Civ: (civId: string) => void;
  toggleMap: (mapId: string) => void;
  setAllPlayer1Civs: (enabled: boolean) => void;
  setAllPlayer2Civs: (enabled: boolean) => void;
  setAllMaps: (enabled: boolean) => void;
  toggleAllowDuplicateCivs: () => void;
  toggleMuted: () => void;
}

export const useRouletteStore = create<RouletteState>()(
  persist(
    (set, get) => ({
      // ── Initial Settings ──────────────────────────────────
      player1Name: 'Dušan',
      player2Name: 'Michal',
      player1EnabledCivIds: defaultEnabledCivIds,
      player2EnabledCivIds: defaultEnabledCivIds,
      enabledMapIds: defaultEnabledMapIds,
      allowDuplicateCivs: false,
      muted: false,

      // ── Initial UI State ──────────────────────────────────
      result: null,
      spinPhase: 'idle',
      spinError: null,

      // ── Match History ─────────────────────────────────────
      matchHistory: [],

      recordMatch: (winner) => {
        const state = get();
        if (!state.result) return;
        const r = state.result;
        const record: MatchRecord = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          date: new Date().toISOString(),
          mapId: r.map.id,
          player1CivId: r.player1.civilization.id,
          player1ColorId: r.player1.color.id,
          player2CivId: r.player2.civilization.id,
          player2ColorId: r.player2.color.id,
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

      // ── Spin Action ───────────────────────────────────────
      spin: () => {
        const state = get();
        if (state.spinPhase === 'spinning' || state.spinPhase === 'stopping') return;

        const player1Civs = CIVS.filter((c) => state.player1EnabledCivIds.includes(c.id));
        const player2Civs = CIVS.filter((c) => state.player2EnabledCivIds.includes(c.id));
        const enabledMaps = MAPS.filter((m) => state.enabledMapIds.includes(m.id));

        try {
          const result = generateResult({
            enabledMaps,
            player1Civs,
            player2Civs,
            allColors: PLAYER_COLORS,
            allowDuplicateCivs: state.allowDuplicateCivs,
          });
          set({ result, spinPhase: 'spinning', spinError: null });
        } catch (err) {
          set({ spinError: err instanceof Error ? err.message : 'Unknown error', spinPhase: 'idle' });
        }
      },

      setSpinPhase: (phase) => set({ spinPhase: phase }),
      clearError: () => set({ spinError: null }),

      // ── Player Name Actions ───────────────────────────────
      setPlayer1Name: (name) => set({ player1Name: name || 'Dušan' }),
      setPlayer2Name: (name) => set({ player2Name: name || 'Michal' }),

      // ── Settings Toggles ──────────────────────────────────
      togglePlayer1Civ: (civId) =>
        set((state) => ({
          player1EnabledCivIds: state.player1EnabledCivIds.includes(civId)
            ? state.player1EnabledCivIds.filter((id) => id !== civId)
            : [...state.player1EnabledCivIds, civId],
        })),

      togglePlayer2Civ: (civId) =>
        set((state) => ({
          player2EnabledCivIds: state.player2EnabledCivIds.includes(civId)
            ? state.player2EnabledCivIds.filter((id) => id !== civId)
            : [...state.player2EnabledCivIds, civId],
        })),

      toggleMap: (mapId) =>
        set((state) => ({
          enabledMapIds: state.enabledMapIds.includes(mapId)
            ? state.enabledMapIds.filter((id) => id !== mapId)
            : [...state.enabledMapIds, mapId],
        })),

      setAllPlayer1Civs: (enabled) =>
        set({ player1EnabledCivIds: enabled ? CIVS.map((c) => c.id) : [] }),

      setAllPlayer2Civs: (enabled) =>
        set({ player2EnabledCivIds: enabled ? CIVS.map((c) => c.id) : [] }),

      setAllMaps: (enabled) =>
        set({ enabledMapIds: enabled ? MAPS.map((m) => m.id) : [] }),

      toggleAllowDuplicateCivs: () =>
        set((state) => ({ allowDuplicateCivs: !state.allowDuplicateCivs })),

      toggleMuted: () => set((state) => ({ muted: !state.muted })),
    }),
    {
      name: 'aoe4-roulette-settings',
      storage: createJSONStorage(() => localStorage),
      version: 2,
      // Only persist settings and names, not ephemeral UI state
      partialize: (state) => ({
        player1Name: state.player1Name,
        player2Name: state.player2Name,
        player1EnabledCivIds: state.player1EnabledCivIds,
        player2EnabledCivIds: state.player2EnabledCivIds,
        enabledMapIds: state.enabledMapIds,
        allowDuplicateCivs: state.allowDuplicateCivs,
        muted: state.muted,
        matchHistory: state.matchHistory,
      }),
      migrate: (persisted: unknown, version: number) => {
        const s = (persisted ?? {}) as Record<string, unknown>;
        // v1 -> v2: replace old default names with Dušan / Michal
        if (version < 2) {
          if (s.player1Name === 'Player 1' || s.player1Name === undefined) s.player1Name = 'Dušan';
          if (s.player2Name === 'Player 2' || s.player2Name === undefined) s.player2Name = 'Michal';
        }
        return s;
      },
    }
  )
);
