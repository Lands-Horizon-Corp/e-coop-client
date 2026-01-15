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

export const stringNormalizer = (values: string) => {
    return values
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .replace(' ', '_')
}

export const compareIgnoreCase = (str1: string, str2: string) => {
    return stringNormalizer(str1) === stringNormalizer(str2)
}
