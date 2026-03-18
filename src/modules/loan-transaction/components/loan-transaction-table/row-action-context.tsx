import { ReactNode } from 'react'

import { toast } from 'sonner'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    hasPermissionFromAuth,
    useAuthStore,
} from '@/modules/authentication/authgentication.store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { Row } from '@tanstack/react-table'

import RowActionsGroup from '@/components/data-table/data-table-row-actions'
import DataTableRowContext from '@/components/data-table/data-table-row-context'
import { useTableRowActionStore } from '@/components/data-table/store/data-table-action-store'
import {
    CheckFillIcon,
    PencilFillIcon,
    PrinterFillIcon,
    SignatureLightIcon,
    ThumbsUpIcon,
    UndoIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import {
    useDeleteLoanTransactionById,
    useReprintLoanTransaction,
    useUndoPrintLoanTransaction,
} from '../../loan-transaction.service'
import {
    ILoanTransaction,
    TORLoanVoucherSettings,
} from '../../loan-transaction.types'
import { resolveLoanDatesToStatus } from '../../loan-transaction.utils'
import { LoanEditFormModal } from '../forms/loan-edit-form'
import { LoanTransactionPrintFormModal } from '../forms/loan-print-form'
import { LoanTransactionCreateUpdateFormModal } from '../forms/loan-transaction-create-update-form'
import { LoanTransactionSignatureUpdateFormModal } from '../forms/loan-transaction-signature-form'
import LoanApproveReleaseDisplayModal, {
    TLoanApproveReleaseDisplayMode,
} from '../loan-approve-release-display-modal'
import { ILoanTransactionTableActionComponentProp } from './columns'

// ===== TYPE DEFINITIONS =====
export type LoanTransactionActionType =
    | 'edit'
    | 'loan-edit'
    | 'signature'
    | 'print'
    | 'approve-release'
    | 'delete'

export interface LoanTransactionActionExtra {
    onDeleteSuccess?: () => void
    approveReleaseMode?: TLoanApproveReleaseDisplayMode
}

interface UseLoanTransactionActionsProps {
    row: Row<ILoanTransaction>
    onDeleteSuccess?: () => void
}

const useLoanTransactionActions = ({
    row,
    onDeleteSuccess,
}: UseLoanTransactionActionsProps) => {
    const loanTransaction = row.original
    const { onOpen } = useConfirmModalStore()
    const { open } = useTableRowActionStore<
        ILoanTransaction,
        LoanTransactionActionType,
        LoanTransactionActionExtra
    >()

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

    const loanApplicationStatus = resolveLoanDatesToStatus(loanTransaction)

    const handleEdit = () => {
        open('edit', {
            id: loanTransaction.id,
            defaultValues: loanTransaction,
            extra: { onDeleteSuccess },
        })
    }

    const handleOpenEdit = () => {
        open('edit', {
            id: loanTransaction.id,
            defaultValues: loanTransaction,
            extra: { onDeleteSuccess },
        })
    }

    const handleSignature = () => {
        open('signature', {
            id: loanTransaction.id,
            defaultValues: loanTransaction,
            extra: { onDeleteSuccess },
        })
    }

    const handlePrint = () => {
        open('print', {
            id: loanTransaction.id,
            defaultValues: loanTransaction,
            extra: { onDeleteSuccess },
        })
    }

    const handleEditLoan = () => {
        open('loan-edit', {
            id: loanTransaction.id,
            defaultValues: loanTransaction,
            extra: { onDeleteSuccess },
        })
    }

    const handleDelete = () => {
        onOpen({
            title: 'Delete Loan',
            description: 'Are you sure you want to delete this Loan?',
            onConfirm: () => deleteLoanTransaction(loanTransaction.id),
        })
    }

    const openApprovalModal = (mode: TLoanApproveReleaseDisplayMode) => {
        open('approve-release', {
            id: loanTransaction.id,
            defaultValues: loanTransaction,
            extra: { onDeleteSuccess, approveReleaseMode: mode },
        })
    }

    return {
        loanTransaction,
        loanApplicationStatus,

        reprintMutation,
        unprintMutation,
        isPrintingProcess:
            reprintMutation.isPending || unprintMutation.isPending,

        isDeletingLoanTransaction,
        handleEdit,
        handleEditLoan,
        handleOpenEdit,
        handleSignature,
        handlePrint,
        handleDelete,
        openApprovalModal,
    }
}

interface ILoanTransactionTableActionProps extends ILoanTransactionTableActionComponentProp {
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

        reprintMutation,
        unprintMutation,
        isPrintingProcess,

        isDeletingLoanTransaction,
        handleEdit,
        handleEditLoan,
        handleSignature,
        handlePrint,
        handleDelete,
        openApprovalModal,
    } = useLoanTransactionActions({ row, onDeleteSuccess })

    return (
        <RowActionsGroup
            canSelect
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingLoanTransaction &&
                    !loanTransaction?.printed_date &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'Loan',
                        resource: loanTransaction,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text:
                    loanTransaction.printed_date !== undefined
                        ? 'View Loan'
                        : 'Edit Loan',
                isAllowed:
                    !loanTransaction.released_by &&
                    hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'Loan',
                        resource: loanTransaction,
                    }),
                onClick: handleEdit,
            }}
            otherActions={
                <>
                    {loanTransaction.released_date && (
                        <DropdownMenuItem
                            disabled={
                                !loanTransaction?.released_date ||
                                !hasPermissionFromAuth({
                                    action: ['Update', 'OwnUpdate'],
                                    resourceType: 'Loan',
                                    resource: loanTransaction,
                                })
                            }
                            onClick={handleEditLoan}
                        >
                            <PencilFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Edit Loan
                        </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignature}>
                        <SignatureLightIcon
                            className="mr-2"
                            strokeWidth={1.5}
                        />
                        Signature
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={
                            loanTransaction.printed_date !== undefined ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanPrinted',
                                resource: loanTransaction,
                            })
                        }
                        onClick={handlePrint}
                    >
                        <PrinterFillIcon className="mr-2" strokeWidth={1.5} />
                        Print
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={
                            loanTransaction.printed_date === undefined ||
                            loanApplicationStatus === 'released' ||
                            isPrintingProcess ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanPrinted',
                                resource: loanTransaction,
                            })
                        }
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
                        disabled={
                            loanTransaction.printed_date === undefined ||
                            loanApplicationStatus === 'released' ||
                            loanApplicationStatus === 'approved' ||
                            isPrintingProcess ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanPrinted',
                                resource: loanTransaction,
                            })
                        }
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
                                                    Unprinting... Please wait...
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
                    >
                        {unprintMutation.isPending ? (
                            <LoadingSpinner className="mr-1 size-3" />
                        ) : (
                            <UndoIcon className="mr-2" strokeWidth={1.5} />
                        )}
                        Unprint
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        disabled={
                            loanTransaction.printed_date === undefined ||
                            loanApplicationStatus === 'approved' ||
                            loanApplicationStatus === 'released' ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanApproved',
                                resource: loanTransaction,
                            })
                        }
                        onClick={() => openApprovalModal('approve')}
                    >
                        <ThumbsUpIcon className="mr-2" strokeWidth={1.5} />
                        Approve
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={
                            loanApplicationStatus !== 'approved' ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanApproved',
                                resource: loanTransaction,
                            })
                        }
                        onClick={() => openApprovalModal('undo-approve')}
                    >
                        <UndoIcon className="mr-2" strokeWidth={1.5} />
                        Undo Approval
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        disabled={
                            loanApplicationStatus !== 'approved' ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanReleased',
                                resource: loanTransaction,
                            })
                        }
                        onClick={() => openApprovalModal('release')}
                    >
                        <CheckFillIcon className="mr-2" strokeWidth={1.5} />
                        Release
                    </DropdownMenuItem>
                </>
            }
            row={row}
        />
    )
}

interface ILoanTransactionRowContextProps extends ILoanTransactionTableActionComponentProp {
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

        reprintMutation,
        unprintMutation,
        isPrintingProcess,

        isDeletingLoanTransaction,
        handleEdit,
        handleEditLoan,
        handleSignature,
        handlePrint,
        handleDelete,
        openApprovalModal,
    } = useLoanTransactionActions({ row, onDeleteSuccess })

    return (
        <DataTableRowContext
            onDelete={{
                text: 'Delete',
                isAllowed:
                    !isDeletingLoanTransaction &&
                    !loanTransaction.printed_date &&
                    hasPermissionFromAuth({
                        action: ['Delete', 'OwnDelete'],
                        resourceType: 'Loan',
                        resource: loanTransaction,
                    }),
                onClick: handleDelete,
            }}
            onEdit={{
                text:
                    loanTransaction.printed_date !== undefined
                        ? 'View Loan'
                        : 'Edit Loan',
                isAllowed:
                    !loanTransaction.released_by &&
                    hasPermissionFromAuth({
                        action: ['Update', 'OwnUpdate'],
                        resourceType: 'Loan',
                        resource: loanTransaction,
                    }),
                onClick: handleEdit,
            }}
            otherActions={
                <>
                    {loanTransaction.released_date && (
                        <ContextMenuItem
                            disabled={
                                !!loanTransaction.released_date &&
                                !hasPermissionFromAuth({
                                    action: ['Update', 'OwnUpdate'],
                                    resourceType: 'Loan',
                                    resource: loanTransaction,
                                })
                            }
                            onClick={handleEditLoan}
                        >
                            <PencilFillIcon
                                className="mr-2"
                                strokeWidth={1.5}
                            />
                            Edit Loan
                        </ContextMenuItem>
                    )}
                    <ContextMenuItem onClick={handleSignature}>
                        <SignatureLightIcon
                            className="mr-2"
                            strokeWidth={1.5}
                        />
                        Signature
                    </ContextMenuItem>
                    <ContextMenuItem
                        disabled={
                            loanTransaction.printed_date !== undefined ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanPrinted',
                                resource: loanTransaction,
                            })
                        }
                        onClick={handlePrint}
                    >
                        <PrinterFillIcon className="mr-2" strokeWidth={1.5} />
                        Print
                    </ContextMenuItem>
                    <ContextMenuItem
                        disabled={
                            loanTransaction.printed_date === undefined ||
                            loanApplicationStatus === 'released' ||
                            isPrintingProcess ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanPrinted',
                                resource: loanTransaction,
                            })
                        }
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
                        disabled={
                            loanTransaction.printed_date === undefined ||
                            loanApplicationStatus === 'released' ||
                            loanApplicationStatus === 'approved' ||
                            isPrintingProcess ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanPrinted',
                                resource: loanTransaction,
                            })
                        }
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
                                                    Unprinting... Please wait...
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
                    >
                        {unprintMutation.isPending ? (
                            <LoadingSpinner className="mr-1 size-3" />
                        ) : (
                            <UndoIcon className="mr-2" strokeWidth={1.5} />
                        )}
                        Unprint
                    </ContextMenuItem>
                    <ContextMenuItem
                        disabled={
                            loanTransaction.printed_date === undefined ||
                            loanApplicationStatus === 'approved' ||
                            loanApplicationStatus === 'released' ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanApproved',
                                resource: loanTransaction,
                            })
                        }
                        onClick={() => openApprovalModal('approve')}
                    >
                        <ThumbsUpIcon className="mr-2" strokeWidth={1.5} />
                        Approve
                    </ContextMenuItem>
                    <ContextMenuItem
                        disabled={
                            loanApplicationStatus !== 'approved' ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanApproved',
                                resource: loanTransaction,
                            })
                        }
                        onClick={() => openApprovalModal('undo-approve')}
                    >
                        <UndoIcon className="mr-2" strokeWidth={1.5} />
                        Undo Approval
                    </ContextMenuItem>
                    <ContextMenuItem
                        disabled={
                            loanApplicationStatus !== 'approved' ||
                            !hasPermissionFromAuth({
                                action: ['Update', 'OwnUpdate'],
                                resourceType: 'ApprovalsLoanReleased',
                                resource: loanTransaction,
                            })
                        }
                        onClick={() => openApprovalModal('release')}
                    >
                        <CheckFillIcon className="mr-2" strokeWidth={1.5} />
                        Release
                    </ContextMenuItem>
                </>
            }
            row={row}
        >
            {children}
        </DataTableRowContext>
    )
}

export const LoanTransactionTableActionManager = () => {
    const { state, close } = useTableRowActionStore<
        ILoanTransaction,
        LoanTransactionActionType,
        LoanTransactionActionExtra
    >()

    const loanTransaction = state.defaultValues
    const approveReleaseMode = state.extra?.approveReleaseMode ?? 'approve'

    const {
        currentAuth: { user_organization },
    } = useAuthStore()

    const resolvedOrSettings: TORLoanVoucherSettings | undefined =
        user_organization
            ? {
                  ...user_organization.branch.branch_setting,
                  loan_voucher_auto_increment:
                      user_organization.loan_voucher_auto_increment,
              }
            : undefined

    return (
        <>
            {state.action === 'edit' && loanTransaction && (
                <LoanTransactionCreateUpdateFormModal
                    formProps={{
                        loanTransactionId: loanTransaction.id,
                        defaultValues: loanTransaction,
                        orSettings: resolvedOrSettings,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'signature' && loanTransaction && (
                <LoanTransactionSignatureUpdateFormModal
                    formProps={{
                        loanTransactionId: loanTransaction.id,
                        defaultValues: loanTransaction,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'print' && loanTransaction && (
                <LoanTransactionPrintFormModal
                    formProps={{
                        defaultValues: {
                            name: loanTransaction.voucher
                                ? `loan_voucher_${loanTransaction.voucher}_release`
                                : `loan_${loanTransaction.id}_voucher_release`,
                            check_date: loanTransaction.check_date,
                            check_number: loanTransaction.check_number,
                            voucher: loanTransaction.voucher,
                        },
                        loanTransactionId: loanTransaction.id,
                        orSettings: resolvedOrSettings,
                    }}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'approve-release' && loanTransaction && (
                <LoanApproveReleaseDisplayModal
                    loanTransaction={loanTransaction}
                    mode={approveReleaseMode}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}

            {state.action === 'loan-edit' && loanTransaction && (
                <LoanEditFormModal
                    formProps={{
                        loanTransactionId: loanTransaction.id,
                        defaultValues: loanTransaction,
                    }}
                    // loanTransaction={loanTransaction}
                    onOpenChange={close}
                    open={state.isOpen}
                />
            )}
        </>
    )
}

// Default export for backward compatibility
export default LoanTransactionAction
