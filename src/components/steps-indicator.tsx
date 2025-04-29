import { Progress } from '@/components/ui/progress'

import { cn } from '@/lib/utils'
import { IClassProps } from '@/types'

interface Props extends IClassProps {
    totalSteps: number
    currentStep: number
    indicatorClassName?: string
}

const StepIndicator = ({
    className,
    totalSteps,
    currentStep,
    indicatorClassName,
}: Props) => {
    if (currentStep > totalSteps)
        throw new Error('currentStep must not greater than totalSteps')
    if (currentStep <= 0) throw new Error('currentStep must not less than 1')

    return (
        <div className={cn('space-y-2 text-sm', className)}>
            <p>
                Step {currentStep} of {totalSteps}
            </p>
            <Progress
                className="h-1.5 min-w-full"
                value={((currentStep - 1) / totalSteps) * 100}
                indicatorClassName={cn(
                    'bg-green-500 duration-700',
                    indicatorClassName
                )}
            />
        </div>
    )
}

export default StepIndicator
