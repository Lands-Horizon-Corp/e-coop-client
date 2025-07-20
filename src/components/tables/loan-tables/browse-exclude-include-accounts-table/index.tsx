import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

import { deleteMany } from '@/api-service/loan-service/loan-scheme/browse-exclude-include-account-service'
import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/lib'
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import DataTable from '@/components/data-table'
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'

import { useBrowseExcludeIncludeAccounts } from '@/hooks/api-hooks/loan/use-browse-exclude-include-accounts'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { IBrowseExcludeIncludeAccounts, TEntityId, TableProps } from '@/types'

import {
    IBrowseExcludeIncludeAccountTableColumnProps,
    browseExcludeIncludeAccountGlobalSearchTargets,
} from './columns'
import BrowseExcludeIncludeAccountColumns from './columns'

export interface Props
    extends TableProps<IBrowseExcludeIncludeAccounts>,
        IBrowseExcludeIncludeAccountTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IBrowseExcludeIncludeAccounts>,
        | 'table'
        | 'globalSearchProps'
        | 'refreshActionProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

export type BrowseExcludeIncludeAccountTableProps = Props & {
    computationSheetId: TEntityId
}

const BrowseExcludeIncludeAccountTable = ({
    computationSheetId,
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    actionComponent,
}: BrowseExcludeIncludeAccountTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () => BrowseExcludeIncludeAccountColumns({ actionComponent }),
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
    } = useDataTableState<IBrowseExcludeIncludeAccounts>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const { isPending, isRefetching, data, refetch } =
        useBrowseExcludeIncludeAccounts({
            computationSheetId,
            filter: filterState.finalFilterPayload,
            sort: sortingState,
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
        getRowId: getRowIdFn,
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        onColumnOrderChange: setColumnOrder,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
        manualSorting: true,
        manualFiltering: true,
        manualPagination: true,
        enableMultiSort: false,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        columnResizeMode: 'onChange',
    })

    return (
        <FilterContext.Provider value={filterState}>
            <div className={cn('flex h-full flex-col gap-y-2', className)}>
                <DataTableToolbar
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: browseExcludeIncludeAccountGlobalSearchTargets,
                        defaultVisible: false,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: ['browse-exclude-include-account'],
                            }),
                        onDelete: (selected) =>
                            deleteMany(selected.map((item) => item.id)),
                    }}
                    scrollableProps={{ isScrollable, setIsScrollable }}
                    exportActionProps={{
                        pagination,
                        filters: filterState.finalFilterPayload,
                        disabled: isPending || isRefetching,
                        isLoading: isPending,
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
                    className="mb-2"
                    isScrollable={isScrollable}
                    setColumnOrder={setColumnOrder}
                />
            </div>
        </FilterContext.Provider>
    )
}

export default BrowseExcludeIncludeAccountTable
