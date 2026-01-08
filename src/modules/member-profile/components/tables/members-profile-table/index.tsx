import { useMemo } from 'react'

import { keepPreviousData } from '@tanstack/react-query'
import qs from 'query-string'
import { toast } from 'sonner'

import FilterContext from '@/contexts/filter-context/filter-context'
import { cn } from '@/helpers'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'
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
import { TableRowActionStoreProvider } from '@/components/data-table/store/data-table-action-store'
import { TableProps } from '@/components/data-table/table.type'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState, {
    useResolvedColumnOrder,
} from '@/components/data-table/use-datatable-state'
import { ScanQrIcon } from '@/components/icons'
import { QrCodeScannerModal } from '@/components/qrcode-scanner'
import { Button } from '@/components/ui/button'

import useDatableFilterState from '@/hooks/use-filter-state'
import { useModalState } from '@/hooks/use-modal-state'
import { usePagination } from '@/hooks/use-pagination'

import {
    IMemberProfile,
    // deleteManyMemberProfiles,
    useGetPaginatedMemberProfiles,
} from '../../..'
import membersColumns, {
    IMemberProfilesTableColumnProps,
    memberGlobalSearchTargets,
} from './columns'
import MemberProfileAction, {
    MemberProfileRowContext,
    MemberProfileTableActionManager,
} from './row-action-context'

// import { MemberProfileRowContext } from './row-action-context'

export interface MemberProfileTableProps
    extends TableProps<IMemberProfile>,
        IMemberProfilesTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IMemberProfile>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

const MemberProfileTable = ({
    persistKey = ['member-profile'],
    className,
    toolbarProps,
    defaultFilter,
    onRowClick,
    onDoubleClick = (row) => {
        row.toggleSelected()
    },
    onSelectData,
    actionComponent = MemberProfileAction,
    RowContextComponent = MemberProfileRowContext,
}: MemberProfileTableProps) => {
    // const queryClient = useQueryClient()
    const { pagination, setPagination } = usePagination()
    const { sortingStateBase64, tableSorting, setTableSorting } =
        useDataTableSorting()

    const columns = useMemo(
        () =>
            membersColumns({
                actionComponent,
            }),
        [actionComponent]
    )

    const { resolvedColumnOrder, resolvedColumnVisibility, finalKeys } =
        useResolvedColumnOrder({
            columns,
            persistKey,
        })

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
    } = useDataTableState<IMemberProfile>({
        key: finalKeys,
        defaultColumnVisibility: {
            isEmailVerified: false,
            isContactVerified: false,
            ...resolvedColumnVisibility,
        },
        defaultColumnOrder: resolvedColumnOrder,
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
    } = useGetPaginatedMemberProfiles({
        query: {
            ...pagination,
            sort: sortingStateBase64,
            filter: filterState.finalFilterPayloadBase64,
        },
        options: {
            placeholderData: keepPreviousData,
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
            pagination,
            columnOrder,
            rowSelection: rowSelectionState.rowSelection,
            columnVisibility,
        },
        rowCount: pageSize,
        manualSorting: true,
        pageCount: totalPage,
        getRowId: getRowIdFn,
        manualFiltering: true,
        enableMultiSort: false,
        manualPagination: true,
        columnResizeMode: 'onChange',
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        onColumnOrderChange: setColumnOrder,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: handleRowSelectionChange,
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
        <TableRowActionStoreProvider<IMemberProfile>>
            <FilterContext.Provider value={filterState}>
                <div
                    className={cn(
                        'flex h-full flex-col gap-y-2',
                        className,
                        !isScrollable && 'h-fit !max-h-none'
                    )}
                >
                    <DataTableToolbar
                        // deleteActionProps={{
                        //     onDeleteSuccess: () =>
                        //         queryClient.invalidateQueries({
                        //             queryKey: ['member-profile', 'paginated'],
                        //         }),
                        //     onDelete: (selectedData) =>
                        //         deleteManyMemberProfiles({
                        //             ids: selectedData.map((data) => data.id),
                        //         }),
                        // }}
                        exportActionProps={{
                            isLoading: isPending,
                            filters: exportfilter,
                            model: 'MemberProfile',
                            url: 'api/v1/member-profile/search',
                        }}
                        filterLogicProps={{
                            filterLogic: filterState.filterLogic,
                            setFilterLogic: filterState.setFilterLogic,
                        }}
                        globalSearchProps={{
                            defaultMode: 'contains',
                            targets: memberGlobalSearchTargets,
                        }}
                        refreshActionProps={{
                            onClick: () => refetch(),
                            isLoading: isPending || isRefetching,
                        }}
                        scrollableProps={{ isScrollable, setIsScrollable }}
                        table={table}
                        {...toolbarProps}
                        otherActionLeft={
                            <MemberQRScannerSearch
                                onFound={(data) => {
                                    if (data.type !== 'member-qr') {
                                        return toast.error(
                                            'Invalid QR. Please use a valid Member Profile QR'
                                        )
                                    }
                                    filterState.setFilter('full_name', {
                                        dataType: 'text',
                                        displayText: 'Full Name',
                                        mode: 'contains',
                                        value: data.data.full_name,
                                    })
                                }}
                            />
                        }
                    />
                    <DataTable
                        className={cn('mb-2', isScrollable && 'flex-1')}
                        isScrollable={isScrollable}
                        isStickyFooter
                        isStickyHeader
                        onDoubleClick={onDoubleClick}
                        onRowClick={onRowClick}
                        RowContextComponent={RowContextComponent}
                        setColumnOrder={setColumnOrder}
                        table={table}
                    />
                    <DataTablePagination table={table} totalSize={totalSize} />
                </div>
                <MemberProfileTableActionManager />
            </FilterContext.Provider>
        </TableRowActionStoreProvider>
    )
}

const MemberQRScannerSearch = ({
    onFound,
}: {
    onFound: (QRDecoded: IQRMemberProfileDecodedResult) => void
}) => {
    const modalState = useModalState()

    return (
        <>
            <Button
                className=""
                onClick={() => modalState.onOpenChange(true)}
                size="icon-sm"
            >
                <ScanQrIcon />
            </Button>
            <QrCodeScannerModal<IQRMemberProfileDecodedResult, Error>
                {...modalState}
                qrScannerProps={{
                    onSuccessDecode: onFound,
                }}
            />
        </>
    )
}

export default MemberProfileTable
