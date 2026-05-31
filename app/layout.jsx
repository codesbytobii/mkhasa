import Script from "next/script";
import "../src/index.css";
import AppProviders from "./providers.jsx";

export const metadata = {
  metadataBase: new URL("https://www.mkhasa.com"),
  title: "Buy Original Perfumes in Nigeria | Affordable Luxury Fragrances - Mkhasa",
  description:
    "Shop original perfumes in Nigeria at Mkhasa. Discover long-lasting luxury fragrances for men & women at affordable prices. Fast delivery nationwide.",
  manifest: "/manifest.json",
  openGraph: {
    title: "Buy Original Perfumes in Nigeria | Affordable Luxury Fragrances - Mkhasa",
    description:
      "Shop original perfumes in Nigeria at Mkhasa. Discover long-lasting luxury fragrances for men & women at affordable prices. Fast delivery nationwide.",
    url: "/",
    siteName: "Mkhasa",
    locale: "en_NG",
    type: "website",
    images: [{ url: "/logo.webp" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Buy Original Perfumes in Nigeria | Affordable Luxury Fragrances - Mkhasa",
    description:
      "Shop original perfumes in Nigeria at Mkhasa. Discover long-lasting luxury fragrances for men & women at affordable prices. Fast delivery nationwide.",
    images: ["/logo.webp"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#A40001",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Mkhasa",
  url: "https://www.mkhasa.com",
  logo: "https://www.mkhasa.com/logo.webp",
  sameAs: [
    "https://www.instagram.com/mkhasa",
    "https://twitter.com/Mkhasa_",
  ],
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "Mkhasa",
  url: "https://www.mkhasa.com",
  potentialAction: {
    "@type": "SearchAction",
    target: "https://www.mkhasa.com/search?s={search_term_string}",
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Montserrat:ital,wght@0,100..900;1,100..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
          rel="stylesheet"
        />
        <link href="https://fonts.cdnfonts.com/css/fuzzy-bubbles" rel="stylesheet" />
        <meta
          name="google-site-verification"
          content="OSyfPuS_CncfaBb_OYPItIVbfH1g7daItNnUObpZWVM"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="bg-app-ash-1">
        {/* Accessible crawl links for SEO */}
        <nav aria-label="Primary crawl links" className="sr-only">
          <a href="/">Home</a>
          <a href="/all-products">All products</a>
          <a href="/brands">Brands</a>
          <a href="/product-index/1">Product index</a>
          <a href="/about">About</a>
          <a href="/shipping-returns">Shipping and returns</a>
          <a href="/privacy">Privacy policy</a>
          <a href="/terms">Terms and conditions</a>
        </nav>

        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-N92BX7LQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <AppProviders>{children}</AppProviders>

        <Script async src="https://www.googletagmanager.com/gtag/js?id=AW-17743492659" />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-17743492659');
          `}
        </Script>
        <Script id="twitter-conversion" strategy="afterInteractive">
          {`
            !(function (e, t, n, s, u, a) {
              e.twq ||
                ((s = e.twq = function () {
                  s.exe ? s.exe.apply(s, arguments) : s.queue.push(arguments);
                }),
                (s.version = "1.1"),
                (s.queue = []),
                (u = t.createElement(n)),
                (u.async = !0),
                (u.src = "https://static.ads-twitter.com/uwt.js"),
                (a = t.getElementsByTagName(n)[0]),
                a.parentNode.insertBefore(u, a));
            })(window, document, "script");
            twq("config", "pioaa");
          `}
        </Script>
      </body>
    </html>
  );
}
