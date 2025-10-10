import { dateAgo } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import {
    ICashCheckVoucher,
    TCashCheckVoucherStatus,
    useGetAllCashCheckVoucher,
} from '@/modules/cash-check-voucher'
import {
    CashCheckVoucherTagChip,
    CashCheckVoucherTagsManagerPopover,
} from '@/modules/cash-check-voucher-tag/components/cash-check-voucher-tag-manager'
import CashCheckVoucherStatusIndicator from '@/modules/cash-check-voucher/components/cash-check-status-indicator'
import CashCheckVoucherTransactionSignatureUpdateFormModal from '@/modules/cash-check-voucher/components/forms/cash-check-signature-form-modal'
import CashCheckVoucherApproveReleaseDisplayModal from '@/modules/cash-check-voucher/components/forms/cash-check-voucher-approve-release-display-modal'
import CashCheckVoucherCreateUpdateFormModal from '@/modules/cash-check-voucher/components/forms/cash-check-voucher-create-udate-form-modal'
import CashCheckVoucherPrintFormModal from '@/modules/cash-check-voucher/components/forms/cash-check-voucher-print-form-modal'
import CashCheckVoucherOtherAction from '@/modules/cash-check-voucher/components/tables/cash-check-other-voucher'
import { TCashCheckVoucherApproveReleaseDisplayMode } from '@/modules/cash-check-voucher/components/tables/row-action-context'
import { CheckCircle2Icon, PrinterIcon } from 'lucide-react'

import {
    BadgeCheckFillIcon,
    DraftIcon,
    EyeIcon,
    IdCardIcon,
    MoneyBagIcon,
    PencilFillIcon,
    SignatureLightIcon,
    TicketIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import { JournalVoucherSkeletonCard } from '../../../journal-voucher/components/journal-voucher-skeleton-card'
import { JournalKanbanInfoItem } from './journal-voucher-kanban'

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

type CashCheckVoucherKanbanProps = {
    mode: TCashCheckVoucherStatus
}

interface ICCVStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

interface ICashCheckVoucherCardProps extends IClassProps {
    cashCheckVoucher: ICashCheckVoucher
    refetch: () => void
}

const CashCheckVoucherCardActions = ({
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
export const CashCheckVoucherCardCreatorInfo = ({
    cashCheckVoucher,
}: Pick<ICashCheckVoucherCardProps, 'cashCheckVoucher'>) => {
    return (
        <div className="flex items-center justify-end  gap-x-2">
            <div className=" inline-flex items-center gap-2">
                <InfoTooltip
                    content={`created by ${cashCheckVoucher.created_by?.full_name}`}
                >
                    <div className="text-right max-w-[200px] shrink">
                        <p className="truncate font-medium text-sm text-foreground/90">
                            {cashCheckVoucher.created_by?.full_name}
                        </p>
                        <p className="text-xs text-end text-muted-foreground/70 truncate">
                            created by
                        </p>
                    </div>
                </InfoTooltip>
                <ImageDisplay
                    className="size-8 rounded-full"
                    src={cashCheckVoucher?.created_by?.media?.download_url}
                />
            </div>
        </div>
    )
}

export const CashCheckVoucherCard = ({
    cashCheckVoucher,
    className,
    refetch,
}: ICashCheckVoucherCardProps) => {
    const ccvDates: ICCVStatusDates = {
        printed_date: cashCheckVoucher.printed_date,
        approved_date: cashCheckVoucher.approved_date,
        released_date: cashCheckVoucher.released_date,
    }
    return (
        <div
            className={cn(
                'group space-y-3 relative rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10',
                className
            )}
        >
            <div className="flex justify-between items-start">
                <CashCheckVoucherStatusIndicator
                    className="flex-shrink-0"
                    voucherDates={ccvDates}
                />
                <p className="text-xs text-end text-muted-foreground/70 truncate">
                    {dateAgo(cashCheckVoucher.created_at)}
                </p>
            </div>
            <InfoTooltip content={cashCheckVoucher.name}>
                <p className="truncate text-lg font-bold text-foreground/95">
                    {cashCheckVoucher.name ? cashCheckVoucher.name : '-'}
                </p>
            </InfoTooltip>

            {cashCheckVoucher.cash_voucher_number && (
                <JournalKanbanInfoItem
                    content={cashCheckVoucher.cash_voucher_number}
                    icon={<TicketIcon className="inline mr-2 size-5" />}
                    infoTitle="Voucher Number"
                    title="Voucher"
                />
            )}
            <div className="flex gap-x-2 grow">
                <JournalKanbanInfoItem
                    content={cashCheckVoucher.total_debit}
                    icon={<IdCardIcon className="inline mr-2 size-5" />}
                    infoTitle="Total Debit"
                    title="Debit"
                />
                <JournalKanbanInfoItem
                    content={cashCheckVoucher.total_credit}
                    icon={<IdCardIcon className="inline mr-2 size-5" />}
                    infoTitle="Total Credit"
                    title="Credit"
                />
            </div>
            <JournalKanbanInfoItem
                content={cashCheckVoucher.pay_to || '-'}
                icon={<MoneyBagIcon className="inline mr-2 size-5" />}
                infoTitle="Pay To"
                title="Pay To"
            />
            <div className="w-full flex flex-wrap gap-1 max-h-16 ecoop-scroll overflow-x-auto ">
                {cashCheckVoucher?.cash_check_voucher_tags?.map((tag) => (
                    <CashCheckVoucherTagChip
                        key={tag.id}
                        onRemove={() => {
                            refetch()
                        }}
                        tag={tag}
                    />
                ))}
            </div>
            <CashCheckVoucherCardActions
                cashCheckVoucher={cashCheckVoucher}
                ccvDates={ccvDates}
                refetch={refetch}
            />

            <CashCheckVoucherCardCreatorInfo
                cashCheckVoucher={cashCheckVoucher}
            />
        </div>
    )
}

const CashCheckVoucherKanbanMain = ({ mode }: CashCheckVoucherKanbanProps) => {
    const { data, isLoading, refetch, isRefetching } =
        useGetAllCashCheckVoucher()

    const dataFiltered = data?.filter((ccv) => {
        const isDraft =
            !ccv.printed_date && !ccv.approved_date && !ccv.released_date

        if (mode === 'draft') return isDraft
        if (mode === 'printed')
            return ccv.printed_date && !ccv.approved_date && !ccv.released_date
        if (mode === 'approved')
            return ccv.printed_date && ccv.approved_date && !ccv.released_date
        if (mode === 'released')
            return ccv.printed_date && ccv.approved_date && ccv.released_date
        return false
    })

    if (isLoading) return <JournalVoucherSkeletonCard />

    const modeText = mode.charAt(0).toUpperCase() + mode.slice(1)

    return (
        <div>
            <KanbanContainer className="w-[420px]">
                <div className="flex items-center">
                    {mode === 'draft' && (
                        <DraftIcon className="mr-2 size-4 text-muted-foreground" />
                    )}
                    {mode === 'printed' && (
                        <PrinterIcon className="mr-2 size-4 text-blue-500" />
                    )}
                    {mode === 'approved' && (
                        <CheckCircle2Icon className="mr-2 size-4 text-green-500" />
                    )}
                    {mode === 'released' && (
                        <BadgeCheckFillIcon className="mr-2 size-4 text-primary" />
                    )}
                    <KanbanTitle
                        isLoading={isRefetching}
                        onRefresh={() => refetch()}
                        title={`${modeText}`}
                        titleClassName="Capitalize"
                        totalItems={dataFiltered?.length}
                    />
                </div>
                <Separator />
                <KanbanItemsContainer>
                    {dataFiltered?.map((ccv) => (
                        <div key={ccv.id}>
                            <CashCheckVoucherCard
                                cashCheckVoucher={ccv}
                                className="mb-2"
                                refetch={refetch}
                            />
                        </div>
                    ))}
                    {dataFiltered?.length === 0 && (
                        <p className="text-center text-xs text-muted-foreground/60">
                            No vouchers in this stage.
                        </p>
                    )}
                </KanbanItemsContainer>
            </KanbanContainer>
        </div>
    )
}

const CashCheckVoucherKanban = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                'w-full flex space-x-5 p-2 ecoop-scroll overflow-auto',
                className
            )}
        >
            {['draft', 'printed', 'approved', 'released'].map((status) => (
                <CashCheckVoucherKanbanMain
                    key={status}
                    mode={status as TCashCheckVoucherStatus}
                />
            ))}
        </div>
    )
}

export default CashCheckVoucherKanban
