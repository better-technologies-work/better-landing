import translate from 'google-translate-api-x'
import fs from 'fs'
import path from 'path'

// Configuración del archivo de cache (compatible con el sistema de archivos temporal de Vercel)
const CACHE_FILE = process.env.NODE_ENV === 'production'
  ? '/tmp/translation-cache.json'
  : path.join(process.cwd(), 'translation-cache.json')

const CACHE_TTL = 1000 * 60 * 60 // 1 hora de validez

/**
 * Carga el cache desde el sistema de archivos
 */
function loadCache(): Record<string, { text: string; timestamp: number }> {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
    }
  } catch (err) {
    console.error("Error loading cache:", err)
  }
  return {}
}

/**
 * Persiste el cache en el sistema de archivos
 */
function saveCache(cache: Record<string, { text: string; timestamp: number }>) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf-8')
  } catch (err) {
    // En entornos serverless a veces falla la escritura si no es /tmp
    console.warn("Could not save cache file:", err)
  }
}

// Inicialización del cache en memoria
let cache = loadCache()

/**
 * Traduce un texto simple utilizando cache para optimizar costos/tiempo
 */
async function translateWithCache(text: string, to: string): Promise<string> {
  if (!text || text.trim() === '') return text
  
  // La llave incluye el idioma destino para evitar colisiones entre traducciones
  const key = `${to}:${text.slice(0, 100)}`
  const cached = cache[key]
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.text
  }

  try {
    const result = await translate(text, { to, forceBatch: false })
    cache[key] = { text: result.text, timestamp: Date.now() }
    saveCache(cache)
    return result.text
  } catch (error) {
    console.error(`Translation error for [${to}]:`, error)
    return text // Fallback al texto original si falla la API
  }
}

/**
 * Protege etiquetas HTML y traduce solo el contenido textual
 */
async function translateHtml(html: string, to: string): Promise<string> {
  const placeholders: string[] = []

  // Protegemos etiquetas de imagen para que no sean alteradas
  let protected_html = html.replace(/<img[^>]*>/gi, (match) => {
    const idx = placeholders.length
    placeholders.push(match)
    return `%%IMG${idx}%%`
  })

  // Dividimos el HTML en partes: etiquetas y contenido de texto
  const parts = protected_html.split(/(<[^>]+>)/)
  const translatedParts = await Promise.all(
    parts.map(async (part) => {
      // Si es una etiqueta HTML o está vacío, no lo traducimos
      if (part.startsWith('<') || part.trim() === '') return part
      
      const clean = part.replace(/&nbsp;/g, ' ').trim()
      if (!clean) return part

      // Fragmentación para textos extremadamente largos (evita límites de la API)
      if (clean.length > 800) {
        const chunks = clean.match(/.{1,800}/g) || [clean]
        const translated = await Promise.all(chunks.map(c => translateWithCache(c, to)))
        return translated.join('')
      }
      
      return translateWithCache(clean, to)
    })
  )

  let result = translatedParts.join('')
  
  // Restauramos las imágenes protegidas
  placeholders.forEach((ph, idx) => {
    result = result.replace(`%%IMG${idx}%%`, ph)
  })
  
  return result
}

/**
 * Función principal para traducir un array de posts de Supabase
 * @param posts - Lista de posts originales (usualmente en inglés)
 * @param full - Si es true, traduce el HTML completo; si es false, solo texto plano
 * @param targetLocale - Idioma destino ('es', 'de', 'pt', etc.)
 */
export async function translatePosts(posts: any[], full = false, targetLocale = 'es') {
  // Si el idioma es inglés, devolvemos los posts tal cual (asumiendo que vienen de Supabase en inglés)
  if (targetLocale === 'en') return posts

  return Promise.all(
    posts.map(async (post) => {
      const title = await translateWithCache(post.title, targetLocale)
      
      let description: string
      if (full) {
        description = await translateHtml(post.description || '', targetLocale)
      } else {
        // Para la vista de grilla: quitamos HTML, limpiamos espacios y limitamos a 500 chars
        const plain = (post.description || '')
          .replace(/<[^>]*>/g, ' ')
          .replace(/\s+/g, ' ')
          .trim()
          .slice(0, 500)
        
        description = await translateWithCache(plain, targetLocale)
      }
      
      return { 
        ...post, 
        title, 
        description 
      }
    })
  )
}