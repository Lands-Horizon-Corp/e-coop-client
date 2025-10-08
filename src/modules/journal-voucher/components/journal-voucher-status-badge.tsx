import { cn } from '@/helpers'
import { VariantProps, cva } from 'class-variance-authority'

import {
    BadgeCheckFillIcon,
    ClockIcon,
    PrinterIcon,
    TextFileFillIcon,
} from '@/components/icons'

export type TJournalVoucherStatusType =
    | 'draft'
    | 'printed'
    | 'approved'
    | 'released'

const journalVoucherStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border rounded-full max-w-full min-w-0',
    {
        variants: {
            status: {
                draft: cn(
                    'bg-gray-200 text-gray-700 border-gray-300 hover:bg-gray-300/80'
                ),
                printed: cn(
                    'bg-blue-100 text-blue-700 border-blue-300 hover:bg-blue-200'
                ),
                approved: cn(
                    'bg-success/20 text-success-foreground border-success/40 hover:bg-success/30'
                ),
                released: cn(
                    'bg-primary text-primary-foreground border-primary hover:bg-primary/90'
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
    printed: PrinterIcon,
    approved: TextFileFillIcon,
    released: BadgeCheckFillIcon,
} as const

const journalVoucherStatusLabels = {
    draft: 'Draft',
    printed: 'Printed',
    approved: 'Approved',
    released: 'Released',
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
                journalVoucherStatusVariants({ status, size, className })
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
