export const maps = [
  { id: 'dry_arabia', name: 'Dry Arabia' },
  { id: 'lipany', name: 'Lipany' },
  { id: 'altai', name: 'Altai' },
  { id: 'archipelago', name: 'Archipelago' },
  { id: 'black_forest', name: 'Black Forest' },
  { id: 'confluence', name: 'Confluence' },
  { id: 'continental', name: 'Continental' },
  { id: 'highland', name: 'Highland' },
  { id: 'hill_fort', name: 'Hill Fort' },
  { id: 'megalith', name: 'Megalith' },
  { id: 'mountain_pass', name: 'Mountain Pass' },
  { id: 'odyssey', name: 'Odyssey' },
  { id: 'sacred_ridge', name: 'Sacred Ridge' },
  { id: 'steppe', name: 'Steppe' },
  { id: 'waterloo', name: 'Waterloo' },
] as const;

export type MapId = typeof maps[number]['id'];
