import { createClient } from '@/utils/supabase/server'
import { deleteComment } from './actions'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'

export default async function AdminCommentsPage() {
    const supabase = await createClient()

    // Blog yazısı ile birlikte yorumları getiriyoruz ki hangi yazıya yorum yazıldığını görebilelim
    const { data: comments, error } = await supabase
        .from('comments')
        .select('*, posts(title, slug)')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-1">Yorum Yönetimi</h2>
                    <p className="text-slate-400 text-sm">Sitedeki tüm yorumları okuyun ve yönetin.</p>
                </div>
            </div>

            <div className="bg-slate-800 border border-slate-700 rounded-2xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-700">
                        <thead className="bg-slate-900/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Yazar & Tarih
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    Yorum Özeti
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    İlgili Blog
                                </th>
                                <th className="px-6 py-4 text-right text-xs font-semibold text-slate-400 uppercase tracking-wider">
                                    İşlem
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700/50 bg-slate-800">
                            {comments?.map((comment) => (
                                <tr key={comment.id} className="hover:bg-slate-700/50 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-slate-200">
                                            {comment.author_name}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {format(new Date(comment.created_at), 'd MMM yyyy, HH:mm', { locale: tr })}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-slate-300 line-clamp-2 max-w-xs break-words whitespace-normal">
                                            {comment.content}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-400">
                                        {/* Optional chained if posts relationship is valid */}
                                        {comment.posts?.title ? (
                                            <a href={`/blog/${comment.posts.slug}`} target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 hover:underline">
                                                {comment.posts.title.slice(0, 30)}...
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <form action={async () => {
                                            'use server'
                                            await deleteComment(comment.id)
                                        }}>
                                            <button
                                                type="submit"
                                                className="inline-flex items-center text-red-500 hover:text-red-400"
                                            >
                                                Sil
                                            </button>
                                        </form>
                                    </td>
                                </tr>
                            ))}
                            {(!comments || comments.length === 0) && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-8 text-center text-sm text-slate-500 bg-slate-800/50">
                                        Henüz kimse yorum yapmamış.
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
