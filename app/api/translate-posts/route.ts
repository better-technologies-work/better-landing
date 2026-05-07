import { NextRequest, NextResponse } from 'next/server'
import { translatePosts } from '@/lib/translate'

export async function POST(req: NextRequest) {
  const { posts, full } = await req.json()
  const translated = await translatePosts(posts, full)
  return NextResponse.json(translated)
}