import { useCallback } from 'react'

import { toast } from 'sonner'

import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
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

import { useEditPrintOtherFund, useOtherFundActions } from '../..'
import { IOtherFund, TOtherFundActionMode } from '../../other-fund.types'

type IOtherFundTableActionComponentProp = {
    row: Row<IOtherFund> | IOtherFund
    type?: 'default' | 'context'
    onPrint?: () => void
    onApprove?: () => void
    onRelease?: () => void
    onRefetch?: () => void
    onReprint?: () => void
}

export const OtherFundOtherAction = ({
    row,
    type = 'default',
    onPrint,
    onApprove,
    onRelease,
    onRefetch,
    onReprint,
}: IOtherFundTableActionComponentProp) => {
    const otherFund = 'original' in row ? row.original : row

    const isPrinted = !!otherFund.printed_date
    const isApproved = !!otherFund.approved_date
    const isReleased = !!otherFund.released_date

    const canApprove = isPrinted && !isApproved
    const canRelease = isPrinted && isApproved && !isReleased

    const { mutate: mutatePrint, isPending: isPrinting } =
        useEditPrintOtherFund({
            options: {
                onSuccess: (_, variables) => {
                    const isUndo = variables.mode.includes('undo')
                    toast.success(
                        `Print status ${isUndo ? 'undone' : 'updated'} successfully.`
                    )
                    onRefetch?.()
                },
                onError: (error) =>
                    toast.error(
                        error.message || 'Failed to update print status.'
                    ),
            },
        })

    const { mutate: performAction, isPending: isActionPending } =
        useOtherFundActions({
            options: {
                onSuccess: (_, variables) => {
                    const modeText = variables.mode.replace('-undo', ' undone')
                    toast.success(
                        `Fund voucher has been ${modeText} successfully.`
                    )
                    onRefetch?.()
                },
                onError: (error) =>
                    toast.error(error.message || 'Failed to perform action.'),
            },
        })

    const isProcessing = isPrinting || isActionPending

    const handleUndoPrint = useCallback(() => {
        mutatePrint({
            other_fund_id: otherFund.id,
            mode: 'print-undo',
            voucher_number: otherFund.cash_voucher_number
                ? parseInt(otherFund.cash_voucher_number)
                : undefined,
        })
    }, [mutatePrint, otherFund.id, otherFund.cash_voucher_number])

    const handleAction = useCallback(
        (mode: TOtherFundActionMode) => {
            performAction({ other_fund_id: otherFund.id, mode })
        },
        [performAction, otherFund.id]
    )

    const menuActions = [
        {
            label: 'Print',
            icon: (
                <PrinterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: onPrint,
            isVisible:
                !isPrinted &&
                hasPermissionFromAuth({
                    action: ['Update'],
                    resourceType: 'ApprovalsOtherFundPrinted',
                }),
        },
        {
            label: 'Reprint',
            icon: (
                <PrinterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: onReprint,
            isVisible:
                isPrinted &&
                hasPermissionFromAuth({
                    action: ['Update'],
                    resourceType: 'ApprovalsOtherFundPrinted',
                }),
        },
        {
            label: 'Undo Print',
            icon: <Undo2Icon className="mr-2 h-4 w-4 text-muted-foreground" />,
            onSelect: handleUndoPrint,
            isVisible:
                isPrinted &&
                !isApproved &&
                hasPermissionFromAuth({
                    action: ['Update'],
                    resourceType: 'ApprovalsOtherFundPrinted',
                }),
        },
        {
            label: 'Approve',
            icon: (
                <CheckCircle2Icon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: onApprove,
            isVisible:
                canApprove &&
                hasPermissionFromAuth({
                    action: ['Update'],
                    resourceType: 'ApprovalsOtherFundApproved',
                }),
        },
        {
            label: 'Undo Approve',
            icon: (
                <XCircleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: () => handleAction('approve-undo'),
            isVisible:
                isApproved &&
                !isReleased &&
                hasPermissionFromAuth({
                    action: ['Update'],
                    resourceType: 'ApprovalsOtherFundApproved',
                }),
        },
        {
            label: 'Release',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: onRelease,
            isVisible:
                canRelease &&
                hasPermissionFromAuth({
                    action: ['Update'],
                    resourceType: 'ApprovalsOtherFundReleased',
                }),
        },
        {
            label: 'Undo Release',
            icon: <Undo2Icon className="mr-2 h-4 w-4 text-muted-foreground" />,
            onSelect: () => handleAction('release-undo'),
            isVisible:
                isReleased &&
                hasPermissionFromAuth({
                    action: ['Update'],
                    resourceType: 'ApprovalsOtherFundReleased',
                }),
        },
    ]

    const ItemComponent =
        type === 'default' ? DropdownMenuItem : ContextMenuItem

    return (
        <div className="flex flex-col min-w-[10rem] p-1">
            {menuActions
                .filter((a) => a.isVisible)
                .map((action) => (
                    <ItemComponent
                        className="flex items-center cursor-pointer"
                        disabled={isProcessing}
                        key={action.label}
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            action.onSelect?.()
                        }}
                    >
                        {action.icon}
                        <span>{action.label}</span>
                    </ItemComponent>
                ))}
        </div>
    )
}
