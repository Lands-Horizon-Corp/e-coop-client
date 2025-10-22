import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { JournalKanbanInfoItem } from '@/modules/approvals/components/kanbans/journal-voucher/journal-voucher-card'
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
    useEditPrintJournalVoucher,
    useJournalVoucherActions,
} from '../../journal-voucher.service'
import { IJournalVoucher } from '../../journal-voucher.types'
import { JournalVoucherCard } from '../Journal-voucher-card'
import {
    JournalVoucherReleaseCurrencyMismatchDisplay,
    JournalVoucherReleaseNoTransactionBatchDisplay,
} from '../modal-displays/journal-voucher-release-invalid'

export interface IJournalVoucherApproveReleaseDisplayModalProps
    extends IClassProps {}

export type TJournalVoucherApproveReleaseDisplayMode =
    | 'approve'
    | 'undo-approve'
    | 'release'

const JournalVoucherApproveReleaseDisplayModal = ({
    className,
    title = 'Journal Voucher Approval & Release',
    description = 'Please check the voucher summary before taking action',
    readOnly,
    mode,
    journalVoucher,
    onSuccess,
    ...props
}: IModalProps & {
    mode: TJournalVoucherApproveReleaseDisplayMode
    readOnly?: boolean
    onSuccess?: (data: IJournalVoucher) => void
    journalVoucher: IJournalVoucher
}) => {
    const { onOpen } = useConfirmModalStore()
    const { data: currentTransactionBatch } = useTransactionBatchStore()
    const { onOpen: onOpenInfoModal } = useInfoModalStore()

    const handleJournalAction = useJournalVoucherActions({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
        },
    })
    const handlePrintAction = useEditPrintJournalVoucher({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
        },
    })
    const handleUndoApprove = () => {
        onOpen({
            title: 'Unapprove Journal Voucher',
            description: 'Do you want to Unapprove this Journal Voucher?',
            confirmString: 'Unapprove Voucher',
            onConfirm: () =>
                toast.promise(
                    handleJournalAction.mutateAsync({
                        journal_voucher_id: journalVoucher.id,
                        mode: 'approve-undo',
                    }),
                    {
                        loading: 'Unapproving voucher...',
                        success: 'Journal Voucher Approval Removed',
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
            handlePrintAction.mutateAsync({
                journal_voucher_id: journalVoucher.id,
                mode: 'approve',
            }),
            {
                loading: 'Approving...',
                success: 'Journal Voucher Approved',
                error: (error) =>
                    serverRequestErrExtractor({
                        error,
                    }),
            }
        )
    }
    const handleRelease = () => {
        onOpen({
            title: 'Release Journal Voucher',
            description:
                'Once released, this voucher is final and cannot be undone. Are you sure you want to release?',
            confirmString: 'Release Voucher',
            onConfirm: () =>
                toast.promise(
                    handleJournalAction.mutateAsync({
                        journal_voucher_id: journalVoucher.id,
                        mode: 'release',
                    }),
                    {
                        loading: 'Releasing voucher...',
                        success: 'Journal Voucher Released',
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
            <div className="space-y-4 max-w-full min-w-0 pt-2">
                <JournalVoucherCard journalVoucher={journalVoucher} />
                <JournalKanbanInfoItem
                    className="!p-2"
                    content={journalVoucher.cash_voucher_number}
                    icon={<TicketIcon className="inline mr-2 size-5" />}
                    infoTitle={journalVoucher.cash_voucher_number}
                    title="Voucher Number"
                />
                {mode === 'release' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-warning dark:bg-warning/40 text-warning-foreground border-warning-foreground/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-warning-foreground" />
                        <span className="text-sm font-medium">
                            Once released, this voucher is <b>final</b> and
                            cannot be undone.
                        </span>
                    </div>
                )}
                {mode === 'approve' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-accent/60 text-accent-foreground border-accent/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-accent-foreground" />
                        <span className="text-sm font-medium">
                            Please review all details before <b>approving</b>{' '}
                            this voucher.
                        </span>
                    </div>
                )}
                {mode === 'undo-approve' && (
                    <div className="flex items-center gap-2 px-3 py-2 rounded bg-destructive/10 text-destructive border-destructive/20 border mr-auto">
                        <WarningFillIcon className="size-5 text-destructive" />
                        <span className="text-sm font-medium">
                            Unapproving will revert the voucher to a previous
                            state (Printed/Posted).
                        </span>
                    </div>
                )}
                <div className="flex gap-x-2 items-center justify-end">
                    {mode === 'undo-approve' && (
                        <Button
                            disabled={handleJournalAction.isPending || readOnly}
                            onClick={handleUndoApprove}
                            variant="destructive"
                        >
                            {handleJournalAction.isPending ? (
                                <LoadingSpinner className="mr-1" />
                            ) : (
                                <UndoIcon className="mr-1" />
                            )}
                            Undo Voucher Approval
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
                            Approve Voucher
                        </Button>
                    )}
                    {mode === 'release' && (
                        <Button
                            disabled={handleJournalAction.isPending || readOnly}
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
                                            <JournalVoucherReleaseNoTransactionBatchDisplay />
                                        ),
                                    })

                                if (
                                    journalVoucher.currency_id !==
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
                                            <JournalVoucherReleaseCurrencyMismatchDisplay />
                                        ),
                                    })

                                handleRelease()
                            }}
                        >
                            {handleJournalAction.isPending ? (
                                <LoadingSpinner className="mr-1" />
                            ) : (
                                <BadgeCheckFillIcon className="mr-1" />
                            )}
                            Release Voucher
                        </Button>
                    )}
                </div>
            </div>
        </Modal>
    )
}

export default JournalVoucherApproveReleaseDisplayModal
