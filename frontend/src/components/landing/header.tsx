import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowDown01Icon,
  Cancel01Icon,
  Github01Icon,
  Menu09Icon,
} from "@hugeicons/core-free-icons";
import { navColumns } from "./nav-data";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [openSection, setOpenSection] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  function closeMenu() {
    setMenuOpen(false);
    setOpenSection(null);
  }

  function toggleSection(title: string) {
    setOpenSection((current) => (current === title ? null : title));
  }

  return (
    <>
      <header className="sticky top-0 inset-x-0 z-50 border-b border-line bg-background/80 backdrop-blur-sm">
        <nav className="max-w-272.5 mx-auto w-[90%] flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="logo" className="size-5" />
            <p className="text-lg font-semibold">Quest Base</p>
          </Link>

          <div className="flex items-center gap-6">
            <a
              href="http://"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm"
            >
              <HugeiconsIcon icon={Github01Icon} size={19} /> <span>12.4k</span>
            </a>
            <button
              type="button"
              className="cursor-pointer lg:hidden"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
            >
              <HugeiconsIcon
                icon={menuOpen ? Cancel01Icon : Menu09Icon}
                size={24}
              />
            </button>

            <div className="hidden lg:flex items-center gap-4">
              <Link
                to="/login"
                className="btn bg-secondary border border-line min-h-8 px-4 text-sm text-nowrap"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="btn-primary btn min-h-8 px-4 text-sm text-nowrap"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-40 flex flex-col bg-background lg:hidden">
          <div className="flex items-center justify-between h-16 px-[5%] border-b border-line">
            <Link to="/" className="flex items-center gap-2" onClick={closeMenu}>
              <img src="/logo.svg" alt="logo" className="size-5" />
              <p className="text-lg font-semibold">Quest Base</p>
            </Link>
            <button
              type="button"
              aria-label="Close menu"
              className="cursor-pointer"
              onClick={closeMenu}
            >
              <HugeiconsIcon icon={Cancel01Icon} size={24} />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-[5%]">
            <ul>
              {navColumns.map((column) => {
                const isOpen = openSection === column.title;

                return (
                  <li key={column.title} className="border-b border-line">
                    <button
                      type="button"
                      className="flex w-full items-center justify-between py-4 text-left text-base font-medium text-main"
                      aria-expanded={isOpen}
                      onClick={() => toggleSection(column.title)}
                    >
                      {column.title}
                      <HugeiconsIcon
                        icon={ArrowDown01Icon}
                        size={18}
                        className={`text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                      />
                    </button>

                    {isOpen && (
                      <ul className="pb-4 space-y-3">
                        {column.links.map((link) => (
                          <li key={link.label}>
                            <a
                              href={link.href}
                              className="block text-sm text-muted transition-colors hover:text-main"
                              onClick={closeMenu}
                            >
                              {link.label}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-3 px-[5%] py-6 border-t border-line">
            <Link
              to="/login"
              className="btn bg-secondary border border-line min-h-10 flex-1 px-4 text-sm text-center text-nowrap"
              onClick={closeMenu}
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-primary btn min-h-10 flex-1 px-4 text-sm text-center text-nowrap"
              onClick={closeMenu}
            >
              Sign Up
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
