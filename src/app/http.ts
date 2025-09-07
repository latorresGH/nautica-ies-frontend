// src/app/http.ts
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:8080/api",
});

export function setAuthToken(token?: string) {
  if (token) {
    http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
}
// 👇 mantenerse logueado para ver renders
const saved = localStorage.getItem("accessToken");
if (saved) setAuthToken(saved);
