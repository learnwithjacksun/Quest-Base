import { useState, type FormEvent } from "react";
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

const socials = [
  { icon: NewTwitterIcon, label: "X", href: "#" },
  { icon: Github01Icon, label: "GitHub", href: "#" },
  { icon: DiscordIcon, label: "Discord", href: "#" },
  { icon: YoutubeIcon, label: "YouTube", href: "#" },
  { icon: TiktokIcon, label: "TikTok", href: "#" },
  { icon: InstagramIcon, label: "Instagram", href: "#" },
] as const;

const columns = [
  {
    title: "Product",
    links: [
      { label: "form2mail", href: "#" },
      { label: "OTP Configuration (Email & SMS)", href: "#" },
      { label: "Waitlist Management", href: "#" },
      { label: "Pricing", href: "#" },
      { label: "API", href: "#" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Startups", href: "#" },
      { label: "SaaS Products", href: "#" },
      { label: "Agencies", href: "#" },
      { label: "Developers", href: "#" },
      { label: "Enterprise", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Guides", href: "#" },
      { label: "Support", href: "#" },
      { label: "Brand Assets", href: "#" },
    ],
  },
  {
    title: "Developers",
    links: [
      { label: "API Reference", href: "#" },
      { label: "Changelog", href: "#" },
      { label: "Status", href: "#" },
      { label: "SDKs", href: "#" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Open Source", href: "#" },
      { label: "GitHub", href: "#" },
      { label: "Discord", href: "#" },
      { label: "X / Twitter", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact Us", href: "#" },
    ],
  },
] as const;

export default function Footer() {
  const [isLight, setIsLight] = useState(
    () => typeof document !== "undefined" && document.body.classList.contains("light"),
  );

  function toggleTheme() {
    document.body.classList.toggle("light");
    setIsLight((prev) => !prev);
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
            {columns.map((column) => (
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
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={isLight ? "Switch to dark mode" : "Switch to light mode"}
            className="text-muted transition-colors hover:text-main p-1"
          >
            <HugeiconsIcon icon={isLight ? Sun01Icon : Moon01Icon} size={18} />
          </button>
        </div>
      </div>
    </footer>
  );
}
