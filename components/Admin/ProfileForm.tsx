'use client'

import { useState } from 'react'

interface ProfileFormProps {
    email: string
    action: (formData: FormData) => Promise<{ error?: string, success?: true }>
}

export default function ProfileForm({ email, action }: ProfileFormProps) {
    const [status, setStatus] = useState<{ type: 'idle' | 'success' | 'error', message: string }>({ type: 'idle', message: '' })
    const [isSaving, setIsSaving] = useState(false)

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSaving(true)
        setStatus({ type: 'idle', message: '' })

        const formData = new FormData(e.currentTarget)
        const res = await action(formData)

        if (res?.error) {
            setStatus({ type: 'error', message: res.error })
        } else {
            setStatus({ type: 'success', message: 'Şifreniz başarıyla güncellendi!' })
            e.currentTarget.reset()
            // 3 saniye sonra mesajı kaldır
            setTimeout(() => {
                setStatus({ type: 'idle', message: '' })
            }, 3000)
        }
        setIsSaving(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl bg-slate-800 p-6 sm:p-10 rounded-2xl border border-slate-700 shadow-xl">
            {/* 1. Profil Bilgileri (Salt Okunur) */}
            <div>
                <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-2">Hesap Bilgileri</h3>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-semibold text-slate-400 mb-2">
                            Kayıtlı E-posta Adresi
                        </label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            disabled
                            className="block w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 py-3 text-slate-400 shadow-inner cursor-not-allowed sm:text-sm"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            E-posta adresiniz güvenlik sebebiyle panel üzerinden değiştirilemez.
                        </p>
                    </div>
                </div>
            </div>

            {/* 2. Şifre Değiştirme */}
            <div>
                <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-2 mt-8">Şifre Değiştir</h3>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="new_password" className="block text-sm font-semibold text-slate-300 mb-2">
                            Yeni Şifre
                        </label>
                        <input
                            type="password"
                            id="new_password"
                            name="new_password"
                            autoComplete="new-password"
                            minLength={6}
                            required
                            className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="confirm_password" className="block text-sm font-semibold text-slate-300 mb-2">
                            Yeni Şifre (Yeniden)
                        </label>
                        <input
                            type="password"
                            id="confirm_password"
                            name="confirm_password"
                            autoComplete="new-password"
                            minLength={6}
                            required
                            className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Durum ve Kaydet */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-6 border-t border-slate-700">
                <div className="mb-4 sm:mb-0">
                    {status.type === 'success' && (
                        <span className="text-green-500 text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                            {status.message}
                        </span>
                    )}
                    {status.type === 'error' && (
                        <span className="text-red-500 text-sm font-medium flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-red-500"></span>
                            {status.message}
                        </span>
                    )}
                </div>

                <button
                    type="submit"
                    disabled={isSaving}
                    className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800 disabled:opacity-70"
                >
                    {isSaving ? 'Güncelleniyor...' : 'Şifreyi Güncelle'}
                </button>
            </div>
        </form>
    )
}
