import { type VariantProps, cva } from 'class-variance-authority'
import { IconType } from 'react-icons/lib'

import { cn } from '@/lib/utils'

import { TTagCategory } from '@/types'

import ActionTooltip from '../action-tooltip'
import {
    BookOpenIcon,
    GearIcon,
    HandCoinsIcon,
    MoneyCheck2Icon,
    MoneyCheckIcon,
    ReceiptIcon,
    SigiBookIcon,
} from '../icons'

const tagTemplateBadgeVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                accounting: cn(
                    'bg-red-100 text-red-800 border-red-200 hover:bg-red-200',
                    'dark:bg-red-950 dark:text-red-300 dark:border-red-800 dark:hover:bg-red-900'
                ),
                voucher: cn(
                    'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200',
                    'dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800 dark:hover:bg-amber-900'
                ),
                'cash / check voucher': cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200',
                    'dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800 dark:hover:bg-blue-900'
                ),
                'journal voucher': cn(
                    'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200',
                    'dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-700'
                ),
                adjustment: cn('', ''),
                transaction: cn('', ''),
                'general acconting ledger': cn('', ''),
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

interface TagTemplateCategoryBadgeProps
    extends VariantProps<typeof tagTemplateBadgeVariants> {
    tagCategory: TTagCategory
    className?: string
    showIcon?: boolean
}

const TagCategoryIcons: Record<
    TTagCategory,
    { Icon: IconType; description: string }
> = {
    accounting: {
        Icon: HandCoinsIcon,
        description:
            'Used in general accounting modules for financial records and summaries',
    },
    voucher: {
        Icon: MoneyCheck2Icon,
        description:
            'Used in payment voucher management, including cash and check issuance',
    },
    'cash / check voucher': {
        Icon: MoneyCheckIcon,
        description:
            'Used specifically in modules handling petty cash, check issuance, or disbursement forms',
    },
    'general acconting ledger': {
        Icon: BookOpenIcon,
        description:
            'Used in the General Ledger module for summarizing all accounting transactions',
    },
    'journal voucher': {
        Icon: SigiBookIcon,
        description:
            'Used for journal entry tagging within the Journal Voucher input or posting screens',
    },
    adjustment: {
        Icon: GearIcon,
        description:
            'Used in modules involving inventory, accounting, or payroll adjustments',
    },
    transaction: {
        Icon: ReceiptIcon,
        description:
            'Used in modules that log or track sales, purchases, or other financial transactions',
    },
} as const

export function TagTemplateCategoryBadge({
    tagCategory,
    className,
    showIcon = true,
    size = 'md',
    ...props
}: TagTemplateCategoryBadgeProps) {
    const IconComponent = TagCategoryIcons[tagCategory as TTagCategory]

    return (
        <ActionTooltip
            side="bottom"
            tooltipContent={IconComponent.description ?? 'Tag Category'}
        >
            <div
                className={cn(
                    tagTemplateBadgeVariants({ variant: tagCategory, size }),
                    'rounded-full relative max-w-full min-w-0',
                    className
                )}
                {...props}
            >
                {showIcon && IconComponent && (
                    <IconComponent.Icon
                        className={iconSizeVariants({ size })}
                    />
                )}
                <span className="truncate capitalize">{tagCategory}</span>
            </div>
        </ActionTooltip>
    )
}

export { tagTemplateBadgeVariants, iconSizeVariants }
export type TagTemplateBadgeVariants = VariantProps<
    typeof tagTemplateBadgeVariants
>
