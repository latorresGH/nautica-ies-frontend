// src/routes/RutaProtegida/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";

export type Role = "admin" | "operario" | "cliente";
export type Props = {
  children?: React.ReactNode;
  allow?: Role[];                 // ej: ["admin"]
  redirectIfNoAuth?: string;      // default /login
  redirectIfForbidden?: string;   // default /
};

export default function ProtectedRoute({
  children,
  allow,
  redirectIfNoAuth = "/login",
  redirectIfForbidden = "/",
}: Props) {
  const { isAuth, ready, user } = useAuth();

  // ⏳ mientras no esté listo el contexto, no decidas (evita redirecciones por error)
  if (!ready) return null; // o un loader

  // 1) no autenticado -> login
  if (!isAuth) return <Navigate to={redirectIfNoAuth} replace />;

  // 2) rol
  if (allow && allow.length > 0) {
    const role = String(user?.rol ?? "").toLowerCase() as Role;
    const ok = allow.map(r => r.toLowerCase()).includes(role);
    if (!ok) return <Navigate to={redirectIfForbidden} replace />;
  }

  // 3) pasa
  return children ? <>{children}</> : <Outlet />;
}
