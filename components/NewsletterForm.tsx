'use client'

import { useActionState } from 'react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

const initialState = {
    message: '',
    success: false,
}

export default function NewsletterForm() {
    const [state, formAction, pending] = useActionState(subscribeToNewsletter, initialState)

    return (
        <section className="my-12 rounded-2xl bg-zinc-900/50 p-8 border border-zinc-800 text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-3 tracking-tight">Yeni içeriklerden haberdar olun</h3>
            <p className="text-zinc-400 mb-6 text-sm">
                Blog yazılarım ve projelerim hakkında ara sıra e-posta bültenleri gönderiyorum. Spam yok.
            </p>

            <form action={formAction} className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <input
                    type="email"
                    name="email"
                    required
                    placeholder="E-posta adresiniz..."
                    className="w-full sm:w-72 px-4 py-2.5 rounded-lg bg-black border border-zinc-700 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors outline-none text-white placeholder-zinc-500"
                    disabled={pending || state.success}
                />
                <button
                    type="submit"
                    disabled={pending || state.success}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-white text-black font-medium hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                >
                    {pending ? 'Abone Olunuyor...' : state.success ? 'Abone Olundu!' : 'Abone Ol'}
                </button>
            </form>

            {state?.message && (
                <p className={`mt-4 text-sm font-medium ${state.success ? 'text-green-500' : 'text-red-500'}`}>
                    {state.message}
                </p>
            )}
        </section>
    )
}
