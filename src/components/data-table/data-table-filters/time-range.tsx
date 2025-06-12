import { useState } from 'react'
import { isAfter } from 'date-fns'

import { Button } from '@/components/ui/button'
import TimePicker from '@/components/date-time-pickers/time-picker'

import { isObject } from '@/helpers'

export type TimeRange = { from: Date | undefined; to?: Date }

interface Props {
    value: TimeRange
    baseDate?: Date
    onChange: (newRange: TimeRange) => void
}

const TimeRange = ({
    value,
    baseDate = new Date(0, 0, 0, 0, 0, 0),
    onChange,
}: Props) => {
    const [timeRange, setTimeRange] = useState<TimeRange>(
        value ? value : { from: baseDate, to: baseDate }
    )

    const isInvalid =
        timeRange === undefined ||
        !isObject(timeRange) ||
        timeRange.from === undefined ||
        timeRange.to === undefined ||
        isAfter(timeRange.from, timeRange.to) ||
        (timeRange.from === value.from && timeRange.to === value.to)

    return (
        <div className="flex flex-1 flex-col">
            <div className="flex w-full flex-col gap-x-2 gap-y-2 px-2 pb-2">
                <div className="flex w-full items-center justify-between gap-x-2 space-y-1">
                    <p className="text-sm text-foreground/70">From Time : </p>
                    <TimePicker
                        hideTimeFieldLabels
                        date={timeRange?.from || baseDate}
                        onChange={(newDate) => {
                            const updatedRange = { ...timeRange, from: newDate }
                            setTimeRange(updatedRange)
                        }}
                    />
                </div>
                <div className="flex w-full items-center justify-between gap-x-2 space-y-1">
                    <p className="text-sm text-foreground/70">To Time : </p>
                    <TimePicker
                        hideTimeFieldLabels
                        date={timeRange?.to || baseDate}
                        onChange={(newDate) => {
                            setTimeRange((prev) => ({
                                from: prev?.from ? prev.from : newDate,
                                to: newDate,
                            }))
                        }}
                    />
                </div>
            </div>
            <Button
                disabled={isInvalid}
                onClick={() => {
                    if (!timeRange) return
                    onChange(timeRange)
                }}
            >
                Apply
            </Button>
        </div>
    )
}

export default TimeRange
