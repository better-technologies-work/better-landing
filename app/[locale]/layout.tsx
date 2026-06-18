import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  const defaultTitle = locale === "es" 
    ? "Better Technologies - Operaciones Globales" 
    : "Better Technologies - Global Operations";

  const description = locale === "es"
    ? "Operamos en LATAM para empresas globales"
    : "We operate LATAM for Global companies";

  return {
    title: {
      default: defaultTitle,
      template: "%s | Better Technologies",
    },
    description,
    icons: {
      icon: "/favicon.jpeg",
      apple: "/favicon.jpeg",
    },
    openGraph: {
      title: defaultTitle,
      description,
      url: "https://www.better-technologies.com",
      siteName: "Better Technologies",
      images: [
        {
          url: "https://www.better-technologies.com/logo.png",
          width: 1200,
          height: 630,
          alt: "Better Technologies Logo",
        },
      ],
      locale: locale === "es" ? "es_ES" : "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: defaultTitle,
      description,
      images: ["https://www.better-technologies.com/logo.png"],
    },
  };
}

export function generateStaticParams() {
  return [{ locale: "en" }, { locale: "es" }];
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
        <meta name="google-site-verification" content="J7VCxn6EbL_NSAY-uf38AMFBYwIUmpiGW_SGCjZ34Xg" />
        <Script id="organization-schema" type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Better Technologies",
            "url": "https://www.better-technologies.com",
            "logo": "https://www.better-technologies.com/logo.png",
            "description": "We operate LATAM for Global companies",
            "sameAs": [
              "https://www.linkedin.com/company/bettertechnologies/",
              "https://www.instagram.com/better.technologies"
            ]
          }`}
        </Script>
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="google-analytics" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}');
              `}
            </Script>
          </>
        )}
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}