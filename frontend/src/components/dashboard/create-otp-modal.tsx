import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { FormField } from "@/components/auth";
import { createOtpSchema, type CreateOtpValues } from "@/schemas";

type CreateOtpModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: {
    name: string;
    emailEnabled: boolean;
    smsEnabled: boolean;
  }) => void;
};

export default function CreateOtpModal({
  open,
  onClose,
  onCreate,
}: CreateOtpModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<CreateOtpValues>({
    resolver: zodResolver(createOtpSchema),
    defaultValues: {
      name: "",
      emailEnabled: true,
      smsEnabled: false,
    },
  });

  const emailEnabled = watch("emailEnabled");
  const smsEnabled = watch("smsEnabled");

  useEffect(() => {
    if (!open) return;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onClose();
    }

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  function onSubmit(values: CreateOtpValues) {
    onCreate({
      name: values.name,
      emailEnabled: values.emailEnabled,
      smsEnabled: values.smsEnabled,
    });
    reset({ name: "", emailEnabled: true, smsEnabled: false });
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <button
        type="button"
        aria-label="Close dialog"
        className="absolute inset-0 bg-black/60"
        onClick={onClose}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-otp-title"
        className="relative w-full sm:max-w-md rounded-t-xl sm:rounded-lg border border-line bg-background shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2
              id="create-otp-title"
              className="text-base font-semibold text-main"
            >
              Create OTP endpoint
            </h2>
            <p className="text-xs text-muted mt-0.5">
              One endpoint to send and verify codes — we deliver via email and
              SMS.
            </p>
          </div>
          <button
            type="button"
            aria-label="Close"
            className="text-muted hover:text-main transition-colors"
            onClick={onClose}
          >
            <HugeiconsIcon icon={Cancel01Icon} size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="p-5 space-y-4"
          noValidate
        >
          <FormField
            label="Name"
            placeholder="Login verification"
            autoFocus
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="space-y-2">
            <p className="text-xs font-medium text-main">Channels</p>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setValue("emailEnabled", !emailEnabled, {
                  shouldValidate: true,
                })}
                className={`btn min-h-9 px-3 text-sm border ${
                  emailEnabled
                    ? "border-accent/40 bg-accent/10 text-main"
                    : "border-line bg-secondary text-muted"
                }`}
              >
                Email {emailEnabled ? "On" : "Off"}
              </button>
              <button
                type="button"
                onClick={() => setValue("smsEnabled", !smsEnabled, {
                  shouldValidate: true,
                })}
                className={`btn min-h-9 px-3 text-sm border ${
                  smsEnabled
                    ? "border-accent/40 bg-accent/10 text-main"
                    : "border-line bg-secondary text-muted"
                }`}
              >
                SMS {smsEnabled ? "On" : "Off"}
              </button>
            </div>
            {errors.emailEnabled?.message && (
              <p className="text-xs text-red-500">{errors.emailEnabled.message}</p>
            )}
            <p className="text-xs text-muted leading-relaxed">
              You can change templates, expiry, and allowed origins after
              creating the endpoint.
            </p>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="btn bg-secondary border border-line min-h-9 px-4 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary btn min-h-9 px-4 text-sm"
            >
              Create OTP
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
