import { useEffect } from "react";
import { Link, Outlet, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon } from "@hugeicons/core-free-icons";
import { ProjectSidebar } from "@/components/dashboard";
import { fetchProject } from "@/api/projects";

export default function ProjectLayout() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const {
    data: project,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: Boolean(projectId),
  });

  useEffect(() => {
    if (isError) {
      navigate("/dashboard", { replace: true });
    }
  }, [isError, navigate]);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-muted">
        Loading project…
      </div>
    );
  }

  if (!project) return null;

  return (
    <div className="flex-1 flex min-h-0">
      <aside className="hidden lg:flex w-56 shrink-0 flex-col border-r border-line bg-secondary/40">
        <div className="px-4 py-2 border-b border-line space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-1 text-xs text-muted hover:text-main transition-colors"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} size={18} />
            Back to Projects
          </Link>
        </div>
        <ProjectSidebar />
      </aside>

      <div className="flex-1 min-w-0 overflow-y-auto">
        <Outlet context={{ project }} />
      </div>
    </div>
  );
}
