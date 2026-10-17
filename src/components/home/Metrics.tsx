import { metrics } from "@/data/metrics";
import { partners } from "@/data/partners";
import { LogoMarquee } from "../blocks/LogoMarquee";
import { StatCard } from "../blocks/StatCard";

export function Metrics() {
  return (
    <section aria-labelledby="metrics-title" className="pb-24 md:pb-32">
      <h2 id="metrics-title" className="sr-only">
        Platform figures
      </h2>
      <div className="border-y border-rule">
        <div className="container-page grid grid-cols-2 lg:grid-cols-4">
          {metrics.map((m, i) => (
            <StatCard
              key={m.id}
              label={m.label}
              value={m.value}
              format={m.format}
              caption={m.caption}
              className={[
                "py-8 lg:py-10",
                i % 2 === 1 ? "border-l border-rule pl-5 sm:pl-8" : "pr-5",
                i >= 2 ? "border-t border-rule lg:border-t-0" : "",
                i === 2 ? "lg:border-l lg:pl-8" : "",
                i > 0 ? "lg:pl-8" : "",
              ].join(" ")}
            />
          ))}
        </div>
      </div>
      <div className="container-page mt-4 flex justify-end">
        <p className="text-caption text-muted">Demo data for the prototype.</p>
      </div>
      <div className="mt-16 flex flex-col gap-6 md:mt-20">
        <p className="container-page text-small text-muted">Infrastructure partners (placeholders)</p>
        <LogoMarquee partners={partners} label="Infrastructure partners" />
      </div>
    </section>
  );
}
