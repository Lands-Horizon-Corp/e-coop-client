import { useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'

import { deleteMany } from '@/api-service/loan-service/loan-scheme/include-negative-accounts-service'
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

import { useIncludeNegativeAccounts } from '@/hooks/api-hooks/loan/use-include-negative-account'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import useDatableFilterState from '@/hooks/use-filter-state'

import { IIncludeNegativeAccount, TEntityId, TableProps } from '@/types'

import {
    IIncludeNegativeAccountTableColumnProps,
    includeNegativeAccountGlobalSearchTargets,
} from './columns'
import IncludeNegativeAccountColumns from './columns'

export interface Props
    extends TableProps<IIncludeNegativeAccount>,
        IIncludeNegativeAccountTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IIncludeNegativeAccount>,
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
    actionComponent,
}: IncludeNegativeAccountTableProps) => {
    const queryClient = useQueryClient()
    const { sortingState, tableSorting, setTableSorting } =
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
    } = useDataTableState<IIncludeNegativeAccount>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
    })

    const { isPending, isRefetching, data, refetch } =
        useIncludeNegativeAccounts({
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
                    globalSearchProps={{
                        defaultMode: 'equal',
                        defaultVisible: false,
                        targets: includeNegativeAccountGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
                    deleteActionProps={{
                        onDeleteSuccess: () =>
                            queryClient.invalidateQueries({
                                queryKey: ['include-negative-account'],
                            }),
                        onDelete: (selected) =>
                            deleteMany(selected.map((item) => item.id)),
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
                    isScrollable={isScrollable}
                    setColumnOrder={setColumnOrder}
                />
            </div>
        </FilterContext.Provider>
    )
}

export default IncludeNegativeAccountTable
