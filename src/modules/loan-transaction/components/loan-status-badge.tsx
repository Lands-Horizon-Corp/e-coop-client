import { cn } from '@/helpers'
import { VariantProps, cva } from 'class-variance-authority'

import {
    BadgeCheckFillIcon,
    ClockIcon,
    PrinterIcon,
    TextFileFillIcon,
} from '@/components/icons'

import { TLoanStatusType } from '../loan-transaction.types'

const loanApplicationStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            status: {
                draft: cn(
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
            status: 'draft',
            size: 'md',
        },
    }
)

const loanApplicationStatusIcons = {
    draft: ClockIcon,
    printed: PrinterIcon,
    approved: TextFileFillIcon,
    released: BadgeCheckFillIcon,
} as const

const loanApplicationStatusLabels = {
    draft: 'Draft',
    printed: 'Printed',
    approved: 'Approved',
    released: 'Released',
} as const

export interface LoanApplicationStatusBadgeProps
    extends VariantProps<typeof loanApplicationStatusVariants> {
    className?: string
    showIcon?: boolean
    status: TLoanStatusType
}

const LoanApplicationStatusBadge = ({
    status = 'draft',
    className,
    showIcon = true,
    size = 'md',
    ...props
}: LoanApplicationStatusBadgeProps) => {
    // Determine status
    const IconComponent = loanApplicationStatusIcons[status]
    const label = loanApplicationStatusLabels[status]

    return (
        <div
            className={cn(
                loanApplicationStatusVariants({ status, size }),
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

export default LoanApplicationStatusBadge
