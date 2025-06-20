import { ReactNode } from 'react'
import { IconType } from 'react-icons/lib'

import {
    ReceiptIcon,
    MoneyBagIcon,
    MoneyCheckIcon,
    MoneyStackIcon,
    HandDepositIcon,
    HandWithdrawIcon,
    OnlinePaymentIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

import BatchFundingHistory from './batch-funding-history'
import BatchCashEntryHistory from './batch-cash-entry-history'
import BatchCheckEntryHistory from './batch-check-entry-history'
import BatchOnlineEntryHistory from './batch-online-entry-history'
import BatchDepositEntryHistory from './batch-deposit-entry-history'

import { cn } from '@/lib'
import { useInternalState } from '@/hooks/use-internal-state'

import { IClassProps, TEntityId } from '@/types'
import BatchWithdrawalEntryHistory from './batch-withdrwal-entry-history'
import BatchTransactionEntryHistory from './batch-transaction-entry-history'

export interface TransBatchHistoryTabsContentProps extends IClassProps {
    transactionBatchId: TEntityId
}

const HistoryTabs: {
    value: string
    title: string
    Icon?: IconType
    Component: (
        props: IClassProps & {
            transactionBatchId: TEntityId
        }
    ) => ReactNode
}[] = [
    {
        value: 'batch-funding',
        title: 'Batch Funding',
        Icon: MoneyStackIcon,
        Component: BatchFundingHistory,
    },
    {
        value: 'cash-entries',
        title: 'Cash Entries',
        Icon: MoneyBagIcon,
        Component: BatchCashEntryHistory,
    },
    {
        value: 'check-entries',
        title: 'Check Entries',
        Icon: MoneyCheckIcon,
        Component: BatchCheckEntryHistory,
    },
    {
        value: 'online-entries',
        title: 'Online Entries',
        Icon: OnlinePaymentIcon,
        Component: BatchOnlineEntryHistory,
    },
    {
        value: 'withdrawal-entries',
        title: 'Withdrawal Entries',
        Icon: HandWithdrawIcon,
        Component: BatchWithdrawalEntryHistory,
    },
    {
        value: 'deposit-entries',
        title: 'Deposit Entries',
        Icon: HandDepositIcon,
        Component: BatchDepositEntryHistory,
    },
    {
        value: 'transaction-entries',
        title: 'Transaction Entries',
        Icon: ReceiptIcon,
        Component: BatchTransactionEntryHistory,
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
                value={value}
                className="flex-1 flex-col"
                defaultValue="batch-funding"
                onValueChange={handleChange}
            >
                <ScrollArea>
                    <TabsList className="mb-3 h-auto min-w-full justify-start gap-2 rounded-none border-b bg-transparent px-0 py-1 text-foreground">
                        {HistoryTabs.map((tab) => (
                            <TabsTrigger
                                key={tab.value}
                                value={tab.value}
                                className="relative after:absolute after:inset-x-0 after:bottom-0 after:-mb-1 after:h-0.5 after:duration-300 after:ease-in-out hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                            >
                                {tab.Icon && (
                                    <tab.Icon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                )}
                                {tab.title}
                            </TabsTrigger>
                        ))}
                    </TabsList>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
                {HistoryTabs.map((tab) => (
                    <TabsContent value={tab.value} key={tab.value} asChild>
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
            title={title}
            titleClassName="hidden"
            className={cn('flex max-w-[80vw] px-0 pb-4 pt-0', className)}
        >
            <TransactionBatchHistories {...transactionBatchHistoryProps} />
        </Modal>
    )
}
