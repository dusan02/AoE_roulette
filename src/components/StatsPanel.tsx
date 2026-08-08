import { useState } from 'react';
import { Trash2, Pencil, Plus, X, Check } from 'lucide-react';
import { useStore } from '../store/useStore';
import { civilizations } from '../data/civilizations';
import { colors } from '../data/colors';
import { maps } from '../data/maps';
import { MatchRecord } from '../types';

const civName = (id: string) => civilizations.find(c => c.id === id)?.name ?? id;
const mapName = (id: string) => maps.find(m => m.id === id)?.name ?? id;
const colorHex = (id: string) => colors.find(c => c.id === id)?.hex ?? '#888';
const colorName = (id: string) => colors.find(c => c.id === id)?.name ?? id;

function formatDateForInput(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${mins}`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${mins}`;
}

const emptyMatch = (p1Name: string, p2Name: string): MatchRecord => ({
  id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  date: new Date().toISOString(),
  map: maps[0].id,
  player1Name: p1Name,
  player1Civilization: civilizations[0].id,
  player1Color: colors[0].id,
  player2Name: p2Name,
  player2Civilization: civilizations[1]?.id ?? civilizations[0].id,
  player2Color: colors[1]?.id ?? colors[0].id,
  winner: 'player1',
});

export const StatsPanel = () => {
  const { matchHistory, settings, addMatch, updateMatch, deleteMatch, clearHistory } = useStore();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MatchRecord | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  const p1Name = settings.player1Name;
  const p2Name = settings.player2Name;

  const p1Wins = matchHistory.filter(m => m.winner === 'player1').length;
  const p2Wins = matchHistory.filter(m => m.winner === 'player2').length;
  const total = matchHistory.length;

  const civWins: Record<string, number> = {};
  matchHistory.forEach(m => {
    const winningCiv = m.winner === 'player1' ? m.player1Civilization : m.player2Civilization;
    civWins[winningCiv] = (civWins[winningCiv] || 0) + 1;
  });
  const sortedCivWins = Object.entries(civWins).sort((a, b) => b[1] - a[1]);

  const startAdd = () => {
    setIsAdding(true);
    setDraft(emptyMatch(p1Name, p2Name));
    setEditingId(null);
  };

  const startEdit = (match: MatchRecord) => {
    setEditingId(match.id);
    setDraft({ ...match });
    setIsAdding(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setDraft(null);
    setIsAdding(false);
  };

  const saveMatch = () => {
    if (!draft) return;
    if (isAdding) {
      const newMatch: MatchRecord = {
        ...draft,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      };
      addMatch(newMatch);
    } else {
      updateMatch(draft);
    }
    setEditingId(null);
    setDraft(null);
    setIsAdding(false);
  };

  const updateDraft = (field: keyof MatchRecord, value: string) => {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  };

  const renderRow = (m: MatchRecord, isEdit: boolean) => {
    if (isEdit && draft) {
      return (
        <tr key={m.id} className="border-b border-aoe-border/40 bg-aoe-panel/70">
          <td className="py-2 px-2 align-top">
            <input
              type="datetime-local"
              value={formatDateForInput(draft.date)}
              onChange={(e) => updateDraft('date', new Date(e.target.value).toISOString())}
              className="bg-aoe-bg border border-aoe-border rounded px-2 py-1 text-aoe-text text-xs w-full"
            />
          </td>
          <td className="py-2 px-2 align-top">
            <select
              value={draft.map}
              onChange={(e) => updateDraft('map', e.target.value)}
              className="bg-aoe-bg border border-aoe-border rounded px-2 py-1 text-aoe-text text-xs w-full"
            >
              {maps.map((map) => (
                <option key={map.id} value={map.id}>{map.name}</option>
              ))}
            </select>
          </td>
          <td className="py-2 px-2 align-top">
            <div className="space-y-2">
              <select
                value={draft.player1Civilization}
                onChange={(e) => updateDraft('player1Civilization', e.target.value)}
                className="bg-aoe-bg border border-aoe-border rounded px-2 py-1 text-aoe-text text-xs w-full"
              >
                {civilizations.map((civ) => (
                  <option key={civ.id} value={civ.id}>{civ.name}</option>
                ))}
              </select>
              <select
                value={draft.player1Color}
                onChange={(e) => updateDraft('player1Color', e.target.value)}
                className="bg-aoe-bg border border-aoe-border rounded px-2 py-1 text-aoe-text text-xs w-full"
              >
                {colors.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </td>
          <td className="py-2 px-2 align-top">
            <div className="space-y-2">
              <select
                value={draft.player2Civilization}
                onChange={(e) => updateDraft('player2Civilization', e.target.value)}
                className="bg-aoe-bg border border-aoe-border rounded px-2 py-1 text-aoe-text text-xs w-full"
              >
                {civilizations.map((civ) => (
                  <option key={civ.id} value={civ.id}>{civ.name}</option>
                ))}
              </select>
              <select
                value={draft.player2Color}
                onChange={(e) => updateDraft('player2Color', e.target.value)}
                className="bg-aoe-bg border border-aoe-border rounded px-2 py-1 text-aoe-text text-xs w-full"
              >
                {colors.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </td>
          <td className="py-2 px-2 align-top text-center">
            <select
              value={draft.winner}
              onChange={(e) => updateDraft('winner', e.target.value as 'player1' | 'player2')}
              className="bg-aoe-bg border border-aoe-border rounded px-2 py-1 text-aoe-text text-xs"
            >
              <option value="player1">{p1Name}</option>
              <option value="player2">{p2Name}</option>
            </select>
          </td>
          <td className="py-2 px-2 text-right align-top">
            <div className="flex items-center justify-end gap-1">
              <button
                onClick={saveMatch}
                className="text-aoe-gold hover:text-aoe-text transition-colors p-1"
                title="Uložiť"
              >
                <Check size={16} />
              </button>
              <button
                onClick={cancelEdit}
                className="text-aoe-textDim hover:text-medieval-red transition-colors p-1"
                title="Zrušiť"
              >
                <X size={16} />
              </button>
            </div>
          </td>
        </tr>
      );
    }

    return (
      <tr key={m.id} className="border-b border-aoe-border/40 hover:bg-aoe-panel/50 transition-colors">
        <td className="py-2 px-2 text-aoe-textDim whitespace-nowrap">{formatDate(m.date)}</td>
        <td className="py-2 px-2 text-aoe-text">{mapName(m.map)}</td>
        <td className="py-2 px-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colorHex(m.player1Color) }} />
              <span className="text-aoe-text text-sm">{civName(m.player1Civilization)}</span>
            </div>
            <div className="text-[10px] text-aoe-textDim">{colorName(m.player1Color)}</div>
          </div>
        </td>
        <td className="py-2 px-2">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: colorHex(m.player2Color) }} />
              <span className="text-aoe-text text-sm">{civName(m.player2Civilization)}</span>
            </div>
            <div className="text-[10px] text-aoe-textDim">{colorName(m.player2Color)}</div>
          </div>
        </td>
        <td className="py-2 px-2 text-center">
          <span
            className="font-bold"
            style={{ color: m.winner === 'player1' ? colorHex(m.player1Color) : colorHex(m.player2Color) }}
          >
            {m.winner === 'player1' ? m.player1Name : m.player2Name}
          </span>
        </td>
        <td className="py-2 px-2 text-right">
          <div className="flex items-center justify-end gap-1">
            <button
              onClick={() => startEdit(m)}
              className="text-aoe-textDim hover:text-aoe-gold transition-colors p-1"
              title="Upraviť"
            >
              <Pencil size={14} />
            </button>
            <button
              onClick={() => deleteMatch(m.id)}
              className="text-aoe-textDim hover:text-medieval-red transition-colors p-1"
              title="Zmazať"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </td>
      </tr>
    );
  };

  return (
    <div className="space-y-6">
      <div className="p-6 space-y-6">
        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-aoe-panel rounded-xl border border-aoe-border p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-aoe-textDim mb-1">{p1Name}</div>
            <div className="text-3xl font-black text-aoe-gold">{p1Wins}</div>
            <div className="text-xs text-aoe-textDim mt-1">výhier</div>
          </div>
          <div className="bg-aoe-panel rounded-xl border border-aoe-border p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-aoe-textDim mb-1">Spolu</div>
            <div className="text-3xl font-black text-aoe-text">{total}</div>
            <div className="text-xs text-aoe-textDim mt-1">zápasov</div>
          </div>
          <div className="bg-aoe-panel rounded-xl border border-aoe-border p-4 text-center">
            <div className="text-xs uppercase tracking-wider text-aoe-textDim mb-1">{p2Name}</div>
            <div className="text-3xl font-black text-aoe-gold">{p2Wins}</div>
            <div className="text-xs text-aoe-textDim mt-1">výhier</div>
          </div>
        </div>

        {/* Win rate bar */}
        {total > 0 && (
          <div className="space-y-1">
            <div className="flex h-6 rounded-full overflow-hidden border border-aoe-border">
              <div
                className="flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${(p1Wins / total) * 100}%`, backgroundColor: '#3B82F6' }}
              >
                {p1Wins > 0 ? `${Math.round((p1Wins / total) * 100)}%` : ''}
              </div>
              <div
                className="flex items-center justify-center text-xs font-bold text-white"
                style={{ width: `${(p2Wins / total) * 100}%`, backgroundColor: '#EF4444' }}
              >
                {p2Wins > 0 ? `${Math.round((p2Wins / total) * 100)}%` : ''}
              </div>
            </div>
          </div>
        )}

        {/* Civilization win counts */}
        {sortedCivWins.length > 0 && (
          <div className="space-y-3">
            <h3 className="text-lg font-medieval text-aoe-text font-bold border-b border-aoe-border pb-2">
              Výhry podľa civilizácie
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {sortedCivWins.map(([civId, wins]) => (
                <div key={civId} className="flex items-center justify-between bg-aoe-panel rounded-lg border border-aoe-border px-3 py-2">
                  <span className="text-sm text-aoe-text">{civName(civId)}</span>
                  <span className="text-sm font-bold text-aoe-gold">{wins}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Match table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medieval text-aoe-text font-bold border-b border-aoe-border pb-2 flex-1">
              História zápasov
            </h3>
            <div className="flex items-center gap-2 ml-4">
              <button
                onClick={startAdd}
                className="text-aoe-gold hover:text-aoe-text transition-colors flex items-center gap-1 text-sm"
              >
                <Plus size={16} />
                Pridať
              </button>
              {total > 0 && (
                <button
                  onClick={() => { if (confirm('Naozaj zmazať celú históriu?')) clearHistory(); }}
                className="text-aoe-textDim hover:text-medieval-red transition-colors flex items-center gap-1 text-sm"
              >
                <Trash2 size={16} />
                  Zmazať všetko
              </button>
              )}
            </div>
          </div>

          {total === 0 && !isAdding ? (
            <div className="text-center text-aoe-textDim py-12">
              Zatiaľ žiadne zaznamenané zápasy. Klikni „Pridať" a zadaj prvý výsledok!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-aoe-textDim text-xs uppercase tracking-wider border-b border-aoe-border">
                    <th className="text-left py-2 px-2">Dátum</th>
                    <th className="text-left py-2 px-2">Mapa</th>
                    <th className="text-left py-2 px-2">{p1Name}</th>
                    <th className="text-left py-2 px-2">{p2Name}</th>
                    <th className="text-center py-2 px-2">Víťaz</th>
                    <th className="py-2 px-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {isAdding && draft && renderRow(draft, true)}
                  {matchHistory.map((m: MatchRecord) => renderRow(m, editingId === m.id))}
                </tbody>
                {matchHistory.length > 0 && (
                  <tfoot>
                    <tr className="border-t-2 border-aoe-gold/40">
                      <td colSpan={4} className="py-3 px-2 font-bold text-aoe-text uppercase text-xs tracking-wider">
                        Víťazstvá spolu
                      </td>
                      <td className="py-3 px-2 text-center">
                        <span className="font-bold" style={{ color: '#3B82F6' }}>{p1Wins}</span>
                        <span className="text-aoe-textDim mx-1">:</span>
                        <span className="font-bold" style={{ color: '#EF4444' }}>{p2Wins}</span>
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
