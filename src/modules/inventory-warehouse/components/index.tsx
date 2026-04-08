import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import qs from 'query-string'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers/tw-utils'
import {
    IInventoryWarehouse,
    deleteManyInventoryWarehouse,
    useGetPaginatedInventoryWarehouse,
} from '@/modules/inventory-warehouse'
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
import { useLoadingColumns } from '@/components/data-table/use-loading-columns'

import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import InventoryWarehouseTableColumns, {
    IInventoryWarehouseTableColumnProps,
    inventoryWarehouseGlobalSearchTargets,
} from './columns'
import InventoryWarehouseAction, {
    InventoryWarehouseRowContext,
    InventoryWarehouseTableActionManager,
} from './row-action-context'

export interface InventoryWarehouseTableProps
    extends
        TableProps<IInventoryWarehouse>,
        IInventoryWarehouseTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IInventoryWarehouse>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'deleteActionProps'
    >
}

const InventoryWarehouseTable = ({
    persistKey = ['inventory-warehouse'],
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    actionComponent = InventoryWarehouseAction,
    RowContextComponent = InventoryWarehouseRowContext,
}: InventoryWarehouseTableProps) => {
    const queryClient = useQueryClient()

    const { pagination, setPagination } = usePagination()

    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            InventoryWarehouseTableColumns({
                actionComponent,
            }),
        [actionComponent]
    )

    const { resolvedColumnOrder, resolvedColumnVisibility, finalKeys } =
        useResolvedColumnOrder({
            columns,
            persistKey,
        })

    const tableState = useDataTableState<IInventoryWarehouse>({
        key: finalKeys,
        defaultColumnOrder: resolvedColumnOrder,
        defaultColumnVisibility: resolvedColumnVisibility,
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
    } = useGetPaginatedInventoryWarehouse({
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
    })

    const tableColumns = useLoadingColumns({
        columns,
        isLoading: isPending || isRefetching,
    })
    const handleRowSelectionChange =
        tableState.createHandleRowSelectionChange(data)

    const table = useReactTable({
        columns: tableColumns,
        data,
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
        defaultColumn: {
            minSize: 100,
            size: 150,
            maxSize: 800,
        },
    })

    const filter = qs.stringify(
        {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        { skipNull: true }
    )

    return (
        <TableRowActionStoreProvider>
            <FilterContext.Provider value={filterState}>
                <div
                    className={cn(
                        'flex h-full flex-col gap-y-2',
                        className,
                        !tableState.isScrollable && 'h-fit max-h-none!'
                    )}
                >
                    <DataTableToolbar
                        deleteActionProps={{
                            onDeleteSuccess: () =>
                                queryClient.invalidateQueries({
                                    queryKey: [
                                        'inventory-warehouse',
                                        'paginated',
                                    ],
                                }),
                            onDelete: (selectedData) =>
                                deleteManyInventoryWarehouse({
                                    ids: selectedData.map((d) => d.id),
                                }),
                        }}
                        exportActionProps={{
                            ...toolbarProps?.exportActionProps,
                            isLoading: isPending,
                            filters: filter,
                            disabled: isPending || isRefetching,
                            url: 'api/v1/inventory-warehouse/search',
                            hbsDataPath:
                                '/reports/inventory-warehouse/default-inventory-warehouse.hbs',
                        }}
                        filterLogicProps={{
                            filterLogic: filterState.filterLogic,
                            setFilterLogic: filterState.setFilterLogic,
                        }}
                        globalSearchProps={{
                            defaultMode: 'contains',
                            targets: inventoryWarehouseGlobalSearchTargets,
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

            <InventoryWarehouseTableActionManager />
        </TableRowActionStoreProvider>
    )
}

export default InventoryWarehouseTable
