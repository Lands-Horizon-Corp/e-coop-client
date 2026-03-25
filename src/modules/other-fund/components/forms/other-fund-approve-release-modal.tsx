import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
// Assuming this exists
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useInfoModalStore } from '@/store/info-modal-store'

import {
    BadgeCheckFillIcon,
    ThumbsUpIcon,
    TicketIcon,
    UndoIcon,
    WarningFillIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { IClassProps } from '@/types'

import {
    OtherFundCard,
    OtherFundKanbanInfoItem,
} from '../../../approvals/components/kanbans/other-fund/other-fund-card'
import {
    useEditPrintOtherFund,
    useOtherFundActions,
} from '../../other-fund.service'
import { IOtherFund } from '../../other-fund.types'
import {
    OtherFundReleaseCurrencyMismatchDisplay,
    OtherFundReleaseNoTransactionBatchDisplay,
} from '../other-fund-release-invalid'

// -----------------------------------

export interface IOtherFundApproveReleaseDisplayModalProps extends IClassProps {}

export type TOtherFundApproveReleaseDisplayMode =
    | 'approve'
    | 'undo-approve'
    | 'release'

const OtherFundApproveReleaseDisplayModal = ({
    className,
    title = 'Other Fund Approval & Release',
    description = 'Please check the fund summary before taking action',
    readOnly,
    mode,
    otherFund,
    onSuccess,
    ...props
}: IModalProps & {
    mode: TOtherFundApproveReleaseDisplayMode
    readOnly?: boolean
    onSuccess?: (data: IOtherFund) => void
    otherFund: IOtherFund
}) => {
    const { onOpen } = useConfirmModalStore()
    const { data: currentTransactionBatch } = useTransactionBatchStore()
    const { onOpen: onOpenInfoModal } = useInfoModalStore()

    const handleFundAction = useOtherFundActions({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
        },
    })

    const handlePrintAction = useEditPrintOtherFund({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
        },
    })

    const handleUndoApprove = () => {
        onOpen({
            title: 'Unapprove Other Fund',
            description: 'Do you want to Unapprove this Other Fund record?',
            confirmString: 'Unapprove Fund',
            onConfirm: () =>
                toast.promise(
                    handleFundAction.mutateAsync({
                        other_fund_id: otherFund.id,
                        mode: 'approve-undo',
                    }),
                    {
                        loading: 'Unapproving fund...',
                        success: 'Other Fund Approval Removed',
                        error: (error) => serverRequestErrExtractor({ error }),
                    }
                ),
        })
    }

    const handleApprove = () => {
        toast.promise(
            handlePrintAction.mutateAsync({
                other_fund_id: otherFund.id,
                mode: 'approve',
            }),
            {
                loading: 'Approving...',
                success: 'Other Fund Approved',
                error: (error) => serverRequestErrExtractor({ error }),
            }
        )
    }

    const handleRelease = () => {
        onOpen({
            title: 'Release Other Fund',
            description:
                'Once released, this record is final and cannot be undone. Are you sure you want to release?',
            confirmString: 'Release Fund',
            onConfirm: () =>
                toast.promise(
                    handleFundAction.mutateAsync({
                        other_fund_id: otherFund.id,
                        mode: 'release',
                    }),
                    {
                        loading: 'Releasing fund...',
                        success: 'Other Fund Released',
                        error: (error) => serverRequestErrExtractor({ error }),
                    }
                ),
        })
    }

    return (
        <Modal
            className={cn('max-w-2xl!', className)}
            description={description}
            descriptionClassName="sr-only"
            title={title}
            titleClassName="sr-only"
            {...props}
        >
            <div className="space-y-4 max-w-full min-w-0 pt-2">
                <OtherFundCard otherFund={otherFund} refetch={() => {}} />

                <OtherFundKanbanInfoItem
                    className="p-2!"
                    content={otherFund.cash_voucher_number}
                    icon={<TicketIcon className="inline mr-2 size-5" />}
                    infoTitle={otherFund.cash_voucher_number}
                    title="Voucher Number"
                />

                {/* Warning Banners */}
                {mode === 'release' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-warning dark:bg-warning/40 text-warning-foreground border-warning-foreground/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-warning-foreground" />
                        <span className="text-sm font-medium">
                            Once released, this record is <b>final</b> and
                            cannot be undone.
                        </span>
                    </div>
                )}

                {mode === 'approve' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-accent/60 text-accent-foreground border-accent/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-accent-foreground" />
                        <span className="text-sm font-medium">
                            Please review all details before <b>approving</b>{' '}
                            this record.
                        </span>
                    </div>
                )}

                {mode === 'undo-approve' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-destructive/10 text-destructive border-destructive/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-destructive" />
                        <span className="text-sm font-medium">
                            Unapproving will revert the record to a previous
                            state (Printed/Posted).
                        </span>
                    </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-x-2 items-center justify-end">
                    {mode === 'undo-approve' && (
                        <Button
                            disabled={handleFundAction.isPending || readOnly}
                            onClick={handleUndoApprove}
                            variant="destructive"
                        >
                            {handleFundAction.isPending ? (
                                <LoadingSpinner className="mr-1" />
                            ) : (
                                <UndoIcon className="mr-1" />
                            )}
                            Undo Fund Approval
                        </Button>
                    )}

                    {mode === 'approve' && (
                        <Button
                            disabled={handlePrintAction.isPending || readOnly}
                            onClick={handleApprove}
                        >
                            {handlePrintAction.isPending ? (
                                <LoadingSpinner className="mr-1" />
                            ) : (
                                <ThumbsUpIcon className="mr-1" />
                            )}
                            Approve Fund
                        </Button>
                    )}

                    {mode === 'release' && (
                        <Button
                            disabled={handleFundAction.isPending || readOnly}
                            onClick={() => {
                                if (!currentTransactionBatch)
                                    return onOpenInfoModal({
                                        title: '',
                                        hideSeparator: true,
                                        confirmString: 'Okay',
                                        classNames: {
                                            footerActionClassName:
                                                'justify-center',
                                            closeButtonClassName: 'w-full',
                                        },
                                        component: (
                                            <OtherFundReleaseNoTransactionBatchDisplay />
                                        ),
                                    })

                                if (
                                    otherFund.currency_id !==
                                    currentTransactionBatch?.currency_id
                                )
                                    return onOpenInfoModal({
                                        title: '',
                                        hideSeparator: true,
                                        confirmString: 'Okay',
                                        classNames: {
                                            footerActionClassName:
                                                'justify-center',
                                            closeButtonClassName: 'w-full',
                                        },
                                        component: (
                                            <OtherFundReleaseCurrencyMismatchDisplay />
                                        ),
                                    })

                                handleRelease()
                            }}
                        >
                            {handleFundAction.isPending ? (
                                <LoadingSpinner className="mr-1" />
                            ) : (
                                <BadgeCheckFillIcon className="mr-1" />
                            )}
                            Release Fund
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default OtherFundApproveReleaseDisplayModal
