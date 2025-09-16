import { cn, formatNumber } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'

import {
    BookOpenIcon,
    CalculatorIcon,
    CalendarDotsIcon,
    CalendarNumberIcon,
    MoneyTrendIcon,
    RefreshIcon,
    TicketIcon,
    TrendingUpIcon,
} from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { IClassProps, TEntityId } from '@/types'

import { useGetLoanAmortization } from '..'

interface Props extends IClassProps {
    loanTransactionId: TEntityId
}

const LoanAmortization = ({ className, loanTransactionId }: Props) => {
    const { data, refetch, isRefetching } = useGetLoanAmortization({
        loanTransactionId,
        options: { enabled: loanTransactionId !== undefined },
    })

    return (
        <div
            className={cn(
                'rounded bg-secondary/70 flex max-w-full min-w-0 p-2 gap-x-2',
                className
            )}
        >
            <div className="shrink-0 w-sm bg-popover/80 rounded-lg p-1 sticky top-0 self-start space-y-2">
                <div className="flex justify-between px-2 items-center">
                    <p className="my-0 text-center p-0.5">
                        <MoneyTrendIcon className="inline text-muted-foreground mr-1" />
                        Amortization
                    </p>
                    <Button
                        size="icon"
                        type="button"
                        variant="ghost"
                        className="size-fit p-1 cursor-pointer"
                        onClick={() => refetch()}
                        disabled={isRefetching || !loanTransactionId}
                    >
                        {isRefetching ? (
                            <LoadingSpinner className="size-3" />
                        ) : (
                            <RefreshIcon className="size-3" />
                        )}
                    </Button>
                </div>
                <div className="bg-background rounded-xl p-4 text-sm">
                    <p>
                        <BookOpenIcon className="inline text-muted-foreground/60" />{' '}
                        Loan Details
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Name
                            </p>
                            <p>
                                {data?.loan_details?.member_name || (
                                    <span className="text-muted-foreground/50 text-xs">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Passbook
                            </p>
                            <p>
                                {data?.loan_details.passbook_no || (
                                    <span className="text-muted-foreground/50 text-xs">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Classification
                            </p>
                            <p>
                                {data?.loan_details.classification || (
                                    <span className="text-muted-foreground/50 text-xs">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Investment
                            </p>
                            <p>
                                {formatNumber(
                                    data?.loan_details.investment || 0
                                )}
                            </p>
                        </div>

                        <div>
                            <p className="text-xs text-muted-foreground">
                                Amount Applied
                            </p>
                            <p>
                                {formatNumber(
                                    data?.loan_details.account_applied || 0,
                                    2
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Due Date
                            </p>
                            <p>
                                {data?.loan_details.due_date &&
                                    toReadableDate(data?.loan_details.due_date)}
                            </p>
                        </div>
                        <div className="col-span-2">
                            <p className="text-xs text-muted-foreground">
                                <TicketIcon className="inline" /> Voucher
                            </p>
                            <p>
                                {data?.loan_details?.voucher || (
                                    <span className="text-muted-foreground/50 text-xs">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="p-4 bg-background rounded-lg">
                    <p>Summary </p>
                    <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <p className="text-muted-foreground text-xs">
                                <CalendarNumberIcon className="text-muted-foreground/80 inline" />{' '}
                                Monthly Payment
                            </p>
                            <p className="font-medium text-green-600">
                                {data?.summary?.monthly_payment ? (
                                    formatNumber(
                                        data?.summary?.monthly_payment,
                                        2
                                    )
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">
                                <TrendingUpIcon className="inline" /> Interest
                                Rate
                            </p>
                            <p className="font-medium text-orange-500">
                                {data?.summary?.interest_rate ? (
                                    `${data.summary.interest_rate}%`
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">
                                <CalculatorIcon className="inline" />{' '}
                                Computation Type
                            </p>
                            <p className="font-medium text-blue-600">
                                {data?.summary?.computation_type || (
                                    <span className="text-xs text-muted-foreground">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">
                                <CalendarDotsIcon className="inline" /> Mode of
                                Payment
                            </p>
                            <p className="font-medium capitalize text-purple-600">
                                {data?.summary?.mode_of_payment || (
                                    <span className="text-xs text-muted-foreground">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>

                        {/* New Summary Fields */}
                        <div>
                            <p className="text-muued-foreground text-xs">
                                <CalendarNumberIcon className="inline" /> Total
                                Terms
                            </p>
                            <p className="font-medium text-slate-700">
                                {data?.summary?.total_terms ? (
                                    `${data.summary.total_terms} Term(s)`
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">
                                <TrendingUpIcon className="inline" /> Total
                                Interest
                            </p>
                            <p className="font-medium text-orange-600">
                                {data?.summary?.total_interest ? (
                                    formatNumber(data.summary.total_interest, 2)
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">
                                <CalculatorIcon className="inline" /> Total
                                Service Fee
                            </p>
                            <p className="font-medium text-amber-600">
                                {data?.summary?.total_service_fee ? (
                                    formatNumber(
                                        data.summary.total_service_fee,
                                        2
                                    )
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>
                        <div>
                            <p className="text-muted-foreground text-xs">
                                <MoneyTrendIcon className="inline" /> Total
                                Payment
                            </p>
                            <p className="font-bold text-emerald-600 text-base">
                                {data?.summary?.total_amount ? (
                                    formatNumber(data.summary.total_amount, 2)
                                ) : (
                                    <span className="text-xs text-muted-foreground">
                                        none
                                    </span>
                                )}
                            </p>
                        </div>
                    </div>
                </div>

                <p className="text-xs text-center text-muted-foreground/60">
                    {data?.generated_at
                        ? `Generated at ${toReadableDate(data.generated_at)}`
                        : ''}
                </p>
            </div>
            <div className="flex-1 bg-popover/80 rounded-lg p-1 min-w-0 text-sm">
                <p className="p-1">
                    <CalendarNumberIcon className="inline text-muted-foreground/60" />{' '}
                    Amortization Schedule
                </p>

                <Table
                    wrapperClassName="ecoop-scroll max-w-full bg-background/40 px-4 rounded"
                    className="table-fixed w-full"
                >
                    <TableHeader className="bg-transparent sticky top-0">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[130px]">Date</TableHead>{' '}
                            <TableHead className="text-right w-[120px]">
                                Principal
                            </TableHead>
                            <TableHead className="text-right w-[100px]">
                                Interest
                            </TableHead>
                            <TableHead className="text-right w-[120px]">
                                Service Fee
                            </TableHead>
                            <TableHead className="text-right w-[140px]">
                                Total Payment
                            </TableHead>
                            <TableHead className="text-right w-[140px]">
                                Balance
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="[&_td:first-child]:rounded-l-lg [&_td:last-child]:rounded-r-lg">
                        {data?.amortization_schedule?.map((payment, index) => (
                            <TableRow
                                key={index}
                                className="odd:bg-muted/80 odd:hover:bg-muted/50 border-none hover:bg-transparent"
                            >
                                <TableCell className="py-2.5">
                                    {toReadableDate(
                                        payment.date,
                                        'MMM dd, yyyy'
                                    )}
                                </TableCell>
                                <TableCell className="py-2.5 text-right font-mono">
                                    {formatNumber(payment.principal, 2)}
                                </TableCell>
                                <TableCell className="py-2.5 text-right text-orange-400 font-mono">
                                    {formatNumber(payment.interest, 2)}
                                </TableCell>
                                <TableCell className="py-2.5 text-right font-mono">
                                    {formatNumber(payment.service_fee, 2)}
                                </TableCell>
                                <TableCell className="py-2.5 text-right font-medium font-mono">
                                    {formatNumber(payment.total, 2)}
                                </TableCell>
                                <TableCell className="py-2.5 text-right font-mono">
                                    {formatNumber(payment.lr, 2)}
                                </TableCell>
                            </TableRow>
                        ))}

                        {(!data?.amortization_schedule ||
                            data.amortization_schedule.length === 0) && (
                            <TableRow className="hover:bg-transparent">
                                <TableCell
                                    colSpan={7}
                                    className="py-8 text-center text-muted-foreground"
                                >
                                    No amortization schedule available
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                    {data?.summary && (
                        <TableFooter className="bg-transparent">
                            <TableRow className="hover:bg-transparent">
                                <TableCell className="font-medium">
                                    Total ({data.summary.total_terms} terms)
                                </TableCell>
                                <TableCell className="text-right font-medium font-mono">
                                    {formatNumber(
                                        data.summary.total_principal,
                                        2
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium font-mono text-orange-400">
                                    {formatNumber(
                                        data.summary.total_interest,
                                        2
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatNumber(
                                        data.summary.total_service_fee,
                                        2
                                    )}
                                </TableCell>
                                <TableCell className="text-right font-medium">
                                    {formatNumber(data.summary.total_amount, 2)}
                                </TableCell>
                            </TableRow>
                        </TableFooter>
                    )}
                </Table>
            </div>
        </div>
    )
}

export default LoanAmortization
