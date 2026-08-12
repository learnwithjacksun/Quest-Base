import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import { PlusSignIcon, Shield01Icon } from "@hugeicons/core-free-icons";
import { CreateOtpModal } from "@/components/dashboard";
import {
  createOtp,
  fetchOtps,
  getOtpSendEndpoint,
} from "@/api/otp";
import { getErrorMessage } from "@/lib/api";
import { EmptyPanel, FeaturePage, StatCard, useProject } from "./_shared";

export default function ProjectOtp() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { project } = useProject();
  const [modalOpen, setModalOpen] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ["otps", project.id],
    queryFn: () => fetchOtps(project.id),
  });

  const otps = data?.otps ?? [];
  const stats = data?.stats;

  const createMutation = useMutation({
    mutationFn: (values: {
      name: string;
      emailEnabled: boolean;
      smsEnabled: boolean;
    }) => createOtp(project.id, values),
    onSuccess: (otp) => {
      queryClient.invalidateQueries({ queryKey: ["otps", project.id] });
      toast.success(`"${otp.name}" created`);
      navigate(`/dashboard/projects/${project.id}/otp/${otp.id}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Could not create OTP endpoint"));
    },
  });

  return (
    <FeaturePage
      title="OTP"
      description={`Send and verify email & SMS one-time passwords for ${project.name}.`}
      action={
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="btn-primary btn min-h-9 px-4 text-sm gap-1.5"
        >
          <HugeiconsIcon icon={PlusSignIcon} size={14} />
          Create OTP
        </button>
      }
    >
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          label="Email OTP"
          value={stats?.emailEnabled ? "On" : "Off"}
        />
        <StatCard label="SMS OTP" value={stats?.smsEnabled ? "On" : "Off"} />
        <StatCard
          label="Codes sent (24h)"
          value={String(stats?.sent24h ?? 0)}
        />
      </div>

      {isLoading ? (
        <p className="text-sm text-muted">Loading OTP endpoints…</p>
      ) : otps.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {otps.map((otp) => (
            <Link
              key={otp.id}
              to={`/dashboard/projects/${project.id}/otp/${otp.id}`}
              className="rounded-lg border border-line bg-secondary p-5 space-y-3 transition-colors hover:border-accent/30"
            >
              <div className="flex items-start gap-3">
                <span className="size-9 rounded-sm bg-foreground border border-line center text-accent shrink-0">
                  <HugeiconsIcon icon={Shield01Icon} size={16} />
                </span>
                <div className="min-w-0 space-y-1">
                  <h2 className="text-sm font-semibold text-main truncate">
                    {otp.name}
                  </h2>
                  <p className="text-xs text-muted font-mono truncate">
                    {getOtpSendEndpoint(otp.id)}
                  </p>
                </div>
              </div>
              <p className="text-xs text-muted">
                {[
                  otp.emailEnabled ? "Email" : null,
                  otp.smsEnabled ? "SMS" : null,
                ]
                  .filter(Boolean)
                  .join(" · ") || "No channels enabled"}
                {" · "}
                {otp.sent24h ?? 0} sent (24h)
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyPanel
          title="No OTP endpoints yet"
          description="Create an OTP endpoint, enable email or SMS, then copy two simple calls: send and verify. We handle delivery."
          action={
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="btn-primary btn mx-auto min-h-9 px-4 text-sm gap-1.5"
            >
              <HugeiconsIcon icon={PlusSignIcon} size={14} />
              Create OTP
            </button>
          }
        />
      )}

      <CreateOtpModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={(values) => createMutation.mutate(values)}
      />
    </FeaturePage>
  );
}
