import { useMemo } from 'react'

import { cn } from '@/helpers/tw-utils'

import { CheckIcon, XIcon } from '@/components/icons'
import { Progress } from '@/components/ui/progress'

import { IClassProps } from '@/types'

export interface Requirement {
    regex: RegExp
    text: string
}

export const ChecklistTemplate = {
    'password-checklist': [
        { regex: /.{8,}/, text: 'At least 8 characters' },
        { regex: /[0-9]/, text: 'At least 1 number' },
        { regex: /[a-z]/, text: 'At least 1 lowercase letter' },
        { regex: /[A-Z]/, text: 'At least 1 uppercase letter' },
    ],
}

export interface ValueChecklistMeterProps extends IClassProps {
    value: string
    showChecklist?: boolean
    hideOnComplete?: boolean
    maxChecklistItem?: number
    showStrengthLabel?: boolean
    checkList?: Requirement[]
}

export const ValueChecklistMeter: React.FC<ValueChecklistMeterProps> = ({
    value,
    className,
    maxChecklistItem,
    hideOnComplete = true,
    showChecklist = true,
    showStrengthLabel = false,
    checkList = ChecklistTemplate['password-checklist'],
}) => {
    const strength = checkList.map((req) => ({
        met: req.regex.test(value),
        text: req.text,
    }))

    const strengthPercentage = useMemo(() => {
        const metCount = strength.filter((req) => req.met).length
        return (metCount / checkList.length) * 100
    }, [strength, checkList])

    const getStrengthColor = (percentage: number) => {
        if (percentage <= 25) return 'bg-destructive' // Weak
        if (percentage <= 50) return 'bg-orange-500' // Okay
        if (percentage <= 75) return 'bg-amber-500' // Good
        return 'bg-emerald-500' // Great
    }

    const getStrengthLabel = (percentage: number) => {
        if (percentage <= 25) return 'Weak'
        if (percentage <= 50) return 'Okay'
        if (percentage <= 75) return 'Good'
        return 'Great'
    }

    const displayedChecklist = useMemo(() => {
        return maxChecklistItem ? strength.slice(0, maxChecklistItem) : strength
    }, [strength, maxChecklistItem])

    return (
        <div className={cn('space-y-1 py-1', className)}>
            <Progress
                className="h-1 bg-secondary transition-all duration-500 ease-out"
                indicatorClassName={getStrengthColor(strengthPercentage)}
                value={strengthPercentage}
            />
            {showStrengthLabel && (
                <p className="mt-2 text-sm font-medium">
                    Strength: {getStrengthLabel(strengthPercentage)}
                </p>
            )}

            {showChecklist &&
                !(strengthPercentage === 100 && hideOnComplete) && (
                    <ul
                        className="mt-3 space-y-1.5"
                        aria-label="Value requirements"
                    >
                        {displayedChecklist.map((req, index) => (
                            <li key={index} className="flex items-center gap-2">
                                {req.met ? (
                                    <CheckIcon
                                        size={16}
                                        className="text-emerald-500"
                                        aria-hidden="true"
                                    />
                                ) : (
                                    <XIcon
                                        size={16}
                                        className="text-muted-foreground/80"
                                        aria-hidden="true"
                                    />
                                )}
                                <span
                                    className={`text-xs ${
                                        req.met
                                            ? 'text-emerald-600'
                                            : 'text-muted-foreground'
                                    }`}
                                >
                                    {req.text}
                                    <span className="sr-only">
                                        {req.met
                                            ? ' - Requirement met'
                                            : ' - Requirement not met'}
                                    </span>
                                </span>
                            </li>
                        ))}
                    </ul>
                )}
        </div>
    )
}
