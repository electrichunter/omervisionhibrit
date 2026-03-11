import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { createClient } from '@/utils/supabase/server'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import Comments from '@/components/Comments'
import NewsletterForm from '@/components/NewsletterForm'
import Script from 'next/script'

export const revalidate = 3600 // 1 saatlik ISR Cache

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params
    const supabase = await createClient()
    const { data: post } = await supabase.from('posts').select('*').eq('slug', slug).single()

    if (!post) return { title: 'Yazı Bulunamadı - ÖmerVision' }

    return {
        title: `${post.title} - ÖmerVision`,
        description: post.content.substring(0, 150) + '...',
        openGraph: {
            title: post.title,
            description: post.content.substring(0, 150) + '...',
            images: post.cover_image ? [post.cover_image] : [],
        },
    }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()

    const { data: post, error } = await supabase
        .from('posts')
        .select('*')
        .eq('slug', slug)
        .single()

    if (error || !post || !post.published) {
        notFound()
    }

    // Yorumları Çekme (Sadece onaylanmış olanları ve yeniden eskiye sırayla)
    const { data: comments } = await supabase
        .from('comments')
        .select('id, author_name, content, created_at')
        .eq('post_id', post.id)
        .eq('approved', true)
        .order('created_at', { ascending: false })

    // JSON-LD Schema (Technical SEO)
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://omervision.com' // Kendi domaininize göre çevredeğişkeninden çekin
    const articleSchema = {
        '@context': 'https://schema.org',
        '@type': 'Article',
        headline: post.title,
        image: post.cover_image ? [post.cover_image] : [],
        datePublished: post.created_at,
        dateModified: post.updated_at || post.created_at,
        author: [{
            '@type': 'Person',
            name: 'Ömer Uysal',
            url: baseUrl
        }],
        description: post.content.substring(0, 150).replace(/\n/g, ' ') + '...'
    }

    return (
        <article className="mx-auto max-w-3xl space-y-8">
            <Script
                id="article-schema"
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
            />

            <header className="space-y-4 text-center">
                <time className="text-sm font-mono text-gray-500 block">
                    {format(new Date(post.created_at), 'd MMMM yyyy', { locale: tr })}
                </time>
                <h1 className="text-3xl font-bold tracking-tight sm:text-5xl">
                    {post.title}
                </h1>
            </header>

            {post.cover_image && (
                <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-white/5">
                    <Image
                        src={post.cover_image}
                        alt={post.title}
                        fill
                        className="object-cover"
                        priority
                    />
                </div>
            )}

            <div className="pt-8">
                <MarkdownRenderer content={post.content} />
            </div>

            <hr className="border-t border-zinc-800/60 my-10" />

            <NewsletterForm />

            <hr className="border-t border-zinc-800/60 my-10" />

            <Comments postId={post.id} slug={slug} initialComments={comments || []} />
        </article>
    )
}
