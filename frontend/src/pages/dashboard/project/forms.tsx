import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { MailSend01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";
import { CreateFormModal } from "@/components/dashboard";
import { createForm, fetchForms, getFormEndpoint } from "@/api/forms";
import { getErrorMessage } from "@/lib/api";
import { EmptyPanel, FeaturePage, useProject } from "./_shared";

export default function ProjectForms() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { project } = useProject();
  const [modalOpen, setModalOpen] = useState(false);

  const { data: projectForms = [], isLoading } = useQuery({
    queryKey: ["forms", project.id],
    queryFn: () => fetchForms(project.id),
  });

  const createMutation = useMutation({
    mutationFn: (values: { name: string; emails: string[] }) =>
      createForm(project.id, values),
    onSuccess: (form) => {
      queryClient.invalidateQueries({ queryKey: ["forms", project.id] });
      toast.success(`"${form.name}" created`);
      navigate(`/dashboard/projects/${project.id}/forms/${form.id}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create form"));
    },
  });

  return (
    <FeaturePage
      title="Forms"
      description={`Create and manage form2mail for ${project.name}.`}
      action={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary btn min-h-9 px-4 text-sm gap-1.5"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          Create form
        </button>
      }
    >
      {isLoading ? (
        <p className="text-sm text-muted">Loading forms…</p>
      ) : projectForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projectForms.map((form) => (
            <Link
              key={form.id}
              to={`/dashboard/projects/${project.id}/forms/${form.id}`}
              className="rounded-lg border border-line bg-secondary p-5 space-y-3 transition-colors hover:border-accent/30"
            >
              <div className="flex items-start gap-3">
                <span className="size-9 rounded-sm bg-foreground border border-line center text-accent shrink-0">
                  <HugeiconsIcon icon={MailSend01Icon} size={16} />
                </span>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-sm font-semibold text-main truncate">
                    {form.name}
                  </h2>
                  <p className="text-xs text-muted font-mono truncate">
                    {getFormEndpoint(form.id)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted">
                Sends to {form.emails.join(", ")}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyPanel
          title="No forms yet"
          description="Create a form endpoint to start collecting submissions without building a backend."
          action={
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-primary btn mx-auto min-h-9 px-4 text-sm gap-1.5"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={14} />
              Create form
            </button>
          }
        />
      )}

      <CreateFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(values) => createMutation.mutate(values)}
      />
    </FeaturePage>
  );
}
