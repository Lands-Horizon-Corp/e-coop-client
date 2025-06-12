import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import TimePicker from '@/components/date-time-pickers/time-picker'

import { toReadableDate } from '@/utils'
import { ClockIcon } from '@/components/icons'

interface Props {
    date: Date
    onChange: (newDate: Date) => void
}

const DateTimeSetter = ({ date, onChange }: Props) => {
    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full">
                    {toReadableDate(date, 'hh:mm a')}
                    <ClockIcon className="ml-auto" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-fit rounded-xl">
                <div className="grid gap-4">
                    <TimePicker date={date} onChange={onChange} />
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default DateTimeSetter
