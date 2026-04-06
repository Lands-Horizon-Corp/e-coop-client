import { MONTHS } from '@/constants'

import { CalendarIcon } from '../icons'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '../ui/select'

interface MonthSelectorProps {
    selectedMonth: number
    onMonthChange: (month: number) => void
}

export const MonthSelector = ({
    selectedMonth,
    onMonthChange,
}: MonthSelectorProps) => {
    return (
        <div className="w-full sm:w-auto sm:min-w-[180px]">
            <Select
                onValueChange={(value) => onMonthChange(parseInt(value, 10))}
                value={selectedMonth.toString()}
            >
                <SelectTrigger className="w-full h-11 bg-card">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="Select month" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {MONTHS.map((month) => (
                        <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                        >
                            {month.label}{' '}
                            {new Date().getMonth() === month.value &&
                                '(Current)'}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}
