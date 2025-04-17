import { differenceInHours, differenceInMinutes } from 'date-fns'

export const getTimeDifference = (fromDate: Date, currentDate: Date) => {
    const minutes = differenceInMinutes(currentDate, fromDate)

    if (minutes < 60) {
        return `${minutes}min`
    }

    const hours = differenceInHours(currentDate, fromDate)
    return `${hours}h`
}
