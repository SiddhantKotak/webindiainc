import type { Metadata } from "next";
import "lenis/dist/lenis.css";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { yearsOfExperience } from "@/content/stats";
import { fontVariables } from "@/lib/fonts";

// Title and description copied from the live homepage (docs/live-audit/README.md).
const title = "Digital Marketing Agency | WebIndia Inc. - Google Partner";
const description = `Top digital marketing agency with ${yearsOfExperience.value}${yearsOfExperience.suffix} years of experience. We're a Google Premier Partner offering SEO, PPC, web development & proven results worldwide.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://www.webindiainc.com"),
  title,
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", siteName: "WebIndia Inc.", title, description, url: "/" },
  twitter: { card: "summary_large_image", site: "@webindiainc", title, description },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    // suppressHydrationWarning: the inline script below adds `wi-seen` to <html> before hydration.
    <html lang="en" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        {/* The load cover plays once per browser session; later loads skip it (load-cover.tsx). */}
        <script
          dangerouslySetInnerHTML={{
            __html:
              "try{var s=sessionStorage;if(s.getItem('wi-seen'))document.documentElement.classList.add('wi-seen');s.setItem('wi-seen','1')}catch(e){}",
          }}
        />
        {/* Without JavaScript, show content that Motion server-renders in its hidden first frame
            (see the reveal failsafe in globals.css). */}
        <noscript>
          <style>{`:is([style^="opacity:0"],[style*=";opacity:0"],[style*="clip-path:inset("]):not(svg *){opacity:1!important;transform:none!important;clip-path:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-full flex flex-col">
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
