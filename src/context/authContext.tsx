// src/context/authContext.tsx
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { decodeJwt, getTokens, login as doLogin, logout as doLogout } from "../services/authService";
import type { UserInfo, DecodedJwt } from "../types/auth"; // 👈 usa tus tipos

type AuthContextType = {
  user: UserInfo;
  isAuth: boolean;
  login: (correo: string, contrasena: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserInfo>(null);

  useEffect(() => {
    const { access } = getTokens();
    if (access) {
      const payload = decodeJwt(access); // DecodedJwt | null
      if (payload) {
        setUser({
          username: payload.sub,
          rol: payload.rol ?? payload.authorities?.[0],
          exp: payload.exp,
        });
      }
    }
  }, []);

  const login = async (correo: string, contrasena: string) => {
    const { access } = await doLogin(correo, contrasena);
    const payload: DecodedJwt | null = decodeJwt(access);
    setUser(
      payload
        ? {
            username: payload.sub,
            rol: payload.rol ?? payload.authorities?.[0],
            exp: payload.exp,
          }
        : null
    );
  };

  const logout = () => {
    doLogout();
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, isAuth: !!user, login, logout }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
};
