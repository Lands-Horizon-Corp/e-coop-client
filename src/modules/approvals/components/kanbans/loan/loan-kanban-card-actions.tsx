import { toast } from 'sonner'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    ILoanTransaction,
    useUndoPrintLoanTransaction,
} from '@/modules/loan-transaction'
import { LoanTransactionPrintFormModal } from '@/modules/loan-transaction/components/forms/loan-print-form'
import { LoanTransactionCreateUpdateFormModal } from '@/modules/loan-transaction/components/forms/loan-transaction-create-update-form'
import LoanApproveReleaseDisplayModal from '@/modules/loan-transaction/components/loan-approve-release-display-modal'
import LoanTransactionOtherAction from '@/modules/loan-transaction/components/loan-other-actions'
import { LoanTagsManagerPopover } from '@/modules/loan-transaction/components/loan-tag-manager'
import useConfirmModalStore from '@/store/confirm-modal-store'

import { EyeIcon, PencilFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

export interface ILoanTransactionStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

export type TLoanTransactionApproveReleaseDisplayMode =
    | 'approve'
    | 'undo-approve'
    | 'release'

interface ILoanTransactionCardProps extends IClassProps {
    loanTransaction: ILoanTransaction
    refetch: () => void
}

type UseCardKanbanActionsProps = {
    loanTransaction: ILoanTransaction
    onDeleteSuccess?: () => void
    refetch?: () => void
}
const useCardKanbanActions = ({
    loanTransaction,
    refetch,
}: UseCardKanbanActionsProps) => {
    const printModal = useModalState()
    const approveModal = useModalState()
    const releaseModal = useModalState()
    const openViewModal = useModalState()
    const undoApproveModal = useModalState()
    const { onOpen } = useConfirmModalStore()
    const unprintMutation = useUndoPrintLoanTransaction({
        options: {
            onSuccess: () => {
                refetch?.()
            },
        },
    })

    const handleUnprint = () => {
        onOpen({
            title: 'Unprint Loan',
            description:
                'Unprinting loan will remove the set voucher number. Are you sure to unprint?',
            confirmString: 'Unprint Loan',
            onConfirm: () =>
                toast.promise(
                    unprintMutation.mutateAsync({
                        loanTransactionId: loanTransaction.id,
                    }),
                    {
                        loading: <span>Unprinting... Please wait...</span>,
                        success: 'Unprinted',
                        error: (error) =>
                            serverRequestErrExtractor({
                                error,
                            }),
                    }
                ),
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
    const handleOpenViewModal = () => {
        openViewModal.onOpenChange(true)
    }
    const handleUndoApprove = () => {
        undoApproveModal.onOpenChange(true)
    }

    return {
        handleOpenViewModal,
        openViewModal,
        loanTransaction,
        refetch,
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
        undoApproveModal,
        handleUndoApprove,
        handleUnprint,
    }
}

export const LoanTransactionCardActions = ({
    loanTransaction,
    refetch,
}: Pick<ILoanTransactionCardProps, 'loanTransaction' | 'refetch'> & {
    loanDates: ILoanTransactionStatusDates
}) => {
    const {
        printModal,
        handleOpenViewModal,
        openViewModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
        undoApproveModal,
        handleUndoApprove,
        handleUnprint,
    } = useCardKanbanActions({ loanTransaction, refetch })

    const isReleased = !!loanTransaction.released_date

    return (
        <>
            <LoanTransactionCreateUpdateFormModal
                {...openViewModal}
                formProps={{
                    defaultValues: loanTransaction,
                    readOnly: true,
                }}
            />
            <LoanTransactionPrintFormModal
                {...printModal}
                className=""
                formProps={{
                    defaultValues: { ...loanTransaction },
                    loanTransactionId: loanTransaction.id,
                    onSuccess: () => {
                        refetch?.()
                    },
                }}
            />
            {['approve', 'undo-approve', 'release'].map((mode) => {
                let modalState
                if (mode === 'approve') {
                    modalState = approveModal
                } else if (mode === 'undo-approve') {
                    modalState = undoApproveModal
                } else {
                    modalState = releaseModal
                }
                return (
                    <div key={mode}>
                        <LoanApproveReleaseDisplayModal
                            {...modalState}
                            loanTransaction={loanTransaction}
                            mode={
                                mode as TLoanTransactionApproveReleaseDisplayMode
                            }
                            onSuccess={() => {
                                refetch?.()
                            }}
                        />
                    </div>
                )
            })}
            <div className="w-full flex items-center space-x-1 justify-start flex-shrink-0">
                <LoanTagsManagerPopover
                    loanTransactionId={loanTransaction.id}
                    size="sm"
                />
                <Button
                    aria-label="View Loan Transaction"
                    onClick={handleOpenViewModal}
                    size={'icon'}
                    variant="ghost"
                >
                    <EyeIcon />
                </Button>
                {!isReleased && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button size={'icon'} variant="ghost">
                                {<PencilFillIcon className="size-4" />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <LoanTransactionOtherAction
                                loanTransaction={loanTransaction}
                                onApprove={handleApproveModal}
                                onPrint={handleOpenPrintModal}
                                onPrintUndo={handleUnprint}
                                onRelease={handleReleaseModal}
                                onUndoApprove={handleUndoApprove}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </>
    )
}
