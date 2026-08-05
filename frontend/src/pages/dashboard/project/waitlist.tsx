import { EmptyPanel, FeaturePage, StatCard, useProject } from "./_shared";

export default function ProjectWaitlist() {
  const { project } = useProject();

  return (
    <FeaturePage
      title="Waitlist"
      description={`Collect early-access signups and manage the queue for ${project.name}.`}
      action={
        <button type="button" className="btn-primary btn min-h-9 px-4 text-sm">
          Create waitlist
        </button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Signups" value="0" />
        <StatCard label="Invited" value="0" />
        <StatCard label="Pending" value="0" />
      </div>

      <EmptyPanel
        title="Waitlist is empty"
        description="Share a waitlist endpoint or embed to start collecting early-access signups."
        action={
          <button type="button" className="btn-primary btn min-h-9 px-4 text-sm mx-auto">
            Create waitlist
          </button>
        } 
      />
    </FeaturePage>
  );
}
