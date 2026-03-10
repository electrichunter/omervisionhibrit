import Link from 'next/link'
import { logout } from '../login/actions'

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen bg-slate-900 text-slate-300">
            {/* Sidebar */}
            <aside className="w-64 bg-slate-800 border-r border-slate-700 flex flex-col shrink-0">
                <div className="h-16 flex items-center px-6 border-b border-slate-700">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-blue-500 flex items-center gap-2">
                        <span className="bg-blue-500 text-white rounded-md p-1 text-xs">Admin</span>
                        ÖmerVision
                    </Link>
                </div>
                <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
                    <Link
                        href="/admin"
                        className="flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-transparent hover:border-slate-600"
                    >
                        Dashboard
                    </Link>
                    <Link
                        href="/admin/blogs"
                        className="flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-transparent hover:border-slate-600"
                    >
                        Blog Yönetimi
                    </Link>
                    <Link
                        href="/admin/projects"
                        className="flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-transparent hover:border-slate-600"
                    >
                        Portfolyo
                    </Link>
                    <Link
                        href="/admin/comments"
                        className="flex items-center px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-transparent hover:border-slate-600"
                    >
                        Yorum Yönetimi
                    </Link>
                </nav>
                <div className="p-4 border-t border-slate-700">
                    <form action={logout}>
                        <button className="w-full flex justify-center items-center gap-2 py-2 px-4 border border-slate-700 rounded-lg shadow-sm text-sm font-medium text-slate-300 bg-slate-800 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/50 transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 focus:ring-red-500">
                            Çıkış Yap
                        </button>
                    </form>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <div className="max-w-5xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    )
}
