import { ReactNode } from 'react'

import { cn } from '@/helpers'
import { ICurrency, currencyFormat } from '@/modules/currency'
import DisbursementAllTransactionTable from '@/modules/disbursement-transaction/components/disbursement-transaction-table/disbursement-transaction-all-table'
import GeneralLedgerAllTable from '@/modules/general-ledger/components/tables/general-ledger-table/general-ledger-all-table'
import { useTransactionBatchHistoryTotal } from '@/modules/transaction-batch'
import { IconType } from 'react-icons/lib'

import {
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    BadgeExclamationFillIcon,
    BillIcon,
    BookOpenIcon,
    HandCoinsIcon,
    HandDropCoinsIcon,
    MoneyCheckIcon,
    MoneyStackIcon,
    WalletIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, TEntityId } from '@/types'

import BatchFundingHistory from './batch-funding-history'

export interface ITransBatchHistoryTabsContentProps extends IClassProps {
    transactionBatchId: TEntityId
}

const HistoryTabs: {
    value: string
    title: string
    Icon?: IconType
    Component: (props: ITransBatchHistoryTabsContentProps) => ReactNode
}[] = [
    {
        value: 'batch-funding',
        title: 'Batch Funding',
        Icon: MoneyStackIcon,
        Component: BatchFundingHistory,
    },
    {
        value: 'disbursement-transaction',
        title: 'Disbursement Transaction',
        Icon: HandDropCoinsIcon,
        Component: ({ transactionBatchId }) => (
            <DisbursementAllTransactionTable
                className="grow p-0"
                mode="transaction-batch"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
    {
        value: 'general-ledger',
        title: 'General Ledger',
        Icon: BookOpenIcon,
        Component: ({ transactionBatchId }) => (
            <GeneralLedgerAllTable
                className="grow p-0"
                entryType=""
                mode="transaction-batch"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
    {
        value: 'check-entry',
        title: 'Check Entry',
        Icon: MoneyCheckIcon,
        Component: ({ transactionBatchId }) => (
            <GeneralLedgerAllTable
                className="grow p-0"
                entryType="check-entry"
                mode="transaction-batch"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
    {
        value: 'online-entry',
        title: 'Online Entry',
        Icon: BillIcon,
        Component: ({ transactionBatchId }) => (
            <GeneralLedgerAllTable
                className="grow p-0"
                entryType="online-entry"
                mode="transaction-batch"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
    {
        value: 'cash-entry',
        title: 'Cash Entry',
        Icon: HandCoinsIcon,
        Component: ({ transactionBatchId }) => (
            <GeneralLedgerAllTable
                className="grow p-0"
                entryType="cash-entry"
                mode="transaction-batch"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
    {
        value: 'payment-entry',
        title: 'Payment Entry',
        Icon: BillIcon,
        Component: ({ transactionBatchId }) => (
            <GeneralLedgerAllTable
                className="grow p-0"
                entryType="payment-entry"
                mode="transaction-batch"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
    {
        value: 'loan-entry',
        title: 'Loan Entry',
        Icon: BillIcon,
        Component: ({ transactionBatchId }) => (
            <GeneralLedgerAllTable
                className="grow p-0"
                mode="transaction-batch-loan-entry"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
    {
        value: 'withdraw-entry',
        title: 'Withdraw Entry',
        Icon: HandCoinsIcon,
        Component: ({ transactionBatchId }) => (
            <GeneralLedgerAllTable
                className="grow p-0"
                entryType="withdraw-entry"
                mode="transaction-batch"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
    {
        value: 'deposit-entry',
        title: 'Deposit Entry',
        Icon: HandCoinsIcon,
        Component: ({ transactionBatchId }) => (
            <GeneralLedgerAllTable
                className="grow p-0"
                entryType="deposit-entry"
                mode="transaction-batch"
                transactionBatchId={transactionBatchId}
            />
        ),
    },
]

type Props = {
    transactionBatchId: TEntityId
    activeTab?: string
    onTabChange?: (settingsTab: string) => void
}

const TransactionBatchHistories = ({
    transactionBatchId,
    activeTab,
    onTabChange,
}: Props) => {
    const [value, handleChange] = useInternalState(
        HistoryTabs[0].value,
        activeTab,
        onTabChange
    )

    return (
        <div className="flex min-h-[90vh] min-w-0 flex-1 flex-col gap-y-4 p-4">
            <Tabs
                className="flex-1 flex-col"
                defaultValue="batch-funding"
                onValueChange={handleChange}
                value={value}
            >
                <div className="overflow-x-auto max-w-full ecoop-scroll overflow-y-hidden">
                    <TabsList className="justify-start gap-2 rounded-none bg-transparent px-0 py-4 text-foreground">
                        {HistoryTabs.map((tab) => (
                            <TabsTrigger
                                className="relative after:absolute after:inset-x-0 h-fit after:bottom-0 after:-mb-1 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                key={tab.value}
                                value={tab.value}
                            >
                                {tab.Icon && (
                                    <tab.Icon
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                )}
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                </div>
                {HistoryTabs.map((tab) => (
                    <TabsContent asChild key={tab.value} value={tab.value}>
                        <div className="flex min-h-[94%] flex-1 flex-col rounded-xl bg-background p-0">
                            <TotalsSummary
                                activeTab={value}
                                transactionBatchId={transactionBatchId}
                            />
                            {tab.Component({ transactionBatchId })}
                        </div>
                    </TabsContent>
                ))}
            </Tabs>
        </div>
    )
}

export default TransactionBatchHistories

export const TransactionBatchHistoriesModal = ({
    className,
    transactionBatchHistoryProps,
    title = 'Transaction Batch History',
    ...props
}: IModalProps & { transactionBatchHistoryProps: Props }) => {
    return (
        <Modal
            {...props}
            className={cn('flex max-w-[95vw]! px-0 pb-4 pt-0', className)}
            closeButtonClassName="top-2 right-2"
            title={title}
            titleHeaderContainerClassName="sr-only"
        >
            <TransactionBatchHistories {...transactionBatchHistoryProps} />
        </Modal>
    )
}

interface TotalsSummaryProps {
    transactionBatchId: TEntityId
    activeTab: (typeof HistoryTabs)[number]['value']
}

const TotalCard = ({
    label,
    amount,
    icon,
    variant,
    currency,
}: {
    label: string
    amount: number
    icon: React.ReactNode
    variant: 'debit' | 'credit' | 'total'
    currency: ICurrency
}) => {
    const variantStyles = {
        debit: 'ring-primary/40 bg-gradient border-primary/20 bg-gradient-to-br from-primary/20 via-background to-background',
        credit: 'ring-orange-400/30 border-orange-400/25 bg-gradient-to-br from-orange-400/20 via-background to-background',
        total: 'border-border bg-gradient bg-gradient-to-br from-primary/20 via-background to-background',
    }

    const iconStyles = {
        debit: 'text-debit',
        credit: 'text-credit',
        total: 'text-primary',
    }

    const amountStyles = {
        debit: 'text-debit',
        credit: 'text-credit',
        total: 'text-foreground',
    }

    return (
        <Card
            className={cn(
                'rounded-2xl border ring-2 ring-muted/80 transition-colors',
                variantStyles[variant]
            )}
        >
            <CardContent className="flex items-center gap-4 p-5">
                <div
                    className={cn(
                        'flex h-10 w-10 items-center ring justify-center rounded-md bg-secondary',
                        iconStyles[variant]
                    )}
                >
                    {icon}
                </div>

                <div className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">
                        {label}
                    </span>
                    <span
                        className={cn(
                            'text-xl font-semibold',
                            amountStyles[variant]
                        )}
                    >
                        {currencyFormat(amount, {
                            currency: currency,
                            showSymbol: !!currency,
                        })}
                    </span>
                </div>
            </CardContent>
        </Card>
    )
}

export const TotalsSummary = ({
    transactionBatchId,
    activeTab,
}: TotalsSummaryProps) => {
    const { data: totals, isPending } = useTransactionBatchHistoryTotal({
        transactionBatchId,
    })

    if (isPending) {
        const isSingleTotal =
            activeTab === 'batch-funding' ||
            activeTab === 'disbursement-transaction'

        if (isSingleTotal) {
            return (
                <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <TotalCardSkeleton variant="total" />
                </div>
            )
        }

        return (
            <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <TotalCardSkeleton variant="debit" />
                <TotalCardSkeleton variant="credit" />
                <TotalCardSkeleton variant="total" />
            </div>
        )
    }

    if (!totals) {
        return (
            <div className="mb-4">
                <Alert
                    className="border-destructive/30 flex items-center bg-destructive/5"
                    variant="destructive"
                >
                    <BadgeExclamationFillIcon className="size-4" />
                    <AlertDescription>
                        Failed to load totals. Please try again later.
                    </AlertDescription>
                    <Button
                        className="inline-flex justify-center ml-auto"
                        size="sm"
                        variant="outline"
                    >
                        Retry
                    </Button>
                </Alert>
            </div>
        )
    }

    if (activeTab === 'batch-funding') {
        return (
            <div
                className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
                dir="rtl"
            >
                <TotalCard
                    amount={totals.batch_funding_total}
                    currency={totals.currency}
                    icon={<WalletIcon className="h-5 w-5" />}
                    label="Total Batch Funding"
                    variant="total"
                />
            </div>
        )
    }

    if (activeTab === 'disbursement-transaction') {
        return (
            <div
                className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2"
                dir="rtl"
            >
                <TotalCard
                    amount={totals.disbursement_transaction_total}
                    currency={totals.currency}
                    icon={<WalletIcon className="h-5 w-5" />}
                    label="Total Disbursement"
                    variant="total"
                />
            </div>
        )
    }

    const getTotalsForTab = () => {
        switch (activeTab) {
            case 'general-ledger':
                return {
                    debit: totals.general_ledger_debit_total,
                    credit: totals.general_ledger_credit_total,
                }
            case 'check-entry':
                return {
                    debit: totals.check_entry_debit_total,
                    credit: totals.check_entry_credit_total,
                }
            case 'loan-entry':
                return {
                    debit: totals.check_entry_debit_total,
                    credit: totals.check_entry_credit_total,
                }
            case 'online-entry':
                return {
                    debit: totals.online_entry_debit_total,
                    credit: totals.online_entry_credit_total,
                }
            case 'cash-entry':
                return {
                    debit: totals.cash_entry_debit_total,
                    credit: totals.cash_entry_credit_total,
                }
            case 'payment-entry':
                return {
                    debit: totals.payment_entry_debit_total,
                    credit: totals.payment_entry_credit_total,
                }
            case 'withdraw-entry':
                return {
                    debit: totals.withdraw_entry_debit_total,
                    credit: totals.withdraw_entry_credit_total,
                }
            case 'deposit-entry':
                return {
                    debit: totals.deposit_entry_debit_total,
                    credit: totals.deposit_entry_credit_total,
                }
            default:
                return { debit: 0, credit: 0 }
        }
    }

    const { debit, credit } = getTotalsForTab()

    return (
        <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <TotalCard
                amount={debit}
                currency={totals.currency}
                icon={<ArrowUpRightIcon className="h-5 w-5" />}
                label="Total Debit"
                variant="debit"
            />
            <TotalCard
                amount={credit}
                currency={totals.currency}
                icon={<ArrowDownLeftIcon className="h-5 w-5" />}
                label="Total Credit"
                variant="credit"
            />
        </div>
    )
}

const TotalCardSkeleton = ({
    variant,
}: {
    variant: 'debit' | 'credit' | 'total'
}) => {
    const variantStyles = {
        debit: 'debit-gradient border-debit/30',
        credit: 'credit-gradient border-credit/30',
        total: 'total-gradient border-primary/30',
    }

    return (
        <div
            className={`flex items-center gap-4 rounded-lg border px-5 py-4 ${variantStyles[variant]}`}
        >
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-28" />
            </div>
        </div>
    )
}
