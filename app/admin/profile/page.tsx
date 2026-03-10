import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import ProfileForm from '@/components/Admin/ProfileForm'
import { updatePassword } from './actions'

export default async function AdminProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h2 className="text-2xl font-bold text-slate-100 mb-1">Profil Yönetimi</h2>
                    <p className="text-slate-400 text-sm">Güvenlik ve hesap bilgilerinizi yönetin.</p>
                </div>
            </div>

            <ProfileForm email={user.email || ''} action={updatePassword} />
        </div>
    )
}
