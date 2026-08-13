import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  ArrowLeft01Icon,
  Copy01Icon,
  Tick02Icon,
} from "@hugeicons/core-free-icons";
import { CodeBlock } from "@/components/common";
import SubmissionsTable from "@/components/dashboard/submissions-table";
import {
  getAgentPrompt,
  getAxiosSample,
  getFetchSample,
  getHtmlSample,
  getInstallSample,
  getReactSample,
  getUnifiedSdkSample,
  integrationStacks,
  type IntegrationStackId,
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

const integrationModes = [
  { id: "manual", label: "Manual" },
  { id: "agent", label: "With agent" },
] as const;

type Tab = (typeof tabs)[number];
type IntegrationMode = (typeof integrationModes)[number]["id"];

const tabButtonClass = (active: boolean) =>
  `rounded-none px-3.5 py-2.5 text-sm text-nowrap transition-colors border-b-2 -mb-px ${
    active
      ? "border-accent text-main"
      : "border-transparent text-muted hover:text-main"
  }`;

function StackDropdown({
  value,
  onChange,
}: {
  value: IntegrationStackId;
  onChange: (id: IntegrationStackId) => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const selected =
    integrationStacks.find((s) => s.id === value) ?? integrationStacks[0];

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative inline-flex">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-1.5 rounded-sm border border-line bg-secondary px-3 py-2 text-sm text-main"
      >
        {selected.label}
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size={14}
          className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute left-0 top-full z-20 mt-1 min-w-full w-max max-w-[min(100vw-3rem,18rem)] rounded-sm border border-line bg-secondary py-1 shadow-lg"
        >
          {integrationStacks.map((stack) => (
            <li key={stack.id} role="option" aria-selected={stack.id === value}>
              <button
                type="button"
                onClick={() => {
                  onChange(stack.id);
                  setOpen(false);
                }}
                className={`w-full rounded-none px-3 py-2 text-left text-sm transition-colors ${
                  stack.id === value
                    ? "bg-foreground text-main"
                    : "text-muted hover:bg-foreground/70 hover:text-main"
                }`}
              >
                {stack.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function FormDetails() {
  const { projectId, formId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("Integration");
  const [integrationMode, setIntegrationMode] =
    useState<IntegrationMode>("manual");
  const [stack, setStack] = useState<IntegrationStackId>("html");
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
  const selectedStack =
    integrationStacks.find((s) => s.id === stack) ?? integrationStacks[0];

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
              className={tabButtonClass(activeTab === tab)}
            >
              {tab}
            </button>
          ))}
        </nav>
      </div>

      {activeTab === "Integration" && (
        <div className="space-y-6 max-w-3xl">
          <nav className="flex items-center gap-1 overflow-x-auto hide-scrollbar border-b border-line">
            {integrationModes.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setIntegrationMode(mode.id)}
                className={tabButtonClass(integrationMode === mode.id)}
              >
                {mode.label}
              </button>
            ))}
          </nav>

          <div className="space-y-2">
            <p className="text-[11px] font-medium tracking-wider uppercase text-muted">
              Stack
            </p>
            <StackDropdown value={stack} onChange={setStack} />
          </div>

          {integrationMode === "manual" && (
            <div className="space-y-8">
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
                  <h2 className="text-sm font-semibold text-main">
                    {selectedStack.label}
                  </h2>
                  <p className="text-sm text-muted">{selectedStack.description}</p>
                </div>

                {stack === "html" && (
                  <CodeBlock
                    title="index.html"
                    language="markup"
                    code={getHtmlSample(sampleCtx)}
                  />
                )}

                {stack === "fetch" && (
                  <CodeBlock
                    title="fetch"
                    language="javascript"
                    code={getFetchSample(sampleCtx)}
                  />
                )}

                {stack === "axios" && (
                  <CodeBlock
                    title="axios"
                    language="javascript"
                    code={getAxiosSample(sampleCtx)}
                  />
                )}

                {stack === "react" && (
                  <>
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
                  </>
                )}

                {stack === "sdk" && (
                  <CodeBlock
                    title="questbase.ts"
                    language="typescript"
                    code={getUnifiedSdkSample(sampleCtx)}
                  />
                )}
              </section>
            </div>
          )}

          {integrationMode === "agent" && (
            <div className="space-y-3">
              <div className="space-y-1">
                <h2 className="text-sm font-semibold text-main">
                  Agent prompt
                </h2>
                <p className="text-sm text-muted">
                  Paste this into Cursor, ChatGPT, Claude, or another coding
                  agent. It is tailored to {selectedStack.label}.
                </p>
              </div>
              <CodeBlock
                title="agent-prompt"
                language="markdown"
                code={getAgentPrompt(sampleCtx, stack)}
              />
            </div>
          )}
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
