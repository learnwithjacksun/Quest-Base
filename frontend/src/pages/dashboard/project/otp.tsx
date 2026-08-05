import { EmptyPanel, FeaturePage, StatCard, useProject } from "./_shared";

export default function ProjectOtp() {
  const { project } = useProject();

  return (
    <FeaturePage
      title="OTP"
      description={`Configure and send email & SMS one-time passwords for ${project.name}.`}
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Email OTP" value="Off" />
        <StatCard label="SMS OTP" value="Off" />
        <StatCard label="Codes sent (24h)" value="0" />
      </div>

      <EmptyPanel
        title="OTP not configured"
        description="Enable email or SMS OTP, set expiry, and customize verification templates."
        action={
          <button type="button" className="btn-primary btn min-h-9 px-4 text-sm">
            Configure OTP
          </button>
        }
      />
    </FeaturePage>
  );
}
