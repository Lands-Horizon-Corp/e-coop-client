import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteAdjustmentEntryById } from '../..'
import { IAdjustmentEntry } from '../../adjustment-entry.types'
import { IAdjustmentEntryTableActionComponentProp } from './columns'

export type AdjustmentEntryActionType = 'edit' | 'delete'

export interface AdjustmentEntryActionExtra {
    onDeleteSuccess?: () => void
}

interface UseAdjustmentEntryActionsProps {
    row: Row<IAdjustmentEntry>
    onDeleteSuccess?: () => void
}

const useAdjustmentEntryActions = ({
    row,
    onDeleteSuccess,
}: UseAdjustmentEntryActionsProps) => {
    const adjustmentEntry = row.original
    const { open } = useTableRowActionStore<
        IAdjustmentEntry,
        AdjustmentEntryActionType,
        AdjustmentEntryActionExtra
    >()
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

    const handleEdit = () => {
        open('edit', {
            id: adjustmentEntry.id,
            defaultValues: adjustmentEntry,
            extra: { onDeleteSuccess },
        })
    }

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

export const AdjustmentEntryTableActionManager = () => {
    const { state } = useTableRowActionStore<
        IAdjustmentEntry,
        AdjustmentEntryActionType,
        AdjustmentEntryActionExtra
    >()

    return <>{state.action === 'edit' && state.defaultValues && <></>}</>
}
