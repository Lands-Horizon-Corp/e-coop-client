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
import { CheckRemittanceCreateUpdateFormModal } from '@/components/forms/remittance/check-remittance-create-update-form'

import {
    useCurrentBatchCheckRemittances,
    useDeleteBatchCheckRemittance,
} from '@/hooks/api-hooks/use-check-remittance'
import { useSubscribe } from '@/hooks/use-pubsub'
import { useModalState } from '@/hooks/use-modal-state'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { ICheckRemittance, TEntityId } from '@/types'

type Props = {
    transactionBatchId: TEntityId
}

const BatchCheckRemitance = ({ transactionBatchId }: Props) => {
    const queryClient = useQueryClient()
    const modalState = useModalState()
    const { data } = useCurrentBatchCheckRemittances()

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

    return (
        <div className="rounded-xl bg-secondary dark:bg-popover/70">
            <CheckRemittanceCreateUpdateFormModal
                {...modalState}
                formProps={{
                    defaultValues: {
                        transaction_batch_id: transactionBatchId,
                    },
                }}
            />
            <div className="flex w-full items-center justify-between px-4 py-2">
                <p>Check Remittance</p>
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

const RemittanceList = ({ list }: { list: ICheckRemittance[] }) => {
    return (
        <div className="max-h-64 w-full overflow-auto bg-background/70 dark:bg-popover">
            <Table>
                <TableBody>
                    {list && list.length > 0 ? (
                        list.map((checkRemittance) => {
                            return (
                                <RemittanceListRow
                                    key={checkRemittance.id}
                                    checkRemittance={checkRemittance}
                                />
                            )
                        })
                    ) : (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <div className="flex flex-col items-center justify-center gap-y-4 py-6 text-center text-xs text-muted-foreground/60">
                                    <MoneyCheckIcon />
                                    No check remittance yet
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
    checkRemittance,
}: {
    checkRemittance: ICheckRemittance
}) => {
    const modalState = useModalState()
    const { onOpen } = useConfirmModalStore()

    const { mutate: deleteCheckRemittance, isPending: isDeleting } =
        useDeleteBatchCheckRemittance()

    return (
        <TableRow key={checkRemittance.id} className="text-xs">
            <CheckRemittanceCreateUpdateFormModal
                {...modalState}
                title="Edit Check Remittance"
                description="edit/update check remittance details"
                formProps={{
                    defaultValues: checkRemittance,
                }}
            />
            <TableCell>
                <div className="flex min-w-0 items-center gap-3">
                    <ImageDisplay
                        src={checkRemittance.bank?.media?.download_url}
                        className="h-9 w-9 rounded-full border bg-muted object-cover"
                    />
                    <div className="flex min-w-0 flex-col">Bank</div>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {checkRemittance.reference_number ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        REF NO.
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {checkRemittance.bank?.name ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Bank
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {checkRemittance.account_name ?? '-'}
                    </span>
                    <span className="text-xs text-muted-foreground/70">
                        Acct Name
                    </span>
                </div>
            </TableCell>
            <TableCell>
                <div className="flex flex-col items-start">
                    <span className="text-sm font-semibold">
                        {checkRemittance.amount ?? '-'}
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
                                title: 'Delete Relative Account',
                                description:
                                    'Are you sure to delete this relative account?',
                                onConfirm: () =>
                                    deleteCheckRemittance(checkRemittance.id),
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

export default BatchCheckRemitance
