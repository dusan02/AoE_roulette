import { X, Settings2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import { civilizations } from '../data/civilizations';
import { maps } from '../data/maps';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsPanel = ({ isOpen, onClose }: SettingsPanelProps) => {
  const { settings, setAllowDuplicateCivilizations, togglePlayer1Civilization, togglePlayer2Civilization, toggleMap, setSoundEnabled, setPlayer1Name, setPlayer2Name } = useStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-b from-aoe-bgLight to-aoe-bgMid rounded-xl border border-aoe-border shadow-[0_20px_60px_rgba(0,0,0,0.7)] max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-aoe-bgLight p-4 border-b border-aoe-border flex justify-between items-center">
          <h2 className="text-2xl font-medieval text-aoe-gold font-bold flex items-center gap-2">
            <Settings2 size={24} />
            Settings
          </h2>
          <button
            onClick={onClose}
            className="text-aoe-text hover:text-aoe-gold transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* General Settings */}
          <div className="space-y-4">
            <h3 className="text-xl font-medieval text-aoe-text font-bold border-b border-aoe-border pb-2">
              General
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <label className="flex flex-col gap-2 text-aoe-text font-medieval">
                <span>Player 1 Name</span>
                <input
                  value={settings.player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                  className="bg-aoe-bg border border-aoe-border rounded px-3 py-2 text-aoe-text focus:outline-none focus:border-aoe-accent"
                />
              </label>
              <label className="flex flex-col gap-2 text-aoe-text font-medieval">
                <span>Player 2 Name</span>
                <input
                  value={settings.player2Name}
                  onChange={(e) => setPlayer2Name(e.target.value)}
                  className="bg-aoe-bg border border-aoe-border rounded px-3 py-2 text-aoe-text focus:outline-none focus:border-aoe-accent"
                />
              </label>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.allowDuplicateCivilizations}
                onChange={(e) => setAllowDuplicateCivilizations(e.target.checked)}
                className="w-5 h-5 accent-aoe-gold"
              />
              <span className="text-aoe-text font-medieval">Allow Duplicate Civilizations</span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={settings.soundEnabled}
                onChange={(e) => setSoundEnabled(e.target.checked)}
                className="w-5 h-5 accent-aoe-gold"
              />
              <span className="text-aoe-text font-medieval">Sound Enabled</span>
            </label>
          </div>

          {/* Maps */}
          <div className="space-y-4">
            <h3 className="text-xl font-medieval text-aoe-text font-bold border-b border-aoe-border pb-2">
              Available Maps
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {maps.map((map) => (
                <label key={map.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.availableMaps.includes(map.id)}
                    onChange={() => toggleMap(map.id)}
                    className="w-4 h-4 accent-aoe-gold"
                  />
                  <span className="text-aoe-text text-sm">{map.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Player 1 Civilizations */}
          <div className="space-y-4">
            <h3 className="text-xl font-medieval text-aoe-text font-bold border-b border-aoe-border pb-2">
              Player 1 Available Civilizations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {civilizations.map((civ) => (
                <label key={civ.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.player1AvailableCivilizations.includes(civ.id)}
                    onChange={() => togglePlayer1Civilization(civ.id)}
                    className="w-4 h-4 accent-aoe-gold"
                  />
                  <span className="text-aoe-text text-sm">{civ.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Player 2 Civilizations */}
          <div className="space-y-4">
            <h3 className="text-xl font-medieval text-aoe-text font-bold border-b border-aoe-border pb-2">
              Player 2 Available Civilizations
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {civilizations.map((civ) => (
                <label key={civ.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.player2AvailableCivilizations.includes(civ.id)}
                    onChange={() => togglePlayer2Civilization(civ.id)}
                    className="w-4 h-4 accent-aoe-gold"
                  />
                  <span className="text-aoe-text text-sm">{civ.name}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
