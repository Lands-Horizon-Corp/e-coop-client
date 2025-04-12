import { format } from 'date-fns'

export const toReadableDate = (
    inputDate: Date | string | number,
    fmt = 'MMMM d yyyy'
) => {
    return format(inputDate, fmt)
}
