import Image from "next/image";
import { Container } from "@/components/ui/container";
import { assets } from "@/content/assets";
import { contact, copyright, footerLabels, footerLinks, footerTagline, socials } from "@/content/site";
import { FooterSignature } from "./footer/footer-signature";

const groupLabel = "text-xs font-semibold uppercase tracking-[0.12em] text-white/60";
// 44px tap targets for touch; a tighter rhythm only where the pointer is precise (a mouse at
// 1024 px wide is not the same as a tablet at 1024 px wide).
const footerLink =
  "inline-flex min-h-11 items-center text-sm underline-offset-4 transition-colors hover:text-accent hover:underline pointer-fine:min-h-0 pointer-fine:py-1.5";

// The copyright line is verbatim; the year is wrapped so the signature line can end above it.
const [copyrightLead, copyrightYear, copyrightTail] = (() => {
  const match = /\d{4}/.exec(copyright);
  if (!match) return [copyright, "", ""];
  return [copyright.slice(0, match.index), match[0], copyright.slice(match.index + 4)];
})();

function LinkGroup({ id, label, links }: { id: string; label: string; links: { label: string; href: string }[] }) {
  return (
    <nav aria-labelledby={id}>
      <h2 id={id} className={groupLabel}>
        {label}
      </h2>
      <ul className="mt-3 flex flex-col pointer-fine:mt-5">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className={footerLink}>
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/**
 * Footer on the closing panel's navy. Columns: two on phones (the link lists side by side),
 * three from `md` with the brand on its own row, four only from `xl` where the long labels and
 * the address fit on one or two lines. It ends with the page's last line (FooterSignature).
 */
export function SiteFooter() {
  const logo = assets.logoWhite;

  return (
    <footer className="border-t border-white/15 bg-ink text-white">
      <Container className="grid grid-cols-2 gap-x-6 gap-y-10 pb-10 pt-14 md:grid-cols-3 md:gap-x-10 lg:pt-20 xl:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,0.8fr)_minmax(0,1.2fr)]">
        <div className="col-span-2 flex flex-col gap-5 md:col-span-3 md:flex-row md:items-start md:justify-between md:gap-10 xl:col-span-1 xl:flex-col xl:justify-start xl:gap-6">
          {logo ? (
            <Image src={logo.src} alt={logo.alt} width={logo.width} height={logo.height} className="h-9 w-auto self-start" />
          ) : (
            <p className="text-2xl font-semibold tracking-tight">WebIndia Inc</p>
          )}
          <p className="max-w-[46ch] text-sm leading-relaxed text-white/75 xl:max-w-[40ch]">{footerTagline}</p>
        </div>

        <LinkGroup id="footer-important" label={footerLabels.important} links={footerLinks.important} />
        <LinkGroup id="footer-useful" label={footerLabels.useful} links={footerLinks.useful} />

        <div className="col-span-2 md:col-span-1">
          <h2 className={groupLabel}>{footerLabels.contact}</h2>
          <address className="mt-3 flex flex-col items-start gap-1 not-italic pointer-fine:mt-5 pointer-fine:gap-2">
            <a href={`mailto:${contact.email}`} className={footerLink}>
              {contact.email}
            </a>
            <a
              href={contact.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 text-sm leading-relaxed text-white/80 underline-offset-4 transition-colors hover:text-accent hover:underline pointer-fine:py-1.5"
            >
              {contact.address.map((line) => (
                <span key={line} className="block">
                  {line}
                </span>
              ))}
            </a>
            <a href={contact.paymentUrl} className={footerLink}>
              {footerLabels.payment}
            </a>
          </address>
          <ul className="mt-4 flex flex-wrap gap-2">
            {socials.map((social) => (
              <li key={social.href}>
                <a
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex min-h-11 items-center rounded-card border border-white/40 px-3.5 text-sm transition-colors hover:border-white hover:bg-white hover:text-ink pointer-fine:min-h-9"
                >
                  {social.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </Container>

      <div className="relative border-t border-white/15">
        <FooterSignature />
        <Container className="flex flex-col gap-3 py-7 text-sm text-white/70 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:py-8">
          <p className="sm:order-last sm:text-right">
            {copyrightLead}
            <span data-footer-year>{copyrightYear}</span>
            {copyrightTail}
          </p>
          <ul className="flex flex-wrap gap-x-6">
            {footerLinks.legal.map((link) => (
              <li key={link.href}>
                <a href={link.href} className={footerLink}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </div>
    </footer>
  );
}
