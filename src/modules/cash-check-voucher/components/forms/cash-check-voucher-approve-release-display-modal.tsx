import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { JournalKanbanInfoItem } from '@/modules/approvals/components/kanbans/journal-voucher-kanban'
import useConfirmModalStore from '@/store/confirm-modal-store'

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
    useCashCheckVoucherActions,
    useEditPrintCashCheckVoucher,
} from '../../cash-check-voucher.service'
import { ICashCheckVoucher } from '../../cash-check-voucher.types'
import { CashCheckVoucherCard } from '../cash-check-voucher-info-card'

export interface ICashCheckVoucherApproveReleaseDisplayModalProps
    extends IClassProps {}

export type TJournalVoucherApproveReleaseDisplayMode =
    | 'approve'
    | 'undo-approve'
    | 'release'

const CashCheckVoucherApproveReleaseDisplayModal = ({
    className,
    title = 'Cash/Check Voucher Approval & Release',
    description = 'Please check the voucher summary before taking action',
    readOnly,
    mode,
    cashCheckVoucher,
    onSuccess,
    ...props
}: IModalProps & {
    mode: TJournalVoucherApproveReleaseDisplayMode
    readOnly?: boolean
    onSuccess?: (data: ICashCheckVoucher) => void
    cashCheckVoucher: ICashCheckVoucher
}) => {
    const { onOpen } = useConfirmModalStore()

    // Hook for 'undo-approve' and 'release' actions
    const handleCashCheckAction = useCashCheckVoucherActions({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
            onError: (error) => {
                toast.error(
                    serverRequestErrExtractor({ error }) ||
                        'Failed to perform action.'
                )
            },
        },
    })
    // Hook for 'approve' action (uses the print service for approval status update)
    const handlePrintAction = useEditPrintCashCheckVoucher({
        options: {
            onSuccess: (data) => {
                onSuccess?.(data)
                props.onOpenChange?.(false)
            },
            onError: (error) => {
                toast.error(
                    serverRequestErrExtractor({ error }) ||
                        'Failed to update print/approval status.'
                )
            },
        },
    })

    const handleUndoApprove = () => {
        onOpen({
            title: 'Unapprove Cash/Check Voucher',
            description: 'Do you want to Unapprove this Cash/Check Voucher?',
            confirmString: 'Unapprove Voucher',
            onConfirm: () =>
                toast.promise(
                    handleCashCheckAction.mutateAsync({
                        cash_check_voucher_id: cashCheckVoucher.id,
                        mode: 'approve-undo',
                    }),
                    {
                        loading: 'Unapproving voucher...',
                        success: 'Cash/Check Voucher Approval Removed',
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
                cash_check_voucher_id: cashCheckVoucher.id,
                mode: 'approve',
            }),
            {
                loading: 'Approving...',
                success: 'Cash/Check Voucher Approved',
                error: (error) =>
                    serverRequestErrExtractor({
                        error,
                    }),
            }
        )
    }

    const handleRelease = () => {
        onOpen({
            title: 'Release Cash/Check Voucher',
            description:
                'Once released, this voucher is final and cannot be undone. Are you sure you want to release?',
            confirmString: 'Release Voucher',
            onConfirm: () =>
                toast.promise(
                    handleCashCheckAction.mutateAsync({
                        cash_check_voucher_id: cashCheckVoucher.id,
                        mode: 'release',
                    }),
                    {
                        loading: 'Releasing voucher...',
                        success: 'Cash/Check Voucher Released',
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
            className={cn('!max-w-3xl', className)}
            description={description}
            descriptionClassName="sr-only"
            title={title}
            titleClassName="sr-only"
            {...props}
        >
            <div className="space-y-4 max-w-full min-w-0 pt-2">
                <CashCheckVoucherCard cashCheckVoucher={cashCheckVoucher} />
                <JournalKanbanInfoItem
                    className="!p-2"
                    content={cashCheckVoucher.cash_voucher_number}
                    icon={<TicketIcon className="inline mr-2 size-5" />}
                    infoTitle={cashCheckVoucher.cash_voucher_number}
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
                            disabled={
                                handleCashCheckAction.isPending || readOnly
                            }
                            onClick={handleUndoApprove}
                            variant="destructive"
                        >
                            {handleCashCheckAction.isPending ? (
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
                            disabled={
                                handleCashCheckAction.isPending || readOnly
                            }
                            onClick={handleRelease}
                        >
                            {handleCashCheckAction.isPending ? (
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

export default CashCheckVoucherApproveReleaseDisplayModal
