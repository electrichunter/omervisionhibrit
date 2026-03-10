'use client'

import { useState } from 'react'
import ImageUploader from './ImageUploader'
import Image from 'next/image'
import dynamic from 'next/dynamic'

const CustomEditor = dynamic(() => import('./CustomEditor'), { ssr: false })

interface ProjectData {
    id?: string
    title: string
    slug: string
    description: string
    content: string | null
    image_url: string | null
    project_url: string | null
    github_url: string | null
    sort_order: number
}

interface ProjectFormProps {
    initialData?: ProjectData
    action: (formData: FormData) => void
}

export default function ProjectForm({ initialData, action }: ProjectFormProps) {
    const [imageUrl, setImageUrl] = useState<string | null>(
        initialData?.image_url || null
    )
    const [content, setContent] = useState<string>(initialData?.content || '')
    const [title, setTitle] = useState<string>(initialData?.title || '')
    const [slug, setSlug] = useState<string>(initialData?.slug || '')

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value
        setTitle(newTitle)

        // Sadece yeni kayıt eklenirken otomatik Slug oluştur
        if (!initialData?.id) {
            const generatedSlug = newTitle
                .toLowerCase()
                .replace(/ğ/g, 'g')
                .replace(/ü/g, 'u')
                .replace(/ş/g, 's')
                .replace(/ı/g, 'i')
                .replace(/ö/g, 'o')
                .replace(/ç/g, 'c')
                .replace(/[^a-z0-9\s-]/g, '')
                .trim()
                .replace(/\s+/g, '-')

            setSlug(generatedSlug)
        }
    }

    return (
        <form action={action} className="space-y-6 max-w-4xl bg-slate-800 p-6 sm:p-8 rounded-2xl border border-slate-700 shadow-xl">
            <input type="hidden" name="image_url" value={imageUrl || ''} />
            <input type="hidden" name="content" value={content} />
            {initialData?.id && <input type="hidden" name="id" value={initialData.id} />}

            <div>
                <label htmlFor="title" className="block text-sm font-semibold text-slate-300 mb-2">
                    Proje Başlığı
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
                    placeholder="orn-proje-url"
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 placeholder-slate-600 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                />
            </div>

            <div>
                <label htmlFor="description" className="block text-sm font-semibold text-slate-300 mb-2">
                    Kısa Açıklama (Özet)
                </label>
                <textarea
                    id="description"
                    name="description"
                    rows={3}
                    required
                    defaultValue={initialData?.description}
                    className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                ></textarea>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Proje Görseli
                </label>
                {imageUrl && (
                    <div className="mt-2 mb-4 relative h-48 w-full rounded-xl overflow-hidden bg-slate-900 border border-slate-700">
                        <Image src={imageUrl} alt="Project" fill className="object-cover" />
                    </div>
                )}
                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-700/50">
                    <ImageUploader onUploadSuccess={(url) => setImageUrl(url)} />
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label htmlFor="project_url" className="block text-sm font-semibold text-slate-300 mb-2">
                        Canlı Link (URL)
                    </label>
                    <input
                        type="url"
                        id="project_url"
                        name="project_url"
                        defaultValue={initialData?.project_url || ''}
                        className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                    />
                </div>
                <div>
                    <label htmlFor="github_url" className="block text-sm font-semibold text-slate-300 mb-2">
                        GitHub Link (URL)
                    </label>
                    <input
                        type="url"
                        id="github_url"
                        name="github_url"
                        defaultValue={initialData?.github_url || ''}
                        className="block w-full rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Detaylı İçerik (Zengin Metin / Markdown)
                </label>
                <div className="prose prose-invert max-w-none">
                    <CustomEditor
                        initialContent={initialData?.content || undefined}
                        onChange={(md) => setContent(md)}
                    />
                </div>
            </div>

            <div>
                <label htmlFor="sort_order" className="block text-sm font-semibold text-slate-300 mb-2">
                    Sıralama (0 ilk gösterilir)
                </label>
                <input
                    type="number"
                    id="sort_order"
                    name="sort_order"
                    defaultValue={initialData?.sort_order ?? 0}
                    className="block w-32 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-slate-200 shadow-inner focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm transition-all"
                />
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
