import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { IBank, useDeleteBankById } from '../..'
import { BankCreateUpdateFormModal } from '../forms/bank-create-update-form'
import { IBankTableActionComponentProp } from './columns'

// ===== SHARED HOOK =====
interface UseBankActionsProps {
    row: Row<IBank>
    onDeleteSuccess?: () => void
}

const useBankActions = ({ row, onDeleteSuccess }: UseBankActionsProps) => {
    const updateModal = useModalState()
    const bank = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingBank, mutate: deleteBank } = useDeleteBankById(
        {
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted bank',
                    onSuccess: onDeleteSuccess,
                }),
            },
        }
    )

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Bank',
            description: 'Are you sure you want to delete this bank?',
            onConfirm: () => deleteBank(bank.id),
        })
    }

    return {
        bank,
        updateModal,
        isDeletingBank,
        handleEdit,
        handleDelete,
    }
}

interface IBankTableActionProps extends IBankTableActionComponentProp {
    onBankUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const BankAction = ({ row, onDeleteSuccess }: IBankTableActionProps) => {
    const { bank, updateModal, isDeletingBank, handleEdit, handleDelete } =
        useBankActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <BankCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        bankId: bank.id,
                        defaultValues: { ...bank },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingBank,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

interface IBankRowContextProps extends IBankTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const BankRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IBankRowContextProps) => {
    const { bank, updateModal, isDeletingBank, handleEdit, handleDelete } =
        useBankActions({ row, onDeleteSuccess })

    return (
        <>
            <BankCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    bankId: bank.id,
                    defaultValues: { ...bank },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingBank,
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

// Default export for backward compatibility
export default BankAction
