'use client';

export default function GoogleAnalytics() {
  // Tu ID de Google Analytics 4
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  if (!gaId) {
    console.warn('Google Analytics ID no está configurado');
    return null;
  }

  return (
    <>
      {/* Google tag (gtag.js) */}
      <script
        async
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      ></script>
      <script>
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}');
        `}
      </script>
    </>
  );
}