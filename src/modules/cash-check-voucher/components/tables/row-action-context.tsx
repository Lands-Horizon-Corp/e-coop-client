import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { toReadableDate } from '@/helpers/date-utils'
import {
    hasPermissionFromAuth,
    useAuthStore,
} from '@/modules/authentication/authgentication.store'
import { TReportConfigSchema } from '@/modules/generated-report'
import { useReportViewerStore } from '@/modules/generated-report/components/generated-report-view/global-generate-report-viewer.store'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import {
    ICashCheckVoucher,
    TORCashCheckSettings,
    useDeleteCashCheckVoucherById,
} from '../..'
import { CASH_CHECK_VOUCHER_PRINT_TEMPLATES } from '../../reports/cash-check-voucher-templates'
import CashCheckEntryUpdateFormModal from '../forms/cash-check-entry-form-modal'
import CashCheckVoucherTransactionSignatureUpdateFormModal from '../forms/cash-check-signature-form-modal'
import CashCheckVoucherApproveReleaseDisplayModal from '../forms/cash-check-voucher-approve-release-display-modal'
import CashCheckVoucherCreateUpdateFormModal from '../forms/cash-check-voucher-create-udate-form-modal'
import CashCheckVoucherPrintFormModal from '../forms/cash-check-voucher-print-form-modal'
import { CashCheckVoucherReprintFormModal } from '../forms/cash-check-voucher-reprint-form'
import CashCheckVoucherOtherAction from './cash-check-other-voucher'
import { ICashCheckVoucherTableActionComponentProp } from './columns'

export type CashCheckVoucherActionType =
    | 'edit'
    | 'delete'
    | 'check-entry'
    | 'signature'
    | 'print'
    | 'reprint'
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
    const handleReprintModal = () => {
        open('reprint', {
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
        handleReprintModal,
    }
}

interface ICashCheckVoucherRowContextProps extends ICashCheckVoucherTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const CashCheckJournalVoucherAction = ({
    row,
    onDeleteSuccess,
}: ICashCheckVoucherRowContextProps) => {
    const {
        cashCheckVoucher,
        handleEdit,
        handleOpenCheckEntry,
        handleOpenSignature,
        handleOpenPrintModal,
        handleApproveModal,
        handleReleaseModal,
        handleReprintModal,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <RowActionsGroup
                canSelect
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'CashCheckVoucher',
                        resource: cashCheckVoucher,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={
                    <CashCheckVoucherOtherAction
                        handleOpenCheckEntry={handleOpenCheckEntry}
                        handleOpenSignature={handleOpenSignature}
                        onApprove={handleApproveModal}
                        onPrint={handleOpenPrintModal}
                        onRelease={handleReleaseModal}
                        onReprint={handleReprintModal}
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
        handleEdit,
        handleOpenCheckEntry,
        handleOpenSignature,
        handleApproveModal,
        handleReleaseModal,
        handleOpenPrintModal,
        handleReprintModal,
    } = useCashCheckVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'CashCheckVoucher',
                        resource: cashCheckVoucher,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={
                    <CashCheckVoucherOtherAction
                        handleOpenCheckEntry={handleOpenCheckEntry}
                        handleOpenSignature={handleOpenSignature}
                        onApprove={handleApproveModal}
                        onPrint={handleOpenPrintModal}
                        onRelease={handleReleaseModal}
                        onReprint={handleReprintModal}
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

    const {
        currentAuth: { user_organization },
    } = useAuthStore()

    const resolvedOrSettings: TORCashCheckSettings | undefined =
        user_organization
            ? {
                  ...user_organization.branch.branch_setting,
                  cash_check_voucher_auto_increment:
                      user_organization.cash_check_voucher_auto_increment,
              }
            : undefined

    return (
        <>
            {state.action === 'edit' && state.defaultValues && (
                <CashCheckVoucherCreateUpdateFormModal
                    formProps={{
                        cashCheckVoucherId: state.id,
                        defaultValues: state.defaultValues,
                        mode: 'update',
                        readOnly: isPrinted,
                        orSettings: resolvedOrSettings,
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
                        defaultValues: {
                            cash_voucher_number:
                                state.defaultValues?.cash_voucher_number,
                            report_config: {
                                ...getTemplateAt(
                                    CASH_CHECK_VOUCHER_PRINT_TEMPLATES,
                                    0
                                ),
                                name: `cash_check_voucher_${toReadableDate(state.defaultValues.created_at, 'MMddyy_mmss')}.pdf`,
                                module: 'CashCheckVoucher',
                            } as TReportConfigSchema,
                        },
                        orSettings: resolvedOrSettings,
                        onSuccess(data) {
                            useReportViewerStore.getState().open({
                                reportId: data.id,
                            })
                        },
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
            {state.action === 'reprint' && state.defaultValues && (
                <CashCheckVoucherReprintFormModal
                    formProps={{
                        defaultValues: {
                            report_config: {
                                ...getTemplateAt(
                                    CASH_CHECK_VOUCHER_PRINT_TEMPLATES,
                                    0
                                ),
                                name: `cash_check_voucher_${toReadableDate(state.defaultValues.created_at, 'MMddyy_mmss')}.pdf`,
                                module: 'CashCheckVoucher',
                            } as TReportConfigSchema,
                        },
                        cashCheckVoucherId: state.defaultValues.id,
                        onSuccess(data) {
                            useReportViewerStore.getState().open({
                                reportId: data.id,
                            })
                        },
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
