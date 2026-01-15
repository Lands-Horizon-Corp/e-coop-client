import { ReactNode } from 'react'

import { MutualFundEntryCreateUpdateFormModal } from '@/modules/mutual-fund-entry/components/forms/mutual-fund-entry-create-update-form'
import { useDeleteMutualFundEntryById } from '@/modules/mutual-fund-entry/mutual-fund-entry.service'
import { IMutualFundEntry } from '@/modules/mutual-fund-entry/mutual-fund-entry.types'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'
import { Eye, Pencil, Trash2 } from 'lucide-react'

import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import { Button } from '@/components/ui/button'
import { ContextMenuItem } from '@/components/ui/context-menu'

import { IMutualFundEntryTableActionComponentProp } from './index'

export type MutualFundEntryActionType = 'edit' | 'delete' | 'view'

export interface MutualFundEntryActionExtra {
    onDeleteSuccess?: () => void
}

interface UseMutualFundEntryActionsProps {
    row: Row<IMutualFundEntry>
    onDeleteSuccess?: () => void
}

const useMutualFundEntryActions = ({
    row,
    onDeleteSuccess,
}: UseMutualFundEntryActionsProps) => {
    const entry = row.original
    const { open } = useTableRowActionStore<
        IMutualFundEntry,
        MutualFundEntryActionType,
        MutualFundEntryActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingEntry, mutate: deleteEntry } =
        useDeleteMutualFundEntryById({
            options: {
                onSuccess: onDeleteSuccess,
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: entry.id,
            defaultValues: entry,
            extra: { onDeleteSuccess },
        })
    }

    const handleView = () => {
        open('view', {
            id: entry.id,
            defaultValues: entry,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Mutual Fund Entry',
            description:
                'Are you sure you want to delete this mutual fund entry?',
            onConfirm: () => deleteEntry(entry.id),
        })
    }

    return {
        entry,
        isDeletingEntry,
        handleEdit,
        handleView,
        handleDelete,
    }
}

interface IMutualFundEntryTableActionProps
    extends IMutualFundEntryTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const MutualFundEntryAction = ({
    row,
    onDeleteSuccess,
}: IMutualFundEntryTableActionProps) => {
    const { isDeletingEntry, handleEdit, handleView, handleDelete } =
        useMutualFundEntryActions({ row, onDeleteSuccess })

    return (
        <div className="flex items-center gap-1">
            <Button onClick={handleView} size="icon-sm" variant="ghost">
                <Eye className="size-3" />
            </Button>
            <Button onClick={handleEdit} size="icon-sm" variant="ghost">
                <Pencil className="size-3" />
            </Button>
            <Button
                disabled={isDeletingEntry}
                hoverVariant="destructive"
                onClick={handleDelete}
                size="icon-sm"
                variant="ghost"
            >
                <Trash2 className="size-3" />
            </Button>
        </div>
    )
}

interface IMutualFundEntryRowContextProps
    extends IMutualFundEntryTableActionComponentProp {
    children?: ReactNode
    readOnly?: boolean
    onDeleteSuccess?: () => void
}

export const MutualFundEntryRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IMutualFundEntryRowContextProps) => {
    const { isDeletingEntry, handleEdit, handleView, handleDelete } =
        useMutualFundEntryActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                canSelect={false}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingEntry,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <ContextMenuItem onClick={handleView}>
                            <Eye className="mr-2 size-4" />
                            View Details
                        </ContextMenuItem>
                    </>
                }
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const MutualFundEntryTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IMutualFundEntry,
        MutualFundEntryActionType,
        MutualFundEntryActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <MutualFundEntryCreateUpdateFormModal
                    description="Update the mutual fund entry details."
                    formProps={{
                        mutualFundEntryId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Edit Mutual Fund Entry"
                />
            )}
            {state.action === 'view' && state.id && (
                <MutualFundEntryCreateUpdateFormModal
                    description="View the mutual fund entry details."
                    formProps={{
                        mutualFundEntryId: state.id,
                        defaultValues: state.defaultValues,
                        readOnly: true,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="View Mutual Fund Entry"
                />
            )}
        </>
    )
}

export default MutualFundEntryAction
