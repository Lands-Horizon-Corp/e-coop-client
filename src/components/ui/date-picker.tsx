import { Group, DatePicker } from 'react-aria-components'

import { cn } from '@/lib'
import { DateInput } from '@/components/ui/date-input-field'
import { parseDate } from '@internationalized/date'

interface Props {
    disabled?: boolean
    value?: Date | string | undefined
    onChange?: (date: string) => void
}

export default function DatePickerInput({
    value,
    disabled,
    onChange,
    ...props
}: Props) {
    return (
        <DatePicker
            className={cn(
                '*:not-first:mt-2',
                disabled && 'pointer-events-none opacity-60'
            )}
            {...props}
            value={
                value
                    ? parseDate(
                          value instanceof Date ? value.toString() : value
                      )
                    : undefined
            }
            onChange={(val) => {
                const resolvedValue = val ? val : null
                onChange?.(resolvedValue as unknown as string)
            }}
        >
            <div className="flex">
                <Group className="w-full">
                    <DateInput className="pe-9" />
                </Group>
            </div>
        </DatePicker>
    )
}
