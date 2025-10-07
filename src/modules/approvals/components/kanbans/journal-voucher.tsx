import { toast } from 'sonner'

import { toReadableDateTime } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import KanbanContainer from '@/modules/approvals/components/kanban/kanban-container'
import KanbanItemsContainer from '@/modules/approvals/components/kanban/kanban-items-container'
import KanbanTitle from '@/modules/approvals/components/kanban/kanban-title'
import CashCheckVoucherStatusIndicator from '@/modules/cash-check-voucher/components/cash-check-status-indicator'
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
    CheckCircle2Icon,
    PrinterIcon,
    SendHorizonalIcon,
    Undo2Icon,
    XCircleIcon,
} from 'lucide-react'

import { DraftIcon, OptionsIcon } from '@/components/icons'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'

import { IClassProps } from '@/types'

type JournalVoucherKanbanProps = {
    mode: TJournalVoucherMode
}
interface UseJournalVoucherActionsProps {
    journalVoucher: IJournalVoucher
    onDeleteSuccess?: () => void
    refetch?: () => void
}

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
                    refetch && refetch()
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
                    refetch && refetch()
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
            label: isPrinted ? 'print-undo' : 'Print',
            icon: !isPrinted ? (
                <PrinterIcon className="mr-2 h-4 w-4 text-blue-500" />
            ) : (
                <Undo2Icon className="mr-2 h-4 w-4 text-orange-500" />
            ),
            onSelect: handlePrintAction(isPrinted ? 'print-undo' : 'print'),
            isVisible: showPrint,
        },
        {
            label: 'Print',
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
            <DropdownMenuTrigger className="border ">
                {<OptionsIcon className="size-4" />}
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                {menuActions
                    .filter((action) => action.isVisible)
                    .map((action) => (
                        <DropdownMenuItem
                            key={action.label}
                            disabled={isProcessing}
                            onClick={action.onSelect}
                            className="flex items-center"
                        >
                            {action.icon}
                            <span>{action.label}</span>
                        </DropdownMenuItem>
                    ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
interface ICJournalVoucherStatusDates {
    printed_date?: string | null
    approved_date?: string | null
    released_date?: string | null
}

export const JournalVoucherCard = ({
    journalVoucher,
    className,
    refetch,
}: {
    journalVoucher: IJournalVoucher
    refetch: () => void
} & IClassProps) => {
    const jvDates: ICJournalVoucherStatusDates = {
        printed_date: journalVoucher.printed_date,
        approved_date: journalVoucher.approved_date,
        released_date: journalVoucher.released_date,
    }

    const isReleased = !!journalVoucher.released_date

    return (
        <div
            className={cn(
                'group space-y-3 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-lg hover:shadow-accent/10',
                className
            )}
        >
            <div className="w-full flex items-center justify-between">
                <p className="truncate grow">
                    {journalVoucher.name ||
                        journalVoucher.cash_voucher_number ||
                        'JV-Unknown'}
                </p>
                <div className="flex items-center space-x-3 flex-shrink-0">
                    <CashCheckVoucherStatusIndicator
                        className="flex-shrink-0"
                        voucherDates={jvDates}
                    />
                    {!isReleased && (
                        <JournalVoucherOtherAction
                            refetch={() => {
                                refetch()
                            }}
                            journalVoucher={journalVoucher}
                        />
                    )}
                </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">
                {journalVoucher.description ||
                    `Reference: ${journalVoucher.reference}`}
            </p>
            <div className="grid grid-cols-2 gap-2 border-t pt-3">
                <div className="text-sm">
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium text-foreground">
                        {toReadableDateTime(journalVoucher.date)}
                    </p>
                </div>
                <div className="text-sm text-right">
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-semibold text-primary/80">
                        {journalVoucher.total_debit > 0
                            ? `DR ${journalVoucher.total_debit.toLocaleString()}`
                            : `CR ${journalVoucher.total_credit.toLocaleString()}`}
                    </p>
                </div>
            </div>
            {journalVoucher.journal_voucher_tags &&
                journalVoucher.journal_voucher_tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-2 border-t">
                        {journalVoucher.journal_voucher_tags
                            .slice(0, 3)
                            .map((tag) => (
                                <span
                                    key={tag.id}
                                    className="text-xs px-2 py-0.5 rounded-full bg-accent/50 text-accent-foreground"
                                >
                                    {tag.name}
                                </span>
                            ))}
                        {journalVoucher.journal_voucher_tags.length > 3 && (
                            <span className="text-xs text-muted-foreground px-2 py-0.5">
                                +
                                {journalVoucher.journal_voucher_tags.length - 3}{' '}
                                more
                            </span>
                        )}
                    </div>
                )}
        </div>
    )
}
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
    console.log(data, 'dataFiltered')
    if (isLoading) return <div>Loading...</div>

    return (
        <div>
            <KanbanContainer className="w-[360px]">
                <div className="flex items-center">
                    {mode === 'draft' && (
                        <DraftIcon className="mr-2 size-4 text-primary" />
                    )}
                    <KanbanTitle
                        title={`Journal Vouchers - ${mode}`}
                        totalItems={dataFiltered?.length}
                        isLoading={isRefetching}
                        onRefresh={() => refetch()}
                    />
                </div>
                <Separator />
                <KanbanItemsContainer>
                    {dataFiltered?.map((jv) => (
                        <div key={jv.id}>
                            <JournalVoucherCard
                                refetch={() => {
                                    refetch()
                                }}
                                journalVoucher={jv}
                                className="mb-2"
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
