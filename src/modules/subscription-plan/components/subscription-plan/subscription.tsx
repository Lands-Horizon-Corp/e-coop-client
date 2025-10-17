import { useState } from 'react'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import PlanCard from '@/modules/home/components/subscription/subscription-plan-card'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import FormErrorMessage from '@/components/ui/form-error-message'

import { TEntityId } from '@/types'

import { ISubscriptionPlan, TPricingPlanMode, useGetAll } from '../../'

interface SubscriptionProps {
    onChange?: (value: TEntityId) => void
    onSelect?: (item: ISubscriptionPlan) => void
    value?: TEntityId | null
    disabled?: boolean
}
const SubscriptionPlanPicker = ({
    onChange,
    disabled,
    onSelect,
    value,
}: SubscriptionProps) => {
    const [mode, setMode] = useState<TPricingPlanMode>('monthly')
    const { data: subscriptionPlans, error: responseError } = useGetAll()

    const error = serverRequestErrExtractor({ error: responseError })

    const isSelected = (id: TEntityId) => id === value

    const handlePlanClick = (subscription: ISubscriptionPlan) => {
        if (disabled) return
        if (onChange) {
            onChange(subscription.id)
            onSelect?.(subscription)
        }
    }

    return (
        <div>
            <div className="flex w-full flex-col gap-2">
                <div className="flex w-full justify-center items-center">
                    <div className="p-1 bg-muted rounded-full inline-flex  gap-x-1 ">
                        {(['monthly', 'yearly'] as const).map((value) => (
                            <Button
                                className={cn(
                                    'rounded-full px-4 cursor-pointer hover:bg-background/70 py-1 text-sm transition-all',
                                    mode === value &&
                                        'bg-background shadow-sm text-foreground'
                                )}
                                key={value}
                                onClick={() => setMode(value)}
                                variant="ghost"
                            >
                                {value === 'monthly' ? 'Monthly' : 'Yearly'}
                            </Button>
                        ))}
                    </div>
                </div>
                <FormErrorMessage className="my-24" errorMessage={error} />
                {subscriptionPlans && (
                    <>
                        <div className="flex flex-wrap gap-2 py-8 min-w-fit">
                            {subscriptionPlans.map((subscriptionPlan) => (
                                <Card
                                    className="max-w-[300px] border-0 bg-transparent flex-1"
                                    key={subscriptionPlan.id}
                                    onClick={() =>
                                        handlePlanClick(subscriptionPlan)
                                    }
                                >
                                    <CardContent className="p-0 h-full">
                                        <PlanCard
                                            className={cn(
                                                'max-w-[300px] !min-h-[50vh] !h-full flex-1',
                                                isSelected(subscriptionPlan.id)
                                                    ? 'border-2 border-primary'
                                                    : ''
                                            )}
                                            key={subscriptionPlan.id}
                                            planMode={mode}
                                            subscriptionPlan={subscriptionPlan}
                                        />
                                    </CardContent>
                                </Card>
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
            </div>
        </div>
    )
}

export default SubscriptionPlanPicker
