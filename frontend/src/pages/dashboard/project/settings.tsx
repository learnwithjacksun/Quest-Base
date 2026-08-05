import { FeaturePage, useProject } from "./_shared";

export default function ProjectSettings() {
  const { project } = useProject();

  return (
    <FeaturePage
      title="Settings"
      description={`Manage general settings for ${project.name}.`}
    >
      <div className="rounded-lg border border-line bg-secondary divide-y divide-line max-w-xl">
        <div className="p-5 space-y-1">
          <p className="text-xs text-muted">Project ID</p>
          <p className="text-sm font-mono text-main">{project.id}</p>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-xs text-muted">Name</p>
          <p className="text-sm text-main">{project.name}</p>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-xs text-muted">Platform</p>
          <p className="text-sm text-main">{project.platform}</p>
        </div>
        <div className="p-5 space-y-1">
          <p className="text-xs text-muted">Status</p>
          <p className="text-sm text-main">{project.status}</p>
        </div>
      </div>
    </FeaturePage>
  );
}
