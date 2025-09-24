import { ReactNode } from 'react'

import { withToastCallbacks } from '@/helpers/callback-helper'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'

import { useModalState } from '@/hooks/use-modal-state'

import { IJournalVoucher, useDeleteJournalVoucherById } from '../..'
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

    return {
        journalVoucher,
        updateModal,
        isDeletingJournalVoucher,
        handleEdit,
        handleDelete,
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
    } = useJournalVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <JournalVoucherCreateUpdateFormModal
                    {...updateModal}
                    className="!min-w-[1200px]"
                    formProps={{
                        journalVoucherId: journalVoucher.id,
                        defaultValues: { ...journalVoucher },
                        // onSuccess: () => updateModal.onOpenChange(false),
                    }}
                />
            </div>
            <RowActionsGroup
                // canSelect
                row={row}
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
                otherActions={<JournalVoucherOtherAction row={row} />}
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
    } = useJournalVoucherActions({ row, onDeleteSuccess })

    return (
        <>
            <JournalVoucherCreateUpdateFormModal
                {...updateModal}
                className="!min-w-[1200px]"
                formProps={{
                    journalVoucherId: journalVoucher.id,
                    defaultValues: { ...journalVoucher },
                    // onSuccess: () => updateModal.onOpenChange(false),
                }}
            />
            <DataTableRowContext
                row={row}
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
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

// Default export for backward compatibility
export default JournalVoucherAction
