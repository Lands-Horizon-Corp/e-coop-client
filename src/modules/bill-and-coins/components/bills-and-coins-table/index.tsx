import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers/tw-utils'
import {
    IBillsAndCoin,
    deleteManyBillsAndCoins,
    useGetPaginatedBillsAndCoins,
} from '@/modules/bill-and-coins'
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

import BillsAndCoinsTableColumns, {
    IBillsAndCoinsTableColumnProps,
    billsAndCoinsGlobalSearchTargets,
} from './columns'
import BillsAndCoinsAction, {
    BillsAndCoinsRowContext,
    BillsAndCoinsTableActionManager,
} from './row-action-context'

export interface BillsAndCoinsTableProps
    extends TableProps<IBillsAndCoin>, IBillsAndCoinsTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IBillsAndCoin>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

const BillsAndCoinsTable = ({
    persistKey = ['bills-and-coins'],
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    actionComponent = BillsAndCoinsAction,
    RowContextComponent = BillsAndCoinsRowContext,
}: BillsAndCoinsTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            BillsAndCoinsTableColumns({
                actionComponent,
            }),
        [actionComponent]
    )

    const { resolvedColumnOrder, resolvedColumnVisibility, finalKeys } =
        useResolvedColumnOrder({
            columns,
            persistKey,
        })

    const tableState = useDataTableState<IBillsAndCoin>({
        key: finalKeys,
        defaultColumnVisibility: resolvedColumnVisibility,
        defaultColumnOrder: resolvedColumnOrder,
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const {
        isPending,
        isRefetching,
        data: { data = [], totalPage = 1, pageSize = 10, totalSize = 0 } = {},
        refetch,
    } = useGetPaginatedBillsAndCoins({
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
    })

    const handleRowSelectionChange =
        tableState.createHandleRowSelectionChange(data)

    const table = useReactTable({
        columns,
        data: data,
        initialState: {
            columnPinning: { left: ['select'] },
        },
        state: {
            sorting: tableSorting,
            pagination,
            columnOrder: tableState.columnOrder,
            rowSelection: tableState.rowSelectionState.rowSelection,
            columnVisibility: tableState.columnVisibility,
        },
        rowCount: pageSize,
        manualSorting: true,
        pageCount: totalPage,
        enableMultiSort: false,
        manualFiltering: true,
        manualPagination: true,
        columnResizeMode: 'onChange',
        getRowId: tableState.getRowIdFn,
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        onColumnOrderChange: tableState.setColumnOrder,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: tableState.setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
        defaultColumn: { minSize: 100, size: 150, maxSize: 800 },
    })

    return (
        <TableRowActionStoreProvider>
            <FilterContext.Provider value={filterState}>
                <div
                    className={cn(
                        'flex h-full flex-col gap-y-2',
                        className,
                        !tableState.isScrollable && 'h-fit !max-h-none'
                    )}
                >
                    <DataTableToolbar
                        deleteActionProps={{
                            onDeleteSuccess: () =>
                                queryClient.invalidateQueries({
                                    queryKey: ['bills-and-coins', 'paginated'],
                                }),
                            onDelete: (selectedData) =>
                                deleteManyBillsAndCoins({
                                    ids: selectedData.map((data) => data.id),
                                }),
                        }}
                        filterLogicProps={{
                            filterLogic: filterState.filterLogic,
                            setFilterLogic: filterState.setFilterLogic,
                        }}
                        globalSearchProps={{
                            defaultMode: 'contains',
                            targets: billsAndCoinsGlobalSearchTargets,
                        }}
                        refreshActionProps={{
                            onClick: () => refetch(),
                            isLoading: isPending || isRefetching,
                        }}
                        scrollableProps={{
                            isScrollable: tableState.isScrollable,
                            setIsScrollable: tableState.setIsScrollable,
                        }}
                        table={table}
                        {...toolbarProps}
                    />
                    <DataTable
                        className="mb-2"
                        isScrollable={tableState.isScrollable}
                        isStickyFooter
                        isStickyHeader
                        onDoubleClick={onDoubleClick}
                        onRowClick={onRowClick}
                        RowContextComponent={RowContextComponent}
                        setColumnOrder={tableState.setColumnOrder}
                        table={table}
                    />
                    <DataTablePagination table={table} totalSize={totalSize} />
                </div>
            </FilterContext.Provider>
            <BillsAndCoinsTableActionManager />
        </TableRowActionStoreProvider>
    )
}

export default BillsAndCoinsTable
