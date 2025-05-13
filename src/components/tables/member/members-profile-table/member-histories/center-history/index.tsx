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

import memberCenterHistoryColumns, {
    IMemberCenterHistoryColumnProps,
    memberCenterHistoryGlobalSearchTargets,
} from './columns'

import { cn } from '@/lib'
import { PAGE_SIZES_SMALL } from '@/constants'
import { usePagination } from '@/hooks/use-pagination'
import useDatableFilterState from '@/hooks/use-filter-state'
import FilterContext from '@/contexts/filter-context/filter-context'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import { useMemberCenterHistory } from '@/hooks/api-hooks/member/use-member-history'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'

import { TableProps } from '@/types'
import { IMemberCenterHistory, TEntityId } from '@/types'

export interface MemberCenterHistoryTableProps
    extends TableProps<IMemberCenterHistory>,
        IMemberCenterHistoryColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IMemberCenterHistory>,
        | 'table'
        | 'actionComponent'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    profileId: TEntityId
}

const MemberCenterHistoryTable = ({
    profileId,
    className,
    toolbarProps,
}: MemberCenterHistoryTableProps) => {
    const { pagination, setPagination } = usePagination({
        pageSize: PAGE_SIZES_SMALL[2],
    })
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(() => memberCenterHistoryColumns(), [])

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
    } = useDataTableState<IMemberCenterHistory>({
        defaultColumnOrder: columns.map((c) => c.id!),
    })

    const filterState = useDatableFilterState({
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const {
        isPending,
        isRefetching,
        data: { data, totalPage, pageSize, totalSize },
        refetch,
    } = useMemberCenterHistory({
        profileId,
        pagination,
        sort: sortingState,
        filterPayload: filterState.finalFilterPayload,
    })

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
        rowCount: pageSize,
        manualSorting: true,
        pageCount: totalPage,
        getRowId: getRowIdFn,
        manualFiltering: true,
        enableMultiSort: false,
        manualPagination: true,
        columnResizeMode: 'onChange',
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
                        targets: memberCenterHistoryGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    scrollableProps={{ isScrollable, setIsScrollable }}
                    // exportActionProps={{
                    //     pagination,
                    //     isLoading: isPending,
                    //     filters: filterState.finalFilterPayload,
                    //     disabled: isPending || isRefetching,
                    // }}
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
                />
                <DataTablePagination
                    table={table}
                    totalSize={totalSize}
                    pageSizes={PAGE_SIZES_SMALL.slice(1)}
                />
            </div>
        </FilterContext.Provider>
    )
}

export default MemberCenterHistoryTable
