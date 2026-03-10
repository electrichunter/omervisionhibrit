'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'
import Image from 'next/image'

interface SettingsData {
    hero_title: string
    hero_subtitle: string
    about_title: string
    about_text: string
    about_skills: string[]
    about_image_url: string | null
}

interface SettingsFormProps {
    initialData: SettingsData
    action: (formData: FormData) => Promise<{ error?: string, success?: true }>
}

export default function SettingsForm({ initialData, action }: SettingsFormProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(initialData?.about_image_url || null)
    const [skillsInput, setSkillsInput] = useState<string>(initialData?.about_skills?.join(', ') || '')
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
            setStatus({ type: 'success', message: 'Site ayarları başarıyla güncellendi!' })

            // 3 saniye sonra mesajı kaldır
            setTimeout(() => {
                setStatus({ type: 'idle', message: '' })
            }, 3000)
        }
        setIsSaving(false)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-10 max-w-4xl bg-slate-800 p-6 sm:p-10 rounded-2xl border border-slate-700 shadow-xl">
            <input type="hidden" name="about_image_url" value={imageUrl || ''} />

            {/* 1. Hero Bölümü Ayarları */}
            <div>
                <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-2">1. Ana Sayfa (Hero) Ayarları</h3>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="hero_title" className="block text-sm font-semibold text-slate-300 mb-2">
                            Ana Başlık (Hero Title)
                        </label>
                        <input
                            type="text"
                            id="hero_title"
                            name="hero_title"
                            required
                            defaultValue={initialData?.hero_title}
                            className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                        />
                        <p className="mt-1 flex text-xs text-slate-500">Örneğin: Görünmeyeni Görünür Kılın</p>
                    </div>

                    <div>
                        <label htmlFor="hero_subtitle" className="block text-sm font-semibold text-slate-300 mb-2">
                            Alt Açıklama (Hero Subtitle)
                        </label>
                        <textarea
                            id="hero_subtitle"
                            name="hero_subtitle"
                            rows={3}
                            required
                            defaultValue={initialData?.hero_subtitle}
                            className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                        ></textarea>
                    </div>
                </div>
            </div>

            {/* 2. Hakkımda Bölümü Ayarları */}
            <div>
                <h3 className="text-xl font-bold text-slate-100 mb-6 border-b border-slate-700 pb-2 mt-8">2. Hakkımda Bölümü Ayarları</h3>

                <div className="space-y-6">
                    <div>
                        <label htmlFor="about_title" className="block text-sm font-semibold text-slate-300 mb-2">
                            Bölüm Başlığı
                        </label>
                        <input
                            type="text"
                            id="about_title"
                            name="about_title"
                            required
                            defaultValue={initialData?.about_title}
                            className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="about_text" className="block text-sm font-semibold text-slate-300 mb-2">
                            Hakkımda Metni
                        </label>
                        <textarea
                            id="about_text"
                            name="about_text"
                            rows={5}
                            required
                            defaultValue={initialData?.about_text}
                            className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                        ></textarea>
                    </div>

                    <div>
                        <label htmlFor="about_skills" className="block text-sm font-semibold text-slate-300 mb-2">
                            Yetenekler / Teknolojiler (Virgülle ayırın)
                        </label>
                        <input
                            type="text"
                            id="about_skills"
                            name="about_skills"
                            value={skillsInput}
                            onChange={(e) => setSkillsInput(e.target.value)}
                            className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                            placeholder="Next.js, React, Tailwind CSS"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-300 mb-2">
                            Profil / Hakkımda Görseli
                        </label>
                        {imageUrl ? (
                            <div className="mt-2 mb-4 relative h-64 w-full md:w-1/2 rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                                <Image src={imageUrl} alt="Profile" fill className="object-cover" />
                                <button
                                    type="button"
                                    onClick={() => setImageUrl(null)}
                                    className="absolute top-2 right-2 bg-red-600/80 text-white p-2 rounded-full hover:bg-red-500 text-xs backdrop-blur-md"
                                >
                                    Kaldır
                                </button>
                            </div>
                        ) : (
                            <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50 max-w-md">
                                <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} />
                            </div>
                        )}
                        <p className="mt-2 flex text-xs text-slate-500">*(Mevcut profil resminiz. Güncellemek için yükleyin)*</p>
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
                    {isSaving ? 'Kaydediliyor...' : 'Ayarları Kaydet'}
                </button>
            </div>
        </form>
    )
}
