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

import { useFilteredPaginatedMemberAccountGeneralLedger } from '@/hooks/api-hooks/use-general-ledger'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import useDatableFilterState from '@/hooks/use-filter-state'
import { usePagination } from '@/hooks/use-pagination'

import { IGeneralLedger, TEntityId, TableProps } from '@/types'

import MemberAccountGeneralLedgerTableColumns, {
    IMemberAccountGeneralLedgerTableColumnProps,
    generalLedgerGlobalSearchTargets,
} from './columns'

export interface MemberAccountGeneralLedgerTableProps
    extends TableProps<IGeneralLedger>,
        IMemberAccountGeneralLedgerTableColumnProps {
    memberProfileId: TEntityId
    accountId: TEntityId
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
}

const MemberAccountGeneralLedgerTable = ({
    className,
    accountId,
    toolbarProps,
    defaultFilter,
    memberProfileId,
    onRowClick = () => {},
    onSelectData,
    actionComponent,
}: MemberAccountGeneralLedgerTableProps) => {
    const { pagination, setPagination } = usePagination()
    const { sortingState, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            MemberAccountGeneralLedgerTableColumns({
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
        defaultColumnVisibility: { select: false },
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
    } = useFilteredPaginatedMemberAccountGeneralLedger({
        accountId,
        memberProfileId,
        pagination,
        sort: sortingState,
        filterPayload: filterState.finalFilterPayload,
        // TODO: Remove mock
        // initialData: {
        //     data: [
        //         {
        //             id: 'gl-1',
        //             account_id: 'account-1',
        //             transaction_id: 'txn-1',
        //             transaction_batch_id: 'batch-1',
        //             employee_user_id: 'emp-1',
        //             employee_user: {
        //                 id: 'emp-1',
        //                 name: 'Alice Employee',
        //             },
        //             member_profile_id: 'member-1',
        //             member_profile: {
        //                 id: 'member-1',
        //                 name: 'John Doe',
        //             },
        //             member_joint_account_id: 'joint-1',
        //             member_joint_account: {
        //                 id: 'joint-1',
        //                 name: 'Doe Family Joint Account',
        //             },
        //             transaction_reference_number: 'TRN-10001',
        //             reference_number: 'REF-10001',
        //             payment_type_id: 'paytype-1',
        //             source: 'deposit',
        //             journal_voucher_id: 'jv-1',
        //             adjustment_entry_id: 'adj-1',
        //             type_of_payment_type: 'types_of_payment_type',
        //             credit: 500,
        //             debit: 0,
        //             balance: 500,
        //         },
        //         {
        //             id: 'gl-2',
        //             account_id: 'account-1',
        //             transaction_id: 'txn-2',
        //             transaction_batch_id: 'batch-2',
        //             employee_user_id: 'emp-2',
        //             employee_user: {
        //                 id: 'emp-2',
        //                 name: 'Bob Employee',
        //             },
        //             member_profile_id: 'member-1',
        //             member_profile: {
        //                 id: 'member-1',
        //                 name: 'John Doe',
        //             },
        //             member_joint_account_id: 'joint-2',
        //             member_joint_account: {
        //                 id: 'joint-2',
        //                 name: 'Doe & Smith Joint',
        //             },
        //             transaction_reference_number: 'TRN-10002',
        //             reference_number: 'REF-10002',
        //             payment_type_id: 'paytype-2',
        //             source: 'adjustment' as TGeneralLedgerSource, // TGeneralLedgerSource
        //             journal_voucher_id: 'jv-2',
        //             adjustment_entry_id: 'adj-2',
        //             type_of_payment_type: 'types_of_payment_type',
        //             credit: 0,
        //             debit: 200,
        //             balance: 300,
        //         },
        //     ],
        //     pageIndex: 1,
        //     totalPage: 1,
        //     pageSize: 10,
        //     totalSize: 2,
        // } as any,
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
                    onRowClick={onRowClick}
                    isScrollable={isScrollable}
                    setColumnOrder={setColumnOrder}
                />
                <DataTablePagination table={table} totalSize={totalSize} />
            </div>
        </FilterContext.Provider>
    )
}

export default MemberAccountGeneralLedgerTable
