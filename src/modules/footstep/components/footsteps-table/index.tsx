import { useMemo } from 'react'

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

import { TEntityId } from '@/types'

import {
    TFootstepHookMode,
    useFilteredPaginatedFootsteps,
} from '../../footstep.service'
import { IFootstep } from '../../footstep.types'
import FootstepTableColumns, {
    IFootstepTableColumnProps,
    footstepGlobalSearchTargets,
} from './columns'
import {
    FootstepRowContext,
    FootstepTableActionManager,
} from './row-action-context'

export interface FootstepTableProps
    extends TableProps<IFootstep>,
        IFootstepTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IFootstep>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    mode: TFootstepHookMode
}

export type TFootstepTableProps = FootstepTableProps &
    (
        | {
              mode: 'user-organization'
              userOrgId: TEntityId
          }
        | { mode: 'me' }
        | { mode: 'branch' }
        | { mode: 'me-branch' }
        | {
              mode: 'member-profile'
              memberProfileId: TEntityId
          }
    )

const FootstepTable = ({
    persistKey = ['footstep'],
    mode,
    className,
    userOrgId,
    toolbarProps,
    defaultFilter,
    memberProfileId,
    onRowClick = () => {},
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    onSelectData,
    actionComponent,
    RowContextComponent = FootstepRowContext,
}: TFootstepTableProps & {
    userOrgId?: TEntityId
    memberProfileId?: TEntityId
}) => {
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            FootstepTableColumns({
                actionComponent,
            }),
        [actionComponent]
    )

    const { resolvedColumnOrder, resolvedColumnVisibility, finalKeys } =
        useResolvedColumnOrder({
            columns,
            persistKey,
        })

    const tableState = useDataTableState<IFootstep>({
        key: finalKeys,
        defaultColumnVisibility: resolvedColumnVisibility,
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
    } = useFilteredPaginatedFootsteps({
        mode,
        userOrgId,
        memberProfileId,
        query: {
            pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
    })

    const handleRowSelectionChange =
        tableState.createHandleRowSelectionChange(data)

    const table = useReactTable({
        columns,
        data: data,
        initialState: {
            columnPinning: { left: [] },
        },
        state: {
            sorting: tableSorting,
            pagination,
            columnOrder: tableState.columnOrder,
            rowSelection: tableState.rowSelectionState.rowSelection,
            columnVisibility: tableState.columnVisibility,
        },
        rowCount: pageSize,
        manualSorting: true,
        pageCount: totalPage,
        enableMultiSort: false,
        manualFiltering: true,
        manualPagination: true,
        columnResizeMode: 'onChange',
        getRowId: tableState.getRowIdFn,
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        onColumnOrderChange: tableState.setColumnOrder,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: tableState.setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
        defaultColumn: { minSize: 100, size: 150, maxSize: 800 },
    })

    return (
        <FilterContext.Provider value={filterState}>
            <TableRowActionStoreProvider>
                <div
                    className={cn(
                        'flex h-full flex-col gap-y-2',
                        className,
                        !tableState.isScrollable && 'h-fit !max-h-none'
                    )}
                >
                    <DataTableToolbar
                        filterLogicProps={{
                            filterLogic: filterState.filterLogic,
                            setFilterLogic: filterState.setFilterLogic,
                        }}
                        globalSearchProps={{
                            defaultMode: 'contains',
                            targets: footstepGlobalSearchTargets,
                        }}
                        refreshActionProps={{
                            onClick: () => refetch(),
                            isLoading: isPending || isRefetching,
                        }}
                        scrollableProps={{
                            isScrollable: tableState.isScrollable,
                            setIsScrollable: tableState.setIsScrollable,
                        }}
                        table={table}
                        {...toolbarProps}
                    />
                    <DataTable
                        className="mb-2"
                        isScrollable={tableState.isScrollable}
                        isStickyFooter
                        isStickyHeader
                        onDoubleClick={onDoubleClick}
                        onRowClick={onRowClick}
                        RowContextComponent={RowContextComponent}
                        setColumnOrder={tableState.setColumnOrder}
                        table={table}
                    />
                    <DataTablePagination table={table} totalSize={totalSize} />
                    <FootstepTableActionManager />
                </div>
            </TableRowActionStoreProvider>
        </FilterContext.Provider>
    )
}

export default FootstepTable
