import { useState } from 'react'

import { cn } from '@/helpers'
import { toReadableDateShort } from '@/helpers/date-utils'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface DateRangePickerProps {
    value?: DateRange
    onChange: (range: DateRange | undefined) => void
    placeholder?: string
    className?: string
}

export function DateRangePicker({
    value,
    onChange,
    placeholder = 'Pick a date range',
    className,
}: DateRangePickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [tempRange, setTempRange] = useState<DateRange | undefined>(value)

    const handleApply = () => {
        onChange(tempRange)
        setIsOpen(false)
    }

    const handleCancel = () => {
        setTempRange(value)
        setIsOpen(false)
    }

    return (
        <Popover onOpenChange={setIsOpen} open={isOpen}>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        'justify-start text-left font-normal',
                        !value && 'text-muted-foreground',
                        className
                    )}
                    variant="outline"
                >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {value?.from ? (
                        value.to ? (
                            <>
                                {toReadableDateShort(value.from)} -{' '}
                                {toReadableDateShort(value.to)}
                            </>
                        ) : (
                            toReadableDateShort(value.from)
                        )
                    ) : (
                        <span>{placeholder}</span>
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
                <Calendar
                    defaultMonth={tempRange?.from || value?.from}
                    mode="range"
                    numberOfMonths={1}
                    onSelect={setTempRange}
                    selected={tempRange}
                />
                <div className="flex items-center gap-2 p-3 border-t">
                    <Button
                        className="flex-1"
                        onClick={handleCancel}
                        size="sm"
                        variant="outline"
                    >
                        Cancel
                    </Button>
                    <Button
                        className="flex-1"
                        disabled={!tempRange?.from || !tempRange?.to}
                        onClick={handleApply}
                        size="sm"
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}
