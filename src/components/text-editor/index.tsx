import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import Placeholder from '@tiptap/extension-placeholder'
import { EditorContent, useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'

import { IBaseProps } from '@/types'

import Toolbar from './toolbar'

interface Props extends IBaseProps {
    content?: string
    disabled?: boolean
    spellCheck?: boolean
    placeholder?: string
    showToolbar?: boolean
    isHeadingDisabled?: boolean
    textEditorClassName?: string
    placeholderClassName?: string
    onChange?: (content: string) => void
    toolBarClassName?: string
    isAllowedHorizontalRule?: boolean
    editable?: boolean
}

export type THeadingLevel = 1 | 2 | 3 | 4

const TextEditor = forwardRef<HTMLDivElement, Props>(
    (
        {
            className,
            // disabled = false,
            content = '',
            spellCheck = true,
            showToolbar = true,
            textEditorClassName,
            placeholderClassName,
            isHeadingDisabled = true,
            placeholder = 'Write something …',
            onChange,
            toolBarClassName,
            isAllowedHorizontalRule,
            editable = true,
        },
        ref
    ) => {
        const [activeHeading, setActiveHeading] =
            useState<THeadingLevel | null>(null)

        const editor = useEditor({
            extensions: [
                StarterKit,
                Placeholder.configure({
                    placeholder,
                    emptyNodeClass: placeholderClassName,
                }),
            ],
            content: content,
            editable: editable,
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
                onChange?.(editor.getHTML())
            },
        })

        useEffect(() => {
            if (editor && content !== editor.getHTML()) {
                editor.commands.setContent(content || '')
            }
        }, [content, editor])

        useImperativeHandle(ref, () => {
            return editor?.view.dom as HTMLDivElement
        }, [editor])

        const toggleHeading = (level: THeadingLevel) => {
            editor?.chain().focus().toggleHeading({ level }).run()
            setActiveHeading(level)
        }

        return (
            <div className={cn('flex flex-col h-full', className)}>
                {showToolbar && editor && (
                    <Toolbar
                        activeHeading={activeHeading}
                        className={toolBarClassName}
                        editor={editor}
                        isAllowedHorizontalRule={isAllowedHorizontalRule}
                        isHeadingDisabled={isHeadingDisabled}
                        toggleHeading={toggleHeading}
                    />
                )}
                <EditorContent
                    className="text-editor-content"
                    editor={editor}
                />
            </div>
        )
    }
)

TextEditor.displayName = 'TextEditor'
export default TextEditor
