// src/types/usuario.ts

// Ajustá a cómo te llega del backend: 'ADMIN' | 'OPERARIO' | 'CLIENTE'
// (si es minúscula: 'admin' | 'operario' | 'cliente')
export type RolUsuario = | 'ADMIN' | 'OPERARIO' | 'CLIENTE'
  | 'admin' | 'operario' | 'cliente';

export interface Usuario {
  idUsuario: number;
  nombre: string;
  apellido: string;
  contrasena?: string;    // nunca viene del backend (WRITE_ONLY), pero útil para formularios
  direccion?: string | null;
  localidad?: string | null;
  provincia?: string | null;
  dni: string;
  correo: string;
  telefono?: string | null;
  rol: RolUsuario;
  activo: boolean;
}

// Para crear/actualizar (DTOs del frontend)
export interface UsuarioCreate {
  nombre: string;
  apellido: string;
  contrasena: string;
  direccion?: string | null;
  localidad?: string | null;
  provincia?: string | null;
  dni: string;
  correo: string;
  telefono?: string | null;
  rol: RolUsuario;
  activo?: boolean;
}

export interface UsuarioUpdate extends Partial<UsuarioCreate> {}
