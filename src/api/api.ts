// src/api.ts

// Base URL de tu backend
export const API_BASE_URL = "http://localhost:8080/api";

// ==== AUTH ====
export const AUTH_API = {
  LOGIN: `${API_BASE_URL}/auth/login`,
  REFRESH: `${API_BASE_URL}/auth/refresh`,
};

// ==== USUARIOS ====
export const USUARIOS_API = {
  LISTAR: `${API_BASE_URL}/usuarios`, // ?page=0&size=10&sort=apellido,asc
  OBTENER: (id: number | string) => `${API_BASE_URL}/usuarios/${id}`,
  POR_CORREO: (correo: string) => `${API_BASE_URL}/usuarios/by-correo?correo=${correo}`,
  CREAR: `${API_BASE_URL}/usuarios`,
  ACTUALIZAR: (id: number | string) => `${API_BASE_URL}/usuarios/${id}`,
  ELIMINAR: (id: number | string) => `${API_BASE_URL}/usuarios/${id}`,
};

// ==== ADMINISTRADORES ====
export const ADMINISTRADORES_API = {
  LISTAR: `${API_BASE_URL}/administradores`,
  OBTENER: (id: number | string) => `${API_BASE_URL}/administradores/${id}`,
  POR_CODIGO: (codigo: string) => `${API_BASE_URL}/administradores/codigo/${codigo}`,
  ACTUALIZAR: (id: number | string) => `${API_BASE_URL}/administradores/${id}`,
  ELIMINAR: (id: number | string) => `${API_BASE_URL}/administradores/${id}`,
  // CREAR: `${API_BASE_URL}/administradores`  // (comentado en backend)
};

// ==== CLIENTES ====
export const CLIENTES_API = {
  LISTAR: `${API_BASE_URL}/clientes`,
  OBTENER: (id: number | string) => `${API_BASE_URL}/clientes/${id}`,
  POR_NUMERO: (num: number) => `${API_BASE_URL}/clientes/by-num?valor=${num}`,
  ACTUALIZAR: (id: number | string) => `${API_BASE_URL}/clientes/${id}`,
  ELIMINAR: (id: number | string) => `${API_BASE_URL}/clientes/${id}`,
  // CREAR: `${API_BASE_URL}/clientes` // (comentado en backend)
};

// ==== OPERARIOS ====
export const OPERARIOS_API = {
  LISTAR: `${API_BASE_URL}/operarios`,
  OBTENER: (id: number | string) => `${API_BASE_URL}/operarios/${id}`,
  POR_LEGAJO: (legajo: string) => `${API_BASE_URL}/operarios/by-legajo?valor=${legajo}`,
  ACTUALIZAR: (id: number | string) => `${API_BASE_URL}/operarios/${id}`,
  ELIMINAR: (id: number | string) => `${API_BASE_URL}/operarios/${id}`,
  // CREAR: `${API_BASE_URL}/operarios` // (comentado en backend)
};
