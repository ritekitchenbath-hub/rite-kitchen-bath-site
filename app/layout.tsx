import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { siteUrl } from "@/lib/site";

export const metadata = {
  title: "Rite Kitchen & Bath — Bradenton & Palmetto",
  description: "Cabinetry, refacing, and finishing. Local craft. Clean installs. On time.",
  metadataBase: new URL(siteUrl),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <StickyCTA />
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
      </body>
    </html>
  );
}
