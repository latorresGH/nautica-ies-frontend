import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import type { Props, Role } from "./RutaProtegidaTypes";


export default function ProtectedRoute({
  children,
  allow,
  redirectIfNoAuth = "/login",
  redirectIfForbidden = "/",
}: Props) {
  const { isAuth, user } = useAuth();

  // 1) no autenticado -> al login
  if (!isAuth) return <Navigate to={redirectIfNoAuth} replace />;

  // 2) autenticado pero sin rol suficiente -> por ahora al home (o cambia a /403 cuando la tengas)
  if (allow && allow.length > 0) {
    const ok = !!user?.rol && allow.includes(user.rol as Role);
    if (!ok) return <Navigate to={redirectIfForbidden} replace />;
  }

  // 3) pasa -> renderiza children o Outlet
  return children ? <>{children}</> : <Outlet />;
}
