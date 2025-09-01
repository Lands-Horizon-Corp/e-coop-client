import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'

import {
    BriefCaseIcon,
    CrownIcon,
    NotAllowedIcon,
    QuestionIcon,
    UserIcon,
} from '../../../components/icons'

export type TUserType = 'ban' | 'owner' | 'employee' | 'member'

const userTypeVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                ban: cn(
                    'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                    'dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900'
                ),
                owner: cn(
                    'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
                    'dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900'
                ),
                employee: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                member: cn(
                    'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200',
                    'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
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

interface UserTypeBadgeProps extends VariantProps<typeof userTypeVariants> {
    userType: TUserType
    className?: string
    showIcon?: boolean
}

const userTypeIcons = {
    ban: NotAllowedIcon,
    owner: CrownIcon,
    employee: BriefCaseIcon,
    member: UserIcon,
} as const

export function UserTypeBadge({
    userType,
    className,
    showIcon = true,
    size = 'md',
    ...props
}: UserTypeBadgeProps) {
    const IconComponent = userTypeIcons[userType as TUserType]

    return (
        <div
            className={cn(
                userTypeVariants({ variant: userType, size }),
                'rounded-full max-w-full min-w-0',
                className
            )}
            {...props}
        >
            {showIcon && IconComponent ? (
                <IconComponent className={iconSizeVariants({ size })} />
            ) : (
                <QuestionIcon className={iconSizeVariants({ size })} />
            )}
            <span className="truncate capitalize">
                {userType in userTypeIcons ? userType : 'unknown'}
            </span>
        </div>
    )
}

export { userTypeVariants, iconSizeVariants }
export type UserTypeBadgeVariants = VariantProps<typeof userTypeVariants>
