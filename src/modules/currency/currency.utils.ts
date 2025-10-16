import { ICurrency } from './currency.types'

/**
 * Format a number value to a localized currency string with proper symbol and formatting
 *
 * @param value - The numeric value to format
 * @param currency - Optional currency configuration object
 * @returns Formatted currency string with symbol (e.g., "$1,600" for US locale)
 *
 * @example
 * currencyFormat(1600, { locale: 'en-US', currency_code: 'USD' }) // "$1,600"
 * currencyFormat(1600, { locale: 'fr-FR', currency_code: 'EUR' }) // "1 600 €"
 * currencyFormat(1600, { locale: 'de-DE', currency_code: 'EUR' }) // "1.600 €"
 * currencyFormat(1600.50, { locale: 'en-US', currency_code: 'USD' }) // "$1,600.50"
 * currencyFormat(1600, { locale: 'ja-JP', currency_code: 'JPY' }) // "¥1,600"
 * currencyFormat(1600) // "$1,600" (defaults to en-US/USD)
 */
export const currencyFormat = (
    value: number | string | undefined | null,
    currency?: ICurrency
): string => {
    // Handle null/undefined values
    if (value === null || value === undefined || value === '') {
        return currency?.symbol
            ? `${currency.symbol}0`
            : new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
              }).format(0)
    }

    // Convert string to number if needed
    const numericValue = typeof value === 'string' ? parseFloat(value) : value

    // Handle invalid numbers
    if (isNaN(numericValue)) {
        return currency?.symbol
            ? `${currency.symbol}0`
            : new Intl.NumberFormat('en-US', {
                  style: 'currency',
                  currency: 'USD',
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
            style: 'currency',
            currency: currencyCode,
            minimumFractionDigits,
            maximumFractionDigits,
        }).format(numericValue)
    } catch (error) {
        console.warn(
            `Invalid locale or currency: ${locale}/${currencyCode}`,
            error
        )
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
        }).format(numericValue)
    }
}
