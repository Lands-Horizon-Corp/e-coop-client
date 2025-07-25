import { cn } from '@/lib'
import { type Editor } from '@tiptap/react'

import {
    BlockQuoteIcon,
    CodeBlockIcon,
    FaBoldIcon,
    HorizontalRuleIcon,
    IoIosCodeIcon,
    ListBulletsBoldIcon,
    ListOrderedIcon,
    RedoIcon,
    SmallBrushIcon,
    TextStrikethroughLightIcon,
    ToolbarItalicIcon,
    UndoIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Toggle } from '@/components/ui/toggle'

import { THeadingLevel } from '.'
import ActionTooltip from '../action-tooltip'

type ToolbarProps = {
    editor: Editor | null
    toggleHeading: (level: THeadingLevel) => void
    activeHeading: THeadingLevel | null
    isHeadingDisabled?: boolean
    className?: string
    isAllowedHorizontalRule?: boolean
}

type ToolbarItem = {
    id: string
    tooltipContent: string
    icon?: React.ElementType
    command: (editor: Editor) => () => void
    isActiveCheck?: string
    type: 'toggle' | 'button'
    ariaLabel: string
    label?: string
    onPressedChange?: (editor: Editor) => () => void
}

const Toolbar = ({
    editor,
    toggleHeading,
    activeHeading,
    isHeadingDisabled = true,
    className,
    isAllowedHorizontalRule = false,
}: ToolbarProps) => {
    if (!editor) {
        return null
    }

    const toolbarItems: ToolbarItem[] = [
        {
            id: 'italic',
            tooltipContent: 'italic',
            icon: ToolbarItalicIcon,
            command: (editor) => () =>
                editor.chain().focus().toggleItalic().run(),
            isActiveCheck: 'italic',
            type: 'toggle',
            ariaLabel: 'Toggle italic',
        },
        {
            id: 'bold',
            tooltipContent: 'bold',
            icon: FaBoldIcon,
            command: (editor) => () =>
                editor.chain().focus().toggleBold().run(),
            isActiveCheck: 'bold',
            type: 'toggle',
            ariaLabel: 'Toggle Bold',
        },
        {
            id: 'strike',
            tooltipContent: 'strike',
            icon: TextStrikethroughLightIcon,
            command: (editor) => () =>
                editor.chain().focus().toggleStrike().run(),
            isActiveCheck: 'strike',
            type: 'toggle',
            ariaLabel: 'Toggle strikethrough',
        },
        {
            id: 'code',
            tooltipContent: 'code',
            icon: IoIosCodeIcon,
            command: (editor) => () =>
                editor.chain().focus().toggleCode().run(),
            isActiveCheck: 'code',
            type: 'toggle',
            ariaLabel: 'Toggle code inline',
        },
        {
            id: 'bulletList',
            tooltipContent: 'bullet list',
            icon: ListBulletsBoldIcon,
            command: (editor) => () =>
                editor.chain().focus().toggleBulletList().run(),
            isActiveCheck: 'bulletList',
            type: 'toggle',
            ariaLabel: 'Toggle bullet list',
            onPressedChange: (editor) => () =>
                editor.chain().focus().toggleBulletList().run(),
        },
        {
            id: 'orderedList',
            tooltipContent: 'ordered list',
            icon: ListOrderedIcon,
            command: (editor) => () =>
                editor.chain().focus().toggleOrderedList().run(),
            isActiveCheck: 'orderedList',
            type: 'toggle',
            ariaLabel: 'Toggle ordered list',
        },
        {
            id: 'codeBlock',
            tooltipContent: 'code block',
            icon: CodeBlockIcon,
            command: (editor) => () =>
                editor.chain().focus().toggleCodeBlock().run(),
            isActiveCheck: 'codeBlock',
            type: 'button',
            ariaLabel: 'Toggle code block',
        },
        {
            id: 'blockquote',
            tooltipContent: 'block quote',
            icon: BlockQuoteIcon,
            command: (editor) => () =>
                editor.chain().focus().toggleBlockquote().run(),
            isActiveCheck: 'blockquote',
            type: 'button',
            ariaLabel: 'Toggle block quote',
        },
        {
            id: 'clearFormatting',
            tooltipContent: 'Clear formatting',
            icon: SmallBrushIcon,
            command: (editor) => () =>
                editor.chain().focus().clearNodes().run(),
            type: 'toggle',
            ariaLabel: 'Clear formatting',
            label: 'Clear Formatting',
        },
        {
            id: 'undo',
            tooltipContent: 'undo',
            icon: UndoIcon,
            command: (editor) => () => editor.chain().focus().undo().run(),
            type: 'button',
            ariaLabel: 'Undo last action',
        },
        {
            id: 'redo',
            tooltipContent: 'redo',
            icon: RedoIcon,
            command: (editor) => () => editor.chain().focus().redo().run(),
            type: 'button',
            ariaLabel: 'Redo last action',
        },
        {
            id: 'horizontalRule',
            tooltipContent: 'Insert horizontal rule',
            icon: HorizontalRuleIcon,
            command: (editor) => () =>
                editor.chain().focus().setHorizontalRule().run(),
            type: 'button',
            ariaLabel: 'Insert horizontal rule',
            isActiveCheck: 'horizontalRule',
            label: 'Horizontal Rule',
        },
    ]

    return (
        <div
            className={cn(
                `flex w-full min-w-fit flex-wrap space-x-2`,
                className
            )}
        >
            {toolbarItems.map((item) => {
                const IconComponent = item.icon
                const isActive = item.isActiveCheck
                    ? editor.isActive(item.isActiveCheck)
                    : false

                if (item.id === 'horizontalRule' && !isAllowedHorizontalRule) {
                    return null
                }

                if (item.type === 'toggle') {
                    return (
                        <ActionTooltip
                            key={item.id}
                            align="center"
                            side="top"
                            tooltipContent={item.tooltipContent}
                        >
                            <Toggle
                                pressed={isActive}
                                onClick={item.command(editor)}
                                onPressedChange={
                                    item.onPressedChange
                                        ? item.onPressedChange(editor)
                                        : undefined
                                }
                                size="sm"
                                aria-label={item.ariaLabel}
                            >
                                {IconComponent ? (
                                    <IconComponent className="size-4" />
                                ) : (
                                    item.label
                                )}
                            </Toggle>
                        </ActionTooltip>
                    )
                } else {
                    return (
                        <ActionTooltip
                            key={item.id}
                            align="center"
                            side="top"
                            tooltipContent={item.tooltipContent}
                        >
                            <Button
                                type="button"
                                variant={'ghost'}
                                onClick={item.command(editor)}
                                className={cn(isActive && 'is-active')}
                                aria-label={item.ariaLabel}
                            >
                                {IconComponent ? (
                                    <IconComponent className="size-4" />
                                ) : (
                                    item.label
                                )}
                            </Button>
                        </ActionTooltip>
                    )
                }
            })}

            {!isHeadingDisabled && (
                <>
                    {Array.from({ length: 4 }, (_, i) => {
                        const level = (i + 1) as THeadingLevel
                        return (
                            <ActionTooltip
                                key={`h-${level}`}
                                align="center"
                                side="top"
                                tooltipContent={`Heading ${level}`}
                            >
                                <Toggle
                                    onClick={() => toggleHeading(level)}
                                    pressed={
                                        activeHeading === level &&
                                        editor.isFocused
                                    }
                                    size="sm"
                                    aria-label={`Toggle Heading ${level}`}
                                >
                                    {`H${level}`}
                                </Toggle>
                            </ActionTooltip>
                        )
                    })}
                </>
            )}
        </div>
    )
}

export default Toolbar
