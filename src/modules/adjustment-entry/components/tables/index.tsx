// src/modules/adjustment-entry/components/AdjustmentEntryTable.tsx
import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import qs from 'query-string'

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
import DataTablePagination from '@/components/data-table/data-table-pagination'
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'
import { TableProps } from '@/components/data-table/table.type'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState from '@/components/data-table/use-datatable-state'

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
} from './row-action-context'

export interface BaseAdjustmentEntryTableProps
    extends TableProps<IAdjustmentEntry>,
        IAdjustmentEntryTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IAdjustmentEntry>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
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
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    actionComponent = AdjustmentEntryAction,
    RowContextComponent = AdjustmentEntryRowContext,
    mode = 'all',
    currencyId,
    userOrganizationId,
}: TAdjustmentTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    // --- Columns Memoization ---
    const columns = useMemo(
        () =>
            AdjustmentEntryTableColumns({
                actionComponent,
            }),
        [actionComponent]
    )

    // --- Data Table State ---
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
    } = useDataTableState<IAdjustmentEntry>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    // --- Filter State ---
    const filterState = useDatableFilterState({
        defaultFilter,
        // Reset to page 0 when filters change
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    // --- Data Fetching (React Query) ---
    const {
        isPending,
        isRefetching,
        data: { data = [], totalPage = 1, pageSize = 10, totalSize = 0 } = {},
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

    // --- Row Selection Handler ---
    const handleRowSelectionChange = createHandleRowSelectionChange(data)

    // --- TanStack Table Instance ---
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
        // Server-side control flags
        manualSorting: true,
        pageCount: totalPage,
        manualFiltering: true,
        manualPagination: true,

        // Other settings
        enableMultiSort: false,
        columnResizeMode: 'onChange',
        getRowId: getRowIdFn,

        // Handlers
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,

        // Models
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
    })
    const exportfilter = qs.stringify(
        {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        { skipNull: true }
    )
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
                    // --- Delete Action Props ---
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: ['adjustment-entry', 'paginated'],
                            }),
                        onDelete: (selectedData) =>
                            deleteManyAdjustmentEntry({
                                ids: selectedData.map((data) => data.id),
                            }),
                    }}
                    // --- Export Action Props (Placeholder) ---
                    exportActionProps={{
                        isLoading: isPending,
                        filters: exportfilter,
                        model: 'AdjustmentEntry',
                        url: 'api/v1/adjustment-entry/search',
                    }}
                    // --- Filter Logic Props ---
                    filterLogicProps={{
                        filterLogic: filterState.filterLogic,
                        setFilterLogic: filterState.setFilterLogic,
                    }}
                    // --- Global Search Props ---
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: adjustmentEntryGlobalSearchTargets,
                    }}
                    // --- Refresh Action Props ---
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    // --- Scrollable Props ---
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
            </div>
        </FilterContext.Provider>
    )
}

export default AdjustmentEntryTable
