export function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export type ProjectPlatform = "Web" | "Mobile";
export type ProjectStatus = "Active" | "Paused";

export type Project = {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  apps: number;
  platform: ProjectPlatform;
  status: ProjectStatus;
  createdAt: string;
  updatedAt?: string;
};

export function slugifyProjectName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}
