'use client'

import { useState } from 'react'

interface ImageUploaderProps {
    onUploadSuccess: (url: string) => void
}

export default function ImageUploader({ onUploadSuccess }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        setUploading(true)
        setError(null)

        const formData = new FormData()
        formData.append('media', file)

        try {
            const res = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            })

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || 'Dosya yüklenemedi! (500 Error)')
            }

            const data = await res.json()
            onUploadSuccess(data.url)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="mt-2">
            <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-black file:text-white
          hover:file:bg-gray-800 disabled:opacity-50"
            />
            {uploading && <p className="mt-1 text-sm text-blue-600">Yükleniyor...</p>}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
        </div>
    )
}
