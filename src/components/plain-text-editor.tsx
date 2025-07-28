import { useEffect } from 'react'

import { cn } from '@/lib'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

type PlainTextEditorProps = {
    content?: string
    disabled?: boolean
    className?: string
}

const PlainTextEditor = ({
    content,
    disabled = true,
    className,
}: PlainTextEditorProps) => {
    const textEditor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: false,
                    keepAttributes: false,
                },
            }),
        ],
        editable: !disabled,
        content: content,
    })

    useEffect(() => {
        if (textEditor && content !== textEditor.getHTML()) {
            textEditor.commands.setContent(content || '')
        }
    }, [content, textEditor])

    return (
        <div className={cn('truncate', className)}>
            <EditorContent editor={textEditor} />
        </div>
    )
}

export default PlainTextEditor
