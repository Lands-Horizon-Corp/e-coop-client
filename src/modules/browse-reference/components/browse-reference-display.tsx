import { ReactNode } from 'react'

import { cn, formatNumber } from '@/helpers'
import { currencyFormat } from '@/modules/currency'

import {
    BuildingBranchIcon,
    CalendarNumberIcon,
    MoneyBagIcon,
    MoneyIcon,
    PercentIcon,
    TrendingUpIcon,
    Users3FillIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Badge } from '@/components/ui/badge'
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

import { TEntityId } from '@/types'

import { useGetBrowseReferenceByAccountMemberType } from '../browse-reference.service'
import { TInterestType } from '../browse-reference.types'

interface BrowseReferenceDisplayProps {
    memberTypeId: TEntityId
    accountId: TEntityId
}

const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
    })
}

const getInterestTypeLabel = (type: TInterestType) => {
    switch (type) {
        case 'year':
            return 'By Year'
        case 'date':
            return 'By Date'
        case 'amount':
            return 'By Amount'
        default:
            return type
    }
}

const InfoItem = ({
    icon,
    label,
    value,
}: {
    icon: ReactNode
    label: string
    value: string | number
}) => (
    <div className="flex items-start gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
            {icon}
        </div>
        <div className="space-y-0.5">
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="font-medium text-foreground">{value}</p>
        </div>
    </div>
)

const SkeletonInfoItem = () => (
    <div className="flex items-start gap-3">
        <Skeleton className="h-9 w-9 rounded-lg" />
        <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-5 w-32" />
        </div>
    </div>
)

const BrowseReferenceDisplaySkeleton = () => (
    <div className="space-y-6">
        <Card>
            <CardHeader>
                <div className="flex items-start justify-between">
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-64" />
                        <Skeleton className="h-5 w-96" />
                    </div>
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                    <SkeletonInfoItem />
                    <SkeletonInfoItem />
                </div>
                <Separator />
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    <SkeletonInfoItem />
                    <SkeletonInfoItem />
                    <SkeletonInfoItem />
                    <SkeletonInfoItem />
                </div>
                <Separator />
                <div className="space-y-3">
                    <Skeleton className="h-4 w-40" />
                    <div className="grid gap-6 sm:grid-cols-2">
                        <SkeletonInfoItem />
                        <SkeletonInfoItem />
                    </div>
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-48" />
                </div>
                <Skeleton className="h-4 w-72" />
            </CardHeader>
            <CardContent>
                <div className="rounded-lg border bg-card p-4 space-y-3">
                    {[1, 2, 3, 4].map((i) => (
                        <div className="flex justify-between" key={i}>
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-6 w-16 rounded-full" />
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    </div>
)

export const BrowseReferenceDisplay = ({
    accountId,
    memberTypeId,
}: BrowseReferenceDisplayProps) => {
    const { data, isLoading, isError } =
        useGetBrowseReferenceByAccountMemberType({
            accountId,
            memberTypeId,
        })

    if (isLoading) {
        return <BrowseReferenceDisplaySkeleton />
    }

    if (isError && !data) {
        return <BrowseReferenceDisplaySkeleton />
    }

    if (!data) {
        return <BrowseReferenceDisplaySkeleton />
    }

    const renderInterestRatesTable = () => {
        if (
            data.interest_type === 'year' &&
            data.interest_rates_by_year?.length > 0
        ) {
            return (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CalendarNumberIcon className="h-5 w-5 text-primary" />
                            Interest Rates by Year
                        </CardTitle>
                        <CardDescription>
                            Interest rates applied based on year ranges
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold">
                                            From Year
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            To Year
                                        </TableHead>
                                        <TableHead className="text-right font-semibold">
                                            Interest Rate
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.interest_rates_by_year.map(
                                        (rate, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {rate.from_year}
                                                </TableCell>
                                                <TableCell>
                                                    {rate.to_year}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary">
                                                        {formatNumber(
                                                            rate.interest_rate
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        if (
            data.interest_type === 'date' &&
            data.interest_rates_by_date?.length > 0
        ) {
            return (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <CalendarNumberIcon className="h-5 w-5 text-primary" />
                            Interest Rates by Date
                        </CardTitle>
                        <CardDescription>
                            Interest rates applied based on date ranges
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold">
                                            From Date
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            To Date
                                        </TableHead>
                                        <TableHead className="text-right font-semibold">
                                            Interest Rate
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.interest_rates_by_date.map(
                                        (rate, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {formatDate(rate.from_date)}
                                                </TableCell>
                                                <TableCell>
                                                    {formatDate(rate.to_date)}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary">
                                                        {formatNumber(
                                                            rate.interest_rate
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        if (
            data.interest_type === 'amount' &&
            data.interest_rates_by_amount?.length > 0
        ) {
            return (
                <Card>
                    <CardHeader className="pb-3">
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <TrendingUpIcon className="h-5 w-5 text-primary" />
                            Interest Rates by Amount
                        </CardTitle>
                        <CardDescription>
                            Interest rates applied based on balance amount
                            ranges
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="rounded-lg border bg-card">
                            <Table>
                                <TableHeader>
                                    <TableRow className="hover:bg-transparent">
                                        <TableHead className="font-semibold">
                                            From Amount
                                        </TableHead>
                                        <TableHead className="font-semibold">
                                            To Amount
                                        </TableHead>
                                        <TableHead className="text-right font-semibold">
                                            Interest Rate
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {data.interest_rates_by_amount.map(
                                        (rate, index) => (
                                            <TableRow key={index}>
                                                <TableCell>
                                                    {currencyFormat(
                                                        rate.from_amount
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {currencyFormat(
                                                        rate.to_amount
                                                    )}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <Badge variant="secondary">
                                                        {formatNumber(
                                                            rate.interest_rate
                                                        )}
                                                    </Badge>
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            )
        }

        return null
    }

    return (
        <div className="space-y-6">
            {/* Header Card */}
            <Card>
                <CardHeader>
                    <div className="flex items-start justify-between">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl">
                                {data.name}
                            </CardTitle>
                            <CardDescription className="text-base">
                                {data.description}
                            </CardDescription>
                        </div>
                        <Badge className="shrink-0" variant="outline">
                            {getInterestTypeLabel(data.interest_type)}
                        </Badge>
                    </div>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Account & Member Type */}
                    <div className="grid gap-6 sm:grid-cols-2">
                        <InfoItem
                            icon={<BuildingBranchIcon />}
                            label="Account"
                            value={data.account?.name || 'N/A'}
                        />
                        <InfoItem
                            icon={<Users3FillIcon />}
                            label="Member Type"
                            value={data.member_type?.name || 'N/A'}
                        />
                    </div>

                    <Separator />

                    {/* Financial Info */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        <InfoItem
                            icon={<MoneyIcon />}
                            label="Minimum Balance"
                            value={currencyFormat(data.minimum_balance, {
                                currency: data.account.currency,
                                showSymbol: !!data.account.currency,
                            })}
                        />
                        <InfoItem
                            icon={<PercentIcon />}
                            label="Interest Rate"
                            value={`${formatNumber(data.interest_rate)} %`}
                        />
                        <InfoItem
                            icon={<MoneyBagIcon />}
                            label="Charges"
                            value={currencyFormat(data.charges, {
                                currency: data.account.currency,
                                showSymbol: !!data.account.currency,
                            })}
                        />
                        <InfoItem
                            icon={<TrendingUpIcon />}
                            label="Interest Type"
                            value={getInterestTypeLabel(data.interest_type)}
                        />
                    </div>

                    {/* Other Interest Computation */}
                    {(data.other_interest_on_saving_computation_minimum_balance !==
                        undefined ||
                        data.other_interest_on_saving_computation_interest_rate !==
                            undefined) && (
                        <>
                            <Separator />
                            <div className="space-y-3">
                                <h4 className="text-sm font-medium text-muted-foreground">
                                    Other Interest Computation
                                </h4>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    {data.other_interest_on_saving_computation_minimum_balance !==
                                        undefined && (
                                        <InfoItem
                                            icon={<MoneyBagIcon />}
                                            label="Min Balance for Computation"
                                            value={currencyFormat(
                                                data.other_interest_on_saving_computation_minimum_balance
                                            )}
                                        />
                                    )}
                                    {data.other_interest_on_saving_computation_interest_rate !==
                                        undefined && (
                                        <InfoItem
                                            icon={<PercentIcon />}
                                            label="Interest Rate for Computation"
                                            value={formatNumber(
                                                data.other_interest_on_saving_computation_interest_rate
                                            )}
                                        />
                                    )}
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>

            {/* Interest Rates Table (conditional) */}
            {renderInterestRatesTable()}
        </div>
    )
}

export const BrowseReferenceDisplayModal = ({
    title = 'Browse Reference Display',
    // description = 'Fill out the form to update the reference.',
    className,
    browseReferenceDisplayProps,
    ...props
}: IModalProps & {
    browseReferenceDisplayProps: Omit<BrowseReferenceDisplayProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-5xl', className)}
            // description={description}
            title={title}
            {...props}
        >
            <BrowseReferenceDisplay {...browseReferenceDisplayProps} />
        </Modal>
    )
}

export default BrowseReferenceDisplay
