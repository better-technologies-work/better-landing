import { createBrowserClient } from '@supabase/ssr';

// Esto evita que TypeScript se queje de la variable global
const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createBrowserClient> | undefined;
};

export const createClient = () => {
  // En el servidor siempre creamos uno nuevo
  if (typeof window === 'undefined') {
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  // En el navegador, usamos la global para que sobreviva a recargas de Next.js
  if (!globalForSupabase.supabase) {
    globalForSupabase.supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
  }

  return globalForSupabase.supabase;
};