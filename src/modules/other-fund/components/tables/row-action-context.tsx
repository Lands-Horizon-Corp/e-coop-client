import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { toReadableDate } from '@/helpers/date-utils'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { TGeneratedReportSchema } from '@/modules/generated-report'
import { useReportViewerStore } from '@/modules/generated-report/components/generated-report-view/global-generate-report-viewer.store'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'

import { useDeleteOtherFundById } from '../../other-fund.service'
import { IOtherFund } from '../../other-fund.types'
import { OTHER_FUND_PRINT_TEMPLATES } from '../../reports/other-fund-templates'
import OtherFundCreateUpdateFormModal from '../forms/create-update-other-fund-modal'
import OtherFundApproveReleaseDisplayModal from '../forms/other-fund-approve-release-modal'
import OtherFundPrintFormModal from '../forms/other-fund-print-modal'
import { OtherFundReprintFormModal } from '../forms/other-fund-reprint-form'
import { IOtherFundTableActionComponentProp } from './columns'
import { OtherFundOtherAction } from './other-fund-other-action'

export type TOtherFundApproveReleaseDisplayMode =
    | 'approve'
    | 'undo-approve'
    | 'release'
export type OtherFundActionType =
    | 'edit'
    | 'print'
    | 'reprint'
    | 'approve-release'
    | 'delete'

export interface OtherFundActionExtra {
    onDeleteSuccess?: () => void
    approveReleaseMode?: TOtherFundApproveReleaseDisplayMode
}

interface useOtherFundActionProps {
    row: Row<IOtherFund>
    onDeleteSuccess?: () => void
}

export const useOtherFundAction = ({
    row,
    onDeleteSuccess,
}: useOtherFundActionProps) => {
    const otherFund = row.original
    const { onOpen } = useConfirmModalStore()

    const { open } = useTableRowActionStore<
        IOtherFund,
        OtherFundActionType,
        OtherFundActionExtra
    >()

    const { isPending: isDeletingOtherFund, mutate: deleteOtherFund } =
        useDeleteOtherFundById({
            options: {
                ...withToastCallbacks({
                    textSuccess: 'Deleted Other fund',
                    onSuccess: onDeleteSuccess,
                }),
            },
        })

    const handleEdit = () => {
        open('edit', {
            id: otherFund.id,
            defaultValues: otherFund,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Other fund',
            description: 'Are you sure you want to delete this Other fund?',
            onConfirm: () => deleteOtherFund(otherFund.id),
        })
    }

    const handleOpenPrintModal = () => {
        open('print', {
            id: otherFund.id,
            defaultValues: otherFund,
            extra: { onDeleteSuccess },
        })
    }

    const handleOpenReprintModal = () => {
        open('reprint', {
            id: otherFund.id,
            defaultValues: otherFund,
            extra: { onDeleteSuccess },
        })
    }

    const handleApproveModal = () => {
        open('approve-release', {
            id: otherFund.id,
            defaultValues: otherFund,
            extra: { onDeleteSuccess, approveReleaseMode: 'approve' },
        })
    }

    const handleReleaseModal = () => {
        open('approve-release', {
            id: otherFund.id,
            defaultValues: otherFund,
            extra: { onDeleteSuccess, approveReleaseMode: 'release' },
        })
    }

    return {
        otherFund,
        isDeletingOtherFund,
        handleEdit,
        handleDelete,
        handleOpenPrintModal,
        handleOpenReprintModal,
        handleApproveModal,
        handleReleaseModal,
    }
}

interface IOtherFundActionProps extends IOtherFundTableActionComponentProp {
    onOtherFundUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const OtherFundAction = ({
    row,
    onDeleteSuccess,
}: IOtherFundActionProps) => {
    const {
        otherFund,
        handleEdit,
        handleApproveModal,
        handleOpenPrintModal,
        handleReleaseModal,
        handleOpenReprintModal,
    } = useOtherFundAction({ row, onDeleteSuccess })

    return (
        <RowActionsGroup
            canSelect
            onEdit={{
                text: 'Edit',
                isAllowed: hasPermissionFromAuth({
                    action: ['Update', 'OwnUpdate'],
                    resourceType: 'JournalVoucher',
                    resource: otherFund,
                }),
                onClick: handleEdit,
            }}
            otherActions={
                <OtherFundOtherAction
                    onApprove={handleApproveModal}
                    onPrint={handleOpenPrintModal}
                    onRelease={handleReleaseModal}
                    onReprint={handleOpenReprintModal}
                    row={row}
                />
            }
            row={row}
        />
    )
}

interface IOtherFundRowContextProps extends IOtherFundTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const OtherFundRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: IOtherFundRowContextProps) => {
    const {
        otherFund,
        handleEdit,
        handleApproveModal,
        handleReleaseModal,
        handleOpenPrintModal,
        handleOpenReprintModal,
    } = useOtherFundAction({ row, onDeleteSuccess })

    return (
        <>
            <DataTableRowContext
                onEdit={{
                    text: 'Edit',
                    isAllowed: hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'JournalVoucher',
                        resource: otherFund,
                    }),
                    onClick: handleEdit,
                }}
                otherActions={
                    <OtherFundOtherAction
                        onApprove={handleApproveModal}
                        onPrint={handleOpenPrintModal}
                        onRelease={handleReleaseModal}
                        onReprint={handleOpenReprintModal}
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

export const OtherFundTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        IOtherFund,
        OtherFundActionType,
        OtherFundActionExtra
    >()

    if (!state || !state.defaultValues) return null

    const otherFund = state.defaultValues
    const isPrinted = !!otherFund.printed_date
    const approveReleaseMode = state.extra?.approveReleaseMode ?? 'approve'

    return (
        <>
            {/* Edit/Update Action */}
            {state.action === 'edit' && (
                <OtherFundCreateUpdateFormModal
                    formProps={{
                        otherFundId: otherFund.id,
                        defaultValues: otherFund,
                        readOnly: isPrinted,
                        mode: isPrinted ? 'readOnly' : 'update',
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {/* Print Action */}
            {state.action === 'print' && (
                <OtherFundPrintFormModal
                    formProps={{
                        defaultValues: {
                            ...otherFund,
                            report_config: {
                                ...getTemplateAt(OTHER_FUND_PRINT_TEMPLATES, 0),
                                name: `other_fund_${toReadableDate(otherFund.created_at, 'MMddyy_mmss')}`,
                                module: 'OtherFund',
                            } as TGeneratedReportSchema,
                        },
                        onSuccess: (data) => {
                            useReportViewerStore.getState().open({
                                reportId: data.id,
                            })
                            close()
                        },
                        otherFundId: otherFund.id,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'reprint' && (
                <OtherFundReprintFormModal
                    formProps={{
                        defaultValues: {
                            ...otherFund,
                            report_config: {
                                ...getTemplateAt(OTHER_FUND_PRINT_TEMPLATES, 0),
                                name: `other_fund_${toReadableDate(otherFund.created_at, 'MMddyy_mmss')}`,
                                module: 'OtherFund',
                            } as TGeneratedReportSchema,
                        },
                        onSuccess: (data) => {
                            useReportViewerStore.getState().open({
                                reportId: data.id,
                            })
                            close()
                        },
                        otherFundId: otherFund.id,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {/* Approve/Release Action */}
            {state.action === 'approve-release' && (
                <OtherFundApproveReleaseDisplayModal
                    mode={approveReleaseMode}
                    onOpenChange={close}
                    open={state.isOpen}
                    otherFund={otherFund}
                />
            )}
        </>
    )
}

export default OtherFundTableActionManager
