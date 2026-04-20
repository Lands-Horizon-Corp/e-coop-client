import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { toReadableDate } from '@/helpers/date-utils'
import {
    hasPermissionFromAuth,
    useAuthStore,
} from '@/modules/authentication/authgentication.store'
import { TGeneratedReportSchema } from '@/modules/generated-report'
import { useReportViewerStore } from '@/modules/generated-report/components/generated-report-view/global-generate-report-viewer.store'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import {
    IJournalVoucher,
    TORJournalVoucherSettings,
    useDeleteJournalVoucherById,
} from '../..'
import { JOURNAL_VOUCHER_PRINT_TEMPLATES } from '../../reports/jornal-voucher-template'
import JournalVoucherApproveReleaseDisplayModal, {
    TJournalVoucherApproveReleaseDisplayMode,
} from '../forms/journal-voucher-approve-release-modal'
import JournalVoucherPrintFormModal from '../forms/journal-voucher-create-print-modal'
import { JournalVoucherCreateUpdateFormModal } from '../forms/journal-voucher-create-update-modal'
import { JournalVoucherReprintFormModal } from '../forms/journal-voucher-reprint-form'
import { IJournalVoucherTableActionComponentProp } from './columns'
import JournalVoucherOtherAction from './journal-voucher-other-action'

export type JournalVoucherActionType =
    | 'edit'
    | 'print'
    | 'reprint'
    | 'approve-release'
    | 'delete'

export interface JournalVoucherActionExtra {
    onDeleteSuccess?: () => void
    approveReleaseMode?: TJournalVoucherApproveReleaseDisplayMode
}

interface UseJournalVoucherActionsProps {
    row: Row<IJournalVoucher>
    onDeleteSuccess?: () => void
}

const useJournalVoucherActions = ({
    row,
    onDeleteSuccess,
}: UseJournalVoucherActionsProps) => {
    const journalVoucher = row.original
    const { onOpen } = useConfirmModalStore()
    const { open } = useTableRowActionStore<
        IJournalVoucher,
        JournalVoucherActionType,
        JournalVoucherActionExtra
    >()

    const {
        isPending: isDeletingJournalVoucher,
        mutate: deleteJournalVoucher,
    } = useDeleteJournalVoucherById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Deleted journal voucher',
                onSuccess: onDeleteSuccess,
            }),
        },
    })

    const handleEdit = () => {
        open('edit', {
            id: journalVoucher.id,
            defaultValues: journalVoucher,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Journal Voucher',
            description:
                'Are you sure you want to delete this journal voucher?',
            onConfirm: () => deleteJournalVoucher(journalVoucher.id),
        })
    }

    const handleOpenPrintModal = () => {
        open('print', {
            id: journalVoucher.id,
            defaultValues: journalVoucher,
            extra: { onDeleteSuccess },
        })
    }
    const handleReprintModal = () => {
        open('reprint', {
            id: journalVoucher.id,
            defaultValues: journalVoucher,
            extra: { onDeleteSuccess },
        })
    }
    const handleApproveModal = () => {
        open('approve-release', {
            id: journalVoucher.id,
            defaultValues: journalVoucher,
            extra: { onDeleteSuccess, approveReleaseMode: 'approve' },
        })
    }

    const handleReleaseModal = () => {
        open('approve-release', {
            id: journalVoucher.id,
            defaultValues: journalVoucher,
            extra: { onDeleteSuccess, approveReleaseMode: 'release' },
        })
    }

    return {
        journalVoucher,
        isDeletingJournalVoucher,
        handleEdit,
        handleDelete,
        handleOpenPrintModal,
        handleReprintModal,
        handleApproveModal,
        handleReleaseModal,
    }
}

interface IJournalVoucherTableActionProps extends IJournalVoucherTableActionComponentProp {
    onJournalVoucherUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const JournalVoucherAction = ({
    row,
    onDeleteSuccess,
}: IJournalVoucherTableActionProps) => {
    const {
        journalVoucher,
        handleEdit,
        handleOpenPrintModal,
        handleApproveModal,
        handleReleaseModal,
    } = useJournalVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}></div>
            <RowActionsGroup
                canSelect
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'JournalVoucher',
                        resource: journalVoucher,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={
                    <JournalVoucherOtherAction
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

interface IJournalVoucherRowContextProps extends IJournalVoucherTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const JournalVoucherRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IJournalVoucherRowContextProps) => {
    const {
        journalVoucher,
        handleEdit,
        handleApproveModal,
        handleReleaseModal,
        handleOpenPrintModal,
        handleReprintModal,
    } = useJournalVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'JournalVoucher',
                        resource: journalVoucher,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={
                    <JournalVoucherOtherAction
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

export const JournalVoucherTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IJournalVoucher,
        JournalVoucherActionType,
        JournalVoucherActionExtra
    >()

    const {
        currentAuth: { user_organization },
    } = useAuthStore()

    if (!state || !state.defaultValues) return null

    const journalVoucher = state.defaultValues
    const isPrinted = !!journalVoucher.printed_date
    const approveReleaseMode = state.extra?.approveReleaseMode ?? 'approve'

    const resolvedOrSettings: TORJournalVoucherSettings | undefined =
        user_organization
            ? {
                  ...user_organization.branch.branch_setting,
                  journal_voucher_auto_increment:
                      user_organization.journal_voucher_auto_increment,
              }
            : undefined

    return (
        <>
            {state.action === 'edit' && (
                <JournalVoucherCreateUpdateFormModal
                    formProps={{
                        journalVoucherId: journalVoucher.id,
                        defaultValues: journalVoucher,
                        readOnly: isPrinted,
                        mode: isPrinted ? 'readOnly' : 'update',
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'print' && (
                <JournalVoucherPrintFormModal
                    formProps={{
                        defaultValues: {
                            ...journalVoucher,
                            report_config: {
                                ...getTemplateAt(
                                    JOURNAL_VOUCHER_PRINT_TEMPLATES,
                                    0
                                ),
                                name: `journal_voucher_${toReadableDate(journalVoucher.created_at, 'MMddyy_mmss')}`,
                                module: 'JournalVoucher',
                            } as TGeneratedReportSchema,
                        },
                        journalVoucherId: journalVoucher.id,
                        orSettings: resolvedOrSettings,
                        onSuccess: (data) => {
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
                <JournalVoucherReprintFormModal
                    formProps={{
                        defaultValues: {
                            report_config: {
                                ...getTemplateAt(
                                    JOURNAL_VOUCHER_PRINT_TEMPLATES,
                                    0
                                ),
                                name: `journal_voucher_${toReadableDate(
                                    state.defaultValues.created_at,
                                    'MMddyy_mmss'
                                )}`,
                                module: 'JournalVoucher',
                            } as TGeneratedReportSchema,
                        },
                        journalVoucherId: state.defaultValues.id,
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
            {state.action === 'approve-release' && (
                <JournalVoucherApproveReleaseDisplayModal
                    journalVoucher={journalVoucher}
                    mode={approveReleaseMode}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

export default JournalVoucherAction
