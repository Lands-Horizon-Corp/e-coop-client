import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { IBank, useDeleteBankById } from '../..'
import { BankCreateUpdateFormModal } from '../forms/bank-create-update-form'
import { IBankTableActionComponentProp } from './columns'

// ===== TYPE DEFINITIONS =====
export type BankActionType = 'edit' | 'delete'

export interface BankActionExtra {
    onDeleteSuccess?: () => void
}

interface UseBankActionsProps {
    row: Row<IBank>
    onDeleteSuccess?: () => void
}

const useBankActions = ({ row, onDeleteSuccess }: UseBankActionsProps) => {
    const bank = row.original
    const { open } = useTableRowActionStore<
        IBank,
        BankActionType,
        BankActionExtra
    >()
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

    const handleEdit = () => {
        open('edit', {
            id: bank.id,
            defaultValues: bank,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Bank',
            description: 'Are you sure you want to delete this bank?',
            onConfirm: () => deleteBank(bank.id),
        })
    }

    return {
        bank,
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
    const { isDeletingBank, handleEdit, handleDelete } = useBankActions({
        row,
        onDeleteSuccess,
    })

    return (
        <RowActionsGroup
            canSelect
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
            row={row}
        />
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
    const { isDeletingBank, handleEdit, handleDelete } = useBankActions({
        row,
        onDeleteSuccess,
    })

    return (
        <DataTableRowContext
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
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const BankTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IBank,
        BankActionType,
        BankActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <BankCreateUpdateFormModal
                    formProps={{
                        bankId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

// Default export for backward compatibility
export default BankAction
