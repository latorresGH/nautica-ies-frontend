// src/hooks/useSemanaCalendario.ts
import { useEffect, useMemo, useRef, useState } from "react";
import { getWeekRange } from "../utils/fechas";
import { getCalendario } from "../api/calendario";
import type { CalendarioDia } from "../types/calendario";

export function useSemanaCalendario(when?: Date) {
  const defaultRef = useRef<Date>(when ?? new Date());
  const baseDate = when ?? defaultRef.current;

  const whenKey = useMemo(() => baseDate.toISOString().slice(0, 10), [when ?? defaultRef.current]);

  const [{ loading, error, dias, openMask, labels }, setState] = useState({
    loading: true,
    error: null as string | null,
    dias: [] as CalendarioDia[],
    openMask: [true, true, true, true, true, true, true],
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
  });

  useEffect(() => {
    const { from, to } = getWeekRange(baseDate);

    (async () => {
      try {
        setState((s) => ({ ...s, loading: true, error: null }));
        const data = await getCalendario(from, to);
        const sorted = [...data].sort((a, b) => a.fecha.localeCompare(b.fecha));
        const mask = sorted.map((d) => !!d.abierto);

        const fmt = new Intl.DateTimeFormat("es-AR", { weekday: "short" });
        const lbls = sorted.map((d) => {
          const dt = new Date(d.fecha + "T00:00:00");
          const w = fmt.format(dt).replace(".", "");
          const cap = w.charAt(0).toUpperCase() + w.slice(1);
          return cap.replace(/^Mie$/i, "Mié").replace(/^Sab$/i, "Sáb");
        });

        setState({
          loading: false,
          error: null,
          dias: sorted,
          openMask: mask,
          labels: lbls,
        });
      } catch (e: any) {
        setState((s) => ({ ...s, loading: false, error: e?.message ?? "Error al cargar calendario" }));
      }
    })();
  }, [whenKey]);

  return { loading, error, dias, openMask, labels };
}
