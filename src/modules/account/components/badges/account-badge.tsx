import { cn } from '@/helpers'
import { VariantProps, cva } from 'class-variance-authority'

import { RenderIcon, TIcon } from '@/components/icons'

const accountBadgeVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border border-border',
    {
        variants: {
            size: {
                sm: 'text-xs px-2 py-1 gap-1',
                md: 'text-sm px-2.5 py-1.5 gap-1.5',
                lg: 'text-base px-3 py-2 gap-2',
            },
            variant: {
                transparent: 'bg-transparent text-muted-foreground',
                primary: 'bg-primary/10 text-primary border-primary/20',
                secondary: 'bg-secondary/10 text-secondary border-secondary/20',
                accent: 'bg-accent/10 text-accent border-accent/20',
            },
        },
        defaultVariants: {
            size: 'md',
            variant: 'transparent',
        },
    }
)

export interface AccountBadgeProps
    extends VariantProps<typeof accountBadgeVariants> {
    className?: string
    icon: TIcon
    name: string
    showIcon?: boolean
}

const AccountBadge = ({
    icon,
    name,
    className,
    showIcon = true,
    size = 'md',
    variant = 'transparent',
    ...props
}: AccountBadgeProps) => {
    return (
        <div
            className={cn(
                accountBadgeVariants({ size, variant }),
                'rounded-full max-w-full min-w-0',
                className
            )}
            {...props}
        >
            {showIcon && (
                <RenderIcon className="flex-shrink-0 h-4 w-4" icon={icon} />
            )}
            <span className="truncate capitalize">{name}</span>
        </div>
    )
}

export default AccountBadge
