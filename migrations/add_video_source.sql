-- Migración: Agregar columna video_source a blog_posts
-- Valores posibles: 'upload' | 'youtube' | 'vimeo' | 'external'
-- Ejecutar en Supabase SQL Editor

ALTER TABLE blog_posts
ADD COLUMN IF NOT EXISTS video_source text DEFAULT NULL;
