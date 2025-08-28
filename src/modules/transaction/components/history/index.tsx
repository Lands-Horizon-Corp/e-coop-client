import { useState } from 'react'

import { useNavigate } from '@tanstack/react-router'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import {
    TransactionCardItem,
    TransactionDetails,
    useFilteredPaginatedTransaction,
} from '@/modules/transaction'
import { PaginationState } from '@tanstack/react-table'

import RefreshButton from '@/components/buttons/refresh-button'
import { HistoryIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'

import useFilterState from '@/hooks/use-filter-state'
import { useShortcut } from '@/hooks/use-shorcuts'

import { TEntityId } from '@/types'

import TransactionSkeletonCard from '../skeleton/transaction-skeleton-card'
import TransactionNoFound from './transaction-no-found'

export const TransactionHistory = ({ fullPath }: { fullPath: string }) => {
    const navigate = useNavigate()
    const [onOpen, setOnOpen] = useState(false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 10,
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
        refetch: refetchCurrentTransaction,
    } = useFilteredPaginatedTransaction({
        mode: 'current-user',
    })

    const handleNavigate = (transactionId: TEntityId, fullPath: string) => {
        navigate({
            to: fullPath,
            search: {
                transactionId: transactionId,
            },
        })
        setOnOpen(false)
    }

    useShortcut(
        'h',
        () => {
            setOnOpen(true)
        },
        {
            disableTextInputs: true,
        }
    )
    if (isLoadingCurrentTransaction) {
        return (
            <div className="space-y-4">
                {Array.from({ length: 3 }).map((_, index) => (
                    <TransactionSkeletonCard key={index} />
                ))}
            </div>
        )
    }

    const isNoCurrentTransaction =
        !CurrentTransaction || CurrentTransaction.data.length === 0

    return (
        <div className="flex w-full flex-row items-center justify-between ">
            <Sheet open={onOpen} onOpenChange={setOnOpen}>
                <SheetTrigger asChild className="">
                    <Button
                        variant="ghost"
                        className=""
                        size="sm"
                        onClick={() => setOnOpen(true)}
                    >
                        <HistoryIcon className="mr-2" />
                        History
                    </Button>
                </SheetTrigger>
                <SheetContent className=" min-w-full max-w-[500px] md:min-w-[600px]">
                    <div className="overflow-y-auto ecoop-scroll">
                        <h1 className="text-lg font-bold mb-2">
                            Transaction History
                            <RefreshButton
                                className="bg-transparent size-7"
                                onClick={refetchCurrentTransaction}
                                isLoading={isLoadingCurrentTransaction}
                            />
                        </h1>
                        <ScrollArea>
                            <div className="min-h-[90vh] h-[90vh] flex flex-col space-y-1.5">
                                {(isNoCurrentTransaction ||
                                    CurrentTransaction) && (
                                    <TransactionNoFound />
                                )}
                                {CurrentTransaction?.data.map((transaction) => (
                                    <div key={transaction.id}>
                                        <TransactionDetails
                                            item={transaction}
                                            onClick={() =>
                                                handleNavigate(
                                                    transaction.id,
                                                    fullPath
                                                )
                                            }
                                        />
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                        <div>
                            <MiniPaginationBar
                                pagination={{
                                    pageIndex: pagination.pageIndex,
                                    pageSize: pagination.pageSize,
                                    totalPage:
                                        CurrentTransaction?.totalPage ?? 0,
                                    totalSize:
                                        CurrentTransaction?.totalSize ?? 0,
                                }}
                                disablePageMove={isFetching}
                                onNext={({ pageIndex }) =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex,
                                    }))
                                }
                                onPrev={({ pageIndex }) =>
                                    setPagination((prev) => ({
                                        ...prev,
                                        pageIndex,
                                    }))
                                }
                            />
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
            <p className="text-[min(10px,1rem)] text-muted-foreground/50 text-end">
                F1 - payment | F2 - deposit | F3 - withdraw | Esc - reset
            </p>
        </div>
    )
}

export default TransactionHistory
