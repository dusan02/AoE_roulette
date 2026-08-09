// ============================================================
// AoE IV Roulette – App Root
// Auth gate: shows AuthScreen when not logged in, MainPage when logged in
// ============================================================

import { useEffect } from 'react';
import { MainPage } from './pages/MainPage';
import { AuthProvider } from './lib/auth';
import { useAuth } from './lib/useAuth';
import { AuthScreen } from './components/AuthScreen';
import { useRouletteStore } from './store/useRouletteStore';

function AppInner() {
  const { isAuthenticated, loading, logout, user } = useAuth();
  const loadMatches = useRouletteStore((s) => s.loadMatches);

  // Load matches from API when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadMatches();
    }
  }, [isAuthenticated, loadMatches]);

  if (loading) {
    return (
      <div className="min-h-screen bg-casino-950 flex items-center justify-center">
        <div className="text-gold-500/60 text-sm font-cinzel tracking-wider animate-pulse">
          Načítava sa…
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthScreen />;
  }

  return (
    <>
      <MainPage />
      {/* Logout button – fixed in bottom-right corner */}
      <div className="fixed bottom-3 right-3 z-50 flex items-center gap-2">
        {user && (
          <span className="text-[10px] text-gold-500/40 hidden sm:inline">{user.email}</span>
        )}
        <button
          onClick={logout}
          className="px-3 py-1.5 rounded-lg text-[10px] font-semibold uppercase tracking-wider
            bg-casino-800/80 text-gold-500/60 hover:text-gold-300 hover:bg-casino-700
            border border-gold-700/30 transition-colors"
        >
          Odhlásiť
        </button>
      </div>
    </>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
