import { cn } from '@/helpers'
import { VariantProps, cva } from 'class-variance-authority'

import {
    BadgeCheckFillIcon,
    ClockIcon,
    PrinterIcon,
    TextFileFillIcon,
} from '@/components/icons'

export type TCashCheckStatusType =
    | 'pending'
    | 'printed'
    | 'approved'
    | 'released'

const cashCheckStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            status: {
                pending: cn(
                    'bg-warning dark:bg-warning/10 text-warning-foreground border-warning-foreground/20 hover:bg-warning/20'
                ),
                printed: cn(
                    'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                ),
                approved: cn(
                    'bg-accent text-accent-foreground border-accent hover:bg-accent'
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
            status: 'pending',
            size: 'md',
        },
    }
)

const cashCheckStatusIcons = {
    pending: ClockIcon,
    printed: PrinterIcon,
    approved: TextFileFillIcon,
    released: BadgeCheckFillIcon,
} as const

const cashCheckStatusLabels = {
    pending: 'Pending',
    printed: 'Printed',
    approved: 'Approved',
    released: 'Released',
} as const

export interface CashCheckStatusBadgeProps
    extends VariantProps<typeof cashCheckStatusVariants> {
    className?: string
    showIcon?: boolean
    status: TCashCheckStatusType
}

const CashCheckStatusBadge = ({
    status = 'pending',
    className,
    showIcon = true,
    size = 'md',
    ...props
}: CashCheckStatusBadgeProps) => {
    const IconComponent = cashCheckStatusIcons[status]
    const label = cashCheckStatusLabels[status]

    return (
        <div
            className={cn(
                cashCheckStatusVariants({ status, size }),
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

export default CashCheckStatusBadge
