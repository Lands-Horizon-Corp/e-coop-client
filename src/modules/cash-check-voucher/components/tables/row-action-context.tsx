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
import CashCheckVoucherApproveReleaseDisplayModal from '../forms/cash-check-voucher-approve-release-display-modal'
import CashCheckVoucherCreateUpdateFormModal from '../forms/cash-check-voucher-create-udate-form-modal'
import CashCheckVoucherPrintFormModal from '../forms/cash-check-voucher-print-form-modal'
import CashCheckVoucherOtherAction from './cash-check-other-voucher'
import { ICashCheckVoucherTableActionComponentProp } from './columns'

interface UseCashCheckVoucherActionsProps {
    row: Row<ICashCheckVoucher>
    onDeleteSuccess?: () => void
}
export type TCashCheckVoucherApproveReleaseDisplayMode =
    | 'approve'
    | 'undo-approve'
    | 'release'

const useCashCheckVoucherActions = ({
    row,
    onDeleteSuccess,
}: UseCashCheckVoucherActionsProps) => {
    const updateModal = useModalState()
    const checkEntry = useModalState()
    const signatureModal = useModalState()
    const printModal = useModalState()
    const approveModal = useModalState()
    const releaseModal = useModalState()
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
    const handleOpenPrintModal = () => {
        printModal.onOpenChange(true)
    }
    const handleApproveModal = () => {
        approveModal.onOpenChange(true)
    }
    const handleReleaseModal = () => {
        releaseModal.onOpenChange(true)
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
        handleApproveModal,
        handleReleaseModal,
        printModal,
        handleOpenPrintModal,
        approveModal,
        releaseModal,
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
        printModal,
        handleOpenPrintModal,
        approveModal,
        releaseModal,
        handleApproveModal,
        handleReleaseModal,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    const isPrinted = !!cashCheckVoucher.printed_date

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <CashCheckVoucherCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        cashCheckVoucherId: cashCheckVoucher.id,
                        defaultValues: { ...cashCheckVoucher },
                        mode: 'update',
                        readOnly: isPrinted,
                    }}
                />
                <CashCheckVoucherPrintFormModal
                    {...printModal}
                    className="!min-w-[600px]"
                    formProps={{
                        cashCheckVoucherId: cashCheckVoucher.id,
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
                {['approve', 'undo-approve', 'release'].map((mode) => {
                    const modalState =
                        mode === 'approve' ? approveModal : releaseModal
                    return (
                        <div key={mode}>
                            <CashCheckVoucherApproveReleaseDisplayModal
                                {...modalState}
                                cashCheckVoucher={cashCheckVoucher}
                                mode={
                                    mode as TCashCheckVoucherApproveReleaseDisplayMode
                                }
                            />
                        </div>
                    )
                })}
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
                        onApprove={handleApproveModal}
                        onPrint={handleOpenPrintModal}
                        onRelease={handleReleaseModal}
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
        checkEntry,
        handleOpenCheckEntry,
        signatureModal,
        handleOpenSignature,
        approveModal,
        releaseModal,
        handleApproveModal,
        handleReleaseModal,
        printModal,
        handleOpenPrintModal,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    const isPrinted = !!cashCheckVoucher.printed_date

    return (
        <>
            <CashCheckVoucherCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    cashCheckVoucherId: cashCheckVoucher.id,
                    defaultValues: { ...cashCheckVoucher },
                    readOnly: isPrinted,
                    mode: 'update',
                }}
            />
            <CashCheckVoucherPrintFormModal
                {...printModal}
                className="!min-w-[600px]"
                formProps={{
                    cashCheckVoucherId: cashCheckVoucher.id,
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
            {['approve', 'undo-approve', 'release'].map((mode) => {
                const modalState =
                    mode === 'approve' ? approveModal : releaseModal
                return (
                    <div key={mode}>
                        <CashCheckVoucherApproveReleaseDisplayModal
                            {...modalState}
                            cashCheckVoucher={cashCheckVoucher}
                            mode={
                                mode as TCashCheckVoucherApproveReleaseDisplayMode
                            }
                        />
                    </div>
                )
            })}
            <CashCheckVoucherTransactionSignatureUpdateFormModal
                {...signatureModal}
                formProps={{
                    cashCheckVoucherId: cashCheckVoucher.id,
                    defaultValues: { ...cashCheckVoucher },
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
                otherActions={
                    <CashCheckVoucherOtherAction
                        handleOpenCheckEntry={handleOpenCheckEntry}
                        handleOpenSignature={handleOpenSignature}
                        onApprove={handleApproveModal}
                        onPrint={handleOpenPrintModal}
                        onRelease={handleReleaseModal}
                        row={row}
                        type="context"
                    />
                }
                row={row}
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default CashCheckJournalVoucherAction
