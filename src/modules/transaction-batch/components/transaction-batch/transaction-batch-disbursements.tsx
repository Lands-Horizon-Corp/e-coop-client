import { useQueryClient } from '@tanstack/react-query'

import { formatNumber } from '@/helpers/number-utils'
import {
    IDisbursementTransaction,
    useFilteredPaginatedDisbursementTransaction,
} from '@/modules/disbursement-transaction'
import { DisbursementTransactionCreateFormModal } from '@/modules/disbursement-transaction/components/disbursement-transaction-create-form'

import { CreditCardIcon, PlusIcon, RenderIcon, TIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { TEntityId } from '@/types'

type Props = {
    transactionBatchId: TEntityId
    onDisbursementUpdate?: () => void
}

const TransactionBatchDisbursementTransaction = ({
    transactionBatchId,
    onDisbursementUpdate,
}: Props) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()
    const { data: { data = [] } = {}, refetch } =
        useFilteredPaginatedDisbursementTransaction({
            mode: 'transaction-batch',
            transactionBatchId,
            query: {
                pageIndex: 0,
                pageSize: 100,
            },
        })

    useSubscribe<IDisbursementTransaction>(
        `disbursement-transaction.transaction-batch.${transactionBatchId}.create`,
        () => {
            queryClient.invalidateQueries({
                queryKey: ['disbursement-transaction', paginated],
            })
        }
    )

    useSubscribe<IDisbursementTransaction>(
        `disbursement-transaction.transaction-batch.${transactionBatchId}.update`,
        () => {
            queryClient.invalidateQueries({
                queryKey: ['disbursement-transaction', paginated],
            })
        }
    )

    const totalDisbursements = data.reduce(
        (prev, curr) => prev + curr.amount,
        0
    )

    return (
        <div className="rounded-xl bg-secondary overflow-clip dark:bg-popover/70">
            <DisbursementTransactionCreateFormModal
                {...modalState}
                formProps={{
                    onSuccess: () => {
                        refetch()
                        onDisbursementUpdate?.()
                    },
                    defaultValues: {
                        transaction_batch_id: transactionBatchId,
                    },
                }}
            />
            <div className="flex w-full items-center justify-between px-4 py-2">
                <div>
                    <p>Disbursements</p>
                    <p className="text-sm font-bold text-primary">
                        {formatNumber(totalDisbursements, 2)}
                    </p>
                </div>
                <Button
                    size="icon"
                    className="size-fit p-1"
                    onClick={() => modalState.onOpenChange(true)}
                >
                    <PlusIcon />
                </Button>
            </div>
            <DisbursementList list={data} />
        </div>
    )
}

const DisbursementList = ({ list }: { list: IDisbursementTransaction[] }) => {
    return (
        <div className="ecoop-scroll max-h-64 w-full space-y-2 overflow-auto bg-background/70 p-2 dark:bg-popover/40">
            {list && list.length > 0 ? (
                list.map((disbursement) => {
                    return (
                        <DisbursementListRow
                            key={disbursement.id}
                            disbursementTransaction={disbursement}
                        />
                    )
                })
            ) : (
                <div className="flex flex-col items-center justify-center gap-y-4 py-6 text-center text-xs text-muted-foreground/60">
                    <CreditCardIcon />
                    No disbursements yet
                </div>
            )}
        </div>
    )
}

const DisbursementListRow = ({
    disbursementTransaction,
}: {
    disbursementTransaction: IDisbursementTransaction
}) => {
    return (
        <div
            key={disbursementTransaction.id}
            className="space-y-4 rounded-xl bg-background p-4 text-xs"
        >
            <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full border bg-muted">
                        <CreditCardIcon className="h-4 w-4" />
                    </div>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold">
                            {disbursementTransaction.reference_number || (
                                <span className="text-muted-foreground text-xs font-normal italic">
                                    no reference
                                </span>
                            )}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                            REF NO.
                        </span>
                    </div>
                </div>
                <div className="flex flex-col items-end text-muted-foreground">
                    <span>
                        {' '}
                        <RenderIcon
                            icon={
                                disbursementTransaction.disbursement
                                    ?.icon as TIcon
                            }
                            className="inline size-4"
                        />{' '}
                        {disbursementTransaction.disbursement?.name}
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground/70">Amount</span>
                <span className="text-sm text-right font-semibold">
                    {formatNumber(disbursementTransaction.amount ?? 0, 2)}
                </span>
            </div>
        </div>
    )
}

export default TransactionBatchDisbursementTransaction
