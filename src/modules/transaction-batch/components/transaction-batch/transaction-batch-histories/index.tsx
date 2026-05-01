import { ReactNode } from 'react'

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
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    BadgeExclamationFillIcon,
    BillIcon,
    BookOpenIcon,
    EmptyIcon,
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
import { Empty, EmptyContent, EmptyHeader } from '@/components/ui/empty'
import { Label } from '@/components/ui/label'
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
}

const TransactionBatchSummary = ({
    transactionBatchSummary,
    currency,
}: TransactionBatchSummaryItemProps) => {
    return (
        <div className="overflow-y-auto pr-2 pt-2 pl-1 ecoop-scroll min-fit max-h-[95%]">
            {transactionBatchSummary?.map((summary) => {
                return (
                    <div className="">
                        <div className="grid grid-cols-2 gap-2 ">
                            <TotalCard
                                amount={summary.total_debit}
                                currency={currency}
                                icon={<ArrowUpRightIcon className="h-5 w-5" />}
                                label="Debit"
                                variant="debit"
                            />
                            <TotalCard
                                amount={summary.total_credit}
                                currency={currency}
                                icon={<ArrowDownLeftIcon className="h-5 w-5" />}
                                label="Credit"
                                variant="credit"
                            />
                            <TotalCard
                                amount={summary.total_balance}
                                currency={currency}
                                icon={<WalletIcon className="h-5 w-5" />}
                                label="Total Balance"
                                variant="total"
                            />
                        </div>
                        <div className=" flex flex-col gap-2 mt-4 overflow-y-auto ecoop-scroll min-h-fit py-2">
                            {summary.transaction_batch_account_summary.map(
                                (accountSummary) => {
                                    return (
                                        <>
                                            <Card
                                                className="rounded-lg border"
                                                key={accountSummary.account.id}
                                            >
                                                <CardContent className="p-4">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-sm font-medium text-muted-foreground">
                                                            {
                                                                accountSummary
                                                                    .account
                                                                    .name
                                                            }
                                                        </span>
                                                        <span
                                                            className={cn(
                                                                'text-sm font-semibold',
                                                                accountSummary.balance >=
                                                                    0
                                                                    ? 'text-debit'
                                                                    : 'text-credit'
                                                            )}
                                                        >
                                                            {currencyFormat(
                                                                accountSummary.balance,
                                                                {
                                                                    currency:
                                                                        currency,
                                                                    showSymbol: true,
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                    <div className="mt-2 flex items-center justify-between">
                                                        <span className="text-sm text-muted-foreground">
                                                            Debit:{' '}
                                                            {currencyFormat(
                                                                accountSummary.debit,
                                                                {
                                                                    currency:
                                                                        currency,
                                                                    showSymbol: true,
                                                                }
                                                            )}
                                                        </span>
                                                        <span className="text-sm text-muted-foreground">
                                                            Credit:{' '}
                                                            {currencyFormat(
                                                                accountSummary.credit,
                                                                {
                                                                    currency:
                                                                        currency,
                                                                    showSymbol: true,
                                                                }
                                                            )}
                                                        </span>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        </>
                                    )
                                } /*  */
                            )}
                            {summary.transaction_batch_account_summary ===
                                null && (
                                <Empty>
                                    <EmptyHeader>
                                        <EmptyIcon />
                                    </EmptyHeader>
                                    <EmptyContent>
                                        No transaction Available
                                    </EmptyContent>
                                </Empty>
                            )}
                        </div>
                    </div>
                )
            })}
        </div>
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
                'min-w-sm overflow-y-auto ecoop-scroll h-full bg-background rounded-xl border p-5'
            )}
        >
            {(typeof debit === 'number' || typeof credit === 'number') && (
                <div className="grid grid-cols-2 gap-2 mb-4">
                    {typeof debit === 'number' && (
                        <TotalCard
                            amount={debit}
                            currency={currency}
                            icon={<ArrowUpRightIcon className="h-5 w-5" />}
                            label="Total Debit"
                            variant="debit"
                        />
                    )}
                    {typeof credit === 'number' && (
                        <TotalCard
                            amount={credit}
                            currency={currency}
                            icon={<ArrowDownLeftIcon className="h-5 w-5" />}
                            label="Total Credit"
                            variant="credit"
                        />
                    )}
                </div>
            )}
            <div className="mb-4">
                <Label className="text-sm font-semibold mb-2 block">
                    Account Summary
                </Label>
                {Array.isArray(accountSummary) && accountSummary.length > 0 ? (
                    <TransactionBatchSummary
                        currency={currency}
                        transactionBatchSummary={accountSummary}
                    />
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyIcon />
                        </EmptyHeader>
                        <EmptyContent>No transaction Available</EmptyContent>
                    </Empty>
                )}
            </div>
            <div className="mb-4">
                <Label className="text-sm font-semibold mb-2 block">
                    Cash on Hand Summary
                </Label>
                {Array.isArray(cashSummary) && cashSummary.length > 0 ? (
                    <TransactionBatchSummary
                        currency={currency}
                        transactionBatchSummary={cashSummary}
                    />
                ) : (
                    <Empty>
                        <EmptyHeader>
                            <EmptyIcon />
                        </EmptyHeader>
                        <EmptyContent>No transaction Available</EmptyContent>
                    </Empty>
                )}
            </div>
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
