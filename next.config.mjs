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
redirects: async () => [
  {
    source: '/blog/918a60ad-2d5f-4302-a92a-71cf57f60153',
    destination: '/blog',
    permanent: true,
  }
]
export default withNextIntl(nextConfig);