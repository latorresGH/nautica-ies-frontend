// src/features/menu/api/http.ts
// src/features/menu/api/http.ts
const BASE = (import.meta.env.VITE_API_URL as string) || "";

/** Une BASE + path evitando // y evitando /api/api */
function buildUrl(path: string) {
  const base = BASE.replace(/\/+$/, ""); // sin slash final
  let p = path.replace(/^\/+/, "");      // sin slash inicial

  // Si BASE termina con /api y el path empieza con api/, quitamos un "api/"
  if (base.endsWith("/api") && p.startsWith("api/")) p = p.slice(4);

  return `${base}/${p}`;
}

function getToken(): string | null {
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token") || null;
}

export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const token = getToken();
  const url = buildUrl(path);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    signal,
  });

  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");

  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); }
    catch { detail = await res.text().catch(() => ""); }
    throw new Error(`HTTP ${res.status} ${detail}`);
  }

  return (await res.json()) as T;
}
