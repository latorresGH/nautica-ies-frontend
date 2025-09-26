// src/hooks/useDashboardData.ts
import { useEffect, useState } from "react";
import type { KPIs, BarSemana, DonutPagos, TareaDia } from "../types/menu";
import type { DashboardDTO } from "../types/menu";
import {
  fetchBarSemana,
  fetchTareasDia,
  fetchKpis,
  // si aún querés usar el endpoint viejo del donut, importalo también:
  // fetchDonutPagos,
} from "../api/menuApi";

// usar backend real
const CALL_REAL_APIS = true;

// fecha local segura YYYY-MM-DD (evita corrimiento por UTC)
function yyyymmddLocal(date = new Date()) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function useDashboardData() {
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState<string | null>(null);

  const [kpis,      setKpis]  = useState<KPIs | null>(null);
  const [barSemana, setBar]   = useState<BarSemana>([]);
  const [donut,     setDonut] = useState<DonutPagos>([]);
  const [tareas,    setTareas]= useState<TareaDia[]>([]);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        if (!CALL_REAL_APIS) {
          // mocks de respaldo si querés desactivar llamadas
          setBar([
            { d: "Lun", v: 0 }, { d: "Mar", v: 0 }, { d: "Mié", v: 0 },
            { d: "Jue", v: 0 }, { d: "Vie", v: 0 }, { d: "Sáb", v: 0 }, { d: "Dom", v: 0 },
          ]);
          setDonut([]);
          setTareas([]);
          setKpis({ clientesActivos: 0, tareasHoy: 0, ingresosMes: 0 });
          setLoading(false);
          return;
        }

        const hoyISO = yyyymmddLocal();

        const [dto, bar, tareasHoy] = await Promise.all([
          fetchKpis({ fecha: hoyISO }) as Promise<DashboardDTO>,
          fetchBarSemana().catch(() => [] as BarSemana),
          fetchTareasDia({ fecha: hoyISO }).catch(() => [] as TareaDia[]),
          // si quisieras seguir usando el endpoint viejo del donut:
          // fetchDonutPagos({ mes: hoyISO.slice(0,7) }).catch(() => [] as DonutPagos),
        ]);

        if (cancelled) return;

        // KPIs (tu card se llama "Clientes activos", pero el dato es usuariosActivos)
        setKpis({
          clientesActivos: dto.usuariosActivos ?? 0,
          tareasHoy: dto.tareasHoy ?? 0,
          ingresosMes: Number(dto.ingresosMes ?? 0),
        });

        // Donut: Pagaron vs Deben (mes actual)
        setDonut([
          { name: "Pago", value: dto.clientesPagaronMes ?? 0 },
          { name: "Adeuda",   value: dto.clientesDebenMes ?? 0 },
        ]);


        setBar(Array.isArray(bar) ? bar : []);
        setTareas(Array.isArray(tareasHoy) ? tareasHoy : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error cargando dashboard");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, []);

  return { loading, error, kpis, barSemana, donut, tareas };
}
