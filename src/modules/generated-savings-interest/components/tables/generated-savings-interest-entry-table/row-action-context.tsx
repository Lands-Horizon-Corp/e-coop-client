import { ReactNode } from 'react'

import { IGeneratedSavingsInterestEntry } from '@/modules/generated-savings-interest-entry'
import { GeneratedSavingsInterestEntryCreateUpdateFormModal } from '@/modules/generated-savings-interest-entry/components/forms/generated-savings-interest-entry-create-update-form'
import { useDeleteGeneratedSavingsInterestEntryById } from '@/modules/generated-savings-interest-entry/generated-savings-interest-entry.service'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { IGeneratedSavingsInterestEntryTableActionComponentProp } from './index'

export type GeneratedSavingsInterestEntryActionType = 'edit' | 'delete'

export interface GeneratedSavingsInterestEntryActionExtra {
    onDeleteSuccess?: () => void
}

interface UseGeneratedSavingsInterestEntryActionsProps {
    row: Row<IGeneratedSavingsInterestEntry>
    onDeleteSuccess?: () => void
}

const useGeneratedSavingsInterestEntryActions = ({
    row,
    onDeleteSuccess,
}: UseGeneratedSavingsInterestEntryActionsProps) => {
    const entry = row.original
    const { open } = useTableRowActionStore<
        IGeneratedSavingsInterestEntry,
        GeneratedSavingsInterestEntryActionType,
        GeneratedSavingsInterestEntryActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingEntry, mutate: deleteEntry } =
        useDeleteGeneratedSavingsInterestEntryById({
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

    const handleDelete = () => {
        onOpen({
            title: 'Delete Savings Interest Entry',
            description:
                'Are you sure you want to delete this savings interest entry?',
            onConfirm: () => deleteEntry(entry.id),
        })
    }

    return {
        entry,
        isDeletingEntry,
        handleEdit,
        handleDelete,
    }
}

interface IGeneratedSavingsInterestEntryTableActionProps
    extends IGeneratedSavingsInterestEntryTableActionComponentProp {
    onDeleteSuccess?: () => void
}

export const GeneratedSavingsInterestEntryAction = ({
    row,
    onDeleteSuccess,
}: IGeneratedSavingsInterestEntryTableActionProps) => {
    const { isDeletingEntry, handleEdit, handleDelete } =
        useGeneratedSavingsInterestEntryActions({ row, onDeleteSuccess })

    return (
        <>
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
                otherActions={<></>}
                row={row}
            />
        </>
    )
}

interface IGeneratedSavingsInterestEntryRowContextProps
    extends IGeneratedSavingsInterestEntryTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const GeneratedSavingsInterestEntryRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IGeneratedSavingsInterestEntryRowContextProps) => {
    const { isDeletingEntry, handleEdit, handleDelete } =
        useGeneratedSavingsInterestEntryActions({ row, onDeleteSuccess })

    return (
        <>
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

export const GeneratedSavingsInterestEntryTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IGeneratedSavingsInterestEntry,
        GeneratedSavingsInterestEntryActionType,
        GeneratedSavingsInterestEntryActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <GeneratedSavingsInterestEntryCreateUpdateFormModal
                    description="Update the savings interest entry details."
                    formProps={{
                        generatedSavingsInterestEntryId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Edit Savings Interest Entry"
                />
            )}
        </>
    )
}

export default GeneratedSavingsInterestEntryAction
