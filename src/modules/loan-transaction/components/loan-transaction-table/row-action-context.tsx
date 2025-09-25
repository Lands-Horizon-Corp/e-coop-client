import { ReactNode, useState } from 'react'

import { toast } from 'sonner'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import {
    CheckFillIcon,
    PrinterFillIcon,
    SignatureLightIcon,
    ThumbsUpIcon,
    UndoIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import {
    useDeleteLoanTransactionById,
    useReprintLoanTransaction,
    useUndoPrintLoanTransaction,
} from '../../loan-transaction.service'
import { ILoanTransaction } from '../../loan-transaction.types'
import { resolveLoanDatesToStatus } from '../../loan.utils'
import { LoanTransactionPrintFormModal } from '../forms/loan-print-form'
import { LoanTransactionCreateUpdateFormModal } from '../forms/loan-transaction-create-update-form'
import { LoanTransactionSignatureUpdateFormModal } from '../forms/loan-transaction-signature-form'
import LoanApproveReleaseDisplayModal, {
    TLoanApproveReleaseDisplayMode,
} from '../loan-approve-release-display-modal'
import { ILoanTransactionTableActionComponentProp } from './columns'

interface UseLoanTransactionActionsProps {
    row: Row<ILoanTransaction>
    onDeleteSuccess?: () => void
}

const useLoanTransactionActions = ({
    row,
    onDeleteSuccess,
}: UseLoanTransactionActionsProps) => {
    const updateModal = useModalState()
    const updateSignatureModal = useModalState()
    const loanCreatePrintModal = useModalState()

    const [approvalReleaseMode, setApprovalReleaseMode] =
        useState<TLoanApproveReleaseDisplayMode>('approve')
    const loanApproveReleaseDisplayModal = useModalState()

    const loanTransaction = row.original

    const { onOpen } = useConfirmModalStore()

    const {
        isPending: isDeletingLoanTransaction,
        mutate: deleteLoanTransaction,
    } = useDeleteLoanTransactionById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Deleted',
                onSuccess: onDeleteSuccess,
            }),
        },
    })

    const reprintMutation = useReprintLoanTransaction()
    const unprintMutation = useUndoPrintLoanTransaction()

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Loan',
            description: 'Are you sure you want to delete this Loan?',
            onConfirm: () => deleteLoanTransaction(loanTransaction.id),
        })
    }

    const loanApplicationStatus = resolveLoanDatesToStatus(loanTransaction)

    const openApprovalModal = (mode: TLoanApproveReleaseDisplayMode) => {
        setApprovalReleaseMode(mode)
        loanApproveReleaseDisplayModal.onOpenChange(true)
    }

    return {
        loanTransaction,
        loanApplicationStatus,

        updateModal,
        updateSignatureModal,
        loanCreatePrintModal,

        approvalReleaseMode,
        openApprovalModal,
        loanApproveReleaseDisplayModal,

        reprintMutation,
        unprintMutation,
        isPrintingProcess:
            reprintMutation.isPending || unprintMutation.isPending,

        isDeletingLoanTransaction,
        handleEdit,
        handleDelete,
    }
}

interface ILoanTransactionTableActionProps
    extends ILoanTransactionTableActionComponentProp {
    onLoanTransactionUpdate?: () => void
    onDeleteSuccess?: () => void
}

export const LoanTransactionAction = ({
    row,
    onDeleteSuccess,
}: ILoanTransactionTableActionProps) => {
    const { onOpen } = useConfirmModalStore()
    const {
        loanTransaction,
        loanApplicationStatus,

        updateModal,
        updateSignatureModal,
        loanCreatePrintModal,

        approvalReleaseMode,
        loanApproveReleaseDisplayModal,
        openApprovalModal,

        reprintMutation,
        unprintMutation,
        isPrintingProcess,

        isDeletingLoanTransaction,
        handleEdit,
        handleDelete,
    } = useLoanTransactionActions({ row, onDeleteSuccess })

    return (
        <>
            <div onClick={(e) => e.stopPropagation()}>
                <LoanTransactionCreateUpdateFormModal
                    {...updateModal}
                    formProps={{
                        loanTransactionId: loanTransaction.id,
                        defaultValues: loanTransaction,
                    }}
                />
                <LoanTransactionSignatureUpdateFormModal
                    {...updateSignatureModal}
                    formProps={{
                        loanTransactionId: loanTransaction.id,
                        defaultValues: loanTransaction,
                    }}
                />
                <LoanTransactionPrintFormModal
                    {...loanCreatePrintModal}
                    formProps={{
                        defaultValues: loanTransaction,
                        loanTransactionId: loanTransaction.id,
                    }}
                />
                <LoanApproveReleaseDisplayModal
                    {...loanApproveReleaseDisplayModal}
                    mode={approvalReleaseMode}
                    loanTransaction={loanTransaction}
                />
            </div>
            <RowActionsGroup
                canSelect
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanTransaction,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <DropdownMenuItem
                            onClick={() =>
                                updateSignatureModal.onOpenChange(true)
                            }
                        >
                            <SignatureLightIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Signature
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                loanCreatePrintModal.onOpenChange(true)
                            }
                            disabled={
                                loanTransaction.printed_date !== undefined
                            }
                        >
                            <PrinterFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Print
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => {
                                toast.promise(
                                    reprintMutation.mutateAsync({
                                        loanTransactionId: loanTransaction.id,
                                    }),
                                    {
                                        loading: (
                                            <span>
                                                <PrinterFillIcon className="inline mr-1" />{' '}
                                                Printing... Please wait...
                                            </span>
                                        ),
                                        success: 'Reprinted',
                                        error: (error) =>
                                            serverRequestErrExtractor({
                                                error,
                                            }),
                                    }
                                )
                            }}
                            disabled={
                                loanTransaction.printed_date === undefined ||
                                loanApplicationStatus === 'released' ||
                                isPrintingProcess
                            }
                        >
                            {reprintMutation.isPending ? (
                                <LoadingSpinner className="mr-1 size-3" />
                            ) : (
                                <PrinterFillIcon
                                    className="mr-2"
                                    strokeWidth={1.5}
                                />
                            )}
                            Re-print
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() =>
                                onOpen({
                                    title: 'Unprint Loan',
                                    description:
                                        'Unprinting loan will remove the set voucher number. Are you sure to unprint?',
                                    confirmString: 'Unprint Loan',
                                    onConfirm: () =>
                                        toast.promise(
                                            unprintMutation.mutateAsync({
                                                loanTransactionId:
                                                    loanTransaction.id,
                                            }),
                                            {
                                                loading: (
                                                    <span>
                                                        Unprinting... Please
                                                        wait...
                                                    </span>
                                                ),
                                                success: 'Unprinted',
                                                error: (error) =>
                                                    serverRequestErrExtractor({
                                                        error,
                                                    }),
                                            }
                                        ),
                                })
                            }
                            disabled={
                                loanTransaction.printed_date === undefined ||
                                loanApplicationStatus === 'released' ||
                                loanApplicationStatus === 'approved' ||
                                isPrintingProcess
                            }
                        >
                            {unprintMutation.isPending ? (
                                <LoadingSpinner className="mr-1 size-3" />
                            ) : (
                                <UndoIcon className="mr-2" strokeWidth={1.5} />
                            )}
                            Unprint
                        </DropdownMenuItem>

                        <DropdownMenuItem
                            onClick={() => openApprovalModal('approve')}
                            disabled={
                                loanTransaction.printed_date === undefined ||
                                loanApplicationStatus === 'approved' ||
                                loanApplicationStatus === 'released'
                            }
                        >
                            <ThumbsUpIcon className="mr-2" strokeWidth={1.5} />
                            Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => openApprovalModal('undo-approve')}
                            disabled={loanApplicationStatus !== 'approved'}
                        >
                            <UndoIcon className="mr-2" strokeWidth={1.5} />
                            Undo Approval
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={() => openApprovalModal('release')}
                            disabled={loanApplicationStatus !== 'approved'}
                        >
                            <CheckFillIcon className="mr-2" strokeWidth={1.5} />
                            Release
                        </DropdownMenuItem>
                    </>
                }
            />
        </>
    )
}

interface ILoanTransactionRowContextProps
    extends ILoanTransactionTableActionComponentProp {
    children?: ReactNode
    onDeleteSuccess?: () => void
}

export const LoanTransactionRowContext = ({
    row,
    children,
    onDeleteSuccess,
}: ILoanTransactionRowContextProps) => {
    const { onOpen } = useConfirmModalStore()
    const {
        loanTransaction,
        loanApplicationStatus,

        updateModal,
        updateSignatureModal,
        loanCreatePrintModal,

        approvalReleaseMode,
        loanApproveReleaseDisplayModal,
        openApprovalModal,

        reprintMutation,
        unprintMutation,
        isPrintingProcess,

        isDeletingLoanTransaction,
        handleEdit,
        handleDelete,
    } = useLoanTransactionActions({ row, onDeleteSuccess })

    return (
        <>
            <LoanTransactionCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    loanTransactionId: loanTransaction.id,
                    defaultValues: loanTransaction,
                }}
            />
            <LoanTransactionSignatureUpdateFormModal
                {...updateSignatureModal}
                formProps={{
                    loanTransactionId: loanTransaction.id,
                    defaultValues: loanTransaction,
                }}
            />
            <LoanTransactionPrintFormModal
                {...loanCreatePrintModal}
                formProps={{
                    defaultValues: loanTransaction,
                    loanTransactionId: loanTransaction.id,
                }}
            />
            <LoanApproveReleaseDisplayModal
                {...loanApproveReleaseDisplayModal}
                mode={approvalReleaseMode}
                loanTransaction={loanTransaction}
            />
            <DataTableRowContext
                row={row}
                onDelete={{
                    text: 'Delete',
                    isAllowed: !isDeletingLoanTransaction,
                    onClick: handleDelete,
                }}
                onEdit={{
                    text: 'Edit',
                    isAllowed: true,
                    onClick: handleEdit,
                }}
                otherActions={
                    <>
                        <ContextMenuItem
                            onClick={() =>
                                updateSignatureModal.onOpenChange(true)
                            }
                        >
                            <SignatureLightIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Signature
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                loanCreatePrintModal.onOpenChange(true)
                            }
                            disabled={
                                loanTransaction.printed_date !== undefined
                            }
                        >
                            <PrinterFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Print
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => {
                                toast.promise(
                                    reprintMutation.mutateAsync({
                                        loanTransactionId: loanTransaction.id,
                                    }),
                                    {
                                        loading: (
                                            <span>
                                                <PrinterFillIcon className="inline mr-1" />{' '}
                                                Printing... Please wait...
                                            </span>
                                        ),
                                        success: 'Reprinted',
                                        error: (error) =>
                                            serverRequestErrExtractor({
                                                error,
                                            }),
                                    }
                                )
                            }}
                            disabled={
                                loanTransaction.printed_date === undefined ||
                                loanApplicationStatus === 'released' ||
                                isPrintingProcess
                            }
                        >
                            {reprintMutation.isPending ? (
                                <LoadingSpinner className="mr-1 size-3" />
                            ) : (
                                <PrinterFillIcon
                                    className="mr-2"
                                    strokeWidth={1.5}
                                />
                            )}
                            Re-print
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() =>
                                onOpen({
                                    title: 'Unprint Loan',
                                    description:
                                        'Unprinting loan will remove the set voucher number. Are you sure to unprint?',
                                    confirmString: 'Unprint Loan',
                                    onConfirm: () =>
                                        toast.promise(
                                            unprintMutation.mutateAsync({
                                                loanTransactionId:
                                                    loanTransaction.id,
                                            }),
                                            {
                                                loading: (
                                                    <span>
                                                        Unprinting... Please
                                                        wait...
                                                    </span>
                                                ),
                                                success: 'Unprinted',
                                                error: (error) =>
                                                    serverRequestErrExtractor({
                                                        error,
                                                    }),
                                            }
                                        ),
                                })
                            }
                            disabled={
                                loanTransaction.printed_date === undefined ||
                                loanApplicationStatus === 'released' ||
                                loanApplicationStatus === 'approved' ||
                                isPrintingProcess
                            }
                        >
                            {unprintMutation.isPending ? (
                                <LoadingSpinner className="mr-1 size-3" />
                            ) : (
                                <UndoIcon className="mr-2" strokeWidth={1.5} />
                            )}
                            Unprint
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => openApprovalModal('approve')}
                            disabled={
                                loanTransaction.printed_date === undefined ||
                                loanApplicationStatus === 'approved' ||
                                loanApplicationStatus === 'released'
                            }
                        >
                            <ThumbsUpIcon className="mr-2" strokeWidth={1.5} />
                            Approve
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => openApprovalModal('undo-approve')}
                            disabled={loanApplicationStatus !== 'approved'}
                        >
                            <UndoIcon className="mr-2" strokeWidth={1.5} />
                            Undo Approval
                        </ContextMenuItem>
                        <ContextMenuItem
                            onClick={() => openApprovalModal('release')}
                            disabled={loanApplicationStatus !== 'approved'}
                        >
                            <CheckFillIcon className="mr-2" strokeWidth={1.5} />
                            Release
                        </ContextMenuItem>
                    </>
                }
            >
                {children}
            </DataTableRowContext>
        </>
    )
}

export default LoanTransactionAction
