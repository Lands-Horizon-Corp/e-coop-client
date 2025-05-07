import { Fragment, useEffect, useState } from 'react'

import {
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandDialog,
    CommandShortcut,
    CommandSeparator,
} from '@/components/ui/command'
import { Button } from '@/components/ui/button'
import { MagnifyingGlassIcon } from '@/components/icons'

import { TQuickSearchGroup } from './types'

interface Props {
    groups: TQuickSearchGroup[]
}

const AppSidebarQruickNavigate = ({ groups }: Props) => {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === 'j' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener('keydown', down)
        return () => document.removeEventListener('keydown', down)
    }, [])

    return (
        <>
            <Button
                size="sm"
                variant="ghost"
                onClick={() => setOpen((prev) => !prev)}
                className="group/quick-search w-full gap-x-2 text-xs font-normal text-muted-foreground/80 hover:text-foreground"
            >
                Quick Navigate
                <MagnifyingGlassIcon className="inline text-muted-foreground/60 duration-500 ease-out group-hover/quick-search:text-foreground" />
                <CommandShortcut className="rounded-md bg-secondary p-1">
                    <span className="text-xs">⌘</span>J
                </CommandShortcut>
            </Button>
            <CommandDialog
                open={open}
                onOpenChange={setOpen}
                contentClassName="rounded-2xl"
                overlayClassName="backdrop-blur-sm text-gray-400"
            >
                <CommandInput placeholder="Search or navigate to..." />
                <CommandList className="ecoop-scroll">
                    <CommandEmpty>No results found.</CommandEmpty>
                    {groups.map((group, index) => {
                        return (
                            <Fragment key={group.title}>
                                <CommandGroup heading={group.title}>
                                    {group.items.map((groupItem) => (
                                        <CommandItem
                                            key={groupItem.url}
                                            onSelect={() => {
                                                groupItem.onClick?.(groupItem)
                                                setOpen(false)
                                            }}
                                            className="group items-start gap-x-2 rounded-xl !px-3 text-sm font-normal"
                                        >
                                            {groupItem.icon && (
                                                <groupItem.icon className="text-foreground/50 delay-150 duration-200 ease-out group-hover:text-foreground" />
                                            )}
                                            <div className="space-y-1">
                                                <p>{groupItem.title}</p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    {groupItem.url}
                                                </p>
                                            </div>
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                                {groups.length > 0 &&
                                    groups.length - 1 === index && (
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
