export const colors = [
  { id: 'blue', name: 'Blue', hex: '#3B82F6' },
  { id: 'red', name: 'Red', hex: '#EF4444' },
  { id: 'green', name: 'Green', hex: '#22C55E' },
  { id: 'yellow', name: 'Yellow', hex: '#EAB308' },
  { id: 'purple', name: 'Purple', hex: '#A855F7' },
  { id: 'orange', name: 'Orange', hex: '#F97316' },
  { id: 'cyan', name: 'Cyan', hex: '#06B6D4' },
  { id: 'pink', name: 'Pink', hex: '#EC4899' },
] as const;

export type ColorId = typeof colors[number]['id'];
