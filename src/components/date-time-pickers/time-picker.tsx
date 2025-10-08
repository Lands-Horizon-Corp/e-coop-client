'use client'

import { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'

interface TimePickerProps {
    date: Date
    disabled?: boolean
    hideTimeFieldLabels?: boolean
    onChange: (updatedDate: Date) => void
}

const TimePicker: React.FC<TimePickerProps> = ({
    date,
    disabled,
    hideTimeFieldLabels,
    onChange,
}) => {
    const [hour, setHour] = useState<number>(date.getHours() % 12 || 12)
    const [minutes, setMinutes] = useState<number>(date.getMinutes())
    const [period, setPeriod] = useState<'AM' | 'PM'>(
        date.getHours() >= 12 ? 'PM' : 'AM'
    )

    const handleApply = (
        updatedHour = hour,
        updatedMinutes = minutes,
        updatedPeriod = period
    ) => {
        const updatedDate = new Date(date)
        updatedDate.setHours(
            updatedPeriod === 'PM' ? (updatedHour % 12) + 12 : updatedHour % 12
        )
        updatedDate.setMinutes(updatedMinutes)
        onChange(updatedDate)
    }

    const renderSelect = (
        label: string,
        value: string | number,
        items: Array<{ value: string | number; label: string }>,
        onSelect: (selectedValue: number | string) => void
    ) => (
        <div className="flex flex-col">
            {!hideTimeFieldLabels && (
                <div className="mb-2 text-sm">{label}</div>
            )}
            <Select
                onValueChange={(selectedValue) => {
                    const parsedValue =
                        typeof items[0].value === 'number'
                            ? parseInt(selectedValue, 10)
                            : selectedValue
                    onSelect(parsedValue)
                }}
                value={value.toString()}
            >
                <SelectTrigger className="w-[80px]" disabled={disabled}>
                    {items.find((item) => item.value === value)?.label ||
                        'Select'}
                </SelectTrigger>
                <SelectContent>
                    {items.map((item) => (
                        <SelectItem
                            key={item.value}
                            value={item.value.toString()}
                        >
                            {item.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )

    return (
        <div className="flex flex-col items-center gap-y-2">
            <div className="flex gap-x-1">
                {renderSelect(
                    'Hour',
                    hour,
                    [...Array(12).keys()].map((h) => ({
                        value: h + 1,
                        label: h + 1 < 10 ? `0${h + 1}` : `${h + 1}`,
                    })),
                    (selectedValue) => {
                        setHour(selectedValue as number)
                        handleApply(selectedValue as number, minutes, period)
                    }
                )}
                {renderSelect(
                    'Minute',
                    minutes,
                    [...Array(60).keys()].map((m) => ({
                        value: m,
                        label: m < 10 ? `0${m}` : `${m}`,
                    })),
                    (selectedValue) => {
                        setMinutes(selectedValue as number)
                        handleApply(hour, selectedValue as number, period)
                    }
                )}
                {renderSelect(
                    'Period',
                    period,
                    [
                        { value: 'AM', label: 'AM' },
                        { value: 'PM', label: 'PM' },
                    ],
                    (selectedValue) => {
                        setPeriod(selectedValue as 'AM' | 'PM')
                        handleApply(hour, minutes, selectedValue as 'AM' | 'PM')
                    }
                )}
            </div>
        </div>
    )
}

export default TimePicker
