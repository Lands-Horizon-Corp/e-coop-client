import PrintReportFormModal from '@/modules/generated-report/components/forms/print-modal-config'
import { useGenerateReport } from '@/modules/generated-report/components/generate-report-hooks/use-report-generate'
import { IOtherFund } from '@/modules/other-fund'
import OtherFundCreateUpdateFormModal from '@/modules/other-fund/components/forms/create-update-other-fund-modal'
import OtherFundApproveReleaseDisplayModal, {
    TOtherFundApproveReleaseDisplayMode,
} from '@/modules/other-fund/components/forms/other-fund-approve-release-modal'
import OtherFundPrintFormModal from '@/modules/other-fund/components/forms/other-fund-print-modal'
import { OtherFundTagsManagerPopover } from '@/modules/other-fund/components/other-fund-tag-manager'
import { OtherFundOtherAction } from '@/modules/other-fund/components/tables/other-fund-other-action'
import useGeneratedReportConfigStore from '@/store/generated-report-config-store'

import { EyeIcon, PencilFillIcon } from '@/components/icons'
// Ensure this exists
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { useModalState } from '@/hooks/use-modal-state'

import { IOtherFundStatusDates } from './other-fund-kanban'

interface UseOtherFundActionsProps {
    otherFund: IOtherFund
    onDeleteSuccess?: () => void
    refetch?: () => void
}

const useOtherFundActions = ({ otherFund }: UseOtherFundActionsProps) => {
    const printModal = useModalState()
    const approveModal = useModalState()
    const releaseModal = useModalState()
    const generateReport = useModalState()
    const otherFundModalState = useModalState(false)

    const handleOpenViewModal = () => {
        otherFundModalState.onOpenChange(true)
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
    const handleGenerateReport = () => {
        generateReport.onOpenChange(true)
    }

    return {
        otherFund,
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
        handleOpenViewModal,
        otherFundModalState,
        generateReport,
        handleGenerateReport,
    }
}

export const OtherFundCardActions = ({
    otherFund,
    refetch,
}: {
    otherFund: IOtherFund
    refetch?: () => void
    fundDates: IOtherFundStatusDates
}) => {
    const {
        printModal,
        handleOpenPrintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
        handleOpenViewModal,
        otherFundModalState,
        generateReport,
    } = useOtherFundActions({ otherFund, refetch })

    const isReleased = !!otherFund.released_date
    const { clear } = useGeneratedReportConfigStore()

    const createGeneratedReport = useGenerateReport({
        onSuccess: () => {
            clear()
        },
    })

    return (
        <>
            {/* View/Update Modal */}
            <OtherFundCreateUpdateFormModal
                {...otherFundModalState}
                formProps={{
                    defaultValues: otherFund,
                    readOnly: true,
                }}
            />

            {/* Final Print Modal (Post-Generation) */}
            <OtherFundPrintFormModal
                {...printModal}
                formProps={{
                    defaultValues: { ...otherFund },
                    otherFundId: otherFund.id,
                    onSuccess: () => {
                        refetch?.()
                        createGeneratedReport?.handleGenerateReport()
                        printModal.onOpenChange(false)
                    },
                }}
            />

            {/* Report Generation Modal */}
            <PrintReportFormModal
                {...generateReport}
                formProps={{
                    defaultValues: {
                        name: 'Other Fund Record',
                        description: 'Generated Fund Voucher',
                        generated_report_type: 'pdf',
                        url: `/api/v1/other-fund/${otherFund.id}`,
                    },
                    onSuccess: () => {
                        handleOpenPrintModal()
                        generateReport.onOpenChange(false)
                    },
                    onSubmit: () => {
                        handleOpenPrintModal()
                    },
                }}
                title="Generate to Print"
            />

            {/* Workflow Modals (Approve/Undo/Release) */}
            {['approve', 'undo-approve', 'release'].map((mode) => {
                const modalState =
                    mode === 'approve' || mode === 'undo-approve'
                        ? approveModal
                        : releaseModal
                return (
                    <div key={mode}>
                        <OtherFundApproveReleaseDisplayModal
                            {...modalState}
                            mode={mode as TOtherFundApproveReleaseDisplayMode}
                            onSuccess={() => {
                                refetch?.()
                            }}
                            otherFund={otherFund}
                        />
                    </div>
                )
            })}

            {/* Card Footer Buttons */}
            <div className="w-full flex items-center space-x-1 justify-start shrink-0">
                <OtherFundTagsManagerPopover
                    onSuccess={refetch}
                    otherFundId={otherFund.id}
                    size="sm"
                />

                <Button
                    aria-label="View Record"
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
                                <PencilFillIcon className="size-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <OtherFundOtherAction
                                onApprove={handleApproveModal}
                                onPrint={() => {
                                    generateReport.onOpenChange(true)
                                }}
                                onRefetch={refetch}
                                onRelease={handleReleaseModal}
                                row={otherFund}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </>
    )
}
