import { ReactNode } from 'react'

import { cn } from '@/helpers'

import {
    ArrowDownIcon,
    ArrowTrendUpIcon,
    ArrowUpDownIcon,
    CalculatorIcon,
    HorizontalRuleIcon,
    MoneyTrendIcon,
    PercentIcon,
} from '@/components/icons'

import {
    COMPUTATION_TYPE_DESCRIPTIONS,
    LUMPSUM_COMPUTATION_TYPE_DESCRIPTIONS,
} from '../../account.constants'
import {
    TComputationType,
    TInterestFinesComputationDiminishing,
    TInterestFinesComputationDiminishingStraightDiminishingYearly,
    TLumpsumComputationType,
} from '../../account.types'

/**
 * Display Computation Type with icon and description
 * Used in Loan, Interest, Fines, etc.
 */
export const ComputationTypeDisplay = ({
    computationType,
    label = 'Computation Type',
}: {
    computationType?: TComputationType
    label?: string
}) => {
    return (
        <div className="space-y-2">
            <p className="font-medium text-sm">{label}</p>
            <div
                className={cn(
                    'relative flex w-full items-center gap-3 rounded-2xl border px-2.5 py-2',
                    computationType
                        ? 'border-primary bg-primary/20'
                        : 'border-input bg-muted/30'
                )}
            >
                <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                    {computationType === 'Straight' && (
                        <HorizontalRuleIcon className="inline" />
                    )}
                    {computationType === 'Diminishing' && (
                        <ArrowDownIcon className="inline" />
                    )}
                    {computationType === 'Diminishing Straight' && (
                        <ArrowUpDownIcon className="inline" />
                    )}
                    {!computationType && (
                        <ArrowTrendUpIcon className="inline" />
                    )}
                </div>
                <div className="flex-1 text-sm">
                    <p className="font-semibold">
                        {computationType || 'Not Set'}
                    </p>
                    {computationType &&
                        COMPUTATION_TYPE_DESCRIPTIONS[computationType] && (
                            <p className="text-xs mt-1">
                                {COMPUTATION_TYPE_DESCRIPTIONS[computationType]}
                            </p>
                        )}
                </div>
            </div>
        </div>
    )
}

/**
 * Display Lumpsum Computation Type with icon and description
 * Used in Fines, Interest, etc.
 */
export const LumpsumComputationTypeDisplay = ({
    lumpsumComputationType,
    label = 'Lumpsum Computation Type',
}: {
    lumpsumComputationType?: TLumpsumComputationType
    label?: string
}) => {
    return (
        <div className="space-y-2">
            <p className="font-medium text-sm">{label}</p>
            <div
                className={cn(
                    'relative flex w-full items-center gap-3 rounded-2xl border px-2.5 py-2',
                    lumpsumComputationType && lumpsumComputationType !== 'None'
                        ? 'border-primary bg-primary/20'
                        : 'border-input bg-muted/30'
                )}
            >
                <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                    {(!lumpsumComputationType ||
                        lumpsumComputationType === 'None') && (
                        <HorizontalRuleIcon className="inline" />
                    )}
                    {lumpsumComputationType === 'Compute Fines Maturity' && (
                        <PercentIcon className="inline" />
                    )}
                    {lumpsumComputationType ===
                        'Compute Interest Maturity / Terms' && (
                        <MoneyTrendIcon className="inline" />
                    )}
                    {lumpsumComputationType === 'Compute Advance Interest' && (
                        <CalculatorIcon className="inline" />
                    )}
                </div>
                <div className="flex-1 text-sm">
                    <p className="font-semibold">
                        {lumpsumComputationType || 'None'}
                    </p>
                    {lumpsumComputationType &&
                        LUMPSUM_COMPUTATION_TYPE_DESCRIPTIONS[
                            lumpsumComputationType
                        ] && (
                            <p className="text-xs mt-1">
                                {
                                    LUMPSUM_COMPUTATION_TYPE_DESCRIPTIONS[
                                        lumpsumComputationType
                                    ]
                                }
                            </p>
                        )}
                </div>
            </div>
        </div>
    )
}

/**
 * Display numeric amounts with labels (Min/Max, etc.)
 */
export const AmountDisplay = ({
    label,
    value,
    suffix,
}: {
    label: string
    value?: number
    suffix?: string
}) => {
    return (
        <div className="space-y-2">
            <p className="font-medium text-sm">{label}</p>
            <div
                className={cn(
                    'relative flex w-full items-center gap-3 rounded-2xl border px-4 py-3',
                    value
                        ? 'border-primary bg-primary/20'
                        : 'border-input bg-muted/30'
                )}
            >
                <div className="flex-1 text-sm">
                    <p className="font-semibold text-lg">
                        {value !== undefined && value !== null
                            ? value.toFixed(2)
                            : '0.00'}
                        {suffix && (
                            <span className="text-xs ml-1 text-muted-foreground">
                                {suffix}
                            </span>
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}

/**
 * Display a field with icon, title, description
 */
export const FieldDisplay = ({
    icon,
    title,
    description,
    value,
    isActive,
}: {
    icon: ReactNode
    title: string
    description: string
    value?: string | ReactNode
    isActive?: boolean
}) => {
    return (
        <div
            className={cn(
                'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                isActive
                    ? 'border-primary bg-primary/20'
                    : 'border-input bg-muted/30'
            )}
        >
            <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                {icon}
            </div>
            <div className="flex-1 text-sm min-w-0">
                <p className="font-medium">{title}</p>
                <p className="text-xs text-muted-foreground mt-1">
                    {description}
                </p>
            </div>
            {value && (
                <div className="flex shrink-0 items-center justify-center rounded-full px-2 py-1.5 text-sm font-medium">
                    {value}
                </div>
            )}
        </div>
    )
}

/**
 * Display boolean toggle result
 */
export const BooleanFieldDisplay = ({
    icon,
    title,
    description,
    value,
}: {
    icon: ReactNode
    title: string
    description?: string
    value?: boolean
}) => {
    return (
        <div
            className={cn(
                'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                value
                    ? 'border-primary bg-primary/20'
                    : 'border-input bg-muted/30'
            )}
        >
            <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                {icon}
            </div>
            <div className="flex-1 text-sm">
                <p className="font-medium">{title}</p>
                {description && (
                    <p className="text-xs text-muted-foreground mt-1">
                        {description}
                    </p>
                )}
            </div>
            <div className="flex shrink-0 items-center justify-center rounded-full px-2 py-1.5 text-sm font-medium">
                {value ? 'Yes' : 'No'}
            </div>
        </div>
    )
}

const INTEREST_FINES_COMPUTATION_DIMINISHING_DESCRIPTIONS: Record<
    TInterestFinesComputationDiminishing,
    string
> = {
    None: 'No interest/fines computation method is applied.',
    'By Amortization':
        'Interest and fines are calculated based on the amortization schedule.',
    'By Amortization Daly on Interest Principal + Interest = Fines(Arr)':
        'Daily interest computation on principal plus interest equals fines in arrears.',
}

export const InterestFinesComputationDim = ({
    value = 'None',
}: {
    value?: TInterestFinesComputationDiminishing
}) => {
    return (
        <div className="space-y-2">
            <p className="font-medium text-sm">Int/Fines Computation (Dim.)</p>
            <div
                className={cn(
                    'relative flex w-full items-center gap-3 rounded-2xl border px-2.5 py-2',
                    value !== 'None'
                        ? 'border-primary bg-primary/20'
                        : 'border-input bg-muted/30'
                )}
            >
                <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                    {value === 'None' && (
                        <HorizontalRuleIcon className="inline" />
                    )}
                    {value === 'By Amortization' && (
                        <ArrowTrendUpIcon className="inline" />
                    )}
                    {value ===
                        'By Amortization Daly on Interest Principal + Interest = Fines(Arr)' && (
                        <ArrowUpDownIcon className="inline" />
                    )}
                </div>
                <div className="flex-1 text-sm">
                    <p className="font-semibold">{value}</p>
                    {INTEREST_FINES_COMPUTATION_DIMINISHING_DESCRIPTIONS[
                        value
                    ] && (
                        <p className="text-xs mt-1">
                            {
                                INTEREST_FINES_COMPUTATION_DIMINISHING_DESCRIPTIONS[
                                    value
                                ]
                            }
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}

const INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_YEARLY_DESCRIPTIONS: Record<
    TInterestFinesComputationDiminishingStraightDiminishingYearly,
    string
> = {
    None: 'No interest/fines computation method is applied for diminishing straight yearly.',
    'By Daily on Interest based on loan balance by year Principal + Interest Amortization = Fines Fines Grace Period Month end Amortization':
        'Daily interest computation based on loan balance by year. Principal plus interest amortization equals fines with grace period month-end amortization.',
}

export const InterestFinesComputationDimStraightYearly = ({
    value = 'None',
}: {
    value?: TInterestFinesComputationDiminishingStraightDiminishingYearly
}) => {
    return (
        <div className="space-y-2">
            <p className="font-medium text-sm">
                Int/Fines Computation (Dim. Straight, Dim. Yearly)
            </p>
            <div
                className={cn(
                    'relative flex w-full items-center gap-3 rounded-2xl border px-2.5 py-2',
                    value !== 'None'
                        ? 'border-primary bg-primary/20'
                        : 'border-input bg-muted/30'
                )}
            >
                <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                    {value === 'None' && (
                        <HorizontalRuleIcon className="inline" />
                    )}
                    {value ===
                        'By Daily on Interest based on loan balance by year Principal + Interest Amortization = Fines Fines Grace Period Month end Amortization' && (
                        <ArrowUpDownIcon className="inline" />
                    )}
                </div>
                <div className="flex-1 text-sm">
                    <p className="font-semibold">{value}</p>
                    {INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_YEARLY_DESCRIPTIONS[
                        value
                    ] && (
                        <p className="text-xs mt-1">
                            {
                                INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_YEARLY_DESCRIPTIONS[
                                    value
                                ]
                            }
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}
