import { cn } from '@/helpers'

import { CalendarCheckIcon, CalendarIcon, CheckIcon } from '@/components/icons'

import { IAccount } from '../../account.types'
import {
    BooleanFieldDisplay,
    ComputationTypeDisplay,
    InterestFinesComputationDim,
    InterestFinesComputationDimStraightYearly,
    LumpsumComputationTypeDisplay,
} from './common'

export const FinesAccountContent = ({
    account,
    className,
}: {
    account: IAccount
    className?: string
}) => {
    return (
        <div className={cn('space-y-4 p-4 bg-popover rounded-2xl', className)}>
            <p className="text-sm text-popover-foreground/40 font-semibold">
                Fines Configuration
            </p>

            {/* Computation Type */}
            <ComputationTypeDisplay
                computationType={account.computation_type}
                label="Computation Type"
            />

            <div className="grid grid-cols-2 gap-x-3">
                {/* Fines Amort / Fines GP Amort */}
                <div className="space-y-2">
                    <p className="font-medium text-sm">
                        Fines Amort / Fines GP Amort
                    </p>
                    <div className="space-y-2 p-4 rounded-xl border text-sm bg-secondary/50">
                        <div className="flex justify-between items-center">
                            <span>Fines Amortization :</span>
                            {account.fines_amort !== undefined &&
                            account.fines_amort !== null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.fines_amort.toFixed(2)}
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0.0
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Fines G.P. Amortization :</span>
                            {account.fines_grace_period_amortization !==
                                undefined &&
                            account.fines_grace_period_amortization !== null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.fines_grace_period_amortization.toFixed(
                                        2
                                    )}
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0.0
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fines Maturity / Fines GP Amort */}
                <div className="space-y-2">
                    <p className="font-medium text-sm">
                        Fines Maturity / Fines GP Amort
                    </p>
                    <div className="space-y-2 p-4 rounded-xl border text-sm bg-secondary/50">
                        <div className="flex justify-between items-center">
                            <span>Fines Maturity :</span>
                            {account.fines_maturity !== undefined &&
                            account.fines_maturity !== null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.fines_maturity.toFixed(2)}
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0.0
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Fines G.P. Maturity :</span>
                            {account.fines_grace_period_maturity !==
                                undefined &&
                            account.fines_grace_period_maturity !== null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.fines_grace_period_maturity.toFixed(
                                        2
                                    )}
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0.0
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Addtl. G.P. */}
            <div className="space-y-2">
                <div className="flex gap-x-4 items-center">
                    <span>Additional Grace Period :</span>
                    {account.additional_grace_period !== undefined &&
                    account.additional_grace_period !== null ? (
                        <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                            {account.additional_grace_period.toString()}
                        </span>
                    ) : (
                        <span className="text-muted-foreground px-3 py-1">
                            0
                        </span>
                    )}
                </div>
            </div>

            {/* Other Grace Period Config */}
            <div className="space-y-2">
                <p className="font-medium text-sm">Other Grace Period Config</p>
                <BooleanFieldDisplay
                    description="Disable daily grace period calculation for fines"
                    icon={<CalendarIcon className="size-4" />}
                    title="No Grace Period Daily"
                    value={account.no_grace_period_daily}
                />
            </div>

            {/* Select Lumpsum Computation Type */}
            <LumpsumComputationTypeDisplay
                label="Select Lumpsum Computation Type"
                lumpsumComputationType={account.lumpsum_computation_type}
            />

            {/* Int/Fines Computation (Dim.) */}
            <InterestFinesComputationDim
                value={account.interest_fines_computation_diminishing}
            />

            {/* Int/Fines Computation (Dim. Straight, Dim. Yearly) */}
            <InterestFinesComputationDimStraightYearly
                value={
                    account.interest_fines_computation_diminishing_straight_diminishing_yearly
                }
            />

            {/* Additional Fines Configuration Options */}
            <div className="space-y-2">
                <p className="font-medium text-sm">
                    Additional Fines Configuration
                </p>
                <div className="grid grid-cols-2 gap-3">
                    <BooleanFieldDisplay
                        icon={<CalendarCheckIcon className="size-4" />}
                        title="Interest Computation Month End"
                        value={account.interest_computation_month_end}
                    />
                    <BooleanFieldDisplay
                        icon={<CalendarCheckIcon className="size-4" />}
                        title="Fines Computation by Next Amortization"
                        value={account.fines_computation_by_next_amortization}
                    />
                    <BooleanFieldDisplay
                        icon={<CheckIcon className="size-4" />}
                        title="Computation Fines Lumpsum"
                        value={account.computation_fines_lumpsum}
                    />
                    <BooleanFieldDisplay
                        icon={<CalendarCheckIcon className="size-4" />}
                        title="Fines Computation Daily by Amortization"
                        value={account.fines_computation_daily_by_amortization}
                    />
                    <BooleanFieldDisplay
                        icon={<CheckIcon className="size-4" />}
                        title="Fines Computation Rest by Rate"
                        value={account.fines_computation_rest_by_rate}
                    />
                    <BooleanFieldDisplay
                        icon={<CalendarCheckIcon className="size-4" />}
                        title="Compute Fines After Maturity"
                        value={account.compute_fines_after_maturity}
                    />
                </div>
            </div>
        </div>
    )
}
