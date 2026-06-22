'use client'

export default function BackButton({ esText, enText, className, locale }: { esText: string, enText: string, className?: string, locale: string }) {
  
  
  const targetUrl = locale === 'en' ? '/blog' : `/${locale}/blog`;

  return (
    <a 
      href={targetUrl}
      className={className}
      
    >
      {locale === 'es' ? `← ${esText}` : `← ${enText}`}
    </a>
  )
}