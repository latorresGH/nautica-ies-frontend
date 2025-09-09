// src/pages/HomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/authContext";
import { getMe } from "../../services/usuarioService";
import type { Usuario } from "../../types/usuario";

export default function HomePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Usuario | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login", { replace: true });
      return;
    }
    getMe().then(setProfile).catch(() => setProfile(null));
  }, [user, navigate]);

  const niceName = useMemo(() => {
    if (profile?.apellido) return profile.apellido;
    const email = user?.username || "";
    const local = email.split("@")[0] || "usuario";
    return local.charAt(0).toUpperCase() + local.slice(1);
  }, [profile?.apellido, user?.username]);

  const roleToShow = (profile?.rol ?? user?.rol) || "-";

  const [timeLeft, setTimeLeft] = useState<string | null>(null);
  useEffect(() => {
    if (!user?.exp) { setTimeLeft(null); return; }
    const tick = () => {
      const ms = user.exp * 1000 - Date.now();
      if (ms <= 0) { logout(); navigate("/login", { replace: true }); return; }
      const totalSec = Math.floor(ms / 1000);
      setTimeLeft(`${Math.floor(totalSec/60)}m ${totalSec%60}s`);
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [user?.exp, logout, navigate]);

  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Nautica-IES</h1>
          <div className="flex items-center gap-3">
            {roleToShow && (
              <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 border">
                Rol: {roleToShow}
              </span>
            )}
            <button onClick={handleLogout} className="px-3 py-2 rounded-lg bg-black text-white hover:opacity-90">
              Cerrar sesión
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <h2 className="text-2xl font-semibold mb-2">¡Bienvenido, {niceName}! 👋</h2>
        <p className="text-gray-600 mb-6">Estás autenticado con JWT.</p>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="bg-white border rounded-2xl p-4">
            <div className="text-xs text-gray-500 mb-1">Correo</div>
            <div className="font-medium">{profile?.correo ?? user?.username ?? "-"}</div>
          </div>

          <div className="bg-white border rounded-2xl p-4">
            <div className="text-xs text-gray-500 mb-1">Rol</div>
            <div className="font-medium capitalize">{roleToShow}</div>
          </div>

          <div className="bg-white border rounded-2xl p-4">
            <div className="text-xs text-gray-500 mb-1">Token</div>
            <div className="font-medium">
              {timeLeft ? `Expira en ${timeLeft}` : "Sin información de expiración"}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
