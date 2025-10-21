import { cn } from '@/helpers'
import { currencyFormat } from '@/modules/currency'

import { Separator } from '@/components/ui/separator'

import { ITransactionBatch } from '../..'
import {
    getCollectionTotal,
    getLessTotal,
    getTransactionStatus,
} from './transaction-batch-utils'

export interface BatchBlotterSummaryViewProps {
    transBatch: ITransactionBatch
}

export const BatchBlotterSummaryView = ({
    transBatch,
}: BatchBlotterSummaryViewProps) => {
    const transactionStatus = getTransactionStatus({
        total_actual_remittance: transBatch?.total_actual_remittance,
        total_supposed_remitance: transBatch?.total_supposed_remitance,
    })

    const currency = transBatch?.currency

    return (
        <div className="space-y-2">
            <p className="text-center font-medium">
                Transaction Batch Summary (Blotter)
            </p>
            <div className="w-full space-y-2">
                <div className="flex items-center justify-between gap-x-4">
                    <p className="grow-1">Collection</p>
                    <Separator className="flex-1" />
                    <p className="grow-1 text-right font-semibold">
                        {currencyFormat(
                            getCollectionTotal({
                                total_cash_collection:
                                    transBatch.total_cash_collection,
                                total_deposit_entry:
                                    transBatch.total_deposit_entry,
                                beginning_balance: transBatch.beginning_balance,
                            }),
                            {
                                currency,
                                showSymbol: !!currency,
                            }
                        )}
                    </p>
                </div>
                <div className="rounded-xl bg-accent">
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">OR Collection</p>
                        <p>
                            {currencyFormat(transBatch.total_cash_collection, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">Deposit Entry</p>
                        <p>
                            {currencyFormat(transBatch.total_deposit_entry, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">
                            Teller Beginning Balance
                        </p>
                        <p>
                            {currencyFormat(transBatch.beginning_balance, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                </div>
            </div>

            <div className="w-full space-y-2">
                <div className="flex items-center justify-between gap-x-4">
                    <p className="grow-1">Less (Disbursements)</p>
                    <Separator className="flex-1" />
                    <p className="grow-1 text-right font-semibold">
                        {currencyFormat(
                            getLessTotal({
                                petty_cash: transBatch.petty_cash,
                                loan_releases: transBatch.loan_releases,
                                time_deposit_withdrawal:
                                    transBatch.time_deposit_withdrawal,
                                savings_withdrawal:
                                    transBatch.savings_withdrawal,
                            }),
                            {
                                currency,
                                showSymbol: !!currency,
                            }
                        )}
                    </p>
                </div>
                <div className="rounded-xl bg-accent">
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">
                            Savings Withdrawal
                        </p>
                        <p>
                            {currencyFormat(transBatch.savings_withdrawal, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">
                            Time Dep. Withdrawal
                        </p>
                        <p>
                            {currencyFormat(
                                transBatch.time_deposit_withdrawal,
                                {
                                    currency,
                                    showSymbol: !!currency,
                                }
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">Loan Releases</p>
                        <p>
                            {currencyFormat(transBatch.loan_releases, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">Petty Cash</p>
                        <p>
                            {currencyFormat(transBatch.petty_cash, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">Petty Cash</p>
                        <p>
                            {currencyFormat(transBatch.petty_cash, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    {/*
                            <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                                <p className="text-muted-foreground">
                                    Transfer RF
                                </p>
                                <p>100</p>
                            </div> */}
                </div>
            </div>

            <div className="w-full space-y-2">
                <p>Summary</p>
                <div className="rounded-xl bg-accent">
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">
                            Total Supposed Remittance
                        </p>
                        <p>
                            {currencyFormat(
                                transBatch.total_supposed_remitance,
                                {
                                    currency,
                                    showSymbol: !!currency,
                                }
                            )}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">
                            Total Cash on Hand
                        </p>

                        <p>
                            {currencyFormat(transBatch.total_cash_on_hand, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">
                            Total Check Remitance
                        </p>
                        <p>
                            {currencyFormat(transBatch.total_check_remittance, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">
                            Total Deposit in Bank
                        </p>
                        <p>
                            {currencyFormat(transBatch.total_deposit_in_bank, {
                                currency,
                                showSymbol: !!currency,
                            })}
                        </p>
                    </div>
                    <div className="flex items-center justify-between border-b border-b-muted-foreground/5 px-4 py-2 last:border-b-0">
                        <p className="text-muted-foreground">
                            Total Actual Remittance
                        </p>
                        <p>
                            {currencyFormat(
                                transBatch.total_actual_remittance,
                                {
                                    currency,
                                    showSymbol: !!currency,
                                }
                            )}
                        </p>
                    </div>
                </div>

                <p>Transaction Status</p>
                <div
                    className={cn(
                        'flex justify-between rounded-xl bg-accent p-4 font-semibold',
                        transactionStatus === 'BALANCED' &&
                            'bg-primary text-primary-foreground dark:bg-primary/10 dark:text-primary',
                        transactionStatus === 'OVERAGE' &&
                            'dark:"bg-orange-400/10 bg-orange-600/30 text-orange-600 dark:text-orange-500',
                        transactionStatus === 'SHORTAGE' &&
                            'bg-rose-600/30 text-rose-500 dark:bg-rose-500/40 dark:text-rose-300'
                    )}
                >
                    <p>{transactionStatus}</p>
                    <p className="text-xl">
                        {currencyFormat(
                            transBatch.total_actual_supposed_comparison,
                            {
                                currency,
                                showSymbol: !!currency,
                            }
                        )}
                    </p>
                </div>
            </div>
        </div>
    )
}
