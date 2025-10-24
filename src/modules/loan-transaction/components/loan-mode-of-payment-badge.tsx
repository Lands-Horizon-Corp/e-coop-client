import { cn } from '@/helpers'
import { VariantProps, cva } from 'class-variance-authority'

import {
    BadgeCheckFillIcon,
    CalendarNumberIcon,
    ClockIcon,
    FileFillIcon,
    MoneyStackIcon,
    PrinterIcon,
} from '@/components/icons'

import { TLoanStatusTypeOfPayment } from '../loan-transaction.types'

// Map mode of payment to icon and label
const loanModeOfPaymentIcons = {
    day: ClockIcon,
    daily: ClockIcon,
    weekly: CalendarNumberIcon,
    'semi-monthly': PrinterIcon,
    monthly: CalendarNumberIcon,
    quarterly: FileFillIcon,
    'semi-annual': BadgeCheckFillIcon,
    lumpsum: MoneyStackIcon,
} as const

const loanModeOfPaymentLabels = {
    day: 'Daily',
    daily: 'Daily',
    weekly: 'Weekly',
    'semi-monthly': 'Semi-Monthly',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    'semi-annual': 'Semi-Annual',
    lumpsum: 'Lump Sum',
} as const

const loanModeOfPaymentVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            mode: {
                day: cn(
                    'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                ),
                daily: cn(
                    'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                ),
                weekly: cn(
                    'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                ),
                'semi-monthly': cn(
                    'bg-accent/30 text-accent-foreground border-accent/20 hover:bg-accent/20'
                ),
                monthly: cn(
                    'bg-success/10 text-success-foreground border-success/20 hover:bg-success/20'
                ),
                quarterly: cn(
                    'bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/20'
                ),
                'semi-annual': cn(
                    'bg-popover text-popover-foreground border-popover/20 hover:bg-popover/80'
                ),
                lumpsum: cn(
                    'bg-warning/10 text-warning-foreground border-warning/20 hover:bg-warning/20'
                ),
            },
            size: {
                sm: 'text-xs px-2 py-1 gap-1',
                md: 'text-sm px-2.5 py-1.5 gap-1.5',
                lg: 'text-base px-3 py-2 gap-2',
            },
        },
        defaultVariants: {
            mode: 'monthly',
            size: 'md',
        },
    }
)

export interface LoanModeOfPaymentBadgeProps
    extends VariantProps<typeof loanModeOfPaymentVariants> {
    className?: string
    showIcon?: boolean
    mode: TLoanStatusTypeOfPayment
}

const LoanModeOfPaymentBadge = ({
    mode = 'day',
    className,
    showIcon = true,
    size = 'md',
    ...props
}: LoanModeOfPaymentBadgeProps) => {
    const IconComponent = loanModeOfPaymentIcons[mode]
    const label = loanModeOfPaymentLabels[mode]

    return (
        <div
            className={cn(
                loanModeOfPaymentVariants({ mode, size }),
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

export default LoanModeOfPaymentBadge
