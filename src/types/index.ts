// ============================================================
// AoE IV Roulette – Shared TypeScript Types
// ============================================================

export type MapType = 'land' | 'hybrid' | 'water';
export type CivType = 'full' | 'variant';
export type DlcName =
  | 'base'
  | 'The Sultans Ascend'
  | 'Knights of Cross and Rose'
  | 'Dynasties of the East'
  | "Yue Fei's Legacy";

export interface Civilization {
  id: string;
  name: string;
  dlc: DlcName;
  type: CivType;
  /** Parent civ name for variant civilizations */
  parentCiv?: string;
}

export interface GameMap {
  id: string;
  name: string;
  type: MapType;
}

export interface PlayerColor {
  id: string;
  name: string;
  /** CSS hex color value */
  hex: string;
  /** Emoji or unicode for copy output */
  emoji: string;
}

export interface PlayerResult {
  civilization: Civilization;
  color: PlayerColor;
}

export interface RouletteResult {
  map: GameMap;
  player1: PlayerResult;
  player2: PlayerResult;
  timestamp: number;
}

export interface MatchRecord {
  id: string;
  date: string; // ISO string
  mapId: string;
  player1CivId: string;
  player1ColorId: string;
  player2CivId: string;
  player2ColorId: string;
  winner: 'player1' | 'player2';
}

export interface AppSettings {
  /** Civilization IDs enabled for Player 1 */
  player1EnabledCivIds: string[];
  /** Civilization IDs enabled for Player 2 */
  player2EnabledCivIds: string[];
  /** Map IDs enabled for the roulette */
  enabledMapIds: string[];
  /** Whether duplicate civilizations are allowed */
  allowDuplicateCivs: boolean;
  /** Whether audio is muted */
  muted: boolean;
}

export type SpinPhase = 'idle' | 'spinning' | 'stopping' | 'done';
