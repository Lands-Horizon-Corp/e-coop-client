import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteIncludeNegativeAccountsById } from '../../include-negative-accounts.service'
import { IIncludeNegativeAccounts } from '../../include-negative-accounts.types'
import { IncludeNegativeAccountCreateUpdateFormModal } from '../forms/include-negative-account-create-update-form'
import { IIncludeNegativeAccountTableActionComponentProp } from './columns'

// ===== SHARED HOOK =====
interface UseIncludeNegativeAccountActionsProps {
    row: Row<IIncludeNegativeAccounts>
    onDeleteSuccess?: () => void
}

const useIncludeNegativeAccountActions = ({
    row,
    onDeleteSuccess,
}: UseIncludeNegativeAccountActionsProps) => {
    const updateModal = useModalState()
    const item = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteItem } =
        useDeleteIncludeNegativeAccountsById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted record',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Record',
            description: 'Are you sure you want to delete this record?',
            onConfirm: () => deleteItem(item.id),
        })
    }

    return {
        item,
        updateModal,
        isDeleting,
        handleEdit,
        handleDelete,
    }
}

interface IncludeNegativeAccountActionProps
    extends IIncludeNegativeAccountTableActionComponentProp {
    onDeleteSuccess?: () => void
}

const IncludeNegativeAccountAction = ({
    row,
    onDeleteSuccess,
}: IncludeNegativeAccountActionProps) => {
    const { item, updateModal, isDeleting, handleEdit, handleDelete } =
        useIncludeNegativeAccountActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <IncludeNegativeAccountCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        includeNegativeAccountId: item.id,
                        defaultValues: item,
                    }}
                />
            </div>

            <RowActionsGroup
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: handleDelete,
                }}
            />
        </>
    )
}

interface IncludeNegativeAccountRowContextProps
    extends IIncludeNegativeAccountTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const IncludeNegativeAccountRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IncludeNegativeAccountRowContextProps) => {
    const { item, updateModal, isDeleting, handleEdit, handleDelete } =
        useIncludeNegativeAccountActions({ row, onDeleteSuccess })

    return (
        <>
            <IncludeNegativeAccountCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    includeNegativeAccountId: item.id,
                    defaultValues: { ...item },
                }}
            />

            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeleting,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default IncludeNegativeAccountAction
