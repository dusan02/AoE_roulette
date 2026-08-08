// ============================================================
// AoE IV Roulette – Maps Data
// All official Age of Empires IV maps available in skirmish
// ============================================================

import type { GameMap } from '../types';

const MAPS: GameMap[] = [
  // ── Land Maps ─────────────────────────────────────────────
  { id: 'dry-arabia', name: 'Dry Arabia', type: 'land' },
  { id: 'lipany', name: 'Lipany', type: 'land' },
  { id: 'altai', name: 'Altai', type: 'land' },
  { id: 'black-forest', name: 'Black Forest', type: 'land' },
  { id: 'hill-and-dale', name: 'Hill and Dale', type: 'land' },
  { id: 'mountain-pass', name: 'Mountain Pass', type: 'land' },
  { id: 'french-pass', name: 'French Pass', type: 'land' },
  { id: 'king-of-the-hill', name: 'King of the Hill', type: 'land' },
  { id: 'high-view', name: 'High View', type: 'land' },
  { id: 'hideout', name: 'Hideout', type: 'land' },
  { id: 'prairie', name: 'Prairie', type: 'land' },
  { id: 'the-pit', name: 'The Pit', type: 'land' },
  { id: 'turtle-ridge', name: 'Turtle Ridge', type: 'land' },
  { id: 'glade', name: 'Glade', type: 'land' },
  { id: 'gorge', name: 'Gorge', type: 'land' },
  { id: 'golden-pit', name: 'Golden Pit', type: 'land' },
  { id: 'marshland', name: 'Marshland', type: 'land' },
  { id: 'wetlands', name: 'Wetlands', type: 'land' },
  { id: 'cliffside', name: 'Cliffside', type: 'land' },
  { id: 'hidden-valley', name: 'Hidden Valley', type: 'land' },
  { id: 'mountain-clearing', name: 'Mountain Clearing', type: 'land' },
  { id: 'flankwoods', name: 'Flankwoods', type: 'land' },
  { id: 'highwoods', name: 'Highwoods', type: 'land' },
  { id: 'carmel', name: 'Carmel', type: 'land' },
  { id: 'hedgemaze', name: 'Hedgemaze', type: 'land' },
  { id: 'megarandom', name: 'MegaRandom', type: 'land' }, // Often treated as land/hybrid

  // ── Hybrid Maps ───────────────────────────────────────────
  { id: 'confluence', name: 'Confluence', type: 'hybrid' },
  { id: 'mongolian-heights', name: 'Mongolian Heights', type: 'hybrid' },
  { id: 'boulder-bay', name: 'Boulder Bay', type: 'hybrid' },
  { id: 'danube-river', name: 'Danube River', type: 'hybrid' },
  { id: 'four-lakes', name: 'Four Lakes', type: 'hybrid' },
  { id: 'ancient-spires', name: 'Ancient Spires', type: 'hybrid' },
  { id: 'oasis', name: 'Oasis', type: 'hybrid' },
  { id: 'waterholes', name: 'Waterholes', type: 'hybrid' },
  { id: 'volcanic-island', name: 'Volcanic Island', type: 'hybrid' },
  { id: 'rocky-river', name: 'Rocky River', type: 'hybrid' },
  { id: 'canal', name: 'Canal', type: 'hybrid' },
  { id: 'himeyama', name: 'Himeyama', type: 'hybrid' },
  { id: 'golden-heights', name: 'Golden Heights', type: 'hybrid' },
  { id: 'lake-side', name: 'Lake Side', type: 'hybrid' },
  { id: 'craters', name: 'Craters', type: 'hybrid' },
  { id: 'west-lake', name: 'West Lake', type: 'hybrid' },

  // ── Water Maps ────────────────────────────────────────────
  { id: 'archipelago', name: 'Archipelago', type: 'water' },
  { id: 'baltic', name: 'Baltic', type: 'water' },
  { id: 'mediterranean', name: 'Mediterranean', type: 'water' },
  { id: 'migration', name: 'Migration', type: 'water' },
  { id: 'warring-islands', name: 'Warring Islands', type: 'water' },
  { id: 'scandinavia', name: 'Scandinavia', type: 'water' },
];

export default MAPS;

/** Get maps filtered by type */
export const getMapsByType = (type: GameMap['type']) =>
  MAPS.filter((m) => m.type === type);
