import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import {
    CheckCircle2Icon,
    PrinterIcon,
    SendHorizonalIcon,
    Undo2Icon,
    XCircleIcon,
} from 'lucide-react'

import { DropdownMenuItem } from '@/components/ui/dropdown-menu'

import { ILoanTransaction } from '../loan-transaction.types'

export type TLoanActionMode = 'approve' | 'approve-undo' | 'release'
export type TPrintMode = 'print' | 'print-undo'

type ILoanTransactionTableActionComponentProp = {
    loanTransaction: ILoanTransaction
    onPrint?: () => void
    onApprove?: () => void
    onRelease?: () => void
    onRefetch?: () => void
    onUndoApprove?: () => void
    onPrintUndo?: () => void
}

const LoanTransactionOtherAction = ({
    loanTransaction,
    onPrint,
    onApprove,
    onRelease,
    onUndoApprove,
    onPrintUndo,
}: ILoanTransactionTableActionComponentProp) => {
    const isPrinted = !!loanTransaction.printed_date
    const isApproved = !!loanTransaction.approved_date
    const canApprove = isPrinted && !isApproved
    const canRelease = isPrinted && isApproved

    const showRelease = canRelease && !loanTransaction.released_date

    const menuActions = [
        {
            label: 'Print',
            icon: (
                <PrinterIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: () => {
                onPrint?.()
            },
            isVisible:
                !isPrinted &&
                hasPermissionFromAuth({
                    action: 'Update',
                    resourceType: 'ApprovalsLoanPrinted',
                }),
        },
        {
            label: 'Undo Print',
            icon: <Undo2Icon className="mr-2 h-4 w-4 text-muted-foreground" />,
            onSelect: () => {
                onPrintUndo?.()
            },
            isVisible:
                isPrinted &&
                !isApproved &&
                hasPermissionFromAuth({
                    action: 'Update',
                    resourceType: 'ApprovalsLoanPrinted',
                }),
        },
        {
            label: 'Approve',
            icon: (
                <CheckCircle2Icon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: () => {
                onApprove?.()
            },
            isVisible:
                canApprove &&
                hasPermissionFromAuth({
                    action: 'Update',
                    resourceType: 'ApprovalsLoanApproved',
                }),
        },
        {
            label: 'Undo Approve',
            icon: (
                <XCircleIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: () => {
                onUndoApprove?.()
            },
            isVisible:
                isApproved &&
                !loanTransaction.released_date &&
                hasPermissionFromAuth({
                    action: 'Update',
                    resourceType: 'ApprovalsLoanPrinted',
                }),
        },
        {
            label: 'Release',
            icon: (
                <SendHorizonalIcon className="mr-2 h-4 w-4 text-muted-foreground" />
            ),
            onSelect: () => {
                onRelease?.()
            },
            isVisible:
                showRelease &&
                hasPermissionFromAuth({
                    action: 'Update',
                    resourceType: 'ApprovalsLoanReleased',
                }),
        },
    ]

    return (
        <div className="flex flex-col w-48 rounded-md p-1">
            {menuActions.map((action) => (
                <DropdownMenuItem
                    className="flex items-center"
                    disabled={!action.isVisible}
                    key={action.label}
                    onClick={action.onSelect}
                >
                    {action.icon}
                    <span>{action.label}</span>
                </DropdownMenuItem>
            ))}
        </div>
    )
}

export default LoanTransactionOtherAction
