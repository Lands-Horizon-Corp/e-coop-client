import { Fragment, useEffect, useMemo, useRef, useState } from 'react'

import { Link } from '@tanstack/react-router'
import Fuse from 'fuse.js'

import { useHotkeys } from 'react-hotkeys-hook'

import { ArrowRightIcon, MagnifyingGlassIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from '@/components/ui/command'

import { useSidebar } from '../sidebar'
import { TQuickSearchGroup } from './types'

interface Props {
    groups: TQuickSearchGroup[]
}

const AppSidebarQruickNavigate = ({ groups }: Props) => {
    const { open: sidebarOpen } = useSidebar()
    const [open, setOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const commandListRef = useRef<HTMLDivElement>(null)

    // Flatten all items from all groups for search
    const allItems = useMemo(() => {
        return groups.flatMap((group) =>
            group.items.map((item) => ({
                ...item,
                groupTitle: group.title,
            }))
        )
    }, [groups])

    // Configure Fuse.js for fuzzy search
    const fuse = useMemo(() => {
        return new Fuse(allItems, {
            keys: [
                { name: 'title', weight: 0.7 },
                // { name: 'shortDescription', weight: 0.2 },
                // { name: 'longDescription', weight: 0.1 },
                { name: 'groupTitle', weight: 0.1 },
            ],
            threshold: 0.4, // Lower = more strict matching
            includeScore: true,
            minMatchCharLength: 1,
        })
    }, [allItems])

    // Get filtered and sorted results
    const filteredGroups = useMemo(() => {
        if (!searchQuery.trim()) {
            return groups
        }

        const results = fuse.search(searchQuery)

        // Group results by their original group
        const groupedResults = results.reduce(
            (acc, result) => {
                const item = result.item
                const groupTitle = item.groupTitle

                if (!acc[groupTitle]) {
                    acc[groupTitle] = {
                        title: groupTitle,
                        items: [],
                    }
                }

                acc[groupTitle].items.push({
                    ...item,
                })

                return acc
            },
            {} as Record<string, TQuickSearchGroup>
        )

        return Object.values(groupedResults)
    }, [searchQuery, fuse, groups])

    // Reset scroll position when search results change
    useEffect(() => {
        if (commandListRef.current) {
            commandListRef.current.scrollTop = 0
        }
    }, [filteredGroups])

    useHotkeys(
        'control+Q, Alt+Q, meta+Q, command+Q',
        (e) => {
            e.preventDefault()
            setOpen((open) => !open)
        },
        {
            keydown: true,
        }
    )

    return (
        <>
            <Button
                className="group/quick-search w-full gap-x-2 text-xs font-normal text-primary-foreground/90 hover:text-primary-foreground"
                onClick={() => setOpen((prev) => !prev)}
                size="sm"
            >
                <MagnifyingGlassIcon className="inline duration-500 ease-out group-hover/quick-search:text-foreground" />
                {sidebarOpen && (
                    <>
                        Quick Navigate
                        <CommandShortcut className="rounded-md bg-secondary p-1">
                            <span className="text-xs">⌘</span>Q
                        </CommandShortcut>
                    </>
                )}
            </Button>
            <CommandDialog
                contentClassName="rounded-2xl"
                onOpenChange={(open) => {
                    setOpen(open)
                    if (!open) {
                        setSearchQuery('')
                    }
                }}
                open={open}
                overlayClassName="backdrop-blur-sm text-gray-400"
            >
                <CommandInput
                    onValueChange={setSearchQuery}
                    placeholder="Search or navigate to..."
                    value={searchQuery}
                />
                <CommandList className="ecoop-scroll" ref={commandListRef}>
                    <CommandEmpty>No results found.</CommandEmpty>
                    {filteredGroups.map((group, index) => {
                        return (
                            <Fragment key={group.title}>
                                <CommandGroup heading={group.title}>
                                    {group.items.map((groupItem) => (
                                        <CommandItem
                                            className="group items-start gap-x-2 rounded-xl !px-3 text-sm font-normal"
                                            key={groupItem.url}
                                            onSelect={() => {
                                                groupItem.onClick?.(groupItem)
                                                setOpen(false)
                                            }}
                                        >
                                            {groupItem.icon && (
                                                <groupItem.icon className="text-foreground/50 delay-150 duration-200 ease-out group-hover:text-foreground" />
                                            )}
                                            <div className="flex-1 space-y-1">
                                                <p>{groupItem.title}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {groupItem.shortDescription ||
                                                        'sa'}
                                                </p>
                                            </div>
                                            <div className="w-fit">
                                                <Link
                                                    className="text-xs text-muted-foreground duration-200 hover:text-foreground"
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    target="_blank"
                                                    to={groupItem.url}
                                                >
                                                    Open new tab{' '}
                                                    <ArrowRightIcon className="inline !size-3 -rotate-45" />
                                                </Link>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                {filteredGroups.length > 0 &&
                                    filteredGroups.length - 1 !== index && (
                                        <CommandSeparator />
                                    )}
                            </Fragment>
                        )
                    })}
                </CommandList>
            </CommandDialog>
        </>
    )
}

export default AppSidebarQruickNavigate
