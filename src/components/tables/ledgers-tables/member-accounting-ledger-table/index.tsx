import { useMemo } from 'react'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/lib'
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

import {
    type TMemberAccountingLedgerMode,
    useFilteredPaginatedMemberAccountingLedger,
} from '@/hooks/api-hooks/member/use-member-accounting-ledger'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { IMemberAccountingLedger, TEntityId } from '@/types'
import { TableProps } from '@/types'

import MemberAccountingLedgerTableColumns, {
    IMemberAccountingLedgerTableColumnProps,
    memberGeneralLedgerGlobalSearchTargets,
} from './columns'

export interface MemberAccountingLedgerTableProps
    extends TableProps<IMemberAccountingLedger>,
        IMemberAccountingLedgerTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IMemberAccountingLedger>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    mode: TMemberAccountingLedgerMode
}

export type TMemberAccountingLedgerTableProps =
    MemberAccountingLedgerTableProps &
        (
            | { mode: 'branch' }
            | {
                  mode: 'member'
                  memberProfileId: TEntityId
              }
        )

const MemberAccountingLedgerTable = ({
    mode,
    className,
    toolbarProps,
    defaultFilter,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    onSelectData,
    actionComponent,
    RowContextComponent,
    ...modeProps
}: TMemberAccountingLedgerTableProps & {
    memberProfileId?: TEntityId
}) => {
    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            MemberAccountingLedgerTableColumns({
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
    } = useDataTableState<IMemberAccountingLedger>({
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
        data: { data, totalPage, pageSize, totalSize },
        refetch,
    } = useFilteredPaginatedMemberAccountingLedger({
        mode,
        memberProfileId: modeProps.memberProfileId,
        pagination,
        sort: sortingState,
        filterPayload: filterState.finalFilterPayload,
        enabled: mode === 'branch' || modeProps.memberProfileId !== undefined,
    })

    const handleRowSelectionChange =
        tableState.createHandleRowSelectionChange(data)

    const table = useReactTable({
        columns,
        data: data,
        initialState: {
            columnPinning: { left: ['select'] },
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
    })

    return (
        <FilterContext.Provider value={filterState}>
            <div
                className={cn(
                    'flex h-full flex-col gap-y-2',
                    className,
                    !tableState.isScrollable && 'h-fit !max-h-none'
                )}
            >
                <DataTableToolbar
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: memberGeneralLedgerGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    scrollableProps={{
                        isScrollable: tableState.isScrollable,
                        setIsScrollable: tableState.setIsScrollable,
                    }}
                    exportActionProps={{
                        pagination,
                        isLoading: isPending,
                        filters: filterState.finalFilterPayload,
                        disabled: isPending || isRefetching,
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
                    onRowClick={onRowClick}
                    onDoubleClick={onDoubleClick}
                    isScrollable={tableState.isScrollable}
                    RowContextComponent={
                        RowContextComponent
                            ? (props) => <RowContextComponent {...props} />
                            : undefined
                    }
                    setColumnOrder={tableState.setColumnOrder}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default MemberAccountingLedgerTable
