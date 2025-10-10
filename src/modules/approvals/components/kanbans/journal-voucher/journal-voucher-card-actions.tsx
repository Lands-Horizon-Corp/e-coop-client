import { IJournalVoucher } from '@/modules/journal-voucher'
import { JournalVoucherTagsManagerPopover } from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import JournalVoucherApproveReleaseDisplayModal, {
    TJournalVoucherApproveReleaseDisplayMode,
} from '@/modules/journal-voucher/components/forms/journal-voucher-approve-release-modal'
import JournalVoucherPrintFormModal from '@/modules/journal-voucher/components/forms/journal-voucher-create-print-modal'
import JournalVoucherCreateUpdateFormModal from '@/modules/journal-voucher/components/forms/journal-voucher-create-update-modal'
import JournalVoucherOtherAction from '@/modules/journal-voucher/components/tables/journal-voucher-other-action'

import { EyeIcon, PencilFillIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import {
    IJournalVoucherCardProps,
    IJournalVoucherStatusDates,
} from './journal-voucher-kanban'

interface UseJournalVoucherActionsProps {
    journalVoucher: IJournalVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
}

type UseCardKanbanActionsProps = {
    journalVoucher: IJournalVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
}

const useJournalVoucherActions = ({
    journalVoucher,
}: UseJournalVoucherActionsProps) => {
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

    return {
        journalVoucher,
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
    }
}
const useCardKanbanActions = ({
    journalVoucher,
    refetch,
}: UseCardKanbanActionsProps) => {
    const journalVoucherModalState = useModalState(false)

    const handleOpenViewModal = () => {
        journalVoucherModalState.onOpenChange(true)
    }

    return {
        handleOpenViewModal,
        journalVoucherModalState,
        journalVoucher,
        refetch,
    }
}
export const JournalVoucherCardActions = ({
    journalVoucher,
    refetch,
}: Pick<IJournalVoucherCardProps, 'journalVoucher' | 'refetch'> & {
    jvDates: IJournalVoucherStatusDates
}) => {
    const {
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
    } = useJournalVoucherActions({ journalVoucher, refetch })

    const isReleased = !!journalVoucher.released_date

    const { handleOpenViewModal, journalVoucherModalState } =
        useCardKanbanActions({ journalVoucher, refetch })

    return (
        <>
            <JournalVoucherCreateUpdateFormModal
                {...journalVoucherModalState}
                formProps={{
                    defaultValues: journalVoucher,
                    readOnly: true,
                }}
            />
            <JournalVoucherPrintFormModal
                {...printModal}
                formProps={{
                    defaultValues: { ...journalVoucher },
                    journalVoucherId: journalVoucher.id,
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
                        <JournalVoucherApproveReleaseDisplayModal
                            {...modalState}
                            journalVoucher={journalVoucher}
                            mode={
                                mode as TJournalVoucherApproveReleaseDisplayMode
                            }
                            onSuccess={() => {
                                refetch?.()
                            }}
                        />
                    </div>
                )
            })}
            <div className="w-full flex items-center space-x-1 justify-start flex-shrink-0">
                <JournalVoucherTagsManagerPopover
                    journalVoucherId={journalVoucher.id}
                    size="sm"
                />
                <Button
                    aria-label="View Journal Voucher"
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
                            <JournalVoucherOtherAction
                                onApprove={handleApproveModal}
                                onPrint={handleOpenPrintModal}
                                onRefetch={refetch}
                                onRelease={handleReleaseModal}
                                row={journalVoucher}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </>
    )
}
