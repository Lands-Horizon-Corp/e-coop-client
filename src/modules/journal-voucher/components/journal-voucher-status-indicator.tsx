import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'

import {
    BadgeCheckFillIcon,
    PencilFillIcon,
    TextFileFillIcon,
} from '@/components/icons'
import { CheckIcon } from '@/components/icons'
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import {
    Timeline,
    TimelineContent,
    TimelineDate,
    TimelineHeader,
    TimelineIndicator,
    TimelineItem,
    TimelineSeparator,
    TimelineTitle,
} from '@/components/ui/timeline'

import { IClassProps } from '@/types'

import JournalVoucherStatusBadge, {
    TJournalVoucherStatusType,
} from './journal-voucher-status-badge'

export interface ICJournalVoucherStatusDates {
    posted_date?: string | null
    cancelled_date?: string | null
}

export const resolveJVStatusDatesToStatus = (
    dates: ICJournalVoucherStatusDates
): TJournalVoucherStatusType => {
    if (dates.cancelled_date) {
        return 'cancelled'
    }
    if (dates.posted_date) {
        return 'posted'
    }
    return 'draft'
}

export const JournalVoucherStatusIndicatorDetails = ({
    posted_date,
    cancelled_date,
}: ICJournalVoucherStatusDates) => {
    const currentStatus = resolveJVStatusDatesToStatus({
        posted_date,
        cancelled_date,
    })

    const steps = [
        {
            key: 1,
            label: 'Draft',
            icon: <PencilFillIcon className="inline text-muted-foreground" />,
            description: 'The Journal Voucher is in draft mode.',
        },
        {
            key: 2,
            label: 'Posted',
            date: posted_date,
            icon: <BadgeCheckFillIcon className="inline text-primary" />,
            description: 'The Journal Voucher has been posted to the ledger.',
        },
        {
            key: 3,
            label: 'Cancelled',
            date: cancelled_date,
            icon: <TextFileFillIcon className="inline text-destructive" />,
            description: 'The Journal Voucher has been cancelled/voided.',
        },
    ]

    const lastCompleted =
        currentStatus === 'cancelled' ? 3 : currentStatus === 'posted' ? 2 : 1

    return (
        <Timeline className="p-4 gap-y-3" value={lastCompleted}>
            {steps.map((step) => {
                let dateDisplay = null
                if (step.date) {
                    dateDisplay = `${toReadableDateTime(step.date)} - ${dateAgo(
                        step.date
                    )}`
                }

                const shouldRender =
                    step.key === 1 || step.key === lastCompleted

                if (!shouldRender) return null

                return (
                    <TimelineItem
                        className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-5"
                        key={step.key}
                        step={step.key}
                    >
                        <TimelineHeader>
                            <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:top-2 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                            <TimelineTitle className="mt-0.5 flex items-center gap-1">
                                {step.icon}
                                {step.label}
                            </TimelineTitle>
                            <TimelineIndicator className="group-data-completed/timeline-item:bg-primary/75 p-3.5 group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                                <span className="text-primary-foreground group-not-data-completed/timeline-item:hidden">
                                    <CheckIcon />
                                </span>
                            </TimelineIndicator>
                        </TimelineHeader>
                        <TimelineContent>
                            <span className="text-muted-foreground text-sm">
                                {step.description}
                            </span>
                            <TimelineDate className="mt-2 mb-0">
                                {dateDisplay}
                            </TimelineDate>
                        </TimelineContent>
                    </TimelineItem>
                )
            })}
        </Timeline>
    )
}

interface Props extends IClassProps {
    voucherDates: ICJournalVoucherStatusDates
}

const JournalVoucherStatusIndicator = ({ className, voucherDates }: Props) => {
    const resolvedStatus = resolveJVStatusDatesToStatus(voucherDates)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <JournalVoucherStatusBadge
                    className="cursor-pointer"
                    size="sm"
                    status={resolvedStatus}
                />
            </PopoverTrigger>
            <PopoverContent
                className={cn(
                    'w-80 p-1 rounded-xl bg-popover dark:bg-background',
                    className
                )}
            >
                <div className="space-y-2 px-3 py-2">
                    <p className="text-sm font-semibold">
                        Journal Voucher Status
                    </p>
                    <p className="text-xs text-muted-foreground">
                        This is an auto generated status by system.
                    </p>
                </div>
                <Separator />
                <JournalVoucherStatusIndicatorDetails {...voucherDates} />
            </PopoverContent>
        </Popover>
    )
}

export default JournalVoucherStatusIndicator
