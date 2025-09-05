import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'
import { IconType } from 'react-icons/lib'

import { CheckIcon, ClockIcon, NotAllowedIcon } from '../../../components/icons'

export type TUserOrganizationApplicationStatus =
    | 'pending'
    | 'reported'
    | 'accepted'
    | 'ban'

const userOrganizationApplicationStatusVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                pending: cn(
                    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200',
                    'dark:bg-yellow-950 dark:text-yellow-300 dark:border-yellow-800 dark:hover:bg-yellow-900'
                ),
                reported: cn(
                    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
                    'dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900'
                ),
                accepted: cn(
                    'bg-primary/10 text-primary/70 border-primary hover:bg-primary/20',
                    'dark:bg-green-950 dark:text-primary dark:border-primary/70 dark:hover:bg-primary/10'
                ),
                ban: cn(
                    'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                    'dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900'
                ),
                default: cn(
                    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200',
                    'dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                ),
            },
            size: {
                sm: 'text-xs px-2 py-1 gap-1',
                md: 'text-sm px-2.5 py-1.5 gap-1.5',
                lg: 'text-base px-3 py-2 gap-2',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'md',
        },
    }
)

const iconSizeVariants = cva('flex-shrink-0', {
    variants: {
        size: {
            sm: 'h-3 w-3',
            md: 'h-3.5 w-3.5',
            lg: 'h-4 w-4',
        },
    },
    defaultVariants: {
        size: 'md',
    },
})

const userOrganizationApplicationStatusIcons: Record<
    TUserOrganizationApplicationStatus,
    IconType
> = {
    ban: NotAllowedIcon,
    accepted: CheckIcon,
    pending: ClockIcon,
    reported: NotAllowedIcon,
}

interface UserOrganizationApplicationStatusBadgeProps
    extends VariantProps<typeof userOrganizationApplicationStatusVariants> {
    status: TUserOrganizationApplicationStatus
    className?: string
    showIcon?: boolean
}

export function UserOrganizationApplicationStatusBadge({
    status,
    className,
    showIcon = true,
    size = 'md',
    ...props
}: UserOrganizationApplicationStatusBadgeProps) {
    const IconComponent =
        userOrganizationApplicationStatusIcons[
            status as keyof typeof userOrganizationApplicationStatusIcons
        ]

    return (
        <div
            className={cn(
                userOrganizationApplicationStatusVariants({
                    variant: status,
                    size,
                }),
                'rounded-full',
                className
            )}
            {...props}
        >
            {showIcon && IconComponent && (
                <IconComponent className={iconSizeVariants({ size })} />
            )}
            <span className="truncate capitalize">
                {status in userOrganizationApplicationStatusIcons ||
                ['pending', 'reported', 'accepted', 'ban'].includes(status)
                    ? status
                    : 'unknown'}
            </span>
        </div>
    )
}

export { userOrganizationApplicationStatusVariants, iconSizeVariants }
export type UserOrganizationApplicationStatusBadgeVariants = VariantProps<
    typeof userOrganizationApplicationStatusVariants
>
