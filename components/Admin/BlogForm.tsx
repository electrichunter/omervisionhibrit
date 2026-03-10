'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'
import Image from 'next/image'
import dynamic from 'next/dynamic'

// BlockNote component does not support SRR, so we load it dynamically
const CustomEditor = dynamic(() => import('./CustomEditor'), { ssr: false })

interface BlogData {
    id?: string
    title: string
    slug: string
    content: string
    cover_image: string | null
    published: boolean
}

interface BlogFormProps {
    initialData?: BlogData
    action: (formData: FormData) => void
}

export default function BlogForm({ initialData, action }: BlogFormProps) {
    const [coverImage, setCoverImage] = useState<string | null>(
        initialData?.cover_image || null
    )
    const [content, setContent] = useState<string>(initialData?.content || '')
    const [title, setTitle] = useState<string>(initialData?.title || '')
    const [slug, setSlug] = useState<string>(initialData?.slug || '')

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)

        // Sadece yeni kayıt eklenirken otomatik Slug oluştur (düzenleme modunda ezmemek için)
        if (!initialData?.id) {
            const generatedSlug = newTitle
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9\s-]/g, '') // Sadece harf, rakam, boşluk ve tire
                .trim()
                .replace(/\s+/g, '-') // Boşlukları tireye çevir

            setSlug(generatedSlug)
        }
    }

    return (
        <form action={action} className="space-y-6 max-w-4xl bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
            <input type="hidden" name="cover_image" value={coverImage || ''} />
            <input type="hidden" name="content" value={content} />
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-300 mb-2">
                    Başlık
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={title}
                    onChange={handleTitleChange}
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                />
            </div>

            <div>
                <label htmlFor="slug" className="block text-sm font-semibold text-slate-300 mb-2">
                    URL Slug
                </label>
                <input
                    type="text"
                    id="slug"
                    name="slug"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="orn-blog-yazisi"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 placeholder-slate-600 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                />
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Kapak Görseli
                </label>
                {coverImage && (
                    <div className="mt-2 mb-4 relative h-48 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                        <Image src={coverImage} alt="Cover" fill className="object-cover" />
                    </div>
                )}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <ImageUploader onUploadSuccess={(url) => setCoverImage(url)} />
                </div>
            </div>

            <div>
                <div>
                    <label className="block text-sm font-semibold text-slate-300 mb-2">
                        İçerik (Zengin Metin / Markdown)
                    </label>
                    <div className="prose prose-invert max-w-none">
                        <CustomEditor
                            initialContent={initialData?.content}
                            onChange={(md) => setContent(md)}
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                <input
                    id="published"
                    name="published"
                    type="checkbox"
                    defaultChecked={initialData?.published}
                    className="h-5 w-5 rounded border-slate-600 bg-slate-900 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-800"
                />
                <label htmlFor="published" className="ml-3 block text-sm font-medium text-slate-300">
                    Yayınla (Herkese açık olsun)
                </label>
            </div>

            <div className="flex justify-end pt-4">
                <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800"
                >
                    {initialData ? 'Güncelle' : 'Kaydet'}
                </button>
            </div>
        </form>
    )
}
