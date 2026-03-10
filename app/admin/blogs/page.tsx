import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'

export default async function AdminBlogsPage() {
    const supabase = await createClient()
    const { data: posts, error } = await supabase
        .from('posts')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-1">Blog Yazıları</h2>
                    <p className="text-slate-400 text-sm">Sisteme kayıtlı yazıları yönetin</p>
                </div>
                <Link
                    href="/admin/blogs/new"
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all border border-blue-500"
                >
                    Yeni Yazı Ekle
                </Link>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Başlık
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Durum
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    İşlem
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 bg-slate-800">
                            {posts?.map((post) => (
                                <tr key={post.id} className="hover:bg-slate-700/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-200">
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        {post.published ? (
                                            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                Yayında
                                            </span>
                                        ) : (
                                            <span className="px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-slate-500/10 text-slate-400 border border-slate-500/20">
                                                Taslak
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <Link
                                            href={`/admin/blogs/${post.id}`}
                                            className="inline-flex items-center text-blue-500 hover:text-blue-400"
                                        >
                                            Düzenle
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                            {(!posts || posts.length === 0) && (
                                <tr>
                                    <td colSpan={3} className="px-6 py-8 text-center text-sm text-slate-500 bg-slate-800/50">
                                        Henüz yazı eklenmemiş. Lütfen sağ üstten ilk yazınızı oluşturun.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}
