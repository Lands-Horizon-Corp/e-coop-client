import * as React from 'react'

import { cn } from '@/helpers'

import { CheckIcon, ChevronDownIcon } from '@/components/icons'
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

interface Props extends Omit<
    React.ComponentPropsWithoutRef<'button'>,
    'onChange'
> {
    value?: number
    disabled?: boolean
    className?: string
    placeholder?: string
    startYear?: number
    endYear?: number
    onChange?: (year: number) => void
}

const generateYears = (start: number, end: number) => {
    const years: number[] = []
    const step = start <= end ? 1 : -1

    for (let y = start; step > 0 ? y <= end : y >= end; y += step) {
        years.push(y)
    }

    return years
}

const YearCombobox = React.forwardRef<HTMLButtonElement, Props>(
    (
        {
            value,
            className,
            disabled = false,
            placeholder = 'Select Year...',
            startYear = 1960,
            endYear = new Date().getFullYear() + 1,
            onChange,
            ...other
        },
        ref
    ) => {
        const [open, setOpen] = React.useState(false)

        const years = React.useMemo(
            () => generateYears(startYear, endYear),
            [startYear, endYear]
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
                        <span>
                            {value ?? (
                                <span className="text-muted-foreground">
                                    {placeholder}
                                </span>
                            )}
                        </span>
                        <ChevronDownIcon className="opacity-50" />
                    </Button>
                </PopoverTrigger>

                <PopoverContent className="max-h-[--radix-popover-content-available-height] w-[--radix-popover-trigger-width] p-0">
                    <Command>
                        <CommandInput
                            className="h-9"
                            placeholder="Search year..."
                        />
                        <CommandList className="ecoop-scroll">
                            <CommandEmpty>No year found.</CommandEmpty>

                            <CommandGroup>
                                {years.map((year) => (
                                    <CommandItem
                                        key={year}
                                        onSelect={() => {
                                            setOpen(false)
                                            onChange?.(year)
                                        }}
                                        value={year.toString()}
                                    >
                                        {year}
                                        <CheckIcon
                                            className={cn(
                                                'ml-auto',
                                                value === year
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

YearCombobox.displayName = 'YearCombobox'

export default YearCombobox
