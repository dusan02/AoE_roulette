// Auth context provider – wraps the app, exposes login state + actions
import { useState, useCallback, useEffect, type ReactNode } from 'react';
import { getToken, clearToken, login as apiLogin, signup as apiSignup } from './api';
import { AuthContext, type AuthContextValue } from './auth-context';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthContextValue['user']>(null);
  const [loading, setLoading] = useState(true);

  // On mount: check if a token already exists in localStorage
  useEffect(() => {
    const token = getToken();
    if (token) {
      // We don't have a /me endpoint; just decode the JWT client-side to get email
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser({ email: payload.email });
      } catch {
        clearToken();
      }
    }
    setLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await apiLogin(email, password);
    setUser({ email: res.user.email });
  }, []);

  const signup = useCallback(async (email: string, password: string) => {
    const res = await apiSignup(email, password);
    setUser({ email: res.user.email });
  }, []);

  const logout = useCallback(() => {
    clearToken();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
