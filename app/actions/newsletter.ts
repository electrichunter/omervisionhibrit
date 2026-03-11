'use server'

import { createClient } from '@/utils/supabase/server'
import { headers } from 'next/headers'
import { rateLimiter } from '@/utils/rateLimit'

export async function subscribeToNewsletter(prevState: any, formData: FormData) {
    const email = formData.get('email') as string

    if (!email || !email.includes('@')) {
        return { success: false, message: 'Geçerli bir e-posta adresi giriniz.' }
    }

    const headersList = await headers()
    const ip = headersList.get('x-forwarded-for') || '127.0.0.1'

    // Rate Limit: 3 subscriptions per minute per IP
    const isAllowed = rateLimiter(ip, { interval: 60 * 1000, maxRequests: 3 })
    if (!isAllowed) {
        return { success: false, message: 'Çok fazla istek. Lütfen bir süre sonra tekrar deneyin.' }
    }

    const supabase = await createClient()

    const { error } = await supabase.from('subscribers').insert({
        email: email,
    })

    if (error) {
        if (error.code === '23505') { // Unique constraint violation (PostgreSQL)
            return { success: false, message: 'Bu e-posta adresi zaten kayıtlı.' }
        }
        console.error('Newsletter Subscription Error:', error)
        return { success: false, message: 'Abonelik işlemi sırasında bir hata oluştu.' }
    }

    return { success: true, message: 'Aboneliğiniz başarıyla oluşturuldu! Teşekkürler.' }
}
