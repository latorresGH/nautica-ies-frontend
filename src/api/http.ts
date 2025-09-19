// src/api/http.ts
import { getTokens, refreshAccessToken } from "../services/authService";

/** URL base (ej: http://localhost:8080/api) */
const BASE = (import.meta.env.VITE_API_URL as string) || "";

/** Une BASE + path evitando // y evitando /api/api */
function buildUrl(path: string) {
  const base = BASE.replace(/\/+$/, "");
  let p = path.replace(/^\/+/, "");
  if (base.endsWith("/api") && p.startsWith("api/")) p = p.slice(4);
  return `${base}/${p}`;
}

/** Lee el access token guardado por authService */
function getAccess(): string | null {
  const { access } = getTokens();
  return access ?? null;
}

/** GET con retry automático en 401/403 usando refresh token */
export async function apiGet<T>(path: string, signal?: AbortSignal, _tried = false): Promise<T> {
  const url = buildUrl(path);
  let token = getAccess();

  let res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  // Reintento 1 vez con refresh si expira
  if ((res.status === 401 || res.status === 403) && !_tried) {
    try {
      const newAccess = await refreshAccessToken(); // lee refresh_token del storage
      token = newAccess;
      res = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        signal,
      });
    } catch {
      // Si falla el refresh, seguimos con el flujo de error
    }
  }

  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");

  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); }
    catch { detail = await res.text().catch(() => ""); }
    throw new Error(`HTTP ${res.status} ${detail}`);
  }

  return (await res.json()) as T;
}

/** (Opcional) Post con el mismo patrón de retry */
export async function apiPost<T>(path: string, body: any, signal?: AbortSignal, _tried = false): Promise<T> {
  const url = buildUrl(path);
  let token = getAccess();

  let res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(body),
    signal,
  });

  if ((res.status === 401 || res.status === 403) && !_tried) {
    try {
      const newAccess = await refreshAccessToken();
      token = newAccess;
      res = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(body),
        signal,
      });
    } catch {}
  }

  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");

  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); }
    catch { detail = await res.text().catch(() => ""); }
    throw new Error(`HTTP ${res.status} ${detail}`);
  }

  return (await res.json()) as T;
}
