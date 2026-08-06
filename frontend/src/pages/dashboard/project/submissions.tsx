import { useQuery } from "@tanstack/react-query";
import { fetchProjectSubmissions } from "@/api/forms";
import { EmptyPanel, FeaturePage, useProject } from "./_shared";

export default function ProjectSubmissions() {
  const { project } = useProject();

  const { data, isLoading } = useQuery({
    queryKey: ["project-submissions", project.id],
    queryFn: () => fetchProjectSubmissions(project.id),
  });

  const submissions = data?.items ?? [];

  return (
    <FeaturePage
      title="Submissions"
      description={`Review form submissions for ${project.name}, including spam-filtered entries.`}
    >
      {isLoading ? (
        <p className="text-sm text-muted">Loading submissions…</p>
      ) : submissions.length === 0 ? (
        <EmptyPanel
          title="No submissions yet"
          description="Once forms start receiving data, submissions will show up here with spam detection status."
        />
      ) : (
        <div className="rounded-lg border border-line bg-secondary divide-y divide-line max-w-3xl">
          {submissions.map((submission) => (
            <div key={submission.id} className="p-4 space-y-2">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-main">
                  {submission.formName || submission.formPublicId || "Form"}
                </p>
                <span className="text-xs uppercase tracking-wide text-muted">
                  {submission.status}
                </span>
              </div>
              <p className="text-sm text-muted">
                {Object.entries(submission.fields)
                  .slice(0, 4)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(" · ") || "No fields"}
              </p>
              <p className="text-xs text-muted">
                {new Date(submission.createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </FeaturePage>
  );
}
