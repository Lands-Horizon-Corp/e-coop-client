import { useEffect, useState } from 'react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useEditor, EditorContent } from '@tiptap/react'

import Toolbar from './toolbar'

import { cn } from '@/lib'
import { IBaseProps } from '@/types'

interface Props extends IBaseProps {
    content?: string
    disabled?: boolean
    spellCheck?: boolean
    placeholder?: string
    showToolbar?: boolean
    isHeadingDisabled?: boolean
    textEditorClassName?: string
    placeholderClassName?: string
    onChange: (content: string) => void
}

export type THeadingLevel = 1 | 2 | 3 | 4

const TextEditor = ({
    className,
    disabled,
    content = '',
    spellCheck = true,
    showToolbar = true,
    textEditorClassName,
    placeholderClassName,
    isHeadingDisabled = true,
    placeholder = 'Write something …',
    onChange,
}: Props) => {
    const [activeHeading, setActiveHeading] = useState<THeadingLevel | null>(
        null
    )

    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                bulletList: {
                    keepMarks: false,
                    keepAttributes: false,
                },
            }),
            Placeholder.configure({
                placeholder,
                emptyNodeClass: placeholderClassName,
            }),
        ],
        content: content,
        editorProps: {
            attributes: {
                spellcheck: spellCheck ? 'true' : 'false',
                class: cn(
                    'w-full ecoop-scroll toolbar-custom',
                    textEditorClassName
                ),
            },
        },
        onUpdate({ editor }) {
            onChange(editor.getHTML())
        },
    })

    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '')
        }
    }, [content, editor])

    const toggleHeading = (level: THeadingLevel) => {
        editor?.chain().focus().toggleHeading({ level }).run()
        setActiveHeading(level)
    }
    return (
        <div className={cn('w-full space-y-2', className)}>
            {showToolbar && editor && (
                <Toolbar
                    editor={editor}
                    activeHeading={activeHeading}
                    toggleHeading={toggleHeading}
                    isHeadingDisabled={isHeadingDisabled}
                />
            )}
            <EditorContent editor={editor} disabled={disabled} />
        </div>
    )
}

export default TextEditor
