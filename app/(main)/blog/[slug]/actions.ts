'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { rateLimiter } from '@/utils/rateLimit'

export async function addComment(postId: string, formData: FormData) {
    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

    // Rate Limit: Allow only 5 comments per minute per IP to prevent comment spam
    const isAllowed = rateLimiter(ip, { interval: 60 * 1000, maxRequests: 5 })
    if (!isAllowed) {
        return { error: 'Çok fazla yorum isteği gönderdiniz. Lütfen bir süre bekleyin.' }
    }

    const author_name = formData.get('author_name') as string
    const content = formData.get('content') as string
    const slug = formData.get('slug') as string

    if (!author_name || !content || !postId || !slug) {
        return { error: 'Tüm alanları doldurmalısınız.' }
    }

    const supabase = await createClient()

    const { error } = await supabase.from('comments').insert({
        post_id: postId,
        author_name,
        content,
        approved: true, // For MVP it's auto-approved
    })

    if (error) {
        console.error('Comment Insert Error:', error)
        return { error: 'Yorum eklenirken bir hata oluştu.' }
    }

    revalidatePath(`/blog/${slug}`)
    revalidatePath('/admin/') // To clear potential dashboard caches later
    return { success: true }
}
