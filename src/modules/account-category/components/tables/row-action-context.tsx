import { ReactNode } from 'react'

import { toast } from 'sonner'

import {
    AccountCategoryFormModal,
    IAccountCategory,
    useDeleteById,
} from '@/modules/account-category'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { IAccountCategoryTableActionComponentProp } from './column'

interface UseAccountCategoryActionsProps {
    row: Row<IAccountCategory>
    onDeleteSuccess?: () => void
}

const useAccountCategoryActions = ({
    row,
    onDeleteSuccess,
}: UseAccountCategoryActionsProps) => {
    const updateModal = useModalState()
    const accountCategory = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        mutate: deleteAccountCategory,
        isPending: isDeletingAccountCategory,
    } = useDeleteById({ options: { onSuccess: onDeleteSuccess } })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Account Category',
            description:
                'Are you sure you want to delete this Account Category?',
            onConfirm: () => deleteAccountCategory(accountCategory.id),
        })
    }

    return {
        accountCategory,
        updateModal,
        isDeletingAccountCategory,
        handleEdit,
        handleDelete,
    }
}

interface IAccountCategoryActionProps
    extends IAccountCategoryTableActionComponentProp {
    onAccountCategoryUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const AccountCategoryAction = ({
    row,
    onDeleteSuccess,
}: IAccountCategoryActionProps) => {
    const {
        accountCategory,
        updateModal,
        isDeletingAccountCategory,
        handleEdit,
        handleDelete,
    } = useAccountCategoryActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <AccountCategoryFormModal
                    {...updateModal}
                    branchId={accountCategory.branch_id}
                    className="!max-w-2xl"
                    description="Update details for this account category."
                    formProps={{
                        accountCategoryId: accountCategory.id,
                        defaultValues: { ...accountCategory },
                        onSuccess: () => {
                            toast.success(
                                'Account category updated successfully'
                            )
                            updateModal.onOpenChange(false)
                        },
                    }}
                    organizationId={accountCategory.organization_id}
                    title="Edit Account Category"
                    titleClassName="font-bold"
                />
            </div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAccountCategory,
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

interface IAccountCategoryRowContextProps
    extends IAccountCategoryTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const AccountCategoryRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IAccountCategoryRowContextProps) => {
    const {
        accountCategory,
        updateModal,
        isDeletingAccountCategory,
        handleEdit,
        handleDelete,
    } = useAccountCategoryActions({ row, onDeleteSuccess })

    return (
        <>
            <AccountCategoryFormModal
                {...updateModal}
                branchId={accountCategory.branch_id}
                className="!max-w-2xl"
                description="Update details for this account category."
                formProps={{
                    accountCategoryId: accountCategory.id,
                    defaultValues: { ...accountCategory },
                    onSuccess: () => {
                        toast.success('Account category updated successfully')
                        updateModal.onOpenChange(false)
                    },
                }}
                organizationId={accountCategory.organization_id}
                title="Edit Account Category"
                titleClassName="font-bold"
            />
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAccountCategory,
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

export default AccountCategoryAction
