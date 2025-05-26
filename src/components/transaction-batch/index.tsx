import { Button } from '../ui/button'
import BatchBlotter from './batch-blotter'
import { LayersSharpDotIcon } from '../icons'
import DepositInBankCard from './deposit-in-bank/deposit-in-bank-card'
import BeginningBalanceCard from './transaction-batch-funding/beginning-balance-card'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'

import { IClassProps, ITransactionBatch } from '@/types'
import TransactionBatchCashCount from './transaction-batch-cash-count'

interface Props extends IClassProps {
    // TODO: pass transaction id or object here
}

const TransactionBatch = ({ className }: Props) => {
    return (
        <div
            className={cn(
                'ecoop-scroll flex max-h-[90vh] min-w-[900px] flex-col gap-y-3 overflow-auto rounded-2xl border-2 bg-background p-4 ring-offset-1 dark:bg-popover',
                'shadow-xl',
                className
            )}
        >
            <div className="flex items-center justify-between">
                <p>
                    <LayersSharpDotIcon className="mr-1 inline text-primary" />{' '}
                    Transaction Batch
                </p>
                <div className="text-right">
                    <p className="text-sm">
                        {toReadableDate(
                            new Date(),
                            "MMM, dd yyyy 'at' h:mm a "
                        )}
                    </p>
                    <p className="text-xs text-muted-foreground/40">
                        started date time
                    </p>
                </div>
            </div>
            <div className="flex min-h-[40vh] w-full shrink-0 gap-x-2">
                <div className="flex-1 space-y-2 rounded-2xl border bg-background p-4">
                    <div className="flex gap-x-2">
                        {/* TODO: // add correct values */}
                        <BeginningBalanceCard
                            transaction_batch={{ id: '' } as ITransactionBatch}
                        />
                        {/* TODO: // add correct values */}
                        <DepositInBankCard
                            transactionBatchId={''}
                            depositInBankAmount={0}
                        />
                    </div>
                    <TransactionBatchCashCount
                        transactionBatch={{} as ITransactionBatch}
                    />
                    <Button size="sm" variant="secondary" className="w-full">
                        Add Check Remittance
                    </Button>
                    <Button size="sm" variant="secondary" className="w-full">
                        Add Online Remittance
                    </Button>
                </div>
                <BatchBlotter
                    transaction_batch={
                        {
                            request_view: '2025-05-22T10:52:18.163Z',
                            can_view: true,
                        } as ITransactionBatch
                    }
                />
            </div>
            <Button
                size="sm"
                variant="secondary"
                hoverVariant="primary"
                className="shrink-0 rounded-xl"
            >
                End Batch
            </Button>
        </div>
    )
}

export default TransactionBatch
