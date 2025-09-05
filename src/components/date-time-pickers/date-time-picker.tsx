import { useState } from 'react'

import DateTimeSetter from '@/components/date-time-pickers/date-time-setter'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'

export type CaptionLayout =
    | 'label'
    | 'dropdown'
    | 'dropdown-months'
    | 'dropdown-years'

type DateTimePickerProps = {
    fromYear?: number
    toYear?: number
    className?: string
    value: Date | undefined
    captionLayout?: CaptionLayout
    disabled?: (date: Date) => boolean
    onChange: (date: Date | undefined) => void
}

const DateTimePicker = ({
    toYear = new Date().getFullYear(),
    value,
    fromYear,
    onChange,
    disabled,
    ...other
}: DateTimePickerProps) => {
    const [selected, setSelected] = useState(value)

    return (
        <div>
            <Calendar
                {...other}
                mode="single"
                toYear={toYear}
                showOutsideDays
                selected={selected}
                fromYear={fromYear}
                onSelect={setSelected}
                disabled={disabled}
            />
            <div className="flex w-full gap-x-2 px-2 pb-2">
                {selected !== undefined && (
                    <div className="flex w-full flex-col space-y-1">
                        <p className="text-xs text-foreground/70">Time</p>
                        <DateTimeSetter
                            date={selected}
                            onChange={setSelected}
                        />
                    </div>
                )}
            </div>
            <div className="flex w-full justify-end px-2 pb-2">
                <Button onClick={() => onChange(selected)} className="">
                    Apply
                </Button>
            </div>
        </div>
    )
}

export default DateTimePicker
