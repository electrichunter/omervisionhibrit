import Image from 'next/image'
import Link from 'next/link'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { createClient } from '@/utils/supabase/server'

export const revalidate = 3600; // 1 saatlik ISR Cache

export default async function BlogListPage() {
    const supabase = await createClient()
    const { data: posts } = await supabase
        .from('posts')
        .select('*')
        .eq('published', true)
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-12 max-w-3xl mx-auto">
            <section className="space-y-4">
                <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">Blog</h1>
                <p className="text-lg text-gray-400">
                    Teknoloji, tasarım ve yazılım geliştirme üzerine düşüncelerimiz, deneyimlerimiz ve rehberlerimiz.
                </p>
            </section>

            <section className="space-y-8">
                {posts?.map((post) => (
                    <article key={post.id} className="group relative flex flex-col sm:flex-row gap-6 border-b border-white/10 pb-8 last:border-0 last:pb-0">
                        {post.cover_image && (
                            <div className="relative sm:w-1/3 aspect-[4/3] w-full shrink-0 overflow-hidden rounded-lg bg-white/5">
                                <Image
                                    src={post.cover_image}
                                    alt={post.title}
                                    fill
                                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                                />
                            </div>
                        )}
                        <div className="flex flex-col justify-center flex-1">
                            <time className="text-sm font-mono text-gray-500 mb-2 block">
                                {format(new Date(post.created_at), 'd MMMM yyyy', { locale: tr })}
                            </time>
                            <h2 className="text-2xl font-semibold mb-3 group-hover:text-[var(--accent)] transition-colors">
                                <Link href={`/blog/${post.slug}`}>
                                    <span className="absolute inset-0 z-10" />
                                    {post.title}
                                </Link>
                            </h2>
                            {/* Extract a short description out of content instead of showing full raw markdown? For now just showing a bit */}
                            <p className="text-gray-400 line-clamp-3 text-sm">
                                {post.content.slice(0, 150)}...
                            </p>
                        </div>
                    </article>
                ))}

                {(!posts || posts.length === 0) && (
                    <p className="text-gray-500">Henüz yayınlanmış bir yazı yok.</p>
                )}
            </section>
        </div>
    )
}
