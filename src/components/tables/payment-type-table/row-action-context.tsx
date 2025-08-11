import { ReactNode } from 'react'

import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { PaymentTypeFormModal } from '@/components/forms/payment-type-forms/payment-type-create-update-form'

import { useDeletePaymentType } from '@/hooks/api-hooks/use-payment-type'
import { useModalState } from '@/hooks/use-modal-state'

import { IPaymentType } from '@/types'

import { IPaymentTypeTableActionComponentProp } from './column'

interface UsePaymentTypeActionsProps {
    row: Row<IPaymentType>
    onDeleteSuccess?: () => void
}

const usePaymentTypeActions = ({
    row,
    onDeleteSuccess,
}: UsePaymentTypeActionsProps) => {
    const updateModal = useModalState()
    const paymentType = row.original

    const { onOpen } = useConfirmModalStore()

    const { mutate: deletePaymentType, isPending: isDeletingPaymentType } =
        useDeletePaymentType({ onSuccess: onDeleteSuccess })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Payment Type',
            description: 'Are you sure you want to delete this Payment Type?',
            onConfirm: () => deletePaymentType(paymentType.id),
        })
    }

    return {
        paymentType,
        updateModal,
        isDeletingPaymentType,
        handleEdit,
        handleDelete,
    }
}

interface IPaymentTypeTableActionProps
    extends IPaymentTypeTableActionComponentProp {
    onPaymentTypeUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const PaymentTypeAction = ({
    row,
    onDeleteSuccess,
}: IPaymentTypeTableActionProps) => {
    const {
        paymentType,
        updateModal,
        isDeletingPaymentType,
        handleEdit,
        handleDelete,
    } = usePaymentTypeActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <PaymentTypeFormModal
                    {...updateModal}
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
                        onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingPaymentType,
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

interface IPaymentTypeRowContextProps
    extends IPaymentTypeTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const PaymentTypeRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IPaymentTypeRowContextProps) => {
    const {
        paymentType,
        updateModal,
        isDeletingPaymentType,
        handleEdit,
        handleDelete,
    } = usePaymentTypeActions({ row, onDeleteSuccess })

    return (
        <>
            <PaymentTypeFormModal
                {...updateModal}
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
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingPaymentType,
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

export default PaymentTypeAction
