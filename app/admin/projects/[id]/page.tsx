import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import ProjectForm from '@/components/Admin/ProjectForm'
import { revalidatePath } from 'next/cache'

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !project) {
        redirect('/admin/projects')
    }

    const updateProjectAction = async (formData: FormData) => {
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
        const { error } = await supabase
            .from('projects')
            .update({
                title,
                slug,
                description,
                content,
                image_url,
                project_url,
                github_url,
                sort_order,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            console.error(error)
        } else {
            revalidatePath('/admin/projects')
            redirect('/admin/projects')
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Projeyi Düzenle</h2>
            <ProjectForm initialData={project} action={updateProjectAction} />
        </div>
    )
}
