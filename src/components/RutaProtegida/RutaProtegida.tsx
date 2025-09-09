import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";

type Props = {
  children: React.ReactNode;
  role?: string;
};

export default function RutaProtegida({ children, role }: Props) {
  const { isAuth, user } = useAuth();

  if (!isAuth) return <Navigate to="/login" replace />;

  if (role && user?.rol && user.rol.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
