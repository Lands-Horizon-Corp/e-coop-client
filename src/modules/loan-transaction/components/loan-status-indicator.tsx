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

import { ILoanTransactionStatusDates } from '../loan-transaction.types'
import { resolveLoanDatesToStatus } from '../loan.utils'
import LoanStatusBadge from './loan-status-badge'

interface Props extends IClassProps {
    loanTransactionDates: ILoanTransactionStatusDates
}

const LoanStatusIndicator = ({ className, loanTransactionDates }: Props) => {
    const resolvedLoanStatus = resolveLoanDatesToStatus(loanTransactionDates)

    return (
        <Popover>
            <PopoverTrigger asChild>
                <LoanStatusBadge
                    size="sm"
                    className="cursor-pointer"
                    status={resolvedLoanStatus}
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
                        Loan Application Status
                    </p>
                    <p className="text-xs text-muted-foreground">
                        This is an auto generated status by system.
                    </p>
                </div>
                <Separator />
                <LoanStatusIndicatorDetails {...loanTransactionDates} />
            </PopoverContent>
        </Popover>
    )
}

export const LoanStatusIndicatorDetails = ({
    printed_date,
    approved_date,
    released_date,
}: ILoanTransactionStatusDates) => {
    const steps = [
        {
            key: 1,
            label: 'Draft',
            icon: <PencilFillIcon className="inline text-muted-foreground" />,
            description: 'This Loan is in draft mode and can be changed',
        },
        {
            key: 2,
            label: 'Printed',
            date: printed_date,
            icon: <PrinterFillIcon className="inline text-muted-foreground" />,
            description: 'Loan has been printed',
        },
        {
            key: 3,
            label: 'Approved',
            date: approved_date,
            icon: <ThumbsUpIcon className="inline text-accent" />,
            description: 'Loan has been approved',
        },
        {
            key: 4,
            label: 'Released',
            date: released_date,
            icon: <BadgeCheckFillIcon className="inline text-primary" />,
            description: 'Loan has been finalized and released',
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

export default LoanStatusIndicator
