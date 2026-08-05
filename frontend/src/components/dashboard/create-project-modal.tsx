import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import { Cancel01Icon } from "@hugeicons/core-free-icons";
import { FormField } from "@/components/auth";
import {
  createProjectSchema,
  type CreateProjectValues,
} from "@/schemas";

type CreateProjectModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: CreateProjectValues) => void;
};

const fieldClass =
  "w-full min-h-10 rounded-sm border border-line bg-secondary px-3 text-sm text-main transition-colors focus:border-accent/50";

export default function CreateProjectModal({
  open,
  onClose,
  onCreate,
}: CreateProjectModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateProjectValues>({
    resolver: zodResolver(createProjectSchema),
    defaultValues: {
      name: "",
      description: "",
      platform: "Web",
    },
  });

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

  function onSubmit(values: CreateProjectValues) {
    onCreate(values);
    reset();
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
        aria-labelledby="create-project-title"
        className="relative w-full sm:max-w-md rounded-t-xl sm:rounded-lg border border-line bg-background shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2
              id="create-project-title"
              className="text-base font-semibold text-main"
            >
              Create project
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Set up forms, OTP, and waitlists under one workspace.
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

        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4" noValidate>
          <FormField
            label="Project name"
            placeholder="Acme Launch"
            autoFocus
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="block text-xs font-medium text-main"
            >
              Description <span className="text-muted">(optional)</span>
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="What is this project for?"
              className={`${fieldClass} py-2.5 resize-none`}
              {...register("description")}
            />
            {errors.description?.message && (
              <p className="text-xs text-red-500">{errors.description.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="platform"
              className="block text-xs font-medium text-main"
            >
              Platform
            </label>
            <select
              id="platform"
              className={fieldClass}
              {...register("platform")}
            >
              <option value="Web">Web</option>
              <option value="Mobile">Mobile</option>
            </select>
            {errors.platform?.message && (
              <p className="text-xs text-red-500">{errors.platform.message}</p>
            )}
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
              Create project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
