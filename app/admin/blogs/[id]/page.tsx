import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import BlogForm from '@/components/Admin/BlogForm'
import { revalidatePath } from 'next/cache'

export default async function EditBlogPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params
    const supabase = await createClient()

    const { data: post, error: fetchError } = await supabase
        .from('posts')
        .select('*')
        .eq('id', id)
        .single()

    if (fetchError || !post) {
        redirect('/admin/blogs')
    }

    const updateBlogAction = async (formData: FormData) => {
        'use server'

        const title = formData.get('title') as string
        const slug = formData.get('slug') as string
        const content = formData.get('content') as string
        const cover_image = formData.get('cover_image') as string
        const published = formData.get('published') === 'on'

        const supabase = await createClient()
        const { error } = await supabase
            .from('posts')
            .update({
                title,
                slug,
                content,
                cover_image,
                published,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)

        if (error) {
            console.error(error)
        } else {
            revalidatePath('/admin/blogs')
            // If we are doing ISR on the frontend, we could revalidate `/blog/[slug]` too.
            redirect('/admin/blogs')
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Blog Yazısını Düzenle</h2>
            <BlogForm initialData={post} action={updateBlogAction} />
        </div>
    )
}
