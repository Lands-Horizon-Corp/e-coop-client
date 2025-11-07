import axios from 'axios'

export const randomChoose = <T>(data: Array<T>) => {
    return data[~~(Math.random() * data.length)]
}

export const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString()
}

export const isDate = (value: unknown): boolean => {
    return value instanceof Date && value !== null && value !== undefined
}

export const isNumber = (value: unknown): boolean => {
    return (
        typeof value === 'number' &&
        !isNaN(value) &&
        value !== null &&
        value !== undefined
    )
}

export const isObject = (value: unknown): boolean => {
    return typeof value === 'object' && value !== null && value !== undefined
}

export const isString = (value: unknown): boolean => {
    return (
        typeof value === 'string' &&
        value !== '' &&
        value !== null &&
        value !== undefined
    )
}

export const isArray = (value: unknown): boolean => {
    return Array.isArray(value) && value !== null && value !== undefined
}

export const isBoolean = (value: unknown): boolean => {
    return typeof value === 'boolean' && value !== null && value !== undefined
}

export const commaSeparators = (num: number | string): string => {
    const numStr = num.toString()
    const numParts = numStr.split('.')
    numParts[0] = numParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return numParts.join('.')
}

export const removeCommaSeparators = (num: string): number => {
    return parseInt(num.replace(/,/g, ''))
}

export const sanitizeNumberInput = (value: string) => {
    return value.replace(/,/g, '').trim()
}

export const isValidDecimalInput = (value: string) => {
    return (
        /^-?\d*\.?\d{0,2}$/.test(value) &&
        (value.match(/\./g)?.length ?? 0) <= 1
    )
}

export const downloadFile = async (url: string, fileName: string) => {
    try {
        const response = await axios.get(url, {
            responseType: 'blob',
        })

        const blob = new Blob([response.data])
        const blobUrl = URL.createObjectURL(blob)

        const a = document.createElement('a')
        a.href = blobUrl
        a.download = fileName || 'download'
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)

        URL.revokeObjectURL(blobUrl)
    } catch (error) {
        console.error('Download failed:', error)
    }
}

export const capitalize = (text: string) =>
    text && String(text[0]).toUpperCase() + String(text).slice(1)

export type SortOrder = 'asc' | 'desc'
/**
 * Generic sorter helper for arrays of objects.
 *
 * @param key - The key of the object to sort by.
 * @param order - 'asc' (default) or 'desc'.
 *
 * @example
 * items.sort(sortBy('name'))
 * items.sort(sortBy('createdAt', 'desc'))
 */
export function sortBy<T>(
    key: keyof T,
    order: SortOrder = 'asc'
): (a: T, b: T) => number {
    return (a, b) => {
        const valA = a[key]
        const valB = b[key]

        if (valA === valB) return 0

        const direction = order === 'asc' ? 1 : -1

        // Handle different value types
        if (typeof valA === 'string' && typeof valB === 'string') {
            return valA.localeCompare(valB) * direction
        }

        if (typeof valA === 'number' && typeof valB === 'number') {
            return (valA - valB) * direction
        }

        if (valA instanceof Date && valB instanceof Date) {
            return (valA.getTime() - valB.getTime()) * direction
        }

        return 0
    }
}
