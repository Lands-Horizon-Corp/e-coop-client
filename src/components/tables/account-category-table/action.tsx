import { useState } from 'react'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { IAccountCategoryTableActionComponentProp } from './column'
import { AccountCategoryFormModal } from '@/components/forms/account-category-forms/account-category-create-update-form'
import { useDeleteAccountCategory } from '@/hooks/api-hooks/use-account-category'

interface IAccountCategoryActionProps
    extends IAccountCategoryTableActionComponentProp {
    onAccountCategoryUpdate?: () => void
    onDeleteSuccess?: () => void
}

const AccountCategoryAction = ({
    row,
    onDeleteSuccess,
}: IAccountCategoryActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)

    const accountCategory = row.original
    const organizationId = accountCategory.organization_id
    const branchId = accountCategory.branch_id

    const { onOpen } = useConfirmModalStore()

    const {
        mutate: deleteAccountCategory,
        isPending: isDeletingAccountCategory,
    } = useDeleteAccountCategory({ onSuccess: onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <AccountCategoryFormModal
                    className="!max-w-2xl"
                    organizationId={organizationId}
                    branchId={branchId}
                    onOpenChange={setUpdateModalForm}
                    open={updateModalForm}
                    title="Edit Account Category"
                    description="Update details for this account category."
                    titleClassName="font-bold"
                    formProps={{
                        accountCategoryId: accountCategory.id,
                        defaultValues: {
                            ...accountCategory,
                        },
                        onSuccess: () => {
                            setUpdateModalForm(false)
                        },
                    }}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAccountCategory,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Account Category',
                            description:
                                'Are you sure you want to delete this Account Category?',
                            onConfirm: () =>
                                deleteAccountCategory(accountCategory.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={<>{/* Additional actions can be added here */}</>}
            />
        </>
    )
}

export default AccountCategoryAction
