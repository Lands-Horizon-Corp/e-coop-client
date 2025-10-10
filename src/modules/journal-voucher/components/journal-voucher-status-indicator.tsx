import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'

import {
    BadgeCheckFillIcon,
    PencilFillIcon,
    PrinterIcon,
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

import { IJournalVoucher } from '../journal-voucher.types'
import JournalVoucherStatusBadge, {
    TJournalVoucherStatusType,
} from './journal-voucher-status-badge'

export interface IJournalVoucherStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

export const resolveJVStatusDatesToStatus = (
    dates: IJournalVoucherStatusDates
): TJournalVoucherStatusType => {
    if (dates.released_date) {
        return 'released'
    }
    if (dates.approved_date) {
        return 'approved'
    }
    if (dates.printed_date) {
        return 'printed'
    }
    return 'draft'
}

export const JournalVoucherStatusIndicatorDetails = ({
    printed_date,
    approved_date,
    released_date,
}: IJournalVoucherStatusDates) => {
    const currentStatus = resolveJVStatusDatesToStatus({
        printed_date,
        approved_date,
        released_date,
    })

    const steps = [
        {
            key: 1,
            label: 'Draft',
            date: null,
            icon: <PencilFillIcon className="inline text-muted-foreground" />,
            description: 'The Journal Voucher is in draft mode.',
            dateProp: null,
        },
        {
            key: 2,
            label: 'Printed',
            dateProp: printed_date,
            icon: <PrinterIcon className="inline text-muted-foreground" />,
            description: 'The Journal Voucher has been printed.',
        },
        {
            key: 3,
            label: 'Approved',
            dateProp: approved_date,
            icon: (
                <BadgeCheckFillIcon className="inline text-muted-foreground" />
            ),
            description: 'The Journal Voucher has been approved.',
        },
        {
            key: 4,
            label: 'Released',
            dateProp: released_date,
            icon: <BadgeCheckFillIcon className="inline text-primary" />,
            description: 'The Journal Voucher has been released.',
        },
    ]

    const statusToStepMap: Record<TJournalVoucherStatusType, number> = {
        draft: 1,
        printed: 2,
        approved: 3,
        released: 4,
    }

    const lastCompleted = statusToStepMap[currentStatus]

    return (
        <Timeline className="p-4 gap-y-3" value={lastCompleted}>
            {steps
                .filter((step) => step.key <= lastCompleted) // Only render steps that are completed or the current step
                .map((step) => {
                    const dateString = step.dateProp
                    const dateDisplay = dateString
                        ? `${toReadableDateTime(dateString)} - ${dateAgo(dateString)}`
                        : 'Pending'

                    return (
                        <TimelineItem
                            className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-5"
                            key={step.key}
                            step={step.key}
                        >
                            <TimelineHeader>
                                <TimelineSeparator className="group-data-[orientation=vertical]/timeline:-left-7 group-data-[orientation=vertical]/timeline:top-2 group-data-[orientation=vertical]/timeline:h-[calc(100%-1.5rem)] group-data-[orientation=vertical]/timeline:translate-y-6.5" />
                                <TimelineIndicator className="group-data-completed/timeline-item:bg-primary/75 p-3.5 group-data-completed/timeline-item:text-primary-foreground flex size-6 items-center justify-center group-data-completed/timeline-item:border-none group-data-[orientation=vertical]/timeline:-left-7">
                                    <span className="text-primary-foreground group-not-data-completed/timeline-item:hidden">
                                        <CheckIcon />
                                    </span>
                                </TimelineIndicator>
                                <TimelineTitle className="mt-0.5 flex items-center gap-1">
                                    {step.icon}
                                    {step.label}
                                </TimelineTitle>
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
    journalVoucher: IJournalVoucher
}

const JournalVoucherStatusIndicator = ({
    className,
    journalVoucher,
}: Props) => {
    const voucherDates: IJournalVoucherStatusDates = {
        printed_date: journalVoucher.printed_date,
        approved_date: journalVoucher.approved_date,
        released_date: journalVoucher.released_date,
    }
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
