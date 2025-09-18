import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'
import {
    CheckCircle,
    Download,
    Edit,
    EditIcon,
    Eye,
    EyeOff,
    FileDown,
    Plus,
    Trash,
    Trash2,
} from 'lucide-react'

import { TPermissionAction } from '../permission.types'

const permissionActionVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                Create: cn(
                    'bg-primary/10 text-primary/70 border-primary hover:bg-primary/20',
                    'dark:bg-green-950 dark:text-primary dark:border-primary/70 dark:hover:bg-primary/10'
                ),
                Read: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                Update: cn(
                    'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
                    'dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900'
                ),
                Delete: cn(
                    'bg-destructive/40 text-destructive/70 border-red-200 hover:bg-destructive/70',
                    'dark:bg-destructive/40 dark:text-destructive dark:border-red-800 dark:hover:bg-destructive/40'
                ),
                Export: cn(
                    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200',
                    'dark:bg-purple-950 dark:text-purple-300 dark:border-purple-800 dark:hover:bg-purple-900'
                ),
                Approve: cn(
                    'bg-emerald-100 text-emerald-800 border-emerald-200 hover:bg-emerald-200',
                    'dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800 dark:hover:bg-emerald-900'
                ),
                OwnRead: cn(
                    'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200',
                    'dark:bg-cyan-950 dark:text-cyan-300 dark:border-cyan-800 dark:hover:bg-cyan-900'
                ),
                OwnUpdate: cn(
                    'bg-orange-100 text-orange-800 border-orange-200 hover:bg-orange-200',
                    'dark:bg-orange-950 dark:text-orange-300 dark:border-orange-800 dark:hover:bg-orange-900'
                ),
                OwnDelete: cn(
                    'bg-rose-100 text-rose-800 border-rose-200 hover:bg-rose-200',
                    'dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800 dark:hover:bg-rose-900'
                ),
                OwnExport: cn(
                    'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200',
                    'dark:bg-indigo-950 dark:text-indigo-300 dark:border-indigo-800 dark:hover:bg-indigo-900'
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

interface PermissionActionBadgeProps
    extends VariantProps<typeof permissionActionVariants> {
    action: TPermissionAction
    className?: string
    showIcon?: boolean
}

const permissionActionIcons = {
    Create: Plus,
    Read: Eye,
    Update: Edit,
    Delete: Trash2,
    Export: Download,
    Approve: CheckCircle,
    OwnRead: EyeOff,
    OwnUpdate: EditIcon,
    OwnDelete: Trash,
    OwnExport: FileDown,
} as const

export function PermissionActionBadge({
    action,
    className,
    showIcon = false,
    size = 'md',
    ...props
}: PermissionActionBadgeProps) {
    const IconComponent = permissionActionIcons[action as TPermissionAction]

    return (
        <div
            className={cn(
                permissionActionVariants({ variant: action, size }),
                'rounded-full max-w-full min-w-0',
                className
            )}
            {...props}
        >
            {showIcon && IconComponent && (
                <IconComponent className={iconSizeVariants({ size })} />
            )}
            <span className="truncate">
                {action in permissionActionIcons ? action : 'unknown'}
            </span>
        </div>
    )
}

export { permissionActionVariants, iconSizeVariants }
export type PermissionActionBadgeVariants = VariantProps<
    typeof permissionActionVariants
>
