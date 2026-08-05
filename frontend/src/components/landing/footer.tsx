import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  DiscordIcon,
  Github01Icon,
  InstagramIcon,
  Moon01Icon,
  NewTwitterIcon,
  Sun01Icon,
  TiktokIcon,
  YoutubeIcon,
} from "@hugeicons/core-free-icons";
import { navColumns } from "./nav-data";
import {
  applyTheme,
  getEffectiveIsLight,
  getStoredTheme,
  setThemePreference,
  type ThemePreference,
} from "./theme";

const socials = [
  { icon: NewTwitterIcon, label: "X", href: "#" },
  { icon: Github01Icon, label: "GitHub", href: "#" },
  { icon: DiscordIcon, label: "Discord", href: "#" },
  { icon: YoutubeIcon, label: "YouTube", href: "#" },
  { icon: TiktokIcon, label: "TikTok", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
] as const;

const themeOptions: { value: ThemePreference; label: string }[] = [
  { value: "system", label: "System" },
  { value: "dark", label: "Dark" },
  { value: "light", label: "Light" },
];

export default function Footer() {
  const [theme, setTheme] = useState<ThemePreference>(() => getStoredTheme());
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const isLight = getEffectiveIsLight(theme);

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
    if (!menuOpen) return;

    function handlePointerDown(event: MouseEvent) {
      if (!menuRef.current?.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMenuOpen(false);
      }
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [menuOpen]);

  function handleThemeSelect(nextTheme: ThemePreference) {
    setTheme(nextTheme);
    setThemePreference(nextTheme);
    setMenuOpen(false);
  }

  function handleSubscribe(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
  }

  return (
    <footer className="border-t border-line mt-20">
      <div className="max-w-272.5 mx-auto w-[90%] py-16">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4 space-y-8">
            <Link to="/" className="inline-flex items-center gap-2">
              <img src="/logo.svg" alt="Quest Base" className="size-5" />
              <span className="text-lg font-semibold">Quest Base</span>
            </Link>

            <div className="flex items-center gap-4">
              {socials.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-muted transition-colors hover:text-main"
                >
                  <HugeiconsIcon icon={icon} size={18} />
                </a>
              ))}
            </div>

            <div className="space-y-3 max-w-72">
              <p className="text-sm text-muted">
                Get product updates and news from Quest Base.
              </p>
              <form
                onSubmit={handleSubscribe}
                className="flex items-center gap-2"
              >
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="Your email"
                  className="min-h-9 flex-1 rounded-sm border border-line bg-secondary px-3 text-sm text-main placeholder:text-muted"
                />
                <button type="submit" className="btn-primary btn min-h-9 px-3 text-sm">
                  Subscribe
                </button>
              </form>
            </div>
          </div>

          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
            {navColumns.map((column) => (
              <div key={column.title} className="space-y-3">
                <h3 className="text-sm font-semibold text-main">{column.title}</h3>
                <ul className="space-y-2">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-muted transition-colors hover:text-main"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 pt-6 border-t border-line flex items-center justify-between gap-4">
          <p className="text-sm text-muted">© Quest Base</p>
          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Choose theme"
              aria-expanded={menuOpen}
              aria-haspopup="listbox"
              className="text-muted transition-colors hover:text-main p-1"
            >
              <HugeiconsIcon icon={isLight ? Sun01Icon : Moon01Icon} size={18} />
            </button>

            {menuOpen && (
              <div
                role="listbox"
                aria-label="Theme options"
                className="absolute bottom-full right-0 mb-2 min-w-36 rounded-md border border-line bg-secondary py-1 shadow-lg"
              >
                {themeOptions.map(({ value, label }) => (
                  <button
                    key={value}
                    type="button"
                    role="option"
                    aria-selected={theme === value}
                    onClick={() => handleThemeSelect(value)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-main transition-colors hover:bg-background"
                  >
                    <span
                      className={`size-1.5 rounded-full bg-main ${theme === value ? "opacity-100" : "opacity-0"}`}
                    />
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
