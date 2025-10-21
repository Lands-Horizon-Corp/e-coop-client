import { useQueryClient } from '@tanstack/react-query'

import { formatNumber } from '@/helpers/number-utils'
import { ICurrency } from '@/modules/currency'
import {
    IOnlineRemittance,
    onlineRemittanceBaseKey,
    useCurrentBatchOnlineRemittances,
    useDeleteOnlineRemittanceById,
} from '@/modules/online-remittance'
import { OnlineRemittanceCreateUpdateFormModal } from '@/modules/online-remittance/components/forms/online-remittance-create-update-form'
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
    currency?: ICurrency
    onOnlineRemittanceUpdate?: () => void
}

const BatchOnlineRemittance = ({
    transactionBatchId,
    currency,
    onOnlineRemittanceUpdate,
}: Props) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()
    const { data = [], refetch } = useCurrentBatchOnlineRemittances()

    useSubscribe<IOnlineRemittance>(
        `online-remittance.transaction-batch.create.${transactionBatchId}`,
        (newData) => {
            queryClient.setQueryData<IOnlineRemittance[]>(
                [onlineRemittanceBaseKey, 'transaction-batch', 'current'],
                (oldData) => {
                    if (!oldData) return oldData
                    return [newData, ...oldData]
                }
            )
        }
    )

    useSubscribe<IOnlineRemittance>(
        `online-remittance.transaction-batch.update.${transactionBatchId}`,
        (newData) => {
            queryClient.setQueryData<IOnlineRemittance[]>(
                ['online-remittance', 'transaction-batch', 'current'],
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

    useSubscribe<IOnlineRemittance>(
        `online-remittance.transaction-batch.delete.${transactionBatchId}`,
        (deletedData) => {
            queryClient.setQueryData<IOnlineRemittance[]>(
                ['online-remittance', 'transaction-batch', 'current'],
                (oldData) => {
                    if (!oldData) return oldData
                    return oldData.filter((item) => item.id !== deletedData.id)
                }
            )
        }
    )

    const totalRemittance = data.reduce((prev, curr) => prev + curr.amount, 0)

    return (
        <div className="rounded-xl bg-secondary overflow-clip dark:bg-popover/70">
            <OnlineRemittanceCreateUpdateFormModal
                {...modalState}
                formProps={{
                    onSuccess: () => {
                        onOnlineRemittanceUpdate?.()
                        refetch()
                    },
                    defaultValues: {
                        currency,
                        currency_id: currency?.id as TEntityId,
                        transaction_batch_id: transactionBatchId,
                    },
                }}
            />
            <div className="flex w-full items-center justify-between px-4 py-2">
                <div>
                    <p>Online Remittance</p>
                    <p className="text-sm font-bold text-primary">
                        {formatNumber(totalRemittance, 2)}
                    </p>
                </div>
                <Button
                    className="size-fit p-1"
                    onClick={() => modalState.onOpenChange(true)}
                    size="icon"
                >
                    <PlusIcon />
                </Button>
            </div>
            <RemittanceList
                list={data}
                onUpdate={() => {
                    refetch()
                    onOnlineRemittanceUpdate?.()
                }}
            />
        </div>
    )
}

const RemittanceList = ({
    list,
    onUpdate,
}: {
    list: IOnlineRemittance[]
    onUpdate?: () => void
}) => {
    return (
        <div className="ecoop-scroll max-h-64 w-full space-y-2 overflow-auto bg-background/70 p-2 dark:bg-popover">
            {list && list.length > 0 ? (
                list.map((checkRemittance) => {
                    return (
                        <OnlineRemittanceListRow
                            key={checkRemittance.id}
                            onlineRemittance={checkRemittance}
                            onUpdate={onUpdate}
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

const OnlineRemittanceListRow = ({
    onlineRemittance,
    onUpdate,
}: {
    onlineRemittance: IOnlineRemittance
    onUpdate?: () => void
}) => {
    const modalState = useModalState()
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteOnlineRemittance, isPending: isDeleting } =
        useDeleteOnlineRemittanceById({
            options: {
                onSuccess: onUpdate,
            },
        })

    return (
        <div
            className="space-y-4 rounded-xl bg-background p-4 text-xs"
            key={onlineRemittance.id}
        >
            <OnlineRemittanceCreateUpdateFormModal
                {...modalState}
                description="edit/update check remittance details"
                formProps={{
                    onSuccess: onUpdate,
                    onlineRemittanceId: onlineRemittance.id,
                    defaultValues: onlineRemittance,
                }}
                title="Edit Check Remittance"
            />
            <div className="flex items-center justify-between">
                <div className="flex min-w-0 items-center gap-3">
                    <PreviewMediaWrapper media={onlineRemittance.bank?.media}>
                        <ImageDisplay
                            className="h-9 w-9 rounded-full border bg-muted object-cover"
                            src={onlineRemittance.bank?.media?.download_url}
                        />
                    </PreviewMediaWrapper>
                    <div className="flex flex-col items-start">
                        <span className="text-sm font-semibold">
                            {onlineRemittance.bank?.name ?? '-'}
                        </span>
                        <span className="text-xs text-muted-foreground/70">
                            Bank
                        </span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex justify-end gap-1">
                        <Button
                            className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                            disabled={isDeleting}
                            onClick={() => modalState.onOpenChange(true)}
                            size="icon"
                            variant="ghost"
                        >
                            <PencilFillIcon className="size-4" />
                        </Button>
                        <Button
                            className="!size-fit px-1.5 py-1.5 text-muted-foreground/40"
                            disabled={isDeleting}
                            hoverVariant="destructive"
                            onClick={() =>
                                onOpen({
                                    title: 'Delete Online Remittance',
                                    description:
                                        'Are you sure to delete this online remittance?',
                                    onConfirm: () =>
                                        deleteOnlineRemittance(
                                            onlineRemittance.id
                                        ),
                                })
                            }
                            size="icon"
                            variant="ghost"
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
                    {onlineRemittance.reference_number ?? '-'}
                </span>
                <span className="text-xs text-muted-foreground/70">
                    REF NO.
                </span>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {onlineRemittance.account_name ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Acct Name
                    </span>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-sm font-semibold">
                        {formatNumber(onlineRemittance.amount ?? 0, 2)}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Amount
                    </span>
                </div>
            </div>
        </div>
    )
}

export default BatchOnlineRemittance
