// useAuth hook – separated from the provider for react-refresh compatibility
import { useContext } from 'react';
import { AuthContext, type AuthContextValue } from './auth-context';

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
