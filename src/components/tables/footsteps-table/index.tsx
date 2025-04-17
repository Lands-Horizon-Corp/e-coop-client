import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'

import DataTable from '@/components/data-table'
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'
import DataTablePagination from '@/components/data-table/data-table-pagination'

import footstepColumns, {
    IFootstepTableColumnProps,
    footstepGlobalSearchTargets,
} from './columns'

import { cn } from '@/lib'
import { TableProps } from '../types'
import { IFootstepResource } from '@/server/types'
import FootstepService from '@/server/api-service/footstep-service'
import FilterContext from '@/contexts/filter-context/filter-context'

import { usePagination } from '@/hooks/use-pagination'
import useDatableFilterState from '@/hooks/use-filter-state'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import { useFilteredPaginatedFootsteps } from '@/hooks/api-hooks/use-footstep'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'

export interface FootstepTableProps
    extends TableProps<IFootstepResource>,
        IFootstepTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IFootstepResource>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    mode?: 'self' | 'team'
}

const FootstepTable = ({
    mode,
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    actionComponent,
}: FootstepTableProps) => {
    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            footstepColumns({
                actionComponent,
            }),
        [actionComponent]
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
    } = useDataTableState<IFootstepResource>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const {
        isPending,
        isRefetching,
        data: { data, totalPage, pageSize, totalSize },
        refetch,
    } = useFilteredPaginatedFootsteps({
        mode,
        pagination,
        sort: sortingState,
        filterPayload: filterState.finalFilterPayload,
    })

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
                        targets: footstepGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    scrollableProps={{ isScrollable, setIsScrollable }}
                    exportActionProps={{
                        pagination,
                        isLoading: isPending,
                        filters: filterState.finalFilterPayload,
                        disabled: isPending || isRefetching,
                        exportAll: FootstepService.exportAll,
                        exportAllFiltered: FootstepService.exportAllFiltered,
                        exportCurrentPage: (ids) =>
                            FootstepService.exportSelected(
                                ids.map((data) => data.id)
                            ),
                        exportSelected: (ids) =>
                            FootstepService.exportSelected(
                                ids.map((data) => data.id)
                            ),
                    }}
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
                    isScrollable={isScrollable}
                    setColumnOrder={setColumnOrder}
                    className="mb-2"
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default FootstepTable
