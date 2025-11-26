import { useMemo } from 'react'

import { keepPreviousData, useQueryClient } from '@tanstack/react-query'
import qs from 'query-string'

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
import { TableRowActionStoreProvider } from '@/components/data-table/store/data-table-action-store'
import { TableProps } from '@/components/data-table/table.type'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState, {
    useResolvedColumnOrder,
} from '@/components/data-table/use-datatable-state'

import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import {
    IMemberProfile,
    deleteManyMemberProfiles,
    useGetPaginatedMemberProfiles,
} from '../../..'
import membersColumns, {
    IMemberProfilesTableColumnProps,
    memberGlobalSearchTargets,
} from './columns'
import MemberProfileAction, {
    MemberProfileRowContext,
    MemberProfileTableActionManager,
} from './row-action-context'

// import { MemberProfileRowContext } from './row-action-context'

export interface MemberProfileTableProps
    extends TableProps<IMemberProfile>,
        IMemberProfilesTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IMemberProfile>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

const MemberProfileTable = ({
    persistKey = ['member-profile'],
    className,
    toolbarProps,
    defaultFilter,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    onSelectData,
    actionComponent = MemberProfileAction,
    RowContextComponent = MemberProfileRowContext,
}: MemberProfileTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            membersColumns({
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
    } = useDataTableState<IMemberProfile>({
        key: finalKeys,
        defaultColumnVisibility: {
            isEmailVerified: false,
            isContactVerified: false,
            ...resolvedColumnVisibility,
        },
        defaultColumnOrder: resolvedColumnOrder,
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const {
        isPending,
        isRefetching,
        data: { data = [], totalPage = 1, pageSize = 10, totalSize = 0 } = {},
        refetch,
    } = useGetPaginatedMemberProfiles({
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        options: {
            placeholderData: keepPreviousData,
        },
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
        <TableRowActionStoreProvider<IMemberProfile>>
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
                                    queryKey: ['member-profile', 'paginated'],
                                }),
                            onDelete: (selectedData) =>
                                deleteManyMemberProfiles({
                                    ids: selectedData.map((data) => data.id),
                                }),
                        }}
                        exportActionProps={{
                            isLoading: isPending,
                            filters: exportfilter,
                            model: 'MemberProfile',
                            url: 'api/v1/member-profile/search',
                        }}
                        filterLogicProps={{
                            filterLogic: filterState.filterLogic,
                            setFilterLogic: filterState.setFilterLogic,
                        }}
                        globalSearchProps={{
                            defaultMode: 'equal',
                            targets: memberGlobalSearchTargets,
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
                <MemberProfileTableActionManager />
            </FilterContext.Provider>
        </TableRowActionStoreProvider>
    )
}

export default MemberProfileTable
