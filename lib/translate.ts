import translate from 'google-translate-api-x'
import fs from 'fs'
import path from 'path'

// En Vercel el único directorio escribible es /tmp
const CACHE_FILE = process.env.NODE_ENV === 'production'
  ? '/tmp/translation-cache.json'
  : path.join(process.cwd(), 'translation-cache.json')

const CACHE_TTL = 1000 * 60 * 60

function loadCache(): Record<string, { text: string; timestamp: number }> {
  try {
    if (fs.existsSync(CACHE_FILE)) {
      return JSON.parse(fs.readFileSync(CACHE_FILE, 'utf-8'))
    }
  } catch {}
  return {}
}

function saveCache(cache: Record<string, { text: string; timestamp: number }>) {
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(cache), 'utf-8')
  } catch {}
}

// Cache en memoria (dura mientras viva la instancia)
let cache = loadCache()

async function translateWithCache(text: string, to: string): Promise<string> {
  if (!text || text.trim() === '') return text
  const key = `${to}:${text.slice(0, 100)}`
  const cached = cache[key]
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) return cached.text

  try {
    const result = await translate(text, { to, forceBatch: false })
    cache[key] = { text: result.text, timestamp: Date.now() }
    saveCache(cache)
    return result.text
  } catch {
    return text
  }
}

async function translateHtml(html: string, to: string): Promise<string> {
  const placeholders: string[] = []

  let protected_html = html.replace(/<img[^>]*>/gi, (match) => {
    const idx = placeholders.length
    placeholders.push(match)
    return `%%IMG${idx}%%`
  })

  const parts = protected_html.split(/(<[^>]+>)/)
  const translatedParts = await Promise.all(
    parts.map(async (part) => {
      if (part.startsWith('<') || part.trim() === '') return part
      const clean = part.replace(/&nbsp;/g, ' ').trim()
      if (!clean) return part
      if (clean.length > 800) {
        const chunks = clean.match(/.{1,800}/g) || [clean]
        const translated = await Promise.all(chunks.map(c => translateWithCache(c, to)))
        return translated.join('')
      }
      return translateWithCache(clean, to)
    })
  )

  let result = translatedParts.join('')
  placeholders.forEach((ph, idx) => {
    result = result.replace(`%%IMG${idx}%%`, ph)
  })
  return result
}

export async function translatePosts(posts: any[], full = false) {
  return Promise.all(
    posts.map(async (post) => {
      const title = await translateWithCache(post.title, 'es')
      let description: string
      if (full) {
        description = await translateHtml(post.description || '', 'es')
      } else {
        const plain = post.description.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 500)
        description = await translateWithCache(plain, 'es')
      }
      return { ...post, title, description }
    })
  )
}