import { CalendarDate } from '@internationalized/date'
import { DateField, DateInput, DateSegment } from 'react-aria-components'

import { cn } from '@/lib/utils'

type Props = {
    value?: CalendarDate | undefined
    onChange: (val: CalendarDate | null) => void
}

export function DateInputField({ value, onChange }: Props) {
    return (
        <DateField value={value} onChange={onChange} className="w-full">
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
