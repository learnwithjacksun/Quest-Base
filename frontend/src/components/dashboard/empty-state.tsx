import { HugeiconsIcon } from "@hugeicons/react";
import { Folder01Icon, PlusSignIcon } from "@hugeicons/core-free-icons";

type EmptyStateProps = {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export default function EmptyState({
  title = "No projects yet",
  description = "Create your first project to start collecting form submissions, sending OTPs, and managing waitlists.",
  actionLabel = "Create project",
  onAction,
}: EmptyStateProps) {
  return (
    <div className="rounded-lg border border-dashed border-line py-16 px-6 flex flex-col items-center text-center gap-4">
      <span className="size-12 rounded-full bg-secondary border border-line center text-muted">
        <HugeiconsIcon icon={Folder01Icon} size={22} />
      </span>
      <div className="space-y-1">
        <h3 className="text-base font-medium text-main">{title}</h3>
        <p className="text-sm text-muted max-w-sm">{description}</p>
      </div>
      <button
        type="button"
        onClick={onAction}
        className="btn-primary btn min-h-9 px-4 text-sm gap-1.5"
      >
        <HugeiconsIcon icon={PlusSignIcon} size={15} />
        {actionLabel}
      </button>
    </div>
  );
}
