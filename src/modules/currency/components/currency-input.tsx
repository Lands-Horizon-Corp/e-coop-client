import * as React from 'react'

import { cn } from '@/helpers/tw-utils'
import CurrencyInputField, {
    CurrencyInputProps as BaseCurrencyInputProps,
    CurrencyInputOnChangeValues,
} from 'react-currency-input-field'

import { ICurrency } from '../currency.types'

type Props = {
    currency?: ICurrency
    value?: string | number
    disabled?: boolean
    placeholder?: string
    className?: string
    allowNegativeValue?: boolean
    decimalsLimit?: number
    onValueChange?: (
        value: string | undefined,
        name?: string | undefined,
        values?: CurrencyInputOnChangeValues
    ) => void
} & Omit<
    BaseCurrencyInputProps,
    'value' | 'onValueChange' | 'prefix' | 'intlConfig' | 'disabled'
>

/**
 * CurrencyInput - A locale-aware currency input component
 *
 * Automatically handles different number formats based on currency:
 * - US (USD): 1,234.56
 * - France (EUR): 1 234,56
 * - Germany (EUR): 1.234,56
 * - Japan (JPY): 1,234 (no decimals)
 * - Saudi Arabia (SAR): ١٬٢٣٤٫٥٦ (Arabic numerals, RTL)
 *
 * The onValueChange callback returns the raw numeric value as a string (e.g., "1234.56")
 */
const CurrencyInput = React.forwardRef<HTMLInputElement, Props>(
    (
        {
            currency,
            value,
            disabled,
            placeholder,
            className,
            allowNegativeValue = false,
            decimalsLimit,
            onValueChange,
            ...props
        },
        ref
    ) => {
        // Determine locale from currency data
        const locale = React.useMemo(() => {
            if (!currency?.locale) return 'en-US'
            return currency.locale
        }, [currency?.locale])

        // Determine if currency uses decimals
        const maxDecimals = React.useMemo(() => {
            if (decimalsLimit !== undefined) return decimalsLimit

            // Some currencies don't use decimal places (e.g., JPY, KRW)
            const noDecimalCurrencies = ['JPY', 'KRW', 'VND', 'CLP', 'ISK']
            if (
                currency?.currency_code &&
                noDecimalCurrencies.includes(currency.currency_code)
            ) {
                return 0
            }

            return 2 // Default for most currencies
        }, [currency?.currency_code, decimalsLimit])

        // // Get currency symbol with proper positioning
        // const prefix = React.useMemo(() => {
        //     if (!currency) return undefined

        //     // For RTL currencies or currencies that prefix the symbol
        //     const prefixCurrencies = ['USD', 'GBP', 'PHP', 'SAR', 'AED', 'KWD']
        //     if (
        //         currency.currency_code &&
        //         prefixCurrencies.includes(currency.currency_code)
        //     ) {
        //         return currency.symbol || currency.currency_code
        //     }

        //     return undefined
        // }, [currency])

        // const suffix = React.useMemo(() => {
        //     if (!currency) return undefined

        //     // For currencies that suffix the symbol (e.g., EUR in some locales)
        //     const suffixCurrencies = ['EUR']
        //     if (
        //         currency.currency_code &&
        //         suffixCurrencies.includes(currency.currency_code)
        //     ) {
        //         return ` ${currency.symbol || currency.currency_code}`
        //     }

        //     return undefined
        // }, [currency])

        return (
            <div className="relative flex rounded-md shadow-xs">
                <CurrencyInputField
                    allowNegativeValue={allowNegativeValue}
                    className={cn(
                        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
                        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
                        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
                        currency && 'rounded-e-none',
                        currency?.iso_3166_alpha2?.toLowerCase() === 'sa' &&
                            'text-right', // RTL for Arabic
                        className
                    )}
                    data-slot="input"
                    decimalsLimit={maxDecimals}
                    disabled={disabled}
                    intlConfig={{ locale, currency: currency?.currency_code }}
                    onValueChange={onValueChange}
                    placeholder={placeholder || '0.00'}
                    ref={ref}
                    value={value}
                    {...props}
                />
                <span
                    className={cn(
                        'flex items-center rounded-e-md border border-input bg-background px-3 text-sm',
                        !currency && 'hidden'
                    )}
                >
                    <span className="mr-1">{currency?.iso_3166_alpha3}</span>
                    <span>{currency?.emoji}</span>
                </span>
            </div>
        )
    }
)

CurrencyInput.displayName = 'CurrencyInput'

export default CurrencyInput
