import { EmptyPanel, FeaturePage, useProject } from "./_shared";

export default function ProjectApiKeys() {
  const { project } = useProject();

  return (
    <FeaturePage
      title="API Keys"
      description={`Authenticate requests to the Quest Base API for ${project.name}.`}
    >
      <EmptyPanel
        title="No API keys"
        description="Generate a secret key to call forms, OTP, and waitlist endpoints from your backend."
        action={
          <button type="button" className="btn-primary btn min-h-9 px-4 text-sm mx-auto">
            Generate key
          </button>
        }
      />
    </FeaturePage>
  );
}
