import { useMemo } from 'react'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/lib'
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

import {
    TTransactionMode,
    useFilteredPaginatedTransaction,
} from '@/hooks/api-hooks/use-transaction'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { ITransactionResponse, TEntityId, TableProps } from '@/types'

import TransactionTableColumns, {
    ITransactionTableColumnProps,
    transactionGlobalSearchTargets,
} from './columns'
import { TransactionRowContext } from './row-action-context'

export interface TransactionTableProps
    extends TableProps<ITransactionResponse>,
        ITransactionTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<ITransactionResponse>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    mode: TTransactionMode
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

const TransactionTable = ({
    mode,
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
    RowContextComponent = TransactionRowContext,
}: TTransactionProps & {
    memberProfileId?: TEntityId
    userId?: TEntityId
    transactionBatchId?: TEntityId
}) => {
    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            TransactionTableColumns({
                hideSelect: mode === 'current-user',
                actionComponent,
            }),
        [actionComponent, mode]
    )

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
    } = useDataTableState<ITransactionResponse>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const transactionQuery = useFilteredPaginatedTransaction({
        mode,
        pagination,
        memberProfileId,
        userId,
        transactionBatchId,
        sort: sortingState,
        filterPayload: filterState.finalFilterPayload,
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
            <div
                className={cn(
                    'flex h-full flex-col gap-y-2',
                    className,
                    !isScrollable && 'h-fit !max-h-none'
                )}
            >
                <DataTableToolbar
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: transactionGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    scrollableProps={{ isScrollable, setIsScrollable }}
                    filterLogicProps={{
                        filterLogic: filterState.filterLogic,
                        setFilterLogic: filterState.setFilterLogic,
                    }}
                    {...toolbarProps}
                />
                <DataTable
                    table={table}
                    isStickyHeader
                    isStickyFooter
                    className="mb-2"
                    onRowClick={onRowClick}
                    onDoubleClick={onDoubleClick}
                    isScrollable={isScrollable}
                    RowContextComponent={(props) => (
                        <RowContextComponent {...props} />
                    )}
                    setColumnOrder={setColumnOrder}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default TransactionTable
