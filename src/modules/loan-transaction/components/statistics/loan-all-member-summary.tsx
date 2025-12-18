import { cn, formatNumber } from '@/helpers'
import { currencyFormat } from '@/modules/currency'
import {
    useLoanAllMemberLoanSummary,
    useLoanSummaryClearCache,
} from '@/modules/loan-transaction'

import {
    BankIcon,
    CheckIcon,
    ClockIcon,
    HandCoinsIcon,
    RefreshIcon,
    TrashIcon,
    TrendingDownIcon,
    TrendingUpIcon,
    UserIcon,
    Users3Icon,
    WalletIcon,
    WarningCircleIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'

import { IClassProps } from '@/types'

interface Props extends IClassProps {}

const LoanAllMemberSummary = ({ className }: Props) => {
    const { data, isLoading, isError, refetch, isFetching } =
        useLoanAllMemberLoanSummary({
            options: {},
        })

    const { mutateAsync: clearLoanSummaryCache, isPending } =
        useLoanSummaryClearCache()

    if (isLoading) {
        return <LoanAllMemberSummarySkeleton className={className} />
    }

    if (isError || !data) {
        return (
            <Card className={cn('border-0 shadow-sm', className)}>
                <CardContent className="p-6 flex flex-col items-center justify-center min-h-[400px]">
                    <WarningCircleIcon className="h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground text-sm">
                        Failed to load loan summary
                    </p>
                    <Button
                        className="mt-4"
                        onClick={() => refetch()}
                        size="sm"
                        variant="outline"
                    >
                        <RefreshIcon className="h-4 w-4 mr-2" />
                        Retry
                    </Button>
                </CardContent>
            </Card>
        )
    }

    const repaymentRate =
        data.total_principal > 0
            ? (data.total_paid / data.total_principal) * 100
            : 0
    const overdueRate =
        data.total_loans > 0
            ? (data.total_overdue_loans / data.total_loans) * 100
            : 0
    // const fullyPaidRate =
    //     data.total_members > 0
    //         ? (data.members_fully_paid / data.total_members) * 100
    //         : 0

    return (
        <div
            className={cn(
                'space-y-4 bg-popover/40 border border-border/40 rounded-xl p-4',
                className
            )}
        >
            <Card className="shadow-sm border-none bg-gradient-to-br from-primary/10 via-60% via-background to-background">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-primary/20 rounded-lg">
                                <BankIcon className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl">
                                    Loan Summaries
                                </CardTitle>
                                <p className="text-xs text-muted-foreground mt-1">
                                    Overview of all member loans
                                </p>
                            </div>
                        </div>
                        {/* clearLoanSummaryCache */}
                        <div className="flex items-center gap-x-2">
                            <Button
                                disabled={isPending}
                                onClick={() => clearLoanSummaryCache()}
                                size="icon-sm"
                                variant="outline-ghost"
                            >
                                {isPending ? (
                                    <LoadingSpinner className="size-4" />
                                ) : (
                                    <TrashIcon className="size-4" />
                                )}
                            </Button>
                            <Button
                                disabled={isFetching}
                                onClick={() => refetch()}
                                size="icon-sm"
                                variant="outline-ghost"
                            >
                                {isFetching ? (
                                    <LoadingSpinner className="size-4" />
                                ) : (
                                    <RefreshIcon className="size-4" />
                                )}
                            </Button>
                        </div>
                    </div>
                </CardHeader>
            </Card>

            {/* Key Metrics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {/* Total Members */}
                <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Users3Icon className="h-5 w-5 text-blue-500 dark:text-blue-400" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Members
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-foreground">
                                {formatNumber(data.total_members)}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {formatNumber(data.members_with_loans)} with
                                active loans
                            </div>
                            <Progress
                                className="h-1.5 mt-2"
                                value={
                                    data.total_members > 0
                                        ? (data.members_with_loans /
                                              data.total_members) *
                                          100
                                        : 0
                                }
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Total Loans */}
                <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-green-500/10 rounded-lg">
                                <HandCoinsIcon className="h-5 w-5 text-green-500 dark:text-green-400" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Loans
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-foreground">
                                {formatNumber(data.total_loans)}
                            </div>
                            <div className="flex items-center gap-2 text-xs">
                                <span className="text-green-600 dark:text-green-400 flex items-center gap-1">
                                    <TrendingUpIcon className="h-3 w-3" />
                                    {formatNumber(data.total_active_loans)}{' '}
                                    active
                                </span>
                                <span className="text-muted-foreground">•</span>
                                <span className="text-muted-foreground">
                                    {formatNumber(data.total_fully_paid_loans)}{' '}
                                    paid
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Total Principal */}
                <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-purple-500/10 rounded-lg">
                                <WalletIcon className="h-5 w-5 text-purple-500 dark:text-purple-400" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Principal
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-foreground">
                                {currencyFormat(data.total_principal, {
                                    showSymbol: true,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                Total disbursed amount
                            </div>
                            <Progress
                                className="h-1.5 mt-2"
                                value={repaymentRate}
                            />
                            <div className="text-xs text-muted-foreground">
                                {repaymentRate.toFixed(1)}% repaid
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Arrears */}
                <Card className="border-0 shadow-sm bg-card hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                            <div className="p-2 bg-red-500/10 rounded-lg">
                                <WarningCircleIcon className="h-5 w-5 text-red-500 dark:text-red-400" />
                            </div>
                            <span className="text-xs text-muted-foreground">
                                Arrears
                            </span>
                        </div>
                        <div className="space-y-1">
                            <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                                {currencyFormat(data.total_arrears, {
                                    showSymbol: true,
                                })}
                            </div>
                            <div className="text-xs text-muted-foreground">
                                {formatNumber(data.total_overdue_loans)} overdue
                                loans
                            </div>
                            {data.total_loans > 0 && (
                                <div className="text-xs text-red-600 dark:text-red-400 mt-1">
                                    {overdueRate.toFixed(1)}% of total loans
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Financial Overview */}
            <div className="grid gap-4 md:grid-cols-2">
                {/* Payment Breakdown */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <TrendingDownIcon className="h-4 w-4 text-primary" />
                            Payment Breakdown
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Total Principal
                                </span>
                                <span className="text-sm font-semibold">
                                    {currencyFormat(data.total_principal, {
                                        showSymbol: true,
                                    })}
                                </span>
                            </div>
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-green-600 dark:text-green-400">
                                    Total Paid
                                </span>
                                <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                    {currencyFormat(data.total_paid, {
                                        showSymbol: true,
                                    })}
                                </span>
                            </div>
                            <Progress className="h-2" value={repaymentRate} />
                            <Separator />
                            <div className="flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">
                                    Remaining Balance
                                </span>
                                <span className="text-sm font-semibold">
                                    {currencyFormat(data.total_remaining, {
                                        showSymbol: true,
                                    })}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Member Status */}
                <Card className="border-0 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center gap-2">
                            <UserIcon className="h-4 w-4 text-primary" />
                            Member Status
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="space-y-3">
                            {/* Members with Loans */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground flex items-center gap-2">
                                        <HandCoinsIcon className="size-3.5" />
                                        With Active Loans
                                    </span>
                                    <span className="text-sm font-semibold">
                                        {formatNumber(data.members_with_loans)}
                                    </span>
                                </div>
                                {/* <Progress
                                    className="h-1.5"
                                    value={
                                        data.total_members > 0
                                            ? (data.members_with_loans /
                                                  data.total_members) *
                                              100
                                            : 0
                                    }
                                /> */}
                            </div>

                            {/* Fully Paid */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-green-600 dark:text-green-400 flex items-center gap-2">
                                        <CheckIcon className="size-3.5" />
                                        Fully Paid
                                    </span>
                                    <span className="text-sm font-semibold text-green-600 dark:text-green-400">
                                        {formatNumber(data.members_fully_paid)}
                                    </span>
                                </div>
                                {/* <Progress
                                    className="h-1.5"
                                    value={fullyPaidRate}
                                /> */}
                            </div>

                            {/* With Overdue */}
                            <div>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                                        <ClockIcon className="size-3.5" />
                                        With Overdue
                                    </span>
                                    <span className="text-sm font-semibold text-red-600 dark:text-red-400">
                                        {formatNumber(
                                            data.members_with_overdue
                                        )}
                                    </span>
                                </div>
                                {/* <Progress
                                    className="h-1.5 bg-red-100 dark:bg-red-950"
                                    value={
                                        data.total_members > 0
                                            ? (data.members_with_overdue /
                                                  data.total_members) *
                                              100
                                            : 0
                                    }
                                /> */}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Summary Footer */}
            <Card className="border-0 shadow-sm bg-muted/30">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            Last updated:{' '}
                            {new Date(data.generated_at).toLocaleString()}
                        </span>
                        <span>
                            Organization ID: {data.organization_id.slice(0, 8)}
                            ...
                        </span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default LoanAllMemberSummary

// Skeleton Component
export const LoanAllMemberSummarySkeleton = ({ className }: IClassProps) => {
    return (
        <div className={cn('space-y-4', className)}>
            {/* Header Skeleton */}
            <Card className="border-0 shadow-sm">
                <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Skeleton className="h-10 w-10 rounded-lg" />
                            <div className="space-y-2">
                                <Skeleton className="h-5 w-48" />
                                <Skeleton className="h-3 w-32" />
                            </div>
                        </div>
                        <Skeleton className="h-8 w-20" />
                    </div>
                </CardHeader>
            </Card>

            {/* Metrics Grid Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((i) => (
                    <Card className="border-0 shadow-sm" key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between mb-3">
                                <Skeleton className="h-9 w-9 rounded-lg" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                            <div className="space-y-2">
                                <Skeleton className="h-8 w-24" />
                                <Skeleton className="h-3 w-32" />
                                <Skeleton className="h-1.5 w-full" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Financial Overview Skeleton */}
            <div className="grid gap-4 md:grid-cols-2">
                {[1, 2].map((i) => (
                    <Card className="border-0 shadow-sm" key={i}>
                        <CardHeader className="pb-3">
                            <Skeleton className="h-5 w-40" />
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {[1, 2, 3].map((j) => (
                                <div className="space-y-2" key={j}>
                                    <div className="flex items-center justify-between">
                                        <Skeleton className="h-4 w-32" />
                                        <Skeleton className="h-4 w-24" />
                                    </div>
                                    <Skeleton className="h-1.5 w-full" />
                                </div>
                            ))}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {/* Footer Skeleton */}
            <Card className="border-0 shadow-sm">
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <Skeleton className="h-3 w-48" />
                        <Skeleton className="h-3 w-32" />
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
