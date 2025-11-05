import { compareAsc, compareDesc, parseISO, startOfDay } from 'date-fns'
import { formatInTimeZone, toDate } from 'date-fns-tz'

import { ICurrency } from './currency.types'

export interface ICurrencyFormatOptions {
    /**
     * Whether to show the currency symbol (e.g., $, €, ¥)
     * @default true
     */
    showSymbol?: boolean
    /**
     * Optional currency configuration object
     */
    currency?: ICurrency
}

/**
 * Format a number value to a localized currency string with proper symbol and formatting
 *
 * @param value - The numeric value to format
 * @param options - Optional formatting options
 * @returns Formatted currency string with or without symbol
 *
 * @example
 * currencyFormat(1600, { currency: { locale: 'en-US', currency_code: 'USD' } }) // "$1,600"
 * currencyFormat(1600, { currency: { locale: 'en-US', currency_code: 'USD' }, showSymbol: false }) // "1,600"
 * currencyFormat(1600, { currency: { locale: 'fr-FR', currency_code: 'EUR' } }) // "1 600 €"
 * currencyFormat(1600, { currency: { locale: 'de-DE', currency_code: 'EUR' } }) // "1.600 €"
 * currencyFormat(1600.50, { currency: { locale: 'en-US', currency_code: 'USD' } }) // "$1,600.50"
 * currencyFormat(1600, { currency: { locale: 'ja-JP', currency_code: 'JPY' } }) // "¥1,600"
 * currencyFormat(1600) // "$1,600" (defaults to en-US/USD)
 */
export const currencyFormat = (
    value: number | string | undefined | null,
    options: ICurrencyFormatOptions = {}
): string => {
    const { showSymbol = false, currency } = options

    // Handle null/undefined values
    if (value === null || value === undefined || value === '') {
        if (showSymbol && currency?.symbol) {
            return `${currency.symbol}0`
        }
        return new Intl.NumberFormat('en-US', {
            style: showSymbol ? 'currency' : 'decimal',
            currency: showSymbol ? 'USD' : undefined,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(0)
    }

    // Convert string to number if needed
    const numericValue = typeof value === 'string' ? parseFloat(value) : value

    // Handle invalid numbers
    if (isNaN(numericValue)) {
        if (showSymbol && currency?.symbol) {
            return `${currency.symbol}0`
        }
        return new Intl.NumberFormat('en-US', {
            style: showSymbol ? 'currency' : 'decimal',
            currency: showSymbol ? 'USD' : undefined,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(0)
    }

    // Default locale and currency
    const locale = currency?.locale || 'en-US'
    const currencyCode = currency?.currency_code || 'USD'

    // Determine decimal places based on currency
    const noDecimalCurrencies = [
        'JPY',
        'KRW',
        'VND',
        'CLP',
        'ISK',
        'BIF',
        'DJF',
        'GNF',
        'PYG',
        'RWF',
        'UGX',
        'VUV',
        'XAF',
        'XOF',
        'XPF',
    ]
    const minimumFractionDigits = noDecimalCurrencies.includes(currencyCode)
        ? 0
        : 2
    const maximumFractionDigits = noDecimalCurrencies.includes(currencyCode)
        ? 0
        : 2

    try {
        return new Intl.NumberFormat(locale, {
            style: showSymbol ? 'currency' : 'decimal',
            currency: showSymbol ? currencyCode : undefined,
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(numericValue)
    } catch (error) {
        console.warn(
            `Invalid locale or currency: ${locale}/${currencyCode}`,
            error
        )
        return new Intl.NumberFormat('en-US', {
            style: showSymbol ? 'currency' : 'decimal',
            currency: showSymbol ? 'USD' : undefined,
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue)
    }
}

/**
 * Check if a date is today in the currency's timezone
 *
 * @param date - The date to check (ISO string or Date object)
 * @param currency - Currency object containing timezone information
 * @returns True if the date is today in the currency's timezone
 *
 * @example
 * isToday('2025-10-24', { timezone: 'America/New_York' }) // true if today in NY
 * isToday(new Date(), { timezone: 'Asia/Tokyo' }) // checks against Tokyo time
 */
export const isToday = (
    date: string | Date,
    currency?: Pick<ICurrency, 'timezone'>
): boolean => {
    const timezone = currency?.timezone || 'UTC'
    const parsedDate = typeof date === 'string' ? parseISO(date) : date

    const todayStr = formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd')
    const dateStr = formatInTimeZone(parsedDate, timezone, 'yyyy-MM-dd')

    return todayStr === dateStr
}

/**
 * Check if a date is in the past in the currency's timezone
 *
 * @param date - The date to check (ISO string or Date object)
 * @param currency - Currency object containing timezone information
 * @returns True if the date is in the past in the currency's timezone
 *
 * @example
 * isPast('2024-01-01', { timezone: 'America/New_York' }) // true
 * isPast('2026-01-01', { timezone: 'Asia/Tokyo' }) // false
 */
export const isPast = (
    date: string | Date,
    currency?: Pick<ICurrency, 'timezone'>
): boolean => {
    const timezone = currency?.timezone || 'UTC'
    const parsedDate = typeof date === 'string' ? parseISO(date) : date

    // Get start of today in the currency's timezone
    const todayInTz = toDate(
        formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd'),
        { timeZone: timezone }
    )
    const dateInTz = toDate(
        formatInTimeZone(parsedDate, timezone, 'yyyy-MM-dd'),
        { timeZone: timezone }
    )

    return compareAsc(dateInTz, startOfDay(todayInTz)) < 0
}

/**
 * Check if a date is in the future in the currency's timezone
 *
 * @param date - The date to check (ISO string or Date object)
 * @param currency - Currency object containing timezone information
 * @returns True if the date is in the future in the currency's timezone
 *
 * @example
 * isFuture('2026-01-01', { timezone: 'America/New_York' }) // true
 * isFuture('2024-01-01', { timezone: 'Asia/Tokyo' }) // false
 */
export const isFuture = (
    date: string | Date,
    currency?: Pick<ICurrency, 'timezone'>
): boolean => {
    const timezone = currency?.timezone || 'UTC'
    const parsedDate = typeof date === 'string' ? parseISO(date) : date

    // Get start of today in the currency's timezone
    const todayInTz = toDate(
        formatInTimeZone(new Date(), timezone, 'yyyy-MM-dd'),
        { timeZone: timezone }
    )
    const dateInTz = toDate(
        formatInTimeZone(parsedDate, timezone, 'yyyy-MM-dd'),
        { timeZone: timezone }
    )

    return compareAsc(dateInTz, startOfDay(todayInTz)) > 0
}

/**
 * Sort an array of objects by a date field, respecting the currency's timezone
 *
 * @param key - The key of the date field to sort by
 * @param data - Array of objects to sort
 * @param sort - Sort direction ('asc' or 'desc')
 * @returns Sorted array
 *
 * @example
 * sortByCurrency('entry_date', holidays, 'asc')
 * sortByCurrency('created_at', transactions, 'desc')
 */
export const sortByCurrency = <T extends Record<string, unknown>>(
    key: keyof T,
    data: T[],
    sort: 'asc' | 'desc' = 'asc'
): T[] => {
    return [...data].sort((a, b) => {
        const dateA = a[key] as unknown
        const dateB = b[key] as unknown

        // Handle null/undefined values
        if (dateA == null && dateB == null) return 0
        if (dateA == null) return sort === 'asc' ? 1 : -1
        if (dateB == null) return sort === 'asc' ? -1 : 1

        const parsedDateA =
            typeof dateA === 'string' ? parseISO(dateA) : (dateA as Date)
        const parsedDateB =
            typeof dateB === 'string' ? parseISO(dateB) : (dateB as Date)

        const comparison =
            sort === 'asc'
                ? compareAsc(parsedDateA, parsedDateB)
                : compareDesc(parsedDateA, parsedDateB)

        return comparison
    })
}
