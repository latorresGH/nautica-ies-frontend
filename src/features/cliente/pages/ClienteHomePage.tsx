// features/clientes/pages/ClientesHomePage.tsx
import { useEffect, useMemo, useState } from "react";
import { http } from "@/app/http";

type Cliente = {
  id: number;
  numCliente: number;
  nombre: string;
  email: string;
  estadoCliente: "ACTIVO" | "INACTIVO";
  embarcaciones: number; // cantidad
};

export default function ClientesHomePage() {
  const [data, setData] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");         // búsqueda
  const role = localStorage.getItem("role") as "ADMIN" | "CLIENTE" | "OPERARIO" | null;

  useEffect(() => {
    (async () => {
      try {
        // opcional: enviar q al backend ?q=
        const res = await http.get<Cliente[]>("/clientes", { params: { q } });
        // ordenar por nombre (server-side ideal)
        const sorted = [...res.data].sort((a,b) => a.nombre.localeCompare(b.nombre));
        // solo activos si así lo pide el CU:
        setData(sorted.filter(c => c.estadoCliente === "ACTIVO"));
      } finally {
        setLoading(false);
      }
    })();
  }, [q]);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? data.filter(c => c.nombre.toLowerCase().includes(s)) : data;
  }, [data, q]);

  if (loading) return <p>Cargando…</p>;

  return (
    <div style={{ padding: 16 }}>
      <header style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
        <h2 style={{ margin: 0, marginRight: "auto" }}>Gestión de Clientes</h2>

        <input
          placeholder="Buscar por nombre…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          style={{ padding: 8, minWidth: 260 }}
        />

        <button onClick={() => (window.location.href = "/clientes/historial")}>
          Historial de clientes
        </button>
        {role === "ADMIN" && (
          <button onClick={() => (window.location.href = "/clientes/nuevo")}>
            Agregar cliente
          </button>
        )}
        <button onClick={() => (window.location.href = "/")}>Volver</button>
      </header>

      <div style={{ overflowX: "auto", background: "#fff", borderRadius: 8, padding: 8 }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left", borderBottom: "1px solid #eee" }}>
              <th style={{ padding: 8 }}>#</th>
              <th style={{ padding: 8 }}>Nombre</th>
              <th style={{ padding: 8 }}>Email</th>
              <th style={{ padding: 8 }}>Estado</th>
              <th style={{ padding: 8 }}>Embarcaciones</th>
              <th style={{ padding: 8, textAlign: "right" }}>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr key={c.id} style={{ borderBottom: "1px solid #f2f2f2" }}>
                <td style={{ padding: 8 }}>{c.numCliente}</td>
                <td style={{ padding: 8 }}>{c.nombre}</td>
                <td style={{ padding: 8 }}>{c.email}</td>
                <td style={{ padding: 8 }}>{c.estadoCliente}</td>
                <td style={{ padding: 8 }}>{c.embarcaciones}</td>
                <td style={{ padding: 8 }}>
                  <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
                    {/* Información y editar */}
                    <button onClick={() => (window.location.href = `/clientes/${c.id}`)}>
                      Info
                    </button>
                    {role === "ADMIN" && (
                      <button onClick={() => (window.location.href = `/clientes/${c.id}/editar`)}>
                        Editar
                      </button>
                    )}

                    {/* Pagos (solo admin) */}
                    {role === "ADMIN" && (
                      <>
                        <button onClick={() => (window.location.href = `/clientes/${c.id}/pagos/nuevo`)}>
                          Registrar pago
                        </button>
                        <button onClick={() => (window.location.href = `/clientes/${c.id}/pagos`)}>
                          Historial de pago
                        </button>
                      </>
                    )}

                    {/* Baja (solo admin) */}
                    {role === "ADMIN" && (
                      <button
                        onClick={async () => {
                          if (!confirm(`Dar de baja a ${c.nombre}?`)) return;
                          await http.patch(`/clientes/${c.id}/baja`);
                          // refrescar
                          const res = await http.get<Cliente[]>("/clientes", { params: { q } });
                          setData(res.data);
                        }}
                      >
                        Dar de baja
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={6} style={{ padding: 16, textAlign: "center" }}>Sin resultados</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
