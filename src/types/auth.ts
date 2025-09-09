// src/types/auth.ts
export type JwtResponse =
  | { access: string; refresh: string }
  | { accessToken: string; refreshToken: string };

export type DecodedJwt = {
  sub: string;        // correo
  exp: number;        // epoch seconds
  rol?: string;       // claim custom (admin/operario/cliente, etc.)
  authorities?: string[]; // opcional, por si tu JWT trae authorities
};

export type UserInfo = {
  username?: string;  // de sub
  rol?: string;
  exp?: number;
} | null;
