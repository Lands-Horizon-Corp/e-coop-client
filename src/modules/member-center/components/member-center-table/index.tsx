import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers/tw-utils'
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
import { useDataTablePagination } from '@/components/data-table/use-datatable-pagination'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState, {
    useResolvedColumnOrder,
} from '@/components/data-table/use-datatable-state'

import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { MemberCenterAPI, useGetPaginated } from '../../member-center.service'
import { IMemberCenter } from '../../member-center.types'
import memberCenterColumns, {
    IMemberCenterTableColumnProps,
    memberCenterGlobalSearchTargets,
} from './columns'
import {
    MemberCenterRowContext,
    MemberCenterTableActionManager,
} from './row-action-context'

export interface MemberCenterTableProps
    extends TableProps<IMemberCenter>, IMemberCenterTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IMemberCenter>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'deleteActionProps'
    >
}

const MemberCenterTable = ({
    persistKey = ['member-center'],
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    actionComponent,
    RowContextComponent = MemberCenterRowContext,
}: MemberCenterTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            memberCenterColumns({
                actionComponent,
            }),
        [actionComponent]
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
    } = useDataTableState<IMemberCenter>({
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
        data: paginatedData,
        refetch,
    } = useGetPaginated({
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

    const handleRowSelectionChange = createHandleRowSelectionChange(data)

    const table = useReactTable({
        columns,
        data,
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
        rowCount: totalSize,
        pageCount: totalPage,
        enableMultiSort: false,
        manualSorting: true,
        manualFiltering: true,
        manualPagination: true,
        columnResizeMode: 'onChange',
        getRowId: getRowIdFn,
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
    })

    return (
        <FilterContext.Provider value={filterState}>
            <TableRowActionStoreProvider>
                <div
                    className={cn(
                        'relative z-0 flex h-full flex-col gap-y-2',
                        className,
                        !isScrollable && 'h-fit max-h-none!'
                    )}
                >
                    <DataTableToolbar
                        deleteActionProps={{
                            onDeleteSuccess: () =>
                                queryClient.invalidateQueries({
                                    queryKey: ['member-center', 'paginated'],
                                }),
                            onDelete: (selectedData) =>
                                MemberCenterAPI.deleteMany({
                                    ids: selectedData.map((d) => d.id),
                                }),
                        }}
                        filterLogicProps={{
                            filterLogic: filterState.filterLogic,
                            setFilterLogic: filterState.setFilterLogic,
                        }}
                        globalSearchProps={{
                            defaultMode: 'contains',
                            targets: memberCenterGlobalSearchTargets,
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
                        className={cn('mb-2', isScrollable && 'flex-1')}
                        isLoading={isPending}
                        isScrollable={isScrollable}
                        isStickyFooter
                        isStickyHeader
                        onDoubleClick={onDoubleClick}
                        onRowClick={onRowClick}
                        RowContextComponent={RowContextComponent}
                        skeletonRowCount={20}
                        table={table}
                    />

                    <DataTablePagination table={table} totalSize={totalSize} />
                    <MemberCenterTableActionManager />
                </div>
            </TableRowActionStoreProvider>
        </FilterContext.Provider>
    )
}

export default MemberCenterTable
