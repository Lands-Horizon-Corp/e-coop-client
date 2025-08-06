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
    type TGeneralLedgerMode,
    useFilteredPaginatedGeneralLedger,
} from '@/hooks/api-hooks/use-general-ledger'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { IGeneralLedger, TEntityId, TEntryType, TableProps } from '@/types'

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
    toolbarProps,
    defaultFilter,
    TEntryType,
    onRowClick = () => {},
    onSelectData,
    actionComponent,
    ...modeProps
}: TGeneralLedgerTableProps & {
    userOrganizationId?: TEntityId
    memberProfileId?: TEntityId
    accountId?: TEntityId
    transactionBatchId?: TEntityId
    transactionId?: TEntityId
}) => {
    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            GeneralLedgerTableColumns({
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
    } = useDataTableState<IGeneralLedger>({
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
    } = useFilteredPaginatedGeneralLedger({
        mode,
        TEntryType,
        pagination,
        sort: sortingState,
        filterPayload: filterState.finalFilterPayload,
        userOrganizationId: modeProps.userOrganizationId,
        memberProfileId: modeProps.memberProfileId,
        accountId: modeProps.accountId,
        transactionBatchId: modeProps.transactionBatchId,
        transactionId: modeProps.transactionId,
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
                        targets: generalLedgerGlobalSearchTargets,
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
                    isScrollable={isScrollable}
                    setColumnOrder={setColumnOrder}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default GeneralLedgerTable
