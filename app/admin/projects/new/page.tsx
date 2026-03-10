import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ProjectForm from '@/components/Admin/ProjectForm'

export default function NewProjectPage() {
    const createProjectAction = async (formData: FormData) => {
        'use server'

        const title = formData.get('title') as string
        const slug = formData.get('slug') as string
        const description = formData.get('description') as string
        const content = formData.get('content') as string
        const image_url = formData.get('image_url') as string
        const project_url = formData.get('project_url') as string
        const github_url = formData.get('github_url') as string
        const sort_order = parseInt(formData.get('sort_order') as string) || 0

        const supabase = await createClient()
        const { error } = await supabase.from('projects').insert({
            title,
            slug,
            description,
            content,
            image_url,
            project_url,
            github_url,
            sort_order,
        })

        if (error) {
            console.error(error)
        } else {
            redirect('/admin/projects')
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Yeni Proje Ekle</h2>
            <ProjectForm action={createProjectAction} />
        </div>
    )
}
