// ============================================================
// AoE IV Roulette – Roulette Utility Functions
// Pure functions for random selection logic
// ============================================================

import type { Civilization, GameMap, PlayerColor, RouletteResult } from '../types';

/** Pick a random element from an array */
export function pickRandom<T>(arr: T[]): T {
  if (arr.length === 0) throw new Error('Cannot pick from an empty array');
  return arr[Math.floor(Math.random() * arr.length)];
}

/** Pick N unique random elements from an array */
export function pickUniqueRandom<T>(arr: T[], count: number): T[] {
  if (arr.length < count) {
    throw new Error(`Not enough items. Need ${count}, have ${arr.length}`);
  }
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

export interface SpinOptions {
  enabledMaps: GameMap[];
  player1Civs: Civilization[];
  player2Civs: Civilization[];
  allColors: PlayerColor[];
  allowDuplicateCivs: boolean;
}

/**
 * Generate a single roulette result.
 * Guarantees unique colors between players.
 * Optionally enforces unique civilizations.
 */
export function generateResult(options: SpinOptions): RouletteResult {
  const { enabledMaps, player1Civs, player2Civs, allColors, allowDuplicateCivs } = options;

  if (enabledMaps.length === 0) throw new Error('No maps enabled');
  if (player1Civs.length === 0) throw new Error('No civilizations enabled for Player 1');
  if (player2Civs.length === 0) throw new Error('No civilizations enabled for Player 2');

  const map = pickRandom(enabledMaps);

  // Pick Player 1 civ
  const p1Civ = pickRandom(player1Civs);

  // Pick Player 2 civ (exclude p1 civ unless duplicates allowed)
  let p2CivPool = player2Civs;
  if (!allowDuplicateCivs) {
    p2CivPool = player2Civs.filter((c) => c.id !== p1Civ.id);
    if (p2CivPool.length === 0) {
      // Fallback: allow duplicates if we have no other choice
      p2CivPool = player2Civs;
    }
  }
  const p2Civ = pickRandom(p2CivPool);

  // Pick two unique colors
  const [p1Color, p2Color] = pickUniqueRandom(allColors, 2);

  return {
    map,
    player1: { civilization: p1Civ, color: p1Color },
    player2: { civilization: p2Civ, color: p2Color },
    timestamp: Date.now(),
  };
}



/**
 * Format a result as a nicely copyable text string.
 */
export function formatResultAsText(
  result: RouletteResult,
  player1Name = 'Dušan',
  player2Name = 'Michal'
): string {
  const { map, player1, player2 } = result;
  return [
    '🏆 AoE IV Roulette Result',
    '',
    `🗺 Map: ${map.name}`,
    '',
    `${player1.color.emoji} ${player1Name}`,
    player1.civilization.name,
    '',
    `${player2.color.emoji} ${player2Name}`,
    player2.civilization.name,
  ].join('\n');
}
