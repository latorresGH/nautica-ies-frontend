// App.tsx
import { Routes, Route } from "react-router-dom";
import RutaProtegida from "./components/RutaProtegida/RutaProtegida";
import LoginPage from "./pages/Login/LoginPage";
import HomePage from "./pages/Home/HomePage";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RutaProtegida>
            <HomePage />
          </RutaProtegida>
        }
      />
    </Routes>
  );
}
