import { useEffect, useState } from "react";
import type { KPIs, BarSemana, DonutPagos, TareaDia } from "../types/menu";
import { fetchBarSemana, fetchDonutPagos, fetchKPIs, fetchTareasDia } from "./menuApi";

// ---------- helpers fecha ----------
function yyyymm(today = new Date()) {
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  return `${yyyy}-${mm}`;
}
function yyyymmdd(today = new Date()) {
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// ---------- adaptadores (por si tu API usa otros nombres) ----------
// ---------- helpers robustos ----------
const D = ["","Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

// Devuelve SIEMPRE un array, buscando en data/items/content/list/results/rows
function toArray(input: any): any[] {
  if (Array.isArray(input)) return input;
  if (input && typeof input === "object") {
    const candidates = ["data","items","content","list","results","rows"];
    for (const k of candidates) {
      if (Array.isArray(input[k])) return input[k];
    }
  }
  return []; // fallback seguro
}

// ---------- adaptadores (actualizados) ----------
function adaptKPIs(api: any): KPIs {
  return {
    clientesActivos: api?.clientesActivos ?? api?.activeClients ?? 0,
    tareasHoy:       api?.tareasHoy       ?? api?.tasksToday    ?? 0,
    ingresosMes:     api?.ingresosMes     ?? api?.monthRevenue  ?? 0,
  };
}

function adaptBarSemana(api: any): BarSemana {
  // 1) si viene array o {data:[...]} / {items:[...]} etc.
  const arr = toArray(api);
  if (arr.length) {
    return arr.map((x: any) => ({
      d: typeof x.day === "number" ? D[x.day] : (x.d ?? x.day ?? ""),
      v: x.count ?? x.v ?? 0,
    }));
  }
  // 2) si viene objeto con claves por día (ej: {Lun:6, Mar:7, ...} o {1:6,2:7,...})
  if (api && typeof api === "object") {
    const entries = Object.entries(api)
      .filter(([k,v]) => typeof v === "number");
    if (entries.length) {
      return entries.map(([k, v]) => {
        const n = Number(k);
        const d = Number.isFinite(n) ? D[n] : k; // "1"->Lun, "Lun"->Lun
        return { d, v: v as number };
      });
    }
  }
  // 3) nada usable
  console.warn("BarSemana: formato no reconocido", api);
  return [];
}

function adaptDonut(api: any): DonutPagos {
  // si ya es array [{name,value}], devuélvelo
  if (Array.isArray(api)) return api as DonutPagos;

  // si viene {data:[...]} / {items:[...]}
  const arr = toArray(api);
  if (arr.length && arr[0] && ("name" in arr[0] || "value" in arr[0])) {
    return arr as DonutPagos;
  }

  // si viene objeto con claves
  return [
    { name: "Pago",      value: api?.paid      ?? api?.pago      ?? api?.Pago      ?? 0 },
    { name: "Pendiente", value: api?.pending   ?? api?.pendiente ?? api?.Pendiente ?? 0 },
    { name: "Adeuda",    value: api?.overdue   ?? api?.adeuda    ?? api?.Adeuda    ?? 0 },
  ];
}

function adaptTareas(api: any): TareaDia[] {
  const arr = toArray(api); // soporta {content:[...]} etc.

  const color = (estado: string) =>
    estado?.toLowerCase().includes("lava") ? "blue" :
    estado?.toLowerCase().includes("mant") ? "yellow" : "green";

  return arr.map((t: any) => ({
    id:          String(t.id ?? t.taskId ?? crypto.randomUUID()),
    nombre:      t.nombre ?? t.firstName ?? "",
    apellido:    t.apellido ?? t.lastName ?? "",
    embarcacion: t.embarcacion ?? t.boat ?? "",
    telefono:    t.telefono ?? t.phone ?? "",
    tarea:       (t.tarea ?? t.task ?? "Botado"),
    operario:    t.operario ?? t.assignedTo ?? "",
    horario:     t.horario ?? (t.start && t.end ? `${t.start} - ${t.end}` : ""),
    estadoColor: color(t.tarea ?? t.status ?? ""),
  }));
}


// ---------- hook ----------
export function useDashboardData() {
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [kpis, setKpis]         = useState<KPIs | null>(null);
  const [barSemana, setBar]     = useState<BarSemana>([]);
  const [donut, setDonut]       = useState<DonutPagos>([]);
  const [tareas, setTareas]     = useState<TareaDia[]>([]);

  useEffect(() => {
  const ac = new AbortController();

  (async () => {
    try {
      setLoading(true);
      setError(null);

      const today = new Date();

      // 👉 no “explota” si alguno falla: cada promesa se resuelve con fulfilled/rejected
      const [k, b, d, t] = await Promise.allSettled([
        fetchKPIs(),                                // opcional: pasá ac.signal (ver nota abajo)
        fetchBarSemana({ offset: 1 }),
        fetchDonutPagos({ mes: yyyymm(today) }),
        fetchTareasDia({ fecha: yyyymmdd(today) }),
      ]);

      if (k.status === "fulfilled") setKpis(adaptKPIs(k.value));     else console.warn("KPIs:", k.reason);
      if (b.status === "fulfilled") setBar(adaptBarSemana(b.value)); else console.warn("Bar:",  b.reason);
      if (d.status === "fulfilled") setDonut(adaptDonut(d.value));   else console.warn("Donut:", d.reason);
      if (t.status === "fulfilled") setTareas(adaptTareas(t.value)); else console.warn("Tareas:", t.reason);

      if ([k,b,d,t].some(x => x.status === "rejected")) {
        setError("Uno o más módulos no se pudieron cargar. Revisá la pestaña Network.");
      }
    } catch (e: any) {
      if (e?.message === "UNAUTHORIZED") {
        window.location.replace("/login");
        return;
      }
      setError(e?.message ?? "Error al cargar el dashboard");
      console.error(e);
    } finally {
      setLoading(false);
    }
  })();

  return () => ac.abort();
}, []);


  return { loading, error, kpis, barSemana, donut, tareas };
}
