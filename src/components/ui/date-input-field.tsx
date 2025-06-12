import { CalendarDate } from '@internationalized/date'
import { DateField, DateInput, DateSegment } from 'react-aria-components'

import { cn } from '@/lib/utils'
import { IClassProps } from '@/types'

interface Props extends IClassProps {
    value?: CalendarDate | undefined | null
    disabled?: boolean
    onChange: (val: CalendarDate | null) => void
}

export function DateInputField({
    value,
    disabled,
    className,
    onChange,
}: Props) {
    return (
        <DateField
            isDisabled={disabled}
            value={value}
            onChange={onChange}
            className={cn(
                'flex w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
                className
            )}
        >
            <DateInput>
                {(segment) => (
                    <DateSegment
                        segment={segment}
                        className={cn(
                            'px-0.5 outline-none',
                            segment.isPlaceholder && 'text-muted-foreground'
                        )}
                    />
                )}
            </DateInput>
        </DateField>
    )
}
