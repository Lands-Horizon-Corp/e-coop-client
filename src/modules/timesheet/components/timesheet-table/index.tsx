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
import { TableProps } from '@/components/data-table/table.type'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState from '@/components/data-table/use-datatable-state'

import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { TEntityId } from '@/types'

import {
    TTimesheetHookMode,
    useGetPaginatedTimesheet,
} from '../../timesheet.service'
import { ITimesheet } from '../../timesheet.types'
import TimesheetTableColumns, {
    ITimesheetTableColumnProps,
    timesheetGlobalSearchTargets,
} from './columns'
import { TimesheetRowContext } from './row-action-context'

export interface TimesheetTableProps
    extends TableProps<ITimesheet>,
        ITimesheetTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<ITimesheet>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    mode: TTimesheetHookMode
}

export type TTimesheetProps = TimesheetTableProps &
    (
        | {
              mode: 'employee'
              userOrganizationId: TEntityId
          }
        | { mode: 'me' }
        | { mode: 'all' }
    )

const TimesheetTable = ({
    mode,
    className,
    toolbarProps,
    defaultFilter,
    userOrganizationId,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    onSelectData,
    actionComponent,
    RowContextComponent = TimesheetRowContext,
}: TTimesheetProps & {
    userOrganizationId?: TEntityId
}) => {
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            TimesheetTableColumns({
                hideSelect: mode === 'me',
                actionComponent,
            }),
        [actionComponent, mode]
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
    } = useDataTableState<ITimesheet>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const timesheetQuery = useGetPaginatedTimesheet({
        mode,
        userOrganizationId,
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
    })

    const {
        isPending,
        isRefetching,
        data: { data, totalPage, pageSize, totalSize } = {
            data: [],
            totalPage: 1,
            pageSize: 10,
            totalSize: 0,
        },
        refetch,
    } = timesheetQuery

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
                        targets: timesheetGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    scrollableProps={{ isScrollable, setIsScrollable }}
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
                    onRowClick={onRowClick}
                    onDoubleClick={onDoubleClick}
                    isScrollable={isScrollable}
                    RowContextComponent={RowContextComponent}
                    setColumnOrder={setColumnOrder}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default TimesheetTable
