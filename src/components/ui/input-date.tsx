import React, { forwardRef } from 'react'

import { cn } from '@/lib'

import { Input } from './input'

interface InputDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hideNativeCalendar?: boolean
}

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
    ({ className, hideNativeCalendar, ...props }, ref) => {
        return (
            <Input
                ref={ref}
                {...props}
                type="date"
                className={cn(
                    'block',
                    hideNativeCalendar &&
                        '[&::-webkit-calendar-picker-indicator]:hidden',
                    className
                )}
            />
        )
    }
)

InputDate.displayName = 'InputDate'

export default InputDate
