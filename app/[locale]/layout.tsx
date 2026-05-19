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

  const titles: Record<string, string> = {
    en: "Better Technologies - Global Operations",
    es: "Better Technologies - Operaciones Globales",
  };

  const descriptions: Record<string, string> = {
    en: "We operate LATAM for Global companies",
    es: "Operamos en LATAM para empresas globales",
  };

  return {
    title: titles[locale] || titles.en,
    description: descriptions[locale] || descriptions.en,
    // Aquí le decimos a Next.js que maneje tu logo de forma oficial
    icons: {
      icon: "/logo.png", 
      apple: "/logo.png", // Opcional, para dispositivos Apple
    },
    openGraph: {
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      url: "https://better-technologies.com",
      siteName: "Better Technologies",
      images: [
        {
          url: "https://better-technologies.com/logo.png",
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
      title: titles[locale] || titles.en,
      description: descriptions[locale] || descriptions.en,
      images: ["https://better-technologies.com/logo.png"],
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        
        {/* PASO EXTRA: Pega aquí la etiqueta que te dé Google Search Console */}
        {/* Elige el método "Etiqueta HTML" en Search Console y copia solo el contenido de 'content' */}
        <meta name="google-site-verification" content="google-site-verification=J7VCxn6EbL_NSAY-uf38AMFBYwIUmpiGW_SGCjZ34Xg" />

        <Script id="organization-schema" type="application/ld+json">
          {`{
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Better Technologies",
            "url": "https://better-technologies.com",
            "logo": "https://better-technologies.com/logo.png",
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