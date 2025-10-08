import { useState } from 'react'

import {
    IFilterComponentProps,
    TFilterModes,
    TSearchFilter,
    filterModeMap,
    useFilter,
} from '@/contexts/filter-context'
import logger from '@/helpers/loggers/logger'

import TimePicker from '@/components/date-time-pickers/time-picker'
import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

import TimeRange from './time-range'

const TimePickerWithApply = ({
    value,
    onChange,
}: {
    value: Date
    onChange: (newDate: Date) => void
}) => {
    const [time, setTime] = useState<Date>(value)

    return (
        <>
            <TimePicker
                date={time}
                onChange={(newTime) => {
                    setTime(newTime)
                }}
            />
            <Button onClick={() => onChange(time)}>Apply</Button>
        </>
    )
}

const TimeFilter = <T,>({
    field,
    displayText,
    defaultMode,
}: IFilterComponentProps<T, 'time'>) => {
    const { filters, setFilter } = useFilter<Date, typeof field>()

    const filterModeOptions = filterModeMap['time']

    const filterVal: TSearchFilter<Date> = filters[field] ?? {
        displayText,
        to: undefined,
        from: undefined,
        dataType: 'time',
        value: undefined,
        mode: defaultMode ?? filterModeOptions[0].value,
    }

    return (
        <div
            className="flex min-w-72 flex-col space-y-2 p-1"
            onKeyDown={(e) => e.stopPropagation()}
        >
            <p className="text-sm">Filter</p>
            <Select
                onValueChange={(val) => {
                    const newFilterMode = val as TFilterModes
                    setFilter(field, {
                        ...filterVal,
                        mode: newFilterMode,
                    })
                }}
                value={filterVal.mode}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select Filter" />
                </SelectTrigger>
                <SelectContent
                    className="ecoop-scroll max-h-[60vh] min-w-40 overflow-y-scroll shadow-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    {filterModeOptions.map((mode, i) => (
                        <SelectItem key={i} value={mode.value}>
                            {mode.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
            {filters[field]?.mode !== 'range' ? (
                <TimePickerWithApply
                    onChange={(newTime) => {
                        setFilter(field, {
                            ...filterVal,
                            value: newTime,
                            from: undefined,
                            to: undefined,
                        })
                    }}
                    value={filterVal.value ?? new Date(0, 0, 0, 0, 0, 0)}
                />
            ) : (
                <>
                    <TimeRange
                        baseDate={new Date(0, 0, 0, 0, 0, 0)}
                        onChange={(newTimeRange) => {
                            setFilter(field, {
                                ...filterVal,
                                from: newTimeRange.from,
                                to: newTimeRange.to,
                                value: undefined,
                            })

                            logger.log('Set time range', newTimeRange)
                        }}
                        value={{ from: filterVal.from, to: filterVal.to }}
                    />
                </>
            )}
            <Button
                className="w-full"
                onClick={() => setFilter(field)}
                size="sm"
                variant="secondary"
            >
                Clear Filter
            </Button>
        </div>
    )
}

export default TimeFilter
