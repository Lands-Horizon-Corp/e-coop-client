import { toReadableDate } from '@/helpers/date-utils'
import { TGeneratedReportSchema } from '@/modules/generated-report'
import { useReportViewerStore } from '@/modules/generated-report/components/generated-report-view/global-generate-report-viewer.store'
import { getTemplateAt } from '@/modules/generated-report/generated-report-template-registry'
import { IOtherFund } from '@/modules/other-fund'
import OtherFundCreateUpdateFormModal from '@/modules/other-fund/components/forms/create-update-other-fund-modal'
import OtherFundApproveReleaseDisplayModal, {
    TOtherFundApproveReleaseDisplayMode,
} from '@/modules/other-fund/components/forms/other-fund-approve-release-modal'
import OtherFundPrintFormModal from '@/modules/other-fund/components/forms/other-fund-print-modal'
import { OtherFundReprintFormModal } from '@/modules/other-fund/components/forms/other-fund-reprint-form'
import { OtherFundTagsManagerPopover } from '@/modules/other-fund/components/other-fund-tag-manager'
import { OtherFundOtherAction } from '@/modules/other-fund/components/tables/other-fund-other-action'
import { OTHER_FUND_PRINT_TEMPLATES } from '@/modules/other-fund/reports/other-fund-templates'

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
    const reprintModal = useModalState()
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
        reprintModal,
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
        reprintModal,
        approveModal,
        handleApproveModal,
        releaseModal,
        handleReleaseModal,
        handleOpenViewModal,
        otherFundModalState,
    } = useOtherFundActions({ otherFund, refetch })

    const isReleased = !!otherFund.released_date

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

            <OtherFundPrintFormModal
                {...printModal}
                formProps={{
                    defaultValues: {
                        ...otherFund,
                        report_config: {
                            ...getTemplateAt(OTHER_FUND_PRINT_TEMPLATES, 0),
                            name: `other_fund_${toReadableDate(otherFund.created_at, 'MMddyy_mmss')}`,
                            report_name: 'OtherFundRelease',
                        } as TGeneratedReportSchema,
                    },
                    otherFundId: otherFund.id,
                    onSuccess: (data) => {
                        refetch?.()
                        useReportViewerStore.getState().open({
                            reportId: data.id,
                        })
                        close()
                        printModal.onOpenChange(false)
                    },
                }}
            />

            <OtherFundReprintFormModal
                {...reprintModal}
                formProps={{
                    defaultValues: {
                        report_config: {
                            ...getTemplateAt(OTHER_FUND_PRINT_TEMPLATES, 0),
                            name: `other_fund_${toReadableDate(otherFund.created_at, 'MMddyy_mmss')}`,
                            report_name: 'OtherFundRelease',
                        } as TGeneratedReportSchema,
                    },
                    otherFundId: otherFund.id,
                    onSuccess: (data) => {
                        refetch?.()
                        useReportViewerStore.getState().open({
                            reportId: data.id,
                        })
                        close()
                        reprintModal.onOpenChange(false)
                    },
                }}
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
                                    printModal.onOpenChange(true)
                                }}
                                onRefetch={refetch}
                                onRelease={handleReleaseModal}
                                onReprint={() =>
                                    reprintModal.onOpenChange(true)
                                }
                                row={otherFund}
                            />
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </>
    )
}
