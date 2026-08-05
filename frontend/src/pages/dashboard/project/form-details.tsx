import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import {
  getFormEndpoint,
  useFormsStore,
  useProjectsStore,
} from "@/components/dashboard";

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
  const [activeTab, setActiveTab] = useState<Tab>("Integration");
  const [copied, setCopied] = useState(false);

  const project = useProjectsStore((state) =>
    state.projects.find((item) => item.id === projectId),
  );
  const form = useFormsStore((state) =>
    state.forms.find((item) => item.id === formId),
  );

  useEffect(() => {
    if (!project || !form || form.projectId !== project.id) {
      navigate(
        projectId
          ? `/dashboard/projects/${projectId}/forms`
          : "/dashboard",
        { replace: true },
      );
    }
  }, [project, form, projectId, navigate]);

  if (!project || !form || form.projectId !== project.id) return null;

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
            attribute to each input.
          </p>
        </div>
      )}

      {activeTab === "Submissions" && (
        <div className="rounded-lg border border-dashed border-line bg-secondary/40 px-6 py-12 text-center space-y-1">
          <h2 className="text-sm font-medium text-main">No submissions yet</h2>
          <p className="text-sm text-muted">
            Submissions to this form will appear here.
          </p>
        </div>
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
          <div className="p-5 space-y-1">
            <p className="text-xs text-muted">Send emails to</p>
            <p className="text-sm text-main">{form.emails.join(", ")}</p>
            <p className="text-xs text-muted mt-2">
              More recipients can be updated later.
            </p>
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
