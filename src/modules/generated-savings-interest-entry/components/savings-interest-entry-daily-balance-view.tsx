import { toReadableDate } from '@/helpers/date-utils'
import { cn } from '@/helpers/tw-utils'
import { currencyFormat } from '@/modules/currency'

import { ArrowDownIcon, ArrowRightIcon, ArrowUpIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { IClassProps, TEntityId } from '@/types'

import { useGetGeneratedSavingsInterestDailyBalance } from '../generated-savings-interest-entry.service'
import {
    IGeneratedSavingsInterestEntryDailyBalanceView,
    TBalanceMovement,
} from '../generated-savings-interest-entry.types'

export interface ISavingsInterestEntryDailyBalanceViewProps extends IClassProps {
    generatedSavingsInterestEntryId: TEntityId
    defaultValue?: IGeneratedSavingsInterestEntryDailyBalanceView
}

const BalanceMovementIcon = ({ type }: { type: TBalanceMovement }) => {
    switch (type) {
        case 'increase':
            return <ArrowUpIcon className="size-4 text-green-500" />
        case 'decrease':
            return <ArrowDownIcon className="size-4 text-red-500" />
        case 'no_change':
            return <ArrowRightIcon className="size-4 text-muted-foreground" />
        default:
            return null
    }
}

const SavingsInterestEntryDailyBalanceView = ({
    generatedSavingsInterestEntryId,
    defaultValue,
    className,
}: ISavingsInterestEntryDailyBalanceViewProps) => {
    const { data, isPending, isError, error } =
        useGetGeneratedSavingsInterestDailyBalance({
            id: generatedSavingsInterestEntryId,
            options: {
                initialData: defaultValue,
            },
        })

    // Show data if available, even if there's an error
    const hasData = !!data
    const showError = isError && !hasData

    return (
        <div className={cn('grid grid-cols-1 lg:grid-cols-3 gap-6', className)}>
            {/* Daily Balance Table */}
            <div className="lg:col-span-2">
                <div className="space-y-3">
                    {isPending ? (
                        <>
                            <Skeleton className="h-8 w-48" />
                            <div className="space-y-2">
                                <Skeleton className="h-10 w-full" />
                                {[...Array(10)].map((_, i) => (
                                    <Skeleton className="h-12 w-full" key={i} />
                                ))}
                            </div>
                        </>
                    ) : showError ? (
                        <div className="space-y-2">
                            <Skeleton className="h-10 w-full" />
                            {[...Array(10)].map((_, i) => (
                                <Skeleton className="h-12 w-full" key={i} />
                            ))}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <Card className="border-destructive max-w-md">
                                    <CardContent className="pt-6">
                                        <p className="text-destructive text-center">
                                            Failed to load daily balance view
                                        </p>
                                        {error && (
                                            <p className="text-sm text-muted-foreground text-center mt-2">
                                                {error.message}
                                            </p>
                                        )}
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    ) : hasData ? (
                        <>
                            <div>
                                <h3 className="text-lg font-semibold">
                                    Daily Balance History
                                </h3>
                                {data.member_profile && (
                                    <p className="text-sm text-muted-foreground">
                                        {data.member_profile.full_name}
                                        {data.account &&
                                            ` - ${data.account.name}`}
                                    </p>
                                )}
                            </div>

                            <div className="rounded-md border bg-popover">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[200px]">
                                                Date
                                            </TableHead>
                                            <TableHead className="text-right">
                                                Balance
                                            </TableHead>
                                            <TableHead className="w-[100px] text-center">
                                                Movement
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.daily_balance.map(
                                            (entry, index) => (
                                                <TableRow key={index}>
                                                    <TableCell className="font-medium">
                                                        {toReadableDate(
                                                            entry.date
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-right font-semibold">
                                                        {currencyFormat(
                                                            entry.balance,
                                                            {
                                                                currency:
                                                                    data.account
                                                                        ?.currency,
                                                                showSymbol:
                                                                    !!data
                                                                        .account
                                                                        ?.currency,
                                                            }
                                                        )}
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        <div className="flex items-center justify-center">
                                                            <BalanceMovementIcon
                                                                type={
                                                                    entry.type
                                                                }
                                                            />
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </>
                    ) : null}
                </div>
            </div>

            {/* Summary Card */}
            <div>
                <div className="space-y-3 sticky top-5">
                    {isPending ? (
                        <>
                            <Skeleton className="h-8 w-32" />
                            <Card>
                                <CardHeader>
                                    <Skeleton className="h-6 w-full" />
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    {[...Array(6)].map((_, i) => (
                                        <div className="space-y-1" key={i}>
                                            <Skeleton className="h-4 w-24" />
                                            <Skeleton className="h-6 w-full" />
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>
                        </>
                    ) : showError ? null : hasData ? (
                        <>
                            <h3 className="text-lg font-semibold">Summary</h3>
                            <Card>
                                <CardHeader>
                                    <CardTitle className="text-base">
                                        Balance Overview
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center gap-x-4">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Beginning
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {currencyFormat(
                                                    data.beginning_balance,
                                                    {
                                                        currency:
                                                            data.account
                                                                ?.currency,
                                                        showSymbol:
                                                            !!data.account
                                                                ?.currency,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        <ArrowRightIcon className="size-6 mx-auto" />
                                        <div className="w-fit">
                                            <p className="text-sm text-muted-foreground">
                                                Ending
                                            </p>
                                            <p className="text-lg font-semibold">
                                                {currencyFormat(
                                                    data.ending_balance,
                                                    {
                                                        currency:
                                                            data.account
                                                                ?.currency,
                                                        showSymbol:
                                                            !!data.account
                                                                ?.currency,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="border-t grid grid-cols-3 pt-4 gap-x-2">
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Average
                                            </p>
                                            <p className="text-lg font-semibold text-primary">
                                                {currencyFormat(
                                                    data.average_daily_balance,
                                                    {
                                                        currency:
                                                            data.account
                                                                ?.currency,
                                                        showSymbol:
                                                            !!data.account
                                                                ?.currency,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Lowest
                                            </p>
                                            <p className="text-lg font-semibold text-red-600">
                                                {currencyFormat(
                                                    data.lowest_balance,
                                                    {
                                                        currency:
                                                            data.account
                                                                ?.currency,
                                                        showSymbol:
                                                            !!data.account
                                                                ?.currency,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-muted-foreground">
                                                Highest
                                            </p>
                                            <p className="text-lg font-semibold text-green-600">
                                                {currencyFormat(
                                                    data.highest_balance,
                                                    {
                                                        currency:
                                                            data.account
                                                                ?.currency,
                                                        showSymbol:
                                                            !!data.account
                                                                ?.currency,
                                                    }
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    )
}

export const SavingsInterestEntryDailyBalanceViewModal = ({
    // title = 'Daily Balance View',
    // description = 'View the daily balance history and summary',
    className,
    viewProps,
    ...props
}: IModalProps & {
    viewProps: Omit<ISavingsInterestEntryDailyBalanceViewProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-6xl', className)}
            // description={description}
            // title={title}
            {...props}
        >
            <SavingsInterestEntryDailyBalanceView {...viewProps} />
        </Modal>
    )
}

export default SavingsInterestEntryDailyBalanceView
