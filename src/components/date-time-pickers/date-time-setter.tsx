import { toReadableDate } from '@/helpers/date-utils'

import TimePicker from '@/components/date-time-pickers/time-picker'
import { ClockIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

interface Props {
    date: Date
    onChange: (newDate: Date) => void
}

const DateTimeSetter = ({ date, onChange }: Props) => {
    return (
        <Popover modal>
            <PopoverTrigger asChild>
                <Button className="w-full" variant="outline">
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
