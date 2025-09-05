import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import {
    IBrowseExcludeIncludeAccounts,
    useDeleteBrowseExcludeIncludeAccountsById,
} from '../..'
import { BrowseExcludeIncludeAccountsCreateUpdateFormModal } from '../forms/browse-exclude-include-account-create-update-form'
import { IBrowseExcludeIncludeAccountTableActionComponentProp } from './columns'

interface UseBrowseExcludeIncludeAccountActionsProps {
    row: Row<IBrowseExcludeIncludeAccounts>
    onDeleteSuccess?: () => void
}

const useBrowseExcludeIncludeAccountActions = ({
    row,
    onDeleteSuccess,
}: UseBrowseExcludeIncludeAccountActionsProps) => {
    const editModal = useModalState()
    const item = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeleting, mutate: deleteItem } =
        useDeleteBrowseExcludeIncludeAccountsById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted record',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => editModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Record',
            description: 'Are you sure you want to delete this record?',
            onConfirm: () => deleteItem(item.id),
        })
    }

    return {
        item,
        editModal,
        isDeleting,
        handleEdit,
        handleDelete,
    }
}

interface ActionProps
    extends IBrowseExcludeIncludeAccountTableActionComponentProp {
    onDeleteSuccess?: () => void
}

const BrowseExcludeIncludeAccountAction = ({
    row,
    onDeleteSuccess,
}: ActionProps) => {
    const { item, editModal, isDeleting, handleEdit, handleDelete } =
        useBrowseExcludeIncludeAccountActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <BrowseExcludeIncludeAccountsCreateUpdateFormModal
                    {...editModal}
                    formProps={{
                        browseExcludeIncludeAccountId: item.id,
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

interface RowContextProps
    extends IBrowseExcludeIncludeAccountTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const BrowseExcludeIncludeAccountRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: RowContextProps) => {
    const { item, editModal, isDeleting, handleEdit, handleDelete } =
        useBrowseExcludeIncludeAccountActions({ row, onDeleteSuccess })

    return (
        <>
            <BrowseExcludeIncludeAccountsCreateUpdateFormModal
                {...editModal}
                formProps={{
                    browseExcludeIncludeAccountId: item.id,
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

export default BrowseExcludeIncludeAccountAction
