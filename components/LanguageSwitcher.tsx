'use client';

import { usePathname, useRouter } from 'next/navigation';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLanguageChange = (newLocale: string) => {
    // Si el pathname es "/es/proyectos", lo cambiamos a "/en/proyectos"
    const segments = pathname.split('/');
    segments[1] = newLocale; 
    const newPath = segments.join('/') || '/';
    router.push(newPath);
  };

  return (
    <div className="flex gap-2 p-4">
      <button 
        onClick={() => handleLanguageChange('en')}
        className="px-3 py-1 rounded border hover:bg-gray-100 transition-colors"
      >
        English
      </button>
      <button 
        onClick={() => handleLanguageChange('es')}
        className="px-3 py-1 rounded border hover:bg-gray-100 transition-colors"
      >
        Español
      </button>
    </div>
  );
}