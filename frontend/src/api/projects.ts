import { api } from "@/lib/api";
import type { Project, ProjectPlatform, ProjectStatus } from "@/components/dashboard/data";

export type { Project, ProjectPlatform, ProjectStatus };

export async function fetchProjects() {
  const { data } = await api.get("/projects");
  return data.data.projects as Project[];
}

export async function fetchProject(projectId: string) {
  const { data } = await api.get(`/projects/${projectId}`);
  return data.data.project as Project;
}

export async function createProject(payload: {
  name: string;
  description?: string;
  platform: ProjectPlatform;
}) {
  const { data } = await api.post("/projects", payload);
  return data.data.project as Project;
}

export async function updateProject(
  projectId: string,
  payload: Partial<{
    name: string;
    description: string;
    platform: ProjectPlatform;
    status: ProjectStatus;
  }>,
) {
  const { data } = await api.patch(`/projects/${projectId}`, payload);
  return data.data.project as Project;
}

export async function deleteProject(projectId: string) {
  await api.delete(`/projects/${projectId}`);
}
