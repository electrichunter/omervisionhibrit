import Image from 'next/image'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export const revalidate = 3600; // 1 saatlik ISR Cache

export default async function PortfolioPage() {
    const supabase = await createClient()
    const { data: projects } = await supabase
        .from('projects')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: false })

    const { data: posts } = await supabase
        .from('posts')
        .select('id, title, slug, content, created_at, cover_image')
        .eq('published', true)
        .order('created_at', { ascending: false })
        .limit(3) // Sadece en yeni 3 yazıyı getir

    return (
        <div className="space-y-24">
            {/* 1. Hero Bölümü */}
            <section className="relative flex flex-col items-center justify-center text-center py-20">
                <div className="absolute inset-0 max-w-3xl mx-auto -z-10 bg-blue-600/20 blur-[120px] rounded-full"></div>
                <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl mb-6 text-slate-100">
                    Görünmeyeni <span className="text-blue-500">Görünür</span> Kılın
                </h1>
                <p className="max-w-2xl text-lg sm:text-xl text-slate-300 mb-10">
                    ÖmerVision olarak dijital dünyadaki vizyonunuzu en iyi şekilde yansıtacak çözümler üretiyoruz. Modern tasarımlar ve güçlü altyapılarla yanınızdayız.
                </p>
                <div className="flex gap-4">
                    <Link
                        href="/#yazilar"
                        className="rounded-full bg-blue-600 px-8 py-3 text-sm font-semibold text-white shadow-lg hover:bg-blue-500 hover:shadow-blue-500/25 transition-all"
                    >
                        Yazıları Keşfet
                    </Link>
                    <Link
                        href="/#hakkimda"
                        className="rounded-full bg-slate-800 px-8 py-3 text-sm font-semibold border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
                    >
                        Hakkımda
                    </Link>
                </div>
            </section>

            {/* 2. Hakkımda Bölümü */}
            <section id="hakkimda" className="scroll-mt-24 bg-slate-800/50 border border-slate-800 rounded-3xl p-8 sm:p-12 shadow-xl">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 mb-4">Hakkımda</h2>
                        <div className="h-1 w-20 bg-blue-500 rounded-full mb-6"></div>
                        <p className="text-slate-300 leading-relaxed mb-6">
                            Merhaba! Ben teknolojiye ve modern web geliştirmeye tutkuyla bağlı bir yazılım mühendisiyim.
                            Mükemmel kullanıcı deneyimleri yaratmak ve karmaşık sistemleri sorunsuz ölçeklendirmek için modern araç setleri kullanıyorum.
                            React, Next.js, Node.js ve cloud teknolojileri üzerine yoğunlaşıyorum.
                        </p>
                        <div className="flex flex-wrap gap-2">
                            {['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Supabase', 'PostgreSQL'].map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-md text-xs font-medium text-slate-300">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>
                    <div className="relative aspect-square md:aspect-[4/3] w-full max-w-md mx-auto rounded-2xl overflow-hidden border border-slate-700 shadow-2xl">
                        {/* Gerçek görsel geldiğinde değiştirilebilir */}
                        <div className="absolute inset-0 bg-slate-800 flex items-center justify-center">
                            <span className="text-slate-500">Profil Görseli (Placehoder)</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Ekstra: Portfolyo Projeleri (Varsayılan) */}
            <section id="projeler" className="scroll-mt-24">
                <h2 className="text-3xl font-bold text-slate-100 mb-2">Seçili Projeler</h2>
                <p className="text-slate-400 mb-8">Üzerinde çalıştığım ve gurur duyduğum bazı işler.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {projects?.map((project) => (
                        <div key={project.id} className="group flex flex-col overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-lg transition-all hover:-translate-y-2 hover:shadow-xl hover:border-slate-600">
                            <div className="relative h-48 w-full overflow-hidden bg-slate-900">
                                {project.image_url ? (
                                    <Image
                                        src={project.image_url}
                                        alt={project.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center text-slate-600">
                                        Proje Görseli Yok
                                    </div>
                                )}
                            </div>
                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-slate-100 mb-2">{project.title}</h3>
                                <p className="text-slate-400 text-sm mb-6 flex-1 line-clamp-3">
                                    {project.description}
                                </p>
                                <div className="flex gap-4 mt-auto">
                                    {project.project_url && (
                                        <a
                                            href={project.project_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 font-medium text-sm hover:text-blue-400 transition-colors"
                                        >
                                            Websitesine Git &rarr;
                                        </a>
                                    )}
                                    {project.github_url && (
                                        <a
                                            href={project.github_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-slate-300 font-medium text-sm hover:text-white transition-colors"
                                        >
                                            GitHub
                                        </a>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!projects || projects.length === 0) && (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-800 border-dashed">
                            Henüz portfolio projesi eklenmedi.
                        </div>
                    )}
                </div>
            </section>

            {/* 3. Yazılar (Blog) Bölümü */}
            <section id="yazilar" className="scroll-mt-24">
                <div className="flex items-end justify-between mb-8">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-100 mb-2">Son Yazılar</h2>
                        <p className="text-slate-400">Teknoloji, tasarım ve yaşam üzerine paylaşımlarım.</p>
                    </div>
                    <Link href="/blog" className="hidden sm:block text-blue-500 hover:text-blue-400 font-medium text-sm transition-colors">
                        Tüm Yazıları Gör &rarr;
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {posts?.map((post) => (
                        <Link key={post.id} href={`/blog/${post.slug}`} className="group relative block overflow-hidden rounded-2xl bg-slate-800 border border-slate-700 shadow-md transition-all hover:-translate-y-2 hover:shadow-xl hover:border-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900">
                            <div className="relative h-40 w-full overflow-hidden bg-slate-900">
                                {post.cover_image ? (
                                    <Image
                                        src={post.cover_image}
                                        alt={post.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                ) : (
                                    <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-900"></div>
                                )}
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-100 mb-2 group-hover:text-blue-400 transition-colors line-clamp-2">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-slate-400 line-clamp-2 mb-4">
                                    {post.content.slice(0, 120)}...
                                </p>
                                <span className="text-xs font-medium text-blue-500">Devamını Oku &rarr;</span>
                            </div>
                        </Link>
                    ))}

                    {(!posts || posts.length === 0) && (
                        <div className="col-span-full py-12 text-center text-slate-500 bg-slate-800/30 rounded-2xl border border-slate-800 border-dashed">
                            Henüz blog yazısı yayınlanmadı.
                        </div>
                    )}
                </div>
                <div className="mt-8 text-center sm:hidden">
                    <Link href="/blog" className="inline-block px-6 py-2 rounded-full border border-slate-700 bg-slate-800 text-slate-300 font-medium text-sm hover:bg-slate-700 hover:text-white transition-colors">
                        Tüm Yazıları Gör
                    </Link>
                </div>
            </section>
        </div>
    )
}
