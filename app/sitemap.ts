import { MetadataRoute } from 'next'
import { createClient } from '@/utils/supabase/server'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient()
    const siteUrl = 'https://omervision.com' // Canlı alan adınız

    // Statik sayfalar
    const routes = [
        {
            url: `${siteUrl}`,
            lastModified: new Date(),
            changeFrequency: 'weekly' as const,
            priority: 1,
        },
        {
            url: `${siteUrl}/blog`,
            lastModified: new Date(),
            changeFrequency: 'daily' as const,
            priority: 0.8,
        },
    ]

    // Dinamik Blog Yazıları
    const { data: posts } = await supabase
        .from('posts')
        .select('slug, updated_at')
        .eq('published', true)

    const postRoutes = (posts || []).map((post) => ({
        url: `${siteUrl}/blog/${post.slug}`,
        lastModified: new Date(post.updated_at),
        changeFrequency: 'weekly' as const,
        priority: 0.7,
    }))

    return [...routes, ...postRoutes]
}
