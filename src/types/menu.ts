export type KPIs = {
  clientesActivos: number;
  tareasHoy: number;
  ingresosMes: number;
};

export type BarSemana = { d: string; v: number }[]; // ej. [{d:"Lun", v:6}, ...]

export type DonutPagos = {
  name: "Pago" | "Pendiente" | "Adeuda";
  value: number;
}[];

export type TareaDia = {
  id: string;
  nombre: string;
  apellido: string;
  embarcacion: string;
  telefono: string;
  tarea: "Botado" | "Lavado" | "Guardado" | "Mantenimiento";
  operario: string;
  horario: string;
  estadoColor?: "green" | "blue" | "yellow";
};
