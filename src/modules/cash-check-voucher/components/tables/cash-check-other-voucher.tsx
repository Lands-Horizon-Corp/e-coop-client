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

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import {
    useCashCheckVoucherActions,
    useEditPrintCashCheckVoucher,
} from '../../cash-check-voucher.service'
import { ICashCheckVoucher } from '../../cash-check-voucher.types'

type ICashCheckVoucherTableActionComponentProp = {
    row: Row<ICashCheckVoucher>
    handleOpenCheckEntry: () => void
}
const CashCheckVoucherOtherAction = ({
    row,
    handleOpenCheckEntry,
}: ICashCheckVoucherTableActionComponentProp) => {
    const CashCheckVoucher = row.original

    const isPrinted = !!CashCheckVoucher.printed_date
    const isApproved = !!CashCheckVoucher.approved_date
    const canApprove = isPrinted && !isApproved
    const canRelease = isPrinted && isApproved

    const showRelease = canRelease && !CashCheckVoucher.released_date
    // show print
    const showPrint = isPrinted && !CashCheckVoucher.printed_date

    const { mutate: mutatePrint, isPending: isPrinting } =
        useEditPrintCashCheckVoucher({
            options: {
                onSuccess: (_, variables) => {
                    const actionText = variables.mode.includes('undo')
                        ? 'undone'
                        : 'updated'
                    toast.success(`Print status ${actionText} successfully.`)
                },
                onError: (error) => {
                    toast.error(
                        error.message || 'Failed to update print status.'
                    )
                },
            },
        })

    const { mutate: performJournalAction, isPending: isActionPending } =
        useCashCheckVoucherActions({
            options: {
                onSuccess: (_, variables) => {
                    const modeText = variables.mode.replace('-undo', ' undone')
                    toast.success(`Voucher has been ${modeText} successfully.`)
                },
                onError: (error) => {
                    toast.error(error.message || 'Failed to perform action.')
                },
            },
        })

    const isProcessing = isPrinting || isActionPending

    const handlePrintAction = (mode: TPrintMode) => () => {
        mutatePrint({
            cash_check_voucher_id: CashCheckVoucher.id,
            mode,
            voucher_number: CashCheckVoucher.cash_voucher_number
                ? parseInt(CashCheckVoucher.cash_voucher_number)
                : undefined,
        })
    }
    const handleCashCheckAction = (mode: TJournalActionMode) => () => {
        performJournalAction({
            cash_check_voucher_id: CashCheckVoucher.id,
            mode,
        })
    }

    const menuActions = [
        {
            label: isPrinted ? 'print-undo' : 'Print',
            icon: <PrinterIcon className="mr-2 h-4 w-4 text-blue-500" />,
            onSelect: handlePrintAction(isPrinted ? 'print-undo' : 'print'),
            isVisible: showPrint,
        },
        {
            label: 'Print',
            icon: <PrinterIcon className="mr-2 h-4 w-4 text-blue-500" />,
            onSelect: handleCashCheckAction('print-only'),
            isVisible: true,
        },
        {
            label: 'Undo Print',
            icon: <Undo2Icon className="mr-2 h-4 w-4 text-orange-500" />,
            onSelect: handlePrintAction('print-undo'),
            isVisible: isPrinted && !isApproved,
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
            onSelect: handleCashCheckAction('approve-undo'),
            isVisible: isApproved && !CashCheckVoucher.released_date,
        },
        {
            label: 'Release',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-purple-500" />
            ),
            onSelect: handleCashCheckAction('release'),
            isVisible: showRelease,
        },
        {
            label: 'check entry',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-purple-500" />
            ),
            onSelect: handleOpenCheckEntry,
            isVisible: true,
        },
    ]

    return (
        <div className="flex flex-col w-48 rounded-md p-1">
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
        </div>
    )
}

export default CashCheckVoucherOtherAction
