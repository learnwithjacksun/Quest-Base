import { HugeiconsIcon } from "@hugeicons/react";
import type { ServiceCardData } from "./services-data";

type ServiceCardProps = {
  service: ServiceCardData;
};

export default function ServiceCard({ service }: ServiceCardProps) {
  const { title, description, icon, Illustration, colSpan } = service;

  return (
    <article
      className={`group flex flex-col rounded-lg border border-line bg-secondary overflow-hidden transition-colors hover:border-accent/30 ${
        colSpan === 2 ? "md:col-span-2 lg:col-span-2" : ""
      }`}
    >
      <div className="p-5 pb-0 space-y-3">
        <div className="flex items-center gap-2">
          <HugeiconsIcon icon={icon} size={18} className="text-accent shrink-0" />
          <h3 className="text-sm font-semibold text-main">{title}</h3>
        </div>
        <p className="text-sm text-muted leading-relaxed">{description}</p>
      </div>

      <div className="relative mt-4 flex-1 min-h-40 flex items-end justify-center px-4 pt-2">
        <div className="w-full max-w-80 h-40">
          <Illustration />
        </div>
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-secondary to-transparent" />
      </div>
    </article>
  );
}
