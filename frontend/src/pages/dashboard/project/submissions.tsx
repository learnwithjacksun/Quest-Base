import { EmptyPanel, FeaturePage, useProject } from "./_shared";

export default function ProjectSubmissions() {
  const { project } = useProject();

  return (
    <FeaturePage
      title="Submissions"
      description={`Review form submissions for ${project.name}, including spam-filtered entries.`}
    >
      <EmptyPanel
        title="No submissions yet"
        description="Once forms start receiving data, submissions will show up here with spam detection status."
      />
    </FeaturePage>
  );
}
