import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { ICashCheckVoucher, useDeleteCashCheckVoucherById } from '../..'
import CashCheckEntryUpdateFormModal from '../forms/cash-check-entry-form-modal'
import CashCheckVoucherTransactionSignatureUpdateFormModal from '../forms/cash-check-signature-form-modal'
import CashCheckVoucherApproveReleaseDisplayModal from '../forms/cash-check-voucher-approve-release-display-modal'
import CashCheckVoucherCreateUpdateFormModal from '../forms/cash-check-voucher-create-udate-form-modal'
import CashCheckVoucherPrintFormModal from '../forms/cash-check-voucher-print-form-modal'
import CashCheckVoucherOtherAction from './cash-check-other-voucher'
import { ICashCheckVoucherTableActionComponentProp } from './columns'

export type CashCheckVoucherActionType =
    | 'edit'
    | 'delete'
    | 'check-entry'
    | 'signature'
    | 'print'
    | 'approve'
    | 'release'

export interface CashCheckVoucherActionExtra {
    onDeleteSuccess?: () => void
}

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
    const cashCheckVoucher = row.original
    const { open } = useTableRowActionStore<
        ICashCheckVoucher,
        CashCheckVoucherActionType,
        CashCheckVoucherActionExtra
    >()
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
        open('edit', {
            id: cashCheckVoucher.id,
            defaultValues: cashCheckVoucher,
            extra: { onDeleteSuccess },
        })
    }
    const handleOpenCheckEntry = () => {
        open('check-entry', {
            id: cashCheckVoucher.id,
            defaultValues: cashCheckVoucher,
            extra: { onDeleteSuccess },
        })
    }
    const handleOpenSignature = () => {
        open('signature', {
            id: cashCheckVoucher.id,
            defaultValues: cashCheckVoucher,
            extra: { onDeleteSuccess },
        })
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
        open('print', {
            id: cashCheckVoucher.id,
            defaultValues: cashCheckVoucher,
            extra: { onDeleteSuccess },
        })
    }
    const handleApproveModal = () => {
        open('approve', {
            id: cashCheckVoucher.id,
            defaultValues: cashCheckVoucher,
            extra: { onDeleteSuccess },
        })
    }
    const handleReleaseModal = () => {
        open('release', {
            id: cashCheckVoucher.id,
            defaultValues: cashCheckVoucher,
            extra: { onDeleteSuccess },
        })
    }
    return {
        cashCheckVoucher,
        isDeletingCashCheckVoucher,
        handleEdit,
        handleDelete,
        handleOpenCheckEntry,
        handleOpenSignature,
        handleApproveModal,
        handleReleaseModal,
        handleOpenPrintModal,
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
        handleEdit,
        handleOpenCheckEntry,
        handleOpenSignature,
        handleOpenPrintModal,
        handleApproveModal,
        handleReleaseModal,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <RowActionsGroup
                canSelect
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
        handleEdit,
        handleOpenCheckEntry,
        handleOpenSignature,
        handleApproveModal,
        handleReleaseModal,
        handleOpenPrintModal,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
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

export const CashCheckVoucherTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ICashCheckVoucher,
        CashCheckVoucherActionType,
        CashCheckVoucherActionExtra
    >()

    const isPrinted = !!state.defaultValues?.printed_date

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <CashCheckVoucherCreateUpdateFormModal
                    formProps={{
                        cashCheckVoucherId: state.id,
                        defaultValues: state.defaultValues,
                        mode: 'update',
                        readOnly: isPrinted,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'print' && state.defaultValues && (
                <CashCheckVoucherPrintFormModal
                    className="!min-w-[600px]"
                    formProps={{
                        cashCheckVoucherId: state.defaultValues.id,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'check-entry' && state.defaultValues && (
                <CashCheckEntryUpdateFormModal
                    className="!min-w-[800px]"
                    formProps={{
                        cashCheckVoucherId: state.id,
                        defaultValues: {
                            ...state.defaultValues,
                            check_entry_account_id:
                                state.defaultValues.check_entry_account_id ||
                                '',
                            check_entry_amount:
                                state.defaultValues.check_entry_amount || 0,
                            check_entry_check_date:
                                state.defaultValues.check_entry_check_date ||
                                '',
                            check_entry_check_number:
                                state.defaultValues.check_entry_check_number ||
                                '',
                        },
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'signature' && state.defaultValues && (
                <CashCheckVoucherTransactionSignatureUpdateFormModal
                    formProps={{
                        cashCheckVoucherId: state.defaultValues.id,
                        defaultValues: state.defaultValues,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'approve' && state.defaultValues && (
                <CashCheckVoucherApproveReleaseDisplayModal
                    cashCheckVoucher={state.defaultValues}
                    mode="approve"
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'release' && state.defaultValues && (
                <CashCheckVoucherApproveReleaseDisplayModal
                    cashCheckVoucher={state.defaultValues}
                    mode="release"
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default CashCheckJournalVoucherAction
