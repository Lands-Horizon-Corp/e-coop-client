import { parseDate, CalendarDate } from '@internationalized/date'
import { DateField, DateInput, DateSegment } from 'react-aria-components'

import { cn } from '@/lib/utils'

type Props = {
    value?: CalendarValue | undefined
    onChange: (val?: string) => void
}

export function DateInputField({ value, onChange }: Props) {
    const dateValue: CalendarDate | undefined = value
        ? parseDate(value)
        : undefined

    return (
        <DateField
            value={dateValue}
            onChange={(val: CalendarDate | null) => {
                onChange(val?.toString()) // "YYYY-MM-DD" or undefined
            }}
            className="w-full"
        >
            <DateInput className="flex w-full items-center rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm ring-offset-background transition-colors focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
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
