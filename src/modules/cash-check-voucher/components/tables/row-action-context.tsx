import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { ICashCheckVoucher, useDeleteCashCheckVoucherById } from '../..'
import CashCheckEntryUpdateFormModal from '../forms/cash-check-entry-form-modal'
import CashCheckVoucherTransactionSignatureUpdateFormModal from '../forms/cash-check-signature-form-modal'
import CashCheckVoucherCreateUpdateFormModal from '../forms/cash-check-voucher-create-udate-form-modal'
import CashCheckVoucherOtherAction from './cash-check-other-voucher'
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
    const checkEntry = useModalState()
    const signatureModal = useModalState()
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
    const handleOpenCheckEntry = () => {
        checkEntry.onOpenChange(true)
    }
    const handleOpenSignature = () => {
        signatureModal.onOpenChange(true)
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
        checkEntry,
        handleOpenCheckEntry,
        signatureModal,
        handleOpenSignature,
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
        checkEntry,
        handleOpenCheckEntry,
        signatureModal,
        handleOpenSignature,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    const isReleased =
        !!cashCheckVoucher.printed_date &&
        !!cashCheckVoucher.approved_date &&
        !!cashCheckVoucher.released_date

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <CashCheckVoucherCreateUpdateFormModal
                    {...updateModal}
                    className="!min-w-[1200px]"
                    formProps={{
                        cashCheckVoucherId: cashCheckVoucher.id,
                        defaultValues: { ...cashCheckVoucher },
                        mode: 'update',
                        readOnly: isReleased,
                    }}
                />
                <CashCheckEntryUpdateFormModal
                    {...checkEntry}
                    className="!min-w-[800px]"
                    formProps={{
                        cashCheckVoucherId: cashCheckVoucher.id,
                        defaultValues: {
                            ...cashCheckVoucher,
                            check_entry_account_id:
                                cashCheckVoucher.check_entry_account_id || '',
                            check_entry_amount:
                                cashCheckVoucher.check_entry_amount || 0,
                            check_entry_check_date:
                                cashCheckVoucher.check_entry_check_date || '',
                            check_entry_check_number:
                                cashCheckVoucher.check_entry_check_number || '',
                        },
                    }}
                />
                <CashCheckVoucherTransactionSignatureUpdateFormModal
                    {...signatureModal}
                    formProps={{
                        cashCheckVoucherId: cashCheckVoucher.id,
                        defaultValues: { ...cashCheckVoucher },
                    }}
                />
            </div>
            <RowActionsGroup
                canSelect
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
                otherActions={
                    <CashCheckVoucherOtherAction
                        handleOpenCheckEntry={handleOpenCheckEntry}
                        handleOpenSignature={handleOpenSignature}
                        row={row}
                    />
                }
                row={row}
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
                    readOnly: true,
                    mode: 'update',
                }}
            />
            <DataTableRowContext
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
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

// Default export for backward compatibility
export default CashCheckJournalVoucherAction
