// src/hooks/useBarSemana.ts
import { useEffect, useState } from "react";
import { fetchBarSemana } from "../api/menuApi";
import type { BarSemana } from "../types/menu";

export function useBarSemana(offset = 1) {
  const [data, setData] = useState<BarSemana>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetchBarSemana({ offset });
        if (!cancelled) setData(Array.isArray(res) ? res : []);
      } catch (e: any) {
        if (!cancelled) setError(e?.message ?? "Error al cargar barra de semana");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [offset]);

  return { data, loading, error };
}
