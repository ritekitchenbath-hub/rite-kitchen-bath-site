import "./globals.css";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { siteUrl } from "@/lib/site";
import { business, localBusinessJsonLd, JsonLd } from "@/lib/business";
import { hubspotPortalId } from "@/lib/hubspot";

const defaultTitle = "Rite Kitchen & Bath | Cabinet Refacing & Custom Cabinetry | Bradenton, Sarasota, St. Pete";
const defaultDescription =
  "Cabinet refacing, refinishing, custom cabinetry, and bathroom vanities for Bradenton, Sarasota, St. Petersburg, and Parrish, FL. Licensed & insured. Free in-home consultations.";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: { default: defaultTitle, template: "%s | " + business.name },
  description: defaultDescription,
  openGraph: {
    title: defaultTitle,
    description: defaultDescription,
    url: siteUrl,
    siteName: business.name,
    images: [{ url: "/og.jpg", width: 1200, height: 630, alt: "White shaker kitchen cabinets by Rite Kitchen & Bath" }],
    locale: "en_US",
    type: "website",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const hsPortal = hubspotPortalId();

  return (
    <html lang="en">
      {/* wood-grain base + ink text; keep flex layout exactly as-is */}
      <body className="min-h-screen flex flex-col wood-grain text-ink-900 font-sans">
        <JsonLd data={localBusinessJsonLd()} />
        <Header />
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <Footer />
        <StickyCTA />

        {/* Google Analytics loader */}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <script
            async
            src={
              "https://www.googletagmanager.com/gtag/js?id=" +
              process.env.NEXT_PUBLIC_GA_ID
            }
          ></script>
        ) : null}
        {process.env.NEXT_PUBLIC_GA_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html:
                "window.dataLayer = window.dataLayer || [];\n" +
                "function gtag(){dataLayer.push(arguments);} \n" +
                "gtag('js', new Date());\n" +
                "gtag('config', '" +
                process.env.NEXT_PUBLIC_GA_ID +
                "');\n",
            }}
          />
        ) : null}

        {/* Classic HubSpot snippet so their URL checker can see it in page source.
            next/script afterInteractive only injects after JS, which fails HubSpot's crawler. */}
        {hsPortal ? (
          <script
            type="text/javascript"
            id="hs-script-loader"
            async
            defer
            src={"https://js.hs-scripts.com/" + hsPortal + ".js"}
          />
        ) : null}
      </body>
    </html>
  );
}
