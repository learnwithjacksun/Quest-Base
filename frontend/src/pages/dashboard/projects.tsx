import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  PlusSignIcon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import {
  CreateProjectModal,
  EmptyState,
  ProjectCard,
  demoUser,
  useProjectsStore,
} from "@/components/dashboard";
import type { CreateProjectValues } from "@/schemas";

const tabs = ["Projects", "Domains", "Members", "Billing", "Settings"];

export default function Projects() {
  const navigate = useNavigate();
  const projects = useProjectsStore((state) => state.projects);
  const addProject = useProjectsStore((state) => state.addProject);

  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filtered = useMemo(
    () =>
      projects.filter((project) =>
        project.name.toLowerCase().includes(query.trim().toLowerCase()),
      ),
    [projects, query],
  );

  function handleCreate(values: CreateProjectValues) {
    const project = addProject({
      name: values.name,
      description: values.description,
      platform: values.platform,
    });
    toast.success(`"${project.name}" created`);
    navigate(`/dashboard/projects/${project.id}`);
  }

  return (
    <>
      <section className="border-b border-line bg-secondary">
        <div className="max-w-272.5 mx-auto w-[92%] pt-10 pb-2">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-2xl lg:text-3xl font-semibold text-main">
              {demoUser.firstName}'s Projects
            </h1>

            <button
              type="button"
              className="btn bg-background border border-line min-h-8 px-3 text-sm text-muted gap-1.5"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={14} />
              Invite
            </button>
          </div>

          <nav className="mt-8 flex items-center gap-1 overflow-x-auto hide-scrollbar">
            {tabs.map((tab, index) => (
              <button
                key={tab}
                type="button"
                className={`px-3.5 py-2 text-sm rounded-t-md text-nowrap transition-colors ${
                  index === 0
                    ? "bg-background text-main border border-line border-b-0"
                    : "text-muted hover:text-main"
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>
      </section>

      <section className="flex-1">
        <div className="max-w-272.5 mx-auto w-[92%] py-8 space-y-6">
          <div className="flex lg:items-center justify-between gap-4 flex-col lg:flex-row">
            <div className="relative w-full">
              <HugeiconsIcon
                icon={Search01Icon}
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted"
              />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, label, or ID"
                className="w-full min-h-9 rounded-sm border border-line bg-secondary pl-9 pr-3 text-sm text-main placeholder:text-muted focus:border-accent/50 transition-colors"
              />
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-primary btn min-h-9 px-4 text-sm text-nowrap gap-1.5"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={14} />
              Create project
            </button>
          </div>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filtered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <EmptyState
              title={query ? "No projects found" : "No projects yet"}
              description={
                query
                  ? `No projects match "${query}". Try a different search.`
                  : undefined
              }
              onAction={() => setModalOpen(true)}
            />
          )}

          <div className="flex lg:items-center justify-between flex-col lg:flex-row gap-4 text-sm text-muted">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="flex items-center gap-1.5 rounded-sm border border-line bg-secondary px-2.5 py-1.5 text-sm text-main"
              >
                6
                <HugeiconsIcon icon={ArrowDown01Icon} size={13} />
              </button>
              <span>Projects per page. Total: {filtered.length}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled
                className="flex items-center gap-1 text-muted disabled:opacity-50"
              >
                <HugeiconsIcon icon={ArrowLeft01Icon} size={14} />
                Prev
              </button>
              <span className="size-7 rounded-sm bg-secondary border border-line center text-main text-xs">
                1
              </span>
              <button
                type="button"
                disabled
                className="flex items-center gap-1 text-muted disabled:opacity-50"
              >
                Next
                <HugeiconsIcon icon={ArrowRight01Icon} size={14} />
              </button>
            </div>
          </div>
        </div>
      </section>

      <CreateProjectModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreate}
      />
    </>
  );
}
