import { Table } from '@tanstack/react-table'

import DataTable from '@/components/data-table'
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'
import DataTablePagination from '@/components/data-table/data-table-pagination'

import {
    accountingLedgerGlobalSearchTargets,
    IAccountingLedgerTableColumnProps,
} from './columns'

import { cn } from '@/lib'
import FilterContext, {
    IFilterState,
} from '@/contexts/filter-context/filter-context'

import {
    IAccountingLedgerRequest,
    IAccountingLedgerResource,
    IAccountingLedgerPaginatedResource,
} from '@/server/types/accounts/accounting-ledger'
import { TableProps } from '../../types'
import { RefetchOptions, QueryObserverResult } from '@tanstack/react-query'

export interface IAccountingLedgerRequestTableProps
    extends Omit<TableProps<IAccountingLedgerRequest>, 'onSelectData'>,
        IAccountingLedgerTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IAccountingLedgerRequest>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
    table: Table<IAccountingLedgerResource>
    isScrollable: boolean
    isPending: boolean
    isRefetching: boolean
    totalSize: number
    refetch: (
        options?: RefetchOptions
    ) => Promise<
        QueryObserverResult<IAccountingLedgerPaginatedResource, string>
    >
    filterState: IFilterState<unknown, string, unknown>
    setColumnOrder: React.Dispatch<React.SetStateAction<string[]>>
    setIsScrollable: React.Dispatch<React.SetStateAction<boolean>>
}

const AccountsLedgerTable = ({
    className,
    toolbarProps,
    table,
    isScrollable,
    isPending,
    isRefetching,
    totalSize,
    refetch,
    filterState,
    setColumnOrder,
    setIsScrollable,
}: IAccountingLedgerRequestTableProps) => {
    return (
        <FilterContext.Provider value={filterState}>
            <div
                className={cn(
                    'flex h-full w-full flex-col gap-y-2',
                    className,
                    !isScrollable && 'h-fit !max-h-none'
                )}
            >
                <DataTableToolbar
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: accountingLedgerGlobalSearchTargets,
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
                    isScrollable={isScrollable}
                    setColumnOrder={setColumnOrder}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default AccountsLedgerTable
