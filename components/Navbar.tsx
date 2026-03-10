import Link from 'next/link'
import { createClient } from '@/utils/supabase/server'
import { logout } from '@/app/login/actions'

export default async function Navbar() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    // Şimdilik sadece e-postası olan ve giren kişi "Admin" sayılıyor.
    // Gerçek bir rol tablosunda `user.app_metadata.role === 'admin'` kontrolü yapılabilir.
    const isAdmin = user ? true : false

    return (
        <nav className="sticky top-0 z-50 w-full border-b border-slate-800 bg-slate-900/80 backdrop-blur-md">
            <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
                <div className="flex items-center gap-8">
                    <Link href="/" className="text-xl font-bold tracking-tighter text-blue-500 hover:text-blue-400 transition-colors">
                        ÖmerVision
                    </Link>
                    <div className="hidden md:flex gap-6">
                        <Link href="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Ana Sayfa
                        </Link>
                        <Link href="/#hakkimda" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Hakkımda
                        </Link>
                        <Link href="/#yazilar" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Yazılar
                        </Link>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                    {!user ? (
                        <Link
                            href="/login"
                            className="text-sm font-semibold rounded-md bg-transparent px-4 py-2 border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
                        >
                            Giriş Yap
                        </Link>
                    ) : (
                        <>
                            {isAdmin && (
                                <Link
                                    href="/admin"
                                    className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                                >
                                    Admin Panel
                                </Link>
                            )}
                            <Link
                                href="/profile"
                                className="text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                            >
                                Profil
                            </Link>
                            <form action={logout}>
                                <button className="text-sm font-semibold rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-500 transition-colors">
                                    Çıkış Yap
                                </button>
                            </form>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
