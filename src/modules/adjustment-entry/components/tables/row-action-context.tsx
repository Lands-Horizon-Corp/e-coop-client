// src/modules/adjustment-entry/components/AdjustmentEntryActions.tsx
import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteAdjustmentEntryById } from '../..'
import { IAdjustmentEntry } from '../../adjustment-entry.types'
import { IAdjustmentEntryTableActionComponentProp } from './columns'

interface UseAdjustmentEntryActionsProps {
    row: Row<IAdjustmentEntry>
    onDeleteSuccess?: () => void
}

const useAdjustmentEntryActions = ({
    row,
    onDeleteSuccess,
}: UseAdjustmentEntryActionsProps) => {
    const updateModal = useModalState()
    const adjustmentEntry = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingEntry, mutate: deleteEntry } =
        useDeleteAdjustmentEntryById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted adjustment entry',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Adjustment Entry',
            description:
                'Are you sure you want to delete this adjustment entry?',
            onConfirm: () => deleteEntry(adjustmentEntry.id),
        })
    }

    return {
        adjustmentEntry,
        updateModal,
        isDeletingEntry,
        handleEdit,
        handleDelete,
    }
}

interface IAdjustmentEntryTableActionProps
    extends IAdjustmentEntryTableActionComponentProp {
    onEntryUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const AdjustmentEntryAction = ({
    row,
    onDeleteSuccess,
}: IAdjustmentEntryTableActionProps) => {
    const { isDeletingEntry, handleDelete } = useAdjustmentEntryActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingEntry,
                    onClick: handleDelete,
                }}
                row={row}
            />
        </>
    )
}

interface IAdjustmentEntryRowContextProps
    extends IAdjustmentEntryTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const AdjustmentEntryRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IAdjustmentEntryRowContextProps) => {
    const { isDeletingEntry, handleDelete } = useAdjustmentEntryActions({
        row,
        onDeleteSuccess,
    })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingEntry,
                    onClick: handleDelete,
                }}
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}
