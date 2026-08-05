import { EmptyPanel, FeaturePage, useProject } from "./_shared";

export default function ProjectWebhooks() {
  const { project } = useProject();

  return (
    <FeaturePage
      title="Webhooks"
      description={`Push real-time events from ${project.name} to your app when submissions arrive, OTPs verify, or waitlists update.`}
    >
      <EmptyPanel
        title="No webhooks configured"
        description="Add an endpoint URL to receive events like form.submitted, otp.verified, and waitlist.joined."
        action={
          <button type="button" className="btn-primary btn min-h-9 px-4 text-sm">
            Add webhook
          </button>
        }
      />
    </FeaturePage>
  );
}
