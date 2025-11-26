import { ReactNode } from 'react'

import {
    AccountClassificationFormModal,
    IAccountClassification,
    useDeleteById,
} from '@/modules/account-classification'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { IAccountClassificationTableActionComponentProp } from './column'

export type AccountClassificationActionType = 'edit' | 'delete'

export interface AccountClassificationActionExtra {
    onDeleteSuccess?: () => void
}

interface UseAccountClassificationActionsProps {
    row: Row<IAccountClassification>
    onDeleteSuccess?: () => void
}

const useAccountClassificationActions = ({
    row,
    onDeleteSuccess,
}: UseAccountClassificationActionsProps) => {
    const accountClassification = row.original
    const { open } = useTableRowActionStore<
        IAccountClassification,
        AccountClassificationActionType,
        AccountClassificationActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const {
        mutate: deleteAccountClassification,
        isPending: isDeletingAccountClassification,
    } = useDeleteById({ options: { onSuccess: onDeleteSuccess } })

    const handleEdit = () => {
        open('edit', {
            id: accountClassification.id,
            defaultValues: accountClassification,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Account Classification',
            description:
                'Are you sure you want to delete this Account Classification?',
            onConfirm: () =>
                deleteAccountClassification(accountClassification.id),
        })
    }

    return {
        accountClassification,
        isDeletingAccountClassification,
        handleEdit,
        handleDelete,
    }
}

interface IAccountClassificationActionProps
    extends IAccountClassificationTableActionComponentProp {
    onAccountClassificationUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const AccountClassificationAction = ({
    row,
    onDeleteSuccess,
}: IAccountClassificationActionProps) => {
    const { isDeletingAccountClassification, handleEdit, handleDelete } =
        useAccountClassificationActions({ row, onDeleteSuccess })

    return (
        <>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAccountClassification,
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

interface IAccountClassificationRowContextProps
    extends IAccountClassificationTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const AccountClassificationRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IAccountClassificationRowContextProps) => {
    const { isDeletingAccountClassification, handleEdit, handleDelete } =
        useAccountClassificationActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAccountClassification,
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

export const AccountClassificationTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IAccountClassification,
        AccountClassificationActionType,
        AccountClassificationActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <AccountClassificationFormModal
                    className="!max-w-2xl"
                    description="Update details for this account classification."
                    formProps={{
                        accountClassificationId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Edit Account Classification"
                    titleClassName="font-bold"
                />
            )}
        </>
    )
}

export default AccountClassificationAction
