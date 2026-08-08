import { CivilizationId } from '../data/civilizations';
import { MapId } from '../data/maps';
import { ColorId } from '../data/colors';

export type { CivilizationId, MapId, ColorId };

export interface RouletteResult {
  map: MapId;
  player1: {
    civilization: CivilizationId;
    color: ColorId;
  };
  player2: {
    civilization: CivilizationId;
    color: ColorId;
  };
}

export interface Settings {
  allowDuplicateCivilizations: boolean;
  player1AvailableCivilizations: CivilizationId[];
  player2AvailableCivilizations: CivilizationId[];
  availableMaps: MapId[];
  soundEnabled: boolean;
  player1Name: string;
  player2Name: string;
}

export type ReelType = 'map' | 'player1' | 'player2';

export interface ReelState {
  type: ReelType;
  isSpinning: boolean;
  currentValue: string;
}

export interface MatchRecord {
  id: string;
  date: string;
  map: MapId;
  player1Name: string;
  player1Civilization: CivilizationId;
  player1Color: ColorId;
  player2Name: string;
  player2Civilization: CivilizationId;
  player2Color: ColorId;
  winner: 'player1' | 'player2';
}
