// Frontend API client for auth + matches
import type { MatchRecord } from '../types';

const TOKEN_KEY = 'aoe4-roulette-token';

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY);
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(path, { ...options, headers });

  if (res.status === 401) {
    clearToken();
    throw new Error('Neautorizovaný prístup. Prihlás sa znova.');
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }
  return data as T;
}

// ── Auth ──────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: { id: string; email: string };
}

export async function signup(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  const data = await request<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  setToken(data.token);
  return data;
}

// ── Matches ───────────────────────────────────────────

export async function fetchMatches(): Promise<MatchRecord[]> {
  const data = await request<{ matches: MatchRecord[] }>('/api/matches');
  return data.matches;
}

export async function createMatch(match: MatchRecord): Promise<MatchRecord> {
  const data = await request<{ match: MatchRecord }>('/api/matches', {
    method: 'POST',
    body: JSON.stringify(match),
  });
  return data.match;
}

export async function updateMatch(match: MatchRecord): Promise<MatchRecord> {
  const data = await request<{ match: MatchRecord }>(`/api/matches/${match.id}`, {
    method: 'PUT',
    body: JSON.stringify(match),
  });
  return data.match;
}

export async function deleteMatch(id: string): Promise<void> {
  await request<{ ok: boolean }>(`/api/matches/${id}`, {
    method: 'DELETE',
  });
}
