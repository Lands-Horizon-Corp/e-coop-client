import { useMemo } from 'react'
import {
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from '@tanstack/react-table'

import DataTable from '@/components/data-table'
import DataTablePagination from '@/components/data-table/data-table-pagination'
import DataTableToolbar, {
    IDataTableToolbarProps,
} from '@/components/data-table/data-table-toolbar'

import FeedbackColumns, {
    FeedbackGlobalSearchTargets,
    IFeedbackTableColumnProps,
} from './column'

import { TableProps } from '@/types'
import { IFeedback } from '@/types'

import { cn } from '@/lib'
import { usePagination } from '@/hooks/use-pagination'
import useDatableFilterState from '@/hooks/use-filter-state'
import FeedbackService from '@/api-service/feedback-service'
import FilterContext from '@/contexts/filter-context/filter-context'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'

const data: IFeedback[] = [
    {
        id: '0194b533-6840-7cad-87d9-1421e172b38f',
        email: 'user1@example.com',
        description: 'Great service, very satisfied.',
        feedbackType: 'positive',
        createdAt: '2025-01-01T10:00:00Z',
        updatedAt: '2025-01-01T10:00:00Z',
    },
    {
        id: '0194b533-6840-758a-b225-9ac464541fdd',
        email: 'user2@example.com',
        description: 'Had some issues with the checkout process.',
        feedbackType: 'negative',
        createdAt: '2025-01-02T14:30:00Z',
        updatedAt: '2025-01-02T14:30:00Z',
    },
    {
        id: '0194b533-6840-7fb5-adc1-06e6d8e9a9a5',
        email: 'user3@example.com',
        description: 'Can we have more payment options?',
        feedbackType: 'neutral',
        createdAt: '2025-01-03T09:15:00Z',
        updatedAt: '2025-01-03T09:15:00Z',
    },
    {
        id: '0194b533-6841-7739-82e8-86afe14c64bc',
        email: 'user4@example.com',
        description: 'Loved the user interface. Very intuitive!',
        feedbackType: 'positive',
        createdAt: '2025-01-04T18:45:00Z',
        updatedAt: '2025-01-04T18:45:00Z',
    },
    {
        id: '0194b533-6841-7081-8361-17d57341424d',
        email: 'user5@example.com',
        description: 'The app is crashing frequently. Please fix.',
        feedbackType: 'negative',
        createdAt: '2025-01-05T11:20:00Z',
        updatedAt: '2025-01-05T11:20:00Z',
    },
]

export interface FeedbackTableProps
    extends TableProps<IFeedback>,
        IFeedbackTableColumnProps {
    toolbarProps?: Omit<
        IDataTableToolbarProps<IFeedback>,
        | 'table'
        | 'refreshActionProps'
        | 'globalSearchProps'
        | 'scrollableProps'
        | 'filterLogicProps'
        | 'exportActionProps'
        | 'deleteActionProps'
    >
}

const FeedBackTable = ({
    actionComponent,
    onSelectData,
    defaultFilter,
    className,
    toolbarProps,
}: FeedbackTableProps) => {
    const { pagination, setPagination } = usePagination()
    const { tableSorting, setTableSorting } = useDataTableSorting()

    const columns = useMemo(
        () =>
            FeedbackColumns({
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
        rowSelectionState,
        createHandleRowSelectionChange,
        columnVisibility,
        setColumnVisibility,
    } = useDataTableState<IFeedback>({
        defaultColumnOrder: columns.map((c) => c.id!),
        onSelectData,
    })

    const filterState = useDatableFilterState({
        defaultFilter,
        onFilterChange: () => setPagination({ ...pagination, pageIndex: 0 }),
    })

    const handleRowSelectionChange = createHandleRowSelectionChange(data)

    const table = useReactTable({
        columns,
        data: data,
        initialState: {
            columnPinning: { left: ['select'] },
        },
        state: {
            pagination,
            columnOrder,
            columnVisibility,
            sorting: tableSorting,
            rowSelection: rowSelectionState.rowSelection,
        },
        rowCount: 50,
        pageCount: 1,
        manualSorting: true,
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
            <div className={cn('flex h-full flex-col gap-y-2', className)}>
                <DataTableToolbar
                    hideCreateButton
                    globalSearchProps={{
                        defaultMode: 'equal',
                        targets: FeedbackGlobalSearchTargets,
                    }}
                    table={table}
                    refreshActionProps={{
                        onClick: () => {},
                        isLoading: false,
                    }}
                    scrollableProps={{ isScrollable, setIsScrollable }}
                    exportActionProps={{
                        pagination,
                        isLoading: false,
                        filters: filterState.finalFilterPayload,
                        disabled: false,
                        exportAll: FeedbackService.exportAll,
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
                    isScrollable={isScrollable}
                    setColumnOrder={setColumnOrder}
                    className="mb-2"
                />
                <DataTablePagination table={table} totalSize={5} />
            </div>
        </FilterContext.Provider>
    )
}

export default FeedBackTable
