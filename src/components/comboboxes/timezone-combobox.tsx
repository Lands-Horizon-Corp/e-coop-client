import { forwardRef, useMemo, useState } from 'react'

import Fuse from 'fuse.js'

import TimeZoneData from '@/helpers/time-zones/timeZones.json'
import { cn } from '@/helpers/tw-utils'

import { CheckIcon, ChevronDownIcon, ClockIcon } from '@/components/icons'
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

type TTimezoneMeta = {
    u?: number
    r?: number
}

type TTimezoneOption = {
    label: string
    offsetLabel: string
    value: string
}

interface Props extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'onChange' | 'value'
> {
    value?: string
    disabled?: boolean
    className?: string
    placeholder?: string
    onChange?: (selected: string) => void
}

const formatUtcOffset = (minutes: number | undefined): string => {
    if (typeof minutes !== 'number') {
        return 'UTC'
    }

    const sign = minutes >= 0 ? '+' : '-'
    const absoluteMinutes = Math.abs(minutes)
    const hours = Math.floor(absoluteMinutes / 60)
    const mins = absoluteMinutes % 60

    return `UTC${sign}${String(hours).padStart(2, '0')}:${String(mins).padStart(2, '0')}`
}

const TimezoneCombobox = forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select timezone...',
            onChange,
            ...other
        },
        ref
    ) => {
        const [search, setSearch] = useState('')
        const [open, setOpen] = useState(false)

        const timezoneOptions = useMemo<TTimezoneOption[]>(() => {
            const timezones = Object.entries(
                TimeZoneData as Record<string, TTimezoneMeta>
            )
                .filter(([, timezoneMeta]) => timezoneMeta.r !== 1)
                .map(([timezone, timezoneMeta]) => ({
                    label: timezone.replace(/_/g, ' '),
                    offsetLabel: formatUtcOffset(timezoneMeta.u),
                    value: timezone,
                }))

            return timezones.sort((a, b) => a.value.localeCompare(b.value))
        }, [])

        const fuse = useMemo(
            () =>
                new Fuse(timezoneOptions, {
                    keys: [
                        { name: 'value', weight: 3 },
                        { name: 'label', weight: 2 },
                        { name: 'offsetLabel', weight: 1 },
                    ],
                    threshold: 0.25,
                }),
            [timezoneOptions]
        )

        const filteredTimezones = useMemo(() => {
            if (!search.trim()) {
                return timezoneOptions
            }

            return fuse.search(search).map((result) => result.item)
        }, [search, fuse, timezoneOptions])

        const selectedTimezone = useMemo(
            () => timezoneOptions.find((timezone) => timezone.value === value),
            [timezoneOptions, value]
        )

        return (
            <Popover modal onOpenChange={setOpen} open={open}>
                <PopoverTrigger asChild>
                    <Button
                        {...other}
                        aria-expanded={open}
                        className={cn('w-full justify-between px-3', className)}
                        disabled={disabled}
                        ref={ref}
                        role="combobox"
                        type="button"
                        variant="outline"
                    >
                        {selectedTimezone ? (
                            <span className="flex min-w-0 items-center gap-2">
                                <ClockIcon className="shrink-0 text-muted-foreground" />
                                <span className="truncate text-left">
                                    {selectedTimezone.value}
                                </span>
                            </span>
                        ) : (
                            <span className="truncate text-muted-foreground">
                                {placeholder}
                            </span>
                        )}
                        <ChevronDownIcon className="shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command shouldFilter={false}>
                        <CommandInput
                            className="h-9"
                            onValueChange={setSearch}
                            placeholder="Search timezone..."
                            value={search}
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>No timezone found.</CommandEmpty>
                            <CommandGroup>
                                {filteredTimezones.map((timezone) => (
                                    <CommandItem
                                        className="gap-2"
                                        key={timezone.value}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(timezone.value)
                                        }}
                                        value={timezone.value}
                                    >
                                        <span className="min-w-0 flex-1 truncate">
                                            {timezone.value}
                                        </span>
                                        <span className="shrink-0 text-xs text-muted-foreground">
                                            {timezone.offsetLabel}
                                        </span>
                                        <CheckIcon
                                            className={cn(
                                                'ml-1 shrink-0',
                                                value === timezone.value
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

TimezoneCombobox.displayName = 'TimezoneCombobox'

export default TimezoneCombobox
