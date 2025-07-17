import {
    CaptionLayout,
    DateRange,
    SelectRangeEventHandler,
} from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'

type DateRangePickerProps = {
    toYear?: number
    value: DateRange | undefined
    fromYear?: number
    modal?: boolean
    captionLayout?: CaptionLayout
    disabled?: (date: Date) => boolean
    onChange: SelectRangeEventHandler | undefined
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
            mode="range"
            toYear={toYear}
            showOutsideDays
            selected={value}
            fromYear={fromYear}
            onSelect={onChange}
            disabled={disabled}
        />
    )
}

export default DateRangePicker
