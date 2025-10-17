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
