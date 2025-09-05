import { useQueryClient } from '@tanstack/react-query'

import { formatNumber } from '@/helpers/number-utils'
import {
    ICheckRemittance,
    useCurrentBatchCheckRemittances,
    useDeleteBatchCheckRemittance,
} from '@/modules/check-remittance'
import { CheckRemittanceCreateUpdateFormModal } from '@/modules/check-remittance/components/forms/check-remittance-create-update-form'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    MoneyCheckIcon,
    PencilFillIcon,
    PlusIcon,
    TrashIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useModalState } from '@/hooks/use-modal-state'
import { useSubscribe } from '@/hooks/use-pubsub'

import { TEntityId } from '@/types'

type Props = {
    transactionBatchId: TEntityId
    onCheckRemittanceUpdate?: () => void
}

const BatchCheckRemitance = ({
    transactionBatchId,
    onCheckRemittanceUpdate,
}: Props) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()
    const { data = [], refetch } = useCurrentBatchCheckRemittances()

    useSubscribe<ICheckRemittance>(
        `check-remittance.transaction-batch.${transactionBatchId}.create`,
        (newData) => {
            queryClient.setQueryData<ICheckRemittance[]>(
                ['check-remittance', 'transaction-batch', 'current'],
                (oldData) => {
                    if (!oldData) return oldData
                    return [newData, ...oldData]
                }
            )
        }
    )

    useSubscribe<ICheckRemittance>(
        `check-remittance.transaction-batch.${transactionBatchId}.update`,
        (newData) => {
            queryClient.setQueryData<ICheckRemittance[]>(
                ['check-remittance', 'transaction-batch', 'current'],
                (oldData) => {
                    if (!oldData) return oldData

                    const index = oldData.findIndex(
                        (item) => item.id === newData.id
                    )
                    const copies = [...oldData]

                    if (index !== -1) {
                        copies.splice(index, 1, newData)
                    } else {
                        copies.splice(0, 0, newData)
                    }

                    return copies
                }
            )
        }
    )

    useSubscribe<ICheckRemittance>(
        `check-remittance.transaction-batch.${transactionBatchId}.delete`,
        (deletedData) => {
            queryClient.setQueryData<ICheckRemittance[]>(
                ['check-remittance', 'transaction-batch', 'current'],
                (oldData) => {
                    if (!oldData) return oldData
                    return oldData.filter((item) => item.id !== deletedData.id)
                }
            )
        }
    )

    const totalRemittance = (data ?? []).reduce(
        (prev, curr) => prev + curr.amount,
        0
    )

    return (
        <div className="rounded-xl bg-secondary overflow-clip dark:bg-popover/70">
            <CheckRemittanceCreateUpdateFormModal
                {...modalState}
                formProps={{
                    onSuccess: () => {
                        refetch()
                        onCheckRemittanceUpdate?.()
                    },
                    defaultValues: {
                        transaction_batch_id: transactionBatchId,
                    },
                }}
            />
            <div className="flex w-full items-center justify-between px-4 py-2">
                <div>
                    <p>Check Remittance</p>
                    <p className="text-sm font-bold text-primary">
                        {formatNumber(totalRemittance, 2)}
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
            <RemittanceList
                list={data ?? []}
                onUpdate={() => {
                    refetch()
                    onCheckRemittanceUpdate?.()
                }}
            />
        </div>
    )
}

const RemittanceList = ({
    list,
    onUpdate,
}: {
    list: ICheckRemittance[]
    onUpdate?: () => void
}) => {
    return (
        <div className="ecoop-scroll max-h-64 w-full space-y-2 overflow-auto bg-background/70 p-2 dark:bg-popover/40">
            {list && list.length > 0 ? (
                list.map((checkRemittance) => {
                    return (
                        <RemittanceListRow
                            key={checkRemittance.id}
                            onUpdate={onUpdate}
                            checkRemittance={checkRemittance}
                        />
                    )
                })
            ) : (
                <div className="flex flex-col items-center justify-center gap-y-4 py-6 text-center text-xs text-muted-foreground/60">
                    <MoneyCheckIcon />
                    No check remittance yet
                </div>
            )}
        </div>
    )
}

const RemittanceListRow = ({
    checkRemittance,
    onUpdate,
}: {
    checkRemittance: ICheckRemittance
    onUpdate?: () => void
}) => {
    const modalState = useModalState()
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteCheckRemittance, isPending: isDeleting } =
        useDeleteBatchCheckRemittance({
            options: {
                onSuccess: onUpdate,
            },
        })

    return (
        <div
            key={checkRemittance.id}
            className="space-y-4 rounded-xl bg-background p-4 text-xs"
        >
            <CheckRemittanceCreateUpdateFormModal
                {...modalState}
                title="Edit Check Remittance"
                description="edit/update check remittance details"
                formProps={{
                    onSuccess: onUpdate,
                    checkRemittanceId: checkRemittance.id,
                    defaultValues: checkRemittance,
                }}
            />
            <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <PreviewMediaWrapper media={checkRemittance.bank?.media}>
                        <ImageDisplay
                            src={checkRemittance.bank?.media?.download_url}
                            className="h-9 w-9 rounded-full border bg-muted object-cover"
                        />
                    </PreviewMediaWrapper>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold">
                            {checkRemittance.bank?.name ?? '-'}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                            Bank
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex justify-end gap-1">
                        <Button
                            size="icon"
                            variant="ghost"
                            className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                            disabled={isDeleting}
                            onClick={() => modalState.onOpenChange(true)}
                        >
                            <PencilFillIcon className="size-4" />
                        </Button>
                        <Button
                            size="icon"
                            variant="ghost"
                            hoverVariant="destructive"
                            className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                            disabled={isDeleting}
                            onClick={() =>
                                onOpen({
                                    title: 'Delete Check Remittance',
                                    description:
                                        'Are you sure to delete this check remittance?',
                                    onConfirm: () =>
                                        deleteCheckRemittance(
                                            checkRemittance.id
                                        ),
                                })
                            }
                        >
                            {isDeleting ? (
                                <LoadingSpinner />
                            ) : (
                                <TrashIcon className="size-4" />
                            )}
                        </Button>
                    </div>
                </div>
            </div>
            <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">
                    {checkRemittance.reference_number ?? '-'}
                </span>
                <span className="text-xs text-muted-foreground/70">
                    REF NO.
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {checkRemittance.account_name ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Acct Name
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">
                        {formatNumber(checkRemittance.amount ?? 0, 2)}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Amount
                    </span>
                </div>
            </div>
        </div>
    )
}

export default BatchCheckRemitance
