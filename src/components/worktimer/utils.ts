import {
    differenceInHours,
    differenceInMinutes,
    differenceInSeconds,
} from 'date-fns'

export const getTimeDifference = (
    fromDate: Date | string,
    currentDate: Date | string
) => {
    const hours = differenceInHours(currentDate, fromDate)
    const minutes = differenceInMinutes(currentDate, fromDate) - hours * 60
    const seconds =
        differenceInSeconds(currentDate, fromDate) -
        (hours * 3600 + minutes * 60)
    return { hours, minutes, seconds }
}
