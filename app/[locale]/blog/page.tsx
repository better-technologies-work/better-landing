'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import Header from '../../../components/Header'
import { usePathname } from 'next/navigation'

type BlogPost = {
  id: string
  title: string
  description: string
  post_url: string
  cover_url?: string
  category: string
  slug: string
  published_at: string
}

export default function BlogPage() {
  const pathname = usePathname()
  
  // 1. Detectar el idioma actual desde la URL (en, es, de, pt)
  const localePrefix = pathname.match(/^\/(en|es|de|pt)(?=\/|$)/)?.[1]
  const locale = localePrefix || 'en'
  const localeBase = locale === 'en' ? '' : `/${locale}`
  
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Diccionario de textos de la interfaz con soporte para 4 idiomas
  const ui = {
    loading: { en: 'Loading posts...', es: 'Cargando posts...', de: 'Beiträge werden geladen...', pt: 'Carregando posts...' },
    retry: { en: 'Retry', es: 'Reintentar', de: 'Wiederholen', pt: 'Tentar novamente' },
    readMore: { en: 'Read more →', es: 'Leer más →', de: 'Weiterlesen →', pt: 'Ler mais →' },
    noPosts: { en: 'No posts available yet.', es: 'No hay posts todavía.', de: 'Noch keine Beiträge verfügbar.', pt: 'Ainda não há posts disponibles.' },
    insight: { en: 'Better Technologies Insight', es: 'Insights de Better Technologies', de: 'Better Technologies Einblicke', pt: 'Insights da Better Technologies' }
  }

  useEffect(() => {
  const loadPosts = async () => {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError(locale === 'es' ? 'Supabase no está configurado.' : 'Supabase is not configured.')
      setLoading(false)
      return
    }

    try {
      const client = createClient()
      
      // TRAEMOS TODO (Sin filtro de idioma para que la API traduzca lo que encuentre)
      const { data, error: supabaseError } = await client
        .from('blog_posts')
        .select('*')
        .order('published_at', { ascending: false })

      if (supabaseError) throw supabaseError

      let result = data || []

      // Si el idioma no es inglés, enviamos TODO el contenido a traducir "al vuelo"
      if (locale !== 'en' && result.length > 0) {
        try {
          const response = await fetch('/api/translate-posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
              posts: result, 
              targetLocale: locale, 
              full: false // Solo traduce títulos y descripciones para que sea rápido
            })
          });

          if (response.ok) {
            const translated = await response.json();
            result = translated;
          } else {
            console.warn(`Translation API error for ${locale}. Using original.`);
          }
        } catch (err) {
          console.error("Translation fetch failed:", err);
        }
      }

      setPosts(result)
      setError(null)
    } catch (err) {
      console.error('Blog page load error:', err)
      setError(err instanceof Error ? err.message : 'Error loading posts.')
    } finally {
      setLoading(false)
    }
  }

  loadPosts()
}, [locale])
  
  // Pantalla de Carga
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex items-center justify-center pt-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" />
            <p className="text-slate-500">
              {(ui.loading as any)[locale] || ui.loading.en}
            </p>
          </div>
        </div>
      </>
    )
  }

  // Pantalla de Error
  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-slate-50 text-slate-900 font-sans flex items-center justify-center pt-20">
          <div className="text-center px-4">
            <p className="text-red-600 mb-4 font-medium">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-500 transition-all font-bold uppercase text-xs tracking-widest"
            >
              {(ui.retry as any)[locale] || ui.retry.en}
            </button>
          </div>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pt-24 pb-16 px-4 md:px-8">
        <div className="max-w-6xl mx-auto">
          
          {/* Encabezado de la página */}
          <header className="mb-8 md:mb-16 text-center">
            <p className="text-blue-600 uppercase tracking-[0.25em] text-[10px] font-black mb-4">
              {(ui.insight as any)[locale] || ui.insight.en}
            </p>
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter uppercase leading-none">
              Better <em className="italic underline decoration-blue-100">Blog</em>
            </h1>
          </header>

          {/* Grilla de Posts */}
          {posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
              {posts.map((post: BlogPost) => (
                <a
                  key={post.id}
                  href={post.post_url?.startsWith('http') ? post.post_url : `${localeBase}/blog/${post.slug}`}
                  target={post.post_url?.startsWith('http') ? '_blank' : '_self'}
                  rel="noopener noreferrer"
                  className="group border border-slate-200 rounded-2xl md:rounded-3xl overflow-hidden bg-white hover:shadow-2xl transition-all duration-300 flex flex-col"
                >
                  {/* Imagen de portada */}
                  <div className="relative h-40 md:h-56 overflow-hidden bg-slate-100">
                    <img
                      src={post.cover_url || 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800'}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-4 left-4 bg-blue-600 text-white text-[10px] font-black px-2 py-1 rounded-md uppercase">
                      {post.category || 'Global'}
                    </div>
                  </div>

                  {/* Contenido de la tarjeta */}
                  <div className="p-5 md:p-7 flex-1 flex flex-col">
                    <h2 className="text-lg md:text-xl font-bold leading-tight mb-2 md:mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h2>
                    <p
                      className="text-slate-500 text-sm line-clamp-2 md:line-clamp-3 mb-4 md:mb-6 flex-1"
                      dangerouslySetInnerHTML={{ __html: post.description }}
                    />
                    
                    <div className="pt-3 md:pt-4 border-t border-slate-200 flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-500 uppercase">
                        {(ui.readMore as any)[locale] || ui.readMore.en}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(post.published_at).toLocaleDateString(
                          locale === 'es' ? 'es-ES' : 
                          locale === 'de' ? 'de-DE' : 
                          locale === 'pt' ? 'pt-BR' : 'en-US', 
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        )}
                      </span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            /* Estado vacío */
            <div className="py-24 text-center">
              <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
                {(ui.noPosts as any)[locale] || ui.noPosts.en}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  )
}