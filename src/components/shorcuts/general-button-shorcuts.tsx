import { ReactNode, useMemo } from 'react'
import { useEffect, useState } from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    MagnifyingGlassIcon,
    MagnifyingGlassIcon as SearchIcon,
} from '@/components/icons'
import { CommandIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import useDebounce from '@/hooks/use-debounce'
import { useModalState } from '@/hooks/use-modal-state'

import { highlightMatch } from '../../modules/approvals/components/kanbans/journal-voucher/journal-voucher-kanban-main'
import Modal from '../modals/modal'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '../ui/empty'
import { Kbd } from '../ui/kbd'
import { ShortcutsData } from './general-shorcuts-data'
import { TGroupShorcuts } from './general-shorcuts.type'

interface ShortcutItemProps {
    icon?: ReactNode
    text?: string
    shortcut?: string
    description?: string
    search: string
}

const ShortcutItem = ({
    icon,
    text,
    shortcut,
    description,
    search,
}: ShortcutItemProps) => {
    return (
        <div
            className={cn(
                'relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none',
                'aria-selected:bg-accent aria-selected:text-accent-foreground',
                'hover:!bg-transparent' // Custom styling to disable hover
            )}
        >
            <div className="flex-none w-5 h-5 mr-2">{icon}</div>
            <div className="flex-1 overflow-hidden whitespace-nowrap text-ellipsis">
                {text && (
                    <span className="font-medium text-wrap">
                        {highlightMatch(text, search)}
                    </span>
                )}
                {description && (
                    <span className="text-xs italic text-wrap text-muted-foreground ml-2">
                        {highlightMatch(description, search)}
                    </span>
                )}
            </div>
            <div className="flex-none ml-auto text-xs text-muted-foreground">
                {shortcut && <Kbd>{highlightMatch(shortcut, search)}</Kbd>}
            </div>
        </div>
    )
}

const GeneralButtonShortcuts = ({ className }: { className?: string }) => {
    const { open, onOpenChange } = useModalState()
    const [searchTerm, setSearchTerm] = useState('')

    useHotkeys(
        'control+J',
        (e) => {
            onOpenChange(!open)
            e.preventDefault()
        },
        {
            keydown: true,
        }
    )

    const fuse = useMemo(
        () =>
            new Fuse<TGroupShorcuts>(ShortcutsData, {
                keys: [
                    'title',
                    'items.title',
                    'items.description',
                    'items.text',
                    'items.shorcut',
                ],
                includeScore: true,
                threshold: 0.2,
                includeMatches: true,
                findAllMatches: true,
            }),
        [ShortcutsData]
    )
    const filteredGroupShorcuts = useMemo(() => {
        let filtered = ShortcutsData
        if (searchTerm.trim()) {
            filtered = fuse.search(searchTerm).map((r) => r.item)
        }

        return [...filtered].sort((a, b) => {
            const aLength = a.items?.length || 0
            const bLength = b.items?.length || 0
            return bLength - aLength
        })
    }, [searchTerm, fuse])

    return (
        <div className={cn('w-fit ', className)}>
            <Button
                className="hover:!bg-transparent text-muted-foreground/70 h-9 rounded-full"
                onClick={() => onOpenChange(!open)}
                size="sm"
                variant="outline"
            >
                <CommandIcon />
            </Button>
            <Modal
                className="min-w-fit lg:min-w-[1200px] h-fit bg-background border-border text-foreground p-6 -space-y-3 flex flex-col"
                description="Here are some useful keyboard shortcuts to help you navigate and perform actions quickly."
                descriptionClassName="text-sm text-center text-muted-foreground"
                onOpenChange={onOpenChange}
                open={open}
                title="All Keyboard Shortcuts"
                titleClassName="text-lg font-semibold text-center"
            >
                <div className="-translate-y-5">
                    <GeneralShorcutsSearch setSearchTerm={setSearchTerm} />
                    {/* Main Content Area - Columns */}
                    <div className="flex-1 bg-sidebar/50 mt-3 p-5 rounded-xl grid grid-cols-1 lg:grid-cols-3 gap-3 ecoop-scroll overflow-y-auto">
                        {!filteredGroupShorcuts.length && (
                            <Empty className="sticky top-0 col-span-3">
                                <EmptyHeader>
                                    <EmptyMedia variant="icon">
                                        <MagnifyingGlassIcon />
                                    </EmptyMedia>
                                    <EmptyTitle className="text-sm">
                                        No Shortcuts Found
                                    </EmptyTitle>
                                    <EmptyDescription>
                                        No shortcut commands match "{' '}
                                        <Kbd>{searchTerm}</Kbd> "
                                    </EmptyDescription>
                                </EmptyHeader>
                            </Empty>
                        )}
                        {filteredGroupShorcuts.map((category, index) => (
                            <div
                                className="p-2 bg-card rounded-2xl"
                                key={index}
                            >
                                <h2 className="text-sm text-center text-muted-foreground font-medium mb-2">
                                    {category.title &&
                                        highlightMatch(
                                            category.title,
                                            searchTerm
                                        )}
                                </h2>
                                <div className="space-y-1">
                                    {category.items.map((item, itemIndex) => (
                                        <ShortcutItem
                                            key={itemIndex}
                                            search={searchTerm}
                                            {...item}
                                        />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Bottom Panel */}
                    <div className="flex-none hidden pt-4 mt-6 border-t border-border justify-between items-center text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                            <span>Single-character shortcuts</span>
                            {/* You would add a switch component here */}
                            <div className="w-10 h-5 bg-muted rounded-full"></div>
                        </div>
                        <div>Pin keyboard shortcut help</div>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default GeneralButtonShortcuts

type GeneralLedgerShorcutsProps = {
    setSearchTerm: (term: string) => void
}

const GeneralShorcutsSearch = ({
    setSearchTerm,
}: GeneralLedgerShorcutsProps) => {
    const [inputValue, setInputValue] = useState('')

    const debounceSearchTerm = useDebounce(inputValue, 200)

    useEffect(() => {
        setSearchTerm(debounceSearchTerm)
    }, [debounceSearchTerm, setSearchTerm])

    useHotkeys(
        'enter',
        (e) => {
            e.preventDefault()
            const searchInput = document.querySelector(
                'input[placeholder*="Search"]'
            ) as HTMLInputElement
            if (searchInput) {
                searchInput.focus()
            }
        },
        {
            keydown: true,
            keyup: true,
        }
    )

    return (
        <div className="relative flex-1 max-w-2xl mx-auto">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
                className="pl-12 pr-4 py-3 text-lg border-2 focus:border-primary/50"
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Search organizations, branches, or locations..."
                value={inputValue}
            />
        </div>
    )
}
