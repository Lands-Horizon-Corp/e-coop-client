import { useMemo } from 'react'

import { cn } from '@/helpers'
import {
    TGeneralLedgerEndpointMode,
    useGetAllGeneralLedger,
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
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'
import { TableRowActionStoreProvider } from '@/components/data-table/store/data-table-action-store'
import { TableProps } from '@/components/data-table/table.type'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState, {
    useResolvedColumnOrder,
} from '@/components/data-table/use-datatable-state'

import { usePagination } from '@/hooks/use-pagination'

import { TEntityId } from '@/types'

import {
    GeneralLedgerRunningRowContext,
    GeneralLedgerRunningTableActionManager,
} from '../general-ledger-running-table/row-action-context'
import GeneralLedgerTableColumns, {
    IGeneralLedgerTableColumnProps,
} from './columns'

export interface GeneralLedgerAllTableBaseProps
    extends TableProps<IGeneralLedger>, IGeneralLedgerTableColumnProps {
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
    mode: TGeneralLedgerEndpointMode
    entryType?: TEntryType
}

export type TGeneralLedgerAllTableProps =
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'all'
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'branch'
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'current'
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'employee'
          userOrganizationId: string
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'member'
          memberProfileId: string
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'member-account'
          memberProfileId: string
          accountId: string
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'transaction-batch'
          transactionBatchId: string
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'transaction'
          transactionId: string
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'loan-transaction'
          loanTransactionId: string
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'member-accounting-ledger'
          memberAccountingLedgerId: string
      })
    | (GeneralLedgerAllTableBaseProps & {
          mode: 'account'
          accountId: string
      })

const GeneralLedgerAllTable = ({
    persistKey = ['general-ledger-all'],
    mode,
    className,
    entryType,
    accountId,
    transactionId,
    memberProfileId,
    userOrganizationId,
    transactionBatchId,
    toolbarProps,
    excludeColumnIds,
    onRowClick = () => {},
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    onSelectData,
    RowContextComponent = GeneralLedgerRunningRowContext,
}: TGeneralLedgerAllTableProps & {
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
        const allColumns = GeneralLedgerTableColumns()

        if (excludeColumnIds?.length) {
            return allColumns.filter(
                (column) => !excludeColumnIds.includes(column.id as string)
            )
        }

        return allColumns
    }, [excludeColumnIds])

    const { resolvedColumnOrder, resolvedColumnVisibility, finalKeys } =
        useResolvedColumnOrder({
            columns,
            persistKey: [...persistKey, mode, entryType],
        })

    const tableState = useDataTableState<IGeneralLedger>({
        key: finalKeys,
        defaultColumnVisibility: resolvedColumnVisibility,
        defaultColumnOrder: resolvedColumnOrder,
        onSelectData,
    })

    const {
        isPending,
        isRefetching,
        data = [],
        refetch,
    } = useGetAllGeneralLedger({
        mode,
        entryType,
        accountId,
        transactionId,
        memberProfileId,
        userOrganizationId,
        transactionBatchId,
        query: {
            ...pagination,
            sort: sortingStateBase64,
        },
    })

    const table = useReactTable({
        columns,
        data,
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
        manualSorting: true,
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
    })

    return (
        <TableRowActionStoreProvider>
            <div
                className={cn(
                    'flex h-full flex-col gap-y-2',
                    className,
                    !tableState.isScrollable && 'h-fit max-h-none!'
                )}
            >
                <DataTableToolbar
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
            </div>
            <GeneralLedgerRunningTableActionManager />
        </TableRowActionStoreProvider>
    )
}

export default GeneralLedgerAllTable
