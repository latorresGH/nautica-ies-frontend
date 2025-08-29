import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { setAuthToken } from "@/app/http";
import { login as apiLogin } from "../api/auth.api";
import type { User } from "../types/auth.types";

type AuthCtx = {
  user: User | null;
  token: string | null;
  ready: boolean;                         // true cuando leyó storage y seteo inicial
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser]   = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  // Cargar sesión previa desde localStorage
  useEffect(() => {
    const t = localStorage.getItem("auth:token");
    const u = localStorage.getItem("auth:user");
    if (t) { setToken(t); setAuthToken(t); }
    if (u) { try { setUser(JSON.parse(u)); } catch { /* ignore */ } }
    setReady(true);
  }, []);

  // Iniciar sesión
  async function login(email: string, password: string) {
    const { token, user } = await apiLogin({ email, password });
    setToken(token);
    setUser(user);
    setAuthToken(token);
    localStorage.setItem("auth:token", token);
    localStorage.setItem("auth:user", JSON.stringify(user));
  }

  // Cerrar sesión
  function logout() {
    setToken(null);
    setUser(null);
    setAuthToken(undefined);
    localStorage.removeItem("auth:token");
    localStorage.removeItem("auth:user");
  }

  const value = useMemo(() => ({ user, token, ready, login, logout }), [user, token, ready]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
