import { type Editor } from '@tiptap/react'

import {
    UndoIcon,
    RedoIcon,
    FaBoldIcon,
    CodeBlockIcon,
    IoIosCodeIcon,
    BlockQuoteIcon,
    ListOrderedIcon,
    ToolbarItalicIcon,
    ListBulletsBoldIcon,
    TextStrikethroughLightIcon,
} from '@/components/icons'
import { Toggle } from '@/components/ui/toggle'
import { Button } from '@/components/ui/button'

import { THeadingLevel } from '.'
import ActionTooltip from '../action-tooltip'

type Props = {
    editor: Editor | null
    toggleHeading: (level: THeadingLevel) => void
    activeHeading: THeadingLevel | null
    isHeadingDisabled?: boolean
}

const Toolbar = ({
    editor,
    toggleHeading,
    activeHeading,
    isHeadingDisabled = true,
}: Props) => {
    if (!editor) {
        return null
    }
    return (
        <div className="flex w-full min-w-fit flex-wrap space-x-2">
            <ActionTooltip align="center" side="top" tooltipContent="italic">
                <Toggle
                    pressed={editor.isActive('italic')}
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    size="sm"
                    aria-label="Toggle italic"
                >
                    <ToolbarItalicIcon className="size-4" />
                </Toggle>
            </ActionTooltip>
            <ActionTooltip align="center" side="top" tooltipContent="bold">
                <Toggle
                    pressed={editor.isActive('Bold"')}
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    size="sm"
                    aria-label="Toggle Bold"
                >
                    <FaBoldIcon className="size-4" />
                </Toggle>
            </ActionTooltip>
            <ActionTooltip align="center" side="top" tooltipContent="strike">
                <Toggle
                    pressed={editor.isActive('strike')}
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                >
                    <TextStrikethroughLightIcon className="size-4" />
                </Toggle>
            </ActionTooltip>
            <ActionTooltip align="center" side="top" tooltipContent="code">
                <Toggle
                    type="button"
                    pressed={editor.isActive('code')}
                    onClick={() => editor.chain().focus().toggleCode().run()}
                >
                    <IoIosCodeIcon className="size-4" />
                </Toggle>
            </ActionTooltip>

            {!isHeadingDisabled &&
                Array.from({ length: 4 }, (_, i) => {
                    const level = i + 1
                    return (
                        <Toggle
                            key={level}
                            onClick={() =>
                                toggleHeading(level as THeadingLevel)
                            }
                            pressed={
                                activeHeading === level && editor.isFocused
                            }
                        >
                            {`H${level}`}
                        </Toggle>
                    )
                })}
            <ActionTooltip
                align="center"
                side="top"
                tooltipContent="bullet list"
            >
                <Toggle
                    pressed={editor.isActive('bulletList')}
                    onPressedChange={() =>
                        editor.chain().focus().toggleBulletList().run()
                    }
                >
                    <ListBulletsBoldIcon className="size-4" />
                </Toggle>
            </ActionTooltip>
            <ActionTooltip
                align="center"
                side="top"
                tooltipContent="ordered list"
            >
                <Toggle
                    onClick={() =>
                        editor.chain().focus().toggleOrderedList().run()
                    }
                    className={
                        editor.isActive('orderedList') ? 'is-active' : ''
                    }
                >
                    <ListOrderedIcon className="size-4" />
                </Toggle>
            </ActionTooltip>
            <ActionTooltip
                align="center"
                side="top"
                tooltipContent="code block"
            >
                <Button
                    type="button"
                    variant={'ghost'}
                    onClick={() =>
                        editor.chain().focus().toggleCodeBlock().run()
                    }
                    className={editor.isActive('codeBlock') ? 'is-active' : ''}
                >
                    <CodeBlockIcon className="size-4" />
                </Button>
            </ActionTooltip>
            <ActionTooltip
                align="center"
                side="top"
                tooltipContent="block quote"
            >
                <Button
                    type="button"
                    variant={'ghost'}
                    onClick={() =>
                        editor.chain().focus().toggleBlockquote().run()
                    }
                    className={editor.isActive('blockquote') ? 'is-active' : ''}
                >
                    <BlockQuoteIcon className="size-4" />
                </Button>
            </ActionTooltip>
            <ActionTooltip align="center" side="top" tooltipContent="undo">
                <Button
                    type="button"
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().undo().run()}
                >
                    <UndoIcon className="size-4" />
                </Button>
            </ActionTooltip>
            <ActionTooltip align="center" side="top" tooltipContent="redo">
                <Button
                    type="button"
                    variant={'ghost'}
                    onClick={() => editor.chain().focus().redo().run()}
                >
                    <RedoIcon className="size-4" />
                </Button>
            </ActionTooltip>
        </div>
    )
}

export default Toolbar
