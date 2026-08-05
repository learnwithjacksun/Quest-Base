import { EmptyPanel, FeaturePage, useProject } from "./_shared";

export default function ProjectForms() {
  const { project } = useProject();

  return (
    <FeaturePage
      title="Forms"
      description={`Manage form2mail endpoints for ${project.name}. Point any HTML form at an endpoint and deliver submissions to email.`}
    >
      <EmptyPanel
        title="No forms yet"
        description="Create a form endpoint to start collecting submissions without building a backend."
        action={
          <button type="button" className="btn-primary btn min-h-9 px-4 text-sm">
            Create form
          </button>
        }
      />
    </FeaturePage>
  );
}
