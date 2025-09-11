import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers/tw-utils'
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

import { TEntityId } from '@/types'

import {
    ILoanClearanceAnalysis,
    deleteManyLoanClearanceAnalysis,
    useGetAllLoanClearanceAnalysis,
} from '../..'
import LoanClearanceAnalysisTableColumns, {
    ILoanClearanceAnalysisTableColumnProps,
    loanClearanceAnalysisGlobalSearchTargets,
} from './columns'

export interface LoanClearanceAnalysisTableProps
    extends TableProps<ILoanClearanceAnalysis>,
        ILoanClearanceAnalysisTableColumnProps {
    loanTransactionId: TEntityId
    toolbarProps?: Omit<
        IDataTableToolbarProps<ILoanClearanceAnalysis>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

const LoanClearanceAnalysisTable = ({
    className,
    toolbarProps,
    defaultFilter,
    loanTransactionId,
    onSelectData,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    actionComponent,
    RowContextComponent,
}: LoanClearanceAnalysisTableProps) => {
    const queryClient = useQueryClient()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            LoanClearanceAnalysisTableColumns({
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
    } = useDataTableState<ILoanClearanceAnalysis>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter: {
            ...(loanTransactionId && {
                loan_transaction_id: {
                    displayText: 'Loan Transaction',
                    mode: 'equal',
                    dataType: 'text',
                    value: loanTransactionId,
                },
            }),
            ...defaultFilter,
        },
    })

    const {
        isPending,
        isRefetching,
        data = [],
        refetch,
    } = useGetAllLoanClearanceAnalysis({
        loanTransactionId,
        query: {
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        options: {
            enabled: !!loanTransactionId,
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
            columnOrder,
            rowSelection: rowSelectionState.rowSelection,
            columnVisibility,
        },
        manualSorting: true,
        enableMultiSort: false,
        manualFiltering: true,
        columnResizeMode: 'onChange',
        getRowId: getRowIdFn,
        onSortingChange: setTableSorting,
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
                        targets: loanClearanceAnalysisGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: [
                                    'loan-clearance-analysis',
                                    'paginated',
                                ],
                            }),
                        onDelete: (selectedData) =>
                            deleteManyLoanClearanceAnalysis({
                                ids: selectedData.map((data) => data.id),
                            }),
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
                    setColumnOrder={setColumnOrder}
                    RowContextComponent={RowContextComponent}
                />
            </div>
        </FilterContext.Provider>
    )
}

export default LoanClearanceAnalysisTable
