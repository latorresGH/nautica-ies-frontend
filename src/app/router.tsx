// src/app/router.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import type { ReactNode } from "react";           // 👈 importa el tipo desde react
import LoginPage from "@/features/auth/pages/LoginPage";
import { useAuth } from "@/features/auth/hooks/useAuth";

function Protected({ children }: { children: ReactNode }) {   // 👈 ReactNode en vez de JSX.Element
  const { token, ready } = useAuth();
  if (!ready) return <div style={{ padding: 24 }}>Cargando…</div>;
  if (!token) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function Home() {
  return <div style={{ padding: 24 }}>Home privado</div>;
}

export const router = createBrowserRouter([
  { path: "/login", element: <LoginPage /> },
  { path: "/", element: <Protected><Home /></Protected> },
]);
