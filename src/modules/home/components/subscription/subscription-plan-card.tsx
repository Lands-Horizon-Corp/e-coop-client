import { cn, formatNumber } from '@/helpers'
import { currencyFormat } from '@/modules/currency'
import {
    ISubscriptionPlan,
    TPricingPlanMode,
} from '@/modules/subscription-plan'

import {
    BrainIcon,
    BuildingBranchIcon,
    ClockIcon,
    CodeIcon,
    RobotIcon,
    UserShieldIcon,
    Users3FillIcon,
    UsersAddIcon,
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
        <div
            className={cn(
                'relative rounded-3xl border border-border/50 bg-card/80 backdrop-blur-sm overflow-hidden group',
                'hover:bg-card/90 transition-all duration-300',
                className
            )}
        >
            {/* Recommended Badge */}
            {subscriptionPlan.is_recommended && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10">
                    <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1 rounded-b-lg">
                        Recommended
                    </div>
                </div>
            )}

            <div className="p-8 space-y-6">
                {/* Plan Header */}
                <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground">
                        {subscriptionPlan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        {subscriptionPlan.description}
                    </p>
                </div>

                {/* Pricing */}
                <div className="space-y-3">
                    <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-bold text-foreground">
                            {currencyFormat(finalPricing, {
                                currency: subscriptionPlan.currency,
                                showSymbol: !!subscriptionPlan.currency,
                            })}
                        </span>
                        <span className="text-muted-foreground/70 text-sm">
                            /{planMode === 'monthly' ? 'month' : 'year'}
                        </span>
                    </div>

                    {(finalPricing !== subscriptionPlan.cost ||
                        discountPercent > 0) && (
                        <div className="flex items-center gap-2 flex-wrap">
                            {finalPricing !== subscriptionPlan.cost && (
                                <span className="text-sm text-muted-foreground/60 line-through">
                                    $
                                    {formatNumber(
                                        planMode === 'monthly'
                                            ? subscriptionPlan.monthly_price
                                            : subscriptionPlan.yearly_price,
                                        0
                                    )}
                                </span>
                            )}
                            {discountPercent > 0 && (
                                <Badge
                                    className="text-xs bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                                    variant="secondary"
                                >
                                    Save {discountPercent}%
                                </Badge>
                            )}
                        </div>
                    )}
                </div>

                {/* Features List */}
                <div className="space-y-4">
                    {/* Limits Section */}
                    <div className="space-y-3">
                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <BuildingBranchIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-foreground">
                                    {subscriptionPlan.max_branches === -1
                                        ? 'Unlimited'
                                        : subscriptionPlan.max_branches}
                                </span>
                                <span className="text-muted-foreground ml-1">
                                    Branches
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <UserShieldIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-foreground">
                                    {subscriptionPlan.max_employees === -1
                                        ? 'Unlimited'
                                        : subscriptionPlan.max_employees}
                                </span>
                                <span className="text-muted-foreground ml-1">
                                    Employees
                                </span>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                <Users3FillIcon className="h-4 w-4 text-primary" />
                            </div>
                            <div className="text-sm">
                                <span className="font-medium text-foreground">
                                    {subscriptionPlan.max_members_per_branch ===
                                    -1
                                        ? 'Unlimited'
                                        : subscriptionPlan.max_members_per_branch}
                                </span>
                                <span className="text-muted-foreground ml-1">
                                    Members per Branch
                                </span>
                            </div>
                        </div>

                        {subscriptionPlan.max_api_calls_per_month > 0 && (
                            <div className="flex items-center gap-3">
                                <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                                    <ClockIcon className="h-4 w-4 text-primary" />
                                </div>
                                <div className="text-sm">
                                    <span className="font-medium text-foreground">
                                        {subscriptionPlan.max_api_calls_per_month.toLocaleString()}
                                    </span>
                                    <span className="text-muted-foreground ml-1">
                                        API calls/month
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Core Features Section */}
                    {(subscriptionPlan.has_api_access ||
                        subscriptionPlan.has_flexible_org_structures ||
                        subscriptionPlan.has_ai_enabled ||
                        subscriptionPlan.has_machine_learning) && (
                        <div className="border-t border-border/30 pt-4">
                            <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                                Features Included
                            </h4>
                            <div className="space-y-2">
                                {subscriptionPlan.has_api_access && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-foreground">
                                            <CodeIcon className="inline size-4 mr-1 text-primary" />{' '}
                                            API Access
                                        </span>
                                    </div>
                                )}
                                {subscriptionPlan.has_flexible_org_structures && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-foreground">
                                            <UsersAddIcon className="inline size-4 mr-1 text-primary" />{' '}
                                            Flexible Organization Structures
                                        </span>
                                    </div>
                                )}
                                {subscriptionPlan.has_ai_enabled && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-foreground">
                                            <RobotIcon className="inline size-4 mr-1 text-primary" />{' '}
                                            AI Enabled
                                        </span>
                                    </div>
                                )}
                                {subscriptionPlan.has_machine_learning && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-foreground">
                                            <BrainIcon className="inline size-4 mr-1 text-primary" />{' '}
                                            Machine Learning
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default PlanCard
