'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updatePassword(formData: FormData) {
    const supabase = await createClient()

    const newPassword = formData.get('new_password') as string
    const confirmPassword = formData.get('confirm_password') as string

    if (!newPassword || newPassword.length < 6) {
        return { error: 'Şifre en az 6 karakter olmalıdır.' }
    }

    if (newPassword !== confirmPassword) {
        return { error: 'Girdiğiniz şifreler eşleşmiyor.' }
    }

    const { error } = await supabase.auth.updateUser({
        password: newPassword
    })

    if (error) {
        console.error('Password Update Error:', error)
        return { error: 'Şifreniz güncellenirken bir hata oluştu.' }
    }

    revalidatePath('/admin/profile')
    return { success: true as const }
}
