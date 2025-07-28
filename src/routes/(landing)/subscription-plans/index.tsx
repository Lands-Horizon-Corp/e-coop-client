import { useState } from 'react'

import { cn } from '@/lib'
import { formatNumber } from '@/utils'
import { createFileRoute } from '@tanstack/react-router'
import { Link } from '@tanstack/react-router'

import PageContainer from '@/components/containers/page-container'
import { FlickeringGrid } from '@/components/elements/backgrounds/flickering-grid'
import {
    BuildingBranchIcon,
    ClockIcon,
    PaperPlaneIcon,
    UserShieldIcon,
    Users3FillIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'

import { useSubscriptionPlans } from '@/hooks/api-hooks/use-subscription-plan'

import { IClassProps, ISubscriptionPlan } from '@/types'

type PricingPlanMode = 'monthly' | 'yearly'

export const Route = createFileRoute('/(landing)/subscription-plans/')({
    component: RouteComponent,
})

function RouteComponent() {
    const [mode, setMode] = useState<PricingPlanMode>('monthly')
    const { data: subscriptionPlans, isPending, error } = useSubscriptionPlans()

    return (
        <PageContainer className="py-8 space-y-2 relative bg-background/10 backdrop-blur-sm">
            <FlickeringGrid
                gridGap={1}
                squareSize={64}
                color="#02BEAA"
                maxOpacity={0.5}
                flickerChance={0.05}
                className="absolute inset-0 -z-10 opacity-80 [mask-image:radial-gradient(80vh_circle_at_center,white,transparent)] dark:opacity-20"
            />

            <p className="text-4xl">ECoop Pricing Plans</p>
            <p className="text-sm text-muted-foreground/80">
                Flexible and transparent pricing designed to fit cooperatives of
                all sizes, pay only for what you need as you grow.
            </p>
            <FormErrorMessage errorMessage={error} />
            {isPending && <LoadingSpinner className="mx-auto" />}
            {subscriptionPlans && (
                <>
                    <div className="p-1 bg-muted rounded-full inline-flex border !mt-9 gap-x-1 border-border">
                        {(['monthly', 'yearly'] as const).map((value) => (
                            <Button
                                key={value}
                                variant="ghost"
                                className={cn(
                                    'rounded-full px-4 hover:bg-background/70 py-1 text-sm transition-all',
                                    mode === value &&
                                        'bg-background shadow-sm text-foreground'
                                )}
                                onClick={() => setMode(value)}
                            >
                                {value === 'monthly' ? 'Monthly' : 'Yearly'}
                            </Button>
                        ))}
                    </div>
                    <div className="grid grid-cols-4 gap-4 py-8">
                        {subscriptionPlans.map((subscriptionPlan) => (
                            <PlanCard
                                key={subscriptionPlan.id}
                                planMode={mode}
                                subscriptionPlan={subscriptionPlan}
                            />
                        ))}
                    </div>
                    {subscriptionPlans.length === 0 && (
                        <div className="flex items-center min-h-[60vh] w-full justify-center">
                            <p className="text-muted-foreground/80">
                                No available plans yet.
                            </p>
                        </div>
                    )}
                </>
            )}
            <div className="p-4 rounded-2xl border bg-popover items-center flex gap-x-4">
                <div className="space-y-2">
                    <p>Need a custom plan?</p>
                    <p className="text-muted-foreground">
                        Talk to us and we&apos;l happy to discuss and setup
                        something just for you.
                    </p>
                </div>
                <Button size="sm" className="rounded-full px-4" asChild>
                    <Link to="/contact">
                        {' '}
                        Talk to us
                        <PaperPlaneIcon className="ml-2" />
                    </Link>
                </Button>
            </div>
        </PageContainer>
    )
}

const PlanCard = ({
    subscriptionPlan,
    className,
    planMode = 'monthly',
}: {
    subscriptionPlan: ISubscriptionPlan
    planMode: PricingPlanMode
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
                            <div className="w-full absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-muted-foreground rounded-full -rotate-6" />
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
