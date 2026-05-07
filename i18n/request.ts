import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';

export default getRequestConfig(async ({ locale }): Promise<any> => {
  const targetLocale = (locale && routing.locales.includes(locale as any)) 
    ? locale 
    : routing.defaultLocale;

  const messages = (await import(`../messages/${targetLocale}.json`)).default;

  return {
    locale: targetLocale,
    messages: messages
  };
});