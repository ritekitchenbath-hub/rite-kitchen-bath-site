import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Rite Kitchen & Bath — Bradenton & Palmetto",
  description: "Cabinetry, refacing, and finishing. Local craft. Clean installs. On time.",
  metadataBase: new URL(siteUrl),
  openGraph: {
    title: "Rite Kitchen & Bath — Bradenton & Palmetto",
    description: "Cabinetry, refacing, and finishing. Local craft. Clean installs. On time.",
    url: siteUrl,
    siteName: "Rite Kitchen & Bath",
    images: [
      {
        url: "/og.jpg",
        width: 1200,
        height: 630,
        alt: "Rite Kitchen & Bath",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      {/* wood-grain base + ink text; keep flex layout exactly as-is */}
      <body className="min-h-screen flex flex-col wood-grain text-ink-900 font-sans">
        <Header />
        <main className="flex-1">{children}</main>
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

        {/* reCAPTCHA v2 loader (only if site key is present) */}
        {process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY ? (
          <script async defer src="https://www.google.com/recaptcha/api.js"></script>
        ) : null}
      </body>
    </html>
  );
}
