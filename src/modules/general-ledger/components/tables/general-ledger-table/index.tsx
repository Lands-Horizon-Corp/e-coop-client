import { useMemo } from 'react'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers'
import {
    TGeneralLedgerMode,
    useFilteredPaginatedGeneralLedger,
} from '@/modules/general-ledger/general-ledger.service'
import {
    IGeneralLedger,
    TEntryType,
} from '@/modules/general-ledger/general-ledger.types'
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

import GeneralLedgerTableColumns, {
    IGeneralLedgerTableColumnProps,
    generalLedgerGlobalSearchTargets,
} from './columns'

export interface GeneralLedgerTableProps
    extends TableProps<IGeneralLedger>,
        IGeneralLedgerTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IGeneralLedger>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    mode: TGeneralLedgerMode
    TEntryType?: TEntryType
}

export type TGeneralLedgerTableProps = GeneralLedgerTableProps &
    (
        | { mode: 'branch' }
        | { mode: 'current' }
        | {
              mode: 'employee'
              userOrganizationId: TEntityId
          }
        | {
              mode: 'member'
              memberProfileId: TEntityId
          }
        | {
              mode: 'member-account'
              memberProfileId: TEntityId
              accountId: TEntityId
          }
        | {
              mode: 'transaction-batch'
              transactionBatchId: TEntityId
          }
        | {
              mode: 'transaction'
              transactionId: TEntityId
          }
        | {
              mode: 'account'
              accountId: TEntityId
          }
    )

const GeneralLedgerTable = ({
    mode,
    className,
    TEntryType,
    toolbarProps,
    defaultFilter,
    excludeColumnIds,
    defaultColumnSort,
    onRowClick = () => {},
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    onSelectData,
    actionComponent,
    RowContextComponent,
    ...modeProps
}: TGeneralLedgerTableProps & {
    userOrganizationId?: TEntityId
    memberProfileId?: TEntityId
    accountId?: TEntityId
    transactionBatchId?: TEntityId
    transactionId?: TEntityId
}) => {
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(() => {
        const allColumns = GeneralLedgerTableColumns({
            actionComponent,
        })

        if (excludeColumnIds && excludeColumnIds.length > 0) {
            return allColumns.filter(
                (column) => !excludeColumnIds.includes(column.id as string)
            )
        }

        return allColumns
    }, [actionComponent, excludeColumnIds])

    const tableState = useDataTableState<IGeneralLedger>({
        defaultColumnOrder: defaultColumnSort || columns.map((c) => c.id!),
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
    } = useFilteredPaginatedGeneralLedger({
        mode,
        TEntryType,
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        userOrganizationId: modeProps.userOrganizationId,
        memberProfileId: modeProps.memberProfileId,
        accountId: modeProps.accountId,
        transactionBatchId: modeProps.transactionBatchId,
        transactionId: modeProps.transactionId,
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
                    filterLogicProps={{
                        filterLogic: filterState.filterLogic,
                        setFilterLogic: filterState.setFilterLogic,
                    }}
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: generalLedgerGlobalSearchTargets,
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
            </div>
        </FilterContext.Provider>
    )
}

export default GeneralLedgerTable
