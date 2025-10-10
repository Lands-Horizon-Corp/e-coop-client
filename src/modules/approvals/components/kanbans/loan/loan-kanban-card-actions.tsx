import { ILoanTransaction } from '@/modules/loan-transaction'
import { LoanTransactionPrintFormModal } from '@/modules/loan-transaction/components/forms/loan-print-form'
import { LoanTransactionCreateUpdateFormModal } from '@/modules/loan-transaction/components/forms/loan-transaction-create-update-form'
import LoanApproveReleaseDisplayModal from '@/modules/loan-transaction/components/loan-approve-release-display-modal'
import LoanTransactionOtherAction from '@/modules/loan-transaction/components/loan-other-actions'
import { LoanTagsManagerPopover } from '@/modules/loan-transaction/components/loan-tag-manager'

import { EyeIcon, PencilFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

interface IClassProps {
    className?: string
}

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
                const modalState =
                    mode === 'approve' ? approveModal : releaseModal
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
                                onRelease={handleReleaseModal}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </>
    )
}
