import { ICashCheckVoucher } from '@/modules/cash-check-voucher'
import { CashCheckVoucherTagsManagerPopover } from '@/modules/cash-check-voucher-tag/components/cash-check-voucher-tag-manager'
import CashCheckVoucherTransactionSignatureUpdateFormModal from '@/modules/cash-check-voucher/components/forms/cash-check-signature-form-modal'
import CashCheckVoucherApproveReleaseDisplayModal from '@/modules/cash-check-voucher/components/forms/cash-check-voucher-approve-release-display-modal'
import CashCheckVoucherCreateUpdateFormModal from '@/modules/cash-check-voucher/components/forms/cash-check-voucher-create-udate-form-modal'
import CashCheckVoucherPrintFormModal from '@/modules/cash-check-voucher/components/forms/cash-check-voucher-print-form-modal'
import CashCheckVoucherOtherAction from '@/modules/cash-check-voucher/components/tables/cash-check-other-voucher'
import { TCashCheckVoucherApproveReleaseDisplayMode } from '@/modules/cash-check-voucher/components/tables/row-action-context'

import { EyeIcon, PencilFillIcon, SignatureLightIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

type UseCardKanbanActionsProps = {
    cashCheckVoucher: ICashCheckVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
}

const useCardKanbanActions = ({
    cashCheckVoucher,
    refetch,
}: UseCardKanbanActionsProps) => {
    const cashCheckVoucherModalState = useModalState(false)
    const cashCheckSignatureVoucher = useModalState(false)
    const printModal = useModalState()
    const approveModal = useModalState()
    const releaseModal = useModalState()

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
        cashCheckVoucherModalState.onOpenChange(true)
    }
    const handleCashCheckSignatureVoucher = () => {
        cashCheckSignatureVoucher.onOpenChange(true)
    }

    return {
        handleOpenViewModal,
        cashCheckVoucherModalState,
        cashCheckVoucher,
        refetch,
        cashCheckSignatureVoucher,
        handleCashCheckSignatureVoucher,
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
    }
}

export interface ICCVStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

interface ICashCheckVoucherCardProps extends IClassProps {
    cashCheckVoucher: ICashCheckVoucher
    refetch: () => void
}

export const CashCheckVoucherCardActions = ({
    cashCheckVoucher,
    refetch,
}: Pick<ICashCheckVoucherCardProps, 'cashCheckVoucher' | 'refetch'> & {
    ccvDates: ICCVStatusDates
}) => {
    const isReleased = !!cashCheckVoucher.released_date
    const {
        handleOpenViewModal,
        cashCheckVoucherModalState,
        cashCheckSignatureVoucher,
        handleCashCheckSignatureVoucher,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
        printModal,
        handleOpenPrintModal,
    } = useCardKanbanActions({ cashCheckVoucher, refetch })

    return (
        <>
            <CashCheckVoucherCreateUpdateFormModal
                {...cashCheckVoucherModalState}
                formProps={{
                    defaultValues: cashCheckVoucher,
                    readOnly: true,
                }}
            />
            <CashCheckVoucherPrintFormModal
                {...printModal}
                className="!min-w-[600px]"
                formProps={{
                    cashCheckVoucherId: cashCheckVoucher.id,
                    onSuccess: () => {
                        refetch()
                    },
                }}
            />
            <CashCheckVoucherTransactionSignatureUpdateFormModal
                {...cashCheckSignatureVoucher}
                formProps={{
                    cashCheckVoucherId: cashCheckVoucher.id,
                    defaultValues: { ...cashCheckVoucher },
                    readOnly: isReleased,
                }}
            />
            {['approve', 'undo-approve', 'release'].map((mode) => {
                const modalState =
                    mode === 'approve' ? approveModal : releaseModal
                return (
                    <div key={mode}>
                        <CashCheckVoucherApproveReleaseDisplayModal
                            {...modalState}
                            cashCheckVoucher={cashCheckVoucher}
                            mode={
                                mode as TCashCheckVoucherApproveReleaseDisplayMode
                            }
                            onSuccess={() => {
                                refetch()
                            }}
                        />
                    </div>
                )
            })}
            <div className="w-full flex items-center space-x-1 justify-start flex-shrink-0">
                <CashCheckVoucherTagsManagerPopover
                    cashCheckVoucherId={cashCheckVoucher.id}
                    size="sm"
                />
                <Button
                    className="rounded-full size-fit !p-0 border-accent !py-0.5 !px-1.5"
                    size={'sm'}
                    variant="outline"
                >
                    <SignatureLightIcon className="size-4 mr-1" />
                    <span
                        className="text-sm"
                        onClick={handleCashCheckSignatureVoucher}
                    >
                        Sign
                    </span>
                </Button>
                <Button
                    aria-label="View Cash Check Voucher"
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
                            <CashCheckVoucherOtherAction
                                onApprove={handleApproveModal}
                                onPrint={handleOpenPrintModal}
                                onRefetch={refetch}
                                onRelease={handleReleaseModal}
                                row={cashCheckVoucher}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </>
    )
}
