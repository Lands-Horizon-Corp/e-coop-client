import { cn, formatNumber } from '@/helpers'
import {
    ISubscriptionPlan,
    TPricingPlanMode,
} from '@/modules/subscription-plan'

import {
    BuildingBranchIcon,
    ClockIcon,
    UserShieldIcon,
    Users3FillIcon,
} from '@/components/icons'
import { Badge } from '@/components/ui/badge'

import { IClassProps } from '@/types'

const PlanCard = ({
    subscriptionPlan,
    className,
    planMode = 'monthly',
}: {
    subscriptionPlan: ISubscriptionPlan
    planMode: TPricingPlanMode
} & IClassProps) => {
    const discountPercent =
        planMode === 'monthly'
            ? subscriptionPlan.discount
            : subscriptionPlan.yearly_discount

    const finalPricing =
        planMode === 'monthly'
            ? subscriptionPlan.discounted_monthly_price
            : subscriptionPlan.discounted_yearly_price

    return (
        <div className={cn('rounded-2xl border pb-8 bg-background', className)}>
            <div className="space-y-2 pt-8 pb-4 px-8 relative">
                <p className="text-xl">{subscriptionPlan.name}</p>
                <p className="text-sm text-muted-foreground/80">
                    {subscriptionPlan.description}
                </p>
            </div>
            <div className="px-8 py-6 space-y-2">
                <p className="text-5xl text-foreground">
                    {/* {formatNumber(finalPricing, 2)} */}
                    {formatNumber(finalPricing, 2)}
                    <span className="text-muted-foreground/70 text-sm font-normal">
                        / month
                    </span>
                </p>

                <div className="flex items-center gap-x-2">
                    {finalPricing !== subscriptionPlan.cost && (
                        <p className="text-xl relative inline-flex text-muted-foreground/70">
                            {formatNumber(
                                planMode === 'monthly'
                                    ? subscriptionPlan.monthly_price
                                    : subscriptionPlan.yearly_price,
                                2
                            )}
                            <span className="w-full absolute left-0 top-1/2 bg-primary -translate-y-1/2 h-0.5 rounded-full -rotate-6" />
                        </p>
                    )}
                    {discountPercent > 0 && (
                        <Badge
                            variant="secondary"
                            className="text-muted-foreground bg-primary/10 border-primary/70"
                        >
                            {discountPercent}% Discount
                        </Badge>
                    )}
                </div>
            </div>
            <div className="px-8 space-y-6 pt-6 text-sm">
                <p className="text-muted-foreground">
                    <span className=" mr-4 text-muted-foreground/70 p-1.5 bg-secondary/60 rounded-md">
                        <BuildingBranchIcon className="inline" />
                    </span>
                    <span className="text-foreground">
                        {subscriptionPlan.max_branches}
                    </span>{' '}
                    Max Branch
                </p>

                <p className="text-muted-foreground">
                    <span className=" mr-4 text-muted-foreground/70 p-1.5 bg-secondary/60 rounded-md">
                        <UserShieldIcon className="inline" />
                    </span>
                    <span className="text-foreground">
                        {subscriptionPlan.max_employees}{' '}
                    </span>{' '}
                    Max Employee
                </p>

                <p className="text-muted-foreground">
                    <span className=" mr-4 text-muted-foreground/70 p-1.5 bg-secondary/60 rounded-md">
                        <Users3FillIcon className="inline" />
                    </span>
                    <span className="text-foreground">
                        {subscriptionPlan.max_members_per_branch}
                    </span>{' '}
                    Max Member / Branch
                </p>

                <p className="text-muted-foreground">
                    <span className=" mr-4 text-muted-foreground/70 p-1.5 bg-secondary/60 rounded-md">
                        <ClockIcon className="inline" />
                    </span>
                    Up to{' '}
                    <span className="text-foreground">
                        {subscriptionPlan.max_members_per_branch}
                    </span>{' '}
                    Months
                </p>
            </div>
        </div>
    )
}

export default PlanCard
