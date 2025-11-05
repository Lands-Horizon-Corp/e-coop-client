import { cn } from '@/helpers'

import {
    CalculatorIcon,
    CalendarNumberIcon,
    ChartBarIcon,
    CoinsStackIcon,
    GridIcon,
    MinusIcon,
    PercentIcon,
    TrendingDownIcon,
} from '@/components/icons'

import { IAccount } from '../../account.types'
import {
    BooleanFieldDisplay,
    ComputationTypeDisplay,
    FieldDisplay,
    InterestFinesComputationDim,
    InterestFinesComputationDimStraightYearly,
} from './common'

export const InterestAccountContent = ({
    account,
    className,
}: {
    account: IAccount
    className?: string
}) => {
    return (
        <div className={cn('space-y-4 p-4 bg-popover rounded-2xl', className)}>
            <p className="text-sm text-popover-foreground/40 font-semibold">
                Interest
            </p>

            {/* Computation Type */}
            <ComputationTypeDisplay
                computationType={account.computation_type}
            />

            {/* Min Amount, Max Amount, Interest Standard, Cutoff */}
            <div className="grid grid-cols-3 gap-y-2 p-4 rounded-xl border bg-secondary/50 text-secondary-foreground text-sm">
                <div className="flex gap-x-4 items-center">
                    <span>Min Amount :</span>
                    {account.minAmount !== undefined &&
                    account.minAmount !== null ? (
                        <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                            {account.minAmount.toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-muted-foreground px-3 py-1">
                            0.0
                        </span>
                    )}
                </div>
                <div className="flex gap-x-4 items-center">
                    <span>Max Amount :</span>
                    {account.maxAmount !== undefined &&
                    account.maxAmount !== null ? (
                        <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                            {account.maxAmount.toFixed(2)}
                        </span>
                    ) : (
                        <span className="text-muted-foreground px-3 py-1">
                            0.0
                        </span>
                    )}
                </div>
                <div className="flex gap-x-4 items-center">
                    <span>Interest Standard :</span>
                    {account.interest_standard !== undefined &&
                    account.interest_standard !== null ? (
                        <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                            {account.interest_standard.toFixed(2)}
                            {' %'}
                        </span>
                    ) : (
                        <span className="text-muted-foreground px-3 py-1">
                            0.0 <PercentIcon className="inline" />
                        </span>
                    )}
                </div>
                <div className="flex gap-x-4 items-center">
                    <span>Cutoff Months :</span>
                    {account.cut_off_months ? (
                        <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                            {account.cut_off_months}
                        </span>
                    ) : (
                        <span className="text-muted-foreground px-3 py-1">
                            none
                        </span>
                    )}
                </div>
                <div className="flex gap-x-4 items-center">
                    <span>Cutoff Days :</span>
                    {account.cut_off_days ? (
                        <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                            {account.cut_off_days}
                        </span>
                    ) : (
                        <span className="text-muted-foreground px-3 py-1">
                            none
                        </span>
                    )}
                </div>
            </div>

            {/* Int/Fines Computation (Dim.) */}
            <InterestFinesComputationDim
                value={account.interest_fines_computation_diminishing}
            />

            {/* Earned/Unearned Interest */}
            <div className="space-y-2">
                <p className="font-medium text-sm">Earned/Unearned Interest</p>
                <div
                    className={cn(
                        'relative flex w-full items-center gap-3 rounded-2xl border px-3 py-2',
                        account.earned_unearned_interest &&
                            account.earned_unearned_interest !== 'None'
                            ? 'border-primary bg-primary/20'
                            : 'border-input bg-muted/30'
                    )}
                >
                    <div className="flex size-fit shrink-0 items-center justify-center p-2 rounded-lg bg-background border">
                        {account.earned_unearned_interest === 'None' ||
                        !account.earned_unearned_interest ? (
                            <MinusIcon className="inline" />
                        ) : (
                            <CalculatorIcon className="inline" />
                        )}
                    </div>
                    <div className="flex-1 text-sm">
                        <p className="font-medium">
                            {account.earned_unearned_interest || 'None'}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {account.earned_unearned_interest === 'None' &&
                                'No earned/unearned interest calculation applied.'}
                            {account.earned_unearned_interest ===
                                'By Formula' &&
                                'Interest is calculated using a predefined formula.'}
                            {account.earned_unearned_interest ===
                                'By Formula + Actual Pay' &&
                                'Interest is calculated by formula plus actual payments.'}
                            {account.earned_unearned_interest ===
                                'By Advance Interest + Actual Pay' &&
                                'Interest is calculated by advance interest plus actual payments.'}
                            {!account.earned_unearned_interest &&
                                'No earned/unearned interest type specified.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Int/Fines Computation (Dim. Straight, Dim. Yearly) */}
            <InterestFinesComputationDimStraightYearly
                value={
                    account.interest_fines_computation_diminishing_straight_diminishing_yearly
                }
            />

            {/* Interest Deduction and Interest Saving Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Interest Deduction */}
                <div className="space-y-2">
                    <p className="font-medium text-sm">Interest Deduction</p>
                    <FieldDisplay
                        description={
                            account.interest_deduction === 'Above'
                                ? 'Interest deduction is applied above the line.'
                                : account.interest_deduction === 'Below'
                                  ? 'Interest deduction is applied below the line.'
                                  : 'No interest deduction specified.'
                        }
                        icon={
                            account.interest_deduction === 'Above' ? (
                                <ChartBarIcon className="size-4" />
                            ) : account.interest_deduction === 'Below' ? (
                                <TrendingDownIcon className="size-4" />
                            ) : (
                                <MinusIcon className="size-4" />
                            )
                        }
                        isActive={!!account.interest_deduction}
                        title={account.interest_deduction || 'Not Set'}
                    />
                </div>

                {/* Interest Saving Type (Dim. Straight) */}
                <div className="space-y-2">
                    <p className="font-medium text-sm">
                        Interest Saving Type (Dim. Straight)
                    </p>
                    <FieldDisplay
                        description={
                            account.interest_saving_type_diminishing_straight ===
                            'Spread'
                                ? 'Interest is spread across multiple payments.'
                                : account.interest_saving_type_diminishing_straight ===
                                    '1st Payment'
                                  ? 'Interest is applied to the first payment.'
                                  : 'No interest saving type specified.'
                        }
                        icon={
                            account.interest_saving_type_diminishing_straight ===
                            'Spread' ? (
                                <GridIcon className="size-4" />
                            ) : account.interest_saving_type_diminishing_straight ===
                              '1st Payment' ? (
                                <CoinsStackIcon className="size-4" />
                            ) : (
                                <MinusIcon className="size-4" />
                            )
                        }
                        isActive={
                            !!account.interest_saving_type_diminishing_straight
                        }
                        title={
                            account.interest_saving_type_diminishing_straight ||
                            'Not Set'
                        }
                    />
                </div>
            </div>

            {/* Interest Diminishing by Year ??????? */}
            <div className="space-y-2">
                <BooleanFieldDisplay
                    description="Enable interest diminishing calculation by year instead of by payment period."
                    icon={<CalendarNumberIcon className="size-4" />}
                    title="Interest Diminishing by Year ???????"
                    value={account.interest_diminishing_by_year}
                />
            </div>
        </div>
    )
}
