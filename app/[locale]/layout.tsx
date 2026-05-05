import "@/app/globals.css";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

// 1. GENERATE METADATA
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;

  const titles: Record<string, string> = {
    en: "Better Technologies - Global Operations",
    es: "Better Technologies - Operaciones Globales",
  };

  return {
    title: titles[locale] || titles.en,
    description: locale === "es" 
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
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    
    <html lang={locale} className="scroll-smooth" data-scroll-behavior="smooth">
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}