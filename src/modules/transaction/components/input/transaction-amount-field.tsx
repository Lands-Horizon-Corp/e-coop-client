import React, { forwardRef } from 'react'

import { cn } from '@/helpers'
import {
    commaSeparators,
    isValidDecimalInput,
    sanitizeNumberInput,
} from '@/helpers/common-helper'

import { Input } from '@/components/ui/input'

type AmountFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    InputClassName?: string
    className?: string
    isDefault?: boolean
}

const TransactionAmountField = forwardRef<HTMLInputElement, AmountFieldProps>(
    (
        {
            value,
            onChange,
            InputClassName,
            className,
            isDefault = true,
            ...field
        },
        ref
    ) => {
        const formattedValue =
            value !== undefined && value !== null
                ? commaSeparators(value.toString())
                : ''

        const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
            const rawValue = sanitizeNumberInput(e.target.value)

            if (isValidDecimalInput(rawValue)) {
                onChange?.({
                    ...e,
                    target: {
                        ...e.target,
                        value: rawValue,
                    },
                })
            }
        }
        const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
            const sanitized = sanitizeNumberInput(e.target.value)

            if (!sanitized || sanitized === '-') {
                onChange?.({
                    ...e,
                    target: {
                        ...e.target,
                        value: '',
                    },
                })
                field?.onBlur?.(e) // still mark field as touched
                return
            }

            const parsedValue = parseFloat(sanitized)
            if (!isNaN(parsedValue)) {
                // round to 2 decimals
                const fixedValue = parsedValue.toFixed(2)

                onChange?.({
                    ...e,
                    target: {
                        ...e.target,
                        value: fixedValue,
                    },
                })
            }

            field?.onBlur?.(e) // RHF requires calling this
        }

        return (
            <div className={cn('relative w-full', className)}>
                <Input
                    {...field}
                    className={cn(
                        'border !border-primary/20',
                        isDefault
                            ? ''
                            : 'h-16 rounded-2xl pl-8 pr-10 text-lg font-bold text-primary placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40',
                        InputClassName
                    )}
                    onBlur={handleBlur}
                    onChange={handleChange}
                    placeholder="Enter the payment amount"
                    ref={ref}
                    type="text"
                    value={formattedValue}
                />
                {!isDefault && (
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary after:content-['']" />
                )}
            </div>
        )
    }
)

export default TransactionAmountField
