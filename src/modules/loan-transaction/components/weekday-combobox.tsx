import * as React from 'react'

import { cn } from '@/helpers'
import { TWeekdays } from '@/modules/loan-transaction'
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

import { WEEKDAYS } from '../loan.constants'

// Assuming this is where your type and const are

interface Props {
    id?: string
    name?: string
    value?: TWeekdays
    disabled?: boolean
    className?: string
    placeholder?: string
    weekdays?: TWeekdays[]
    onChange?: (selected: TWeekdays) => void
}

const WeekdayCombobox = ({
    value,
    className,
    disabled = false,
    placeholder = 'Select Relationship...',
    weekdays = WEEKDAYS as unknown as TWeekdays[],
    onChange,
    ...other
}: Props) => {
    const [open, setOpen] = React.useState(false)

    return (
        <Popover modal open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    {...other}
                    type="button"
                    role="combobox"
                    variant="outline"
                    disabled={disabled}
                    aria-expanded={open}
                    className={cn('w-full justify-between px-3', className)}
                >
                    <span className="capitalize">
                        {value || (
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
                        placeholder="Search Relationship..."
                        className="h-9"
                    />
                    <CommandList className="ecoop-scroll">
                        <CommandEmpty>No relationship found.</CommandEmpty>
                        <CommandGroup>
                            {weekdays.map((weekday) => (
                                <CommandItem
                                    key={weekday}
                                    value={weekday}
                                    onSelect={() => {
                                        setOpen(false)
                                        onChange?.(weekday)
                                    }}
                                >
                                    <span className="capitalize">
                                        {weekday}
                                    </span>
                                    <Check
                                        className={cn(
                                            'ml-auto',
                                            value === weekday
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

export default WeekdayCombobox
