import { format } from 'date-fns'

export const toReadableDateShort = (
    inputDate: Date | string | number,
    fmt = 'MMM d yyyy'
) => {
    return format(inputDate, fmt)
}

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

export const toDateTimeFormatFile = (
    ...args: Parameters<typeof toReadableDate>
) => {
    return toReadableDate(args[0], args[1] ?? 'yyyyMMdd_HHmmss')
}

export const toInputDateString = (
    ...args: Parameters<typeof toReadableDate>
) => {
    return toReadableDate(args[0], args[1] ?? 'yyyy-MM-dd')
}
