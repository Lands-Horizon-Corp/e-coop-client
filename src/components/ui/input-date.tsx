import React, { forwardRef } from 'react'

import { cn } from '@/helpers/tw-utils'

import { Input } from './input'

interface InputDateProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hideNativeCalendar?: boolean
}

const InputDate = forwardRef<HTMLInputElement, InputDateProps>(
    ({ className, hideNativeCalendar, type = 'date', ...props }, ref) => {
        // USE THIS IF YOU WANNA HIDE THE NATIVE CALENDAR ICON/PICKER
        // [&::-webkit-calendar-picker-indicator]:hidden
        return (
            <Input
                ref={ref}
                {...props}
                className={cn(
                    'block',
                    hideNativeCalendar &&
                        '[&::-webkit-calendar-picker-indicator]:hidden',
                    className
                )}
                type={type}
            />
        )
    }
)

InputDate.displayName = 'InputDate'

export default InputDate
