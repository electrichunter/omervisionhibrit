import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'
import { rateLimiter } from '@/utils/rateLimit'

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(req: Request) {
    try {
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1'
        const isAllowed = rateLimiter(ip, { interval: 60 * 1000, maxRequests: 10 }) // Limit to 10 upload requests per minute per IP

        if (!isAllowed) {
            return NextResponse.json(
                { error: 'Çok fazla yükleme isteği. Lütfen daha sonra tekrar deneyin (Rate Limit).' },
                { status: 429 }
            )
        }

        const formData = await req.formData()
        const file = formData.get('media') as File | null

        if (!file) {
            return NextResponse.json(
                { error: 'No file received.' },
                { status: 400 }
            )
        }

        // Convert file to buffer
        const buffer = await file.arrayBuffer()
        const bytes = Buffer.from(buffer)

        // Upload to Cloudinary using upload_stream
        const result = await new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'omervision', // Cloudinary içindeki dosya adı
                    resource_type: 'auto', // Hem resim hem de videoları algılasın
                },
                (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                }
            )
            uploadStream.end(bytes)
        })

        return NextResponse.json({ url: (result as any).secure_url }, { status: 200 })
    } catch (error) {
        console.error('Upload Error:', error)
        const errorMessage = error instanceof Error ? error.message : ((error as any)?.message || 'Bilinmeyen upload hatası')
        return NextResponse.json(
            { error: `Upload Hatası: ${errorMessage}` },
            { status: 500 }
        )
    }
}
