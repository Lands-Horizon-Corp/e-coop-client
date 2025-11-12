import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import qs from 'query-string'

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
    deleteManyAutomaticLoanDeduction,
    useGetAllAutomaticLoanDeductionsByComputationSheetSchemeId,
} from '../..'
import { IAutomaticLoanDeduction } from '../../automatic-loan-deduction.types'
import {
    IAutomaticLoanDeductionTableColumnProps,
    automaticLoanDeductionGlobalSearchTargets,
} from './columns'
import AutomaticLoanDeductionColumns from './columns'
import AutomaticLoanDeductionAction, {
    AutomaticLoanDeductionRowContext,
} from './row-action-context'

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
    actionComponent = AutomaticLoanDeductionAction,
    RowContextComponent = AutomaticLoanDeductionRowContext,
}: AutomaticLoanDeductionTableProps) => {
    const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
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

    const {
        isPending,
        isRefetching,
        data = [],
        refetch,
    } = useGetAllAutomaticLoanDeductionsByComputationSheetSchemeId({
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
    const exportfilter = qs.stringify(
        {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        { skipNull: true }
    )
    return (
        <FilterContext.Provider value={filterState}>
            <div className={cn('flex h-full flex-col gap-y-2', className)}>
                <DataTableToolbar
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: ['automatic-loan-deduction'],
                            }),
                        onDelete: (selected) =>
                            deleteManyAutomaticLoanDeduction({
                                ids: selected.map((item) => item.id),
                            }),
                    }}
                    exportActionProps={{
                        isLoading: isPending,
                        filters: exportfilter,
                        model: 'AutomaticLoanDeduction',
                        url: '/api/v1/automatic-loan-deduction/search',
                    }}
                    filterLogicProps={{
                        filterLogic: filterState.filterLogic,
                        setFilterLogic: filterState.setFilterLogic,
                    }}
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: automaticLoanDeductionGlobalSearchTargets,
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
                    onDoubleClick={onDoubleClick}
                    onRowClick={onRowClick}
                    RowContextComponent={RowContextComponent}
                    setColumnOrder={setColumnOrder}
                    table={table}
                />
                {/* <DataTablePagination table={table} totalSize={totalSize} /> */}
            </div>
        </FilterContext.Provider>
    )
}

export default AutomaticLoanDeductionTable
