import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

export default function LoginForm() {
  const nav = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);
    try {
      await login(email, password);
      nav("/"); // al iniciar sesión, mandamos al Home (protegido)
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ??
        e?.message ??
        "No se pudo iniciar sesión";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} style={{ maxWidth: 380, width: "100%" }}>
     {/* <h1 style={{ marginBottom: 16 }}>Iniciar sesión</h1>*/}

      <label style={{ display: "block", marginTop: 8 }}>Email</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        disabled={loading}
        style={{ width: "100%", padding: 8 }}
      />

      <label style={{ display: "block", marginTop: 12 }}>Contraseña</label>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type={showPwd ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          style={{ flex: 1, padding: 8 }}
        />
        <button
          type="button"
          onClick={() => setShowPwd((s) => !s)}
          disabled={loading}
          style={{ padding: "8px 12px" }}
        >
          {showPwd ? "Ocultar" : "Ver"}
        </button>
      </div>

      {err && (
        <p style={{ color: "crimson", marginTop: 8 }}>
          {err}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        style={{ marginTop: 16, width: "100%", padding: 10 }}
      >
        {loading ? "Ingresando..." : "Ingresar"}
      </button>
    </form>
  );
}
