import { cn } from '@/helpers'
import { dateAgo, toReadableDateTime } from '@/helpers/date-utils'
import { Calendar, Eye, FileText, RefreshCw, Ticket } from 'lucide-react'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import {
    ILoanTransaction,
    ILoanTransactionSummary,
} from '../../loan-transaction.types'
import { LoanTransactionCreateUpdateFormModal } from '../forms/loan-transaction-create-update-form'
import { LoanAmortizationModal } from '../loan-amortization'
import { LoanDetails } from './loan-details'

interface LoanToolbarProps {
    voucherStatus?: string
    releasedDate?: string
    releasedTimeAgo?: string
    isRefetching?: boolean
    canRefresh?: boolean
    onRefresh?: () => void
    onViewAmort?: () => void
    onViewOriginal?: () => void

    isProcessing?: boolean

    canProcess?: boolean
    handleProcess?: () => void
}

const LoanToolbar = ({
    voucherStatus = 'No Voucher Set...',
    releasedDate,
    releasedTimeAgo,
    isRefetching,
    canRefresh,
    isProcessing,
    canProcess,
    onRefresh,
    onViewAmort,
    onViewOriginal,
    handleProcess,
}: LoanToolbarProps) => {
    const hasVoucher = !!voucherStatus

    return (
        <div className="flex flex-1 items-center gap-2 p-2 bg-card rounded-lg border border-border">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-md border border-border h-9">
                <Ticket className="size-4 text-warning" />
                <span
                    className={`text-sm ${hasVoucher ? 'text-foreground' : 'text-muted-foreground'}`}
                >
                    {voucherStatus}
                </span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 bg-secondary/50 rounded-md border border-border h-9">
                <Calendar className="size-4 text-accent" />
                <span className="text-sm text-foreground">
                    {releasedTimeAgo ?? '—'}
                </span>
                {releasedDate && (
                    <span className="text-xs text-muted-foreground">
                        ({releasedDate})
                    </span>
                )}
            </div>

            {/* <div className="h-6 w-px bg-border ml-auto" /> */}

            <div className="flex ml-auto items-center gap-2">
                <Button
                    className="flex items-center gap-2"
                    disabled={!canRefresh}
                    onClick={onRefresh}
                    size="sm"
                    variant="outline"
                >
                    {isRefetching ? (
                        <LoadingSpinner className="size-3" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    Refresh
                </Button>

                <Button
                    className="flex items-center gap-2"
                    onClick={onViewAmort}
                    size="sm"
                    variant="outline"
                >
                    <FileText className="w-4 h-4" />
                    View Amort.
                </Button>

                <Button
                    className="w-9 h-9"
                    onClick={onViewOriginal}
                    size="icon"
                    variant="ghost"
                >
                    <Eye className="w-4 h-4" />
                </Button>
            </div>

            {canProcess && handleProcess && (
                <Button
                    disabled={isProcessing}
                    onClick={handleProcess}
                    size="sm"
                    variant="secondary"
                >
                    {isProcessing ? 'Processing...' : 'Process'}
                </Button>
            )}
        </div>
    )
}

const LoanLedgerHeader = ({
    className,
    loanTransaction,
    loanTransactionSummary,
    isRefetching,
    canRefresh,
    handleRefresh,
    ...theRest
}: IClassProps & {
    loanTransaction: ILoanTransaction
    loanTransactionSummary?: ILoanTransactionSummary
    isProcessing?: boolean
    isRefetching?: boolean
    canRefresh?: boolean
    canProcess?: boolean
    handleProcess?: () => void
    handleRefresh?: () => void
}) => {
    const amortModal = useModalState()
    const viewModal = useModalState()

    return (
        <div className={cn('', className)}>
            <LoanAmortizationModal
                {...amortModal}
                loanTransactionId={loanTransaction.id}
            />
            <LoanTransactionCreateUpdateFormModal
                {...viewModal}
                formProps={{
                    loanTransactionId: loanTransaction.id,
                    defaultValues: loanTransaction,
                }}
            />

            <div className=" gap-4 space-y-4 w-full">
                <LoanToolbar
                    canRefresh={canRefresh}
                    isRefetching={isRefetching}
                    onRefresh={handleRefresh}
                    onViewAmort={() => amortModal.onOpenChange(true)}
                    onViewOriginal={() => viewModal.onOpenChange(true)}
                    releasedDate={
                        loanTransaction.released_date
                            ? toReadableDateTime(loanTransaction.released_date)
                            : undefined
                    }
                    releasedTimeAgo={
                        loanTransaction.released_date
                            ? dateAgo(loanTransaction.released_date)
                            : undefined
                    }
                    voucherStatus={
                        loanTransaction.check_number &&
                        loanTransaction.check_number.length > 0
                            ? loanTransaction.check_number
                            : 'No Voucher Set...'
                    }
                    {...theRest}
                />

                <LoanDetails
                    className="flex-1"
                    loanTransaction={loanTransaction}
                    loanTransactionSummary={loanTransactionSummary}
                />
            </div>
        </div>
    )
}

export default LoanLedgerHeader
