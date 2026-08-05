import { Link, Outlet } from "react-router-dom";
import { HugeiconsIcon } from "@hugeicons/react";
import { BookOpen01Icon } from "@hugeicons/core-free-icons";

export default function AuthLayout() {
  return (
    <div className="min-h-dvh flex">
      <div className="w-full lg:max-w-180 flex flex-col border-r border-line">
        <div className="h-16 flex items-center px-8">
          <Link to="/" className="flex items-center gap-2">
            <img src="/logo.svg" alt="Quest Base" className="size-5" />
            <span className="text-lg font-semibold">Quest Base</span>
          </Link>
        </div>

        <div className="flex-1 flex flex-col justify-center px-8 py-10">
          <Outlet />
        </div>
      </div>

      <div className="hidden lg:flex flex-1 flex-col bg-secondary/40">
        <div className="h-16 flex items-center justify-end px-8">
          <a
            href="#"
            className="btn bg-secondary border border-line min-h-8 px-3 text-sm gap-1.5"
          >
            <HugeiconsIcon icon={BookOpen01Icon} size={15} />
            Documentation
          </a>
        </div>

        <div className="flex-1 flex items-center justify-center px-16">
          <figure className="max-w-xl relative">
            <span
              aria-hidden="true"
              className="absolute -top-10 -left-8 text-8xl font-serif text-foreground select-none"
            >
              &ldquo;
            </span>
            <blockquote className="text-2xl font-medium text-main leading-relaxed">
              Quest Base handled our forms, OTPs, and waitlist so we shipped
              our launch in days instead of weeks. It's become our default
              backend for every new product.
            </blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
             <div className="size-10 overflow-hidden"><img src="/avatar.jpeg" alt="Avatar" className="size-full rounded-full object-cover" /></div>
              <span className="text-sm text-muted">@codewithjacksun</span>
            </figcaption>
          </figure>
        </div>
      </div>
    </div>
  );
}
