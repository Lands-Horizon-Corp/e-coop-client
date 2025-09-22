import { cn } from '@/helpers'
import { VariantProps, cva } from 'class-variance-authority'

import {
    BadgeCheckFillIcon,
    ClockIcon,
    PrinterIcon,
    TextFileFillIcon,
} from '@/components/icons'

import { TLoanStatusType } from '../loan-transaction.types'

const loanStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            status: {
                draft: cn(
                    'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                ),
                printed: cn(
                    'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                ),
                approved: cn(
                    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                    // You can replace above with your custom palette if you have e.g. 'bg-warning text-warning-foreground border-warning'
                ),
                released: cn(
                    'bg-success text-success-foreground border-success hover:bg-success/90'
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

const loanStatusIcons = {
    draft: ClockIcon,
    printed: PrinterIcon,
    approved: TextFileFillIcon,
    released: BadgeCheckFillIcon,
} as const

const loanStatusLabels = {
    draft: 'Draft',
    printed: 'Printed',
    approved: 'Approved',
    released: 'Released',
} as const

export interface LoanStatusBadgeProps
    extends VariantProps<typeof loanStatusVariants> {
    className?: string
    showIcon?: boolean
    status: TLoanStatusType
}

const LoanStatusBadge = ({
    status = 'draft',
    className,
    showIcon = true,
    size = 'md',
    ...props
}: LoanStatusBadgeProps) => {
    // Determine status
    const IconComponent = loanStatusIcons[status]
    const label = loanStatusLabels[status]

    return (
        <div
            className={cn(
                loanStatusVariants({ status, size }),
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

export default LoanStatusBadge
