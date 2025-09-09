import React, { useState } from "react";
import { useAuth } from "../../context/authContext";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(correo, contrasena);
      navigate("/", { replace: true });         // 👈 redirige al Home
    } catch (e: any) {
      const msg = e?.response?.data?.message || "Credenciales inválidas o servidor no disponible";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen grid place-items-center bg-gray-50">
      <form onSubmit={onSubmit} className="w-full max-w-sm bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-semibold mb-4">Iniciar sesión</h1>

        <label className="block mb-2 text-sm">Correo</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          placeholder="lauta@nautica.com"
          required
        />

        <label className="block mb-2 text-sm">Contraseña</label>
        <input
          className="w-full border rounded-lg px-3 py-2 mb-3"
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="••••••••"
          required
        />

        {err && <p className="text-red-600 text-sm mb-2">{err}</p>}

        <button
          type="submit"
          className="w-full rounded-lg px-3 py-2 bg-black text-white disabled:opacity-60"
          disabled={loading}
        >
          {loading ? "Ingresando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}
