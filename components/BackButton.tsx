'use client'

export default function BackButton({ esText, enText, className, locale }: { esText: string, enText: string, className?: string, locale: string }) {
  
  // En lugar de window.history.back, vamos a redirigir a una URL clara.
  // Esto elimina el problema de la carga infinita.
  const targetUrl = locale === 'en' ? '/blog' : `/${locale}/blog`;

  return (
    <a 
      href={targetUrl}
      className={className}
      // Usamos el evento solo para asegurar que no haya comportamientos raros
    >
      {locale === 'es' ? `← ${esText}` : `← ${enText}`}
    </a>
  )
}