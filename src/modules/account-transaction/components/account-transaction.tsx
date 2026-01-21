import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import { toast } from 'sonner'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { hasPermissionFromAuth } from '@/modules/authentication/authgentication.store'
import { currencyFormat } from '@/modules/currency'

import {
    ArrowDownLeftIcon,
    ArrowUpRightIcon,
    BookOpenIcon,
    CalendarIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ReceiptIcon,
    RefreshIcon,
    TextFileFillIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Carousel,
    CarouselApi,
    CarouselContent,
    CarouselItem,
} from '@/components/ui/carousel'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'

import { useModalState } from '@/hooks/use-modal-state'

import { useGetAllAccountTransaction } from '..'
import { IAccountTransaction } from '../account-transaction.types'
import { AccountTransactionUpdateFormModal } from './forms/account-transaction-update-form'
import { AccountTransactionGenerateFormModal } from './forms/process-account-gl-form'

const AccountTransaction = () => {
    const currentDate = new Date()
    const years = useMemo(() => {
        const startYear = 1960
        const currentYear = new Date().getFullYear() + 5

        const years = Array.from(
            { length: currentYear - startYear + 1 },
            (_, i) => startYear + i
        )

        return years
    }, [])

    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear())
    const [selectedMonth, setSelectedMonth] = useState(
        currentDate.getMonth() + 1
    )

    const monthName = new Date(selectedYear, selectedMonth - 1).toLocaleString(
        'default',
        { month: 'long' }
    )

    const {
        data: transactions = [],
        isPending,
        isRefetching,
        refetch,
    } = useGetAllAccountTransaction({
        mode: 'month-year',
        month: selectedMonth,
        year: selectedYear,
    })

    return (
        <div className="w-full max-w-full space-y-4 min-w-0 p-4">
            <div className="flex items-center min-w-0 gap-3 mb-2">
                <div className="p-2 rounded-lg bg-primary/10">
                    <BookOpenIcon className="h-6 w-6 text-primary" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">
                        Account Transaction
                    </h1>
                    <p className="text-sm text-muted-foreground">
                        View and manage account transactions
                    </p>
                </div>
            </div>

            <div className="flex sm:flex-row max-w-full min-w-0 p-4 bg-popover dark:bg-secondary/20 border-border rounded-xl items-center gap-4">
                <MonthSelector
                    onMonthChange={setSelectedMonth}
                    selectedMonth={selectedMonth}
                />
                <YearCarousel
                    onYearChange={setSelectedYear}
                    selectedYear={selectedYear}
                    years={years}
                />
                <GenerateAccountTransaction />
            </div>

            <div className="space-y-2 p-4 bg-popover rounded-xl">
                <div className="flex justify-between items-center">
                    <p>
                        {monthName}, {selectedYear}
                    </p>
                    <div className="flex items-center gap-x-2">
                        <Badge variant="secondary">
                            {transactions?.length} entr
                            {transactions?.length > 1 ? 'ies' : 'y'}
                        </Badge>
                        <Button
                            onClick={() => refetch()}
                            size="icon-sm"
                            variant="secondary"
                        >
                            {isPending || isRefetching ? (
                                <LoadingSpinner />
                            ) : (
                                <RefreshIcon />
                            )}
                        </Button>
                    </div>
                </div>
                {isPending ? (
                    <div>
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div
                                className="flex items-center justify-between p-4 mb-3 bg-muted/50 border rounded-xl "
                                key={i}
                            >
                                <div className="flex items-center gap-6">
                                    <Skeleton className="w-9 h-9  rounded-full" />
                                    <Skeleton className="h-4 w-12  rounded" />
                                    <Skeleton className="h-6 w-16 rounded" />
                                    <Skeleton className="h-4 w-48  rounded" />
                                </div>

                                <div className="flex gap-16 min-w-[200px]">
                                    <div className="flex-1 flex flex-col items-end">
                                        <Skeleton className="h-2 w-8 rounded mb-2" />{' '}
                                        <Skeleton className="h-4 w-16  rounded" />{' '}
                                    </div>
                                    <div className="flex-1 flex flex-col items-end">
                                        <Skeleton className="h-2 w-80 rounded mb-2" />{' '}
                                        <Skeleton className="h-4 w-16  rounded" />{' '}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <TransactionList transactions={transactions} />
                )}
            </div>
        </div>
    )
}

const MONTHS = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
]

interface MonthSelectorProps {
    selectedMonth: number
    onMonthChange: (month: number) => void
}

export function MonthSelector({
    selectedMonth,
    onMonthChange,
}: MonthSelectorProps) {
    return (
        <div className="w-full sm:w-auto sm:min-w-[180px]">
            <Select
                onValueChange={(value) => onMonthChange(parseInt(value, 10))}
                value={selectedMonth.toString()}
            >
                <SelectTrigger className="w-full h-11 bg-card">
                    <div className="flex items-center gap-2">
                        <CalendarIcon className="size-4 text-muted-foreground" />
                        <SelectValue placeholder="Select month" />
                    </div>
                </SelectTrigger>
                <SelectContent>
                    {MONTHS.map((month) => (
                        <SelectItem
                            key={month.value}
                            value={month.value.toString()}
                        >
                            {month.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    )
}

export function YearCarousel({
    years,
    selectedYear,
    onYearChange,
}: {
    years: number[]
    selectedYear: number
    onYearChange: (year: number) => void
}) {
    const apiRef = useRef<CarouselApi>(undefined)

    const setApi = useCallback((api: CarouselApi) => {
        apiRef.current = api
    }, [])

    useEffect(() => {
        const scrollToSelected = () => {
            const api = apiRef.current
            if (!api) return

            const index = years.indexOf(selectedYear)
            if (index === -1) return

            const visibleSlides = api.slidesInView()

            if (visibleSlides.includes(index)) {
                return
            }

            api.scrollTo(Math.max(0, index - 2))
        }

        const timer = setTimeout(scrollToSelected, 100)
        return () => clearTimeout(timer)
    }, [years, selectedYear])

    const handlePrevious = () => {
        const currentIndex = years.indexOf(selectedYear)
        if (currentIndex > 0) {
            onYearChange(years[currentIndex - 1])
        }
    }

    const handleNext = () => {
        const currentIndex = years.indexOf(selectedYear)
        if (currentIndex < years.length - 1) {
            onYearChange(years[currentIndex + 1])
        }
    }

    const isFirstYear = years.indexOf(selectedYear) === 0
    const isLastYear = years.indexOf(selectedYear) === years.length - 1

    return (
        <div className="flex flex-1 min-w-0 items-center gap-2">
            <Button
                className="h-8 w-8 rounded-full shrink-0"
                disabled={isFirstYear}
                onClick={handlePrevious}
                size="icon"
                variant="outline"
            >
                <ChevronLeftIcon className="size-4" />
                <span className="sr-only">Previous year</span>
            </Button>

            <Carousel
                className="w-full overflow-hidden"
                opts={{
                    align: 'center',
                    loop: false,
                }}
                setApi={setApi}
            >
                <CarouselContent className="ml-0">
                    {years.map((year) => (
                        <CarouselItem
                            className="basis-auto pl-1 py-2 flex justify-center"
                            key={year}
                        >
                            <Badge
                                className={cn(
                                    'px-4 py-2 text-sm font-medium cursor-pointer transition-transform hover:scale-105',
                                    selectedYear === year
                                        ? 'bg-primary text-primary-foreground shadow-md'
                                        : 'bg-card hover:bg-secondary'
                                )}
                                onClick={() => onYearChange(year)}
                                variant={
                                    selectedYear === year
                                        ? 'default'
                                        : 'outline'
                                }
                            >
                                {year}
                            </Badge>
                        </CarouselItem>
                    ))}
                </CarouselContent>
            </Carousel>

            <Button
                className="h-8 w-8 rounded-full shrink-0"
                disabled={isLastYear}
                onClick={handleNext}
                size="icon"
                variant="outline"
            >
                <ChevronRightIcon className="size-4" />
                <span className="sr-only">Next year</span>
            </Button>
        </div>
    )
}

export function TransactionList({
    transactions,
    isLoading,
}: {
    transactions: IAccountTransaction[]
    isLoading?: boolean
}) {
    if (isLoading) {
        return (
            <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                    <Card key={i}>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-4">
                                <Skeleton className="h-10 w-10 rounded-full" />
                                <Skeleton className="h-4 w-16" />
                                <Skeleton className="h-6 w-20" />
                                <Skeleton className="h-4 flex-1" />
                                <Skeleton className="h-8 w-20" />
                                <Skeleton className="h-8 w-20" />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    if (transactions.length === 0) {
        return (
            <Card className="border-dashed bg-muted/40 shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <div className="rounded-full p-4 mb-4">
                        <ReceiptIcon className="size-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-1">
                        No transactions found
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        There are no entries for this period
                    </p>
                </CardContent>
            </Card>
        )
    }

    return (
        <div className="space-y-3">
            {transactions.map((transaction) => (
                <TransactionCard
                    key={transaction.id}
                    transaction={transaction}
                />
            ))}
        </div>
    )
}

export function TransactionCard({
    transaction,
}: {
    transaction: IAccountTransaction
}) {
    const isDebit = transaction.debit > 0
    const updateModalState = useModalState()

    const canUpdate = hasPermissionFromAuth({
        action: 'Update',
        resourceType: 'AccountTransaction',
    })

    return (
        <>
            <Card
                className="hover:shadow-md shadow-none rounded-xl cursor-pointer bg-secondary/20 transition-shadow"
                onClick={() => {
                    if (!canUpdate)
                        return toast.warning(
                            'You are not allowed to update account transaction'
                        )

                    updateModalState.onOpenChange(true)
                }}
            >
                <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                        <div className="flex items-center gap-3 flex-shrink-0">
                            <div
                                className={`p-2 rounded-full ${isDebit ? 'bg-destructive/10' : 'bg-success/10'}`}
                            >
                                {isDebit ? (
                                    <ArrowUpRightIcon className="h-4 w-4 text-destructive" />
                                ) : (
                                    <ArrowDownLeftIcon className="h-4 w-4 text-success" />
                                )}
                            </div>
                            <div className="text-sm text-muted-foreground font-medium">
                                {toReadableDate(transaction.date)}
                            </div>
                        </div>

                        <Badge
                            className="w-fit flex items-center gap-1.5"
                            variant="secondary"
                        >
                            <TextFileFillIcon className="h-3 w-3" />
                            {transaction.jv_number}
                        </Badge>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                                {transaction.description}
                            </p>
                        </div>

                        <div className="flex items-center gap-4 flex-shrink-0 ml-auto">
                            <div className="text-right min-w-[90px]">
                                <div className="text-xs text-muted-foreground mb-0.5">
                                    Debit
                                </div>
                                <span
                                    className={`font-semibold ${transaction.debit > 0 ? 'text-destructive' : 'text-muted-foreground'}`}
                                >
                                    {currencyFormat(transaction.debit, {
                                        showSymbol: false,
                                    })}
                                </span>
                            </div>
                            <div className="text-right min-w-[90px]">
                                <div className="text-xs text-muted-foreground mb-0.5">
                                    Credit
                                </div>
                                <span
                                    className={`font-semibold ${transaction.credit > 0 ? 'text-success' : 'text-muted-foreground'}`}
                                >
                                    {currencyFormat(transaction.credit, {
                                        showSymbol: false,
                                    })}
                                </span>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <AccountTransactionUpdateFormModal
                formProps={{
                    accountTransactionId: transaction.id,
                    defaultValues: transaction,
                }}
                {...updateModalState}
            />
        </>
    )
}

const GenerateAccountTransaction = () => {
    const modalState = useModalState()
    const canGenerate = hasPermissionFromAuth({
        action: 'Create',
        resourceType: 'AccountTransaction',
    })

    return (
        <>
            <AccountTransactionGenerateFormModal
                formProps={{
                    defaultValues: {
                        start_date: new Date().toISOString(),
                        end_date: new Date().toISOString(),
                    },
                }}
                {...modalState}
            />
            <Button
                disabled={!canGenerate}
                onClick={() => modalState.onOpenChange(true)}
                variant="secondary"
            >
                Generate
            </Button>
        </>
    )
}

export default AccountTransaction
