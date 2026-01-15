import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers'
import { currencyFormat } from '@/modules/currency'
import { ILoanAccount } from '@/modules/loan-account'
import {
    ArrowDownRight,
    ArrowUpRight,
    TrendingDown,
    TrendingUp,
    Wallet,
} from 'lucide-react'

import { GearIcon, LinkIcon, RenderIcon, TIcon } from '@/components/icons'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Empty,
    EmptyDescription,
    EmptyHeader,
    EmptyMedia,
    EmptyTitle,
} from '@/components/ui/empty'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { loanTransactionBaseKey } from '../../loan-transaction.service'
import { LoanTransactionAdjustmentFormModal } from '../forms/loan-transaction-adjustment-form'

// Quick Summary & Actions
export const LoanAccountsView = ({
    className,
    loanTransactionAccounts,
}: IClassProps & {
    loanTransactionAccounts: ILoanAccount[]
}) => {
    return (
        <div
            className={cn(
                'bg-popover space-y-2 border p-4 justify-center items-center rounded-xl',
                className
            )}
        >
            <p>
                Loan Accounts Summary
                <span className="block text-xs text-muted-foreground">
                    See all accounts summary that are linked to this loan
                    transaction .
                </span>
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-x-3 ecoop-scroll overflow-x-auto">
                {loanTransactionAccounts.length > 0 ? (
                    loanTransactionAccounts.map((loanTransactionAccount) => (
                        <LoanAccountCard
                            account={loanTransactionAccount}
                            key={loanTransactionAccount.id}
                        />
                    ))
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

const LoanAccountCard = ({
    account,
    index = 0,
}: {
    account: ILoanAccount
    index?: number
}) => {
    const netChange =
        account.total_add - account.total_deduction - account.total_payment
    const isPositive = netChange >= 0
    const adjustModalState = useModalState()
    const queryClient = useQueryClient()

    return (
        <Card
            className={cn(
                'border-border/50 shadow-sm hover:shadow-md',
                'transition-all duration-300 hover:border-primary/30',
                'animate-fade-in'
            )}
            style={{ animationDelay: `${index * 100}ms` }}
        >
            <LoanTransactionAdjustmentFormModal
                {...adjustModalState}
                formProps={{
                    onSuccess: () =>
                        queryClient.invalidateQueries({
                            queryKey: [
                                loanTransactionBaseKey,
                                account.loan_transaction_id,
                            ],
                        }),
                    defaultValues: {
                        account: account.account,
                        account_id: account.account.id,
                        loan_accoun_id: account.id,
                    },
                }}
            />
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 text-primary">
                            <RenderIcon
                                className="h-4 w-4"
                                icon={account.account?.icon as TIcon}
                            />
                        </div>
                        <div>
                            <h3 className="font-medium text-card-foreground">
                                {account.account?.name || 'Unnamed Account'}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {account.account?.id ||
                                    `ID: ${account.id.slice(0, 8)}`}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-x-1">
                        {account.account?.type && (
                            <Badge
                                className="text-xs font-medium"
                                variant="secondary"
                            >
                                {account.account.type}
                            </Badge>
                        )}
                        <Button
                            className="!p-1 !size-fit"
                            onClick={() => adjustModalState.onOpenChange(true)}
                            size="icon-sm"
                            variant="secondary"
                        >
                            <GearIcon />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4">
                {/* Main Amount Display */}
                <div className="p-4 rounded-lg bg-secondary/50 border border-border/30">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
                                Loan Amount
                            </p>
                            <p className="text-2xl font-semibold text-card-foreground font-mono">
                                {currencyFormat(account.amount, {
                                    currency: account.account?.currency,
                                    showSymbol: !!account.account?.currency,
                                })}
                            </p>
                        </div>
                        <div
                            className={cn(
                                'flex items-center gap-1 px-2 py-1 rounded-md text-sm font-medium',
                                isPositive
                                    ? 'bg-success/10 text-financial-positive'
                                    : 'bg-destructive/10 text-financial-negative'
                            )}
                        >
                            {isPositive ? (
                                <TrendingUp className="h-3 w-3" />
                            ) : (
                                <TrendingDown className="h-3 w-3" />
                            )}
                            {currencyFormat(Math.abs(netChange))}
                        </div>
                    </div>
                </div>

                {/* Transaction Metrics Grid */}
                <div className="grid grid-cols-3 gap-3">
                    {/* Add-ons */}
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
                        <div className="flex items-center gap-1.5 mb-2">
                            <ArrowUpRight className="h-3.5 w-3.5 text-financial-positive" />
                            <span className="text-xs text-muted-foreground">
                                Total Amnt Added
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-card-foreground font-mono">
                            {currencyFormat(account.total_add, {
                                currency: account.account?.currency,
                                showSymbol: !!account.account?.currency,
                            })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Cnt. {account.total_add_count}
                        </p>
                    </div>

                    {/* Deductions */}
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
                        <div className="flex items-center gap-1.5 mb-2">
                            <ArrowDownRight className="h-3.5 w-3.5 text-financial-negative" />
                            <span className="text-xs text-muted-foreground">
                                Total Deductions
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-card-foreground font-mono">
                            {currencyFormat(account.total_deduction, {
                                currency: account.account?.currency,
                                showSymbol: !!account.account?.currency,
                            })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Cnt. {account.total_deduction_count}
                        </p>
                    </div>

                    {/* Payments */}
                    <div className="p-3 rounded-lg bg-secondary/30 border border-border/20">
                        <div className="flex items-center gap-1.5 mb-2">
                            <Wallet className="h-3.5 w-3.5 text-primary" />
                            <span className="text-xs text-muted-foreground">
                                Total Payments
                            </span>
                        </div>
                        <p className="text-sm font-semibold text-card-foreground font-mono">
                            {currencyFormat(account.total_payment, {
                                currency: account.account?.currency,
                                showSymbol: !!account.account?.currency,
                            })}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                            Cnt. {account.total_payment_count}
                        </p>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}

export default LoanAccountCard
