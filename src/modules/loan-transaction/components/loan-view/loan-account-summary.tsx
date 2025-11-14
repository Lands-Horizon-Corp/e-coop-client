import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { getAccountColorClass } from '@/modules/account/account.utils'
import { currencyFormat } from '@/modules/currency'

import { GearsIcon, LinkIcon, RenderIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { ILoanTransactionAccountSummary } from '../../loan-transaction.types'
import { LoanTransactionAdjustmentFormModal } from '../forms/loan-transaction-adjustment-form'

// Quick Summary & Actions
export const LoanAccountsSummary = ({
    className,
    loanTransactionAccountSummaries,
}: IClassProps & {
    loanTransactionAccountSummaries: ILoanTransactionAccountSummary[]
}) => {
    return (
        <div
            className={cn(
                'bg-popover space-y-2 border p-4 justify-center items-center rounded-3xl',
                className
            )}
        >
            <p>
                Loan Accounts Summary
                <span className="block text-muted-foreground">
                    See all accounts summary that are linked to this loan
                    transaction .
                </span>
            </p>
            <div className="flex items-center border p-2 bg-secondary/70 rounded-3xl gap-x-3 ecoop-scroll overflow-x-auto">
                {loanTransactionAccountSummaries.length > 0 ? (
                    loanTransactionAccountSummaries.map(
                        (loanTransactionAccount, i) => (
                            <LoanTransactionAccountSummaryItem
                                key={loanTransactionAccount.account_history_id}
                                loanTransactionAccount={{
                                    ...loanTransactionAccount,
                                    colorClass: getAccountColorClass(i),
                                }}
                            />
                        )
                    )
                ) : (
                    <Empty className="">
                        <EmptyHeader>
                            <EmptyMedia variant="icon">
                                <LinkIcon />
                            </EmptyMedia>
                            <EmptyTitle>Loan Accounts</EmptyTitle>
                            <EmptyDescription>
                                No linked loan accounts found for this loan
                                transaction.
                            </EmptyDescription>
                        </EmptyHeader>
                    </Empty>
                )}
            </div>
        </div>
    )
}

const LoanTransactionAccountSummaryItem = ({
    loanTransactionAccount,
}: {
    loanTransactionAccount: ILoanTransactionAccountSummary & {
        colorClass?: string
    }
}) => {
    const adjustmentModalState = useModalState()

    const {
        account_history,
        last_payment,

        due_date,

        total_account_principal,
        total_number_of_payments,
        total_number_of_additions,
        total_remaining_principal,
        total_number_of_deductions,
        total_account_principal_paid,
        total_account_advanced_payment,

        balance,
        total_credit,
        total_debit,

        colorClass,
    } = loanTransactionAccount || {}

    const currency = account_history?.currency

    const formatValue = (value: number | string | undefined) => {
        if (value === undefined || value === null) {
            return <span className="text-muted-foreground">...</span>
        }
        return value
    }

    const formatCurrency = (value: number | undefined) => {
        if (value === undefined || value === null) {
            return <span className="text-muted-foreground">...</span>
        }
        return `${currency?.symbol || ''}${value.toLocaleString()}`
    }

    const formatDate = (date: string | undefined) => {
        if (!date) {
            return <span className="text-muted-foreground">...</span>
        }
        return toReadableDate(date)
    }

    return (
        <div
            className={cn(
                'border min-w-[350px] p-2 rounded-2xl overflow-hidden bg-popover'
            )}
        >
            <LoanTransactionAdjustmentFormModal
                {...adjustmentModalState}
                formProps={{
                    defaultValues: {
                        account_id: account_history.account_id,
                        account: account_history.account,
                    },
                }}
            />
            <div
                className={cn(
                    'flex items-center p-1 rounded-xl gap-x-2 min-w-0 mb-3',
                    colorClass
                )}
            >
                <span className="pl-2 pr-1.5 flex-shrink-0">
                    <RenderIcon
                        className="inline size-3"
                        icon={account_history.icon}
                    />
                </span>
                <p className="font-medium truncate min-w-0 flex-1">
                    {account_history.name}
                </p>
                <Button
                    className="size-fit rounded-xl p-2"
                    hoverVariant="secondary"
                    onClick={() => adjustmentModalState.onOpenChange(true)}
                    size="icon"
                    variant="ghost"
                >
                    <GearsIcon />
                </Button>
            </div>

            {/* Card Details Grid */}
            <div className="grid grid-cols-2 gap-x-1 gap-y-2">
                {/* First Name / Last Name equivalent - Dates */}
                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Last Payment
                    </p>
                    <p className="text-sm font-medium">
                        {formatDate(last_payment)}
                    </p>
                </div>

                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Due Date
                    </p>
                    <p className="text-sm font-medium">
                        {formatDate(due_date)}
                    </p>
                </div>

                {/* Card Number equivalent - Principal */}
                <div className="p-1 col-span-2">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Total Account Principal
                    </p>
                    <p className="text-sm font-medium flex items-center gap-1">
                        <span className="font-mono">
                            {formatCurrency(total_account_principal)}
                        </span>
                    </p>
                </div>

                {/* Expiration / CVC equivalent - Payment counts */}
                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Total Payments
                    </p>
                    <p className="text-sm font-medium">
                        {formatValue(total_number_of_payments)}
                    </p>
                </div>
                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Total Deductions
                    </p>
                    <p className="text-sm font-medium">
                        {formatValue(total_number_of_deductions)}
                    </p>
                </div>

                {/* Additional rows */}
                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Total Additions
                    </p>
                    <p className="text-sm font-medium">
                        {formatValue(total_number_of_additions)}
                    </p>
                </div>
                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Principal Paid
                    </p>
                    <p className="text-sm font-medium">
                        {formatCurrency(total_account_principal_paid)}
                    </p>
                </div>

                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Advanced Payment
                    </p>
                    <p className="text-sm font-medium">
                        {formatCurrency(total_account_advanced_payment)}
                    </p>
                </div>
                <div className="p-2">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Remaining Principal
                    </p>
                    <p className="text-sm font-medium">
                        {formatCurrency(total_remaining_principal)}
                    </p>
                </div>

                {/* Balance summary */}
                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Total Debit
                    </p>
                    <p className="text-sm font-medium">
                        {formatCurrency(total_debit)}
                    </p>
                </div>
                <div className="p-1">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Total Credit
                    </p>
                    <p className="text-sm font-medium">
                        {formatCurrency(total_credit)}
                    </p>
                </div>

                <div className="p-2.5 col-span-2 bg-primary/20 rounded-md">
                    <p className="text-xs text-muted-foreground mb-0.5">
                        Balance
                    </p>
                    <p className="text-lg font-mono text-accent-foreground text-right">
                        {currencyFormat(balance, {
                            currency,
                            showSymbol: !!currency,
                        })}
                    </p>
                </div>
            </div>
        </div>
    )
}
