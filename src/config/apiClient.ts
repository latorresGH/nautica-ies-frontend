import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: false, // CORS simple; tu backend ya maneja CORS
});

// Helpers de storage
const getAccess = () => localStorage.getItem("access_token");
const getRefresh = () => localStorage.getItem("refresh_token");
const setAccess = (t: string) => localStorage.setItem("access_token", t);
const clearTokens = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
};

// Request: agrega Authorization si hay token
// Request: agrega/quita Authorization según haya token
apiClient.interceptors.request.use((config) => {
  const token = getAccess();

  // aseguro que headers exista
  config.headers = config.headers ?? {};

  if (token) {
    (config.headers as any).Authorization = `Bearer ${token}`;
  } else {
    // si no hay token, me aseguro de quitar el header
    delete (config.headers as any).Authorization;
  }

  return config;
});

// Response: si 401 intenta refresh UNA vez
let isRefreshing = false;
let pendingQueue: Array<(token: string) => void> = [];

apiClient.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;

    // si no es 401 o ya reintentamos, rechazar
    if (error?.response?.status !== 401 || original?._retry) {
      return Promise.reject(error);
    }

    // marcar para no entrar en loops
    original._retry = true;

    // si ya hay un refresh en curso, encola este request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push((newToken: string) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(original));
        });
      });
    }

    // hacer refresh
    try {
      isRefreshing = true;
      const refresh = getRefresh();
      if (!refresh) throw new Error("No refresh token");

      const resp = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/refresh`,
        { refreshToken: refresh }
      );

      const newAccess =
        resp.data?.accessToken || resp.data?.access || resp.data?.access_token;
      if (!newAccess) throw new Error("Refresh sin access token");

      setAccess(newAccess);

      // liberar cola
      pendingQueue.forEach((cb) => cb(newAccess));
      pendingQueue = [];
      return apiClient({
        ...original,
        headers: { ...original.headers, Authorization: `Bearer ${newAccess}` },
      });
    } catch (e) {
      clearTokens();
      pendingQueue = [];
      return Promise.reject(e);
    } finally {
      isRefreshing = false;
    }
  }
);

export default apiClient;
