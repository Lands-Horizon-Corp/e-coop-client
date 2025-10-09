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
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'
import { TableProps } from '@/components/data-table/table.type'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState from '@/components/data-table/use-datatable-state'

import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { TEntityId } from '@/types'

import {
    deleteManyBrowseExcludeIncludeAccounts,
    useGetAllBrowseExcludeIncludeAccounts,
} from '../../browse-exclude-include-accounts.service'
import { IBrowseExcludeIncludeAccounts } from '../../browse-exclude-include-accounts.types'
import BrowseExcludeIncludeAccountAction, {
    BrowseExcludeIncludeAccountRowContext,
} from './action'
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
    actionComponent = BrowseExcludeIncludeAccountAction,
    RowContextComponent = BrowseExcludeIncludeAccountRowContext,
}: BrowseExcludeIncludeAccountTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
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

    const {
        isPending,
        isRefetching,
        data = [],
        refetch,
    } = useGetAllBrowseExcludeIncludeAccounts({
        computationSheetId,
        query: {
            filter: filterState.finalFilterPayloadBase64,
            sort: sortingStateBase64,
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
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: ['browse-exclude-include-account'],
                            }),
                        onDelete: (selected) =>
                            deleteManyBrowseExcludeIncludeAccounts({
                                ids: selected.map((item) => item.id),
                            }),
                    }}
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
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: browseExcludeIncludeAccountGlobalSearchTargets,
                        defaultVisible: false,
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
                    isScrollable={isScrollable}
                    isStickyFooter
                    isStickyHeader
                    RowContextComponent={RowContextComponent}
                    setColumnOrder={setColumnOrder}
                    table={table}
                />
            </div>
        </FilterContext.Provider>
    )
}

export default BrowseExcludeIncludeAccountTable
