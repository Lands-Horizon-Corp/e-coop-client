import { ReactNode } from 'react'

import { cn } from '@/helpers'
import DisbursementTransactionTable from '@/modules/disbursement-transaction/components/disbursement-transaction-table'
import GeneralLedgerTable from '@/modules/general-ledger/components/tables/general-ledger-table'
import { IconType } from 'react-icons/lib'

import {
    BillIcon,
    BookOpenIcon,
    HandCoinsIcon,
    HandDropCoinsIcon,
    MoneyCheckIcon,
    MoneyStackIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
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
        Component: ({ transactionBatchId, className }) => (
            <div
                className={cn(
                    'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <DisbursementTransactionTable
                    className="grow"
                    mode="transaction-batch"
                    transactionBatchId={transactionBatchId}
                />
            </div>
        ),
    },
    {
        value: 'general-ledger',
        title: 'General Ledger',
        Icon: BookOpenIcon,
        Component: ({ transactionBatchId, className }) => (
            <div
                className={cn(
                    'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <GeneralLedgerTable
                    className="grow"
                    mode="transaction-batch"
                    TEntryType=""
                    transactionBatchId={transactionBatchId}
                />
            </div>
        ),
    },
    {
        value: 'check-entry',
        title: 'Check Entry',
        Icon: MoneyCheckIcon,
        Component: ({ transactionBatchId, className }) => (
            <div
                className={cn(
                    'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <GeneralLedgerTable
                    className="grow"
                    mode="transaction-batch"
                    TEntryType="check-entry"
                    transactionBatchId={transactionBatchId}
                />
            </div>
        ),
    },
    {
        value: 'online-entry',
        title: 'Online Entry',
        Icon: BillIcon,
        Component: ({ transactionBatchId, className }) => (
            <div
                className={cn(
                    'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <GeneralLedgerTable
                    className="grow"
                    mode="transaction-batch"
                    TEntryType="online-entry"
                    transactionBatchId={transactionBatchId}
                />
            </div>
        ),
    },
    {
        value: 'cash-entry',
        title: 'Cash Entry',
        Icon: HandCoinsIcon,
        Component: ({ transactionBatchId, className }) => (
            <div
                className={cn(
                    'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <GeneralLedgerTable
                    className="grow"
                    mode="transaction-batch"
                    TEntryType="cash-entry"
                    transactionBatchId={transactionBatchId}
                />
            </div>
        ),
    },
    {
        value: 'payment-entry',
        title: 'Payment Entry',
        Icon: BillIcon,
        Component: ({ transactionBatchId, className }) => (
            <div
                className={cn(
                    'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <GeneralLedgerTable
                    className="grow"
                    mode="transaction-batch"
                    TEntryType="payment-entry"
                    transactionBatchId={transactionBatchId}
                />
            </div>
        ),
    },
    {
        value: 'withdraw-entry',
        title: 'Withdraw Entry',
        Icon: HandCoinsIcon,
        Component: ({ transactionBatchId, className }) => (
            <div
                className={cn(
                    'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <GeneralLedgerTable
                    className="grow"
                    mode="transaction-batch"
                    TEntryType="withdraw-entry"
                    transactionBatchId={transactionBatchId}
                />
            </div>
        ),
    },
    {
        value: 'deposit-entry',
        title: 'Deposit Entry',
        Icon: HandCoinsIcon,
        Component: ({ transactionBatchId, className }) => (
            <div
                className={cn(
                    'flex min-h-[94%] flex-1 flex-col gap-y-4 rounded-xl bg-background p-4',
                    className
                )}
            >
                <GeneralLedgerTable
                    className="grow"
                    mode="transaction-batch"
                    TEntryType="deposit-entry"
                    transactionBatchId={transactionBatchId}
                />
            </div>
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
        <div className="flex min-h-[90vh] w-full max-w-full flex-1 flex-col gap-y-4 p-4">
            <Tabs
                className="flex-1 flex-col"
                defaultValue="batch-funding"
                onValueChange={handleChange}
                value={value}
            >
                <ScrollArea>
                    <TabsList className="mb-3 h-auto min-w-full justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
                        {HistoryTabs.map((tab) => (
                            <TabsTrigger
                                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
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
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {HistoryTabs.map((tab) => (
                    <TabsContent asChild key={tab.value} value={tab.value}>
                        {tab.Component({ transactionBatchId })}
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
            className={cn('flex !max-w-[95vw] px-0 pb-4 pt-0', className)}
            closeButtonClassName="top-2 right-2"
            title={title}
            titleClassName="hidden"
        >
            <TransactionBatchHistories {...transactionBatchHistoryProps} />
        </Modal>
    )
}
