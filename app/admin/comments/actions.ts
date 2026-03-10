'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteComment(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', id)

    if (error) {
        console.error('Error deleting comment:', error)
        return { error: 'Yorum silinemedi.' }
    }

    revalidatePath('/admin/comments')
    revalidatePath('/') // To make sure any cached frontend views are invalidated
    return { success: true }
}
