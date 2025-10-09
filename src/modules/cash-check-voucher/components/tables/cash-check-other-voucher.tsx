import { toast } from 'sonner'

import { TJournalActionMode, TPrintMode } from '@/modules/journal-voucher'
import { Row } from '@tanstack/react-table'
import {
    CheckCircle2Icon,
    PrinterIcon,
    SendHorizonalIcon,
    Undo2Icon,
    XCircleIcon,
} from 'lucide-react'

import { SignatureLightIcon } from '@/components/icons'
import { ContextMenuItem } from '@/components/ui/context-menu'
import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import {
    useCashCheckVoucherActions,
    useEditPrintCashCheckVoucher,
} from '../../cash-check-voucher.service'
import { ICashCheckVoucher } from '../../cash-check-voucher.types'

type ICashCheckVoucherTableActionComponentProp = {
    row: Row<ICashCheckVoucher> | ICashCheckVoucher
    type?: 'default' | 'context'
    onPrint?: () => void
    onApprove?: () => void
    onRelease?: () => void
    onRefetch?: () => void
    handleOpenCheckEntry?: () => void
    handleOpenSignature?: () => void
}

const CashCheckVoucherOtherAction = ({
    row,
    type = 'default',
    onPrint,
    onApprove,
    onRelease,
    onRefetch,
    handleOpenCheckEntry,
    handleOpenSignature,
}: ICashCheckVoucherTableActionComponentProp) => {
    const CashCheckVoucher = 'original' in row ? row.original : row

    const isPrinted = !!CashCheckVoucher.printed_date
    const isApproved = !!CashCheckVoucher.approved_date
    const canApprove = isPrinted && !isApproved
    const canRelease = isPrinted && isApproved

    const showRelease = canRelease && !CashCheckVoucher.released_date

    const { mutate: mutatePrint, isPending: isPrinting } =
        useEditPrintCashCheckVoucher({
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

    const { mutate: performCashCheckAction, isPending: isActionPending } =
        useCashCheckVoucherActions({
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
            cash_check_voucher_id: CashCheckVoucher.id,
            mode,
            voucher_number: CashCheckVoucher.cash_voucher_number
                ? parseInt(CashCheckVoucher.cash_voucher_number)
                : undefined,
        })
    }

    const handleCashCheckAction = (mode: TJournalActionMode) => () => {
        performCashCheckAction({
            cash_check_voucher_id: CashCheckVoucher.id,
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
            label: 'Print Voucher',
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
            onSelect: handleCashCheckAction('approve-undo'),
            isVisible: isApproved && !CashCheckVoucher.released_date,
        },
        {
            label: 'Release',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: handleReleaseAction,
            isVisible: showRelease,
        },
        {
            label: 'Check Entry',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: handleOpenCheckEntry,
            isVisible: true,
        },
        {
            label: 'Signature',
            icon: (
                <SignatureLightIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: handleOpenSignature,
            isVisible: true,
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

export default CashCheckVoucherOtherAction
