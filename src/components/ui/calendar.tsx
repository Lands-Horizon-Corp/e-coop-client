import * as React from 'react'

import { format, setMonth } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { DayPicker, useDayPicker, useNavigation } from 'react-day-picker'

import { Button, buttonVariants } from '@/components/ui/button'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'

import { cn } from '@/lib/utils'

export type CalendarProps = React.ComponentProps<typeof DayPicker>

function Calendar({
    className,
    classNames,
    showOutsideDays = true,
    ...props
}: CalendarProps) {
    return (
        <DayPicker
            showOutsideDays={showOutsideDays}
            className={cn('p-3', className)}
            classNames={{
                months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
                month: 'space-y-4',
                caption: 'flex justify-center pt-1 items-center',
                caption_label: cn(
                    'text-sm font-medium',
                    (props.captionLayout === 'dropdown' ||
                        props.captionLayout === 'dropdown-buttons') &&
                        'hidden'
                ),
                caption_dropdowns: 'flex gap-1 items-center',
                nav: 'space-x-1 flex items-center',
                nav_button: cn(
                    buttonVariants({ variant: 'outline' }),
                    'h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100'
                ),
                nav_button_previous: 'absolute left-1',
                nav_button_next: 'absolute right-1',
                table: 'w-full border-collapse space-y-1',
                head_row: 'flex',
                head_cell:
                    'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
                row: 'flex w-full mt-2',
                cell: 'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
                day: cn(
                    buttonVariants({ variant: 'ghost' }),
                    'h-9 w-9 p-0 font-normal aria-selected:opacity-100'
                ),
                day_range_end: 'day-range-end',
                day_selected:
                    'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
                day_today: 'bg-accent text-accent-foreground',
                day_outside:
                    'day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
                day_disabled: 'text-muted-foreground opacity-50',
                day_range_middle:
                    'aria-selected:bg-accent aria-selected:text-accent-foreground',
                day_hidden: 'invisible',
                ...classNames,
            }}
            components={{
                IconLeft: () => <ChevronLeft className="size-4" />,
                IconRight: () => <ChevronRight className="size-4" />,
                Dropdown: ({ name, value }) => {
                    const {
                        fromDate,
                        fromMonth,
                        fromYear,
                        toDate,
                        toMonth,
                        toYear,
                    } = useDayPicker()
                    const [visible, setVisible] = React.useState(false)

                    const { goToMonth, currentMonth } = useNavigation()

                    if (name === 'months') {
                        const selectItems = Array.from(
                            { length: 12 },
                            (_, i) => ({
                                value: i.toString(),
                                label: format(setMonth(new Date(), i), 'MMM'),
                            })
                        )
                        return (
                            <Popover
                                open={visible}
                                onOpenChange={(val) => setVisible(val)}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="size-fit cursor-pointer bg-transparent p-0 hover:bg-transparent"
                                    >
                                        {format(currentMonth, 'MMMM')}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="ecoop-scroll max-h-64 overflow-y-scroll rounded-xl bg-popover/90 backdrop-blur">
                                    <div className="grid grid-cols-3 gap-x-2 gap-y-0.5">
                                        {selectItems.map((selectItem) => (
                                            <Button
                                                key={selectItem.value}
                                                size="sm"
                                                variant="ghost"
                                                className={cn(
                                                    'rounded-full text-sm',
                                                    value?.toString() ===
                                                        selectItem.value
                                                        ? 'bg-secondary/80 font-medium text-foreground'
                                                        : 'text-foreground/80 hover:font-medium hover:text-foreground'
                                                )}
                                                onClick={() => {
                                                    const newDate = new Date(
                                                        currentMonth
                                                    )
                                                    newDate.setMonth(
                                                        parseInt(
                                                            selectItem.value
                                                        )
                                                    )

                                                    goToMonth(newDate)
                                                    setVisible(false)
                                                }}
                                            >
                                                {selectItem.label}
                                            </Button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    } else if (name === 'years') {
                        const earliestYear =
                            fromYear ||
                            fromMonth?.getFullYear() ||
                            fromDate?.getFullYear()
                        const latestYear =
                            toYear ||
                            toMonth?.getFullYear() ||
                            toDate?.getFullYear()

                        let selectItems: { label: string; value: string }[] = []

                        if (earliestYear && latestYear) {
                            const yearsLength = latestYear - earliestYear + 1
                            selectItems = Array.from(
                                { length: yearsLength },
                                (_, i) => ({
                                    label: (earliestYear + i).toString(),
                                    value: (earliestYear + i).toString(),
                                })
                            )
                        }

                        return (
                            <Popover
                                open={visible}
                                onOpenChange={(val) => setVisible(val)}
                            >
                                <PopoverTrigger asChild>
                                    <Button
                                        variant="ghost"
                                        className="size-fit cursor-pointer bg-transparent p-0 hover:bg-transparent"
                                    >
                                        {currentMonth.getFullYear()}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="ecoop-scroll max-h-64 overflow-y-scroll rounded-xl bg-popover/90 backdrop-blur">
                                    <div className="grid grid-cols-3 gap-x-2 gap-y-0.5">
                                        {selectItems.map((selectItem) => (
                                            <Button
                                                key={selectItem.value}
                                                size="sm"
                                                variant="ghost"
                                                className={cn(
                                                    'rounded-full text-sm',
                                                    value?.toString() ===
                                                        selectItem.value
                                                        ? 'bg-secondary/80 font-medium text-foreground'
                                                        : 'text-foreground/80 hover:font-medium hover:text-foreground'
                                                )}
                                                onClick={() => {
                                                    const newDate = new Date(
                                                        currentMonth
                                                    )
                                                    newDate.setFullYear(
                                                        parseInt(
                                                            selectItem.value
                                                        )
                                                    )
                                                    goToMonth(newDate)
                                                    setVisible(false)
                                                }}
                                            >
                                                {selectItem.label}
                                            </Button>
                                        ))}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        )
                    }
                    return null
                },
            }}
            {...props}
        />
    )
}
Calendar.displayName = 'Calendar'

export { Calendar }
