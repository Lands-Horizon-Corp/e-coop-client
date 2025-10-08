import { toast } from 'sonner'

import { dateAgo } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import {
    ICashCheckVoucher,
    TCashCheckVoucherActionMode,
    TCashCheckVoucherPrintMode,
    TCashCheckVoucherStatus,
    useCashCheckVoucherActions,
    useEditPrintCashCheckVoucher,
    useGetAllCashCheckVoucher,
} from '@/modules/cash-check-voucher'
import {
    CashCheckVoucherTagChip,
    CashCheckVoucherTagsManagerPopover,
} from '@/modules/cash-check-voucher-tag/components/cash-check-voucher-tag-manager'
import CashCheckVoucherStatusIndicator from '@/modules/cash-check-voucher/components/cash-check-status-indicator'
import CashCheckVoucherTransactionSignatureUpdateFormModal from '@/modules/cash-check-voucher/components/forms/cash-check-signature-form-modal'
import CashCheckVoucherCreateUpdateFormModal from '@/modules/cash-check-voucher/components/forms/cash-check-voucher-create-udate-form-modal'
import {
    CheckCircle2Icon,
    PrinterIcon,
    SendHorizonalIcon,
    Undo2Icon,
    XCircleIcon,
} from 'lucide-react'

import {
    BadgeCheckFillIcon,
    DraftIcon,
    EyeIcon,
    PencilFillIcon,
    SignatureLightIcon,
} from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

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
    }
}

type CashCheckVoucherKanbanProps = {
    mode: TCashCheckVoucherStatus
}
interface UseVoucherActionsProps {
    cashCheckVoucher: ICashCheckVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
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

const CashCheckVoucherOtherAction = ({
    cashCheckVoucher,
    refetch,
}: UseVoucherActionsProps) => {
    const isPrinted = !!cashCheckVoucher.printed_date
    const isApproved = !!cashCheckVoucher.approved_date
    const canApprove = isPrinted && !isApproved
    const canRelease = isPrinted && isApproved

    const showRelease = canRelease && !cashCheckVoucher.released_date
    const showPrint = isPrinted || (!isPrinted && !canApprove && !canRelease)

    const { mutate: mutatePrint, isPending: isPrinting } =
        useEditPrintCashCheckVoucher({
            options: {
                onSuccess: (_, variables) => {
                    const actionText = variables.mode.includes('undo')
                        ? 'undone'
                        : 'updated'
                    toast.success(`Print status ${actionText} successfully.`)
                    refetch?.()
                },
                onError: (error) => {
                    toast.error(
                        error.message || 'Failed to update print status.'
                    )
                },
            },
        })

    const { mutate: performVoucherAction, isPending: isActionPending } =
        useCashCheckVoucherActions({
            options: {
                onSuccess: (_, variables) => {
                    const modeText = variables.mode.replace('-undo', ' undone')
                    toast.success(`Voucher has been ${modeText} successfully.`)
                    refetch?.()
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to perform action.')
                },
            },
        })

    const isProcessing = isPrinting || isActionPending

    const handlePrintAction = (mode: TCashCheckVoucherPrintMode) => () => {
        mutatePrint({
            cash_check_voucher_id: cashCheckVoucher.id,
            mode,
            voucher_number: cashCheckVoucher.cash_voucher_number
                ? parseInt(cashCheckVoucher.cash_voucher_number)
                : undefined,
        })
    }
    const handleVoucherAction = (mode: TCashCheckVoucherActionMode) => () => {
        performVoucherAction({
            cash_check_voucher_id: cashCheckVoucher.id,
            mode,
        })
    }

    const menuActions = [
        {
            label: isPrinted ? 'Print-Undo' : 'Print',
            icon: !isPrinted ? (
                <PrinterIcon className="mr-2 h-4 w-4 text-blue-500" />
            ) : (
                <Undo2Icon className="mr-2 h-4 w-4 text-orange-500" />
            ),
            onSelect: handlePrintAction(isPrinted ? 'print-undo' : 'print'),
            isVisible: showPrint,
        },
        {
            label: 'Print (Only)',
            icon: <PrinterIcon className="mr-2 h-4 w-4 text-blue-500" />,
            onSelect: handleVoucherAction('print-only'),
            isVisible: !isApproved && !isPrinted && !showPrint,
        },
        {
            label: 'Approve',
            icon: <CheckCircle2Icon className="mr-2 h-4 w-4 text-green-500" />,
            onSelect: handlePrintAction('approve'),
            isVisible: canApprove,
        },
        {
            label: 'Undo Approve',
            icon: <XCircleIcon className="mr-2 h-4 w-4 text-red-500" />,
            onSelect: handleVoucherAction('approve-undo'),
            isVisible: isApproved && !cashCheckVoucher.released_date,
        },
        {
            label: 'Release',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-purple-500" />
            ),
            onSelect: handleVoucherAction('release'),
            isVisible: showRelease,
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button aria-label="More Actions" size={'icon'} variant="ghost">
                    {<PencilFillIcon className="size-4" />}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {menuActions
                    .filter((action) => action.isVisible)
                    .map((action) => (
                        <DropdownMenuItem
                            className="flex items-center"
                            disabled={isProcessing}
                            key={action.label}
                            onClick={action.onSelect}
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

const CashCheckVoucherCardActions = ({
    cashCheckVoucher,
    ccvDates,
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
    } = useCardKanbanActions({ cashCheckVoucher, refetch })

    return (
        <>
            <CashCheckVoucherCreateUpdateFormModal
                className={cn('!min-w-2xl !max-w-5xl')}
                {...cashCheckVoucherModalState}
                formProps={{
                    defaultValues: cashCheckVoucher,
                    readOnly: true,
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
            <div className="w-full flex items-center space-x-1 justify-end flex-shrink-0">
                <CashCheckVoucherTagsManagerPopover
                    cashCheckVoucherId={cashCheckVoucher.id}
                    size="sm"
                />
                <Button size={'sm'} variant="outline">
                    <SignatureLightIcon className="size-4 mr-1" />
                    <span
                        className="text-sm"
                        onClick={handleCashCheckSignatureVoucher}
                    >
                        Sign
                    </span>
                </Button>
                <CashCheckVoucherStatusIndicator
                    className="flex-shrink-0"
                    voucherDates={ccvDates}
                />
                <Button
                    aria-label="View Cash Check Voucher"
                    onClick={handleOpenViewModal}
                    size={'icon'}
                    variant="ghost"
                >
                    <EyeIcon />
                </Button>
                {!isReleased && (
                    <CashCheckVoucherOtherAction
                        cashCheckVoucher={cashCheckVoucher}
                        refetch={refetch}
                    />
                )}
            </div>
        </>
    )
}

const CashCheckVoucherCardCreatorInfo = ({
    cashCheckVoucher,
}: Pick<ICashCheckVoucherCardProps, 'cashCheckVoucher'>) => {
    return (
        <div className="flex items-center justify-evenly gap-x-2">
            <div className="flex space-x-2">
                <InfoTooltip content="Total Debit">
                    <Button
                        className="min-w-16 font-semibold"
                        size="sm"
                        variant="secondary"
                    >
                        {cashCheckVoucher.total_debit || 0}
                    </Button>
                </InfoTooltip>
                <InfoTooltip content="Total Credit">
                    <Button
                        className="min-w-16 font-semibold"
                        size="sm"
                        variant="secondary"
                    >
                        {cashCheckVoucher.total_credit || 0}
                    </Button>
                </InfoTooltip>
            </div>
            <InfoTooltip
                content={`created by ${cashCheckVoucher.created_by?.full_name}`}
            >
                <div className="text-right max-w-[120px] shrink">
                    <p className="truncate font-medium text-sm text-foreground/90">
                        {cashCheckVoucher.created_by?.full_name}
                    </p>
                    <p className="text-xs text-start text-muted-foreground/70 truncate">
                        @{cashCheckVoucher.created_by?.user_name ?? '-'}{' '}
                    </p>
                </div>
            </InfoTooltip>
            <ImageDisplay
                className="size-8 rounded-full"
                src={cashCheckVoucher?.created_by?.media?.download_url}
            />
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
            <CashCheckVoucherCardActions
                cashCheckVoucher={cashCheckVoucher}
                ccvDates={ccvDates}
                refetch={refetch}
            />

            <p className="truncate text-lg font-bold text-foreground/95">
                {cashCheckVoucher.name ||
                    cashCheckVoucher.cash_voucher_number ||
                    'CCV-Unknown'}
            </p>

            {cashCheckVoucher.cash_voucher_number && (
                <p className="truncate w-full bg-secondary/30 rounded-md p-1 text-muted-foreground text-xs font-mono">
                    CV No. {cashCheckVoucher.cash_voucher_number}
                </p>
            )}

            <p className="truncate w-full text-muted-foreground text-sm font-medium">
                Pay To: {cashCheckVoucher.pay_to || 'N/A'}
            </p>

            <CashCheckVoucherCardCreatorInfo
                cashCheckVoucher={cashCheckVoucher}
            />
            <div className="w-full flex flex-wrap gap-1 max-h-16 overflow-x-auto ">
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

            <p className="text-xs text-end text-muted-foreground/70 truncate">
                {dateAgo(cashCheckVoucher.created_at)}
            </p>
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

    if (isLoading) return <div>Loading...</div>

    const modeText = mode.charAt(0).toUpperCase() + mode.slice(1)

    return (
        <div>
            <KanbanContainer className="w-[360px]">
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
                        title={`Cash Check Vouchers - ${modeText}`}
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

const CashCheckVoucherKanban = () => {
    return (
        <>
            {['draft', 'printed', 'approved', 'released'].map((status) => (
                <CashCheckVoucherKanbanMain
                    key={status}
                    mode={status as TCashCheckVoucherStatus}
                />
            ))}
        </>
    )
}

export default CashCheckVoucherKanban
