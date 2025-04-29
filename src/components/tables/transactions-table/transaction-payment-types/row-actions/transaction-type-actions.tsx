import { useState } from 'react'
import RowActionsGroup from '@/components/data-table/data-table-row-actions'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { ITransactionPaymentTypesTableActionComponentProp } from '../columns'
import { useDeleteTransactionType } from '@/hooks/api-hooks/transactions/use-transaction-payment-types'
import { TransactionPaymentTypesCreateUpdateFormModal } from '@/components/forms/transactions-forms/transaction-payment-types-create-update-form'

interface ITransactionPaymentTypesTableOwnerActionProps
    extends ITransactionPaymentTypesTableActionComponentProp {
    onTransactionTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const TransactionPaymentTypesTableOwnerAction = ({
    row,
    onDeleteSuccess,
}: ITransactionPaymentTypesTableOwnerActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const transactionType = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingTransactionType,
        mutate: deleteTransactionType,
    } = useDeleteTransactionType({
        onSuccess: onDeleteSuccess,
    })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <TransactionPaymentTypesCreateUpdateFormModal
                    formProps={{
                        transactionTypeId: transactionType.id,
                        defaultValues: {
                            ...transactionType,
                        },
                    }}
                    title="Update Transaction Type"
                    description="Modify/Update transaction type details."
                    open={updateModalForm}
                    onOpenChange={setUpdateModalForm}
                />
            </div>
            <RowActionsGroup
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingTransactionType,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Transaction Type',
                            description:
                                'Are you sure you want to delete this Transaction Type?',
                            onConfirm: () =>
                                deleteTransactionType(transactionType.id),
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

export default TransactionPaymentTypesTableOwnerAction
