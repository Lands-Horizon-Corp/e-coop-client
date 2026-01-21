import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { useDeleteCancelledCashCheckVoucherById } from '../../cancelled-cash-check-voucher.service'
import { ICancelledCashCheckVoucher } from '../../cancelled-cash-check-voucher.types'
import { CancelledCashCheckVoucherCreateUpdateFormModal } from '../forms/cancelled-cash-check-voucher-form-modal'
import { ICancelledCashCheckVoucherTableActionComponentProp } from './columns'

interface UseVoucherActionsProps {
    row: Row<ICancelledCashCheckVoucher>
    onDeleteSuccess?: () => void
}

const useCancelledCashCheckVoucherActions = ({
    row,
    onDeleteSuccess,
}: UseVoucherActionsProps) => {
    const updateModal = useModalState()
    const voucher = row.original

    const { onOpen } = useConfirmModalStore()

    const { isPending: isDeletingVoucher, mutate: deleteVoucher } =
        useDeleteCancelledCashCheckVoucherById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted cancelled voucher',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Cancelled Voucher',
            description:
                'Are you sure you want to delete this cancelled cash check voucher?',
            onConfirm: () => deleteVoucher(voucher.id),
        })
    }

    return {
        voucher,
        updateModal,
        isDeletingVoucher,
        handleEdit,
        handleDelete,
    }
}

interface ICancelledCashCheckVoucherTableActionProps
    extends ICancelledCashCheckVoucherTableActionComponentProp {
    onVoucherUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const CancelledCashCheckVoucherAction = ({
    row,
    onDeleteSuccess,
}: ICancelledCashCheckVoucherTableActionProps) => {
    const {
        voucher,
        updateModal,
        isDeletingVoucher,
        handleEdit,
        handleDelete,
    } = useCancelledCashCheckVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <CancelledCashCheckVoucherCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        autoSave: true,
                        voucherId: voucher.id,
                        defaultValues: { ...voucher },
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingVoucher,
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

interface ICancelledCashCheckVoucherRowContextProps
    extends ICancelledCashCheckVoucherTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CancelledCashCheckVoucherRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ICancelledCashCheckVoucherRowContextProps) => {
    const {
        voucher,
        updateModal,
        isDeletingVoucher,
        handleEdit,
        handleDelete,
    } = useCancelledCashCheckVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <CancelledCashCheckVoucherCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    voucherId: voucher.id,
                    defaultValues: { ...voucher },
                    onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingVoucher,
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

export default CancelledCashCheckVoucherAction
