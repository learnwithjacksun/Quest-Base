import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

export type OtpConfig = {
  id: string;
  _id?: string;
  projectId: string;
  name: string;
  allowedOrigins?: string[];
  emailEnabled: boolean;
  smsEnabled: boolean;
  codeLength: number;
  expirySeconds: number;
  maxAttempts: number;
  emailSubject: string;
  emailTemplate: string;
  smsSender: string;
  smsTemplate: string;
  isActive?: boolean;
  sent24h?: number;
  createdAt: string;
  updatedAt?: string;
};

export type OtpProjectStats = {
  total: number;
  emailEnabled: boolean;
  smsEnabled: boolean;
  sent24h: number;
};

export function getOtpSendEndpoint(otpId: string) {
  return `${API_BASE_URL}/o/${otpId}/send`;
}

export function getOtpVerifyEndpoint(otpId: string) {
  return `${API_BASE_URL}/o/${otpId}/verify`;
}

export async function fetchOtps(projectId: string) {
  const { data } = await api.get(`/projects/${projectId}/otps`);
  return data.data as { otps: OtpConfig[]; stats: OtpProjectStats };
}

export async function fetchOtp(otpId: string) {
  const { data } = await api.get(`/otps/${otpId}`);
  return data.data.otp as OtpConfig;
}

export async function createOtp(
  projectId: string,
  payload: { name: string; emailEnabled?: boolean; smsEnabled?: boolean },
) {
  const { data } = await api.post(`/projects/${projectId}/otps`, payload);
  return data.data.otp as OtpConfig;
}

export async function updateOtp(
  otpId: string,
  payload: Partial<{
    name: string;
    allowedOrigins: string[];
    emailEnabled: boolean;
    smsEnabled: boolean;
    codeLength: number;
    expirySeconds: number;
    maxAttempts: number;
    emailSubject: string;
    emailTemplate: string;
    smsSender: string;
    smsTemplate: string;
    isActive: boolean;
  }>,
) {
  const { data } = await api.patch(`/otps/${otpId}`, payload);
  return data.data.otp as OtpConfig;
}

export async function deleteOtp(otpId: string) {
  await api.delete(`/otps/${otpId}`);
}
