export const civilizations = [
  { id: 'english', name: 'English' },
  { id: 'french', name: 'French' },
  { id: 'hre', name: 'Holy Roman Empire' },
  { id: 'mongols', name: 'Mongols' },
  { id: 'rus', name: 'Rus' },
  { id: 'delhi', name: 'Delhi Sultanate' },
  { id: 'abbasid', name: 'Abbasid Dynasty' },
  { id: 'chinese', name: 'Chinese' },
  { id: 'japanese', name: 'Japanese' },
  { id: 'byzantine', name: 'Byzantine' },
  { id: 'jeanne', name: 'Jeanne d\'Arc' },
  { id: 'aot', name: 'Order of the Dragon' },
] as const;

export type CivilizationId = typeof civilizations[number]['id'];
