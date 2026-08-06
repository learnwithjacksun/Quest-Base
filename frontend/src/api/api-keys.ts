import { api } from "@/lib/api";

export type ApiKey = {
  id: string;
  projectId: string;
  name: string;
  keyPrefix: string;
  lastUsedAt?: string | null;
  revokedAt?: string | null;
  createdAt: string;
  key?: string;
};

export async function fetchApiKeys(projectId: string) {
  const { data } = await api.get(`/projects/${projectId}/api-keys`);
  return data.data.apiKeys as ApiKey[];
}

export async function createApiKey(projectId: string, name?: string) {
  const { data } = await api.post(`/projects/${projectId}/api-keys`, {
    name: name || "Default key",
  });
  return data.data.apiKey as ApiKey;
}

export async function revokeApiKey(projectId: string, keyId: string) {
  const { data } = await api.delete(`/projects/${projectId}/api-keys/${keyId}`);
  return data.data.apiKey as ApiKey;
}
