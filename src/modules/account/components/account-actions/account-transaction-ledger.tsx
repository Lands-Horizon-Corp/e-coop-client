import { useMemo, useState } from 'react'

import { MONTH_NAMES } from '@/constants'
import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import {
    IAccountTransactionLedger,
    useGetAccountTransactionLedgers,
} from '@/modules/account-transaction'
import { ICurrency, currencyFormat } from '@/modules/currency'

import { BookOpenIcon, RefreshIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { TEntityId } from '@/types'

type Props = { accountId: TEntityId }

const ViewAccountTransactionLedger = ({ accountId }: Props) => {
    const [year, setYear] = useState(new Date().getFullYear())
    const years = useMemo(() => {
        const startYear = 1960
        const currentYear = new Date().getFullYear() + 5

        const years = Array.from(
            { length: currentYear - startYear + 1 },
            (_, i) => startYear + i
        )

        return years
    }, [])

    const {
        data: entries = [],
        isPending,
        refetch,
        isRefetching,
    } = useGetAccountTransactionLedgers({
        accountId,
        year,
    })

    return (
        <div>
            <Card className="w-full mx-auto shadow-card-hover animate-fade-in">
                <CardHeader className="pb-4 border-b border-border">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                                <BookOpenIcon className="h-5 w-5 text-primary" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-foreground">
                                    Account Ledger
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    Browse account transactions by year
                                </p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-muted-foreground">
                                    Year:
                                </span>
                                <Select
                                    onValueChange={(val) =>
                                        setYear?.(parseInt(val))
                                    }
                                    value={year.toString()}
                                >
                                    <SelectTrigger className="w-24 h-9">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((y) => (
                                            <SelectItem
                                                key={y}
                                                value={y.toString()}
                                            >
                                                {y}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                            {/* <Badge
                                className="bg-success/20 text-success border-success/30 px-4 py-1.5 text-sm font-semibold"
                                variant="secondary"
                            >
                                {account.name}
                            </Badge> */}
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <AccountLedgerTable entries={entries || []} />
                </CardContent>
            </Card>
        </div>
    )
}

interface AccountLedgerTableProps {
    entries: IAccountTransactionLedger[]
}

export const AccountLedgerTable = ({
    entries = [],
}: AccountLedgerTableProps) => {
    const parsedCurrency: ICurrency | undefined =
        entries[0]?.account_transaction_entry[0]?.account?.currency

    return (
        <div className="rounded-b-lg overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow className="bg-table-header hover:bg-table-header">
                        <TableHead className="text-table-header-foreground font-semibold w-[25%]">
                            DATE
                        </TableHead>
                        <TableHead className="text-table-header-foreground font-semibold w-[15%]">
                            JV NUMBER
                        </TableHead>
                        <TableHead className="text-table-header-foreground font-semibold text-right w-[20%]">
                            DEBIT
                        </TableHead>
                        <TableHead className="text-table-header-foreground font-semibold text-right w-[20%]">
                            CREDIT
                        </TableHead>
                        <TableHead className="text-table-header-foreground font-semibold text-right w-[20%]">
                            BALANCE
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {entries?.map((monthEntry) => {
                        const monthEntries =
                            monthEntry.account_transaction_entry || []

                        return (
                            <>
                                {/* Individual entries for the month */}
                                {monthEntries.map((entry, currentRowIndex) => {
                                    return (
                                        <TableRow
                                            className={cn(
                                                'transition-colors hover:bg-table-row-hover',
                                                currentRowIndex % 2 === 1 &&
                                                    'bg-table-row-alt'
                                            )}
                                            key={`${monthEntry.month}-${entry.id}`}
                                        >
                                            <TableCell className="font-medium text-sm">
                                                {toReadableDate(entry.date)}
                                            </TableCell>
                                            <TableCell className="font-mono text-muted-foreground">
                                                {entry.jv_number}
                                            </TableCell>
                                            <TableCell className="text-right font-mono tabular-nums">
                                                {entry.debit > 0 && (
                                                    <span className="text-foreground">
                                                        {currencyFormat(
                                                            entry.debit,
                                                            {
                                                                currency:
                                                                    entry
                                                                        ?.account
                                                                        ?.currency,
                                                                showSymbol:
                                                                    !!entry
                                                                        ?.account
                                                                        ?.currency,
                                                            }
                                                        )}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell className="text-right font-mono tabular-nums">
                                                {entry.credit > 0 && (
                                                    <span className="text-foreground">
                                                        {currencyFormat(
                                                            entry.credit,
                                                            {
                                                                currency:
                                                                    entry
                                                                        ?.account
                                                                        ?.currency,
                                                                showSymbol:
                                                                    !!entry
                                                                        ?.account
                                                                        ?.currency,
                                                            }
                                                        )}
                                                    </span>
                                                )}
                                            </TableCell>
                                            <TableCell
                                                className={cn(
                                                    'text-right font-mono tabular-nums font-medium',
                                                    entry.balance < 0 &&
                                                        'text-destructive'
                                                )}
                                            >
                                                {entry.balance < 0}
                                                {currencyFormat(entry.balance, {
                                                    currency:
                                                        entry?.account
                                                            ?.currency,
                                                    showSymbol:
                                                        !!entry?.account
                                                            ?.currency,
                                                })}
                                            </TableCell>
                                        </TableRow>
                                    )
                                })}

                                {/* Month-end balance row */}
                                <TableRow className="bg-primary/30 hover:bg-primary/40 border-t-2 border-border">
                                    <TableCell
                                        className="font-semibold text-sm text-totals-foreground"
                                        colSpan={2}
                                    >
                                        MONTH-END BALANCE (
                                        {MONTH_NAMES[monthEntry.month - 1]})
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums font-bold text-totals-foreground">
                                        {monthEntry.debit > 0
                                            ? currencyFormat(
                                                  monthEntry.debit || 0,
                                                  {
                                                      currency: parsedCurrency,
                                                      showSymbol:
                                                          !!parsedCurrency,
                                                  }
                                              )
                                            : ''}
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums font-bold text-totals-foreground">
                                        {monthEntry.credit > 0
                                            ? currencyFormat(
                                                  monthEntry.credit || 0,
                                                  {
                                                      currency: parsedCurrency,
                                                      showSymbol:
                                                          !!parsedCurrency,
                                                  }
                                              )
                                            : ''}
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums font-bold text-totals-foreground" />
                                </TableRow>
                            </>
                        )
                    })}

                    {entries?.length === 0 && (
                        <TableRow>
                            <TableCell
                                className="text-center text-muted-foreground py-12"
                                colSpan={5}
                            >
                                No entries found
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}

export default ViewAccountTransactionLedger
