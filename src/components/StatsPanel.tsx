// ============================================================
// AoE IV Roulette – Statistics Panel
// Editable match history with player win counts
// ============================================================

import { useState, useEffect } from 'react';
import { useRouletteStore } from '../store/useRouletteStore';
import CIVS from '../data/civilizations';
import MAPS from '../data/maps';
import type { MatchRecord } from '../types';

const civById = (id: string) => CIVS.find((c) => c.id === id);
const mapById = (id: string) => MAPS.find((m) => m.id === id);

function formatDate(iso: string): string {
  const d = new Date(iso);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${day}.${month}.${year} ${hours}:${mins}`;
}

function formatDateForInput(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  const hours = String(d.getHours()).padStart(2, '0');
  const mins = String(d.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${mins}`;
}

const SORTED_CIVS = [...CIVS].sort((a, b) => a.name.localeCompare(b.name));
const SORTED_MAPS = [...MAPS].sort((a, b) => a.name.localeCompare(b.name));

const defaultCiv = SORTED_CIVS[0];
const defaultCiv2 = SORTED_CIVS[1] ?? SORTED_CIVS[0];
const defaultMap = SORTED_MAPS[0];

const emptyMatch = (): MatchRecord => ({
  id: `new-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  date: new Date().toISOString(),
  mapId: defaultMap.id,
  player1CivId: defaultCiv.id,
  player1ColorId: '',
  player2CivId: defaultCiv2.id,
  player2ColorId: '',
  winner: 'player1',
});

export function StatsPanel() {
  const {
    matchHistory,
    player1Name,
    player2Name,
    pendingMatch,
    clearPendingMatch,
    addMatch,
    updateMatch,
  } = useRouletteStore();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draft, setDraft] = useState<MatchRecord | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  // When a pending match arrives from a spin, open it as an editable draft row
  useEffect(() => {
    if (pendingMatch) {
      setIsAdding(true);
      setDraft({ ...pendingMatch });
      setEditingId(null);
    }
  }, [pendingMatch]);

  const p1Wins = matchHistory.filter((m) => m.winner === 'player1').length;
  const p2Wins = matchHistory.filter((m) => m.winner === 'player2').length;
  const total = matchHistory.length;

  const civWins: Record<string, number> = {};
  const civLosses: Record<string, number> = {};
  matchHistory.forEach((m) => {
    const winningCiv = m.winner === 'player1' ? m.player1CivId : m.player2CivId;
    const losingCiv = m.winner === 'player1' ? m.player2CivId : m.player1CivId;
    civWins[winningCiv] = (civWins[winningCiv] || 0) + 1;
    civLosses[losingCiv] = (civLosses[losingCiv] || 0) + 1;
  });
  const sortedCivWins = Object.entries(civWins)
    .map(([id, wins]) => ({ civ: civById(id) ?? { id, name: id }, wins }))
    .sort((a, b) => b.wins - a.wins);
  const sortedCivLosses = Object.entries(civLosses)
    .map(([id, losses]) => ({ civ: civById(id) ?? { id, name: id }, losses }))
    .sort((a, b) => b.losses - a.losses);

  const startAdd = () => {
    setIsAdding(true);
    setDraft(emptyMatch());
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
    if (pendingMatch) clearPendingMatch();
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
    if (pendingMatch) clearPendingMatch();
  };

  const updateDraft = <K extends keyof MatchRecord>(field: K, value: MatchRecord[K]) => {
    if (!draft) return;
    setDraft({ ...draft, [field]: value });
  };

  const renderEditRow = (match: MatchRecord, isNew: boolean) => {
    if (!draft) return null;
    return (
      <tr
        key={isNew ? 'new' : match.id}
        className="border-l-4 border-l-gold-400 border-b border-gold-500/50 bg-gold-900/20 shadow-[0_0_20px_rgba(200,168,75,0.15)]"
      >
        <td className="py-3 px-3 align-top min-w-[170px]">
          <input
            type="datetime-local"
            value={formatDateForInput(draft.date)}
            onChange={(e) => updateDraft('date', new Date(e.target.value).toISOString())}
            className="w-full bg-casino-900 border border-gold-600/60 rounded px-2.5 py-2 text-xs text-gold-100 focus:border-gold-400 focus:outline-none"
          />
        </td>
        <td className="py-3 px-3 align-top min-w-[180px]">
          <select
            value={draft.mapId}
            onChange={(e) => updateDraft('mapId', e.target.value)}
            className="w-full min-w-[150px] bg-casino-900 border border-gold-600/60 rounded px-2.5 py-2 text-xs text-gold-100 focus:border-gold-400 focus:outline-none"
          >
            {SORTED_MAPS.map((map) => (
              <option key={map.id} value={map.id}>
                {map.name}
              </option>
            ))}
          </select>
        </td>
        <td className="py-3 px-3 align-top min-w-[180px]">
          <select
            value={draft.player1CivId}
            onChange={(e) => updateDraft('player1CivId', e.target.value)}
            className="w-full min-w-[150px] bg-casino-900 border border-gold-600/60 rounded px-2.5 py-2 text-xs text-gold-100 focus:border-gold-400 focus:outline-none"
          >
            {SORTED_CIVS.map((civ) => (
              <option key={civ.id} value={civ.id}>
                {civ.name}
              </option>
            ))}
          </select>
        </td>
        <td className="py-3 px-3 align-top min-w-[180px]">
          <select
            value={draft.player2CivId}
            onChange={(e) => updateDraft('player2CivId', e.target.value)}
            className="w-full min-w-[150px] bg-casino-900 border border-gold-600/60 rounded px-2.5 py-2 text-xs text-gold-100 focus:border-gold-400 focus:outline-none"
          >
            {SORTED_CIVS.map((civ) => (
              <option key={civ.id} value={civ.id}>
                {civ.name}
              </option>
            ))}
          </select>
        </td>
        <td className="py-3 px-3 align-top text-center min-w-[120px]">
          <select
            value={draft.winner}
            onChange={(e) => updateDraft('winner', e.target.value as 'player1' | 'player2')}
            className="w-full min-w-[100px] bg-casino-900 border border-gold-600/60 rounded px-2.5 py-2 text-xs text-gold-100 focus:border-gold-400 focus:outline-none"
          >
            <option value="player1">{player1Name}</option>
            <option value="player2">{player2Name}</option>
          </select>
        </td>
        <td className="py-3 px-3 align-top text-right min-w-[120px]">
          <div className="flex items-center justify-end gap-1.5">
            <button
              onClick={saveMatch}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-gold-500 text-casino-950 hover:bg-gold-400 shadow-[0_0_12px_rgba(200,168,75,0.4)] transition-all"
            >
              Uložiť
            </button>
            <button
              onClick={cancelEdit}
              className="px-3 py-2 rounded-lg text-xs font-bold bg-casino-700 text-gold-100 hover:bg-casino-600 transition-all"
            >
              Zrušiť
            </button>
          </div>
        </td>
      </tr>
    );
  };

  const renderViewRow = (match: MatchRecord) => {
    const map = mapById(match.mapId);
    const p1Civ = civById(match.player1CivId);
    const p2Civ = civById(match.player2CivId);
    const winnerName = match.winner === 'player1' ? player1Name : player2Name;
    const p1Won = match.winner === 'player1';
    const p2Won = match.winner === 'player2';

    return (
      <tr
        key={match.id}
        className="border-b border-gold-700/20 hover:bg-casino-800/40 transition-colors"
      >
        <td className="py-2.5 px-2 text-xs text-gold-200/70 whitespace-nowrap">
          {formatDate(match.date)}
        </td>
        <td className="py-2.5 px-3 text-sm text-gold-100 whitespace-nowrap">{map?.name ?? match.mapId}</td>
        <td className="py-2.5 px-3">
          <span
            className={`inline-block text-sm whitespace-nowrap rounded px-2 py-0.5 ${
              p1Won ? 'bg-green-500/15 text-green-100' : 'text-gold-100'
            }`}
          >
            {p1Civ?.name ?? match.player1CivId}
          </span>
        </td>
        <td className="py-2.5 px-3">
          <span
            className={`inline-block text-sm whitespace-nowrap rounded px-2 py-0.5 ${
              p2Won ? 'bg-green-500/15 text-green-100' : 'text-gold-100'
            }`}
          >
            {p2Civ?.name ?? match.player2CivId}
          </span>
        </td>
        <td className="py-2.5 px-3 text-center whitespace-nowrap">
          <span className="text-sm font-bold text-gold-300">
            {winnerName}
          </span>
        </td>
        <td className="py-2.5 px-3 text-right whitespace-nowrap">
          <button
            onClick={() => startEdit(match)}
            className="text-[10px] font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-200 px-2 py-1 rounded hover:bg-white/5 transition-colors"
          >
            Upraviť
          </button>
        </td>
      </tr>
    );
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6 px-4 sm:px-6 py-8">
      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-gold-700/40 bg-casino-800/60 p-4 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold-500/70 mb-1">{player1Name}</div>
          <div className="text-3xl font-cinzel font-black text-gold-300">{p1Wins}</div>
          <div className="text-[10px] text-gold-500/50 mt-1">výhier</div>
        </div>
        <div className="rounded-xl border border-gold-700/40 bg-casino-800/60 p-4 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold-500/70 mb-1">Spolu</div>
          <div className="text-3xl font-cinzel font-black text-gold-100">{total}</div>
          <div className="text-[10px] text-gold-500/50 mt-1">zápasov</div>
        </div>
        <div className="rounded-xl border border-gold-700/40 bg-casino-800/60 p-4 text-center">
          <div className="text-[10px] uppercase tracking-[0.2em] text-gold-500/70 mb-1">{player2Name}</div>
          <div className="text-3xl font-cinzel font-black text-gold-300">{p2Wins}</div>
          <div className="text-[10px] text-gold-500/50 mt-1">výhier</div>
        </div>
      </div>

      {/* Win rate bar */}
      {total > 0 && (
        <div className="space-y-1">
          <div className="flex h-6 rounded-full overflow-hidden border border-gold-700/40">
            <div
              className="flex items-center justify-center text-xs font-bold text-white bg-blue-500"
              style={{ width: `${(p1Wins / total) * 100}%` }}
            >
              {p1Wins > 0 ? `${Math.round((p1Wins / total) * 100)}%` : ''}
            </div>
            <div
              className="flex items-center justify-center text-xs font-bold text-white bg-red-500"
              style={{ width: `${(p2Wins / total) * 100}%` }}
            >
              {p2Wins > 0 ? `${Math.round((p2Wins / total) * 100)}%` : ''}
            </div>
          </div>
        </div>
      )}

      {/* Civilization win & loss counts */}
      {(sortedCivWins.length > 0 || sortedCivLosses.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Wins by civilization */}
          {sortedCivWins.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-cinzel font-bold text-gold-300 border-b border-gold-700/30 pb-2">
                Výhry podľa civilizácie
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sortedCivWins.map(({ civ, wins }) => (
                  <div
                    key={civ.id}
                    className="flex items-center justify-between rounded-lg border border-gold-700/30 bg-casino-800/40 px-3 py-2"
                  >
                    <span className="text-sm text-gold-100 truncate mr-2">{civ.name}</span>
                    <span className="text-sm font-cinzel font-bold text-gold-400">{wins}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Losses by civilization */}
          {sortedCivLosses.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-cinzel font-bold text-gold-300 border-b border-gold-700/30 pb-2">
                Prehry podľa civilizácie
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {sortedCivLosses.map(({ civ, losses }) => (
                  <div
                    key={civ.id}
                    className="flex items-center justify-between rounded-lg border border-gold-700/30 bg-casino-800/40 px-3 py-2"
                  >
                    <span className="text-sm text-gold-100 truncate mr-2">{civ.name}</span>
                    <span className="text-sm font-cinzel font-bold text-red-400">{losses}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Match history table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-cinzel font-bold text-gold-300 border-b border-gold-700/30 pb-2 flex-1">
            História zápasov
          </h3>
          <div className="flex items-center gap-3 ml-4">
            <button
              onClick={startAdd}
              className="text-xs font-semibold uppercase tracking-wider text-gold-400 hover:text-gold-200"
            >
              + Pridať
            </button>
          </div>
        </div>

        {pendingMatch && (
          <div className="rounded-lg border border-gold-500/40 bg-gold-900/20 px-4 py-2.5 text-xs text-gold-200">
            🎲 Nový zápas z roztočenia – vyber víťaza a klikni <strong>Uložiť</strong>, alebo uprav údaje podľa potreby.
          </div>
        )}

        {total === 0 && !isAdding ? (
          <div className="text-center text-gold-500/50 py-12 text-sm">
            Zatiaľ žiadne zaznamenané zápasy. Zahraj si, zaznamenaj výsledok alebo pridaj zápas ručne.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-gold-700/30 bg-casino-900/40">
            <table className="w-full text-sm min-w-[700px]">
              <thead>
                <tr className="text-gold-500/70 text-[10px] uppercase tracking-wider border-b border-gold-700/30 bg-casino-800/60">
                  <th className="text-left py-3 px-3 whitespace-nowrap">Dátum</th>
                  <th className="text-left py-3 px-3 whitespace-nowrap">Mapa</th>
                  <th className="text-left py-3 px-3 whitespace-nowrap">{player1Name}</th>
                  <th className="text-left py-3 px-3 whitespace-nowrap">{player2Name}</th>
                  <th className="text-center py-3 px-3 whitespace-nowrap">Víťaz</th>
                  <th className="py-3 px-3"></th>
                </tr>
              </thead>
              <tbody>
                {isAdding && draft && renderEditRow(draft, true)}
                {matchHistory.map((match) =>
                  editingId === match.id ? renderEditRow(match, false) : renderViewRow(match)
                )}
              </tbody>
              {matchHistory.length > 0 && (
                <tfoot>
                  <tr className="border-t-2 border-gold-400/50 bg-casino-800/80">
                    <td colSpan={4} className="py-3.5 px-3 font-cinzel font-black text-gold-100 text-sm uppercase tracking-wider">
                      Víťazstvá spolu
                    </td>
                    <td className="py-3.5 px-3 text-center" colSpan={2}>
                      <span className="text-xl font-cinzel font-black text-blue-400">
                        {p1Wins}
                      </span>
                      <span className="text-gold-400/70 mx-2 text-lg font-cinzel font-bold">:</span>
                      <span className="text-xl font-cinzel font-black text-red-400">
                        {p2Wins}
                      </span>
                    </td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
