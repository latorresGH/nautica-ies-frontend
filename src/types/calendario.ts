// src/types/calendario.ts
export type CalendarioDia = {
  fecha: string;              // ISO "2025-09-19"
  abierto: boolean;
  horaApertura?: string | null;
  horaCierre?: string | null;
  motivoExcepcion?: string | null;
};
