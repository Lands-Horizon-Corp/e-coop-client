import { ReactNode } from 'react'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { IBank, useDeleteBankById } from '../..'
import { BankCreateUpdateFormModal } from '../forms/bank-create-update-form'
import { IBankTableActionComponentProp } from './columns'

export type BankActionType = 'edit'

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
                onSuccess: onDeleteSuccess,
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
    onDeleteSuccess?: () => void
}

export const BankAction = ({ row, onDeleteSuccess }: IBankTableActionProps) => {
    const { bank, isDeletingBank, handleEdit, handleDelete } = useBankActions({
        row,
        onDeleteSuccess,
    })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingBank &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'Bank',
                        resource: bank,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'Bank',
                    resource: bank,
                }),
                onClick: handleEdit,
            }}
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
    const { bank, isDeletingBank, handleEdit, handleDelete } = useBankActions({
        row,
        onDeleteSuccess,
    })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingBank &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'Bank',
                        resource: bank,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'Bank',
                    resource: bank,
                }),
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
                        onSuccess: close,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default BankAction
