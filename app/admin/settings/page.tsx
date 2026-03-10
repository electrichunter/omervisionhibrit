import { createClient } from '@/utils/supabase/server'
import SettingsForm from '@/components/Admin/SettingsForm'
import { updateSettings } from './actions'

export default async function AdminSettingsPage() {
    const supabase = await createClient()

    // 1 numaralı id'ye sahip site_settings satırını çek
    const { data: settings } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 1)
        .single()

    // Eğer henüz veritabanında satır oluşmadıysa yedek değerler (Default)
    const initialSettings = settings || {
        hero_title: 'Görünmeyeni Görünür Kılın',
        hero_subtitle: 'ÖmerVision olarak dijital dünyadaki vizyonunuzu en iyi şekilde yansıtacak çözümler üretiyoruz. Modern tasarımlar ve güçlü altyapılarla yanınızdayız.',
        about_title: 'Hakkımda',
        about_text: 'Merhaba! Ben teknolojiye ve modern web geliştirmeye tutkuyla bağlı bir yazılım mühendisiyim. Mükemmel kullanıcı deneyimleri yaratmak ve karmaşık sistemleri sorunsuz ölçeklendirmek için modern araç setleri kullanıyorum. React, Next.js, Node.js ve cloud teknolojileri üzerine yoğunlaşıyorum.',
        about_skills: ['Next.js', 'React', 'TypeScript', 'TailwindCSS', 'Supabase', 'PostgreSQL'],
        about_image_url: null
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-1">Site Ayarları</h2>
                    <p className="text-slate-400 text-sm">Ana sayfa karşılama ekranını ve hakkımda alanını buradan yönetebilirsiniz.</p>
                </div>
            </div>

            <SettingsForm initialData={initialSettings} action={updateSettings} />
        </div>
    )
}
