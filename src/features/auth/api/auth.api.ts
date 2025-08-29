// src/features/auth/api/auth.api.ts
// src/features/auth/api/auth.api.ts
import { http } from "@/app/http";
import type { LoginDTO, LoginResponse } from "../types/auth.types";

export async function login(dto: LoginDTO): Promise<LoginResponse> {
  const { data } = await http.post<LoginResponse>("/auth/login", dto);
  return data;
}
