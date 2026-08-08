import { useQuery } from "@tanstack/react-query";
import { fetchProjectSubmissions } from "@/api/forms";
import SubmissionsTable from "@/components/dashboard/submissions-table";
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
        <SubmissionsTable submissions={submissions} showFormColumn />
      )}
    </FeaturePage>
  );
}
