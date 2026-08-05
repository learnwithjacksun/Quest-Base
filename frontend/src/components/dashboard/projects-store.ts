import { create } from "zustand";
import {
  demoProjects,
  slugifyProjectName,
  type Project,
  type ProjectPlatform,
} from "./data";

type CreateProjectInput = {
  name: string;
  description?: string;
  platform: ProjectPlatform;
};

type ProjectsStore = {
  projects: Project[];
  addProject: (input: CreateProjectInput) => Project;
  getProject: (id: string) => Project | undefined;
};

export const useProjectsStore = create<ProjectsStore>((set, get) => ({
  projects: demoProjects,

  addProject(input) {
    const baseId = slugifyProjectName(input.name) || "project";
    const existingIds = new Set(get().projects.map((p) => p.id));
    let id = baseId;
    let suffix = 2;
    while (existingIds.has(id)) {
      id = `${baseId}-${suffix}`;
      suffix += 1;
    }

    const project: Project = {
      id,
      name: input.name.trim(),
      description: input.description?.trim() || undefined,
      apps: 1,
      platform: input.platform,
      status: "Active",
      createdAt: new Date().toISOString(),
    };

    set((state) => ({ projects: [project, ...state.projects] }));
    return project;
  },

  getProject(id) {
    return get().projects.find((project) => project.id === id);
  },
}));
