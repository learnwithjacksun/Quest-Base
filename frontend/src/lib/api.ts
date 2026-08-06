import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { API_V1 } from "./config";
import { useAuthStore } from "@/stores/auth-store";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const api = axios.create({
  baseURL: API_V1,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<string | null> | null = null;

async function refreshAccessToken(): Promise<string | null> {
  try {
    const { data } = await axios.post(
      `${API_V1}/auth/refresh`,
      {},
      { withCredentials: true },
    );
    const accessToken = data?.data?.accessToken as string | undefined;
    const user = data?.data?.user;
    if (accessToken) {
      useAuthStore.getState().setSession(accessToken, user);
      return accessToken;
    }
    return null;
  } catch {
    useAuthStore.getState().clearSession();
    return null;
  }
}

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;

    if (
      status === 401 &&
      original &&
      !original._retry &&
      !original.url?.includes("/auth/login") &&
      !original.url?.includes("/auth/register") &&
      !original.url?.includes("/auth/refresh")
    ) {
      original._retry = true;
      refreshPromise ??= refreshAccessToken().finally(() => {
        refreshPromise = null;
      });
      const token = await refreshPromise;
      if (token) {
        original.headers.Authorization = `Bearer ${token}`;
        return api(original);
      }
    }

    return Promise.reject(error);
  },
);

export function getErrorMessage(error: unknown, fallback = "Something went wrong") {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; errors?: { message?: string }[] }
      | undefined;
    if (data?.errors?.[0]?.message) return data.errors[0].message;
    if (data?.message) return data.message;
  }
  if (error instanceof Error) return error.message;
  return fallback;
}
