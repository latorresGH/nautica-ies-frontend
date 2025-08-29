// src/features/auth/pages/LoginPage.tsx
import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",                // asegura ocupar todo el ancho
        display: "grid",
        placeItems: "center",         // centra en ambos ejes
        padding: 16,
        background: "#f6f7f9",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 460,
          background: "#fff",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.08)",
          padding: 24,
        }}
      >
        <h1 style={{ marginTop: 0 }}>Iniciar sesión</h1>
        <LoginForm />
      </div>
    </div>
  );
}
