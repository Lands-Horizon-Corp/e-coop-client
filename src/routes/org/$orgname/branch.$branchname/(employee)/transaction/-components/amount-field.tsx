import React from 'react'

import {
    commaSeparators,
    formatNumberOnBlur,
    isValidDecimalInput,
    sanitizeNumberInput,
} from '@/helpers'
import { cn } from '@/lib'

import { Input } from '@/components/ui/input'

type AmountFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
    value?: string | number
    onChange?: (e: any) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    InputClassName?: string
    className?: string
}
const AmountField = ({
    value,
    onChange,
    InputClassName,
    className,
    ...field
}: AmountFieldProps) => {
    const formattedValue =
        value !== undefined && value !== null
            ? commaSeparators(value.toString())
            : ''

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const rawValue = sanitizeNumberInput(e.target.value)
        if (isValidDecimalInput(rawValue)) {
            onChange?.(rawValue)
        }
    }
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (onChange) {
            formatNumberOnBlur(e.target.value, onChange)
        }
    }

    return (
        <div className={cn('relative w-full', className)}>
            <Input
                {...field}
                value={formattedValue}
                className={cn(
                    'h-16 rounded-2xl pl-8 pr-10 text-lg font-bold text-primary placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40',
                    InputClassName
                )}
                onChange={handleChange}
                onBlur={handleBlur}
                type="text"
                placeholder="Enter the payment amount"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary after:content-['₱']"></span>
        </div>
    )
}

export default AmountField
