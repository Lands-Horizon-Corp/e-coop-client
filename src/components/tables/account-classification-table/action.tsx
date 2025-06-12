import { useState } from 'react'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { IAccountClassificationTableActionComponentProp } from './column'
import { AccountClassificationFormModal } from '@/components/forms/account-classification-forms/account-classification-create-update-form'
import { useDeleteAccountClassification } from '@/hooks/api-hooks/use-account-classification'

interface IAccountClassificationActionProps
    extends IAccountClassificationTableActionComponentProp {
    onAccountClassificationUpdate?: () => void
    onDeleteSuccess?: () => void
}

const AccountClassificationAction = ({
    row,
    onDeleteSuccess,
}: IAccountClassificationActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)

    const accountClassification = row.original
    const { onOpen } = useConfirmModalStore()

    const {
        mutate: deleteAccountClassification,
        isPending: isDeletingAccountClassification,
    } = useDeleteAccountClassification({ onSuccess: onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <AccountClassificationFormModal
                    className="!max-w-2xl"
                    onOpenChange={setUpdateModalForm}
                    open={updateModalForm}
                    title="Edit Account Classification"
                    description="Update details for this account classification."
                    titleClassName="font-bold"
                    formProps={{
                        accountClassificationId: accountClassification.id,
                        defaultValues: {
                            ...accountClassification,
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
                    isAllowed: !isDeletingAccountClassification,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Account Classification',
                            description:
                                'Are you sure you want to delete this Account Classification?',
                            onConfirm: () =>
                                deleteAccountClassification(
                                    accountClassification.id
                                ),
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

export default AccountClassificationAction
