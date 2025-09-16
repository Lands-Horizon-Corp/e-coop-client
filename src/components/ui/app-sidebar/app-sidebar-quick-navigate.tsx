import { Fragment, useState } from 'react'

import { Link } from '@tanstack/react-router'

import { ArrowRight } from 'lucide-react'
import { useHotkeys } from 'react-hotkeys-hook'

import { MagnifyingGlassIcon } from '@/components/icons'
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

import { TQuickSearchGroup } from './types'

interface Props {
    groups: TQuickSearchGroup[]
}

const AppSidebarQruickNavigate = ({ groups }: Props) => {
    const [open, setOpen] = useState(false)

    useHotkeys(
        'control+Q, Alt+Q, meta+Q, command+Q, Q',
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
                size="sm"
                variant="ghost"
                onClick={() => setOpen((prev) => !prev)}
                className="group/quick-search w-full gap-x-2 text-xs font-normal text-muted-foreground/80 hover:text-foreground"
            >
                Quick Navigate
                <MagnifyingGlassIcon className="inline text-muted-foreground/60 duration-500 ease-out group-hover/quick-search:text-foreground" />
                <CommandShortcut className="rounded-md bg-secondary p-1">
                    <span className="text-xs">⌘</span>Q
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
                                            <div className="flex-1 space-y-1">
                                                <p>{groupItem.title}</p>
                                                <p className="text-xs text-muted-foreground/70">
                                                    {groupItem.shortDescription}
                                                </p>
                                            </div>
                                            <div className="w-fit">
                                                <Link
                                                    target="_blank"
                                                    to={groupItem.url}
                                                    onClick={(e) =>
                                                        e.stopPropagation()
                                                    }
                                                    className="text-xs text-muted-foreground duration-200 hover:text-foreground"
                                                >
                                                    Open new tab{' '}
                                                    <ArrowRight className="inline !size-3 -rotate-45" />
                                                </Link>
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
