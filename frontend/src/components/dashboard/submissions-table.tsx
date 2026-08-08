import type { Submission } from "@/api/forms";

function humanizeKey(key: string) {
  return key
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatBytes(size?: number) {
  if (!size || size <= 0) return "";
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

function statusClass(status: string) {
  const value = status.toLowerCase();
  if (value === "delivered") return "text-accent border-accent/30 bg-accent/10";
  if (value === "spam" || value === "failed") {
    return "text-red-400 border-red-500/30 bg-red-500/10";
  }
  return "text-muted border-line bg-background";
}

type SubmissionsTableProps = {
  submissions: Submission[];
  showFormColumn?: boolean;
};

export default function SubmissionsTable({
  submissions,
  showFormColumn = false,
}: SubmissionsTableProps) {
  return (
    <div className="rounded-lg border border-line overflow-hidden bg-secondary">
      <div className="overflow-x-auto">
        <table className="w-full min-w-180 text-left text-sm">
          <thead className="bg-background/80 border-b border-line">
            <tr className="text-xs uppercase tracking-wide text-muted">
              <th className="px-4 py-3 font-medium">Received</th>
              {showFormColumn && (
                <th className="px-4 py-3 font-medium">Form</th>
              )}
              <th className="px-4 py-3 font-medium">Fields</th>
              <th className="px-4 py-3 font-medium">Files</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {submissions.map((submission) => {
              const entries = Object.entries(submission.fields || {});
              const files = submission.files || [];

              return (
                <tr key={submission.id} className="align-top hover:bg-background/40">
                  <td className="px-4 py-4 whitespace-nowrap">
                    <p className="text-main">
                      {new Date(submission.createdAt).toLocaleString()}
                    </p>
                    <p className="text-[11px] font-mono text-muted mt-1">
                      {submission.id.slice(0, 10)}…
                    </p>
                  </td>

                  {showFormColumn && (
                    <td className="px-4 py-4">
                      <p className="text-main font-medium">
                        {submission.formName ||
                          submission.formPublicId ||
                          "Form"}
                      </p>
                    </td>
                  )}

                  <td className="px-4 py-4 min-w-64">
                    {entries.length === 0 ? (
                      <p className="text-muted">No fields</p>
                    ) : (
                      <dl className="space-y-2">
                        {entries.map(([key, value]) => (
                          <div key={key}>
                            <dt className="text-[11px] uppercase tracking-wide text-muted">
                              {humanizeKey(key)}
                            </dt>
                            <dd className="text-main whitespace-pre-wrap wrap-break-word">
                              {String(value ?? "")}
                            </dd>
                          </div>
                        ))}
                      </dl>
                    )}
                  </td>

                  <td className="px-4 py-4 min-w-44">
                    {files.length === 0 ? (
                      <p className="text-muted">—</p>
                    ) : (
                      <ul className="space-y-2">
                        {files.map((file, index) => {
                          const isImage = file.mimeType?.startsWith("image/");
                          return (
                            <li key={`${submission.id}-file-${index}`}>
                              <a
                                href={file.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block rounded-sm border border-line bg-background p-2 hover:border-accent/40 transition-colors"
                              >
                                {isImage && file.url ? (
                                  <img
                                    src={file.url}
                                    alt={file.originalName || "Attachment"}
                                    className="mb-2 h-16 w-full object-cover rounded-sm"
                                  />
                                ) : null}
                                <p className="text-xs text-main truncate">
                                  {file.originalName || "Attachment"}
                                </p>
                                <p className="text-[11px] text-muted">
                                  {[file.mimeType, formatBytes(file.size)]
                                    .filter(Boolean)
                                    .join(" · ")}
                                </p>
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </td>

                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex rounded-full border px-2.5 py-1 text-[11px] uppercase tracking-wide ${statusClass(submission.status)}`}
                    >
                      {submission.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
