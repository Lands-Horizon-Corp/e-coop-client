import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { AccountCategoryFormModal } from '@/components/forms/account-category-forms/account-category-create-update-form'

import { useDeleteAccountCategory } from '@/hooks/api-hooks/use-account-category'
import { useModalState } from '@/hooks/use-modal-state'

import { IAccountCategory } from '@/types'

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
    } = useDeleteAccountCategory({ onSuccess: onDeleteSuccess })

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
                    className="!max-w-2xl"
                    organizationId={accountCategory.organization_id}
                    branchId={accountCategory.branch_id}
                    title="Edit Account Category"
                    description="Update details for this account category."
                    titleClassName="font-bold"
                    formProps={{
                        accountCategoryId: accountCategory.id,
                        defaultValues: { ...accountCategory },
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
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
                className="!max-w-2xl"
                organizationId={accountCategory.organization_id}
                branchId={accountCategory.branch_id}
                title="Edit Account Category"
                description="Update details for this account category."
                titleClassName="font-bold"
                formProps={{
                    accountCategoryId: accountCategory.id,
                    defaultValues: { ...accountCategory },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
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
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default AccountCategoryAction
