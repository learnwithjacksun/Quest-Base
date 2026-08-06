import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  Cancel01Icon,
  Menu09Icon,
  Search01Icon,
} from "@hugeicons/core-free-icons";
import {
  applyTheme,
  getStoredTheme,
  setThemePreference,
  type ThemePreference,
} from "@/components/landing/theme";
import { getInitials } from "./data";
import { projectNavItems } from "./project-sidebar";
import { fetchProject } from "@/api/projects";
import { logoutUser } from "@/api/auth";
import { useAuthStore } from "@/stores/auth-store";
import { getErrorMessage } from "@/lib/api";

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(projectId!),
    enabled: Boolean(projectId),
  });

  const isProjectView = Boolean(
    projectId &&
    location.pathname.startsWith(`/dashboard/projects/${projectId}`),
  );

  const [menuOpen, setMenuOpen] = useState(false);
  const [themeMenuOpen, setThemeMenuOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [theme, setTheme] = useState<ThemePreference>(() => getStoredTheme());
  const themeMenuRef = useRef<HTMLDivElement>(null);
  const accountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  useEffect(() => {
    if (theme !== "system") return;

    const media = window.matchMedia("(prefers-color-scheme: light)");
    function handleChange() {
      applyTheme("system");
    }

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    if (!themeMenuOpen && !accountOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (
        themeMenuRef.current &&
        !themeMenuRef.current.contains(event.target as Node)
      ) {
        setThemeMenuOpen(false);
      }
      if (
        accountRef.current &&
        !accountRef.current.contains(event.target as Node)
      ) {
        setAccountOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setThemeMenuOpen(false);
        setAccountOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [themeMenuOpen, accountOpen]);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleThemeSelect(nextTheme: ThemePreference) {
    setTheme(nextTheme);
    setThemePreference(nextTheme);
    setThemeMenuOpen(false);
  }

  async function handleLogout() {
    try {
      await logoutUser();
    } catch (error) {
      toast.error(getErrorMessage(error, "Could not log out"));
    } finally {
      clearSession();
      navigate("/login");
    }
  }

  const projectBase = projectId
    ? `/dashboard/projects/${projectId}`
    : "/dashboard";

  const initials = user
    ? getInitials(user.firstName, user.lastName)
    : "?";

  return (
    <>
      <header className="border-b border-line sticky top-0 z-50 bg-secondary/80 backdrop-blur-sm">
        <div className="h-14 px-4 lg:px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              className="cursor-pointer lg:hidden text-main"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            >
              <HugeiconsIcon
                icon={menuOpen ? Cancel01Icon : Menu09Icon}
                size={22}
              />
            </button>

            <div className="h-10 w-px bg-line lg:hidden" />

            <Link to="/dashboard" className="shrink-0 flex items-center gap-2">
              <img src="/logo.svg" alt="Quest Base" className="size-5" />
              <p className="text-lg font-semibold text-nowrap hidden lg:block">
                Quest Base
              </p>
            </Link>

            {isProjectView && project && (
              <>
                <span className=" text-muted/50">/</span>
                <p className="text-sm text-muted truncate max-w-40">
                  {project.name}
                </p>
              </>
            )}
          </div>

          <div className="flex items-center gap-4">
            <a
              href="#"
              className="hidden lg:block text-sm text-muted hover:text-main transition-colors"
            >
              Feedback
            </a>
            <a
              href="#"
              className="hidden lg:block text-sm text-muted hover:text-main transition-colors"
            >
              Support
            </a>
            <button
              type="button"
              aria-label="Search"
              className="text-muted hover:text-main transition-colors"
            >
              <HugeiconsIcon icon={Search01Icon} size={18} />
            </button>

            <div className="relative" ref={accountRef}>
              <button
                type="button"
                aria-label="Account menu"
                onClick={() => setAccountOpen((v) => !v)}
                className="size-8 rounded-full bg-primary center text-xs font-semibold text-white"
              >
                {initials}
              </button>
              {accountOpen && (
                <div className="absolute right-0 mt-2 w-52 rounded-md border border-line bg-background shadow-lg py-1 z-50">
                  <div className="px-3 py-2 border-b border-line">
                    <p className="text-sm font-medium text-main truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted truncate">{user?.email}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-main hover:bg-secondary transition-colors"
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-background lg:hidden">
          <div className="flex items-center justify-between h-14 px-4 border-b border-line">
            <div className="min-w-0">
              {isProjectView && project ? (
                <>
                  <p className="text-sm font-semibold text-main truncate">
                    {project.name}
                  </p>
                  <p className="text-xs text-muted">Project menu</p>
                </>
              ) : (
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2"
                  onClick={closeMenu}
                >
                  <img src="/logo.svg" alt="Quest Base" className="size-5" />
                  <p className="text-lg font-semibold">Quest Base</p>
                </Link>
              )}
            </div>
            <button
              type="button"
              aria-label="Close menu"
              className="cursor-pointer text-main"
              onClick={closeMenu}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={22} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-4 pt-4 space-y-1">
            {isProjectView ? (
              <>
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 rounded-sm px-3 text-sm text-muted hover:text-main hover:bg-secondary transition-colors"
                  onClick={closeMenu}
                >
                  <HugeiconsIcon icon={ArrowLeft01Icon} size={16} />
                  Back to projects
                </Link>

                <div className="pt-2 space-y-0.5">
                  {projectNavItems.map((item) => (
                    <NavLink
                      key={item.to}
                      to={item.to ? `${projectBase}/${item.to}` : projectBase}
                      end={"end" in item ? item.end : false}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 rounded-sm px-3 py-3 text-sm transition-colors ${
                          isActive
                            ? "bg-secondary text-main"
                            : "text-main hover:bg-secondary"
                        }`
                      }
                    >
                      <HugeiconsIcon icon={item.icon} size={16} />
                      {item.label}
                    </NavLink>
                  ))}
                </div>
              </>
            ) : (
              <>
                <a
                  href="#"
                  className="block rounded-sm px-3 py-3 text-sm text-main hover:bg-secondary transition-colors"
                  onClick={closeMenu}
                >
                  Feedback
                </a>
                <a
                  href="#"
                  className="block rounded-sm px-3 py-3 text-sm text-main hover:bg-secondary transition-colors"
                  onClick={closeMenu}
                >
                  Support
                </a>
              </>
            )}

            <div className="pt-4 mt-2 border-t border-line">
              <p className="px-3 py-2 text-xs text-muted">Theme</p>
              {themeOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    handleThemeSelect(value);
                    closeMenu();
                  }}
                  className="flex w-full items-center gap-2 rounded-sm px-3 py-3 text-sm text-main hover:bg-secondary transition-colors"
                >
                  <span
                    className={`size-1.5 rounded-full bg-main ${theme === value ? "opacity-100" : "opacity-0"}`}
                  />
                  {label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-line">
              <button
                type="button"
                onClick={() => {
                  closeMenu();
                  handleLogout();
                }}
                className="w-full text-left rounded-sm px-3 py-3 text-sm text-main hover:bg-secondary transition-colors"
              >
                Log out
              </button>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
