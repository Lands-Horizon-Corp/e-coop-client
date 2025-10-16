import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import MemberProfileInfoViewLoanCard from '@/modules/member-profile/components/member-profile-info-loan-view-card'
import useConfirmModalStore from '@/store/confirm-modal-store'

import {
    BadgeCheckFillIcon,
    SignatureLightIcon,
    ThumbsUpIcon,
    TicketIcon,
    UndoIcon,
    WarningFillIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import {
    useApproveLoanTransaction,
    useReleaseLoanTransaction,
    useUndoApproveLoanTransaction,
} from '..'
import { ILoanTransaction } from '../loan-transaction.types'
import { LoanTransactionSignatureUpdateFormModal } from './forms/loan-transaction-signature-form'
import LoanMiniInfoCard from './loan-mini-info-card'

export interface ILoanTransactionPrintFormProps extends IClassProps {}

export type TLoanApproveReleaseDisplayMode =
    | 'approve'
    | 'undo-approve'
    | 'release'

const LoanApproveReleaseDisplayModal = ({
    className,
    title = 'Loan Approval & Release',
    description = 'Please check the loan summary before taking action',
    readOnly,
    mode,
    loanTransaction,
    onSuccess,
    ...props
}: IModalProps & {
    mode: TLoanApproveReleaseDisplayMode
    readOnly?: boolean
    onSuccess?: (data: ILoanTransaction) => void
    loanTransaction: ILoanTransaction
}) => {
    const loanSignatureModal = useModalState()
    const { onOpen } = useConfirmModalStore()
    const memberProfile = loanTransaction.member_profile
    const approveMutation = useApproveLoanTransaction({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
        },
    })
    const undoApproveMutation = useUndoApproveLoanTransaction({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
        },
    })
    const releaseMutation = useReleaseLoanTransaction({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
        },
    })

    const handleUndoApprove = () => {
        console.log('clicked')
        onOpen({
            title: 'Unapprove Loan',
            description: 'Do you want to Unapprove this Loan?',
            confirmString: 'Unapprove Loan',
            onConfirm: () =>
                toast.promise(
                    undoApproveMutation.mutateAsync({
                        loanTransactionId: loanTransaction.id,
                    }),
                    {
                        loading: 'Unapproving loan...',
                        success: 'Loan Approval Removed',
                        error: (error) =>
                            serverRequestErrExtractor({
                                error,
                            }),
                    }
                ),
        })
    }

    const handleApprove = () => {
        toast.promise(
            approveMutation.mutateAsync({
                loanTransactionId: loanTransaction.id,
            }),
            {
                loading: 'Approving...',
                success: 'Loan Approved',
                error: (error) =>
                    serverRequestErrExtractor({
                        error,
                    }),
            }
        )
    }

    const handleRelease = () => {
        onOpen({
            title: 'Release Loan',
            description:
                'Once released, this loan is final and cannot be undone. Are you sure you want to release?',
            confirmString: 'Release Loan',
            onConfirm: () =>
                toast.promise(
                    releaseMutation.mutateAsync({
                        loanTransactionId: loanTransaction.id,
                    }),
                    {
                        loading: 'Releasing loan...',
                        success: 'Loan Released',
                        error: (error) =>
                            serverRequestErrExtractor({
                                error,
                            }),
                    }
                ),
        })
    }

    return (
        <Modal
            className={cn('!max-w-2xl', className)}
            description={description}
            descriptionClassName="sr-only"
            title={title}
            titleClassName="sr-only"
            {...props}
        >
            <div className="space-y-4 max-w-full min-w-0">
                <LoanTransactionSignatureUpdateFormModal
                    {...loanSignatureModal}
                    formProps={{
                        loanTransactionId: loanTransaction.id,
                        defaultValues: loanTransaction,
                    }}
                />
                {memberProfile && (
                    <MemberProfileInfoViewLoanCard
                        className="bg-gradient-to-r from-primary/20 to-card/10 p-4 ring-2 ring-card dark:ring-primary/40"
                        memberProfile={memberProfile}
                    />
                )}
                <LoanMiniInfoCard loanTransaction={loanTransaction} />
                <div className="p-2 max-w-full mx-auto min-w-0 flex items-center gap-x-4 rounded bg-secondary/40 ring-2 ring-secondary/60">
                    <span className="text-muted-foreground/70 shrink-0">
                        <TicketIcon className="inline mr-2 size-5" />
                        Voucher
                    </span>
                    <Separator className="min-h-8" orientation="vertical" />
                    <p className="font-mono text-xl text-nowrap overflow-x-scroll ecoop-scroll tracking-wider max-w-full">
                        {loanTransaction.voucher}
                    </p>
                </div>
                {mode === 'release' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-warning dark:bg-warning/40 text-warning-foreground border-warning-foreground/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-warning-foreground" />
                        <span className="text-sm font-medium">
                            Once released, this loan is <b>final</b> and cannot
                            be undone.
                        </span>
                    </div>
                )}
                {mode === 'approve' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-accent/60 text-accent-foreground border-accent/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-accent-foreground" />
                        <span className="text-sm font-medium">
                            Please review all details before <b>approving</b>{' '}
                            this loan.
                        </span>
                    </div>
                )}
                {mode === 'undo-approve' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-destructive/10 text-destructive border-destructive/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-destructive" />
                        <span className="text-sm font-medium">
                            Unapproving will revert the loan to a previous state
                            (Printed).
                        </span>
                    </div>
                )}
                <div className="flex gap-x-2 items-center justify-end">
                    <Button
                        onClick={() => loanSignatureModal.onOpenChange(true)}
                        variant="outline"
                    >
                        <SignatureLightIcon className="mr-1" />
                        Signature
                    </Button>
                    {mode === 'undo-approve' && (
                        <Button
                            disabled={undoApproveMutation.isPending || readOnly}
                            onClick={() => {
                                handleUndoApprove()
                            }}
                            variant="destructive"
                        >
                            {undoApproveMutation.isPending ? (
                                <LoadingSpinner className="mr-1" />
                            ) : (
                                <UndoIcon className="mr-1" />
                            )}
                            Undo Loan Approval
                        </Button>
                    )}
                    {mode === 'approve' && (
                        <Button
                            disabled={approveMutation.isPending || readOnly}
                            onClick={handleApprove}
                        >
                            {approveMutation.isPending ? (
                                <LoadingSpinner className="mr-1" />
                            ) : (
                                <ThumbsUpIcon className="mr-1" />
                            )}
                            Approve Loan
                        </Button>
                    )}
                    {mode === 'release' && (
                        <Button
                            disabled={releaseMutation.isPending || readOnly}
                            onClick={handleRelease}
                        >
                            {releaseMutation.isPending ? (
                                <LoadingSpinner className="mr-1" />
                            ) : (
                                <BadgeCheckFillIcon className="mr-1" />
                            )}
                            Release Loan
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default LoanApproveReleaseDisplayModal
