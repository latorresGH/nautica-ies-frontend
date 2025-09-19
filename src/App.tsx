// App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida/RutaProtegida";
import LoginPage from "./pages/Login/LoginPage";
import HomePage from "./pages/Home/HomePage";

//imports del menu principal.
import MainLayout from "./features/menu/components/MainLayout";
import Dashboard from "./features/menu/pages/Dashboard";

export default function App() {
  return (
    <Routes>
      {/* Pública */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protegida: montamos el layout del menú y sus páginas */}
      <Route
        path="/"
        element={
          <RutaProtegida>
            <MainLayout />
          </RutaProtegida>
        }
      >
        {/* index = "/" → nuestro Dashboard del panel */}
        <Route index element={<Dashboard />} />

        {/* Rutas del menú (placeholders por ahora) */}
        <Route path="calendario" element={<div />} />
        <Route path="tienda" element={<div />} />
        <Route path="operarios" element={<div />} />
        <Route path="clientes-embarcaciones" element={<div />} />
        <Route path="reportes" element={<div />} />
        <Route path="anuncios" element={<div />} />
      </Route>

      {/* (Opcional) si querés conservar tu HomePage aparte: */}
      {/* <Route path="/home" element={
        <RutaProtegida><HomePage /></RutaProtegida>
      } /> */}

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
