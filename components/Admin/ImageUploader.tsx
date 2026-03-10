'use client'

import { useState } from 'react'
import ImageCropperModal from './ImageCropperModal'

interface ImageUploaderProps {
    onUploadSuccess: (url: string) => void
    isCircular?: boolean // Yeni özellik için opsiyonel prop
}

export default function ImageUploader({ onUploadSuccess, isCircular = false }: ImageUploaderProps) {
    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // Kırpma state'leri
    const [imageToCrop, setImageToCrop] = useState<string | null>(null)

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Profil görseliyse kırpma modalını aç (isCircular true ise)
        if (isCircular) {
            const reader = new FileReader()
            reader.addEventListener('load', () => {
                setImageToCrop(reader.result?.toString() || null)
            })
            reader.readAsDataURL(file)
            e.target.value = '' // Ayni dosyayı tekrar seçebilmek için inputu sıfırla
            return
        }

        // Değilse doğrudan upload et
        performUpload(file)
    }

    const performUpload = async (file: File) => {
        setUploading(true)
        setError(null)
        setImageToCrop(null) // Kırpma işlemini kapat

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
                onChange={handleFileSelect}
                disabled={uploading}
                className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-black file:text-white
          hover:file:bg-gray-800 disabled:opacity-50"
            />

            {uploading && <p className="mt-1 text-sm text-blue-600 animate-pulse">Fotoğraf işleniyor ve yükleniyor...</p>}
            {error && <p className="mt-1 text-sm text-red-600">{error}</p>}

            {/* Kırpma Modalı Sadece isCircular ise ve resim seçildiyse açılır */}
            {imageToCrop && (
                <ImageCropperModal
                    imageSrc={imageToCrop}
                    onCropComplete={(croppedFile) => {
                        performUpload(croppedFile)
                    }}
                    onCancel={() => {
                        setImageToCrop(null) // İptal edilirse modalı kapat
                    }}
                />
            )}
        </div>
    )
}
