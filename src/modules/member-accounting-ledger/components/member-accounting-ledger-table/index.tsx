import { useMemo } from 'react'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers'
import { IMemberAccountingLedger } from '@/modules/member-account-ledger'
import {
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

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
    TMemberAccountingLedgerHookMode,
    useFilteredPaginatedMemberAccountingLedger,
} from '../../member-accounting-ledger.service'
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
    mode: TMemberAccountingLedgerHookMode
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
    ...modeProps
}: TMemberAccountingLedgerTableProps & {
    memberProfileId?: TEntityId
}) => {
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            MemberAccountingLedgerTableColumns({
                actionComponent,
            }),
        [actionComponent]
    )

    const tableState = useDataTableState<IMemberAccountingLedger>({
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
        data: { data = [], totalPage = 1, pageSize = 10, totalSize = 0 } = {},
        refetch,
    } = useFilteredPaginatedMemberAccountingLedger({
        mode,
        memberProfileId: modeProps.memberProfileId,
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        options: {
            enabled:
                mode === 'branch' || modeProps.memberProfileId !== undefined,
        },
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
    useHotkeys('Alt + R', () => {
        refetch()
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
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: memberGeneralLedgerGlobalSearchTargets,
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
                    setColumnOrder={tableState.setColumnOrder}
                    table={table}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default MemberAccountingLedgerTable
