import { ReactNode } from 'react'

import { toast } from 'sonner'

import {
    IPaymentType,
    PaymentTypeCreateUpdateFormModal,
    useDeleteById,
} from '@/modules/payment-type'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

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
        useDeleteById({ options: { onSuccess: onDeleteSuccess } })

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

export const PaymentTypeActions = ({
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
                <PaymentTypeCreateUpdateFormModal
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
                        onSuccess: () => {
                            toast.success('Payment type updated successfully')
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
            <PaymentTypeCreateUpdateFormModal
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

export default PaymentTypeActions
