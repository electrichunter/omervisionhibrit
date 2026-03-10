import { login } from './actions'

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-900 px-4">
            <div className="z-10 w-full max-w-md overflow-hidden rounded-3xl border border-slate-800 shadow-2xl bg-slate-900 relative">
                {/* Glow effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl pointer-events-none"></div>

                <div className="flex flex-col items-center justify-center space-y-3 border-b border-slate-800 bg-slate-800/30 px-4 py-8 text-center sm:px-16 relative z-10">
                    <h3 className="text-2xl font-bold text-slate-100">Giriş Yap</h3>
                    <p className="text-sm rounded-full bg-blue-500/10 px-3 py-1 text-blue-400 font-medium">
                        ÖmerVision Admin Paneli
                    </p>
                </div>

                <div className="flex flex-col space-y-4 bg-slate-800/20 px-4 py-8 sm:px-16 backdrop-blur-sm">
                    <form className="flex flex-col space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                E-posta Adresi
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="ornek@mail.com"
                                autoComplete="email"
                                required
                                className="block w-full appearance-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-200 placeholder-slate-500 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
                                Şifre
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="block w-full appearance-none rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-slate-200 placeholder-slate-500 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                            />
                        </div>
                        <button
                            formAction={login}
                            className="mt-2 flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-bold text-white shadow-lg hover:bg-blue-500 hover:shadow-blue-500/25 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-all"
                        >
                            Giriş Yap
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
