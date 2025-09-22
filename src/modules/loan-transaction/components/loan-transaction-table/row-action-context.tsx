import { ReactNode } from 'react'

import { toast } from 'sonner'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { PrinterFillIcon, SignatureLightIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import {
    useDeleteLoanTransactionById,
    useReprintLoanTransaction,
} from '../../loan-transaction.service'
import {
    ILoanTransaction,
    ILoanTransactionRequest,
} from '../../loan-transaction.types'
import { resolveLoanDatesToStatus } from '../../loan.utils'
import { LoanTransactionPrintFormModal } from '../forms/loan-print-form'
import { LoanTransactionCreateUpdateFormModal } from '../forms/loan-transaction-create-update-form'
import { LoanTransactionSignatureUpdateFormModal } from '../forms/loan-transaction-signature-form'
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

    const handleEdit = () => updateModal.onOpenChange(true)

    const handleDelete = () => {
        onOpen({
            title: 'Delete Loan',
            description: 'Are you sure you want to delete this Loan?',
            onConfirm: () => deleteLoanTransaction(loanTransaction.id),
        })
    }

    const loanApplicationStatus = resolveLoanDatesToStatus(loanTransaction)

    return {
        loanTransaction,
        loanApplicationStatus,

        updateModal,
        updateSignatureModal,
        loanCreatePrintModal,

        reprintMutation,

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
    const {
        loanTransaction,
        loanApplicationStatus,

        updateModal,
        updateSignatureModal,
        loanCreatePrintModal,

        reprintMutation,

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
                        mode: 'update',
                        loanTransactionId: loanTransaction.id,
                        defaultValues:
                            loanTransaction as ILoanTransactionRequest,
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
                        loanTransactionId: loanTransaction.id,
                    }}
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
                            inset
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
                                reprintMutation.isPending
                            }
                        >
                            {reprintMutation.isPending && (
                                <LoadingSpinner className="mr-1 size-3" />
                            )}
                            Re-print
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            inset
                            onClick={() => {
                                // loanCreatePrintModal.onOpenChange(true)
                                // TODO: Unprint
                            }}
                            disabled={
                                loanTransaction.printed_date === undefined ||
                                loanApplicationStatus === 'released' ||
                                reprintMutation.isPending
                            }
                        >
                            Unprint
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
    const {
        loanTransaction,

        updateModal,
        updateSignatureModal,

        isDeletingLoanTransaction,
        handleEdit,
        handleDelete,
    } = useLoanTransactionActions({ row, onDeleteSuccess })

    return (
        <>
            <LoanTransactionCreateUpdateFormModal
                {...updateModal}
                formProps={{
                    mode: 'update',
                    loanTransactionId: loanTransaction.id,
                    defaultValues: loanTransaction as ILoanTransactionRequest,
                }}
            />
            <LoanTransactionSignatureUpdateFormModal
                {...updateSignatureModal}
                formProps={{
                    loanTransactionId: loanTransaction.id,
                    defaultValues: loanTransaction,
                }}
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
                            disabled={
                                loanTransaction.printed_date !== undefined
                            }
                        >
                            <SignatureLightIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Signature
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
