// src/modules/adjustment-entry/components/AdjustmentEntryTable.tsx
import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers/tw-utils'
import {
    IAdjustmentEntry,
    TAdjustmentEntryHookMode,
    deleteManyAdjustmentEntry,
    useGetPaginatedAdjustmentEntry,
} from '@/modules/adjustment-entry'
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import DataTable from '@/components/data-table'
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'
import { TableRowActionStoreProvider } from '@/components/data-table/store/data-table-action-store'
import { TableProps } from '@/components/data-table/table.type'
import { useDataTablePagination } from '@/components/data-table/use-datatable-pagination'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState, {
    useResolvedColumnOrder,
} from '@/components/data-table/use-datatable-state'

import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { TEntityId } from '@/types'

import AdjustmentEntryTableColumns, {
    IAdjustmentEntryTableColumnProps,
    adjustmentEntryGlobalSearchTargets,
} from './columns'
import {
    AdjustmentEntryAction,
    AdjustmentEntryRowContext,
    AdjustmentEntryTableActionManager,
} from './row-action-context'

export interface BaseAdjustmentEntryTableProps
    extends TableProps<IAdjustmentEntry>, IAdjustmentEntryTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IAdjustmentEntry>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'deleteActionProps'
    >
    currencyId?: TEntityId
    userOrganizationId?: TEntityId
    mode?: TAdjustmentEntryHookMode
}

export type TAdjustmentTableProps = BaseAdjustmentEntryTableProps &
    (
        | {
              mode: Exclude<
                  TAdjustmentEntryHookMode,
                  'currency' | 'currency-employee'
              >
          }
        | {
              mode: 'currency'
              currencyId: TEntityId
          }
        | {
              mode: 'currency-employee'
              currencyId: TEntityId
              userOrganizationId: TEntityId
          }
    )

const AdjustmentEntryTable = ({
    persistKey = ['adjustment-entry'],
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    mode = 'all',
    currencyId,
    userOrganizationId,
    actionComponent = AdjustmentEntryAction,
    RowContextComponent = AdjustmentEntryRowContext,
}: TAdjustmentTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            AdjustmentEntryTableColumns({
                actionComponent,
            }),
        [actionComponent]
    )

    const { resolvedColumnOrder, resolvedColumnVisibility, finalKeys } =
        useResolvedColumnOrder({
            columns,
            persistKey,
        })

    const tableState = useDataTableState<IAdjustmentEntry>({
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
        data: paginatedData,
        refetch,
    } = useGetPaginatedAdjustmentEntry({
        mode,
        currencyId,
        userOrganizationId,
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
    })

    const { data, totalPage, totalSize } = useDataTablePagination(
        paginatedData,
        {
            fallbackPageSize: pagination.pageSize,
        }
    )

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
        rowCount: totalSize,
        pageCount: totalPage,
        manualSorting: true,
        manualFiltering: true,
        manualPagination: true,
        enableMultiSort: false,
        columnResizeMode: 'onChange',
        getRowId: tableState.getRowIdFn,
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        onColumnOrderChange: tableState.setColumnOrder,
        onColumnVisibilityChange: tableState.setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        defaultColumn: { minSize: 100, size: 150, maxSize: 800 },
    })

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
                                    queryKey: ['adjustment-entry', 'paginated'],
                                }),
                            onDelete: (selectedData) =>
                                deleteManyAdjustmentEntry({
                                    ids: selectedData.map((d) => d.id),
                                }),
                        }}
                        filterLogicProps={{
                            filterLogic: filterState.filterLogic,
                            setFilterLogic: filterState.setFilterLogic,
                        }}
                        globalSearchProps={{
                            defaultMode: 'contains',
                            targets: adjustmentEntryGlobalSearchTargets,
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
                        isLoading={isPending}
                        isScrollable={tableState.isScrollable}
                        isStickyFooter
                        isStickyHeader
                        onDoubleClick={onDoubleClick}
                        onRowClick={onRowClick}
                        RowContextComponent={RowContextComponent}
                        skeletonRowCount={20}
                        table={table}
                    />
                </div>
            </FilterContext.Provider>
            <AdjustmentEntryTableActionManager />
        </TableRowActionStoreProvider>
    )
}

export default AdjustmentEntryTable
