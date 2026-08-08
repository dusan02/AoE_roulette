# AoE IV Roulette

A local slot machine application for Age of Empires IV: Anniversary Edition that randomly assigns maps, civilizations, and colors for 1v1 matches.

## Features

- **Slot Machine Experience**: Casino-style spinning reels with smooth animations
- **Random Selection**: Randomly selects map, civilizations, and colors
- **Civilization Rules**: Option to allow or disallow duplicate civilizations
- **Color Rules**: Always ensures unique colors for both players
- **Individual Civilization Pools**: Each player can have their own set of available civilizations
- **Map Selection**: Choose which maps are available for random selection
- **Settings Persistence**: All settings are automatically saved to Local Storage
- **Result Card**: View and copy results in a formatted text
- **Celebration Effects**: Confetti animation when reels stop
- **Sound Support**: Toggle sound on/off (placeholder for sound effects)
- **Medieval Theme**: Dark mode with gold accents inspired by Age of Empires
- **Responsive Design**: Works on desktop, tablet, and mobile

## Installation

```bash
npm install
```

## Usage

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Build

```bash
npm run build
```

## Technology Stack

- React 18
- TypeScript
- Vite
- TailwindCSS
- Zustand (state management)
- Framer Motion (animations)
- canvas-confetti (celebration effects)
- Lucide React (icons)

## Project Structure

```
src/
├─ assets/          # Static assets
├─ components/      # React components
├─ data/           # Game data (civilizations, maps, colors)
├─ hooks/          # Custom React hooks
├─ pages/          # Page components
├─ store/          # Zustand store
├─ utils/          # Utility functions
└─ types/          # TypeScript type definitions
```

## Game Data

The application includes data for:
- 12 Civilizations (including DLC)
- 15 Standard Maps
- 8 Player Colors

You can easily update these files to add new content:
- `src/data/civilizations.ts`
- `src/data/maps.ts`
- `src/data/colors.ts`

## License

This is a personal project for educational and entertainment purposes.
