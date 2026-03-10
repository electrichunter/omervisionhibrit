'use client'

import { useState } from 'react'
import { format } from 'date-fns'
import { tr } from 'date-fns/locale'
import { addComment } from '@/app/(main)/blog/[slug]/actions'
import { useRouter } from 'next/navigation'

interface Comment {
    id: string
    author_name: string
    content: string
    created_at: string
}

interface CommentsProps {
    postId: string
    slug: string
    initialComments: Comment[]
}

export default function Comments({ postId, slug, initialComments }: CommentsProps) {
    const router = useRouter()
    const [comments, setComments] = useState<Comment[]>(initialComments)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')
    const [successMsg, setSuccessMsg] = useState('')

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsSubmitting(true)
        setErrorMsg('')
        setSuccessMsg('')

        const formData = new FormData(e.currentTarget)
        formData.append('slug', slug)

        const res = await addComment(postId, formData)

        if (res?.error) {
            setErrorMsg(res.error)
        } else {
            setSuccessMsg('Yorumunuz başarıyla eklendi!')
            e.currentTarget.reset()
            router.refresh() // Next.js anında arkaplanda sayfayı yeniler ve yeni veriyi çeker

            // For immediate optimistic UI feel:
            const newComment: Comment = {
                id: Math.random().toString(),
                author_name: formData.get('author_name') as string,
                content: formData.get('content') as string,
                created_at: new Date().toISOString()
            }
            setComments([newComment, ...comments])
        }

        setIsSubmitting(false)
    }

    return (
        <div className="mt-16 border-t border-white/10 pt-10">
            <h3 className="text-2xl font-bold mb-8">Yorumlar ({comments.length})</h3>

            <div className="mb-12 rounded-xl bg-white/5 p-6 border border-white/10 text-white">
                <h4 className="text-lg font-semibold mb-4 text-white">Yorum Yaz</h4>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="author_name" className="block text-sm font-medium text-gray-400 mb-1">
                            Adınız
                        </label>
                        <input
                            type="text"
                            id="author_name"
                            name="author_name"
                            required
                            className="w-full rounded-md border border-white/10 bg-black px-4 py-2 text-white placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            placeholder="İsminiz..."
                        />
                    </div>
                    <div>
                        <label htmlFor="content" className="block text-sm font-medium text-gray-400 mb-1">
                            Yorumunuz
                        </label>
                        <textarea
                            id="content"
                            name="content"
                            rows={4}
                            required
                            className="w-full rounded-md border border-white/10 bg-black px-4 py-2 text-white placeholder-gray-500 focus:border-[var(--accent)] focus:outline-none focus:ring-1 focus:ring-[var(--accent)]"
                            placeholder="Düşüncelerinizi paylaşın..."
                        ></textarea>
                    </div>

                    {errorMsg && <p className="text-sm text-red-500">{errorMsg}</p>}
                    {successMsg && <p className="text-sm text-green-500">{successMsg}</p>}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="rounded-md bg-white px-6 py-2 text-sm font-semibold text-black hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--accent)] disabled:bg-white/50"
                    >
                        {isSubmitting ? 'Gönderiliyor...' : 'Yorum Gönder'}
                    </button>
                </form>
            </div>

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="rounded-lg border border-white/10 bg-white/5 p-5">
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{comment.author_name}</span>
                            <time className="text-xs text-gray-500">
                                {format(new Date(comment.created_at), 'd MMM yyyy, HH:mm', { locale: tr })}
                            </time>
                        </div>
                        <p className="text-gray-300 text-sm">{comment.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}
