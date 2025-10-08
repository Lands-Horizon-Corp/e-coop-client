import { useState } from 'react'

import { useNavigate } from '@tanstack/react-router'

import { PAGINATION_INITIAL_INDEX } from '@/constants'
import {
    PaymentsEntryListSkeleton,
    TransactionDetails,
} from '@/modules/transaction'
import { useFilteredPaginatedTransaction } from '@/modules/transactions'
import { PaginationState } from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

import RefreshButton from '@/components/buttons/refresh-button'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import { HistoryIcon } from '@/components/icons'
import MiniPaginationBar from '@/components/pagination-bars/mini-pagination-bar'
import SheetModal from '@/components/sheet/sheet'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'

import useDatableFilterState from '@/hooks/use-filter-state'

import { TEntityId } from '@/types'

import TransactionNoFound from './transaction-no-found'

export const TransactionHistory = ({ fullPath }: { fullPath: string }) => {
    const navigate = useNavigate()
    const [onOpen, setOnOpen] = useState(false)
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: PAGINATION_INITIAL_INDEX,
        pageSize: 10,
    })
    const { sortingStateBase64 } = useDataTableSorting()

    const filterState = useDatableFilterState({
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const {
        data: CurrentTransaction,
        isLoading: isLoadingCurrentTransaction,
        isFetching,
        refetch: refetchCurrentTransaction,
    } = useFilteredPaginatedTransaction({
        mode: 'current-user',
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
    })

    useHotkeys('Alt + R', () => {
        refetchCurrentTransaction()
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

    useHotkeys('h', (e) => {
        e.preventDefault()
        setOnOpen(true)
    })

    const isNoCurrentTransaction =
        !CurrentTransaction || CurrentTransaction.data.length === 0

    return (
        <>
            <Button
                className=""
                onClick={() => setOnOpen(true)}
                size="sm"
                variant="outline"
            >
                <HistoryIcon className="mr-2" />
                History
            </Button>
            <SheetModal
                className="min-w-full h-full max-w-[500px] p-5 md:min-w-[600px] overflow-hidden"
                onOpenChange={setOnOpen}
                open={onOpen}
            >
                <h1 className="text-lg font-bold ">
                    Transaction History
                    <RefreshButton
                        className="bg-transparent size-7"
                        isLoading={isLoadingCurrentTransaction}
                        onClick={refetchCurrentTransaction}
                    />
                </h1>
                <div className=" ecoop-scroll max-h-[90vh] overflow-auto ">
                    {isLoadingCurrentTransaction ? (
                        <PaymentsEntryListSkeleton itemNumber={10} />
                    ) : (
                        <ScrollArea>
                            <div className="min-h-[90vh] h-[90vh] flex flex-col space-y-1.5">
                                {isNoCurrentTransaction ? (
                                    <TransactionNoFound />
                                ) : (
                                    CurrentTransaction?.data.map(
                                        (transaction) => (
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
                                        )
                                    )
                                )}
                            </div>
                        </ScrollArea>
                    )}
                </div>
                <div className="sticky bottom-0 left-0 right-0">
                    <MiniPaginationBar
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
                        pagination={{
                            pageIndex: pagination.pageIndex,
                            pageSize: pagination.pageSize,
                            totalPage: CurrentTransaction?.totalPage ?? 0,
                            totalSize: CurrentTransaction?.totalSize ?? 0,
                        }}
                    />
                </div>
            </SheetModal>
        </>
    )
}

export default TransactionHistory
