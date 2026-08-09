// Login / Signup screen – shown when user is not authenticated
import { useState } from 'react';
import { useAuth } from '../lib/useAuth';

export function AuthScreen() {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      if (mode === 'login') {
        await login(email, password);
      } else {
        await signup(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Niečo sa pokazilo.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-casino-950 text-white flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background ambiance */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,168,75,0.08)_0%,transparent_70%)] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_100%,rgba(139,0,0,0.06)_0%,transparent_60%)] pointer-events-none" />

      <div className="relative w-full max-w-sm">
        {/* Logo / Title */}
        <div className="text-center mb-8">
          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-gold-400 to-gold-700
            flex items-center justify-center text-2xl shadow-[0_0_25px_rgba(200,168,75,0.5)] mb-4">
            ⚔
          </div>
          <h1 className="font-cinzel font-black text-gold-300 text-xl tracking-wider">
            AoE IV Roulette
          </h1>
          <p className="text-[10px] text-gray-500 tracking-widest uppercase mt-1">
            Prihlásenie
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-gold-600/40 bg-gradient-to-b from-casino-800/80 to-casino-900/80
          shadow-[0_0_60px_rgba(0,0,0,0.8),inset_0_1px_0_rgba(200,168,75,0.3)] overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-gold-700 via-gold-400 to-gold-700" />

          <div className="p-6 space-y-5">
            {/* Mode toggle */}
            <div className="flex gap-2">
              <button
                onClick={() => { setMode('login'); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider transition-colors ${
                  mode === 'login'
                    ? 'bg-gold-500 text-casino-950'
                    : 'bg-casino-700 text-gold-500/60 hover:text-gold-400'
                }`}
              >
                Prihlásiť
              </button>
              <button
                onClick={() => { setMode('signup'); setError(null); }}
                className={`flex-1 py-2 rounded-lg text-xs font-cinzel font-bold uppercase tracking-wider transition-colors ${
                  mode === 'signup'
                    ? 'bg-gold-500 text-casino-950'
                    : 'bg-casino-700 text-gold-500/60 hover:text-gold-400'
                }`}
              >
                Registrovať
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gold-500/70 mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={busy}
                  className="w-full bg-casino-900 border border-gold-600/60 rounded-lg px-3 py-2.5 text-sm text-gold-100
                    focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="ty@example.com"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gold-500/70 mb-1.5">
                  Heslo
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={busy}
                  className="w-full bg-casino-900 border border-gold-600/60 rounded-lg px-3 py-2.5 text-sm text-gold-100
                    focus:border-gold-400 focus:outline-none transition-colors"
                  placeholder="••••••••"
                />
              </div>

              {error && (
                <div className="rounded-lg border border-red-500/40 bg-red-900/20 px-3 py-2 text-xs text-red-300">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={busy}
                className="w-full py-2.5 rounded-lg text-sm font-cinzel font-bold uppercase tracking-wider
                  bg-gold-500 text-casino-950 hover:bg-gold-400
                  shadow-[0_0_15px_rgba(200,168,75,0.4)] transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {busy ? 'Moment…' : mode === 'login' ? 'Prihlásiť sa' : 'Vytvoriť účet'}
              </button>
            </form>

            <p className="text-center text-[10px] text-gold-500/40 leading-relaxed">
              {mode === 'login' ? (
                <>Nemáš účet? <button onClick={() => { setMode('signup'); setError(null); }} className="text-gold-400 hover:text-gold-300 underline">Registruj sa</button></>
              ) : (
                <>Máš už účet? <button onClick={() => { setMode('login'); setError(null); }} className="text-gold-400 hover:text-gold-300 underline">Prihlás sa</button></>
              )}
            </p>
          </div>
        </div>

        <p className="text-center text-[10px] text-gold-500/30 mt-4">
          Obaja hráči sa prihlásujú rovnakým spôsobom. Zápasy sa zdieľajú.
        </p>
      </div>
    </div>
  );
}
