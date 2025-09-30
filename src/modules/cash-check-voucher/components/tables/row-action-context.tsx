import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { ICashCheckVoucher, useDeleteCashCheckVoucherById } from '../..'
import CashCheckVoucherCreateUpdateFormModal from '../forms/cash-check-voucher-create-udate-form-modal'
import { ICashCheckVoucherTableActionComponentProp } from './columns'

interface UseCashCheckVoucherActionsProps {
    row: Row<ICashCheckVoucher>
    onDeleteSuccess?: () => void
}

const useCashCheckVoucherActions = ({
    row,
    onDeleteSuccess,
}: UseCashCheckVoucherActionsProps) => {
    const updateModal = useModalState()
    const cashCheckVoucher = row.original
    const { onOpen } = useConfirmModalStore()
    const {
        isPending: isDeletingCashCheckVoucher,
        mutate: deleteCashCheckVoucher,
    } = useDeleteCashCheckVoucherById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Deleted cash check voucher',
                onSuccess: onDeleteSuccess,
            }),
        },
    })

    const handleEdit = () => {
        updateModal.onOpenChange(true)
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Journal Voucher',
            description:
                'Are you sure you want to delete this cash check voucher?',
            onConfirm: () => deleteCashCheckVoucher(cashCheckVoucher.id),
        })
    }

    return {
        cashCheckVoucher,
        updateModal,
        isDeletingCashCheckVoucher,
        handleEdit,
        handleDelete,
    }
}

interface ICashCheckVoucherRowContextProps
    extends ICashCheckVoucherTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CashCheckJournalVoucherAction = ({
    row,
    onDeleteSuccess,
}: ICashCheckVoucherRowContextProps) => {
    const {
        cashCheckVoucher,
        updateModal,
        isDeletingCashCheckVoucher,
        handleEdit,
        handleDelete,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <CashCheckVoucherCreateUpdateFormModal
                    {...updateModal}
                    className="!min-w-[1200px]"
                    formProps={{
                        cashCheckVoucherId: cashCheckVoucher.id,
                        defaultValues: { ...cashCheckVoucher },
                    }}
                />
            </div>
            <RowActionsGroup
                // canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCashCheckVoucher,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                // otherActions={<JournalVoucherOtherAction row={row} />}
            />
        </>
    )
}

export const CashCheckVoucherRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ICashCheckVoucherRowContextProps) => {
    const {
        cashCheckVoucher,
        updateModal,
        isDeletingCashCheckVoucher,
        handleEdit,
        handleDelete,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <CashCheckVoucherCreateUpdateFormModal
                {...updateModal}
                className="!min-w-[1200px]"
                formProps={{
                    cashCheckVoucherId: cashCheckVoucher.id,
                    defaultValues: { ...cashCheckVoucher },
                }}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingCashCheckVoucher,
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

// Default export for backward compatibility
export default CashCheckJournalVoucherAction
