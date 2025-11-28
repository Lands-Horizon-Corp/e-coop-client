import PrintReportFormModal from '@/modules/generated-report/components/forms/print-modal-config'
import { useGenerateReport } from '@/modules/generated-report/components/generate-report-hooks/use-report-generate'
import { IJournalVoucher } from '@/modules/journal-voucher'
import { JournalVoucherTagsManagerPopover } from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import JournalVoucherApproveReleaseDisplayModal, {
    TJournalVoucherApproveReleaseDisplayMode,
} from '@/modules/journal-voucher/components/forms/journal-voucher-approve-release-modal'
import JournalVoucherPrintFormModal from '@/modules/journal-voucher/components/forms/journal-voucher-create-print-modal'
import JournalVoucherCreateUpdateFormModal from '@/modules/journal-voucher/components/forms/journal-voucher-create-update-modal'
import JournalVoucherOtherAction from '@/modules/journal-voucher/components/tables/journal-voucher-other-action'
import useGeneratedReportConfigStore from '@/store/generated-report-config-store'

import { EyeIcon, PencilFillIcon } from '@/components/icons'
import { JournalVoucherTemplates } from '@/components/templates/template-journal-entry'
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
const useJournalVoucherActions = ({
    journalVoucher,
}: UseJournalVoucherActionsProps) => {
    const printModal = useModalState()
    const approveModal = useModalState()
    const releaseModal = useModalState()
    const generateReport = useModalState()
    const journalVoucherModalState = useModalState(false)

    const handleOpenViewModal = () => {
        journalVoucherModalState.onOpenChange(true)
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
    const hanldeGenerateReport = () => {
        generateReport.onOpenChange(true)
    }
    return {
        journalVoucher,
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
        handleOpenViewModal,
        journalVoucherModalState,
        generateReport,
        hanldeGenerateReport,
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
        handleOpenViewModal,
        journalVoucherModalState,
        generateReport,
    } = useJournalVoucherActions({ journalVoucher, refetch })

    const isReleased = !!journalVoucher.released_date

    const { clear } = useGeneratedReportConfigStore()

    const createGeneratedReport = useGenerateReport({
        onSuccess: () => {
            clear()
        },
    })

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
                        createGeneratedReport?.handleGenerateReport()
                        printModal.onOpenChange(false)
                    },
                }}
            />
            <PrintReportFormModal
                {...generateReport}
                formProps={{
                    defaultValues: {
                        name: 'Journal Voucher ',
                        description: 'Generated Journal Voucher',
                        model: 'JournalVoucher',
                        generated_report_type: 'pdf',
                        url: `/api/v1/journal-voucher/${journalVoucher.id}`,
                    },
                    onSuccess: () => {
                        handleOpenPrintModal()
                        generateReport.onOpenChange(false)
                    },
                    onSubmit: () => {
                        handleOpenPrintModal()
                    },
                    templateOptions: JournalVoucherTemplates,
                }}
                title="Generate to Print"
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
                    onSuccess={refetch}
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
                                onPrint={() => {
                                    generateReport.onOpenChange(true)
                                }}
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
