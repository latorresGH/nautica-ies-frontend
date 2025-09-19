// features/menu/api/authToken.ts
export function readToken(): string | null {
  return (
    localStorage.getItem("auth_token") ||
    sessionStorage.getItem("auth_token") ||
    null
  );
}

export function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split(".")[1];
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    // decodeURIComponent+escape maneja utf-8 en atob
    return JSON.parse(decodeURIComponent(escape(json)));
  } catch {
    return null;
  }
}

// Intenta varios claims comunes (ajustaremos si tu backend usa otros)
export function getUserDisplayName(): string | null {
  const t = readToken();
  if (!t) return null;
  const p = decodeJwtPayload(t);
  const name =
    p?.name ||
    p?.nombre ||
    p?.fullName ||
    p?.given_name ||
    p?.username ||
    p?.sub ||
    p?.email;
  return name ?? null;
}
