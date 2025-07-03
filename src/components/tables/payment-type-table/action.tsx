import { useState } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import { PaymentTypeFormModal } from '@/components/forms/payment-type-forms/payment-type-create-update-form'

import { useDeletePaymentType } from '@/hooks/api-hooks/use-payment-type'

import { IPaymentTypeTableActionComponentProp } from './column'

interface IPaymentTypeActionProps extends IPaymentTypeTableActionComponentProp {
    onPaymentTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

const PaymentTypeAction = ({
    row,
    onDeleteSuccess,
}: IPaymentTypeActionProps) => {
    const [updateModalForm, setUpdateModalForm] = useState(false)
    const { onOpen } = useConfirmModalStore()

    const paymentType = row.original

    const { mutate: deletePaymentType, isPending: isDeletingPaymentType } =
        useDeletePaymentType({ onSuccess: onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <PaymentTypeFormModal
                    className="!max-w-2xl"
                    onOpenChange={setUpdateModalForm}
                    open={updateModalForm}
                    title="Edit Payment Type"
                    description="Update details for this payment type."
                    titleClassName="font-bold"
                    formProps={{
                        paymentTypeId: paymentType.id,
                        defaultValues: {
                            name: paymentType.name,
                            description: paymentType.description,
                            number_of_days: paymentType.number_of_days,
                            type: paymentType.type,
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
                    isAllowed: !isDeletingPaymentType,
                    onClick: () => {
                        onOpen({
                            title: 'Delete Payment Type',
                            description:
                                'Are you sure you want to delete this Payment Type?',
                            onConfirm: () => deletePaymentType(paymentType.id),
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

export default PaymentTypeAction
