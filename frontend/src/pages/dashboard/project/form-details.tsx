import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import {
  fetchForm,
  fetchFormSubmissions,
  getFormEndpoint,
  updateForm,
} from "@/api/forms";
import { fetchProject } from "@/api/projects";
import { getErrorMessage } from "@/lib/api";

const tabs = [
  "Integration",
  "Submissions",
  "Settings",
  "Plugins",
  "Rules",
] as const;

type Tab = (typeof tabs)[number];

export default function FormDetails() {
  const { projectId, formId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("Integration");
  const [copied, setCopied] = useState(false);
  const [emailsText, setEmailsText] = useState("");
  const [originsText, setOriginsText] = useState("");

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: Boolean(projectId),
  });

  const {
    data: form,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["form", formId],
    queryFn: () => fetchForm(formId!),
    enabled: Boolean(formId),
  });

  const { data: submissionsData, isLoading: submissionsLoading } = useQuery({
    queryKey: ["form-submissions", formId],
    queryFn: () => fetchFormSubmissions(formId!),
    enabled: Boolean(formId) && activeTab === "Submissions",
  });

  useEffect(() => {
    if (form) {
      setEmailsText(form.emails.join(", "));
      setOriginsText((form.allowedOrigins || []).join(", "));
    }
  }, [form]);

  useEffect(() => {
    if (isError) {
      navigate(
        projectId
          ? `/dashboard/projects/${projectId}/forms`
          : "/dashboard",
        { replace: true },
      );
    }
  }, [isError, projectId, navigate]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const emails = emailsText
        .split(",")
        .map((e) => e.trim())
        .filter(Boolean);
      const allowedOrigins = originsText
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
      return updateForm(formId!, { emails, allowedOrigins });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["form", formId] });
      queryClient.invalidateQueries({ queryKey: ["forms", projectId] });
      toast.success("Form settings saved");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not save settings"));
    },
  });

  if (isLoading || !form || !project) {
    return (
      <div className="p-6 lg:p-8 text-sm text-muted">Loading form…</div>
    );
  }

  if (form.projectId !== project.id) {
    return null;
  }

  const endpoint = getFormEndpoint(form.id);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(endpoint);
      setCopied(true);
      toast.success("Endpoint copied");
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Could not copy endpoint");
    }
  }

  const submissions = submissionsData?.items ?? [];

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="space-y-4">
        <Link
          to={`/dashboard/projects/${project.id}/forms`}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-main transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
          Forms
        </Link>

        <h1 className="text-xl lg:text-2xl font-semibold text-main">
          {form.name}
        </h1>

        <nav className="flex items-center gap-1 overflow-x-auto hide-scrollbar border-b border-line">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-3.5 py-2.5 text-sm text-nowrap transition-colors border-b-2 -mb-px ${
                activeTab === tab
                  ? "border-accent text-main"
                  : "border-transparent text-muted hover:text-main"
              }`}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "Integration" && (
        <div className="rounded-lg border border-line bg-secondary p-5 lg:p-6 space-y-3 max-w-3xl">
          <p className="text-[11px] font-medium tracking-wider uppercase text-muted">
            Form endpoint
          </p>

          <div className="flex items-stretch gap-2">
            <input
              readOnly
              value={endpoint}
              className="flex-1 min-h-10 rounded-sm border border-line bg-background px-3 text-sm font-mono text-main"
            />
            <button
              type="button"
              onClick={handleCopy}
              className="btn bg-background border border-line min-h-10 px-4 text-sm text-main gap-1.5 shrink-0"
            >
              <HugeiconsIcon
                icon={copied ? Tick02Icon : Copy01Icon}
                size={15}
              />
              {copied ? "Copied" : "Copy"}
            </button>
          </div>

          <p className="text-sm text-muted leading-relaxed">
            Place this URL in the form&apos;s{" "}
            <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
              action
            </code>{" "}
            attribute, set the method to{" "}
            <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
              POST
            </code>
            , and add a{" "}
            <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
              name
            </code>{" "}
            attribute to each input. For file uploads use{" "}
            <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
              enctype=&quot;multipart/form-data&quot;
            </code>{" "}
            and input{" "}
            <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
              name=&quot;files&quot;
            </code>
            . Include a hidden honeypot field named{" "}
            <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
              _gotcha
            </code>{" "}
            to help block bots.
          </p>
        </div>
      )}

      {activeTab === "Submissions" && (
        submissionsLoading ? (
          <p className="text-sm text-muted">Loading submissions…</p>
        ) : submissions.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-secondary/40 px-6 py-12 text-center space-y-1">
            <h2 className="text-sm font-medium text-main">No submissions yet</h2>
            <p className="text-sm text-muted">
              Submissions to this form will appear here.
            </p>
          </div>
        ) : (
          <div className="rounded-lg border border-line bg-secondary divide-y divide-line max-w-3xl">
            {submissions.map((submission) => (
              <div key={submission.id} className="p-4 space-y-2">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-xs font-mono text-muted">{submission.id}</p>
                  <span className="text-xs uppercase tracking-wide text-muted">
                    {submission.status}
                  </span>
                </div>
                <p className="text-sm text-main">
                  {Object.entries(submission.fields)
                    .slice(0, 3)
                    .map(([k, v]) => `${k}: ${v}`)
                    .join(" · ") || "No fields"}
                </p>
                <p className="text-xs text-muted">
                  {new Date(submission.createdAt).toLocaleString()}
                  {submission.files?.length
                    ? ` · ${submission.files.length} file(s)`
                    : ""}
                </p>
              </div>
            ))}
          </div>
        )
      )}

      {activeTab === "Settings" && (
        <div className="rounded-lg border border-line bg-secondary divide-y divide-line max-w-xl">
          <div className="p-5 space-y-1">
            <p className="text-xs text-muted">Form ID</p>
            <p className="text-sm font-mono text-main">{form.id}</p>
          </div>
          <div className="p-5 space-y-1">
            <p className="text-xs text-muted">Form name</p>
            <p className="text-sm text-main">{form.name}</p>
          </div>
          <div className="p-5 space-y-2">
            <label className="text-xs text-muted" htmlFor="form-emails">
              Send emails to (comma-separated)
            </label>
            <input
              id="form-emails"
              value={emailsText}
              onChange={(e) => setEmailsText(e.target.value)}
              className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
            />
          </div>
          <div className="p-5 space-y-2">
            <label className="text-xs text-muted" htmlFor="form-origins">
              Allowed origins (comma-separated). Leave empty to allow all
              browser origins.
            </label>
            <input
              id="form-origins"
              value={originsText}
              onChange={(e) => setOriginsText(e.target.value)}
              placeholder="https://example.com, http://localhost:5173"
              className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
            />
          </div>
          <div className="p-5">
            <button
              type="button"
              disabled={saveMutation.isPending}
              onClick={() => saveMutation.mutate()}
              className="btn-primary btn min-h-9 px-4 text-sm"
            >
              {saveMutation.isPending ? "Saving…" : "Save settings"}
            </button>
          </div>
        </div>
      )}

      {activeTab === "Plugins" && (
        <div className="rounded-lg border border-dashed border-line bg-secondary/40 px-6 py-12 text-center space-y-1">
          <h2 className="text-sm font-medium text-main">No plugins enabled</h2>
          <p className="text-sm text-muted">
            Spam detection and other plugins will be configurable here.
          </p>
        </div>
      )}

      {activeTab === "Rules" && (
        <div className="rounded-lg border border-dashed border-line bg-secondary/40 px-6 py-12 text-center space-y-1">
          <h2 className="text-sm font-medium text-main">No rules yet</h2>
          <p className="text-sm text-muted">
            Add validation or routing rules for submissions.
          </p>
        </div>
      )}
    </div>
  );
}
