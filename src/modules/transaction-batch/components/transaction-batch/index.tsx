import { useQueryClient } from '@tanstack/react-query'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'

import { EyeIcon, LayersSharpDotIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import {
    ITransactionBatch,
    TTransactionBatchFullorMin,
} from '../../transaction-batch.types'
import { TransactionBatchEndFormModal } from '../forms/transaction-batch-end-form'
import BatchBlotter from './batch-blotter'
import DepositInBankCard from './deposit-in-bank/deposit-in-bank-card'
import BatchCheckRemitance from './remittance/check-remittance'
import BatchOnlineRemittance from './remittance/online-remittance'
import TransactionBatchCashCount from './transaction-batch-cash-count'
import TransactionBatchDisbursementTransaction from './transaction-batch-disbursements'
import BeginningBalanceCard from './transaction-batch-funding-card'
import { TransactionBatchHistoriesModal } from './transaction-batch-histories'

interface Props extends IClassProps {
    transactionBatch: TTransactionBatchFullorMin
    onBatchEnded?: () => void
}

const TransactionBatch = ({
    className,
    transactionBatch,
    onBatchEnded,
}: Props) => {
    const queryClient = useQueryClient()
    const historyModal = useModalState()
    const endModal = useModalState()
    const {
        currentAuth: { user, user_organization },
    } = useAuthUserWithOrg()

    const invalidateTransactionBatch = () => {
        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', transactionBatch.id],
        })

        queryClient.invalidateQueries({
            queryKey: ['transaction-batch', 'current'],
        })
    }

    return (
        <div
            className={cn(
                'ecoop-scroll flex max-h-[90vh] min-w-[900px] flex-col gap-y-3 overflow-auto rounded-2xl border-2 bg-secondary p-4 ring-offset-1 dark:bg-popover',
                'shadow-xl',
                className
            )}
        >
            <TransactionBatchHistoriesModal
                {...historyModal}
                title={`${transactionBatch?.batch_name ?? 'Transaction Batch'} History`}
                transactionBatchHistoryProps={{
                    transactionBatchId: transactionBatch?.id,
                }}
            />
            <TransactionBatchEndFormModal
                {...endModal}
                formProps={{
                    onSuccess: onBatchEnded,
                    defaultValues: {
                        employee_by_name: user.full_name,
                        employee_by_position: user_organization.permission_name,
                    },
                }}
            />
            <div className="flex items-center justify-between">
                <div className="flex items-start gap-x-2">
                    <LayersSharpDotIcon className="mt-1 inline text-primary" />{' '}
                    <div>
                        <p>Transaction Batch</p>
                        <p className="text-xs text-muted-foreground dark:text-muted-foreground/40">
                            {toReadableDate(
                                transactionBatch?.created_at,
                                "MMM, dd yyyy 'at' h:mm a "
                            )}
                        </p>
                    </div>
                </div>
                <Button
                    size="sm"
                    variant="secondary"
                    className="h-fit py-1"
                    hoverVariant="primary"
                    onClick={() => historyModal.onOpenChange(true)}
                >
                    <EyeIcon className="mr-2 inline" /> View History
                </Button>
            </div>
            <div className="flex min-h-[40vh] w-full shrink-0 gap-x-2">
                <div className="flex-1 space-y-2 rounded-2xl border bg-background p-4">
                    <div className="flex gap-x-2">
                        <BeginningBalanceCard
                            onAdd={() => invalidateTransactionBatch()}
                            transactionBatch={transactionBatch}
                        />
                        <DepositInBankCard
                            transactionBatchId={transactionBatch?.id}
                            depositInBankAmount={
                                transactionBatch?.deposit_in_bank ?? 0
                            }
                            onUpdate={() => invalidateTransactionBatch()}
                        />
                    </div>
                    <TransactionBatchCashCount
                        onCashCountUpdate={() => invalidateTransactionBatch()}
                        transactionBatch={transactionBatch}
                    />
                    <Separator />
                    <BatchCheckRemitance
                        transactionBatchId={transactionBatch?.id}
                        onCheckRemittanceUpdate={() =>
                            invalidateTransactionBatch()
                        }
                    />
                    <Separator />
                    <BatchOnlineRemittance
                        transactionBatchId={transactionBatch?.id}
                        onOnlineRemittanceUpdate={() =>
                            invalidateTransactionBatch()
                        }
                    />
                    <Separator />
                    <TransactionBatchDisbursementTransaction
                        transactionBatchId={transactionBatch?.id}
                        onDisbursementUpdate={() =>
                            invalidateTransactionBatch()
                        }
                    />
                </div>
                <BatchBlotter
                    transactionBatch={transactionBatch as ITransactionBatch}
                />
            </div>
            <Button
                size="sm"
                hoverVariant="primary"
                onClick={() => endModal.onOpenChange(true)}
                className="shrink-0 rounded-xl dark:bg-secondary dark:text-secondary-foreground"
            >
                End Batch
            </Button>
        </div>
    )
}

export default TransactionBatch
