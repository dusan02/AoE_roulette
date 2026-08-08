// ============================================================
// AoE IV Roulette – Civilizations Data
// All civilizations in Age of Empires IV: Anniversary Edition
// ============================================================

import type { Civilization } from '../types';

const CIVS: Civilization[] = [
  // ── Base Game ──────────────────────────────────────────────
  { id: 'abbasid-dynasty', name: 'Abbasid Dynasty', dlc: 'base', type: 'full' },
  { id: 'chinese', name: 'Chinese', dlc: 'base', type: 'full' },
  { id: 'delhi-sultanate', name: 'Delhi Sultanate', dlc: 'base', type: 'full' },
  { id: 'english', name: 'English', dlc: 'base', type: 'full' },
  { id: 'french', name: 'French', dlc: 'base', type: 'full' },
  { id: 'holy-roman-empire', name: 'Holy Roman Empire', dlc: 'base', type: 'full' },
  { id: 'mongols', name: 'Mongols', dlc: 'base', type: 'full' },
  { id: 'rus', name: 'Rus', dlc: 'base', type: 'full' },
  // Free Anniversary Update additions
  { id: 'malians', name: 'Malians', dlc: 'base', type: 'full' },
  { id: 'ottomans', name: 'Ottomans', dlc: 'base', type: 'full' },

  // ── The Sultans Ascend DLC ─────────────────────────────────
  { id: 'byzantines', name: 'Byzantines', dlc: 'The Sultans Ascend', type: 'full' },
  { id: 'japanese', name: 'Japanese', dlc: 'The Sultans Ascend', type: 'full' },
  { id: 'ayyubids', name: 'Ayyubids', dlc: 'The Sultans Ascend', type: 'variant', parentCiv: 'Abbasid Dynasty' },
  { id: 'jeanne-darc', name: "Jeanne d'Arc", dlc: 'The Sultans Ascend', type: 'variant', parentCiv: 'French' },
  { id: 'order-of-the-dragon', name: 'Order of the Dragon', dlc: 'The Sultans Ascend', type: 'variant', parentCiv: 'Holy Roman Empire' },
  { id: 'zhu-xis-legacy', name: "Zhu Xi's Legacy", dlc: 'The Sultans Ascend', type: 'variant', parentCiv: 'Chinese' },

  // ── Knights of Cross and Rose DLC ─────────────────────────
  { id: 'house-of-lancaster', name: 'House of Lancaster', dlc: 'Knights of Cross and Rose', type: 'variant', parentCiv: 'English' },
  { id: 'knights-templar', name: 'Knights Templar', dlc: 'Knights of Cross and Rose', type: 'variant', parentCiv: 'French' },

  // ── Dynasties of the East DLC ─────────────────────────────
  { id: 'golden-horde', name: 'Golden Horde', dlc: 'Dynasties of the East', type: 'variant', parentCiv: 'Mongols' },
  { id: 'macedonian-dynasty', name: 'Macedonian Dynasty', dlc: 'Dynasties of the East', type: 'variant', parentCiv: 'Byzantines' },
  { id: 'sengoku-daimyo', name: 'Sengoku Daimyo', dlc: 'Dynasties of the East', type: 'variant', parentCiv: 'Japanese' },
  { id: 'tughlaq-dynasty', name: 'Tughlaq Dynasty', dlc: 'Dynasties of the East', type: 'variant', parentCiv: 'Delhi Sultanate' },

  // ── Yue Fei's Legacy DLC ──────────────────────────────────
  { id: 'jin-dynasty', name: 'Jin Dynasty', dlc: "Yue Fei's Legacy", type: 'full' },
];

export default CIVS;

/** Get all civilizations for a specific DLC */
export const getCivsByDlc = (dlc: Civilization['dlc']) =>
  CIVS.filter((c) => c.dlc === dlc);

/** Get base game civilizations only */
export const getBaseCivs = () => getCivsByDlc('base');
