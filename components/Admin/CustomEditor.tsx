'use client'

import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/mantine'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/mantine/style.css'
import { useEffect, useState } from 'react'

interface CustomEditorProps {
    initialContent?: string
    onChange: (markdown: string) => void
}

export default function CustomEditor({ initialContent, onChange }: CustomEditorProps) {
    const [initialBlocks, setInitialBlocks] = useState<any>(null)
    const [editorReady, setEditorReady] = useState(false)

    // Editör ayarları
    const editor = useCreateBlockNote({
        initialContent: undefined,
    })

    useEffect(() => {
        async function initEditor() {
            if (initialContent && !editorReady) {
                // Convert markdown to blocks
                const blocks = await editor.tryParseMarkdownToBlocks(initialContent)
                editor.replaceBlocks(editor.document, blocks)
            }
            setEditorReady(true)
        }
        initEditor()
    }, [initialContent, editor, editorReady])

    const handleEditorChange = async () => {
        // Convert blocks back to markdown strings for database storage
        const markdown = await editor.blocksToMarkdownLossy(editor.document)
        onChange(markdown)
    }

    return (
        <div className="rounded-xl border border-slate-700 bg-slate-900/50 overflow-hidden shadow-inner min-h-[400px] flex flex-col focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all">
            {/* Kullanıcı dostu minik bir Toolbar / Bilgi Alanı eklenebilir */}
            <div className="bg-slate-800/80 border-b border-slate-700 px-4 py-2 text-xs font-semibold text-slate-400 flex justify-between items-center">
                <span>Gelişmiş Metin Editörü</span>
                <span className="bg-slate-700/50 text-slate-300 px-2 py-1 rounded-md">/ komutları için taksim tuşuna basın</span>
            </div>

            <div className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
                <BlockNoteView
                    editor={editor}
                    theme="dark"
                    onChange={handleEditorChange}
                    className="min-h-[300px] w-full"
                />
            </div>
        </div>
    )
}
