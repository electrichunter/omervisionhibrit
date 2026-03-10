import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'
import BlogForm from '@/components/Admin/BlogForm'

export default function NewBlogPage() {
    const createBlogAction = async (formData: FormData) => {
        'use server'

        const title = formData.get('title') as string
        const slug = formData.get('slug') as string
        const content = formData.get('content') as string
        const cover_image = formData.get('cover_image') as string
        const published = formData.get('published') === 'on'

        const supabase = await createClient()
        const { error } = await supabase.from('posts').insert({
            title,
            slug,
            content,
            cover_image,
            published,
        })

        if (error) {
            console.error(error)
            // Todo: Flash message handling
        } else {
            redirect('/admin/blogs')
        }
    }

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Yeni Blog Yazısı</h2>
            <BlogForm action={createBlogAction} />
        </div>
    )
}
