import { NavLink, useParams } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DashboardSquare01Icon,
  File01Icon,
  Key01Icon,
  MailSend01Icon,
  SecurityCheckIcon,
  Settings01Icon,
  UserMultipleIcon,
  WebhookIcon,
} from "@hugeicons/core-free-icons";

export const projectNavItems = [
  { to: "", label: "Overview", icon: DashboardSquare01Icon, end: true },
  { to: "forms", label: "Forms", icon: MailSend01Icon },
  { to: "submissions", label: "Submissions", icon: File01Icon },
  { to: "otp", label: "OTP", icon: SecurityCheckIcon },
  { to: "waitlist", label: "Waitlist", icon: UserMultipleIcon },
  { to: "webhooks", label: "Webhooks", icon: WebhookIcon },
  { to: "api-keys", label: "API Keys", icon: Key01Icon },
  { to: "settings", label: "Settings", icon: Settings01Icon },
] as const;

type ProjectSidebarProps = {
  onNavigate?: () => void;
};

export default function ProjectSidebar({ onNavigate }: ProjectSidebarProps) {
  const { projectId } = useParams();
  const base = `/dashboard/projects/${projectId}`;

  return (
    <nav className="flex flex-col gap-0.5 p-3">
      {projectNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to ? `${base}/${item.to}` : base}
          end={"end" in item ? item.end : false}
          onClick={onNavigate}
          className={({ isActive }) =>
            `flex items-center gap-2.5 rounded-sm px-3 py-2 text-sm transition-colors ${
              isActive
                ? "bg-foreground text-main"
                : "text-muted hover:text-main hover:bg-secondary"
            }`
          }
        >
          <HugeiconsIcon icon={item.icon} size={16} />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
