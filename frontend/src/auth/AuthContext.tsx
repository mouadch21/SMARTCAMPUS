import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as api from "../api/client";
import { decodeJwt, isExpired } from "./jwt";

const KEY = "smartcampus.token";

interface AuthState {
  token: string | null;
  email: string | null;
  expiresAt: number | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthState | null>(null);

function readToken(): string | null {
  const t = sessionStorage.getItem(KEY);
  if (t && !isExpired(t)) return t;
  sessionStorage.removeItem(KEY);
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(readToken);

  const logout = useCallback(() => {
    sessionStorage.removeItem(KEY);
    setToken(null);
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const res = await api.login(email, password);
    sessionStorage.setItem(KEY, res.token);
    setToken(res.token);
  }, []);

  // Déconnexion automatique à l'expiration du jeton.
  useEffect(() => {
    if (!token) return;
    const exp = decodeJwt(token)?.exp;
    if (!exp) return;
    const delay = exp * 1000 - Date.now();
    if (delay <= 0) { logout(); return; }
    const id = window.setTimeout(logout, Math.min(delay, 2 ** 31 - 1));
    return () => window.clearTimeout(id);
  }, [token, logout]);

  const value = useMemo<AuthState>(() => {
    const p = token ? decodeJwt(token) : null;
    return { token, email: p?.sub ?? null, expiresAt: p?.exp ? p.exp * 1000 : null, login, logout };
  }, [token, login, logout]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthState {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth doit être utilisé dans AuthProvider");
  return v;
}
