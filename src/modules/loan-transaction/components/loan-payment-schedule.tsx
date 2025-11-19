import { toast } from 'sonner'

import { cn } from '@/helpers'
import { dateAgo, toReadableDate } from '@/helpers/date-utils'
import { sortAccountsByTypePriority } from '@/modules/account/account.utils'
import { AccountViewerModal } from '@/modules/account/components/account-viewer/account-viewer'
import { currencyFormat } from '@/modules/currency'
import { EyeIcon } from 'lucide-react'

import {
    BadgeCheckFillIcon,
    CalendarNumberIcon,
    CheckFillIcon,
    ChevronsLeftIcon,
    ChevronsRightIcon,
    ClockIcon,
    DollarIcon,
    ErrorExclamationIcon,
    FileFillIcon,
    MoneyBagIcon,
    ReceiveMoneyIcon,
    RefreshIcon,
    RenderIcon,
    TrendingUpIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import CopyWrapper from '@/components/wrappers/copy-wrapper'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import {
    ILoanPaymentPerAccount,
    useGetLoanTransactionById,
    useLoanPaymentSchedule,
    useProcessLoanTransactionById,
} from '..'
import { LoanTransactionCreateUpdateFormModal } from './forms/loan-transaction-create-update-form'
import { LoanAmortizationModal } from './loan-amortization'
import {
    LoanOverallPaymentStatusBadge,
    LoanPaymentStatusBadge,
} from './loan-payment-status-type-badges'
import { LoanViewModal } from './loan-view/loan-view'

interface Props extends IClassProps {
    loanTransactionId: TEntityId
    accountDefaultId?: TEntityId
}

// SUMMARY CONTENT
const LoanPaymentSchedule = ({
    className,
    loanTransactionId,
    accountDefaultId,
}: Props) => {
    const { data, isPending, refetch, isRefetching } = useLoanPaymentSchedule({
        loanTransactionId,
        options: {
            enabled: loanTransactionId !== undefined,
        },
    })

    return (
        <div className={cn('space-y-6 min-w-0 max-w-full', className)}>
            {/* Summary Section */}
            {isPending ? (
                <LoanPaymentScheduleSkeleton />
            ) : data !== undefined ? (
                <div className="flex items-start min-h-0 min-w-0 gap-x-4">
                    <Card className="rounded-2xl sticky top-0 bg-popover">
                        <CardHeader>
                            <CardTitle className="flex text-base items-center gap-2">
                                <TrendingUpIcon className="inline" />
                                <p>Loan Payment Summary</p>
                                <LoanOverallPaymentStatusBadge
                                    className="w-fit ml-auto"
                                    size="sm"
                                    status={data.summary.overall_payment_status}
                                />
                                <Button
                                    className="size-fit p-1"
                                    disabled={isRefetching || isPending}
                                    onClick={() => refetch()}
                                    size="icon"
                                    variant="ghost"
                                >
                                    {isRefetching || isPending ? (
                                        <LoadingSpinner className="size-4" />
                                    ) : (
                                        <RefreshIcon />
                                    )}
                                </Button>
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Overview of all account payment schedules
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <SummaryActions
                                loanTransactionId={loanTransactionId}
                            />

                            <div className="mb-4">
                                <div className="text-sm space-y-1">
                                    <span className="text-xs flex justify-between">
                                        {toReadableDate(
                                            data.summary?.last_payment_date ||
                                                new Date()
                                        )}{' '}
                                        <span className="text-muted-foreground">
                                            {dateAgo(
                                                data.summary
                                                    ?.last_payment_date ||
                                                    new Date()
                                            )}
                                        </span>
                                    </span>
                                    <div className="flex items-center gap-x-2">
                                        <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg inline-flex items-center justify-center">
                                            <ReceiveMoneyIcon />
                                        </div>
                                        <span className="text-primary bg-gradient-to-tl from-card/20 to-primary/10 flex-1 px-2 py-0.5 rounded-sm ml-1 block  text-sm">
                                            {currencyFormat(
                                                data.summary
                                                    .last_payment_amount,
                                                {
                                                    currency: data.currency,
                                                    showSymbol: !!data.currency,
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className="text-xs mt-2 flex justify-center items-center gap-2 text-muted-foreground text-center">
                                    Previous Payment
                                </div>
                            </div>

                            <div className="grid mt-4 grid-cols-1 gap-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                                        <BadgeCheckFillIcon className="size-4 text-success" />
                                    </div>
                                    <span className="text-muted-foreground">
                                        Paid
                                    </span>
                                    <Separator className="flex-1" />
                                    <span className="font-medium text-right inline-block">
                                        {data.summary.total_paid_payments}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                                        <ErrorExclamationIcon className="size-4 text-destructive" />
                                    </div>
                                    <span className="text-muted-foreground">
                                        Overdue
                                    </span>
                                    <Separator className="flex-1" />
                                    <span className="font-medium text-right inline-block">
                                        {data.summary.total_overdue_payments}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                                        <ClockIcon className="size-4" />
                                    </div>
                                    <span className="text-muted-foreground">
                                        Schedules
                                    </span>
                                    <Separator className="flex-1" />
                                    <span className="font-medium text-right inline-block">
                                        {data.summary.total_upcoming_payments}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                                        <DollarIcon className="size-4" />
                                    </div>
                                    <span className="text-muted-foreground">
                                        Advance
                                    </span>
                                    <Separator className="flex-1" />
                                    <span className="font-medium text-right inline-block">
                                        {data.summary.total_advance_payments}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg flex items-center justify-center">
                                        <CalendarNumberIcon className="size-4" />
                                    </div>
                                    <span className="text-muted-foreground">
                                        Total Scheduled
                                    </span>
                                    <Separator className="flex-1" />
                                    <span className="font-medium text-right inline-block">
                                        {data.summary.total_scheduled_payments}
                                    </span>
                                </div>
                            </div>

                            {/* Financial Summary */}
                            <div className="mt-6 space-y-3 border p-3 rounded-xl bg-accent/20 text-accent-foreground">
                                <p className="text-xs font-medium text-muted-foreground">
                                    Financial Overview
                                </p>
                                <div className="space-y-2 text-xs">
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Total Principal
                                        </span>
                                        <span className="font-medium">
                                            {currencyFormat(
                                                data.summary.total_principal,
                                                {
                                                    currency: data.currency,
                                                    showSymbol: !!data.currency,
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Total Paid
                                        </span>
                                        <span className="font-medium text-success">
                                            {currencyFormat(
                                                data.summary.total_paid_amount,
                                                {
                                                    currency: data.currency,
                                                    showSymbol: !!data.currency,
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Remaining Balance
                                        </span>
                                        <span className="font-medium">
                                            {currencyFormat(
                                                data.summary
                                                    .total_remaining_balance,
                                                {
                                                    currency: data.currency,
                                                    showSymbol: !!data.currency,
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Total Due
                                        </span>
                                        <span className="font-medium text-destructive">
                                            {currencyFormat(
                                                data.summary.total_due_amount,
                                                {
                                                    currency: data.currency,
                                                    showSymbol: !!data.currency,
                                                }
                                            )}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-muted-foreground">
                                            Advance Payment
                                        </span>
                                        <span className="font-medium">
                                            {currencyFormat(
                                                data.summary
                                                    .total_advance_payment,
                                                {
                                                    currency: data.currency,
                                                    showSymbol: !!data.currency,
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Loan Fully Paid Badge */}
                            {data.summary.is_loan_fully_paid && (
                                <div className="mt-6 p-3 bg-success/10 border border-success/20 rounded-lg">
                                    <div className="flex items-center gap-2 text-success">
                                        <BadgeCheckFillIcon className="size-5" />
                                        <span className="font-medium text-sm">
                                            All Loans Fully Paid
                                        </span>
                                    </div>
                                </div>
                            )}

                            {data.summary.earliest_next_payment_date && (
                                <>
                                    <div className="flex mt-7 items-start gap-x-2 w-full">
                                        <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg inline-flex items-center justify-center">
                                            <ChevronsRightIcon className="size-6" />
                                        </div>
                                        <div className="space-y-1 w-full">
                                            <p className="text-primary bg-gradient-to-tl from-card/20 to-primary/10 flex-1 px-2 py-0.5 rounded-sm w-full text-xl">
                                                {currencyFormat(
                                                    data.summary
                                                        .total_suggested_payment,
                                                    {
                                                        currency: data.currency,
                                                        showSymbol:
                                                            !!data.currency,
                                                    }
                                                )}
                                            </p>
                                            <div className="flex text-xs items-center justify-between">
                                                <p>
                                                    {toReadableDate(
                                                        data.summary
                                                            .earliest_next_payment_date
                                                    )}
                                                </p>
                                                <p className="text-muted-foreground">
                                                    {dateAgo(
                                                        data.summary
                                                            .earliest_next_payment_date
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-xs mt-2 flex justify-center items-center gap-2 text-muted-foreground text-center">
                                        <span className="size-1 block bg-primary animate-pulse rounded-full" />{' '}
                                        Next Payment
                                    </div>
                                </>
                            )}
                        </CardContent>
                    </Card>
                    <Card className="rounded-2xl min-w-0 min-h-0 max-h-full flex flex-col flex-1 bg-popover">
                        <CardHeader className="flex-shrink-0">
                            <CardTitle className="text-base">
                                Account Payment Schedules
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Detailed payment schedule for each account
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex-1 min-h-0 max-h-full overflow-auto">
                            <Tabs
                                className="w-full relative overflow-clip max-h-full min-h-0 flex-row min-w-0"
                                defaultValue={`account-${accountDefaultId || 0}`}
                                orientation="vertical"
                            >
                                <TabsList className="flex-col h-fit gap-1 sticky top-0 rounded-none bg-transparent px-1 py-0 text-foreground">
                                    {data.account_payments
                                        .sort(
                                            ({ account: a }, { account: b }) =>
                                                sortAccountsByTypePriority(a, b)
                                        )
                                        .map((accountPayment) => {
                                            const displayName =
                                                accountPayment.account.name

                                            return (
                                                <TabsTrigger
                                                    className="relative w-full justify-start after:absolute after:inset-y-0 after:start-0 after:-ms-1 after:w-0.5 hover:bg-accent hover:text-foreground data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:after:bg-primary data-[state=active]:hover:bg-accent"
                                                    key={
                                                        accountPayment.account
                                                            .id
                                                    }
                                                    value={`account-${accountPayment.account.id}`}
                                                >
                                                    {accountPayment.account
                                                        .icon && (
                                                        <span className="relative mr-2 text-primary">
                                                            <RenderIcon
                                                                className="-ms-0.5 me-1.5 opacity-60 size-4"
                                                                icon={
                                                                    accountPayment
                                                                        .account
                                                                        .icon
                                                                }
                                                            />
                                                        </span>
                                                    )}
                                                    {displayName}
                                                    {accountPayment.overdue_payment_count &&
                                                    accountPayment.overdue_payment_count >
                                                        0 ? (
                                                        <Badge
                                                            className="ms-1.5 min-w-5 bg-destructive/15 text-destructive px-1"
                                                            variant="secondary"
                                                        >
                                                            {
                                                                accountPayment.overdue_payment_count
                                                            }
                                                        </Badge>
                                                    ) : null}
                                                    <Badge
                                                        className="ms-1.5 min-w-5 bg-primary/15 px-1"
                                                        variant="secondary"
                                                    >
                                                        {
                                                            accountPayment
                                                                .loan_payment_schedule
                                                                .length
                                                        }
                                                    </Badge>
                                                </TabsTrigger>
                                            )
                                        })}
                                </TabsList>
                                {data.account_payments.map((accountPayment) => (
                                    <LoanPaymentAccountScheduleSummary
                                        accountPaymentSummary={accountPayment}
                                        key={accountPayment.account.id}
                                        tabValue={`account-${accountPayment.account.id}`}
                                    />
                                ))}
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                <p className="text-center py-[30vh] bg-muted text-muted-foreground">
                    No Payment Schedule result yet
                </p>
            )}
        </div>
    )
}

// ACTIONS
const SummaryActions = ({
    loanTransactionId,
}: {
    loanTransactionId: TEntityId
}) => {
    const viewAmortizationModal = useModalState()
    const viewLoanViewModal = useModalState()
    // FOR CREATE UPDATE READONLY
    const viewLoanTransactionModal = useModalState()

    const { data: loanTransaction, isPending } = useGetLoanTransactionById({
        id: loanTransactionId,
    })
    const { mutateAsync: processLoan, isPending: isProcessing } =
        useProcessLoanTransactionById()

    return (
        <div className="flex justify-evenly flex-wrap gap-y-1 gap-x-2 items-center mb-4">
            {/* MODALS */}
            <LoanTransactionCreateUpdateFormModal
                {...viewLoanTransactionModal}
                formProps={{
                    readOnly: true,
                    defaultValues: loanTransaction,
                }}
            />
            <LoanAmortizationModal
                {...viewAmortizationModal}
                loanTransactionId={loanTransactionId}
            />
            <LoanViewModal
                {...viewLoanViewModal}
                loanTransactionId={loanTransactionId}
            />
            <Button
                className="py-1 flex-1"
                onClick={() => viewLoanViewModal.onOpenChange(true)}
                size="sm"
                variant="outline"
            >
                View
            </Button>
            <Button
                className="py-1 flex-1"
                onClick={() => viewAmortizationModal.onOpenChange(true)}
                size="sm"
                variant="outline"
            >
                Amort.
            </Button>

            <Button
                className="py-1 flex-1"
                disabled={isPending || !loanTransaction}
                onClick={() => viewLoanTransactionModal.onOpenChange(true)}
                size="sm"
                variant="outline"
            >
                Entry
            </Button>
            <Button
                className="py-1 w-full"
                disabled={isProcessing}
                onClick={() => {
                    toast.promise(processLoan(loanTransactionId), {
                        loading: 'Processing loan payment schedule...',
                        error: 'Failed to process loan payment schedule',
                        success: 'Loan payment schedule processed successfully',
                    })
                }}
                size="sm"
            >
                {isProcessing ? (
                    <>
                        <LoadingSpinner /> Processing
                    </>
                ) : (
                    <>
                        <FileFillIcon /> Process
                    </>
                )}
            </Button>
        </div>
    )
}

// SLEKETON
const LoanPaymentScheduleSkeleton = () => {
    return (
        <div className="flex items-start min-h-0 min-w-0 gap-x-4">
            {/* Left Column - Payment Summary */}
            <Card className="rounded-2xl sticky top-0 bg-popover w-[350px]">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-5 w-5" />
                        <Skeleton className="h-6 w-32" />
                        <Skeleton className="h-5 w-16 ml-auto" />
                    </div>
                    <Skeleton className="h-4 w-48" />
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Previous Payment */}
                    <div className="space-y-2">
                        <div className="flex items-center gap-2">
                            <Skeleton className="size-8 rounded-lg" />
                            <Skeleton className="h-8 w-32 flex-1" />
                        </div>
                        <div className="flex justify-between text-xs">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-4 w-28 mx-auto" />
                    </div>

                    {/* Payment Stats */}
                    <div className="space-y-2">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div className="flex items-center gap-2" key={item}>
                                <Skeleton className="size-6 rounded-lg flex-shrink-0" />
                                <Skeleton className="h-4 w-20" />
                                <Skeleton className="h-px flex-1" />
                                <Skeleton className="h-4 w-8" />
                            </div>
                        ))}
                    </div>

                    {/* Financial Summary */}
                    <div className="border p-3 rounded-xl space-y-3">
                        <Skeleton className="h-4 w-32" />
                        <div className="space-y-2">
                            {[1, 2, 3, 4, 5].map((item) => (
                                <div
                                    className="flex justify-between"
                                    key={item}
                                >
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Next Payment */}
                    <div className="space-y-2">
                        <div className="flex items-start gap-2">
                            <Skeleton className="size-8 rounded-lg flex-shrink-0" />
                            <div className="flex-1 space-y-1">
                                <Skeleton className="h-8 w-full" />
                                <div className="flex justify-between">
                                    <Skeleton className="h-3 w-24" />
                                    <Skeleton className="h-3 w-16" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-4 w-28 mx-auto" />
                    </div>
                </CardContent>
            </Card>

            {/* Right Column - Account Payment Schedules */}
            <Card className="rounded-2xl min-w-0 min-h-0 max-h-full flex flex-col flex-1 bg-popover">
                <CardHeader className="flex-shrink-0">
                    <Skeleton className="h-6 w-56" />
                    <Skeleton className="h-4 w-64" />
                </CardHeader>
                <CardContent className="flex-1 min-h-0 max-h-full overflow-auto">
                    <div className="flex gap-4">
                        {/* Tab List */}
                        <div className="flex flex-col gap-1 w-56">
                            {[1, 2, 3, 4].map((item) => (
                                <div
                                    className="flex items-center gap-2 p-2"
                                    key={item}
                                >
                                    <Skeleton className="size-4" />
                                    <Skeleton className="h-4 flex-1" />
                                    <Skeleton className="h-5 w-6 rounded-full" />
                                </div>
                            ))}
                        </div>

                        {/* Tab Content */}
                        <div className="flex-1 space-y-2">
                            {/* Account Summary */}
                            <div className="border p-4 rounded-xl space-y-4">
                                <Skeleton className="h-12 w-full rounded-lg" />

                                {/* Payment Info Grid */}
                                <div className="flex gap-4">
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            className="flex-1 space-y-2"
                                            key={item}
                                        >
                                            <Skeleton className="h-5 w-full" />
                                            <Skeleton className="h-16 w-full rounded-md" />
                                        </div>
                                    ))}
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-3 gap-4">
                                    {[1, 2, 3, 4, 5, 6].map((item) => (
                                        <div className="flex gap-2" key={item}>
                                            <Skeleton className="size-6 rounded-lg flex-shrink-0" />
                                            <div className="flex-1 space-y-1">
                                                <Skeleton className="h-3 w-20" />
                                                <Skeleton className="h-4 w-16" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Payment Schedule Table */}
                            <div className="border rounded-xl">
                                <div className="border-b p-4">
                                    <div className="flex gap-4">
                                        <Skeleton className="h-4 w-24" />
                                        <Skeleton className="h-4 w-20 ml-auto" />
                                        <Skeleton className="h-4 w-16" />
                                        <Skeleton className="h-4 w-20" />
                                    </div>
                                </div>
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <div className="border-b p-4" key={item}>
                                        <div className="flex gap-4 items-center">
                                            <Skeleton className="h-4 w-32" />
                                            <Skeleton className="h-4 w-20 ml-auto" />
                                            <Skeleton className="h-6 w-20 rounded-full" />
                                            <Skeleton className="h-4 w-24" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

// PER ACCOUNT SUMMARY ITEM
export const LoanPaymentAccountScheduleSummary = ({
    accountPaymentSummary,
    tabValue,
}: {
    tabValue: string
    accountPaymentSummary: ILoanPaymentPerAccount
}) => {
    const viewAccountModal = useModalState()

    return (
        <TabsContent
            className="space-y-2"
            key={accountPaymentSummary.account.id}
            value={tabValue}
        >
            <AccountViewerModal
                {...viewAccountModal}
                accountViewerProps={{
                    accountId: accountPaymentSummary.account_history_id,
                    isHistoryAccount:
                        !!accountPaymentSummary.account_history_id,
                }}
            />
            {accountPaymentSummary.is_loan_fully_paid && (
                <div className="border border-primary px-3 py-2 rounded-xl bg-primary/30 gap-x-2 flex items-center justify-center">
                    <BadgeCheckFillIcon className="size-5 text-success" />
                    <p>This loan account is already fully paid!</p>
                </div>
            )}
            <div
                className={cn(
                    'border bg-accent/40 p-4 rounded-xl gap-x-4 space-y-4',
                    accountPaymentSummary.is_loan_fully_paid &&
                        'opacity-70 saturate-50'
                )}
            >
                <div className="flex items-center border gap-x-2 text-sm  p-4 rounded-lg bg-gradient-to-tr from-primary/20 to-popover">
                    {accountPaymentSummary.account.icon && (
                        <RenderIcon
                            className="shrink-0"
                            icon={accountPaymentSummary.account.icon}
                        />
                    )}
                    <p className="flex flex-1 items-center gap-x-2">
                        {accountPaymentSummary.account.name}{' '}
                        <span className="size-1 inline-block rounded-full bg-primary animate-pulse" />{' '}
                        Payment Summary
                    </p>
                    <Button
                        className="size-fit p-1 shrink-0"
                        onClick={() => viewAccountModal.onOpenChange(true)}
                        size="icon"
                        variant="ghost"
                    >
                        <EyeIcon className="size-3" />
                    </Button>
                </div>
                <div className="flex items-center flex-1 gap-x-4 justify-between">
                    <div className="space-y-1">
                        <span className="font-semibold block bg-gradient-to-r from-primary/20 to-transparen px-1 py-0.5 text-primary rounded-md text-xs">
                            {currencyFormat(
                                accountPaymentSummary.last_payment_amount,
                                {
                                    currency: accountPaymentSummary.currency,
                                    showSymbol:
                                        !!accountPaymentSummary.currency,
                                }
                            )}
                        </span>
                        <div className="bg-primary/10 px-3 py-1 rounded-md">
                            <p className="text-xs">
                                <ClockIcon className="inline mr-1" />

                                {accountPaymentSummary.last_payment_date ? (
                                    toReadableDate(
                                        accountPaymentSummary.last_payment_date
                                    )
                                ) : (
                                    <span>No previous payment</span>
                                )}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                <ChevronsLeftIcon className="inline mr-0.5" />
                                Previous Payment
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1 flex-1">
                        <span className="font-semibold block bg-gradient-to-t text-center from-primary/20 to-transparen px-1 py-0.5 text-primary rounded-md text-sm">
                            {currencyFormat(
                                accountPaymentSummary.total_paid_amount,
                                {
                                    currency: accountPaymentSummary.currency,
                                    showSymbol:
                                        !!accountPaymentSummary.currency,
                                }
                            )}
                        </span>
                        <div className="bg-primary/10 px-3 py-1 rounded-md">
                            <p className="text-foreground text-center text-xs">
                                <MoneyBagIcon className="inline mr-0.5" />
                                Total Paid
                            </p>
                        </div>
                    </div>
                    <div className="space-y-1">
                        <span className="font-semibold text-right block bg-gradient-to-l from-primary/20 to-transparent px-1 py-0.5 text-primary rounded-md text-xs">
                            <CopyWrapper>
                                {currencyFormat(
                                    accountPaymentSummary.suggested_payment_amount,
                                    {
                                        currency:
                                            accountPaymentSummary.currency,
                                        showSymbol:
                                            !!accountPaymentSummary.currency,
                                    }
                                )}
                            </CopyWrapper>
                        </span>
                        <div className="bg-primary/10 px-3 py-1 rounded-md">
                            <p className="text-xs">
                                <ClockIcon className="inline mr-1" />
                                {accountPaymentSummary?.next_payment_date
                                    ? toReadableDate(
                                          accountPaymentSummary?.next_payment_date
                                      )
                                    : 'Paid in full'}
                            </p>
                            <p className="text-muted-foreground text-xs">
                                <ChevronsRightIcon className="inline animate-pulse mr-0.5" />
                                Next Payment
                            </p>
                        </div>
                    </div>
                </div>

                {/* Account Payment Stats */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Total Principal */}
                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg inline-flex items-center justify-center">
                            <DollarIcon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                                Total Principal
                            </p>
                            <p className="font-medium text-sm truncate">
                                {currencyFormat(
                                    accountPaymentSummary.total_principal,
                                    {
                                        currency:
                                            accountPaymentSummary.currency,
                                        showSymbol:
                                            !!accountPaymentSummary.currency,
                                    }
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Remaining Balance */}
                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg inline-flex items-center justify-center">
                            <TrendingUpIcon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                                Remaining Balance
                            </p>
                            <p className="font-medium text-sm truncate">
                                {currencyFormat(
                                    accountPaymentSummary.total_remaining_balance,
                                    {
                                        currency:
                                            accountPaymentSummary.currency,
                                        showSymbol:
                                            !!accountPaymentSummary.currency,
                                    }
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Total Due */}
                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg inline-flex items-center justify-center">
                            <ErrorExclamationIcon className="size-4 text-destructive" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                                Total Due
                            </p>
                            <p className="font-medium text-sm truncate">
                                {currencyFormat(
                                    accountPaymentSummary.total_due_amount,
                                    {
                                        currency:
                                            accountPaymentSummary.currency,
                                        showSymbol:
                                            !!accountPaymentSummary.currency,
                                    }
                                )}
                            </p>
                        </div>
                    </div>

                    {/* Advance Payment */}
                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg inline-flex items-center justify-center">
                            <ChevronsRightIcon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                                Advance Payment
                            </p>
                            <p className="font-medium text-sm truncate">
                                {currencyFormat(
                                    accountPaymentSummary.total_advance_payment,
                                    {
                                        currency:
                                            accountPaymentSummary.currency,
                                        showSymbol:
                                            !!accountPaymentSummary.currency,
                                    }
                                )}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg inline-flex items-center justify-center">
                            <CheckFillIcon className="size-4 text-success" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                                Advance Payments
                            </p>
                            <p className="font-medium text-sm">
                                {accountPaymentSummary.advance_payment_count}{' '}
                                payment
                                {accountPaymentSummary.advance_payment_count !==
                                1
                                    ? 's'
                                    : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-start gap-2">
                        <div className="flex-shrink-0 p-1 text-primary bg-primary/10 rounded-lg inline-flex items-center justify-center">
                            <ErrorExclamationIcon className="size-4 text-destructive" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-xs text-muted-foreground">
                                Overdue Payments
                            </p>
                            <p className="font-medium text-sm">
                                {accountPaymentSummary.overdue_payment_count}{' '}
                                payment
                                {accountPaymentSummary.overdue_payment_count !==
                                1
                                    ? 's'
                                    : ''}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Loan Status Badge */}
                {accountPaymentSummary.is_loan_fully_paid && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-success/10 rounded-lg">
                        <CheckFillIcon className="size-4 text-success" />
                        <span className="text-sm font-medium text-success">
                            Loan Fully Paid
                        </span>
                    </div>
                )}
            </div>
            <Table
                wrapperClassName={cn(
                    'border rounded-xl',
                    accountPaymentSummary.is_loan_fully_paid &&
                        'opacity-70 saturate-50'
                )}
            >
                <TableHeader>
                    <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Days Info</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {accountPaymentSummary.loan_payment_schedule.map(
                        (schedule, scheduleIndex) => (
                            <TableRow key={scheduleIndex}>
                                <TableCell className="font-medium">
                                    <div className="flex items-center gap-2">
                                        <CalendarNumberIcon className="size-4 text-muted-foreground" />
                                        {toReadableDate(schedule.date)}
                                    </div>
                                </TableCell>
                                <TableCell className="text-right font-mono">
                                    <CopyWrapper>
                                        {currencyFormat(
                                            schedule.amount,

                                            {
                                                currency: schedule.currency,
                                                showSymbol: !!schedule.currency,
                                            }
                                        )}
                                    </CopyWrapper>
                                </TableCell>
                                <TableCell>
                                    <LoanPaymentStatusBadge
                                        status={schedule.payment_status}
                                    />
                                </TableCell>
                                <TableCell className="text-right text-sm text-muted-foreground">
                                    {schedule.days_overdue > 0 && (
                                        <span className="text-destructive font-medium">
                                            {schedule.days_overdue} days overdue
                                        </span>
                                    )}
                                    {schedule.days_early > 0 && (
                                        <span className="text-success font-medium">
                                            {schedule.days_early} days early
                                        </span>
                                    )}
                                    {schedule.days_overdue === 0 &&
                                        schedule.days_early === 0 &&
                                        schedule.is_future && (
                                            <span>Scheduled</span>
                                        )}
                                </TableCell>
                            </TableRow>
                        )
                    )}
                </TableBody>
            </Table>
        </TabsContent>
    )
}

export const LoanPaymentScheduleModal = ({
    loanPaymentProps,
    ...props
}: IModalProps & {
    loanPaymentProps: Props
}) => {
    return (
        <Modal
            {...props}
            className="!max-w-[95vw] flex flex-col !max-h-[80vh] bg-transparent p-0 shadow-none border-none gap-y-0"
            closeButtonClassName="top-2 right-2"
            descriptionClassName="sr-only"
            titleClassName="sr-only"
        >
            <LoanPaymentSchedule className="flex-1" {...loanPaymentProps} />
        </Modal>
    )
}

export default LoanPaymentSchedule
