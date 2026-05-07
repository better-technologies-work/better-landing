import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';

export const routing = defineRouting({
  // 1. Aquí registramos todos tus idiomas
  locales: ['en', 'es', 'de', 'pt'],
  
  // 2. Forzamos que el inglés sea el original/default
  defaultLocale: 'en',

  // 3. Importante: Desactiva la detección automática para que 
  // no se abra en español o alemán solo porque el usuario esté allí.
  localeDetection: false,

  // Opcional: 'as-needed' oculta el /en/ de la URL si es el default. 
  // 'always' lo muestra siempre (ej. /en/blog).
  localePrefix: 'as-needed' 
});

// Exportamos estas funciones para usarlas en tus componentes en lugar de las de 'next/navigation'
export const {Link, redirect, usePathname, useRouter, getPathname} =
  createNavigation(routing);