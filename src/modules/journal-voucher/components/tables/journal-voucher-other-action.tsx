import { toast } from 'sonner'

import {
    IJournalVoucher,
    TJournalActionMode,
    TPrintMode,
    useEditPrintJournalVoucher,
    useJournalVoucherActions,
} from '@/modules/journal-voucher'
import { Row } from '@tanstack/react-table'
import {
    CheckCircle2Icon,
    PrinterIcon,
    SendHorizonalIcon,
    Undo2Icon,
    XCircleIcon,
} from 'lucide-react'

import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

type IJournalVoucherTableActionComponentProp = {
    row: Row<IJournalVoucher> | IJournalVoucher
    type?: 'default' | 'context'
    onPrint?: () => void
    onApprove?: () => void
    onRelease?: () => void
    onRefetch?: () => void
}

const JournalVoucherOtherAction = ({
    row,
    type = 'default',
    onPrint,
    onApprove,
    onRelease,
    onRefetch,
}: IJournalVoucherTableActionComponentProp) => {
    const journalVoucher = 'original' in row ? row.original : row
    const isPrinted = !!journalVoucher.printed_date
    const isApproved = !!journalVoucher.approved_date
    const canApprove = isPrinted && !isApproved
    const canRelease = isPrinted && isApproved

    const showRelease = canRelease && !journalVoucher.released_date

    const { mutate: mutatePrint, isPending: isPrinting } =
        useEditPrintJournalVoucher({
            options: {
                onSuccess: (_, variables) => {
                    const actionText = variables.mode.includes('undo')
                        ? 'undone'
                        : 'updated'
                    toast.success(`Print status ${actionText} successfully.`)
                    onRefetch?.()
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
                    onRefetch?.()
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to perform action.')
                },
            },
        })

    const isProcessing = isPrinting || isActionPending

    const handleMutatePrintAction = (mode: TPrintMode) => () => {
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
    const handlePrintAction = () => {
        onPrint?.()
    }
    const handleApproveAction = () => {
        onApprove?.()
    }
    const handleReleaseAction = () => {
        onRelease?.()
    }

    const menuActions = [
        {
            label: isPrinted ? 'print-undo' : 'Print',
            icon: (
                <PrinterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: handlePrintAction,
            isVisible: !isPrinted,
        },
        {
            label: 'Undo Print',
            icon: <Undo2Icon className="mr-2 h-4 w-4 text-muted-foreground" />,
            onSelect: handleMutatePrintAction('print-undo'),
            isVisible: isPrinted && !isApproved,
        },
        {
            label: 'Approve',
            icon: (
                <CheckCircle2Icon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: handleApproveAction,
            isVisible: canApprove,
        },
        {
            label: 'Undo Approve',
            icon: (
                <XCircleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: handleJournalAction('approve-undo'),
            isVisible: isApproved && !journalVoucher.released_date,
        },
        {
            label: 'Release',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: handleReleaseAction,
            isVisible: showRelease,
        },
    ]

    return (
        <div className="flex flex-col w-48 rounded-md p-1">
            {menuActions.map((action) =>
                type === 'default' ? (
                    <DropdownMenuItem
                        className="flex items-center"
                        disabled={isProcessing || !action.isVisible}
                        key={action.label}
                        onClick={action.onSelect}
                    >
                        {action.icon}
                        <span>{action.label}</span>
                    </DropdownMenuItem>
                ) : (
                    <ContextMenuItem
                        className="flex items-center"
                        disabled={isProcessing || !action.isVisible}
                        key={action.label}
                        onClick={action.onSelect}
                    >
                        {action.icon}
                        <span>{action.label}</span>
                    </ContextMenuItem>
                )
            )}
        </div>
    )
}

export default JournalVoucherOtherAction
