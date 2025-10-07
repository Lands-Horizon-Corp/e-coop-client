import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'

import {
    BadgeCheckFillIcon,
    CheckIcon,
    PencilFillIcon,
    PrinterFillIcon,
    ThumbsUpIcon,
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

import { ICashCheckVoucher } from '../cash-check-voucher.types'
import CashCheckVoucherStatusBadge from './cash-check-voucher-status-badge'

export type CashCheckVoucherStatus =
    | 'pending'
    | 'printed'
    | 'approved'
    | 'released'

export interface ICashCheckVoucherStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

export const resolveCashCheckVoucherDatesToStatus = (
    dates: ICashCheckVoucherStatusDates
): CashCheckVoucherStatus => {
    if (dates.released_date) {
        return 'released'
    }
    if (dates.approved_date) {
        return 'approved'
    }
    if (dates.printed_date) {
        return 'printed'
    }
    return 'pending'
}

export const CashCheckVoucherStatusIndicatorDetails = ({
    printed_date,
    approved_date,
    released_date,
}: ICashCheckVoucherStatusDates) => {
    const steps = [
        {
            key: 1,
            label: 'Pending',
            icon: <PencilFillIcon className="inline text-muted-foreground" />,
            description: 'The voucher is pending creation/processing.',
        },
        {
            key: 2,
            label: 'Printed',
            date: printed_date,
            icon: <PrinterFillIcon className="inline text-muted-foreground" />,
            description: 'The Cash Check Voucher has been printed.',
        },
        {
            key: 3,
            label: 'Approved',
            date: approved_date,
            icon: <ThumbsUpIcon className="inline text-accent" />,
            description: 'The voucher has been approved.',
        },
        {
            key: 4,
            label: 'Released',
            date: released_date,
            icon: <BadgeCheckFillIcon className="inline text-primary" />,
            description: 'The funds/check have been released.',
        },
    ]

    const lastCompleted = released_date
        ? 4
        : approved_date
          ? 3
          : printed_date
            ? 2
            : 1

    return (
        <Timeline value={lastCompleted} className="p-4 gap-y-3">
            {steps.map((step) => (
                <TimelineItem
                    key={step.key}
                    step={step.key}
                    className="group-data-[orientation=vertical]/timeline:ms-10 group-data-[orientation=vertical]/timeline:not-last:pb-5"
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
                            {step.date &&
                                `${toReadableDateTime(step.date)} - ${dateAgo(step.date)}`}
                        </TimelineDate>
                    </TimelineContent>
                </TimelineItem>
            ))}
        </Timeline>
    )
}

interface Props extends IClassProps {
    cashCheckVoucher?: ICashCheckVoucher
    voucherDates?: {
        printed_date?: string | null
        approved_date?: string | null
        released_date?: string | null
    }
    title?: string
}

const CashCheckVoucherStatusIndicator = ({
    className,
    cashCheckVoucher,
    voucherDates,
    title = 'Cash Check Voucher Status',
}: Props) => {

    const finalDates: ICashCheckVoucherStatusDates = voucherDates ?? {
        printed_date: cashCheckVoucher?.printed_date,
        approved_date: cashCheckVoucher?.approved_date,
        released_date: cashCheckVoucher?.released_date,
    }

    const resolvedStatus = resolveCashCheckVoucherDatesToStatus(finalDates)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <CashCheckVoucherStatusBadge
                    size="sm"
                    className="cursor-pointer"
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
                    <p className="text-sm font-semibold">{title}</p>
                    <p className="text-xs text-muted-foreground">
                        This is an auto generated status by system.
                    </p>
                </div>
                <Separator />
                <CashCheckVoucherStatusIndicatorDetails {...voucherDates} />
            </PopoverContent>
        </Popover>
    )
}

export default CashCheckVoucherStatusIndicator
