// src/context/authContext.tsx
import React, { createContext, useContext, useMemo, useState, useEffect } from "react";
import { login as doLogin, logout as doLogout, getTokens, decodeJwt } from "../services/authService";
import type { UserInfo } from "../types/auth";

type AuthContextType = {
  user: UserInfo | null;
  isAuth: boolean;
  ready: boolean;                      // 👈 nuevo
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
};

// 👇 función para construir user desde el token **antes del 1er render**
function buildInitialUser(): UserInfo | null {
  const { access } = getTokens();
  if (!access) return null;
  const p = decodeJwt(access);
  if (!p) return null;
  return {
    username: p.sub ?? p.email ?? "desconocido",
    rol: (p.rol ?? p.authorities?.[0] ?? "cliente") as string,
    exp: p.exp,
  };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser]   = useState<UserInfo | null>(buildInitialUser()); // ✅ inicial síncrono
  const [ready, setReady] = useState<boolean>(true);                       // ✅ ya estamos listos

  // (opcional) si quisieras revalidar algo async, podés usar useEffect y setReady(true) al final

  const login = async (correo: string, contrasena: string) => {
    const { access } = await doLogin(correo, contrasena); // guarda en storage
    const p = decodeJwt(access);
    setUser(
      p ? {
        username: p.sub ?? p.email ?? "desconocido",
        rol: (p.rol ?? p.authorities?.[0] ?? "cliente") as string,
        exp: p.exp,
      } : null
    );
  };

  const logout = () => {
    doLogout();
    setUser(null);
  };

  const value = useMemo(() => ({
    user,
    isAuth: !!user,
    ready,           // 👈 exponemos ready
    login,
    logout
  }), [user, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
