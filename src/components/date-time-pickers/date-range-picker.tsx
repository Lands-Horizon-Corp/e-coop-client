import { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'

import { CaptionLayout } from './date-time-picker'

type DateRangePickerProps = {
    value: DateRange | undefined
    modal?: boolean
    captionLayout?: CaptionLayout
    disabled?: boolean
    onChange: (range: DateRange | undefined) => void
}

const DateRangePicker = ({
    value,
    onChange,
    disabled,
    ...other
}: DateRangePickerProps) => {
    return (
        <Calendar
            {...other}
            required
            mode="range"
            showOutsideDays
            selected={value}
            disabled={disabled}
            onSelect={onChange}
        />
    )
}

export default DateRangePicker
