import { createClient as createSupabaseClient, SupabaseClient } from '@supabase/supabase-js'

// Variable fuera de la función para persistir la instancia
let supabaseInstance: SupabaseClient | null = null

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase configuration missing')
  }

  // 1. Si ya existe una instancia (en el cliente), devuélvela
  if (supabaseInstance) return supabaseInstance

  // 2. Si no existe, créala
  const client = createSupabaseClient(supabaseUrl, supabaseAnonKey)

  // 3. Si estamos en el navegador (client-side), guárdala en la variable
  if (typeof window !== 'undefined') {
    supabaseInstance = client
  }

  return client
}