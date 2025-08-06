import { useState } from 'react'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import { ITransactionResponse } from '@/types/coop-types'
import { useNavigate } from '@tanstack/react-router'
import { PaginationState } from '@tanstack/react-table'
import { format } from 'date-fns'
import { ArrowRight, FileText, Info } from 'lucide-react'

import { TransactionTypeBadge } from '@/components/badges/payment-type-badge'
import CopyWrapper from '@/components/elements/copy-wrapper'
import ImageDisplay from '@/components/image-display'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
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
import PreviewMediaWrapper from '@/components/wrappers/preview-media-wrapper'

import { useFilteredCurrentPaginatedTransaction } from '@/hooks/api-hooks/use-transaction'
import useFilterState from '@/hooks/use-filter-state'

import { TEntityId } from '@/types'

interface TransactionCardListProps {
    onDetailsClick?: (transaction: ITransactionResponse) => void
    fullPath?: string
}

const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-PH', {
        style: 'currency',
        currency: 'PHP',
    }).format(amount)
}

const NoTransactionsFound = () => (
    <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
        <FileText size={48} className="mb-4 text-gray-400" />
        <p className="text-lg font-semibold">No Transactions Found</p>
        <p className="text-sm">
            There are no transactions to display at the moment.
        </p>
    </div>
)

const TransactionCardSkeleton = () => (
    <Card className="w-full animate-pulse">
        <CardHeader>
            <div className="flex items-start justify-between">
                <div className="space-y-1">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48" />
                </div>
                <Skeleton className="h-6 w-16" />
            </div>
        </CardHeader>
        <CardContent>
            <Separator className="mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
                <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-full" />
                </div>
            </div>
            <Skeleton className="mt-6 h-10 w-32" />
        </CardContent>
    </Card>
)

const TransactionCardList = ({
    onDetailsClick,
    fullPath,
}: TransactionCardListProps) => {
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 5,
    })

    const { finalFilterPayload } = useFilterState({
        defaultFilterMode: 'OR',
        onFilterChange: () =>
            setPagination((prev) => ({
                ...prev,
                pageIndex: PAGINATION_INITIAL_INDEX,
            })),
    })

    const {
        data: CurrentTransaction,
        isLoading: isLoadingCurrentTransaction,
        isFetching,
    } = useFilteredCurrentPaginatedTransaction({
        filterPayload: finalFilterPayload,
        pagination,
        enabled: true,
    })
    const navigate = useNavigate()

    const handleNavigate = (transactionId: TEntityId, fullPath: string) => {
        navigate({
            to: fullPath,
            search: {
                transactionId: transactionId,
            },
        })
    }
    if (isLoadingCurrentTransaction) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <TransactionCardSkeleton key={index} />
                ))}
            </div>
        )
    }
    const isNoCurrentTransaction =
        !CurrentTransaction || CurrentTransaction.data.length === 0
    return (
        <div className="max-h-screen overflow-y-auto p-2 ecoop-scroll">
            <div className="grid grid-cols-1 gap-4">
                {isNoCurrentTransaction && <NoTransactionsFound />}
                {CurrentTransaction.data.map((transaction) => (
                    <Card
                        key={transaction.id}
                        className="w-full cursor-pointer hover:shadow-lg hover:opacity-75 transition-shadow duration-200"
                        onClick={() =>
                            handleNavigate(transaction.id, fullPath || '')
                        }
                    >
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <CardTitle className="text-xl text-primary">
                                        {formatCurrency(
                                            transaction.amount
                                        )}{' '}
                                    </CardTitle>
                                    <CardDescription>
                                        {transaction.description ||
                                            'No description'}
                                    </CardDescription>
                                </div>
                                <TransactionTypeBadge
                                    transactionType={transaction.source}
                                />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Separator className="mb-2" />
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <span>
                                        Reference #:{' '}
                                        <CopyWrapper>
                                            {transaction.reference_number ||
                                                'N/A'}
                                        </CopyWrapper>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <PreviewMediaWrapper
                                        media={
                                            transaction.member_profile?.media
                                        }
                                    >
                                        <ImageDisplay
                                            className="size-5"
                                            src={
                                                transaction.member_profile
                                                    ?.media?.download_url
                                            }
                                        />
                                    </PreviewMediaWrapper>
                                    <span>
                                        {transaction.member_profile
                                            ?.full_name ||
                                            transaction.employee_user
                                                ?.user_name ||
                                            'N/A'}
                                    </span>
                                </div>
                                {transaction.created_at && (
                                    <div className="flex items-center gap-2">
                                        <Info size={16} />
                                        <span>
                                            Date:{' '}
                                            {format(
                                                new Date(
                                                    transaction.created_at
                                                ),
                                                'MMMM d, yyyy'
                                            )}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-2">
                                    <Info size={16} />
                                    <span>
                                        Total Due:{' '}
                                        {formatCurrency(transaction.total_due)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Info size={16} />
                                    <span>
                                        Loan Due:{' '}
                                        {formatCurrency(transaction.loan_due)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Info size={16} />
                                    <span>
                                        Fines Due:{' '}
                                        {formatCurrency(transaction.fines_due)}
                                    </span>
                                </div>
                            </div>
                            {onDetailsClick && (
                                <Button
                                    variant="outline"
                                    className="mt-6 w-full md:w-auto"
                                    onClick={() => onDetailsClick(transaction)}
                                >
                                    View Details{' '}
                                    <ArrowRight size={16} className="ml-2" />
                                </Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
            <div>
                <MiniPaginationBar
                    pagination={{
                        pageIndex: pagination.pageIndex,
                        pageSize: pagination.pageSize,
                        totalPage: CurrentTransaction.totalPage,
                        totalSize: CurrentTransaction.totalSize,
                    }}
                    disablePageMove={isFetching}
                    onNext={({ pageIndex }) =>
                        setPagination((prev) => ({ ...prev, pageIndex }))
                    }
                    onPrev={({ pageIndex }) =>
                        setPagination((prev) => ({ ...prev, pageIndex }))
                    }
                />
            </div>
        </div>
    )
}

export default TransactionCardList
