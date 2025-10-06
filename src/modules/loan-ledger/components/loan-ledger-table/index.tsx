import { useMemo } from 'react'

// import { useQueryClient } from '@tanstack/react-query'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers/tw-utils'
import { ILoanLedger, useGetPaginatedLoanLedger } from '@/modules/loan-ledger'
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

import LoanLedgerTableColumns, {
    ILoanLedgerTableColumnProps,
    loanLedgerGlobalSearchTargets,
} from './columns'
import LoanLedgerAction, { LoanLedgerRowContext } from './row-action-context'

export interface LoanLedgerTableProps
    extends TableProps<ILoanLedger>,
        ILoanLedgerTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<ILoanLedger>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

const LoanLedgerTable = ({
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    actionComponent = LoanLedgerAction,
    RowContextComponent = LoanLedgerRowContext,
}: LoanLedgerTableProps) => {
    // const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            LoanLedgerTableColumns({
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
    } = useDataTableState<ILoanLedger>({
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
        data: {
            // TODO: Remove mocks
            data = [
                {
                    id: '1',
                    line_number: 1,
                    reference_number: 'LN-0001',
                    entry_date: '2025-10-01',
                    debit: 5000,
                    credit: 0,
                    balance: 5000,
                    type: 'CASH',
                    created_at: '2025-10-01T08:00:00Z',
                    updated_at: '2025-10-01T08:00:00Z',
                },
                {
                    id: '2',
                    line_number: 2,
                    reference_number: 'LN-0002',
                    entry_date: '2025-10-02',
                    debit: 0,
                    credit: 1000,
                    balance: 4000,
                    type: 'CASH',
                    created_at: '2025-10-02T08:00:00Z',
                    updated_at: '2025-10-02T08:00:00Z',
                },
                {
                    id: '3',
                    line_number: 3,
                    reference_number: 'LN-0003',
                    entry_date: '2025-10-03',
                    debit: 0,
                    credit: 500,
                    balance: 3500,
                    type: 'CASH',
                    created_at: '2025-10-03T08:00:00Z',
                    updated_at: '2025-10-03T08:00:00Z',
                },
            ],
            totalPage = 1,
            pageSize = 10,
            totalSize = 0,
        } = {},
        refetch,
    } = useGetPaginatedLoanLedger({
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        options: { enabled: false },
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
                        targets: loanLedgerGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    // No delete/export actions for loan ledger
                    scrollableProps={{ isScrollable, setIsScrollable }}
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
                    isScrollable={isScrollable}
                    onDoubleClick={onDoubleClick}
                    setColumnOrder={setColumnOrder}
                    RowContextComponent={RowContextComponent}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default LoanLedgerTable
