import * as React from 'react'

import Fuse from 'fuse.js'

import { cn } from '@/helpers/tw-utils'
import { Check } from 'lucide-react'

import { ChevronDownIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { getBarangaysByMunicipalityName, normalizeLocation } from '..'
import { IBarangay } from '../location.types'

interface Props extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'onChange'
> {
    city?: string
    value?: string
    disabled?: boolean
    className?: string
    placeholder?: string
    trigger?: React.ReactNode
    onChange?: (selected: IBarangay) => void
}

const BarangayCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            city,
            value,
            className,
            disabled = false,
            placeholder = 'Select Barangay...',
            trigger,
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)
        const [search, setSearch] = React.useState('')

        const barangays = React.useMemo(() => {
            return getBarangaysByMunicipalityName(normalizeLocation(city || ''))
        }, [city])

        const fuse = React.useMemo(() => {
            if (!barangays.length) return null
            return new Fuse(barangays, {
                keys: ['name'],
                threshold: 0.3,
            })
        }, [barangays])

        const filtered = React.useMemo(() => {
            if (!barangays.length) return []
            if (!search.trim()) return barangays
            if (!fuse) return barangays
            return fuse.search(search).map((r) => r.item)
        }, [search, fuse, barangays])

        const selected = React.useMemo(() => {
            return barangays.find((b) => b.name === value)
        }, [barangays, value])

        const isDisabled = disabled || !city?.trim()

        return (
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    {trigger ? (
                        trigger
                    ) : (
                        <Button
                            {...other}
                            aria-expanded={open}
                            className={cn(
                                'w-full justify-between px-3',
                                className
                            )}
                            disabled={isDisabled}
                            ref={ref}
                            role="combobox"
                            variant="outline"
                        >
                            {selected ? (
                                selected.name
                            ) : (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}
                            <ChevronDownIcon className="opacity-50" />
                        </Button>
                    )}
                </PopoverTrigger>

                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            className="h-9"
                            onValueChange={setSearch}
                            placeholder="Search Barangay..."
                            value={search}
                        />

                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>
                                {!city?.trim()
                                    ? 'Select a city first.'
                                    : 'No barangay found.'}
                            </CommandEmpty>
                            <CommandGroup>
                                {filtered.map((option: IBarangay) => (
                                    <CommandItem
                                        key={option.code}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(option)
                                        }}
                                        value={option.name}
                                    >
                                        {option.name}
                                        <Check
                                            className={cn(
                                                'ml-auto',
                                                value === option.name
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

BarangayCombobox.displayName = 'BarangayCombobox'

export default BarangayCombobox
