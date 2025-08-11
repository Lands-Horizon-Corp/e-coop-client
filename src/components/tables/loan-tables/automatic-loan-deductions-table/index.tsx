// index.tsx
import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

import { deleteMany } from '@/api-service/loan-service/loan-scheme/automatic-loan-deduction-service'
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

import { useAutomaticLoanDeductions } from '@/hooks/api-hooks/loan/use-automatic-loan-deduction'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { IAutomaticLoanDeduction, TEntityId, TableProps } from '@/types'

import {
    IAutomaticLoanDeductionTableColumnProps,
    automaticLoanDeductionGlobalSearchTargets,
} from './columns'
import AutomaticLoanDeductionColumns from './columns'
import { AutomaticLoanDeductionRowContext } from './row-action-context'

export interface Props
    extends TableProps<IAutomaticLoanDeduction>,
        IAutomaticLoanDeductionTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IAutomaticLoanDeduction>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

export type AutomaticLoanDeductionTableProps = Props & {
    computationSheetId: TEntityId
}

const AutomaticLoanDeductionTable = ({
    computationSheetId,
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    actionComponent,
    RowContextComponent = AutomaticLoanDeductionRowContext,
}: AutomaticLoanDeductionTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            AutomaticLoanDeductionColumns({
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
    } = useDataTableState<IAutomaticLoanDeduction>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const { isPending, isRefetching, data, refetch } =
        useAutomaticLoanDeductions({
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
                        targets: automaticLoanDeductionGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: ['automatic-loan-deduction'],
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
                    onRowClick={onRowClick}
                    onDoubleClick={onDoubleClick}
                    isScrollable={isScrollable}
                    RowContextComponent={(props) => (
                        <RowContextComponent {...props} />
                    )}
                    setColumnOrder={setColumnOrder}
                />
                {/* <DataTablePagination table={table} totalSize={totalSize} /> */}
            </div>
        </FilterContext.Provider>
    )
}

export default AutomaticLoanDeductionTable
