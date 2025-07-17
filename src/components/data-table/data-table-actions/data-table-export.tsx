import { useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'

import { TFilterPayload } from '@/contexts/filter-context'
import { serverRequestErrExtractor } from '@/helpers'
import { toBase64, withCatchAsync } from '@/utils'
import { PaginationState, Table } from '@tanstack/react-table'

import { CsvIcon, ExportIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

export interface IDataTableExportProps<TData> {
    table: Table<TData>
    disabled?: boolean
    isLoading?: boolean

    filters: TFilterPayload
    pagination: PaginationState

    exportAll?: () => Promise<void>
    exportSelected?: (rowsSelected: TData[]) => Promise<void>
    exportAllFiltered?: (base64Filter: string) => Promise<void>
    exportCurrentPage?: (rowsSelected: TData[]) => Promise<void>
}

const DataTableExport = <TData,>({
    table,
    filters,
    pagination,
    disabled = false,
    isLoading = false,
    exportAll,
    exportSelected,
    exportCurrentPage,
    exportAllFiltered,
}: IDataTableExportProps<TData>) => {
    const selectedData = table
        .getSelectedRowModel()
        .flatRows.map(({ original }) => original)

    const onSuccessToast = (message?: string) =>
        toast.success(message ?? 'Data has been exported successfully.')

    const onFailedToast = (message?: string) =>
        toast.error(message ?? 'Export Failed!')

    const { refetch: exportSelectedData, isFetching: isExportingSelected } =
        useQuery<boolean, string>({
            queryKey: ['export', selectedData],
            queryFn: async () => {
                if (!exportSelected) return false

                const [error] = await withCatchAsync(
                    exportSelected(selectedData)
                )

                if (error) {
                    const errorMessage = serverRequestErrExtractor({ error })
                    onFailedToast(errorMessage)
                    throw errorMessage
                }

                onSuccessToast()
                return true
            },
            enabled: false,
        })

    const {
        refetch: exportAllFilteredData,
        isFetching: isExportingAllFiltered,
    } = useQuery<void, string, TData[]>({
        queryKey: ['export', 'all-filtered', filters],
        queryFn: async () => {
            if (!exportAllFiltered) return

            const [error] = await withCatchAsync(
                exportAllFiltered?.(toBase64({ ...filters }))
            )

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onFailedToast(errorMessage)
                throw errorMessage
            }

            onSuccessToast()
        },
        enabled: false,
    })

    const { refetch: exportAllData, isFetching: isExportingAll } = useQuery<
        boolean,
        string
    >({
        queryKey: ['export', 'all'],
        queryFn: async () => {
            if (!exportAll) return false

            const [error] = await withCatchAsync(exportAll?.())

            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onFailedToast(errorMessage)
                throw new Error(errorMessage)
            }

            onSuccessToast()
            return true
        },
        enabled: false,
    })

    const {
        refetch: exportCurrentPageData,
        isFetching: isExportingCurrentPage,
    } = useQuery<boolean, string>({
        queryKey: ['export', 'currentPage', pagination],
        queryFn: async () => {
            if (!exportCurrentPage) return false
            const rows = table.getCoreRowModel().rows
            const originalData = rows.map((row) => row.original)
            const [error] = await withCatchAsync(
                exportCurrentPage(originalData)
            )
            if (error) {
                const errorMessage = serverRequestErrExtractor({ error })
                onFailedToast(errorMessage)
                throw new Error(errorMessage)
            }
            onSuccessToast()
            return true
        },
        enabled: false,
    })

    const forceDisabled = !(
        exportAll ||
        exportSelected ||
        exportCurrentPage ||
        exportAllFiltered
    )

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    size="sm"
                    variant={'secondary'}
                    disabled={disabled || isLoading || forceDisabled}
                    className="gap-x-1 rounded-md"
                >
                    <ExportIcon className="mr-1 size-4" />
                    {isLoading ? <LoadingSpinner /> : 'Export'}
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="min-w-44">
                <DropdownMenuGroup>
                    {selectedData.length > 0 && exportSelected && (
                        <DropdownMenuItem
                            disabled={
                                isExportingSelected || selectedData.length === 0
                            }
                            onClick={() => exportSelectedData()}
                        >
                            <CsvIcon className="mr-2 size-4 text-emerald-600" />
                            <span>Export Selected</span>
                        </DropdownMenuItem>
                    )}
                    {exportAllFiltered && (
                        <DropdownMenuItem
                            disabled={isExportingAllFiltered}
                            onClick={() => exportAllFilteredData()}
                        >
                            <CsvIcon className="mr-2 size-4 text-emerald-600" />
                            <span>Export All Filtered</span>
                            {/* No ID */}
                        </DropdownMenuItem>
                    )}
                    {exportAll && (
                        <DropdownMenuItem
                            disabled={isExportingAll}
                            onClick={() => exportAllData()}
                        >
                            <CsvIcon className="mr-2 size-4 text-emerald-600" />
                            <span>Export All</span>
                            {/* No ID, no filters */}
                        </DropdownMenuItem>
                    )}
                    {exportCurrentPage && (
                        <DropdownMenuItem
                            disabled={isExportingCurrentPage}
                            onClick={() => exportCurrentPageData()}
                        >
                            <CsvIcon className="mr-2 size-4 text-emerald-600" />
                            <span>Export Current Page</span>
                        </DropdownMenuItem>
                    )}
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DataTableExport
