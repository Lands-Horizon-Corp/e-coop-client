import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers/tw-utils'
import {
    IAccount,
    deleteMany,
    exportAll,
    exportAllFiltered,
    exportSelected,
    useGetPaginated,
} from '@/modules/account'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
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
import { useSubscribe } from '@/hooks/use-pubsub'

import accountTableColumns, {
    IAccountsTableColumnProps,
    accountsGlobalSearchTargets,
} from './columns'
import { AccountRowContext } from './row-actions'

export interface AccountsTableProps
    extends TableProps<IAccount>,
        IAccountsTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IAccount>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

const AccountsTable = ({
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    actionComponent,
    RowContextComponent = AccountRowContext,
}: AccountsTableProps) => {
    const queryClient = useQueryClient()

    const { pagination, setPagination } = usePagination()
    const { tableSorting, setTableSorting } = useDataTableSorting()

    const {
        currentAuth: {
            user_organization: { branch_id },
        },
    } = useAuthUserWithOrgBranch()

    const columns = useMemo(
        () =>
            accountTableColumns({
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
    } = useDataTableState<IAccount>({
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
    } = useGetPaginated({})

    const {
        data = [],
        totalPage = 0,
        pageSize = 0,
        totalSize = 0,
    } = paginatedData || {}

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

    useSubscribe(`account.create.branch.${branch_id}`, refetch)
    useSubscribe(`account.update.branch.${branch_id}`, refetch)
    useSubscribe(`account.delete.branch.${branch_id}`, refetch)

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
                    className=""
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: accountsGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    deleteActionProps={{
                        onDeleteSuccess: () => {
                            queryClient.invalidateQueries({
                                queryKey: ['account', 'resource-query'],
                            })
                        },
                        onDelete: (selectedData) =>
                            deleteMany(selectedData.map((data) => data.id)),
                    }}
                    scrollableProps={{ isScrollable, setIsScrollable }}
                    exportActionProps={{
                        pagination,
                        isLoading: isPending,
                        filters: filterState.finalFilterPayload,
                        disabled: isPending || isRefetching,
                        exportAll: exportAll,
                        exportAllFiltered: exportAllFiltered,
                        exportCurrentPage: (ids) =>
                            exportSelected(ids.map((data) => data.id)),
                        exportSelected: (ids) =>
                            exportSelected(ids.map((data) => data.id)),
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
                    onRowClick={onRowClick}
                    onDoubleClick={onDoubleClick}
                    RowContextComponent={(props) => (
                        <RowContextComponent {...props} />
                    )}
                    setColumnOrder={setColumnOrder}
                    className="mb-2"
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default AccountsTable
