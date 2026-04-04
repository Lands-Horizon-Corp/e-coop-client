import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'

import {
    BadgeCheckFillIcon,
    CheckIcon,
    PencilFillIcon,
    PrinterIcon,
} from '@/components/icons'
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

import { IOtherFund } from '../other-fund.types'
import OtherFundStatusBadge from './other-fund-status-badge'

export interface IOtherFundStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

// Reuse or adapt the mode type
export type TOtherFundModeType = 'draft' | 'printed' | 'approved' | 'released'

export const resolveOtherFundStatusToMode = (
    dates: IOtherFundStatusDates
): TOtherFundModeType => {
    if (dates.released_date) return 'released'
    if (dates.approved_date) return 'approved'
    if (dates.printed_date) return 'printed'
    return 'draft'
}

export const OtherFundStatusIndicatorDetails = ({
    printed_date,
    approved_date,
    released_date,
}: IOtherFundStatusDates) => {
    const currentStatus = resolveOtherFundStatusToMode({
        printed_date,
        approved_date,
        released_date,
    })

    const steps = [
        {
            key: 1,
            label: 'Draft',
            icon: <PencilFillIcon className="inline text-muted-foreground" />,
            description: 'The Other Fund entry is in draft mode.',
            dateProp: null,
        },
        {
            key: 2,
            label: 'Printed',
            dateProp: printed_date,
            icon: <PrinterIcon className="inline text-muted-foreground" />,
            description: 'The voucher has been printed.',
        },
        {
            key: 3,
            label: 'Approved',
            dateProp: approved_date,
            icon: (
                <BadgeCheckFillIcon className="inline text-muted-foreground" />
            ),
            description: 'The request has been approved.',
        },
        {
            key: 4,
            label: 'Released',
            dateProp: released_date,
            icon: <BadgeCheckFillIcon className="inline text-primary" />,
            description: 'Funds have been released.',
        },
    ]

    const statusToStepMap: Record<TOtherFundModeType, number> = {
        draft: 1,
        printed: 2,
        approved: 3,
        released: 4,
    }

    const lastCompleted = statusToStepMap[currentStatus]

    return (
        <Timeline className="p-4 gap-y-3" value={lastCompleted}>
            {steps
                .filter((step) => step.key <= lastCompleted)
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
                                <TimelineTitle className="mt-0.5 flex items-center gap-1 text-xs">
                                    {step.icon}
                                    {step.label}
                                </TimelineTitle>
                            </TimelineHeader>
                            <TimelineContent>
                                <span className="text-muted-foreground text-[11px]">
                                    {step.description}
                                </span>
                                <TimelineDate className="mt-1 mb-0 text-[10px]">
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
    otherFund: IOtherFund
}

const OtherFundStatusIndicator = ({ className, otherFund }: Props) => {
    const voucherDates: IOtherFundStatusDates = {
        printed_date: otherFund.printed_date,
        approved_date: otherFund.approved_date,
        released_date: otherFund.released_date,
    }
    const resolvedStatus = resolveOtherFundStatusToMode(voucherDates)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <OtherFundStatusBadge
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
                <div className="space-y-1 px-3 py-2">
                    <p className="text-sm font-semibold">Other Fund Status</p>
                    <p className="text-[11px] text-muted-foreground">
                        Status is automatically updated based on system actions.
                    </p>
                </div>
                <Separator />
                <OtherFundStatusIndicatorDetails {...voucherDates} />
            </PopoverContent>
        </Popover>
    )
}

export default OtherFundStatusIndicator
