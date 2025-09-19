// src/features/menu/api/menuApi.ts
import { apiGet } from "./http";
import type { BarSemana, DonutPagos, TareaDia } from "../types/menu";

export const fetchBarSemana  = (p?: { offset?: number }) =>
  apiGet<BarSemana>(`/tareas/semana${p?.offset!=null?`?offset=${p.offset}`:""}`);
export const fetchDonutPagos = (p: { mes: string }) =>
  apiGet<DonutPagos>(`/pagos/estado?mes=${p.mes}`);
export const fetchTareasDia  = (p: { fecha: string }) =>
  apiGet<TareaDia[]>(`/tareas?fecha=${p.fecha}`);

