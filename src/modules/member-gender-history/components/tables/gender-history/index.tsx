import { useMemo } from 'react'

import { PAGE_SIZES_SMALL } from '@/constants'
import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers'
import { useMemberGenderHistory } from '@/modules/member-gender-history/member-gender-history.service'
import { IMemberGenderHistory } from '@/modules/member-gender-history/member-gender-history.types'
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

import memberGenderHistoryColumns, {
    IMemberGenderHistoryColumnProps,
    memberGenderHistoryGlobalSearchTargets,
} from './columns'

export interface MemberGenderHistoryTableProps
    extends TableProps<IMemberGenderHistory>,
        IMemberGenderHistoryColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IMemberGenderHistory>,
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

const MemberGenderHistoryTable = ({
    profileId,
    className,
    toolbarProps,
}: MemberGenderHistoryTableProps) => {
    const { pagination, setPagination } = usePagination({
        pageSize: PAGE_SIZES_SMALL[2],
    })
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(() => memberGenderHistoryColumns(), [])

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
    } = useDataTableState<IMemberGenderHistory>({
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
    } = useMemberGenderHistory({
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
                    filterLogicProps={{
                        filterLogic: filterState.filterLogic,
                        setFilterLogic: filterState.setFilterLogic,
                    }}
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: memberGenderHistoryGlobalSearchTargets,
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

export default MemberGenderHistoryTable
