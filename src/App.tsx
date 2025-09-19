// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/Login/LoginPage";
import ProtectedRoute from "./routes/RutaProtegida/RutaProtegida";
import AdminLayout from "./pages/Admin/AdminLayout"
import Dashboard from "./pages/Admin/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allow={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="calendario" element={<div />} />
        <Route path="tienda" element={<div />} />
        <Route path="operarios" element={<div />} />
        <Route path="clientes-embarcaciones" element={<div />} />
        <Route path="reportes" element={<div />} />
        <Route path="anuncios" element={<div />} />
      </Route>

      <Route path="/" element={<Navigate to="/admin" replace />} />
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
