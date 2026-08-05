import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { AlertCircleIcon, CodeIcon } from "@hugeicons/core-free-icons";
import type { Project } from "./data";

type ProjectCardProps = {
  project: Project;
};

export default function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Link
      to={`/dashboard/projects/${project.id}`}
      className="flex flex-col justify-between min-h-38 rounded-lg border border-line bg-secondary p-5 transition-colors hover:border-accent/30"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1 min-w-0">
          <p className="text-xs text-muted">
            {project.apps} app{project.apps === 1 ? "" : "s"}
          </p>
          <h3 className="text-lg font-medium text-main truncate">
            {project.name}
          </h3>
          {project.description && (
            <p className="text-xs text-muted line-clamp-2">
              {project.description}
            </p>
          )}
        </div>

        {project.status === "Paused" && (
          <span className="shrink-0 flex items-center gap-1.5 rounded-full border border-line bg-background px-2.5 py-1 text-xs text-muted">
            <HugeiconsIcon icon={AlertCircleIcon} size={13} />
            Paused
          </span>
        )}
      </div>

      <div className="flex items-center justify-between gap-3 mt-4">
        <span className="flex items-center gap-1.5 rounded-full bg-foreground border border-line px-2.5 py-1 text-xs text-muted">
          <HugeiconsIcon icon={CodeIcon} size={13} />
          {project.platform}
        </span>
      </div>
    </Link>
  );
}
