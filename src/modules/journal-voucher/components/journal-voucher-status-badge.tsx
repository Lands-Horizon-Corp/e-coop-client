import { cn } from '@/helpers'
import { VariantProps, cva } from 'class-variance-authority'

import {
    BadgeCheckFillIcon,
    ClockIcon,
    TextFileFillIcon,
} from '@/components/icons'

export type TJournalVoucherStatusType = 'draft' | 'posted' | 'cancelled'

const journalVoucherStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            status: {
                draft: cn(
                    'bg-warning dark:bg-warning/10 text-warning-foreground border-warning-foreground/20 hover:bg-warning/20'
                ),
                posted: cn(
                    'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
                ),
                cancelled: cn(
                    'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                ),
            },
            size: {
                sm: 'text-xs px-2 py-1 gap-1',
                md: 'text-sm px-2.5 py-1.5 gap-1.5',
                lg: 'text-base px-3 py-2 gap-2',
            },
        },
        defaultVariants: {
            status: 'draft',
            size: 'md',
        },
    }
)

const journalVoucherStatusIcons = {
    draft: ClockIcon,
    posted: BadgeCheckFillIcon,
    cancelled: TextFileFillIcon,
} as const

const journalVoucherStatusLabels = {
    draft: 'Draft',
    posted: 'Posted',
    cancelled: 'Cancelled',
} as const

export interface JournalVoucherStatusBadgeProps
    extends VariantProps<typeof journalVoucherStatusVariants> {
    className?: string
    showIcon?: boolean
    status: TJournalVoucherStatusType
}

const JournalVoucherStatusBadge = ({
    status = 'draft',
    className,
    showIcon = true,
    size = 'md',
    ...props
}: JournalVoucherStatusBadgeProps) => {
    const IconComponent = journalVoucherStatusIcons[status]
    const label = journalVoucherStatusLabels[status]

    return (
        <div
            className={cn(
                journalVoucherStatusVariants({ status, size }),
                'rounded-full max-w-full min-w-0',
                className
            )}
            {...props}
        >
            {showIcon && IconComponent && (
                <IconComponent className="flex-shrink-0 h-4 w-4" />
            )}
            <span className="truncate capitalize">{label}</span>
        </div>
    )
}

export default JournalVoucherStatusBadge
