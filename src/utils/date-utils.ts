import { format } from 'date-fns'
import { CalendarDate } from '@internationalized/date'

export const toReadableDate = (
    inputDate: Date | string | number,
    fmt = 'MMMM d yyyy'
) => {
    return format(inputDate, fmt)
}

export const formatCalendarDate = (date: CalendarDate, fmt = 'MM-dd-yyyy') => {
    const jsDate = new Date(date.toString())
    return format(jsDate, fmt)
}
