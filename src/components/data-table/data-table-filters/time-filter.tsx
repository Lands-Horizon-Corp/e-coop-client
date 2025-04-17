import { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import TimeRange from './time-range'
import { Button } from '@/components/ui/button'
import TimePicker from '@/components/date-time-pickers/time-picker'

import {
    useFilter,
    TFilterModes,
    TSearchFilter,
    filterModeMap,
    IFilterComponentProps,
} from '@/contexts/filter-context'
import logger from '@/helpers/loggers/logger'

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
            onKeyDown={(e) => e.stopPropagation()}
            className="flex min-w-72 flex-col space-y-2 p-1"
        >
            <p className="text-sm">Filter</p>
            <Select
                value={filterVal.mode}
                onValueChange={(val) => {
                    const newFilterMode = val as TFilterModes
                    setFilter(field, {
                        ...filterVal,
                        mode: newFilterMode,
                    })
                }}
            >
                <SelectTrigger className="">
                    <SelectValue placeholder="Select Filter" />
                </SelectTrigger>
                <SelectContent
                    onClick={(e) => e.stopPropagation()}
                    className="ecoop-scroll max-h-[60vh] min-w-40 overflow-y-scroll shadow-md"
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
                    value={filterVal.value ?? new Date(0, 0, 0, 0, 0, 0)}
                    onChange={(newTime) => {
                        setFilter(field, {
                            ...filterVal,
                            value: newTime,
                            from: undefined,
                            to: undefined,
                        })
                    }}
                />
            ) : (
                <>
                    <TimeRange
                        baseDate={new Date(0, 0, 0, 0, 0, 0)}
                        value={{ from: filterVal.from, to: filterVal.to }}
                        onChange={(newTimeRange) => {
                            setFilter(field, {
                                ...filterVal,
                                from: newTimeRange.from,
                                to: newTimeRange.to,
                                value: undefined,
                            })

                            logger.log('Set time range', newTimeRange)
                        }}
                    />
                </>
            )}
            <Button
                size="sm"
                className="w-full"
                variant="secondary"
                onClick={() => setFilter(field)}
            >
                Clear Filter
            </Button>
        </div>
    )
}

export default TimeFilter
