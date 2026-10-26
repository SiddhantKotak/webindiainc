import { assets } from "@/content/assets";
import { ctas, sectionNav, siteLinks } from "@/content/site";
import { HeaderClient } from "./header/header-client";
import { IntroStyles } from "./hero/intro-styles";

// The live logo's lettering is white (made for dark backgrounds); the header uses the navy-lettering
// version generated from it (scripts/make-logo-ink.mjs) and the coloured "W" mark once collapsed.

/** Fixed header: the WebIndia logo (collapsing to its "W" mark on scroll), CTA, and section drawer. */
export function SiteHeader() {
  return (
    <>
      <IntroStyles />
      <HeaderClient
        name={assets.logo?.alt ?? "WebIndia Inc"}
        logo={assets.logoInk!}
        mark={assets.logoMark!}
        cta={ctas.header}
        sections={sectionNav}
        links={siteLinks}
        illustration={assets.illustration.menu}
      />
    </>
  );
}
