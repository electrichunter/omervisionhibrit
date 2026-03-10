'use client'

import React, { useState, useCallback } from 'react'
import Cropper from 'react-easy-crop'
import getCroppedImg from '@/utils/cropImage'

interface ImageCropperModalProps {
    imageSrc: string
    onCropComplete: (croppedFile: File) => void
    onCancel: () => void
}

export default function ImageCropperModal({ imageSrc, onCropComplete, onCancel }: ImageCropperModalProps) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)
    const [isProcessing, setIsProcessing] = useState(false)

    const onCropCompleteHandler = useCallback((croppedArea: any, croppedAreaPixels: any) => {
        setCroppedAreaPixels(croppedAreaPixels)
    }, [])

    const handleConfirm = async () => {
        if (!croppedAreaPixels) return

        try {
            setIsProcessing(true)
            const croppedImageFile = await getCroppedImg(imageSrc, croppedAreaPixels)
            if (croppedImageFile) {
                onCropComplete(croppedImageFile)
            }
        } catch (e) {
            console.error('Kırpma hatası:', e)
            alert('Görsel kırpılırken bir hata oluştu.')
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl overflow-hidden shadow-2xl flex flex-col">

                {/* Header */}
                <div className="p-4 border-b border-slate-800 flex justify-between items-center">
                    <h3 className="text-lg font-bold text-slate-100">Profil Görselini Kırp</h3>
                    <button
                        onClick={onCancel}
                        className="text-slate-400 hover:text-white transition-colors"
                    >
                        İptal
                    </button>
                </div>

                {/* Cropper Area */}
                <div className="relative w-full h-80 bg-black">
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        cropShape="round"
                        showGrid={false}
                        onCropChange={setCrop}
                        onCropComplete={onCropCompleteHandler}
                        onZoomChange={setZoom}
                    />
                </div>

                {/* Controls (Zoom) */}
                <div className="p-6 bg-slate-800 space-y-4">
                    <div className="flex items-center gap-4">
                        <span className="text-slate-400 text-sm">Uzak</span>
                        <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            aria-labelledby="Zoom"
                            onChange={(e) => {
                                setZoom(Number(e.target.value))
                            }}
                            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-slate-400 text-sm">Yakın</span>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-6">
                        <button
                            onClick={onCancel}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-slate-700 text-slate-200 rounded-xl font-medium hover:bg-slate-600 transition-colors disabled:opacity-50"
                        >
                            İptal
                        </button>
                        <button
                            onClick={handleConfirm}
                            disabled={isProcessing}
                            className="px-4 py-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-500 transition-colors disabled:opacity-50"
                        >
                            {isProcessing ? 'İşleniyor...' : 'Kırp ve Yükle'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}
