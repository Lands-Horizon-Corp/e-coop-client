import { cn } from '@/helpers/tw-utils'
import { type VariantProps, cva } from 'class-variance-authority'
import { IconType } from 'react-icons/lib'

import {
    BuildingIcon,
    CalculatorIcon,
    HandCoinsIcon,
    IdCardIcon,
    InfoIcon,
    JudgeHammerIcon,
    LayersIcon,
    PiggyBankIcon,
    ShieldCheckIcon,
    SmartphoneIcon,
    SparkleIcon,
    StarIcon,
    TagIcon,
    UmbrellaIcon,
    Users3Icon,
    WarningIcon,
} from '@/components/icons'

import ActionTooltip from '../../../components/tooltips/action-tooltip'
import { TTagCategory } from '../tag-template.types'

const tagTemplateBadgeVariants = cva(
    'font-medium transition-colors duration-200 inline-flex items-center border',
    {
        variants: {
            variant: {
                'account type': cn(
                    'bg-primary/10 text-primary border-primary/20 hover:bg-primary/20'
                ),
                alert: cn(
                    'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20'
                ),
                calculation: cn(
                    'bg-accent/10 text-accent-foreground border-accent/20 hover:bg-accent/20'
                ),
                community: cn(
                    'bg-secondary/10 text-secondary-foreground border-secondary/20 hover:bg-secondary/20'
                ),
                cooperative: cn(
                    'bg-success/10 text-success-foreground border-success/20 hover:bg-success/20'
                ),
                digital: cn(
                    'bg-muted text-muted-foreground border-border hover:bg-muted/80'
                ),
                governance: cn(
                    'bg-popover text-popover-foreground border-popover/20 hover:bg-popover/80'
                ),
                insurance: cn(
                    'bg-blue-100 text-blue-800 border-blue-200 hover:bg-blue-200'
                ),
                loan: cn(
                    'bg-destructive/10 text-destructive border-destructive/20 hover:bg-destructive/20'
                ),
                membership: cn(
                    'bg-amber-100 text-amber-800 border-amber-200 hover:bg-amber-200'
                ),
                priority: cn(
                    'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200'
                ),
                reserves: cn(
                    'bg-slate-100 text-slate-800 border-slate-200 hover:bg-slate-200'
                ),
                security: cn(
                    'bg-green-100 text-green-800 border-green-200 hover:bg-green-200'
                ),
                special: cn(
                    'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200 hover:bg-fuchsia-200'
                ),
                status: cn(
                    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
                ),
                'transaction type': cn(
                    'bg-indigo-100 text-indigo-800 border-indigo-200 hover:bg-indigo-200'
                ),
                'cash check voucher tag': cn(
                    'bg-pink-100 text-pink-800 border-pink-200 hover:bg-pink-200'
                ),
                'journal voucher tag': cn(
                    'bg-cyan-100 text-cyan-800 border-cyan-200 hover:bg-cyan-200'
                ),
                'adjustment tag': cn(
                    'bg-lime-100 text-lime-800 border-lime-200 hover:bg-lime-200'
                ),
                'account tag': cn(
                    'bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-200'
                ),
                'loan transaction tag': cn(
                    'bg-purple-100 text-purple-800 border-purple-200 hover:bg-purple-200'
                ),
                default: cn(
                    'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200'
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
    'account type': {
        Icon: LayersIcon,
        description:
            'Tag for account types (e.g. savings, current, time deposit)',
    },
    alert: {
        Icon: WarningIcon,
        description: 'Used for warnings, reminders, or urgent notices',
    },
    calculation: {
        Icon: CalculatorIcon,
        description:
            'Tags related to computations, formulas, or calculated values',
    },
    community: {
        Icon: Users3Icon,
        description: 'For community, group, or member-related tags',
    },
    cooperative: {
        Icon: BuildingIcon,
        description: 'Tags for cooperative-wide or organization-level matters',
    },
    digital: {
        Icon: SmartphoneIcon,
        description: 'Digital, online, or system-generated tags',
    },
    governance: {
        Icon: JudgeHammerIcon,
        description: 'For compliance, board, or governance-related tags',
    },
    insurance: {
        Icon: UmbrellaIcon,
        description: 'Insurance, protection, or coverage tags',
    },
    loan: {
        Icon: HandCoinsIcon,
        description: 'Loan-related tags (products, types, or statuses)',
    },
    membership: {
        Icon: IdCardIcon,
        description: 'Membership, member status, or registration tags',
    },
    priority: {
        Icon: StarIcon,
        description: 'Priority, important, or high-value tags',
    },
    reserves: {
        Icon: PiggyBankIcon,
        description: 'Reserves, funds, or savings tags',
    },
    security: {
        Icon: ShieldCheckIcon,
        description: 'Security, authentication, or protection tags',
    },
    special: {
        Icon: SparkleIcon,
        description: 'Special, promo, or unique tags',
    },
    status: {
        Icon: InfoIcon,
        description: 'Status, progress, or state indicator tags',
    },
    'transaction type': {
        Icon: TagIcon,
        description: 'Tags for transaction types or classifications',
    },
    'cash check voucher tag': {
        Icon: TagIcon,
        description: 'Tags for cash or check voucher transactions',
    },
    'journal voucher tag': {
        Icon: TagIcon,
        description: 'Tags for journal voucher transactions',
    },
    'adjustment tag': {
        Icon: TagIcon,
        description: 'Tags for adjustment entries or transactions',
    },
    'account tag': {
        Icon: TagIcon,
        description: 'Tags for account-related classification',
    },
    'loan transaction tag': {
        Icon: TagIcon,
        description: 'Tags for loan transaction classification',
    },
}

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
            tooltipContent={IconComponent?.description || 'Tag Category'}
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
