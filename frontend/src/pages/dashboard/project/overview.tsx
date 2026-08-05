import { Link } from "react-router-dom";
import { FeaturePage, StatCard, useProject } from "./_shared";

export default function ProjectOverview() {
  const { project } = useProject();

  return (
    <FeaturePage
      title="Overview"
      description={`Monitor forms, OTP traffic, waitlists, and submissions for ${project.name}.`}
    >
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Forms" value="0" />
        <StatCard label="Submissions" value="0" />
        <StatCard label="OTP sent" value="0" />
        <StatCard label="Waitlist" value="0" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-lg border border-line bg-secondary p-5 space-y-3">
          <h2 className="text-sm font-semibold text-main">Project details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Name</dt>
              <dd className="text-main">{project.name}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Platform</dt>
              <dd className="text-main">{project.platform}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Status</dt>
              <dd className="text-main">{project.status}</dd>
            </div>
            {project.description && (
              <div className="pt-2 border-t border-line">
                <dt className="text-muted mb-1">Description</dt>
                <dd className="text-main">{project.description}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-lg border border-line bg-secondary p-5 space-y-3">
          <h2 className="text-sm font-semibold text-main">Quick start</h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link
                to="forms"
                className="text-accent hover:underline underline-offset-2"
              >
                Create a form2mail endpoint
              </Link>
            </li>
            <li>
              <Link
                to="otp"
                className="text-accent hover:underline underline-offset-2"
              >
                Configure OTP (email & SMS)
              </Link>
            </li>
            <li>
              <Link
                to="waitlist"
                className="text-accent hover:underline underline-offset-2"
              >
                Set up waitlist management
              </Link>
            </li>
            <li>
              <Link
                to="api-keys"
                className="text-accent hover:underline underline-offset-2"
              >
                Generate an API key
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </FeaturePage>
  );
}
