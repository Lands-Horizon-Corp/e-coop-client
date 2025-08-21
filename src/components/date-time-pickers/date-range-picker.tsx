import { DateRange } from 'react-day-picker'

import { Calendar } from '@/components/ui/calendar'

type DateRangePickerProps = {
    value: DateRange | undefined
    modal?: boolean
    captionLayout?: 'label' | 'dropdown' | 'dropdown-months' | 'dropdown-years'
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
