import { useMemo } from 'react'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers'
import { ITransaction } from '@/modules/transaction'
import {
    TTransactionHookMode,
    useFilteredPaginatedTransaction,
} from '@/modules/transactions'
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import DataTable from '@/components/data-table'
import DataTablePagination from '@/components/data-table/data-table-pagination'
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'
import { TableRowActionStoreProvider } from '@/components/data-table/store/data-table-action-store'
import { TableProps } from '@/components/data-table/table.type'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState, {
    useResolvedColumnOrder,
} from '@/components/data-table/use-datatable-state'

import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { TEntityId } from '@/types'

import TransactionTableColumns, {
    ITransactionTableColumnProps,
    transactionGlobalSearchTargets,
} from './columns'
import { TransactionTableActionManager } from './row-action-context'

export interface TransactionTableProps
    extends TableProps<ITransaction>,
        ITransactionTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<ITransaction>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    mode: TTransactionHookMode
}

export type TTransactionProps = TransactionTableProps &
    (
        | {
              mode: 'current-branch'
          }
        | {
              mode: 'current-user'
          }
        | {
              mode: 'member-profile'
              memberProfileId: TEntityId
          }
        | {
              mode: 'employee'
              userId: TEntityId
          }
        | {
              mode: 'transaction-batch'
              transactionBatchId: TEntityId
          }
    )

const TransactionsTable = ({
    mode,
    persistKey = ['transactions'],
    className,
    toolbarProps,
    defaultFilter,
    memberProfileId,
    userId,
    transactionBatchId,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    onSelectData,
    actionComponent,
    RowContextComponent,
}: TTransactionProps & {
    memberProfileId?: TEntityId
    userId?: TEntityId
    transactionBatchId?: TEntityId
}) => {
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            TransactionTableColumns({
                hideSelect: mode === 'current-user',
                actionComponent,
            }),
        [actionComponent, mode]
    )

    const { resolvedColumnOrder, resolvedColumnVisibility, finalKeys } =
        useResolvedColumnOrder({
            columns,
            persistKey,
        })

    const {
        getRowIdFn,
        columnOrder,
        setColumnOrder,
        isScrollable,
        setIsScrollable,
        columnVisibility,
        setColumnVisibility,
        rowSelectionState,
        createHandleRowSelectionChange,
    } = useDataTableState<ITransaction>({
        key: finalKeys,
        defaultColumnOrder: resolvedColumnOrder,
        defaultColumnVisibility: resolvedColumnVisibility,
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const transactionQuery = useFilteredPaginatedTransaction({
        mode,
        memberProfileId,
        userId,
        transactionBatchId,
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
    })

    const {
        isPending,
        isRefetching,
        data: { data, totalPage, pageSize, totalSize } = {
            data: [],
            totalPage: 1,
            pageSize: 10,
            totalSize: 0,
        },
        refetch,
    } = transactionQuery

    const handleRowSelectionChange = createHandleRowSelectionChange(data)

    const table = useReactTable({
        columns,
        data: data,
        initialState: {
            columnPinning: { left: ['select'] },
        },
        state: {
            sorting: tableSorting,
            pagination,
            columnOrder,
            rowSelection: rowSelectionState.rowSelection,
            columnVisibility,
        },
        rowCount: pageSize,
        manualSorting: true,
        pageCount: totalPage,
        enableMultiSort: false,
        manualFiltering: true,
        manualPagination: true,
        columnResizeMode: 'onChange',
        getRowId: getRowIdFn,
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        onColumnOrderChange: setColumnOrder,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
    })

    return (
        <FilterContext.Provider value={filterState}>
            <TableRowActionStoreProvider>
                <div
                    className={cn(
                        'flex h-full flex-col gap-y-2',
                        className,
                        !isScrollable && 'h-fit !max-h-none'
                    )}
                >
                    <DataTableToolbar
                        filterLogicProps={{
                            filterLogic: filterState.filterLogic,
                            setFilterLogic: filterState.setFilterLogic,
                        }}
                        globalSearchProps={{
                            defaultMode: 'contains',
                            targets: transactionGlobalSearchTargets,
                        }}
                        refreshActionProps={{
                            onClick: () => refetch(),
                            isLoading: isPending || isRefetching,
                        }}
                        scrollableProps={{ isScrollable, setIsScrollable }}
                        table={table}
                        {...toolbarProps}
                    />
                    <DataTable
                        className="mb-2"
                        isScrollable={isScrollable}
                        isStickyFooter
                        isStickyHeader
                        onDoubleClick={onDoubleClick}
                        onRowClick={onRowClick}
                        RowContextComponent={RowContextComponent}
                        setColumnOrder={setColumnOrder}
                        table={table}
                    />
                    <DataTablePagination table={table} totalSize={totalSize} />
                    <TransactionTableActionManager />
                </div>
            </TableRowActionStoreProvider>
        </FilterContext.Provider>
    )
}

export default TransactionsTable
