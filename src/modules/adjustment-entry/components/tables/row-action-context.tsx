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
import { AdjustmentEntryCreateUpdateFormModal } from '../forms/adjustment-entry-form-modal'
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
    const {
        adjustmentEntry,
        updateModal,
        isDeletingEntry,
        handleEdit,
        handleDelete,
    } = useAdjustmentEntryActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <AdjustmentEntryCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        autoSave: true,
                        adjustmentEntryId: adjustmentEntry.id,
                        defaultValues: {
                            ...adjustmentEntry,
                            entry_date: new Date(
                                adjustmentEntry.entry_date
                            ).toISOString(),
                        },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
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
                otherActions={<>{/* Additional actions can be added here */}</>}
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
    const {
        adjustmentEntry,
        updateModal,
        isDeletingEntry,
        handleEdit,
        handleDelete,
    } = useAdjustmentEntryActions({ row, onDeleteSuccess })

    return (
        <>
            {/* Modal setup */}
            <AdjustmentEntryCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    adjustmentEntryId: adjustmentEntry.id,
                    defaultValues: {
                        ...adjustmentEntry,
                        entry_date: new Date(
                            adjustmentEntry.entry_date
                        ).toISOString(),
                    },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />

            <DataTableRowContext
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
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}
