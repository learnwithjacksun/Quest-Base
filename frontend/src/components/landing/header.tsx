import { Link } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { Github01Icon, Menu09Icon } from "@hugeicons/core-free-icons";

export default function Header() {
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
            <button className="cursor-pointer lg:hidden">
              <HugeiconsIcon icon={Menu09Icon} size={24} />
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
    </>
  );
}
