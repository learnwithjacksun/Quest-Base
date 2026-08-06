import { api } from "@/lib/api";
import type { AuthUser } from "@/stores/auth-store";

export type AuthResponse = {
  accessToken: string;
  user: AuthUser;
};

export async function registerUser(payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  const { data } = await api.post("/auth/register", payload);
  return data.data as { user: AuthUser; email: string };
}

export async function verifyEmail(payload: { email: string; code: string }) {
  const { data } = await api.post("/auth/verify-email", payload);
  return data.data as { user: AuthUser };
}

export async function resendVerification(email: string) {
  const { data } = await api.post("/auth/resend-verification", { email });
  return data.data;
}

export async function loginUser(payload: { email: string; password: string }) {
  const { data } = await api.post("/auth/login", payload);
  return data.data as AuthResponse;
}

export async function logoutUser() {
  await api.post("/auth/logout");
}

export async function refreshSession() {
  const { data } = await api.post("/auth/refresh");
  return data.data as AuthResponse;
}

export async function forgotPassword(email: string) {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data.data;
}

export async function resetPassword(payload: {
  token: string;
  password: string;
}) {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
}

export async function fetchCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data.data.user as AuthUser;
}
