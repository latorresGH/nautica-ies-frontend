// src/services/userService.ts
import apiClient from "../config/apiClient";
import type { Usuario } from "../types/usuario";

export async function getMe() {
  const { data } = await apiClient.get<Usuario>("/auth/me");
  return data;
}
