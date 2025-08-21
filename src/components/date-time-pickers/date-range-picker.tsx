import { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'

type DateRangePickerProps = {
    toYear?: number
    value: DateRange | undefined
    fromYear?: number
    modal?: boolean
    captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
    disabled?: (date: Date) => boolean
    onChange: (range: DateRange) => void
}

const DateRangePicker = ({
    toYear = new Date().getFullYear(),
    value,
    fromYear,
    onChange,
    disabled,
    ...other
}: DateRangePickerProps) => {
    return (
        <Calendar
            {...other}
            required
            mode="range"
            endMonth={new Date(toYear)}
            showOutsideDays
            selected={value}
            startMonth={fromYear ? new Date(fromYear) : new Date()}
            disabled={disabled}
            onSelect={onChange}
        />
    )
}

export default DateRangePicker
