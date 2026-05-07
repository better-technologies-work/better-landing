import { NextRequest, NextResponse } from 'next/server'
import { translatePosts } from '@/lib/translate'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { posts, full, targetLocale } = body
    
    // Forzamos a que 'full' sea booleano (!! transforma cualquier valor en true/false)
    const isFullTranslation = !!full 
    const locale = targetLocale || 'es'

    console.log(`Traduciendo a: ${locale} | Modo completo: ${isFullTranslation}`)

    const translated = await translatePosts(posts, isFullTranslation, locale)
    
    return NextResponse.json(translated)
  } catch (error) {
    console.error("API Translation Error:", error)
    return NextResponse.json({ error: "Failed to translate" }, { status: 500 })
  }
}