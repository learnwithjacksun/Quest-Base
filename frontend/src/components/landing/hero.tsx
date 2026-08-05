import { HugeiconsIcon } from "@hugeicons/react";
import { TelegramIcon } from "@hugeicons/core-free-icons";
import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <div className="min-h-125.5 py-16 grid grid-cols-1 lg:grid-cols-2 items-center gap-10 lg:gap-20">
      <div className="space-y-6">
        <h1 className="text-main text-4xl lg:text-5xl relative">
          Build less backend <br />{" "}
          <span className="text-[#17CF97] font-mono">Send to millions</span>
          <HugeiconsIcon
            icon={TelegramIcon}
            size={40}
            className="hero-send-icon absolute bottom-0 right-0 text-[#17CF97]"
          />
        </h1>
        <div className="text-muted lg:hidden space-y-2">
        
          <p>
            With{" "}
              <span className="font-mono dark:text-white text-main">Quest Base</span>, you can collect submissions from your HTML form to your email,
            verify emails and spot spam, and manage waitlists through a single
            API, without standing up your own backend.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <Link
            to="/login"
            className="btn-primary btn min-h-10 px-4 text-sm text-nowrap"
          >
            Start sending
          </Link>
          <Link
            to="/login"
            className="btn bg-secondary border border-line min-h-10 px-4 text-sm text-nowrap"
          >
            Request Demo
          </Link>
        </div>
      </div>

      <div className="lg:-translate-y-8 hidden lg:block">
        <div className="text-muted space-y-2">
          <p>
            We build the important backend stuff for you, so you can focus on
            your product.
          </p>
          <p>
            With <span className="font-mono dark:text-white text-main">Quest Base</span>, you
            can collect submissions from your HTML form to your email, verify
            emails and spot spam, and manage waitlists through a single API,
            without standing up your own backend.
          </p>
        </div>
      </div>
    </div>
  );
}
