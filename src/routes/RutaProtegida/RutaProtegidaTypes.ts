export type Role = "admin" | "operario" | "cliente";

export type Props =
  | {
      // Modo con children
      children: React.ReactNode;
      allow?: Role[];               // roles permitidos (opcional)
      redirectIfNoAuth?: string;    // default: "/login"
      redirectIfForbidden?: string; // default: "/"
    }
  | {
      // Modo con Outlet (sin children)
      children?: undefined;
      allow?: Role[];
      redirectIfNoAuth?: string;
      redirectIfForbidden?: string;
    };