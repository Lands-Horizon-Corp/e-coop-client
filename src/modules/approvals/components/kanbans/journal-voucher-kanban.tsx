import { toast } from 'sonner'

import { dateAgo } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import {
    IJournalVoucher,
    TJournalActionMode,
    TJournalVoucherMode,
    TPrintMode,
    useEditPrintJournalVoucher,
    useGetAllJournalVoucher,
    useJournalVoucherActions,
} from '@/modules/journal-voucher'
import {
    JournalVoucherTagChip,
    JournalVoucherTagsManagerPopover,
} from '@/modules/journal-voucher-tag/components/journal-voucher-tag-management'
import JournalVoucherCreateUpdateFormModal from '@/modules/journal-voucher/components/forms/journal-voucher-create-update-modal'
import JournalVoucherStatusIndicator from '@/modules/journal-voucher/components/journal-voucher-status-indicator'
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

// --- Type and Hook Definitions ---

type UseCardKanbanActionsProps = {
    journalVoucher: IJournalVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
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

type JournalVoucherKanbanProps = {
    mode: TJournalVoucherMode
}
interface UseJournalVoucherActionsProps {
    journalVoucher: IJournalVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
}

interface ICJournalVoucherStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

interface IJournalVoucherCardProps extends IClassProps {
    journalVoucher: IJournalVoucher
    refetch: () => void
}

// --- Component: JournalVoucherOtherAction (Dropdown Menu) ---

const JournalVoucherOtherAction = ({
    journalVoucher,
    refetch,
}: UseJournalVoucherActionsProps) => {
    const isPrinted = !!journalVoucher.printed_date
    const isApproved = !!journalVoucher.approved_date
    const canApprove = isPrinted && !isApproved
    const canRelease = isPrinted && isApproved

    const showRelease = canRelease && !journalVoucher.released_date
    const showPrint = isPrinted || (!isPrinted && !canApprove && !canRelease)

    const { mutate: mutatePrint, isPending: isPrinting } =
        useEditPrintJournalVoucher({
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

    const { mutate: performJournalAction, isPending: isActionPending } =
        useJournalVoucherActions({
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

    const handlePrintAction = (mode: TPrintMode) => () => {
        mutatePrint({
            journal_voucher_id: journalVoucher.id,
            mode,
            voucher_number: journalVoucher.cash_voucher_number
                ? parseInt(journalVoucher.cash_voucher_number)
                : undefined,
        })
    }
    const handleJournalAction = (mode: TJournalActionMode) => () => {
        performJournalAction({
            journal_voucher_id: journalVoucher.id,
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
            onSelect: handleJournalAction('print-only'),
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
            onSelect: handleJournalAction('approve-undo'),
            isVisible: isApproved && !journalVoucher.released_date,
        },
        {
            label: 'Release',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-purple-500" />
            ),
            onSelect: handleJournalAction('release'),
            isVisible: showRelease,
        },
    ]

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button size={'icon'} variant="ghost">
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

// --- Component: JournalVoucherCardActions (Top right action group) ---

const JournalVoucherCardActions = ({
    journalVoucher,
    jvDates,
    refetch,
}: Pick<IJournalVoucherCardProps, 'journalVoucher' | 'refetch'> & {
    jvDates: ICJournalVoucherStatusDates
}) => {
    const isReleased = !!journalVoucher.released_date
    const { handleOpenViewModal, journalVoucherModalState } =
        useCardKanbanActions({ journalVoucher, refetch })

    return (
        <>
            <JournalVoucherCreateUpdateFormModal
                className={cn('!min-w-2xl !max-w-5xl')}
                {...journalVoucherModalState}
                formProps={{
                    defaultValues: journalVoucher,
                    readOnly: true,
                }}
            />
            <div className="w-full flex items-center space-x-1 justify-end flex-shrink-0">
                <JournalVoucherTagsManagerPopover
                    journalVoucherId={journalVoucher.id}
                    size="sm"
                />
                <JournalVoucherStatusIndicator
                    className="flex-shrink-0"
                    voucherDates={jvDates}
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
                    <JournalVoucherOtherAction
                        journalVoucher={journalVoucher}
                        refetch={refetch}
                    />
                )}
            </div>
        </>
    )
}

// --- Component: JournalVoucherCardCreatorInfo (Bottom row with amounts and user) ---

const JournalVoucherCardCreatorInfo = ({
    journalVoucher,
}: Pick<IJournalVoucherCardProps, 'journalVoucher'>) => {
    return (
        <div className="flex items-center justify-evenly gap-x-2">
            <div className="flex space-x-2">
                <InfoTooltip content="Total Debit">
                    <Button
                        className="min-w-16 font-semibold"
                        size="sm"
                        variant="secondary"
                    >
                        {journalVoucher.total_debit || 0}
                    </Button>
                </InfoTooltip>
                <InfoTooltip content="Total Credit">
                    <Button
                        className="min-w-16 font-semibold"
                        size="sm"
                        variant="secondary"
                    >
                        {journalVoucher.total_credit || 0}
                    </Button>
                </InfoTooltip>
            </div>
            <InfoTooltip
                content={`created by ${journalVoucher.created_by?.full_name}`}
            >
                <div className="text-right max-w-[120px] shrink">
                    <p className="truncate font-medium text-sm text-foreground/90">
                        {journalVoucher.created_by?.full_name}
                    </p>
                    <p className="text-xs text-start text-muted-foreground/70 truncate">
                        @{journalVoucher.created_by?.user_name ?? '-'}{' '}
                    </p>
                </div>
            </InfoTooltip>
            <ImageDisplay
                className="size-8 rounded-full"
                src={journalVoucher?.created_by?.media?.download_url}
            />
        </div>
    )
}

// --- Component: JournalVoucherCard ---

export const JournalVoucherCard = ({
    journalVoucher,
    className,
    refetch,
}: IJournalVoucherCardProps) => {
    const jvDates: ICJournalVoucherStatusDates = {
        printed_date: journalVoucher.printed_date,
        approved_date: journalVoucher.approved_date,
        released_date: journalVoucher.released_date,
    }

    return (
        <div
            className={cn(
                'group space-y-3 relative rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10',
                className
            )}
        >
            <JournalVoucherCardActions
                journalVoucher={journalVoucher}
                jvDates={jvDates}
                refetch={refetch}
            />

            <p className="truncate text-lg font-bold text-foreground/95">
                {journalVoucher.name ||
                    journalVoucher.cash_voucher_number ||
                    'JV-Unknown'}
            </p>

            {journalVoucher.cash_voucher_number && (
                <p className="truncate w-full bg-secondary/30 rounded-md p-1 text-muted-foreground text-xs font-mono">
                    CV No. {journalVoucher.cash_voucher_number}
                </p>
            )}

            <JournalVoucherCardCreatorInfo journalVoucher={journalVoucher} />
            <div className="w-full flex flex-wrap gap-1 max-h-16 overflow-x-auto ">
                {journalVoucher?.journal_voucher_tags?.map((tag) => (
                    <JournalVoucherTagChip
                        key={tag.id}
                        onRemove={() => {
                            refetch()
                        }}
                        tag={tag}
                    />
                ))}
            </div>

            <p className="text-xs text-end text-muted-foreground/70 truncate">
                {dateAgo(journalVoucher.date)}
            </p>
        </div>
    )
}

// --- Component: JournalVoucherKanban (Main Export) ---

const JournalVoucherKanban = ({ mode }: JournalVoucherKanbanProps) => {
    const { data, isLoading, refetch, isRefetching } = useGetAllJournalVoucher()

    const dataFiltered = data?.filter((jv) => {
        if (mode === 'draft')
            return (
                (!jv.printed_date && !jv.approved_date && !jv.released_date) ||
                !jv.printed_date
            )
        if (mode === 'printed')
            return jv.printed_date && !jv.approved_date && !jv.released_date
        if (mode === 'approved')
            return jv.printed_date && jv.approved_date && !jv.released_date
        if (mode === 'released')
            return jv.printed_date && jv.approved_date && jv.released_date
        return false
    })

    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <KanbanContainer className="w-[360px]">
                <div className="flex items-center">
                    {mode === 'draft' && (
                        <DraftIcon className="mr-2 size-4 text-primary" />
                    )}
                    {mode === 'printed' && (
                        <PrinterIcon className="mr-2 size-4 text-blue-500" />
                    )}
                    {mode === 'approved' && (
                        <CheckCircle2Icon className="mr-2 size-4 text-success-foreground" />
                    )}
                    {mode === 'released' && (
                        <BadgeCheckFillIcon className="mr-2 size-4 text-purple-500" />
                    )}
                    <KanbanTitle
                        isLoading={isRefetching}
                        onRefresh={() => refetch()}
                        title={`Journal Vouchers - ${mode}`}
                        totalItems={dataFiltered?.length}
                    />
                </div>
                <Separator />
                <KanbanItemsContainer>
                    {dataFiltered?.map((jv) => (
                        <div key={jv.id}>
                            <JournalVoucherCard
                                className="mb-2"
                                journalVoucher={jv}
                                refetch={refetch}
                            />
                        </div>
                    ))}
                    {dataFiltered?.length === 0 && (
                        <p className="text-center text-xs text-muted-foreground/60">
                            no pending request
                        </p>
                    )}
                </KanbanItemsContainer>
            </KanbanContainer>
        </div>
    )
}

export default JournalVoucherKanban
