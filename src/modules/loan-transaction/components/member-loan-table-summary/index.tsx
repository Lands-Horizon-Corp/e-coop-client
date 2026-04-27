import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers'
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
import { useDataTablePagination } from '@/components/data-table/use-datatable-pagination'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState from '@/components/data-table/use-datatable-state'

import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { TEntityId } from '@/types'

import {
    deleteManyLoanTransaction,
    useGetPaginatedLoanTransaction,
} from '../../loan-transaction.service'
import { ILoanTransaction } from '../../loan-transaction.types'
import {
    IMemberLoanTableSummaryColumnProps,
    memberLoanTableSummaryGlobalSearchTargets,
} from './columns'
import MemberLoanTableSummaryColumns from './columns'

export interface TMemberLoanTableSummaryProps
    extends TableProps<ILoanTransaction>, IMemberLoanTableSummaryColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<ILoanTransaction>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >

    memberProfileId: TEntityId
}

const MemberLoanTableSummary = ({
    memberProfileId,

    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    actionComponent,
    RowContextComponent,
    onRowClick,
}: TMemberLoanTableSummaryProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            MemberLoanTableSummaryColumns({
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
    } = useDataTableState<ILoanTransaction>({
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
        data: paginatedData,
        refetch,
    } = useGetPaginatedLoanTransaction({
        mode: 'member-profile',
        memberProfileId,
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
            <div
                className={cn(
                    'flex h-full flex-col gap-y-2',
                    className,
                    !isScrollable && 'h-fit !max-h-none'
                )}
            >
                <DataTableToolbar
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: ['loan-transaction', 'paginated'],
                            }),
                        onDelete: (selectedData) =>
                            deleteManyLoanTransaction({
                                ids: selectedData.map((d) => d.id),
                            }),
                    }}
                    filterLogicProps={{
                        filterLogic: filterState.filterLogic,
                        setFilterLogic: filterState.setFilterLogic,
                    }}
                    globalSearchProps={{
                        defaultMode: 'contains',
                        targets: memberLoanTableSummaryGlobalSearchTargets,
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
                    className="mb-2"
                    isLoading={isPending}
                    isScrollable={isScrollable}
                    isStickyFooter
                    isStickyHeader
                    onRowClick={onRowClick}
                    RowContextComponent={RowContextComponent}
                    skeletonRowCount={20}
                    table={table}
                />

                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default MemberLoanTableSummary
