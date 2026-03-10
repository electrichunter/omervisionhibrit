import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { createClient } from '@/utils/supabase/server'
import MarkdownRenderer from '@/components/MarkdownRenderer'
import Comments from '@/components/Comments'

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

    return (
        <article className="mx-auto max-w-3xl space-y-8">
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

            <Comments postId={post.id} slug={slug} initialComments={comments || []} />
        </article>
    )
}
