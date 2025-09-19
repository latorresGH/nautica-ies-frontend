/** 
 * Configuración de la API
 * Este archivo centraliza las llamadas HTTP al backend.
 * Se encarga de:
 *  - Definir la URL base de la API
 *  - Construir URLs completas sin errores de "/" o "api/api"
 *  - Adjuntar el token JWT en cada petición (si existe)
 *  - Manejar errores comunes (401, 403, etc.)
 */
const BASE = (import.meta.env.VITE_API_URL as string) || "";
// BASE = URL base de la API, obtenida desde las variables de entorno (ej: http://localhost:8080/api)


/**
 * Construye una URL final a partir de la BASE y el path recibido.
 * - Elimina slashes repetidos al inicio y final.
 * - Evita que quede /api/api cuando BASE ya incluye /api.
 * @param path Ruta relativa (ej: "/clientes", "/api/usuarios")
 * @returns string URL final lista para el fetch
 */
function buildUrl(path: string) {
  const base = BASE.replace(/\/+$/, ""); // quita slashes al final de BASE
  let p = path.replace(/^\/+/, "");      // quita slashes al inicio de path

  // Si BASE ya termina en "/api" y el path empieza con "api/",
  // recortamos "api/" para que no quede duplicado.
  if (base.endsWith("/api") && p.startsWith("api/")) p = p.slice(4);

  return `${base}/${p}`;
}


/**
 * Obtiene el token de autenticación JWT guardado en el navegador.
 * Busca primero en localStorage y luego en sessionStorage.
 * @returns string|null El token JWT o null si no existe
 */
function getToken(): string | null {
  return localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token") || null;
}


/**
 * Realiza una petición HTTP GET al backend.
 * - Construye la URL usando buildUrl()
 * - Agrega el token JWT en el header Authorization (si existe)
 * - Maneja errores 401/403 lanzando "UNAUTHORIZED"
 * - Lanza un Error con detalle si la respuesta no es ok
 * - Retorna el JSON ya parseado como tipo T
 *
 * 🔹 ¿Qué es <T>?
 *    - Es un "genérico" de TypeScript.
 *    - Significa que esta función puede devolver JSON con cualquier forma,
 *      y vos decidís el tipo esperado al usarla.
 * 
 * Ejemplo:
 *   const clientes = await apiGet<Cliente[]>("/clientes");
 *   // clientes va a ser tipado como un array de Cliente
 *
 * @param path Ruta relativa de la API (ej: "/clientes")
 * @param signal Opcional: AbortSignal para cancelar la request
 * @returns Promise<T> Una promesa con el resultado parseado
 */
export async function apiGet<T>(path: string, signal?: AbortSignal): Promise<T> {
  const token = getToken();
  const url = buildUrl(path);

  const res = await fetch(url, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}), // agrega token si existe
    },
    signal,
  });

  // Si no está autorizado → lanzamos error
  if (res.status === 401 || res.status === 403) throw new Error("UNAUTHORIZED");

  // Si la respuesta no es ok (ej: 404, 500...), detallamos el error
  if (!res.ok) {
    let detail = "";
    try { detail = JSON.stringify(await res.json()); }
    catch { detail = await res.text().catch(() => ""); }
    throw new Error(`HTTP ${res.status} ${detail}`);
  }

  // Si todo está bien → devolvemos el JSON ya tipado
  return (await res.json()) as T;
}
