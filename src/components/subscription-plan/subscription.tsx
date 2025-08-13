import { cn } from '@/lib'

import { useSubscriptionPlans } from '@/hooks/api-hooks/use-subscription-plan'

import { ISubscriptionPlan, TEntityId } from '@/types'

import { CheckFillIcon } from '../icons'
import { Button } from '../ui/button'
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '../ui/card'

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
    const { data } = useSubscriptionPlans()

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
            <div className="flex w-full flex-row gap-2">
                <div className="grid grid-cols-3 gap-5">
                    {data?.map((item) => {
                        return (
                            <Card
                                key={item.id}
                                onClick={() => {
                                    handlePlanClick(item)
                                }}
                                className={`w-full cursor-pointer items-center justify-between rounded-2xl border-0 p-2 ${isSelected(item.id) ? 'border border-primary' : ''}`}
                            >
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">
                                        {item.name}
                                    </CardTitle>
                                    <span className="text-sm text-gray-500">
                                        {item.description}
                                    </span>
                                </CardHeader>
                                <CardContent>
                                    <span className="text-3xl font-semibold">
                                        ₱ {item.cost} {''}
                                        <span className="text-lg text-card-foreground/50">
                                            /month
                                        </span>
                                    </span>
                                    <div className="flex flex-col gap-2 p-5">
                                        <span className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckFillIcon className="text-primary" />
                                            Max Branches {item.max_branches}
                                        </span>
                                        <span className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckFillIcon className="text-primary" />
                                            Max Employees {item.max_employees}
                                        </span>
                                        <span className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckFillIcon className="text-primary" />
                                            Max Members per Branch{' '}
                                            {item.max_members_per_branch}
                                        </span>
                                        <span className="flex items-center gap-2 text-sm text-gray-500">
                                            <CheckFillIcon className="text-primary" />
                                            Timespan {item.timespan} months
                                        </span>
                                    </div>
                                </CardContent>
                                <CardFooter>
                                    <Button
                                        variant={
                                            isSelected(item.id)
                                                ? 'default'
                                                : 'ghost'
                                        }
                                        onClick={(e) => {
                                            e.preventDefault()
                                            e.stopPropagation()
                                            handlePlanClick(item)
                                        }}
                                        className={cn(
                                            'w-full rounded-full border-2',
                                            isSelected(item.id)
                                                ? 'border-0'
                                                : 'border-1 border-primary'
                                        )}
                                    >
                                        Get Plan
                                    </Button>
                                </CardFooter>
                            </Card>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

export default SubscriptionPlanPicker
