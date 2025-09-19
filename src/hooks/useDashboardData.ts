// src/hooks/useDashboardData.ts
import { useEffect, useState } from "react";
import type { KPIs, BarSemana, DonutPagos, TareaDia } from "../types/menu";
import { fetchBarSemana, fetchDonutPagos, fetchTareasDia } from "../api/menuApi";

// ⬇️ Mientras no tengas esos endpoints en el backend, dejalo en false
const CALL_REAL_APIS = false;

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
          // 🔹 Mock estable (UI no crashea aunque no haya backend)
          const mockBar: BarSemana = [
            { d: "Lun", v: 0 },
            { d: "Mar", v: 0 },
            { d: "Mié", v: 0 },
            { d: "Jue", v: 0 },
            { d: "Vie", v: 0 },
            { d: "Sáb", v: 0 },
            { d: "Dom", v: 0 },
          ];
          const mockDonut: DonutPagos = [];
          const mockTareas: TareaDia[] = [];

          if (!cancelled) {
            setBar(mockBar);
            setDonut(mockDonut);
            setTareas(mockTareas);
            setKpis({
              clientesActivos: 0,
              tareasHoy: mockTareas.length,
              ingresosMes: 0,
            });
            setLoading(false);
          }
          return;
        }

        // 🔹 Cuando tengas backend real, activás CALL_REAL_APIS=true
        const hoyISO = new Date().toISOString().slice(0, 10);
        const mes = hoyISO.slice(0, 7);

        const [bar, donutData, tareasHoy] = await Promise.all([
          fetchBarSemana().catch(() => [] as BarSemana),
          fetchDonutPagos({ mes }).catch(() => [] as DonutPagos),
          fetchTareasDia({ fecha: hoyISO }).catch(() => [] as TareaDia[]),
        ]);

        if (cancelled) return;

        setBar(Array.isArray(bar) ? bar : []);
        setDonut(Array.isArray(donutData) ? donutData : []);
        setTareas(Array.isArray(tareasHoy) ? tareasHoy : []);

        setKpis({
          clientesActivos: 0,           // TODO: esperar endpoint real
          tareasHoy: tareasHoy.length,  // derivado
          ingresosMes: 0,               // TODO: esperar endpoint real
        });
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
