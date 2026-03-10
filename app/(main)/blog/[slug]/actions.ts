'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function addComment(postId: string, formData: FormData) {
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
