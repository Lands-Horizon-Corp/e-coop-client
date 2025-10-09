import { useMemo } from 'react'

import { useQueryClient } from '@tanstack/react-query'

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

import { TEntityId } from '@/types'

import {
    deleteManyIncludeNegativeAccounts,
    useGetAllIncludeNegativeAccounts,
} from '../../include-negative-accounts.service'
import { IIncludeNegativeAccounts } from '../../include-negative-accounts.types'
import IncludeNegativeAccountAction, {
    IncludeNegativeAccountRowContext,
} from './action'
import {
    IIncludeNegativeAccountTableColumnProps,
    includeNegativeAccountGlobalSearchTargets,
} from './columns'
import IncludeNegativeAccountColumns from './columns'

export interface Props
    extends TableProps<IIncludeNegativeAccounts>,
        IIncludeNegativeAccountTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IIncludeNegativeAccounts>,
        | 'table'
        | 'globalSearchProps'
        | 'refreshActionProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

export type IncludeNegativeAccountTableProps = Props & {
    computationSheetId: TEntityId
}

const IncludeNegativeAccountTable = ({
    computationSheetId,
    className,
    toolbarProps,
    defaultFilter,
    onSelectData,
    actionComponent = IncludeNegativeAccountAction,
    RowContextComponent = IncludeNegativeAccountRowContext,
}: IncludeNegativeAccountTableProps) => {
    const queryClient = useQueryClient()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            IncludeNegativeAccountColumns({
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
    } = useDataTableState<IIncludeNegativeAccounts>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
    })

    const {
        isPending,
        isRefetching,
        data = [],
        refetch,
    } = useGetAllIncludeNegativeAccounts({
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
            columnOrder,
            rowSelection: rowSelectionState.rowSelection,
            columnVisibility,
        },
        getRowId: getRowIdFn,
        onSortingChange: setTableSorting,
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
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: ['include-negative-account'],
                            }),
                        onDelete: (selected) =>
                            deleteManyIncludeNegativeAccounts({
                                ids: selected.map((item) => item.id),
                            }),
                    }}
                    filterLogicProps={{
                        filterLogic: filterState.filterLogic,
                        setFilterLogic: filterState.setFilterLogic,
                    }}
                    globalSearchProps={{
                        defaultMode: 'equal',
                        defaultVisible: false,
                        targets: includeNegativeAccountGlobalSearchTargets,
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
                    RowContextComponent={RowContextComponent}
                    setColumnOrder={setColumnOrder}
                    table={table}
                />
            </div>
        </FilterContext.Provider>
    )
}

export default IncludeNegativeAccountTable
