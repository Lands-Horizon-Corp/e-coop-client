import * as React from 'react'
import { Check } from 'lucide-react'

import {
    Command,
    CommandItem,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandInput,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { ChevronDownIcon, IconMap } from '@/components/icons'

import { cn } from '@/lib/utils'

import { TIcon } from '@/types'

interface Props {
    value?: TIcon
    disabled?: boolean
    className?: string
    placeholder?: string
    onChange?: (selected: TIcon | undefined) => void
}

const IconCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select an icon...',
            onChange,
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)

        const selectedIcon = React.useMemo(() => {
            if (!value) return undefined
            const foundIcon = IconMap[value]

            if (foundIcon === undefined) return undefined

            return { name: value, icon: foundIcon }
        }, [value])

        return (
            <Popover modal open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        ref={ref}
                        role="combobox"
                        variant="outline"
                        aria-expanded={open}
                        disabled={disabled}
                        className={cn('w-full justify-between px-3', className)}
                    >
                        {selectedIcon !== undefined ? (
                            <>
                                <selectedIcon.icon className="shrink-0 text-muted-foreground" />
                                <span>{selectedIcon.name}</span>
                            </>
                        ) : (
                            <p className="truncate text-muted-foreground">
                                {placeholder}
                            </p>
                        )}
                        <ChevronDownIcon className="shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            placeholder={placeholder}
                            className="h-9"
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>No Bank found.</CommandEmpty>
                            <CommandGroup>
                                {Object.entries(IconMap).map(([name, Icon]) => (
                                    <CommandItem
                                        key={name}
                                        value={name}
                                        className="group cursor-pointer"
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(name as TIcon)
                                        }}
                                    >
                                        <Icon className="mr-1 !size-5 text-muted-foreground duration-300 ease-in-out group-hover:text-foreground" />
                                        <span className="text-muted-foreground duration-200 group-hover:text-foreground">
                                            {name}
                                        </span>
                                        <Check
                                            className={cn(
                                                'ml-auto',
                                                value === name
                                                    ? 'opacity-100'
                                                    : 'opacity-0'
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
        )
    }
)

IconCombobox.displayName = 'IconCombobox'

export default IconCombobox
