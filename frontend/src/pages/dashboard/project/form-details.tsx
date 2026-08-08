import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { CodeBlock } from "@/components/common";
import SubmissionsTable from "@/components/dashboard/submissions-table";
import {
  getAxiosSample,
  getFetchSample,
  getHtmlSample,
  getInstallSample,
  getReactSample,
  getUnifiedSdkSample,
} from "./form-integration-samples";
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
  const [redirectUrl, setRedirectUrl] = useState("");

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
      setRedirectUrl(form.redirectUrl || "");
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
      return updateForm(formId!, {
        emails,
        allowedOrigins,
        redirectUrl: redirectUrl.trim(),
      });
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
  const sampleCtx = { endpoint, formId: form.id };

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
        <div className="space-y-8 max-w-3xl">
          <div className="rounded-lg border border-line bg-secondary p-5 lg:p-6 space-y-3">
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
              Use this URL with HTML forms,{" "}
              <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                fetch
              </code>
              , Axios, or the Quest Base SDK. Set method to{" "}
              <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                POST
              </code>
              .
            </p>
          </div>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-main">HTML form</h2>
              <p className="text-sm text-muted">
                Point your form{" "}
                <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                  action
                </code>{" "}
                at the endpoint. Give every input a{" "}
                <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                  name
                </code>
                . Include a hidden{" "}
                <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                  _gotcha
                </code>{" "}
                honeypot to help block bots. For a thank-you page, add{" "}
                <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                  _next
                </code>{" "}
                or set a default redirect in Settings — otherwise we send the
                visitor back to the same page they submitted from.
              </p>
            </div>
            <CodeBlock
              title="index.html"
              language="markup"
              code={getHtmlSample(sampleCtx)}
            />
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-main">
                JavaScript (fetch)
              </h2>
              <p className="text-sm text-muted">
                Submit JSON from the browser or a Node script with the Fetch
                API. After success, redirect yourself if you want a thank-you
                page — we never force a navigation for XHR clients.
              </p>
            </div>
            <CodeBlock
              title="fetch"
              language="javascript"
              code={getFetchSample(sampleCtx)}
            />
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-main">Axios</h2>
              <p className="text-sm text-muted">
                Same endpoint with Axios — useful if your app already uses it.
              </p>
            </div>
            <CodeBlock
              title="axios"
              language="javascript"
              code={getAxiosSample(sampleCtx)}
            />
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-main">
                React (@questbase/sdk)
              </h2>
              <p className="text-sm text-muted">
                Install the SDK, then use{" "}
                <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                  useQuestForm
                </code>{" "}
                for a Formspark-style hook with a clearer object return value.
              </p>
            </div>
            <CodeBlock
              title="install"
              language="bash"
              code={getInstallSample()}
            />
            <CodeBlock
              title="ContactForm.tsx"
              language="tsx"
              code={getReactSample(sampleCtx)}
            />
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-main">Unified SDK</h2>
              <p className="text-sm text-muted">
                One client for forms today — OTP and waitlist will share the
                same surface later, so your docs stay simple.
              </p>
            </div>
            <CodeBlock
              title="questbase.ts"
              language="typescript"
              code={getUnifiedSdkSample(sampleCtx)}
            />
          </section>
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
          <SubmissionsTable submissions={submissions} />
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
          <div className="p-5 space-y-2">
            <label className="text-xs text-muted" htmlFor="form-redirect">
              Thank-you / redirect URL (optional)
            </label>
            <input
              id="form-redirect"
              type="url"
              value={redirectUrl}
              onChange={(e) => setRedirectUrl(e.target.value)}
              placeholder="https://yoursite.com/thanks"
              className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
            />
            <p className="text-xs text-muted leading-relaxed">
              Used for normal HTML form posts. Leave empty to send visitors back
              to the page they submitted from. Per-form{" "}
              <code className="font-mono text-[11px]">_next</code> overrides
              this. XHR / fetch clients redirect themselves.
            </p>
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
