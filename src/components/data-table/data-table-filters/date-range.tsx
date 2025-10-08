import { useState } from 'react'

import { cn } from '@/helpers/tw-utils'
import { format, isAfter } from 'date-fns'
import { type DateRange } from 'react-day-picker'

import DateRangePicker from '@/components/date-time-pickers/date-range-picker'
import { CalendarIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import DateTimeSetter from '../../date-time-pickers/date-time-setter'

const isObject = (value: unknown): boolean => {
    return typeof value === 'object' && value !== null && value !== undefined
}

type DateRangeProps = {
    modal?: boolean
    value: DateRange
    withTimePick?: boolean
    disabled?: boolean
    onChange: (range: { from: Date; to?: Date }) => void
}

const DateRange = ({
    value,
    onChange,
    modal = false,
    withTimePick = false,
    ...other
}: DateRangeProps) => {
    const [selected, setSelected] = useState<DateRange | undefined>(value)

    const isInvalid =
        selected === undefined ||
        !isObject(selected) ||
        selected.from === undefined ||
        selected.to === undefined ||
        isAfter(selected.from, selected.to) ||
        (selected.from === value.from && selected.to === value.to)

    return (
        <Popover modal={modal}>
            <PopoverTrigger asChild>
                <Button
                    className={cn(
                        'w-full pl-3 text-left font-normal',
                        !value && 'text-muted-foreground'
                    )}
                    variant={'outline'}
                >
                    {value?.from
                        ? format(value.from, 'MMM dd yyyy')
                        : 'choose from'}{' '}
                    {' - '}
                    {value?.to
                        ? format(value.to, 'MMM dd yyyy')
                        : 'choose to'}{' '}
                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent
                align="start"
                className="w-auto rounded-2xl overflow-clip bg-popover/85 p-0 backdrop-blur"
            >
                <DateRangePicker
                    {...other}
                    onChange={(range) => setSelected(range)}
                    value={selected}
                />

                {withTimePick && (
                    <div className="flex w-full gap-x-2 px-2 pb-2">
                        {selected?.from && (
                            <div className="flex w-full flex-col space-y-1">
                                <p className="text-xs text-foreground/70">
                                    From
                                </p>
                                <DateTimeSetter
                                    date={selected.from}
                                    onChange={(newDate) => {
                                        setSelected((prev) => ({
                                            ...prev,
                                            from: newDate,
                                        }))
                                    }}
                                />
                            </div>
                        )}
                        {selected?.to && (
                            <div className="flex w-full flex-col space-y-1">
                                <p className="text-xs text-foreground/70">To</p>
                                <DateTimeSetter
                                    date={selected.to}
                                    onChange={(newDate) => {
                                        setSelected((prev) =>
                                            prev
                                                ? {
                                                      ...prev,
                                                      to: newDate,
                                                  }
                                                : {
                                                      from: undefined,
                                                      to: newDate,
                                                  }
                                        )
                                    }}
                                />
                            </div>
                        )}
                    </div>
                )}
                <div className="flex w-full justify-end px-2 pb-2">
                    <Button
                        className=""
                        disabled={isInvalid}
                        onClick={() =>
                            onChange(
                                selected as unknown as {
                                    from: Date
                                    to?: Date | undefined
                                }
                            )
                        }
                    >
                        Apply
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DateRange
