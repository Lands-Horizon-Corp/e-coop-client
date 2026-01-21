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
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { IPaymentTypeTableActionComponentProp } from './column'

export type PaymentTypeActionType = 'edit' | 'delete'

export type PaymentTypeActionExtra = Record<string, never>

interface UsePaymentTypeActionsProps {
    row: Row<IPaymentType>
    onDeleteSuccess?: () => void
}

const usePaymentTypeActions = ({
    row,
    onDeleteSuccess,
}: UsePaymentTypeActionsProps) => {
    const paymentType = row.original
    const { open } = useTableRowActionStore<
        IPaymentType,
        PaymentTypeActionType,
        PaymentTypeActionExtra
    >()

    const { onOpen } = useConfirmModalStore()

    const { mutate: deletePaymentType, isPending: isDeletingPaymentType } =
        useDeleteById({ options: { onSuccess: onDeleteSuccess } })

    const handleEdit = () => {
        open('edit', {
            id: paymentType.id,
            defaultValues: paymentType,
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Payment Type',
            description: 'Are you sure you want to delete this Payment Type?',
            onConfirm: () => deletePaymentType(paymentType.id),
        })
    }

    return {
        paymentType,
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
    const { isDeletingPaymentType, handleEdit, handleDelete } =
        usePaymentTypeActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
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
                row={row}
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
    const { isDeletingPaymentType, handleEdit, handleDelete } =
        usePaymentTypeActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
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
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export const PaymentTypeTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IPaymentType,
        PaymentTypeActionType,
        PaymentTypeActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const paymentType = state.defaultValues

    return (
        <>
            {state.action === 'edit' && (
                <PaymentTypeCreateUpdateFormModal
                    description="Update details for this payment type."
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
                            close()
                        },
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                    title="Edit Payment Type"
                    titleClassName="font-bold"
                />
            )}
        </>
    )
}

export default PaymentTypeActions
