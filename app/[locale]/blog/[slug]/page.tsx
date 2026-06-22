
import { createClient as createServerClient } from '@/lib/supabase/server'
import { decodeHTML } from '@/lib/utils'
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import { translatePosts } from '@/lib/translate'
import { Metadata } from 'next'
import BackButton from '@/components/BackButton' 
type Link = {
  id: string;
  title: string;
  url: string;
};

type Document = {
  id: string;
  name: string;
  url: string;
  type: string;
};

type BlogPost = {
  id: string
  title: string
  description: string
  content?: string
  post_url: string
  cover_url?: string
  category: string
  slug: string
  published_at: string
  author: string
  links?: Link[]
  documents?: Document[]
}

type Props = {
  params: Promise<{ slug: string; locale: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug, locale } = await params
  
  try {
    const supabase = await createServerClient()
    const { data: post } = await supabase
  .from('blog_posts')
  .select('title, description, excerpt, cover_url, published_at, author')
  .eq('slug', slug)
  .single()

    if (!post) {
      return {
        title: locale === 'es' ? 'Post no encontrado' : 'Post Not Found',
      }
    }

    const baseUrl = 'https://www.better-technologies.com'
    const postUrl = `${baseUrl}${locale === 'en' ? '' : `/${locale}`}/blog/${slug}`
const cleanDescription = post.excerpt?.trim() ||
  post.description
    ?.replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 155) + '...' || ''
    
    return {
      title: post.title,
      description: cleanDescription,
      alternates: {
        canonical: postUrl,
      },
      openGraph: {
        title: post.title,
        description: cleanDescription,
        url: postUrl,
        type: 'article',
        publishedTime: post.published_at,
        authors: [post.author || 'Better Technologies'],
        images: post.cover_url ? [
          {
            url: post.cover_url,
            width: 1200,
            height: 630,
            alt: post.title,
          }
        ] : undefined,
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: cleanDescription,
        images: post.cover_url ? [post.cover_url] : undefined,
      },
    }
  } catch (error) {
    console.error('Error generating metadata:', error)
    return {
      title: 'Better Technologies Blog',
    }
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug, locale } = await params
  const localeBase = locale === 'en' ? '' : `/${locale}`
  const isEs = locale === 'es'
  let post: BlogPost | null = null

  try {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      post = null
    } else {
      post = data
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : isEs ? 'Error inesperado cargando el post.' : 'Unexpected error loading the post.'
    return (
      <main className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center max-w-xl rounded-3xl border border-slate-200 bg-slate-50 p-10 shadow-sm">
          <h1 className="text-4xl font-black text-slate-900 mb-4">{isEs ? 'No se pudo cargar el post' : 'Unable to load post'}</h1>
          <p className="text-slate-600 mb-8">{message}</p>
          <a href={`${localeBase}/blog`} className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
            {isEs ? '← Volver al Blog' : '← Back to Blog'}
          </a>
        </div>
      </main>
    )
  }

  if (!post) {
    return (
      <main className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-black text-slate-900 mb-4">{isEs ? 'Post no encontrado' : 'Post Not Found'}</h1>
          <p className="text-slate-600 mb-8">{isEs ? 'El post que buscas no existe.' : "The post you're looking for doesn't exist."}</p>
          <a href={`${localeBase}/blog`} className="inline-block px-6 py-3 bg-blue-600 text-white rounded-full font-bold hover:bg-blue-700 transition-colors">
            {isEs ? '← Volver al Blog' : '← Back to Blog'}
          </a>
        </div>
      </main>
    )
  }

  
  if (locale !== 'en' && post) {
    try {
      const translatedArray = await translatePosts([post], true, locale)
      
      if (translatedArray && translatedArray.length > 0) {
        const translated = translatedArray[0]
        post = { 
          ...post, 
          title: translated.title, 
          description: translated.description,
          content: translated.content 
        }
      }
    } catch (error) {
      console.error("Error traduciendo el post individual:", error)
    }
  }

  return (
    <main className="min-h-screen bg-white">
      {/* ── HEADER ── */}
      <header className="fixed top-0 left-0 w-full flex justify-between items-center px-4 md:px-24 py-4 md:py-5 z-50 backdrop-blur-md bg-black/90 border-b border-white/10">
        <div className="relative w-[100px] md:w-[140px] h-[30px] md:h-[40px]">
          <Image src="/logo.png" alt="Better Technologies" fill sizes="140px" className="object-contain" priority />
        </div>
        <BackButton 
    locale={locale}
    esText="Volver" 
    enText="Back" 
    className="text-white text-[8px] md:text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition-colors"
  />
</header>

      {/* ── HERO IMAGE ── */}
      <div className="w-full h-[50vh] relative overflow-hidden mt-[72px]">
        {post.cover_url ? (
          <img src={post.cover_url} alt={post.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-slate-100 flex items-center justify-center">
            <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest">{isEs ? 'Sin imagen de portada' : 'No Cover Image'}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
        <div className="absolute top-6 left-6">
          <span className="text-[9px] font-black text-white bg-blue-600 px-3 py-1 rounded-full uppercase tracking-widest shadow-lg">
            {post.category}
          </span>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <article className="max-w-3xl mx-auto px-4 md:px-6 pb-24 -mt-6 md:-mt-8 relative z-10">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{post.author}</span>
          <span className="text-slate-200 font-black">·</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
            {new Date(post.published_at).toLocaleDateString(isEs ? 'es-ES' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none uppercase mb-10">
          {post.title}
        </h1>

        <div className="prose prose-slate max-w-none">
          <div
            className="text-slate-700 text-lg leading-relaxed font-medium
                       [&>p]:mb-6 [&>img]:my-10 [&>img]:rounded-3xl [&>img]:shadow-2xl
                       [&>strong]:text-slate-900 [&>strong]:font-black
                       [&>h2]:text-2xl [&>h2]:font-black [&>h2]:mt-8 [&>h2]:mb-4
                       [&_a]:text-blue-600 [&_a]:underline [&_a:hover]:text-blue-800
                       [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-6 [&_ul]:space-y-2
                       [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-6 [&_ol]:space-y-2
                       [&_li]:text-slate-700"
            dangerouslySetInnerHTML={{ __html: decodeHTML(post.description) }}
          />
        </div>

        {post.content && (
          <div className="prose prose-slate max-w-none mt-8">
            <ReactMarkdown
              components={{
                a: ({ href, children }) => {
                  if (href && href.startsWith('/')) {
                    return <a href={href} className="text-blue-600 hover:underline">{children}</a>
                  }
                  return <a href={href} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{children}</a>
                }
              }}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        )}

        {post.links && post.links.length > 0 && (
          <div className="mt-12 p-4 md:p-6 bg-slate-50 rounded-2xl">
            <h3 className="text-sm font-black uppercase text-slate-900 mb-4 tracking-wider">{isEs ? 'Links relacionados' : 'Related links'}</h3>
            <div className="space-y-3">
              {post.links.map((link) => (
                <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-all group">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  <span className="text-sm font-bold truncate">{link.title}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {post.documents && post.documents.length > 0 && (
          <div className="mt-8 p-4 md:p-6 bg-slate-50 rounded-2xl">
            <h3 className="text-sm font-black uppercase text-slate-900 mb-4 tracking-wider">{isEs ? 'Documentos adjuntos' : 'Attached documents'}</h3>
            <div className="space-y-3">
              {post.documents.map((doc) => (
                <a key={doc.id} href={doc.url} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 bg-white rounded-xl border border-slate-200 hover:border-blue-600 hover:text-blue-600 transition-all group">
                  <svg className="w-5 h-5 text-slate-400 group-hover:text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  <span className="text-sm font-bold truncate">{doc.name}</span>
                  <span className="text-[10px] text-slate-400 uppercase ml-auto hidden md:inline">{doc.type?.split('/')[1] || (isEs ? 'archivo' : 'file')}</span>
                </a>
              ))}
            </div>
          </div>
        )}

        <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
  {/* Reemplazamos el <a> por el componente BackButton */}
  <BackButton 
    locale={locale}
    esText="Todos los posts" 
    enText="All posts" 
    className="text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors"
  />
  
  {/* Mantenemos el enlace al equipo tal cual estaba */}
  <a href={`/${locale}/#about`} className="text-[10px] font-black uppercase tracking-widest text-blue-600 hover:underline">
    {isEs ? 'Conoce al equipo →' : 'Meet the team →'}
  </a>
</div>
      </article>
    </main>
  )
}