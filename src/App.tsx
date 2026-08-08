import { useState } from 'react';
import { useStore } from './store/useStore';
import { SettingsPanel } from './components/SettingsPanel';
import { StatsPanel } from './components/StatsPanel';
import { RouletteView } from './components/RouletteView';
import { Settings2, Volume2, VolumeX } from 'lucide-react';

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'roulette' | 'stats'>('roulette');
  const { settings, matchHistory } = useStore();

  const toggleSound = () => {
    useStore.getState().setSoundEnabled(!settings.soundEnabled);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-aoe-bg via-aoe-bgMid to-[#080f18] text-aoe-text font-medieval">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <header className="flex items-center justify-between mb-6">
          <div>
            <div className="text-xs uppercase tracking-[0.3em] text-aoe-textDim">AoE IV</div>
            <div className="text-3xl font-black text-aoe-gold drop-shadow">Roulette</div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={toggleSound}
              className="p-2 rounded-lg bg-aoe-panel border border-aoe-border hover:bg-aoe-card transition-colors shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
            >
              {settings.soundEnabled ? <Volume2 size={20} /> : <VolumeX size={20} />}
            </button>
            <button
              onClick={() => setSettingsOpen(true)}
              className="p-2 rounded-lg bg-aoe-panel border border-aoe-border hover:bg-aoe-card transition-colors shadow-[0_6px_14px_rgba(0,0,0,0.4)]"
            >
              <Settings2 size={20} />
            </button>
          </div>
        </header>

        <div className="flex gap-1 mb-6">
          <button
            onClick={() => setActiveTab('roulette')}
            className={`px-5 py-2 rounded-t-lg text-sm font-bold uppercase tracking-wider transition-colors ${
              activeTab === 'roulette'
                ? 'bg-aoe-bgLight text-aoe-gold border-t border-l border-r border-aoe-gold/40'
                : 'bg-aoe-panel text-aoe-textDim border border-aoe-border hover:text-aoe-text'
            }`}
          >
            🎰 Roulette
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-5 py-2 rounded-t-lg text-sm font-bold uppercase tracking-wider transition-colors relative ${
              activeTab === 'stats'
                ? 'bg-aoe-bgLight text-aoe-gold border-t border-l border-r border-aoe-gold/40'
                : 'bg-aoe-panel text-aoe-textDim border border-aoe-border hover:text-aoe-text'
            }`}
          >
            🏆 Štatistiky
            {matchHistory.length > 0 && (
              <span className="ml-2 bg-aoe-gold text-aoe-bg text-[10px] font-bold rounded-full min-w-[18px] h-[18px] inline-flex items-center justify-center px-1">
                {matchHistory.length}
              </span>
            )}
          </button>
        </div>

        {activeTab === 'roulette' && <RouletteView />}

        {activeTab === 'stats' && (
          <div className="relative mx-auto max-w-5xl rounded-[32px] border-[4px] border-aoe-gold bg-aoe-bgLight shadow-[0_30px_80px_rgba(0,0,0,0.7)] overflow-hidden">
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-transparent via-aoe-gold to-transparent" />
            <StatsPanel />
          </div>
        )}

        <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} />
      </div>
    </div>
  );
}

export default App;
