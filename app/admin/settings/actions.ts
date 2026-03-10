'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
    const supabase = await createClient()

    const hero_title = formData.get('hero_title') as string
    const hero_subtitle = formData.get('hero_subtitle') as string
    const about_title = formData.get('about_title') as string
    const about_text = formData.get('about_text') as string
    const rawSkills = formData.get('about_skills') as string
    const about_image_url = formData.get('about_image_url') as string

    // Convert comma-separated string back to string array
    const about_skills = rawSkills ? rawSkills.split(',').map(s => s.trim()).filter(Boolean) : []

    const { error } = await supabase
        .from('site_settings')
        .upsert({
            id: 1,
            hero_title,
            hero_subtitle,
            about_title,
            about_text,
            about_skills,
            about_image_url: about_image_url || null
        })

    if (error) {
        console.error('Settings Update Error:', error)
        return { error: 'Ayarlar güncellenirken bir hata oluştu.' }
    }

    revalidatePath('/')
    revalidatePath('/admin/settings')

    return { success: true as const }
}
