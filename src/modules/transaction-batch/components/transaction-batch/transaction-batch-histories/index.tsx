import { Fragment, ReactNode, useState } from 'react'

import { cn } from '@/helpers'
import { ICurrency, currencyFormat } from '@/modules/currency'
import DisbursementAllTransactionTable from '@/modules/disbursement-transaction/components/disbursement-transaction-table/disbursement-transaction-all-table'
import GeneralLedgerAllTable from '@/modules/general-ledger/components/tables/general-ledger-table/general-ledger-all-table'
import {
    ITransactionBatchSummary,
    useTransactionBatchHistoryTotal,
} from '@/modules/transaction-batch'
import type { ITransactionBatchHistoryTotal } from '@/modules/transaction-batch'
import { IconType } from 'react-icons/lib'

import {
    BadgeExclamationFillIcon,
    BillIcon,
    BookOpenIcon,
    HandCoinsIcon,
    HandDropCoinsIcon,
    MoneyCheckIcon,
    MoneyStackIcon,
    SwapArrowIcon,
    WalletIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
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
                excludeColumnIds={['balance']}
                mode="transaction-batch"
                persistKey={[
                    'general-ledger-all',
                    'transaction-batch',
                    'general-ledger',
                ]}
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
                excludeColumnIds={['balance']}
                mode="transaction-batch"
                persistKey={[
                    'general-ledger-all',
                    'transaction-batch',
                    'check-entry',
                ]}
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
                excludeColumnIds={['balance']}
                mode="transaction-batch"
                persistKey={[
                    'general-ledger-all',
                    'transaction-batch',
                    'online-entry',
                ]}
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
                excludeColumnIds={['balance']}
                mode="transaction-batch"
                persistKey={[
                    'general-ledger-all',
                    'transaction-batch',
                    'cash-entry',
                ]}
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
                excludeColumnIds={['balance']}
                mode="transaction-batch"
                persistKey={[
                    'general-ledger-all',
                    'transaction-batch',
                    'payment-entry',
                ]}
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
                excludeColumnIds={['balance']}
                mode="transaction-batch-loan-entry"
                persistKey={[
                    'general-ledger-all',
                    'transaction-batch',
                    'loan-entry',
                ]}
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
                excludeColumnIds={['balance']}
                mode="transaction-batch"
                persistKey={[
                    'general-ledger-all',
                    'transaction-batch',
                    'withdraw-entry',
                ]}
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
                excludeColumnIds={['balance']}
                mode="transaction-batch"
                persistKey={[
                    'general-ledger-all',
                    'transaction-batch',
                    'deposit-entry',
                ]}
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
        <div className="flex min-h-[90vh] min-w-0 gap-x-4 p-4">
            <SidebarSummary
                activeTab={value}
                transactionBatchId={transactionBatchId}
            />
            <Tabs
                className="flex-1 flex-col bg-background rounded-xl border p-5"
                defaultValue="batch-funding"
                onValueChange={handleChange}
                value={value}
            >
                <div className="overflow-x-auto max-w-full bg-background scro ecoop-scroll overflow-y-hidden">
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
                        <div className="flex  min-h-[94%] flex-row rounded-xl bg-background p-0">
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
            className={cn(
                'flex max-w-[95vw]! px-0 pb-4 pt-0 bg-transparent border-0',
                className
            )}
            closeButtonClassName="top-2 right-2"
            title={title}
            titleHeaderContainerClassName="sr-only"
        >
            <TransactionBatchHistories {...transactionBatchHistoryProps} />
        </Modal>
    )
}

type totalCardSize = 'small' | 'medium' | 'large'

const TotalCard = ({
    label,
    amount,
    icon,
    variant,
    currency,
    className,
    contentClassName,
    size = 'small',
}: {
    label: string
    amount: number
    icon: React.ReactNode
    variant: 'debit' | 'credit' | 'total'
    size?: totalCardSize
    currency: ICurrency
    className?: string
    contentClassName?: string
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

    const iconSizeStyle = {
        small: 'h-5 w-5',
        medium: 'h-6 w-6',
        large: 'h-7 w-7',
    }

    const sizeStyle = {
        small: 'p-3',
        medium: 'p-4',
        large: 'p-5',
    }

    const fontSizeStyle = {
        small: 'text-sm',
        medium: 'text-base',
        large: 'text-lg',
    }

    return (
        <Card
            className={cn(
                'rounded-2xl border ring-2 ring-muted/80 transition-colors min-w-fit',
                variantStyles[variant],
                className
            )}
        >
            <CardContent
                className={cn(
                    'flex items-center gap-4 p-5 min-w-fit ',
                    sizeStyle[size || 'small'],
                    contentClassName
                )}
            >
                <div
                    className={cn(
                        'flex h-10 w-10 items-center ring justify-center rounded-md bg-secondary',
                        iconStyles[variant],
                        iconSizeStyle[size || 'small']
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
                            ' font-semibold',
                            amountStyles[variant],
                            fontSizeStyle[size || 'small']
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

interface TransactionBatchSummaryItemProps {
    transactionBatchSummary?: ITransactionBatchSummary[]
    currency: ICurrency
    sectionLabel: string
    swapped?: boolean
}

const TransactionBatchSummary = ({
    transactionBatchSummary,
    currency,
    swapped = false,
}: TransactionBatchSummaryItemProps) => {
    if (
        !Array.isArray(transactionBatchSummary) ||
        transactionBatchSummary.length === 0
    ) {
        return (
            <div className="py-4 text-center text-xs text-muted-foreground">
                No transactions available
            </div>
        )
    }

    return (
        <>
            {transactionBatchSummary.map((summary, idx) => (
                <Fragment key={idx}>
                    {summary.transaction_batch_account_summary?.map((acc) => (
                        <div
                            className="border-b py-2 px-3 hover:bg-muted/30 transition-colors"
                            key={acc.account.id}
                        >
                            <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-primary/10 text-primary text-xs font-medium mb-1">
                                {acc.account.name}
                            </span>
                            <div className="grid grid-cols-3 text-xs tabular-nums text-right gap-x-2">
                                <span className="text-muted-foreground">
                                    {currencyFormat(
                                        swapped ? acc.credit : acc.debit,
                                        { currency, showSymbol: true }
                                    )}
                                </span>
                                <span className="text-muted-foreground">
                                    {currencyFormat(
                                        swapped ? acc.debit : acc.credit,
                                        { currency, showSymbol: true }
                                    )}
                                </span>
                                <span className="font-medium">
                                    {currencyFormat(acc.balance, {
                                        currency,
                                        showSymbol: true,
                                    })}
                                </span>
                            </div>
                        </div>
                    ))}
                    <div className="border-y-2 border-primary/20 bg-primary/5 py-2 px-3">
                        <div className="grid grid-cols-3 text-xs tabular-nums text-right gap-x-2 font-semibold">
                            <span className="text-foreground">
                                {currencyFormat(
                                    swapped
                                        ? summary.total_credit
                                        : summary.total_debit,
                                    { currency, showSymbol: true }
                                )}
                            </span>
                            <span className="text-foreground">
                                {currencyFormat(
                                    swapped
                                        ? summary.total_debit
                                        : summary.total_credit,
                                    { currency, showSymbol: true }
                                )}
                            </span>
                            <span className="text-emerald-500 font-bold">
                                {currencyFormat(summary.total_balance, {
                                    currency,
                                    showSymbol: true,
                                })}
                            </span>
                        </div>
                    </div>
                </Fragment>
            ))}
        </>
    )
}

interface SideBarSummary {
    transactionBatchId: TEntityId
    className?: string
    activeTab?: string
}

const tabSummaryConfig: Record<
    string,
    {
        account: keyof ITransactionBatchHistoryTotal
        cash: keyof ITransactionBatchHistoryTotal
        debit?: keyof ITransactionBatchHistoryTotal
        credit?: keyof ITransactionBatchHistoryTotal
    }
> = {
    'general-ledger': {
        account: 'general_ledger_account_summary',
        cash: 'general_ledger_cash_on_hand_summary',
        debit: 'general_ledger_debit_total',
        credit: 'general_ledger_credit_total',
    },
    'check-entry': {
        account: 'check_entry_account_summary',
        cash: 'check_entry_cash_on_hand_summary',
        debit: 'check_entry_debit_total',
        credit: 'check_entry_credit_total',
    },
    'loan-entry': {
        account: 'loan_entry_account_summary',
        cash: 'loan_entry_cash_on_hand_summary',
        debit: 'loan_entry_debit_total',
        credit: 'loan_entry_credit_total',
    },
    'online-entry': {
        account: 'online_entry_account_summary',
        cash: 'online_entry_cash_on_hand_summary',
        debit: 'online_entry_debit_total',
        credit: 'online_entry_credit_total',
    },
    'cash-entry': {
        account: 'cash_entry_account_summary',
        cash: 'cash_entry_cash_on_hand_summary',
        debit: 'cash_entry_debit_total',
        credit: 'cash_entry_credit_total',
    },
    'payment-entry': {
        account: 'payment_entry_account_summary',
        cash: 'payment_entry_cash_on_hand_summary',
        debit: 'payment_entry_debit_total',
        credit: 'payment_entry_credit_total',
    },
    'withdraw-entry': {
        account: 'withdraw_entry_account_summary',
        cash: 'withdraw_entry_cash_on_hand_summary',
        debit: 'withdraw_entry_debit_total',
        credit: 'withdraw_entry_credit_total',
    },
    'deposit-entry': {
        account: 'deposit_entry_account_summary',
        cash: 'deposit_entry_cash_on_hand_summary',
        debit: 'deposit_entry_debit_total',
        credit: 'deposit_entry_credit_total',
    },
}

const SidebarSummary = ({ transactionBatchId, activeTab }: SideBarSummary) => {
    const [swapped, setSwapped] = useState(false)
    const { data: totals } = useTransactionBatchHistoryTotal({
        transactionBatchId,
    })
    if (!totals) {
        return (
            <div className="mb-4 w-full">
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

    const currency = totals.currency

    if (activeTab === 'batch-funding') {
        return (
            <div
                className={cn(
                    'min-w-sm overflow-y-auto ecoop-scroll h-full bg-background rounded-xl border p-5'
                )}
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
                className={cn(
                    'min-w-sm overflow-y-auto ecoop-scroll h-full bg-background rounded-xl border p-5'
                )}
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

    const config = tabSummaryConfig[activeTab ?? '']
    const accountSummary =
        config && Array.isArray(totals[config.account])
            ? (totals[config.account] as ITransactionBatchSummary[])
            : undefined
    const cashSummary =
        config && Array.isArray(totals[config.cash])
            ? (totals[config.cash] as ITransactionBatchSummary[])
            : undefined
    const debit =
        config && config.debit && typeof totals[config.debit] === 'number'
            ? (totals[config.debit] as number)
            : undefined
    const credit =
        config && config.credit && typeof totals[config.credit] === 'number'
            ? (totals[config.credit] as number)
            : undefined

    return (
        <div
            className={cn(
                'w-[260px] shrink-0 flex flex-col overflow-hidden bg-background rounded-xl border h-full'
            )}
        >
            {/* Sticky column header */}
            <div className="sticky top-0 z-10 bg-muted/40 border-b ">
                <div className="flex items-center bg-muted w-full justify-between mb-1">
                    <span className="text-xs text-muted-foreground font-medium">
                        Summary
                    </span>
                    <button
                        className={cn(
                            'inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium transition-colors',
                            swapped
                                ? 'bg-primary/15 text-primary'
                                : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                        )}
                        onClick={() => setSwapped((s) => !s)}
                        title="Swap debit / credit columns"
                        type="button"
                    >
                        <SwapArrowIcon className="size-3" />
                        swap
                    </button>
                </div>
                <div className="grid grid-cols-3 text-xs font-medium text-muted-foreground text-right gap-x-2">
                    <span className={swapped ? 'text-orange-400' : ''}>
                        {swapped ? 'credit' : 'debit'}
                    </span>
                    <span className={swapped ? 'text-primary' : ''}>
                        {swapped ? 'debit' : 'credit'}
                    </span>
                    <span>balance</span>
                </div>
            </div>

            {/* Scrollable rows */}
            <div className="flex-1 overflow-y-auto ecoop-scroll">
                {/* Account section */}
                <div className="flex items-center gap-2 px-3 pt-3 pb-1">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        Account
                    </span>
                    <div className="flex-1 border-t border-dashed border-border/60" />
                </div>
                <TransactionBatchSummary
                    currency={currency}
                    sectionLabel="Account"
                    swapped={swapped}
                    transactionBatchSummary={accountSummary}
                />

                {/* Cash section */}
                <div className="flex items-center gap-2 px-3 pt-4 pb-1">
                    <span className="text-xs font-semibold text-foreground uppercase tracking-wider whitespace-nowrap">
                        Cash &amp; Cash Equivalence
                    </span>
                    <div className="flex-1 border-t border-dashed border-border/60" />
                </div>
                <TransactionBatchSummary
                    currency={currency}
                    sectionLabel="Cash and Cash Equivalence"
                    swapped={swapped}
                    transactionBatchSummary={cashSummary}
                />
            </div>

            {/* Grand total footer */}
            {(typeof debit === 'number' || typeof credit === 'number') && (
                <div className="border-t-2 border-border px-3 pt-2 pb-3 shrink-0">
                    <div className="grid grid-cols-3 text-right tabular-nums font-bold text-sm gap-x-2">
                        <span>
                            {swapped
                                ? typeof credit === 'number' &&
                                  currencyFormat(credit, {
                                      currency,
                                      showSymbol: true,
                                  })
                                : typeof debit === 'number' &&
                                  currencyFormat(debit, {
                                      currency,
                                      showSymbol: true,
                                  })}
                        </span>
                        <span>
                            {swapped
                                ? typeof debit === 'number' &&
                                  currencyFormat(debit, {
                                      currency,
                                      showSymbol: true,
                                  })
                                : typeof credit === 'number' &&
                                  currencyFormat(credit, {
                                      currency,
                                      showSymbol: true,
                                  })}
                        </span>
                        <span />
                    </div>
                    <div className="grid grid-cols-3 text-right text-xs text-muted-foreground gap-x-2 mt-0.5">
                        <span>{swapped ? 'total credit' : 'total debit'}</span>
                        <span>{swapped ? 'total debit' : 'total credit'}</span>
                        <span />
                    </div>
                </div>
            )}
        </div>
    )
}
// interface TotalsSummaryProps {
//     transactionBatchId: TEntityId
//     activeTab: (typeof HistoryTabs)[number]['value']
// }
// export const TotalsSummary = ({
//     transactionBatchId,
//     activeTab,
// }: TotalsSummaryProps) => {
//     const { data: totals, isPending } = useTransactionBatchHistoryTotal({
//         transactionBatchId,
//     })

//     if (isPending) {
//         const isSingleTotal =
//             activeTab === 'batch-funding' ||
//             activeTab === 'disbursement-transaction'

//         if (isSingleTotal) {
//             return (
//                 <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                     <TotalCardSkeleton variant="total" />
//                 </div>
//             )
//         }

//         return (
//             <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//                 <TotalCardSkeleton variant="debit" />
//                 <TotalCardSkeleton variant="credit" />
//                 <TotalCardSkeleton variant="total" />
//             </div>
//         )
//     }

//     if (!totals) {
//         return (
//             <div className="mb-4 w-full">
//                 <Alert
//                     className="border-destructive/30 flex items-center bg-destructive/5"
//                     variant="destructive"
//                 >
//                     <BadgeExclamationFillIcon className="size-4" />
//                     <AlertDescription>
//                         Failed to load totals. Please try again later.
//                     </AlertDescription>
//                     <Button
//                         className="inline-flex justify-center ml-auto"
//                         size="sm"
//                         variant="outline"
//                     >
//                         Retry
//                     </Button>
//                 </Alert>
//             </div>
//         )
//     }

//     const getTotalsForTab = () => {
//         switch (activeTab) {
//             case 'general-ledger':
//                 return {
//                     debit: totals.general_ledger_debit_total,
//                     credit: totals.general_ledger_credit_total,
//                 }
//             case 'check-entry':
//                 return {
//                     debit: totals.check_entry_debit_total,
//                     credit: totals.check_entry_credit_total,
//                 }
//             case 'loan-entry':
//                 return {
//                     debit: totals.check_entry_debit_total,
//                     credit: totals.check_entry_credit_total,
//                 }
//             case 'online-entry':
//                 return {
//                     debit: totals.online_entry_debit_total,
//                     credit: totals.online_entry_credit_total,
//                 }
//             case 'cash-entry':
//                 return {
//                     debit: totals.cash_entry_debit_total,
//                     credit: totals.cash_entry_credit_total,
//                 }
//             case 'payment-entry':
//                 return {
//                     debit: totals.payment_entry_debit_total,
//                     credit: totals.payment_entry_credit_total,
//                 }
//             case 'withdraw-entry':
//                 return {
//                     debit: totals.withdraw_entry_debit_total,
//                     credit: totals.withdraw_entry_credit_total,
//                 }
//             case 'deposit-entry':
//                 return {
//                     debit: totals.deposit_entry_debit_total,
//                     credit: totals.deposit_entry_credit_total,
//                 }
//             default:
//                 return { debit: 0, credit: 0 }
//         }
//     }

//     const { debit, credit } = getTotalsForTab()

//     return (
//         <div className="mb-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
//             <TotalCard
//                 amount={debit}
//                 currency={totals.currency}
//                 icon={<ArrowUpRightIcon className="h-5 w-5" />}
//                 label="Total Debit"
//                 variant="debit"
//             />
//             <TotalCard
//                 amount={credit}
//                 currency={totals.currency}
//                 icon={<ArrowDownLeftIcon className="h-5 w-5" />}
//                 label="Total Credit"
//                 variant="credit"
//             />
//         </div>
//     )
// }

// const TotalCardSkeleton = ({
//     variant,
// }: {
//     variant: 'debit' | 'credit' | 'total'
// }) => {
//     const variantStyles = {
//         debit: 'debit-gradient border-debit/30',
//         credit: 'credit-gradient border-credit/30',
//         total: 'total-gradient border-primary/30',
//     }

//     return (
//         <div
//             className={`flex items-center gap-4 rounded-lg border px-5 py-4 ${variantStyles[variant]}`}
//         >
//             <Skeleton className="h-10 w-10 rounded-lg" />
//             <div className="flex flex-col gap-2">
//                 <Skeleton className="h-4 w-20" />
//                 <Skeleton className="h-6 w-28" />
//             </div>
//         </div>
//     )
// }
