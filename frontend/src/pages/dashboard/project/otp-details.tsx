import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowLeft01Icon, Copy01Icon, Tick02Icon } from "@hugeicons/core-free-icons";
import { CodeBlock } from "@/components/common";
import {
  deleteOtp,
  fetchOtp,
  getOtpSendEndpoint,
  getOtpVerifyEndpoint,
  updateOtp,
} from "@/api/otp";
import { fetchProject } from "@/api/projects";
import { getErrorMessage } from "@/lib/api";
import {
  getOtpFetchSample,
  getOtpInstallSample,
  getOtpSdkSample,
  getOtpServerSample,
} from "./otp-integration-samples";

const tabs = ["Integration", "Settings"] as const;
type Tab = (typeof tabs)[number];

export default function OtpDetails() {
  const { projectId, otpId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<Tab>("Integration");
  const [copied, setCopied] = useState<"send" | "verify" | null>(null);

  const [name, setName] = useState("");
  const [originsText, setOriginsText] = useState("");
  const [emailEnabled, setEmailEnabled] = useState(true);
  const [smsEnabled, setSmsEnabled] = useState(false);
  const [expirySeconds, setExpirySeconds] = useState(300);
  const [maxAttempts, setMaxAttempts] = useState(5);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailTemplate, setEmailTemplate] = useState("");
  const [smsSender, setSmsSender] = useState("");
  const [smsTemplate, setSmsTemplate] = useState("");

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: Boolean(projectId),
  });

  const {
    data: otp,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["otp", otpId],
    queryFn: () => fetchOtp(otpId!),
    enabled: Boolean(otpId),
  });

  useEffect(() => {
    if (!otp) return;
    setName(otp.name);
    setOriginsText((otp.allowedOrigins || []).join(", "));
    setEmailEnabled(otp.emailEnabled);
    setSmsEnabled(otp.smsEnabled);
    setExpirySeconds(otp.expirySeconds);
    setMaxAttempts(otp.maxAttempts);
    setEmailSubject(otp.emailSubject);
    setEmailTemplate(otp.emailTemplate);
    setSmsSender(otp.smsSender || "");
    setSmsTemplate(otp.smsTemplate);
  }, [otp]);

  useEffect(() => {
    if (isError) {
      navigate(
        projectId ? `/dashboard/projects/${projectId}/otp` : "/dashboard",
        { replace: true },
      );
    }
  }, [isError, projectId, navigate]);

  const saveMutation = useMutation({
    mutationFn: () => {
      const allowedOrigins = originsText
        .split(",")
        .map((o) => o.trim())
        .filter(Boolean);
      return updateOtp(otpId!, {
        name: name.trim(),
        allowedOrigins,
        emailEnabled,
        smsEnabled,
        expirySeconds: Number(expirySeconds),
        maxAttempts: Number(maxAttempts),
        emailSubject: emailSubject.trim(),
        emailTemplate: emailTemplate.trim(),
        smsSender: smsSender.trim(),
        smsTemplate: smsTemplate.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["otp", otpId] });
      queryClient.invalidateQueries({ queryKey: ["otps", projectId] });
      toast.success("OTP settings saved");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not save settings"));
    },
  });

  const deleteMutation = useMutation({
    mutationFn: () => deleteOtp(otpId!),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["otps", projectId] });
      toast.success("OTP endpoint deleted");
      navigate(`/dashboard/projects/${projectId}/otp`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not delete OTP endpoint"));
    },
  });

  if (isLoading || !otp || !project) {
    return (
      <div className="p-6 lg:p-8 text-sm text-muted">Loading OTP…</div>
    );
  }

  if (otp.projectId !== project.id) {
    return null;
  }

  const sendEndpoint = getOtpSendEndpoint(otp.id);
  const verifyEndpoint = getOtpVerifyEndpoint(otp.id);
  const sampleCtx = {
    sendEndpoint,
    verifyEndpoint,
    otpId: otp.id,
  };

  async function handleCopy(kind: "send" | "verify") {
    try {
      await navigator.clipboard.writeText(
        kind === "send" ? sendEndpoint : verifyEndpoint,
      );
      setCopied(kind);
      toast.success("Endpoint copied");
      window.setTimeout(() => setCopied(null), 1600);
    } catch {
      toast.error("Could not copy endpoint");
    }
  }

  return (
    <div className="p-6 lg:p-8 space-y-6">
      <div className="space-y-4">
        <Link
          to={`/dashboard/projects/${project.id}/otp`}
          className="inline-flex items-center gap-1 text-xs text-muted hover:text-main transition-colors"
        >
          <HugeiconsIcon icon={ArrowLeft01Icon} size={12} />
          OTP
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-3">
          <h1 className="text-xl lg:text-2xl font-semibold text-main">
            {otp.name}
          </h1>
          <p className="text-xs text-muted">
            {otp.sent24h ?? 0} codes sent in the last 24 hours
          </p>
        </div>

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
          <div className="rounded-lg border border-line bg-secondary p-5 lg:p-6 space-y-4">
            <div className="space-y-1">
              <p className="text-[11px] font-medium tracking-wider uppercase text-muted">
                How it works
              </p>
              <p className="text-sm text-main leading-relaxed">
                Send a code, collect it from your user, verify it. Quest Base
                delivers over email and SMS — you never talk to Brevo or manage
                OTP storage yourself.
              </p>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-medium tracking-wider uppercase text-muted">
                Send endpoint
              </p>
              <div className="flex items-stretch gap-2">
                <input
                  readOnly
                  value={sendEndpoint}
                  className="flex-1 min-h-10 rounded-sm border border-line bg-background px-3 text-sm font-mono text-main"
                />
                <button
                  type="button"
                  onClick={() => handleCopy("send")}
                  className="btn bg-background border border-line min-h-10 px-4 text-sm text-main gap-1.5 shrink-0"
                >
                  <HugeiconsIcon
                    icon={copied === "send" ? Tick02Icon : Copy01Icon}
                    size={15}
                  />
                  {copied === "send" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-[11px] font-medium tracking-wider uppercase text-muted">
                Verify endpoint
              </p>
              <div className="flex items-stretch gap-2">
                <input
                  readOnly
                  value={verifyEndpoint}
                  className="flex-1 min-h-10 rounded-sm border border-line bg-background px-3 text-sm font-mono text-main"
                />
                <button
                  type="button"
                  onClick={() => handleCopy("verify")}
                  className="btn bg-background border border-line min-h-10 px-4 text-sm text-main gap-1.5 shrink-0"
                >
                  <HugeiconsIcon
                    icon={copied === "verify" ? Tick02Icon : Copy01Icon}
                    size={15}
                  />
                  {copied === "verify" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>

            <p className="text-sm text-muted leading-relaxed">
              Call from the browser when your origin is allowed, or from your
              server with a project API key. Same two endpoints either way.
            </p>
          </div>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-main">
                JavaScript (fetch)
              </h2>
              <p className="text-sm text-muted">
                Two JSON POSTs — send, then verify. Works in the browser or
                Node.
              </p>
            </div>
            <CodeBlock
              title="otp.js"
              language="javascript"
              code={getOtpFetchSample(sampleCtx)}
            />
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-main">
                SDK (browser)
              </h2>
              <p className="text-sm text-muted">
                Install once, then use{" "}
                <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                  qb.otp.send
                </code>{" "}
                and{" "}
                <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                  qb.otp.verify
                </code>
                .
              </p>
            </div>
            <CodeBlock
              title="install"
              language="bash"
              code={getOtpInstallSample()}
            />
            <CodeBlock
              title="otp.ts"
              language="typescript"
              code={getOtpSdkSample(sampleCtx)}
            />
          </section>

          <section className="space-y-3">
            <div className="space-y-1">
              <h2 className="text-sm font-semibold text-main">
                SDK (server)
              </h2>
              <p className="text-sm text-muted">
                For server-to-server or mobile backends, pass your{" "}
                <code className="rounded-sm bg-foreground px-1.5 py-0.5 font-mono text-[12px] text-main">
                  qb_…
                </code>{" "}
                API key. Never expose it in client bundles.
              </p>
            </div>
            <CodeBlock
              title="server.ts"
              language="typescript"
              code={getOtpServerSample(sampleCtx)}
            />
          </section>
        </div>
      )}

      {activeTab === "Settings" && (
        <div className="space-y-6 max-w-xl">
          <div className="rounded-lg border border-line bg-secondary divide-y divide-line">
            <div className="p-5 space-y-1">
              <p className="text-xs text-muted">OTP ID</p>
              <p className="text-sm font-mono text-main">{otp.id}</p>
            </div>

            <div className="p-5 space-y-2">
              <label className="text-xs text-muted" htmlFor="otp-name">
                Name
              </label>
              <input
                id="otp-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
              />
            </div>

            <div className="p-5 space-y-3">
              <p className="text-xs text-muted">Channels</p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setEmailEnabled((v) => !v)}
                  className={`btn min-h-9 px-3 text-sm border ${
                    emailEnabled
                      ? "border-accent/40 bg-accent/10 text-main"
                      : "border-line bg-background text-muted"
                  }`}
                >
                  Email {emailEnabled ? "On" : "Off"}
                </button>
                <button
                  type="button"
                  onClick={() => setSmsEnabled((v) => !v)}
                  className={`btn min-h-9 px-3 text-sm border ${
                    smsEnabled
                      ? "border-accent/40 bg-accent/10 text-main"
                      : "border-line bg-background text-muted"
                  }`}
                >
                  SMS {smsEnabled ? "On" : "Off"}
                </button>
              </div>
            </div>

            <div className="p-5 space-y-2">
              <label className="text-xs text-muted" htmlFor="otp-origins">
                Allowed origins (comma-separated). Leave empty to allow all
                browser origins.
              </label>
              <input
                id="otp-origins"
                value={originsText}
                onChange={(e) => setOriginsText(e.target.value)}
                placeholder="https://example.com, http://localhost:5173"
                className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
              />
            </div>

            <div className="p-5 grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs text-muted" htmlFor="otp-expiry">
                  Expiry (seconds)
                </label>
                <input
                  id="otp-expiry"
                  type="number"
                  min={60}
                  max={3600}
                  value={expirySeconds}
                  onChange={(e) => setExpirySeconds(Number(e.target.value))}
                  className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs text-muted" htmlFor="otp-attempts">
                  Max attempts
                </label>
                <input
                  id="otp-attempts"
                  type="number"
                  min={1}
                  max={20}
                  value={maxAttempts}
                  onChange={(e) => setMaxAttempts(Number(e.target.value))}
                  className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
                />
              </div>
            </div>

            <div className="p-5 space-y-2">
              <label className="text-xs text-muted" htmlFor="otp-email-subject">
                Email subject
              </label>
              <input
                id="otp-email-subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
              />
            </div>

            <div className="p-5 space-y-2">
              <label className="text-xs text-muted" htmlFor="otp-email-template">
                Email template (must include {"{{code}}"})
              </label>
              <textarea
                id="otp-email-template"
                rows={3}
                value={emailTemplate}
                onChange={(e) => setEmailTemplate(e.target.value)}
                className="w-full rounded-sm border border-line bg-background px-3 py-2 text-sm text-main"
              />
            </div>

            <div className="p-5 space-y-2">
              <label className="text-xs text-muted" htmlFor="otp-sms-sender">
                SMS sender (≤11 alphanumeric)
              </label>
              <input
                id="otp-sms-sender"
                value={smsSender}
                onChange={(e) => setSmsSender(e.target.value)}
                placeholder="QuestBase"
                className="w-full min-h-10 rounded-sm border border-line bg-background px-3 text-sm text-main"
              />
            </div>

            <div className="p-5 space-y-2">
              <label className="text-xs text-muted" htmlFor="otp-sms-template">
                SMS template (must include {"{{code}}"})
              </label>
              <textarea
                id="otp-sms-template"
                rows={2}
                value={smsTemplate}
                onChange={(e) => setSmsTemplate(e.target.value)}
                className="w-full rounded-sm border border-line bg-background px-3 py-2 text-sm text-main"
              />
            </div>

            <div className="p-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={saveMutation.isPending}
                onClick={() => saveMutation.mutate()}
                className="btn-primary btn min-h-9 px-4 text-sm"
              >
                {saveMutation.isPending ? "Saving…" : "Save settings"}
              </button>
              <button
                type="button"
                disabled={deleteMutation.isPending}
                onClick={() => {
                  if (
                    window.confirm(
                      "Delete this OTP endpoint? Existing codes will stop working.",
                    )
                  ) {
                    deleteMutation.mutate();
                  }
                }}
                className="btn bg-background border border-line min-h-9 px-4 text-sm text-red-400"
              >
                {deleteMutation.isPending ? "Deleting…" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
