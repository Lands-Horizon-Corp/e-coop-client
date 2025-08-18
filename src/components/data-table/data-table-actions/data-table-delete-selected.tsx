import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers'
import { cn } from '@/lib'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { withCatchAsync } from '@/utils'
import { Table } from '@tanstack/react-table'

import { TrashIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

export interface IDataTableDeleteSelectedProps<T> extends IClassProps {
    table: Table<T>
    disabled?: boolean
    canDelete?: boolean
    onDeleteSuccess?: () => void
    onDelete: (selectedRows: T[]) => Promise<void>
}

const DataTableDeleteSelected = <T,>({
    table,
    disabled,
    className,
    canDelete = true,
    onDelete,
    onDeleteSuccess,
}: IDataTableDeleteSelectedProps<T>) => {
    const { onOpen } = useConfirmModalStore()

    const selectedRows = table
        .getSelectedRowModel()
        .flatRows.map((row) => row.original)

    const isDisabled = !canDelete || selectedRows.length === 0 || disabled

    const { mutate: handleDelete, isPending: isDeleting } = useMutation({
        mutationKey: ['table', 'delete', selectedRows],
        mutationFn: async () => {
            const [error] = await withCatchAsync(onDelete(selectedRows))

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                toast.error(errorMessage)
                throw errorMessage
            }

            onDeleteSuccess?.()
            toast.success('Selected record(s) has been deleted')
        },
    })

    return (
        <Button
            disabled={isDeleting || isDisabled}
            onClick={() =>
                onOpen({
                    title: 'Delete Selected',
                    description: `You are about to delete ${selectedRows.length} items, are you sure you want to proceed?`,
                    onConfirm: handleDelete,
                    confirmString: 'Proceed',
                })
            }
            size="icon"
            variant="destructive"
            className={cn('relative', className)}
        >
            {isDeleting ? (
                <LoadingSpinner />
            ) : (
                <span className="inline-flex items-center gap-x-2">
                    <TrashIcon className="inline" />
                </span>
            )}
            {selectedRows.length > 0 && (
                <Badge
                    variant="secondary"
                    className="absolute -right-[0%] top-[10px] size-fit w-fit -translate-y-1/2 translate-x-1/2 px-[3px] text-xs animate-in fade-in dark:bg-popover/60"
                >
                    {selectedRows.length}
                </Badge>
            )}
        </Button>
    )
}

export default DataTableDeleteSelected
