import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { IJournalVoucher, useDeleteJournalVoucherById } from '../..'
import JournalVoucherApproveReleaseDisplayModal, {
    TJournalVoucherApproveReleaseDisplayMode,
} from '../forms/journal-voucher-approve-release-modal'
import JournalVoucherPrintFormModal from '../forms/journal-voucher-create-print-modal'
import { JournalVoucherCreateUpdateFormModal } from '../forms/journal-voucher-create-update-modal'
import { IJournalVoucherTableActionComponentProp } from './columns'
import JournalVoucherOtherAction from './journal-voucher-other-action'

interface UseJournalVoucherActionsProps {
    row: Row<IJournalVoucher>
    onDeleteSuccess?: () => void
}

const useJournalVoucherActions = ({
    row,
    onDeleteSuccess,
}: UseJournalVoucherActionsProps) => {
    const updateModal = useModalState()
    const printModal = useModalState()
    const approveModal = useModalState()
    const releaseModal = useModalState()
    const journalVoucher = row.original
    const { onOpen } = useConfirmModalStore()
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
        updateModal.onOpenChange(true)
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
        printModal.onOpenChange(true)
    }
    const handleApproveModal = () => {
        approveModal.onOpenChange(true)
    }
    const handleReleaseModal = () => {
        releaseModal.onOpenChange(true)
    }

    return {
        journalVoucher,
        updateModal,
        isDeletingJournalVoucher,
        handleEdit,
        handleDelete,
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
    }
}

interface IJournalVoucherTableActionProps
    extends IJournalVoucherTableActionComponentProp {
    onJournalVoucherUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const JournalVoucherAction = ({
    row,
    onDeleteSuccess,
}: IJournalVoucherTableActionProps) => {
    const {
        journalVoucher,
        updateModal,
        isDeletingJournalVoucher,
        handleEdit,
        handleDelete,
        handleOpenPrintModal,
        printModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
    } = useJournalVoucherActions({ row, onDeleteSuccess })
    const isPrinted = !!journalVoucher.printed_date

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <JournalVoucherPrintFormModal
                    {...printModal}
                    formProps={{
                        defaultValues: { ...journalVoucher },
                        journalVoucherId: journalVoucher.id,
                    }}
                />
                <JournalVoucherCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        journalVoucherId: journalVoucher.id,
                        defaultValues: { ...journalVoucher },
                        readOnly: isPrinted,
                        mode: isPrinted ? 'readOnly' : 'update',
                    }}
                />
                {['approve', 'undo-approve', 'release'].map((mode) => {
                    const modalState =
                        mode === 'approve' ? approveModal : releaseModal
                    return (
                        <div key={mode}>
                            <JournalVoucherApproveReleaseDisplayModal
                                {...modalState}
                                journalVoucher={journalVoucher}
                                mode={
                                    mode as TJournalVoucherApproveReleaseDisplayMode
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
                    isAllowed: !isDeletingJournalVoucher,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
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

interface IJournalVoucherRowContextProps
    extends IJournalVoucherTableActionComponentProp {
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
        updateModal,
        isDeletingJournalVoucher,
        handleEdit,
        handleDelete,
        handleApproveModal,
        approveModal,
        handleReleaseModal,
        releaseModal,
        handleOpenPrintModal,
        printModal,
    } = useJournalVoucherActions({ row, onDeleteSuccess })
    const isPrinted = !!journalVoucher.printed_date
    return (
        <>
            <JournalVoucherPrintFormModal
                {...printModal}
                formProps={{
                    defaultValues: { ...journalVoucher },
                    journalVoucherId: journalVoucher.id,
                }}
            />
            <JournalVoucherCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    journalVoucherId: journalVoucher.id,
                    defaultValues: { ...journalVoucher },
                    readOnly: isPrinted,
                    mode: isPrinted ? 'readOnly' : 'update',
                }}
            />
            {['approve', 'undo-approve', 'release'].map((mode) => {
                const modalState =
                    mode === 'approve' ? approveModal : releaseModal
                return (
                    <div key={mode}>
                        <JournalVoucherApproveReleaseDisplayModal
                            {...modalState}
                            journalVoucher={journalVoucher}
                            mode={
                                mode as TJournalVoucherApproveReleaseDisplayMode
                            }
                        />
                    </div>
                )
            })}
            <DataTableRowContext
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingJournalVoucher,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <JournalVoucherOtherAction
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

export default JournalVoucherAction
