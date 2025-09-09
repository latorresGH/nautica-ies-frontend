// src/services/authService.ts
import apiClient from "../config/apiClient";

type JwtResponse =
  | { access: string; refresh: string }
  | { accessToken: string; refreshToken: string };

const ACCESS = "access_token";
const REFRESH = "refresh_token";

/**
 * Login usando correo + contrasena (como espera tu backend).
 * POST /auth/login  body: { correo, contrasena }
 */
export async function login(correo: string, contrasena: string) {
  const { data } = await apiClient.post<JwtResponse>("/auth/login", {
    correo,
    contrasena,
  });

  // normaliza nombres de props (por si el backend usa "accessToken"/"refreshToken")
  const access =
    (data as any).access ?? (data as any).accessToken;
  const refresh =
    (data as any).refresh ?? (data as any).refreshToken;

  if (!access || !refresh) {
    throw new Error("La respuesta de login no trae tokens válidos");
  }

  localStorage.setItem(ACCESS, access);
  localStorage.setItem(REFRESH, refresh);

  return { access, refresh };
}

/**
 * Refresh del access token usando el refresh token guardado
 * POST /auth/refresh  body: { refreshToken }
 */
export async function refreshAccessToken() {
  const refresh = localStorage.getItem(REFRESH);
  if (!refresh) throw new Error("No hay refresh token");

  const { data } = await apiClient.post<JwtResponse>("/auth/refresh", {
    refreshToken: refresh,
  });

  const newAccess =
    (data as any).access ?? (data as any).accessToken;
  if (!newAccess) throw new Error("Refresh sin access token");

  localStorage.setItem(ACCESS, newAccess);
  return newAccess;
}

export function logout() {
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
}

export function getTokens() {
  return {
    access: localStorage.getItem(ACCESS),
    refresh: localStorage.getItem(REFRESH),
  };
}

/** (Opcional) Decodifica el payload del JWT para UI (sin validar firma) */
export function decodeJwt(token?: string) {
  if (!token) return null;
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return null;
  }
}
