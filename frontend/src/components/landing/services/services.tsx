import ServiceCard from "./service-card";
import { services } from "./services-data";

export default function Services() {
  return (
    <section className="py-20 lg:py-24">
      <div className="mb-10 space-y-2">
        <p className="text-sm text-accent font-medium">Services</p>
        <h2 className="text-2xl lg:text-3xl font-semibold text-main">
          Everything you need to ship
        </h2>
        <p className="text-muted text-sm max-w-xl">
          Backend primitives for forms, verification, and waitlists — ready to
          plug into your product.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 auto-rows-fr">
        {services.map((service) => (
          <ServiceCard key={service.id} service={service} />
        ))}
      </div>
    </section>
  );
}
