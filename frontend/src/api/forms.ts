import { api } from "@/lib/api";
import { API_BASE_URL } from "@/lib/config";

export type ProjectForm = {
  id: string;
  _id?: string;
  projectId: string;
  name: string;
  emails: string[];
  allowedOrigins?: string[];
  redirectUrl?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt?: string;
};

export function getFormEndpoint(formId: string) {
  return `${API_BASE_URL}/f/${formId}`;
}

export async function fetchForms(projectId: string) {
  const { data } = await api.get(`/projects/${projectId}/forms`);
  return data.data.forms as ProjectForm[];
}

export async function fetchForm(formId: string) {
  const { data } = await api.get(`/forms/${formId}`);
  return data.data.form as ProjectForm;
}

export async function createForm(
  projectId: string,
  payload: { name: string; emails: string[] },
) {
  const { data } = await api.post(`/projects/${projectId}/forms`, payload);
  return data.data.form as ProjectForm;
}

export async function updateForm(
  formId: string,
  payload: Partial<{
    name: string;
    emails: string[];
    allowedOrigins: string[];
    redirectUrl: string;
    isActive: boolean;
  }>,
) {
  const { data } = await api.patch(`/forms/${formId}`, payload);
  return data.data.form as ProjectForm;
}

export async function deleteForm(formId: string) {
  await api.delete(`/forms/${formId}`);
}

export type Submission = {
  id: string;
  formId: string;
  projectId: string;
  fields: Record<string, string>;
  files: {
    originalName?: string;
    mimeType?: string;
    size?: number;
    url?: string;
  }[];
  meta?: { ip?: string; userAgent?: string; origin?: string };
  status: string;
  spamScore?: number;
  createdAt: string;
  formPublicId?: string;
  formName?: string;
};

export async function fetchProjectSubmissions(projectId: string) {
  const { data } = await api.get(`/projects/${projectId}/submissions`);
  return data.data as {
    items: Submission[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
}

export async function fetchFormSubmissions(formId: string) {
  const { data } = await api.get(`/forms/${formId}/submissions`);
  return data.data as {
    items: Submission[];
    pagination: { page: number; limit: number; total: number; pages: number };
  };
}
