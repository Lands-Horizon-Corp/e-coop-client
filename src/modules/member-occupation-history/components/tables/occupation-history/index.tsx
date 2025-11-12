import { useMemo } from 'react'

import qs from 'query-string'

import { PAGE_SIZES_SMALL } from '@/constants'
import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers'
import { useMemberOccupationHistory } from '@/modules/member-occupation-history/member-occupation-history.service'
import { IMemberOccupationHistory } from '@/modules/member-occupation-history/member-occupation-history.types'
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

import memberOccupationHistoryColumns, {
    type IMemberOccupationHistoryColumnProps,
    memberOccupationHistoryGlobalSearchTargets,
} from './columns'

export interface MemberOccupationHistoryTableProps
    extends TableProps<IMemberOccupationHistory>,
        IMemberOccupationHistoryColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IMemberOccupationHistory>,
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

const MemberOccupationHistoryTable = ({
    profileId,
    className,
    toolbarProps,
}: MemberOccupationHistoryTableProps) => {
    const { pagination, setPagination } = usePagination({
        pageSize: PAGE_SIZES_SMALL[2],
    })
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(() => memberOccupationHistoryColumns(), [])

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
    } = useDataTableState<IMemberOccupationHistory>({
        defaultColumnOrder: columns.map((c) => c.id!),
    })

    const filterState = useDatableFilterState({
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const {
        isPending,
        isRefetching,
        data: { data = [], totalPage = 1, pageSize = 10, totalSize = 0 } = {},
        refetch,
    } = useMemberOccupationHistory({
        profileId,
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
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
                    exportActionProps={{
                        isLoading: isPending,
                        filters: exportfilter,
                        model: 'MemberOccupationHistory',
                        url: 'api/v1/member-occupation-history/search',
                    }}
                    filterLogicProps={{
                        filterLogic: filterState.filterLogic,
                        setFilterLogic: filterState.setFilterLogic,
                    }}
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: memberOccupationHistoryGlobalSearchTargets,
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
                    isScrollable={isScrollable}
                    isStickyFooter
                    isStickyHeader
                    setColumnOrder={setColumnOrder}
                    table={table}
                />
                <DataTablePagination
                    pageSizes={PAGE_SIZES_SMALL.slice(1)}
                    table={table}
                    totalSize={totalSize}
                />
            </div>
        </FilterContext.Provider>
    )
}

export default MemberOccupationHistoryTable
