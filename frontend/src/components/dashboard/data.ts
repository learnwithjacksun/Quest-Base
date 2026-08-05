export const demoUser = {
  firstName: "John",
  lastName: "Doe",
  email: "john@example.com",
};

export function getInitials(firstName: string, lastName: string) {
  return `${firstName[0] ?? ""}${lastName[0] ?? ""}`.toUpperCase();
}

export type ProjectPlatform = "Web" | "Mobile";
export type ProjectStatus = "Active" | "Paused";

export type Project = {
  id: string;
  name: string;
  description?: string;
  apps: number;
  platform: ProjectPlatform;
  status: ProjectStatus;
  createdAt: string;
};

export const demoProjects: Project[] = [
  {
    id: "nesatrust",
    name: "Nesatrust",
    description: "Trust and verification flows for Nesa.",
    apps: 1,
    platform: "Web",
    status: "Paused",
    createdAt: "2026-03-12T10:00:00.000Z",
  },
  {
    id: "premium-trades",
    name: "Premium Trades Affiliates",
    description: "Affiliate waitlist and OTP verification.",
    apps: 1,
    platform: "Web",
    status: "Active",
    createdAt: "2026-05-02T10:00:00.000Z",
  },
];

export function slugifyProjectName(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 40);
}
