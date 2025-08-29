// src/features/auth/types/auth.types.ts
export interface User {
  id: number;
  nombre: string;
  email: string;
  role: "ADMIN" | "OPERARIO" | "CLIENTE";
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}
