// src/types/dashboard.ts
export type DashboardDTO = {
  fecha: string;              
  usuariosActivos: number;
  tareasHoy: number;
  tareasPendientes: number;
  turnosHoy: number;
  cuotasVencidas: number;
  ingresosMes: number;          
  clientesDebenMes: number;
  clientesPagaronMes: number;
};
