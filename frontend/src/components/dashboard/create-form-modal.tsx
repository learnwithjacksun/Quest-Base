import { useEffect } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Add01Icon,
  Cancel01Icon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { FormField } from "@/components/auth";
import { createFormSchema, type CreateFormValues } from "@/schemas";

type CreateFormModalProps = {
  open: boolean;
  onClose: () => void;
  onCreate: (values: { name: string; emails: string[] }) => void;
};

export default function CreateFormModal({
  open,
  onClose,
  onCreate,
}: CreateFormModalProps) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateFormValues>({
    resolver: zodResolver(createFormSchema),
    defaultValues: {
      name: "",
      emails: [{ value: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "emails",
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

  function onSubmit(values: CreateFormValues) {
    onCreate({
      name: values.name,
      emails: values.emails.map((email) => email.value.trim()).filter(Boolean),
    });
    reset({ name: "", emails: [{ value: "" }] });
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
        aria-labelledby="create-form-title"
        className="relative w-full sm:max-w-md rounded-t-xl sm:rounded-lg border border-line bg-background shadow-xl"
      >
        <div className="flex items-center justify-between gap-3 px-5 py-4 border-b border-line">
          <div>
            <h2
              id="create-form-title"
              className="text-base font-semibold text-main"
            >
              Create form
            </h2>
            <p className="text-xs text-muted mt-0.5">
              Submissions will be delivered to the emails you add.
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
            label="Form name"
            placeholder="Contact form"
            autoFocus
            error={errors.name?.message}
            {...register("name")}
          />

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <label className="block text-xs font-medium text-main">
                Send emails to
              </label>
              <span className="text-[11px] text-muted">{fields.length}/2</span>
            </div>

            <div className="space-y-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-start gap-2">
                  <div className="flex-1 min-w-0">
                    <FormField
                      label={index === 0 ? "Email" : `Email ${index + 1}`}
                      type="email"
                      placeholder="you@example.com"
                      error={
                        errors.emails?.[index]?.value?.message ??
                        (index === 0 ? errors.emails?.root?.message ?? errors.emails?.message : undefined)
                      }
                      {...register(`emails.${index}.value`)}
                    />
                  </div>
                  {fields.length > 1 && (
                    <button
                      type="button"
                      aria-label="Remove email"
                      className="mt-6 size-10 shrink-0 rounded-sm border border-line bg-secondary center text-muted hover:text-main transition-colors"
                      onClick={() => remove(index)}
                    >
                      <HugeiconsIcon icon={Delete02Icon} size={15} />
                    </button>
                  )}
                  {index === fields.length - 1 && fields.length < 2 && (
                    <button
                      type="button"
                      aria-label="Add email"
                      className="mt-6 shrink-0 btn bg-secondary border border-line size-10 sm:size-auto sm:min-h-10 sm:px-3 text-xs text-muted gap-1"
                      onClick={() => append({ value: "" })}
                    >
                      <HugeiconsIcon icon={Add01Icon} size={13} />
                      <span className="hidden sm:inline">Add email</span>
                    </button>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-muted leading-relaxed">
              You can add up to 2 email addresses now. More recipients can still
              be updated later in form settings.
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
              Create form
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
