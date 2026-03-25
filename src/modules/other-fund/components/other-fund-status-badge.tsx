import { cn } from '@/helpers'
import { VariantProps, cva } from 'class-variance-authority'

import {
    BadgeCheckFillIcon,
    ClockIcon,
    PrinterIcon,
    TextFileFillIcon,
} from '@/components/icons'

// Aligned with the status logic in the Indicator component
export type TOtherFundModeType = 'draft' | 'printed' | 'approved' | 'released'

const otherFundStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border rounded-full max-w-full min-w-0',
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

const otherFundStatusIcons = {
    draft: ClockIcon,
    printed: PrinterIcon,
    approved: TextFileFillIcon,
    released: BadgeCheckFillIcon,
} as const

const otherFundStatusLabels = {
    draft: 'Draft',
    printed: 'Printed',
    approved: 'Approved',
    released: 'Released',
} as const

export interface OtherFundStatusBadgeProps extends VariantProps<
    typeof otherFundStatusVariants
> {
    className?: string
    showIcon?: boolean
    status: TOtherFundModeType
}

const OtherFundStatusBadge = ({
    status = 'draft',
    className,
    showIcon = true,
    size = 'md',
    ...props
}: OtherFundStatusBadgeProps) => {
    const IconComponent = otherFundStatusIcons[status]
    const label = otherFundStatusLabels[status]

    return (
        <div
            className={cn(otherFundStatusVariants({ status, size, className }))}
            {...props}
        >
            {showIcon && IconComponent && (
                <IconComponent className="flex-shrink-0 h-4 w-4" />
            )}
            <span className="truncate capitalize">{label}</span>
        </div>
    )
}

export default OtherFundStatusBadge
