import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { AccountTypeBadge } from '@/modules/account'
import { ICurrency, currencyFormat } from '@/modules/currency'

import { FastForwardIcon } from '@/components/icons'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { IClassProps } from '@/types'

import { ILoanAmortizationSchedule } from '../loan-amortization-schedule.types'

type Props = {
    total: number
    currency: ICurrency
    schedules: ILoanAmortizationSchedule[]
} & IClassProps

const AmortizationScheduleTable = ({
    total = 0,
    currency,
    className,
    schedules,
}: Props) => {
    const accounts =
        schedules.length > 0
            ? schedules[0].accounts.map((acc) => acc.account)
            : []

    const lastAccount = schedules.at(-1)

    return (
        <div className={cn('min-h-0 h-full', className)}>
            <Table
                className="table-auto"
                wrapperClassName="max-w-full min-h-0 max-h-full min-w-0 ecoop-scroll overflow-auto rounded-xl border bg-background"
            >
                <TableHeader className="sticky top-0 z-10 bg-background/90 backdrop-blur-xs">
                    <TableRow>
                        <TableHead className="min-w-[200px]  sticky left-0 backdrop-blur-sm bg-background/60">
                            Date
                        </TableHead>
                        <TableHead className="">Balance</TableHead>
                        {accounts.map((account) => (
                            <TableHead key={account.id}>
                                <div className="items-center justify-end flex gap-x-2">
                                    <AccountTypeBadge
                                        className="inline"
                                        size={'xs'}
                                        type={account.type}
                                    />
                                    <ActionTooltip
                                        tooltipContent={account.name}
                                    >
                                        <p className="text-center text-nowrap max-w-[100px] truncate">
                                            {account.name}
                                        </p>
                                    </ActionTooltip>
                                </div>
                            </TableHead>
                        ))}
                        <TableHead className="text-right">Total</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {schedules.map((schedule, index) => (
                        <TableRow
                            className="border-none odd:bg-muted/50 hover:bg-transparent odd:hover:bg-muted/50 "
                            key={schedule.id}
                        >
                            <TableCell className="text-sm sticky flex left-0 backdrop-blur-sm bg-background/60">
                                <span className="text-primary font-bold text-base mr-2">
                                    {index}
                                </span>
                                <div>
                                    {toReadableDate(
                                        schedule.days_skipped > 0
                                            ? schedule.scheduled_date
                                            : schedule.actual_date
                                    )}
                                    {schedule.days_skipped > 0 && (
                                        <p className="text-muted-foreground text-nowrap text-xs">
                                            <FastForwardIcon className="inline" />{' '}
                                            {schedule.days_skipped} Day
                                            {schedule.days_skipped > 1
                                                ? 's'
                                                : ''}{' '}
                                            skipped
                                        </p>
                                    )}
                                </div>
                            </TableCell>
                            <TableCell className="font-mono">
                                {currencyFormat(schedule.balance, {
                                    currency,
                                    showSymbol: !!currency,
                                })}
                            </TableCell>
                            {schedule.accounts.map((acc) => (
                                <TableCell
                                    className="text-right font-mono"
                                    key={acc.account.id}
                                >
                                    {currencyFormat(acc.value, {
                                        currency,
                                        showSymbol: !!currency,
                                    })}
                                </TableCell>
                            ))}
                            <TableCell className="text-right font-mono">
                                {currencyFormat(schedule.total || 0, {
                                    currency,
                                    showSymbol: !!currency,
                                })}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter className="sticky bottom-0 bg-secondary/90 backdrop-blur-xs">
                    <TableRow>
                        <TableCell className="sticky left-0 backdrop-blur-sm bg-background/60">
                            <strong className="text-muted-foreground capitalize text-lg mr-2">
                                Total
                            </strong>
                        </TableCell>
                        <TableCell />

                        {accounts.map((acc, i) => (
                            <TableCell
                                className="text-right text-lg"
                                key={acc.id}
                            >
                                <strong>
                                    {currencyFormat(
                                        lastAccount?.accounts[i]?.total || 0,
                                        { currency, showSymbol: !!currency }
                                    )}
                                </strong>
                            </TableCell>
                        ))}
                        <TableCell className="text-right" colSpan={1}>
                            <strong className="text-primary text-lg text-right w-full">
                                <span className="font-mono">
                                    {currencyFormat(total || 0, {
                                        currency,
                                        showSymbol: !!currency,
                                    })}
                                </span>
                            </strong>
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default AmortizationScheduleTable
