import createNextIntlPlugin from 'next-intl/plugin';


// next.config.mjs
const withNextIntl = createNextIntlPlugin(
  './i18n/request.ts' 
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: ['192.168.0.9'],
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      
    ],
  },
};

export default withNextIntl(nextConfig);