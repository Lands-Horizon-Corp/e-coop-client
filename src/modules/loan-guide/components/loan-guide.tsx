import { useMemo } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { toReadableDate, toReadableDateTime } from '@/helpers/date-utils'
import { AccountViewerModal } from '@/modules/account/components/account-viewer/account-viewer'
import { currencyFormat } from '@/modules/currency'
import { GeneralLedgerViewSheet } from '@/modules/general-ledger/components/ledger-detail'
import { useGetLoanGuide } from '@/modules/loan-transaction'

import {
    BadgeCheckFillIcon,
    BadgeExclamationFillIcon,
    BankDuoToneIcon,
    BankIcon,
    CalendarNumberIcon,
    ClockIcon,
    PlayIcon,
    ReceiptIcon,
    RefreshIcon,
    RenderIcon,
    TrendingDownIcon,
    ZapIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import {
    ILoanAccountSummary,
    ILoanGuide,
    ILoanPaymentSchedule,
    ILoanPayments,
    TLoanScheduleStatus,
} from '../loan-guide.types'
import { buildLoanGuideTimeline, getLoanAccounts } from '../loan-guide.utils'

const statusConfig: Record<
    TLoanScheduleStatus,
    {
        icon: React.ComponentType<{ className?: string }>
        label: string
        className: string
        iconClassName: string
        bgGradient: string
    }
> = {
    paid: {
        icon: BadgeCheckFillIcon,
        label: 'Paid',
        className:
            'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400',
        iconClassName: 'text-emerald-600 dark:text-emerald-400',
        bgGradient: 'from-emerald-500/20 to-emerald-600/5',
    },
    advance: {
        icon: ZapIcon,
        label: 'Advance',
        className:
            'bg-sky-500/10 border-sky-500/30 text-sky-600 dark:text-sky-400',
        iconClassName: 'text-sky-600 dark:text-sky-400',
        bgGradient: 'from-sky-500/20 to-sky-600/5',
    },
    due: {
        icon: ClockIcon,
        label: 'Due',
        className: 'bg-muted border-border text-muted-foreground',
        iconClassName: 'text-muted-foreground',
        bgGradient: 'from-muted/50 to-muted/20',
    },
    overdue: {
        icon: BadgeExclamationFillIcon,
        label: 'Overdue',
        className: 'bg-destructive/10 border-destructive/30 text-destructive',
        iconClassName: 'text-destructive',
        bgGradient: 'from-destructive/20 to-destructive/5',
    },
    skipped: {
        icon: PlayIcon,
        label: 'Skipped',
        className:
            'bg-orange-500/10 border-orange-500/30 text-orange-600 dark:text-orange-400',
        iconClassName: 'text-orange-600 dark:text-orange-400',
        bgGradient: 'from-orange-500/20 to-orange-600/5',
    },
}

const LoanPaymentItem = ({ payment }: { payment: ILoanPayments }) => {
    const viewLedgerEntryModal = useModalState()

    return (
        <>
            {payment.general_ledger && (
                <GeneralLedgerViewSheet
                    defaultLedgerValue={payment.general_ledger}
                    ledgerId={payment.general_ledger.id}
                    {...viewLedgerEntryModal}
                />
            )}
            <div
                className="flex cursor-pointer items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted/70 transition-colors"
                onClick={() => {
                    if (!payment.general_ledger)
                        return toast.warning(
                            'Sorry, could not show general ledger, because it is missing or not found'
                        )
                    viewLedgerEntryModal.onOpenChange(true)
                }}
            >
                <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <BankIcon className="size-4 text-primary" />
                    </div>
                    <div>
                        <p className="text-sm font-medium">
                            {payment.general_ledger.payment_type?.type}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            {toReadableDateTime(payment.pay_date)}
                        </p>
                    </div>
                </div>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {currencyFormat(payment.amount)}
                </span>
            </div>
        </>
    )
}

const PaymentScheduleDisplay = ({
    schedule,
    className,
}: {
    className?: string
    schedule: ILoanPaymentSchedule | null
}) => {
    if (!schedule) return null

    const config = statusConfig[schedule.type]
    const StatusIcon = config.icon

    const isPaidOrAdvance =
        schedule.type === 'paid' || schedule.type === 'advance'
    const isDueOrOverdue =
        schedule.type === 'due' || schedule.type === 'overdue'
    const isSkipped = schedule.type === 'skipped'

    const displayAmount = isPaidOrAdvance
        ? schedule.amount_paid
        : isDueOrOverdue
          ? schedule.amount_due
          : 0

    return (
        <div className={cn('p-0 ', className)}>
            <div
                className={cn(
                    'bg-gradient-to-br p-4 pb-8 space-y-4',
                    config.bgGradient
                )}
            >
                <div className="flex items-center justify-between">
                    <Badge
                        className={cn('gap-1.5 px-3 py-1', config.className)}
                        variant="outline"
                    >
                        <StatusIcon className="size-3.5" />
                        {config.label}
                    </Badge>
                    <span className="text-sm text-muted-foreground flex items-center gap-1.5">
                        <CalendarNumberIcon className="size-3.5" />
                        {toReadableDate(schedule.payment_date)}
                    </span>
                </div>
                <p className="text-4xl font-bold tracking-tight">
                    {currencyFormat(displayAmount)}
                </p>
                {/* <p className="text-sm text-muted-foreground">{accountName}</p> */}
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
                {/* Due/Overdue specific info */}
                {isDueOrOverdue && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <BankDuoToneIcon className="size-5 text-primary mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Principal
                                    </p>
                                    <p className="font-semibold">
                                        {currencyFormat(
                                            schedule.principal_amount
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                                <TrendingDownIcon className="size-5 text-amber-500 mt-0.5" />
                                <div>
                                    <p className="text-xs text-muted-foreground">
                                        Interest
                                    </p>
                                    <p className="font-semibold">
                                        {currencyFormat(
                                            schedule.interest_amount
                                        )}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {schedule.fines_amount > 0 && (
                            <div className="flex items-start gap-3 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <BadgeExclamationFillIcon className="size-5 text-destructive mt-0.5" />
                                <div>
                                    <p className="text-xs text-destructive/80">
                                        Fines
                                    </p>
                                    <p className="font-semibold text-destructive">
                                        {currencyFormat(schedule.fines_amount)}
                                    </p>
                                </div>
                            </div>
                        )}

                        {parseInt(schedule.days_skipped) > 0 && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <PlayIcon className="size-4" />
                                <span>
                                    {schedule.days_skipped} day(s) skipped
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Paid/Advance specific info */}
                {isPaidOrAdvance && (
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <BadgeCheckFillIcon className="size-4 text-emerald-500" />
                            <span>
                                Paid on{' '}
                                {toReadableDate(
                                    schedule.actual_date ||
                                        schedule.payment_date
                                )}
                            </span>
                        </div>

                        {schedule.loan_payments.length > 0 && (
                            <>
                                <Separator />
                                <div className="space-y-3">
                                    <h4 className="text-sm font-medium flex items-center gap-2">
                                        <ReceiptIcon className="size-4" />
                                        Payment
                                        {schedule.loan_payments.length > 1
                                            ? 's'
                                            : ''}
                                    </h4>
                                    <div className="space-y-2">
                                        {schedule.loan_payments.map(
                                            (payment, idx) => (
                                                <LoanPaymentItem
                                                    key={idx}
                                                    payment={payment}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            </>
                        )}

                        {/* Balance info */}
                        <div className="flex items-center justify-between p-3 rounded-lg border bg-card">
                            <span className="text-sm text-muted-foreground">
                                Remaining Balance
                            </span>
                            <span className="font-semibold">
                                {currencyFormat(schedule.balance)}
                            </span>
                        </div>
                    </div>
                )}

                {/* Skipped specific info */}
                {isSkipped && (
                    <div className="text-center py-4">
                        <div className="size-12 rounded-full bg-orange-500/10 flex items-center justify-center mx-auto mb-3">
                            <PlayIcon className="size-6 text-orange-500" />
                        </div>
                        <p className="text-muted-foreground">
                            This payment was skipped
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                            {schedule.days_skipped} day(s) added to schedule
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

const EmptyState = () => {
    return (
        <div className="flex flex-col items-center justify-center py-16 px-4">
            <div className="relative mb-6">
                <div className="size-20 rounded-full bg-muted/50 flex items-center justify-center">
                    <CalendarNumberIcon className="size-10 text-muted-foreground/60" />
                </div>
                <div className="absolute -bottom-1 -right-1 size-8 rounded-full bg-primary/10 flex items-center justify-center border-4 border-card">
                    <ClockIcon className="size-4 text-primary" />
                </div>
            </div>

            <h3 className="text-lg font-semibold text-foreground mb-2">
                No Payment Schedule
            </h3>

            <p className="text-sm text-muted-foreground text-center max-w-sm mb-6">
                There are no loan accounts or payment schedules to display yet.
                Add loan accounts to start tracking your payments.
            </p>

            <div className="flex items-center gap-6 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-emerald-500" />
                    <span>Track payments</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-sky-500" />
                    <span>Manage schedules</span>
                </div>
                <div className="flex items-center gap-2">
                    <div className="size-2 rounded-full bg-orange-500" />
                    <span>Monitor status</span>
                </div>
            </div>
        </div>
    )
}

const PaymentCell = ({
    schedule,
}: {
    schedule: ILoanPaymentSchedule | null
}) => {
    const viewLoanPaymentScheduleModal = useModalState()

    if (!schedule) {
        return (
            <div className="flex items-center justify-center h-full">
                <span className="text-muted-foreground/40 text-xs">—</span>
            </div>
        )
    }

    const config = statusConfig[schedule.type]

    return (
        <div
            className={cn(
                'group relative rounded border px-1.5 py-1 transition-all duration-150',
                'hover:shadow-sm cursor-default',
                config.className
            )}
            onClick={() => viewLoanPaymentScheduleModal.onOpenChange(true)}
        >
            <div className="absolute" onClick={(e) => e.stopPropagation()}>
                <Modal
                    {...viewLoanPaymentScheduleModal}
                    className="p-0"
                    closeButtonClassName="hidden"
                >
                    <PaymentScheduleDisplay
                        className="p-0"
                        schedule={schedule}
                    />
                </Modal>
            </div>
            <p className="gap-x-2 w-full gap-y-0.5 text-sm text-center">
                {(schedule.type === 'paid' || schedule.type === 'advance') && (
                    <>{currencyFormat(schedule.amount_paid)}</>
                )}

                {(schedule.type === 'due' || schedule.type === 'overdue') && (
                    <>{currencyFormat(schedule.amount_due)}</>
                )}

                {schedule.type === 'skipped' && currencyFormat(0)}
            </p>
        </div>
    )
}

const AccountHeader = ({
    loanAccountSummary,
}: {
    loanAccountSummary: ILoanAccountSummary
}) => {
    const account = loanAccountSummary.loan_account.account

    const viewAccountModal = useModalState()

    return (
        <TableHead className="min-w-[200px]  text-center">
            <AccountViewerModal
                {...viewAccountModal}
                accountViewerProps={{
                    accountId: account.id,
                    defaultValue: account,
                }}
            />
            <RenderIcon className="inline mr-1" icon={account?.icon} />
            <p
                className="truncate"
                onClick={() => viewAccountModal.onOpenChange(true)}
            >
                {account?.name}
            </p>
        </TableHead>
    )
}

const SkeletonState = () => {
    const skeletonRows = 6
    const skeletonCols = 3

    return (
        <div className="overflow-auto rounded-lg border bg-background">
            <Table>
                <TableHeader className="sticky top-0 z-10 bg-muted/80 backdrop-blur-sm">
                    <TableRow>
                        <TableHead className="sticky left-0 z-20 w-[120px] bg-muted font-semibold">
                            <Skeleton className="h-4 w-24" />
                        </TableHead>
                        {Array.from({ length: skeletonCols }).map((_, i) => (
                            <TableHead
                                className="min-w-[130px] text-center"
                                key={i}
                            >
                                <Skeleton className="h-4 w-20 mx-auto" />
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Array.from({ length: skeletonRows }).map((_, rowIndex) => (
                        <TableRow key={rowIndex}>
                            <TableCell className="sticky left-0 z-10 bg-card">
                                <Skeleton className="h-4 w-24" />
                            </TableCell>
                            {Array.from({ length: skeletonCols }).map(
                                (_, colIndex) => (
                                    <TableCell
                                        className="text-center p-2"
                                        key={colIndex}
                                    >
                                        <Skeleton className="h-8 w-full rounded-lg" />
                                    </TableCell>
                                )
                            )}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}

const LoanGuide = ({
    initialData,
    loanTransactionId,
    className,
}: {
    className?: string
    loanTransactionId: TEntityId
    initialData?: ILoanGuide
}) => {
    const {
        data: loanGuide,
        isPending,
        isRefetching,
        refetch,
    } = useGetLoanGuide({
        loanTransactionId,
        options: {
            initialData,
        },
    })

    const timeline = useMemo(() => {
        if (!loanGuide) return []
        return buildLoanGuideTimeline(loanGuide)
    }, [loanGuide])

    const accounts = useMemo(() => {
        if (!loanGuide) return []
        return getLoanAccounts(loanGuide)
    }, [loanGuide])

    return (
        <div
            className={cn(
                'bg-popover border p-4 gap-y-2 rounded-xl flex flex-col',
                className
            )}
        >
            <div className="flex items-start justify-between gap-4">
                <p>
                    <CalendarNumberIcon className="text-primary inline mr-1" />{' '}
                    Loan Guide
                    <span className="block text-xs text-muted-foreground">
                        View and monitor payment schedules for this loan.
                    </span>
                </p>

                <div className="flex items-center gap-2">
                    {/* Legend */}
                    <div className="flex flex-wrap items-center bg-primary/5 p-2 rounded-xl border gap-4 text-xs">
                        <p className="font-medium">Legends:</p>

                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-emerald-500" />
                            <span className="text-muted-foreground">Paid</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-sky-500" />
                            <span className="text-muted-foreground">
                                Advance
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-muted-foreground" />
                            <span className="text-muted-foreground">Due</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-destructive" />
                            <span className="text-muted-foreground">
                                Overdue
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <div className="size-3 rounded-full bg-orange-500" />
                            <span className="text-muted-foreground">
                                Skipped
                            </span>
                        </div>
                    </div>
                    <Button
                        className="gap-2 rounded-xl"
                        disabled={isRefetching}
                        onClick={() => refetch()}
                        size="sm"
                        variant="outline"
                    >
                        {isRefetching || isPending ? (
                            <LoadingSpinner className="size-3.5" />
                        ) : (
                            <RefreshIcon className="inline size-3.5" />
                        )}
                        Refresh
                    </Button>
                </div>
            </div>

            {timeline.length > 0 ? (
                <Table
                    className="table-auto min-w-max"
                    wrapperClassName="overflow-auto ecoop-scroll rounded-xl border bg-background"
                >
                    <TableHeader className="sticky top-0 z-30 bg-background/90 backdrop-blur-xs">
                        <TableRow>
                            <TableHead className="sticky left-0 z-20 w-[180px] bg-card">
                                Payment Date
                            </TableHead>

                            {accounts.map((loanAccountSummary) => (
                                <AccountHeader
                                    key={loanAccountSummary.loan_account.id}
                                    loanAccountSummary={loanAccountSummary}
                                />
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {timeline.map((row) => (
                            <TableRow key={row.payment_date}>
                                <TableCell className="sticky left-0 z-10 bg-card font-medium whitespace-nowrap">
                                    {row.payment_date}
                                </TableCell>

                                {accounts.map((account) => (
                                    <TableCell
                                        className="text-center min-w-[150px]"
                                        key={account.loan_account.id}
                                    >
                                        <PaymentCell
                                            schedule={
                                                row.schedules[
                                                    account.loan_account.id
                                                ]
                                            }
                                        />
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            ) : !isPending ? (
                <EmptyState />
            ) : (
                <SkeletonState />
            )}
        </div>
    )
}

export const LoanGuideModal = ({
    loanTransactionId,
    ...props
}: IModalProps & {
    loanTransactionId: TEntityId
}) => {
    return (
        <Modal
            {...props}
            className="!max-w-[90vw] p-4 shadow-none border-none gap-y-0"
            closeButtonClassName="top-2 right-2"
            descriptionClassName="sr-only"
            titleClassName="sr-only"
        >
            <LoanGuide
                className="max-h-[80vh] flex"
                loanTransactionId={loanTransactionId}
            />
        </Modal>
    )
}

export default LoanGuide
