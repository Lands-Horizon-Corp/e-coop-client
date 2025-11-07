import { cn } from '@/helpers'

import {
    CalendarCheckIcon,
    CalendarIcon,
    CheckIcon,
    PlusIcon,
} from '@/components/icons'
import { Separator } from '@/components/ui/separator'

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
                                    {account.fines_amort.toFixed(2)} %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
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
                                        0
                                    )}{' '}
                                    Day
                                    {account.fines_grace_period_amortization > 1
                                        ? 's'
                                        : ''}
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0.0
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Daily Amort :</span>
                            {account.coh_cib_fines_grace_period_entry_daily_amortization !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_daily_amortization !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_daily_amortization.toFixed(
                                        2
                                    )}
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0.0
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Weekly Amort :</span>
                            {account.coh_cib_fines_grace_period_entry_weekly_amortization !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_weekly_amortization !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_weekly_amortization.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Monthly Amort :</span>
                            {account.coh_cib_fines_grace_period_entry_monthly_amortization !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_monthly_amortization !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_monthly_amortization.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Semi Monthly Amort :</span>
                            {account.coh_cib_fines_grace_period_entry_semi_monthly_amortization !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_semi_monthly_amortization !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_semi_monthly_amortization.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Quarterly Amort :</span>
                            {account.coh_cib_fines_grace_period_entry_quarterly_amortization !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_quarterly_amortization !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_quarterly_amortization.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Semi Annual Amort :</span>
                            {account.coh_cib_fines_grace_period_entry_semi_annual_amortization !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_semi_annual_amortization !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_semi_annual_amortization.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Annual Amort :</span>
                            {account.coh_cib_fines_grace_period_entry_annual_amortization !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_annual_amortization !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_annual_amortization.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Lumpsum Amort :</span>
                            {account.coh_cib_fines_grace_period_entry_lumpsum_amortization !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_lumpsum_amortization !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_lumpsum_amortization.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                {/* Fines Maturity / Fines GP Amort */}
                <div className="space-y-2">
                    <p className="font-medium text-sm">
                        Fines Maturity / Fines GP Maturity
                    </p>
                    <div className="space-y-2 p-4 rounded-xl border text-sm bg-secondary/50">
                        <div className="flex justify-between items-center">
                            <span>Fines Maturity :</span>
                            {account.fines_maturity !== undefined &&
                            account.fines_maturity !== null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.fines_maturity.toFixed(2)} %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
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
                                        0
                                    )}{' '}
                                    Day
                                    {account.fines_grace_period_maturity > 1
                                        ? 's'
                                        : ''}
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 Day
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Daily Maturity :</span>
                            {account.coh_cib_fines_grace_period_entry_daily_maturity !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_daily_maturity !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_daily_maturity.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Weekly Maturity :</span>
                            {account.coh_cib_fines_grace_period_entry_weekly_maturity !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_weekly_maturity !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_weekly_maturity.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Monthly Maturity :</span>
                            {account.coh_cib_fines_grace_period_entry_monthly_maturity !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_monthly_maturity !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_monthly_maturity.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Semi Monthly Maturity :</span>
                            {account.coh_cib_fines_grace_period_entry_semi_monthly_maturity !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_semi_monthly_maturity !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_semi_monthly_maturity.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Quarterly Maturity :</span>
                            {account.coh_cib_fines_grace_period_entry_quarterly_maturity !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_quarterly_maturity !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_quarterly_maturity.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Semi Annual Maturity :</span>
                            {account.coh_cib_fines_grace_period_entry_semi_annual_maturity !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_semi_annual_maturity !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_semi_annual_maturity.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Annual Maturity :</span>
                            {account.coh_cib_fines_grace_period_entry_annual_maturity !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_annual_maturity !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_annual_maturity.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                        <div className="flex justify-between items-center">
                            <span>Lumpsum Maturity :</span>
                            {account.coh_cib_fines_grace_period_entry_lumpsum_maturity !==
                                undefined &&
                            account.coh_cib_fines_grace_period_entry_lumpsum_maturity !==
                                null ? (
                                <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                                    {account.coh_cib_fines_grace_period_entry_lumpsum_maturity.toFixed(
                                        2
                                    )}{' '}
                                    %
                                </span>
                            ) : (
                                <span className="text-muted-foreground px-3 py-1">
                                    0 %
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Addtl. G.P. */}
            <div className="flex gap-x-4 justify-between bg-accent/30 border border-primary text-accent-foreground py-2 px-3 rounded-xl items-center">
                <span>
                    <PlusIcon className="inline mr-1" /> General Additional
                    Grace Period
                </span>
                <Separator className="flex-1" />
                {account.additional_grace_period !== undefined &&
                account.additional_grace_period !== null ? (
                    <span className="bg-accent/80 px-3 rounded-md py-1 border-accent border">
                        {account.additional_grace_period.toString()}
                    </span>
                ) : (
                    <span className="text-muted-foreground px-3 py-1">
                        none
                    </span>
                )}
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
