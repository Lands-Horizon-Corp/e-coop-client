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

import { useFilteredPaginatedMemberAccountingLedger } from '@/hooks/api-hooks/member/use-member-accounting-ledger'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { IMemberAccountingLedger, TEntityId } from '@/types'
import { TableProps } from '@/types'

import MemberAccountingLedgerTableColumns, {
    IMemberAccountingLedgerTableColumnProps,
    memberGeneralLedgerGlobalSearchTargets,
} from './columns'

export interface MemberAccountingLedgerTableProps
    extends TableProps<IMemberAccountingLedger>,
        IMemberAccountingLedgerTableColumnProps {
    memberProfileId: TEntityId
    toolbarProps?: Omit<
        IDataTableToolbarProps<IMemberAccountingLedger>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

const MemberAccountingLedgerTable = ({
    className,
    toolbarProps,
    defaultFilter,
    memberProfileId,
    onRowClick,
    onSelectData,
    actionComponent,
}: MemberAccountingLedgerTableProps) => {
    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            MemberAccountingLedgerTableColumns({
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
    } = useDataTableState<IMemberAccountingLedger>({
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
    } = useFilteredPaginatedMemberAccountingLedger({
        memberProfileId,
        pagination,
        sort: sortingState,
        filterPayload: filterState.finalFilterPayload,
        // TODO: Remove this shit
        initialData: {
            data: [
                {
                    id: 'ledger-1',
                    member_profile_id: '3f4406ae-fa7e-41a9-b890-0003f034b38b',
                    account_id: 'e22b14de-7f5d-40cf-b5a3-dadbb92922bc',
                    account: {
                        name: 'e22b14de-7f5d-40cf-b5a3-dadbb92922bc',
                        alternative_code: 'CH-ACT-SVNG',
                    },
                    count: 5,
                    balance: 1500.75,
                    interest: 25.5,
                    fines: 0,
                    due: 200,
                    carried_forward_due: 50,
                    stored_value_facility: 300,
                    principal_due: 100,
                    last_pay: '2025-06-01T10:00:00Z',
                    hold_out: 'N/A',
                },
                {
                    id: 'ledger-2',
                    member_profile_id: '3f4406ae-fa7e-41a9-b890-0003f034b38b',
                    account_id: 'e22b14de-7f5d-40cf-b5a3-dadbb92922bc',
                    account: {
                        id: 'e22b14de-7f5d-40cf-b5a3-dadbb92922bc',
                        // ...other IAccount properties
                    },
                    count: 2,
                    balance: 500.0,
                    interest: 10.0,
                    fines: 5,
                    due: 50,
                    carried_forward_due: 0,
                    stored_value_facility: 0,
                    principal_due: 50,
                    last_pay: '2025-06-10T14:30:00Z',
                    // hold_out omitted
                },
            ],
            pageIndex: 1,
            totalPage: 1,
            pageSize: 10,
            totalSize: 2,
            pages: [],
        } as any,
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
                        targets: memberGeneralLedgerGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => refetch(),
                        isLoading: isPending || isRefetching,
                    }}
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
                    rowClassName="cursor-pointer"
                    onRowClick={onRowClick}
                    isScrollable={isScrollable}
                    setColumnOrder={setColumnOrder}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default MemberAccountingLedgerTable
