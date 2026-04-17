import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Missing Supabase environment variables:', { 
      url: !!supabaseUrl, 
      key: !!supabaseAnonKey 
    })
    throw new Error('Supabase configuration missing')
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}