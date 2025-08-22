import { ReactNode } from 'react'

import { toast } from 'sonner'

import {
    AccountClassificationFormModal,
    IAccountClassification,
    useDeleteById,
} from '@/modules/account-classification'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { IAccountClassificationTableActionComponentProp } from './column'

interface UseAccountClassificationActionsProps {
    row: Row<IAccountClassification>
    onDeleteSuccess?: () => void
}

const useAccountClassificationActions = ({
    row,
    onDeleteSuccess,
}: UseAccountClassificationActionsProps) => {
    const updateModal = useModalState()
    const accountClassification = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        mutate: deleteAccountClassification,
        isPending: isDeletingAccountClassification,
    } = useDeleteById({ options: { onSuccess: onDeleteSuccess } })

    const handleEdit = () => updateModal.onOpenChange(true)

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
        updateModal,
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
    const {
        accountClassification,
        updateModal,
        isDeletingAccountClassification,
        handleEdit,
        handleDelete,
    } = useAccountClassificationActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <AccountClassificationFormModal
                    {...updateModal}
                    className="!max-w-2xl"
                    title="Edit Account Classification"
                    description="Update details for this account classification."
                    titleClassName="font-bold"
                    formProps={{
                        accountClassificationId: accountClassification.id,
                        defaultValues: { ...accountClassification },
                        onSuccess: () => {
                            toast.success(
                                'Account classification updated successfully'
                            )
                            updateModal.onOpenChange(false)
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
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
                otherActions={<>{/* Additional actions can be added here */}</>}
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
    const {
        accountClassification,
        updateModal,
        isDeletingAccountClassification,
        handleEdit,
        handleDelete,
    } = useAccountClassificationActions({ row, onDeleteSuccess })

    return (
        <>
            <AccountClassificationFormModal
                {...updateModal}
                className="!max-w-2xl"
                title="Edit Account Classification"
                description="Update details for this account classification."
                titleClassName="font-bold"
                formProps={{
                    accountClassificationId: accountClassification.id,
                    defaultValues: { ...accountClassification },
                    onSuccess: () => {
                        toast.success(
                            'Account classification updated successfully'
                        )
                        updateModal.onOpenChange(false)
                    },
                }}
            />
            <DataTableRowContext
                row={row}
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
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default AccountClassificationAction
