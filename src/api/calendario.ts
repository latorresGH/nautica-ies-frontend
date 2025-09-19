// src/api/calendario.ts
import { apiGet } from "./http";
import type { CalendarioDia } from "../types/calendario";

export async function getCalendario(from: string, to: string) {
  return apiGet<CalendarioDia[]>(`/calendario?from=${from}&to=${to}`);
}
