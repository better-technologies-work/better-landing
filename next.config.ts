/** @type {import('next').NextConfig} */
const nextConfig = {
  // Se comenta o elimina porque Next.js 15+ ya no acepta esta clave aquí
  /*
  eslint: {
    ignoreDuringBuilds: true,
  },
  */
  
  typescript: {
    // Mantenemos esto para que el despliegue no falle por tipos estrictos
    ignoreBuildErrors: true,
  },

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.bbci.co.uk' },
      { protocol: 'https', hostname: '**.cnn.com' },
      { protocol: 'https', hostname: '**.reuters.com' },
      { protocol: 'https', hostname: '**.static.bbc.co.uk' },
      { protocol: 'https', hostname: '**.supabase.co' },
    ],
  },
};

export default nextConfig;