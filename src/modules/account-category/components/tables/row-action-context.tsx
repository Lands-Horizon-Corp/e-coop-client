import { ReactNode } from 'react'

import {
    AccountCategoryFormModal,
    IAccountCategory,
    useDeleteById,
} from '@/modules/account-category'
import {
    getCrudPermissionFromAuthStore,
    hasPermissionFromAuth,
} from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { IAccountCategoryTableActionComponentProp } from './column'

export type AccountCategoryActionType = 'edit' | 'delete'

export interface AccountCategoryActionExtra {
    onDeleteSuccess?: () => void
}

interface UseAccountCategoryActionsProps {
    row: Row<IAccountCategory>
    onDeleteSuccess?: () => void
}

const useAccountCategoryActions = ({
    row,
    onDeleteSuccess,
}: UseAccountCategoryActionsProps) => {
    const accountCategory = row.original
    const { open } = useTableRowActionStore<
        IAccountCategory,
        AccountCategoryActionType,
        AccountCategoryActionExtra
    >()
    const { onOpen } = useConfirmModalStore()

    const accountCategoryCrudPerms = getCrudPermissionFromAuthStore({
        resourceType: 'AccountCategory',
        resource: accountCategory,
    })

    const {
        mutate: deleteAccountCategory,
        isPending: isDeletingAccountCategory,
    } = useDeleteById({ options: { onSuccess: onDeleteSuccess } })

    const handleEdit = () => {
        open('edit', {
            id: accountCategory.id,
            defaultValues: accountCategory,
            extra: { onDeleteSuccess },
        })
    }

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
        accountCategoryCrudPerms,
        isDeletingAccountCategory,
        handleEdit,
        handleDelete,
    }
}

interface IAccountCategoryActionProps extends IAccountCategoryTableActionComponentProp {
    onAccountCategoryUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const AccountCategoryAction = ({
    row,
    onDeleteSuccess,
}: IAccountCategoryActionProps) => {
    const {
        accountCategory,
        isDeletingAccountCategory,
        handleEdit,
        handleDelete,
    } = useAccountCategoryActions({ row, onDeleteSuccess })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingAccountCategory &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'AccountCategory',
                        resource: accountCategory,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'AccountCategory',
                    resource: accountCategory,
                }),
                onClick: handleEdit,
            }}
            otherActions={<></>}
            row={row}
        />
    )
}

interface IAccountCategoryRowContextProps extends IAccountCategoryTableActionComponentProp {
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
        isDeletingAccountCategory,
        handleEdit,
        handleDelete,
    } = useAccountCategoryActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingAccountCategory &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'AccountCategory',
                        resource: accountCategory,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'AccountCategory',
                    resource: accountCategory,
                }),
                onClick: handleEdit,
            }}
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const AccountCategoryTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IAccountCategory,
        AccountCategoryActionType,
        AccountCategoryActionExtra
    >()

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <AccountCategoryFormModal
                    branchId={state.defaultValues.branch_id}
                    className="!max-w-2xl"
                    description="Update details for this account category."
                    formProps={{
                        accountCategoryId: state.id,
                        defaultValues: state.defaultValues,
                        onSuccess: () => close(),
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    organizationId={state.defaultValues.organization_id}
                    title="Edit Account Category"
                    titleClassName="font-bold"
                />
            )}
        </>
    )
}

export default AccountCategoryAction
