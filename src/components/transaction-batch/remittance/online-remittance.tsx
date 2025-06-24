import { useQueryClient } from '@tanstack/react-query'

import {
    PlusIcon,
    TrashIcon,
    MoneyCheckIcon,
    PencilFillIcon,
} from '@/components/icons'
import { Button } from '@/components/ui/button'
import ImageDisplay from '@/components/image-display'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { OnlineRemittanceCreateUpdateFormModal } from '@/components/forms/remittance/online-remittance-create-update-form'

import {
    useCurrentBatchOnlineRemittances,
    useDeleteOnlineRemittance,
} from '@/hooks/api-hooks/use-online-remittance'
import { useSubscribe } from '@/hooks/use-pubsub'
import { useModalState } from '@/hooks/use-modal-state'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { IOnlineRemitance, TEntityId } from '@/types'
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

type Props = {
    transactionBatchId: TEntityId
}

const BatchOnlineRemittance = ({ transactionBatchId }: Props) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()
    const { data } = useCurrentBatchOnlineRemittances()

    useSubscribe<IOnlineRemitance>(
        `online-remittance.transaction-batch.${transactionBatchId}.create`,
        (newData) => {
            queryClient.setQueryData<IOnlineRemitance[]>(
                ['online-remittance', 'transaction-batch', 'current'],
                (oldData) => {
                    if (!oldData) return oldData
                    return [newData, ...oldData]
                }
            )
        }
    )

    useSubscribe<IOnlineRemitance>(
        `online-remittance.transaction-batch.${transactionBatchId}.update`,
        (newData) => {
            queryClient.setQueryData<IOnlineRemitance[]>(
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

    useSubscribe<IOnlineRemitance>(
        `online-remittance.transaction-batch.${transactionBatchId}.delete`,
        (deletedData) => {
            queryClient.setQueryData<IOnlineRemitance[]>(
                ['online-remittance', 'transaction-batch', 'current'],
                (oldData) => {
                    if (!oldData) return oldData
                    return oldData.filter((item) => item.id !== deletedData.id)
                }
            )
        }
    )

    return (
        <div className="rounded-xl bg-secondary dark:bg-popover/70">
            <OnlineRemittanceCreateUpdateFormModal
                {...modalState}
                formProps={{
                    defaultValues: {
                        transaction_batch_id: transactionBatchId,
                    },
                }}
            />
            <div className="flex w-full items-center justify-between px-4 py-2">
                <p>Online Remittance</p>
                <Button
                    size="icon"
                    className="size-fit p-1"
                    onClick={() => modalState.onOpenChange(true)}
                >
                    <PlusIcon />
                </Button>
            </div>
            <RemittanceList list={data} />
        </div>
    )
}

const RemittanceList = ({ list }: { list: IOnlineRemitance[] }) => {
    return (
        <div className="max-h-64 w-full overflow-auto bg-background/70 dark:bg-popover">
            <Table>
                <TableBody>
                    {list && list.length > 0 ? (
                        list.map((onlineRemittance) => {
                            return (
                                <RemittanceListRow
                                    key={onlineRemittance.id}
                                    onlineRemittance={onlineRemittance}
                                />
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <div className="flex flex-col items-center justify-center gap-y-4 py-6 text-center text-xs text-muted-foreground/60">
                                    <MoneyCheckIcon />
                                    No online remittance yet
                                </div>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

const RemittanceListRow = ({
    onlineRemittance,
}: {
    onlineRemittance: IOnlineRemitance
}) => {
    const modalState = useModalState()
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteOnlineRemittance, isPending: isDeleting } =
        useDeleteOnlineRemittance()

    return (
        <TableRow key={onlineRemittance.id} className="text-xs">
            <OnlineRemittanceCreateUpdateFormModal
                {...modalState}
                formProps={{
                    defaultValues: onlineRemittance,
                }}
            />
            <TableCell>
                <div className="flex min-w-0 items-center gap-3">
                    <PreviewMediaWrapper media={onlineRemittance.bank?.media}>
                        <ImageDisplay
                            src={onlineRemittance.bank?.media?.download_url}
                            className="h-9 w-9 rounded-full border bg-muted object-cover"
                        />
                    </PreviewMediaWrapper>
                    <div className="flex min-w-0 flex-col">Bank</div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {onlineRemittance.reference_number ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        REF NO.
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {onlineRemittance.bank?.name ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Bank
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {onlineRemittance.account_name ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Acct Name
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {onlineRemittance.amount ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Amount
                    </span>
                </div>
            </TableCell>
            <TableCell className="text-right">
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
                                title: 'Delete Online Remittance',
                                description:
                                    'Are you sure to delete this online remittance?',
                                onConfirm: () =>
                                    deleteOnlineRemittance(onlineRemittance.id),
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
            </TableCell>
        </TableRow>
    )
}

export default BatchOnlineRemittance
