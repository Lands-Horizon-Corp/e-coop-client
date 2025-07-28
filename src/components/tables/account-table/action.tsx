import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { AccountCreateUpdateFormModal } from '@/components/forms/accounting-forms/account-create-update-form'

import { useDeleteAccount } from '@/hooks/api-hooks/use-account'

import { IAccountsTableActionComponentProp } from './columns'

interface IMemberTypeTableActionProps
    extends IAccountsTableActionComponentProp {
    onMemberTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const AccountTableAction = ({
    row,
    onDeleteSuccess,
}: IMemberTypeTableActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const account = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingAccount, mutate: deleteAccout } =
        useDeleteAccount({
            onSuccess: onDeleteSuccess,
        })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <AccountCreateUpdateFormModal
                    formProps={{
                        accountId: account.id,
                        defaultValues: account,
                    }}
                    title="Update Account"
                    description="Modify/Update account..."
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingAccount,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Account',
                            description: 'Are you sure to delete this Account?',
                            onConfirm: () => deleteAccout(account.id),
                        })
                    },
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: () => setUpdateModalForm(true),
                }}
                otherActions={<></>}
            />
        </>
    )
}

export default AccountTableAction
