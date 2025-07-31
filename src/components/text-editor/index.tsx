import { forwardRef, useEffect, useImperativeHandle, useState } from 'react'

import { cn } from '@/lib'
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
            disabled = false,
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
            // You can expose methods if needed, or just return the DOM node
            return editor?.view.dom as HTMLDivElement
        }, [editor])

        const toggleHeading = (level: THeadingLevel) => {
            editor?.chain().focus().toggleHeading({ level }).run()
            setActiveHeading(level)
        }

        return (
            <div
                className={cn(
                    `relative w-full after:absolute after:top-0 after:size-full after:rounded-lg after:bg-background/20 after:content-[''] ${disabled ? 'cursor-not-allowed after:block after:blur-sm' : 'after:hidden'}`,
                    className
                )}
            >
                {showToolbar && editor && (
                    <Toolbar
                        className={toolBarClassName}
                        editor={editor}
                        activeHeading={activeHeading}
                        toggleHeading={toggleHeading}
                        isHeadingDisabled={isHeadingDisabled}
                        isAllowedHorizontalRule={isAllowedHorizontalRule}
                    />
                )}
                <EditorContent editor={editor} disabled={disabled} />
            </div>
        )
    }
)

TextEditor.displayName = 'TextEditor'
export default TextEditor
