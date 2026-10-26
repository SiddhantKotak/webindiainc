import { SectionHeader } from "@/components/ui/section-header";
import { services, servicesHeading, servicesIntro } from "@/content/services";
import { ServicesTrack } from "./services/service-track";

// "Our Digital Marketing Services": the last word takes the accent face. The words stay verbatim.
const headingWords = servicesHeading.split(" ");
const headingLead = headingWords.slice(0, -1).join(" ");
const headingAccent = headingWords[headingWords.length - 1];

/** Services, pattern D: one team, one thread through every channel. */
export function ServicesSection() {
  return (
    <section id="services" className="relative bg-paper text-ink">
      <ServicesTrack
        services={services}
        header={
          <SectionHeader
            align="left"
            eyebrow="Services"
            title={
              <>
                {headingLead} <span className="font-accent italic">{headingAccent}</span>
              </>
            }
            intro={<p className="text-base leading-relaxed sm:text-lg sm:leading-snug">{servicesIntro}</p>}
          />
        }
      />
    </section>
  );
}
