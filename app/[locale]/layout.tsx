import "@/app/globals.css";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
//import Script from "next/script";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;

  const titles: Record<string, string> = {
    en: "Better Technologies - Global Operations",
    es: "Better Technologies - Operaciones Globales",
  };

  return {
    title: titles[locale] || titles.en,
    description:
      locale === "es"
        ? "Operamos en LATAM para empresas globales"
        : "We operate LATAM for Global companies",
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
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <head>
  <meta charSet="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  
</head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}