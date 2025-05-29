import { format } from 'date-fns'

// TO REMOVE IF NOT USED
import { CalendarDate } from '@internationalized/date'

export const toReadableDate = (
    inputDate: Date | string | number,
    fmt = 'MMMM d yyyy'
) => {
    return format(inputDate, fmt)
}

export const toReadableDateTime = (
    ...args: Parameters<typeof toReadableDate>
) => {
    return toReadableDate(args[0], args[1] ?? "MMM dd yyyy 'at' hh:mm a")
}

// TO REMOVE IF NOT USED
export const formatCalendarDate = (date: CalendarDate, fmt = 'MM-dd-yyyy') => {
    const jsDate = new Date(date.toString())
    return format(jsDate, fmt)
}
