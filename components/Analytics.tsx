import Script from 'next/link' // Veya next/script

export default function Analytics() {
    // Canlı (Production) modunda değilse analitik çalıştırma
    if (process.env.NODE_ENV !== 'production') {
        return null
    }

    // Örnek bir Google Analytics veya Umami yapısı
    return (
        <>
            {/* 
        Bu alan ileride gerçek bir Analytics Script'i için ayrılmıştır. 
        Örn Vercel Analytics paketini de <Analytics /> olarak buraya ekleyebilirsiniz.
      */}
            {process.env.NEXT_PUBLIC_GA_ID && (
                <script
                    dangerouslySetInnerHTML={{
                        __html: `
              console.log('Analytics loaded');
            `,
                    }}
                />
            )}
        </>
    )
}
