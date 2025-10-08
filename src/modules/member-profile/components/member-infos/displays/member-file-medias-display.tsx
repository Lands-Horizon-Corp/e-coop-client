import { useMemo } from 'react'

import { cn } from '@/helpers'
import { downloadFile, formatBytes } from '@/helpers/common-helper'
import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IMedia } from '@/modules/media'
import { useUserMedias } from '@/modules/user'
import {
    ColumnDef,
    getCoreRowModel,
    getSortedRowModel,
    useReactTable,
} from '@tanstack/react-table'

import CopyTextButton from '@/components/copy-text-button'
import DataTable from '@/components/data-table'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'
import { useDataTableSorting } from '@/components/data-table/use-datatable-sorting'
import useDataTableState from '@/components/data-table/use-datatable-state'
import { DownloadIcon, FolderFillIcon, WarningIcon } from '@/components/icons'
import MediaResourceFileIcon from '@/components/icons/media-resource-file-icon'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import FormErrorMessage from '@/components/ui/form-error-message'

import { usePagination } from '@/hooks/use-pagination'

import { IClassProps, TEntityId } from '@/types'

import SectionTitle from '../section-title'

const FileMediaColumns = (): ColumnDef<IMedia>[] => {
    return [
        {
            id: 'id',
            accessorKey: 'id',
            header: (props) => (
                <DataTableColumnHeader {...props} title="ID">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { id },
                },
            }) => {
                return (
                    <div className="mx-auto flex items-center gap-x-2">
                        <p className="text-sm">{id}</p>
                        <CopyTextButton
                            className="shrink-0"
                            successText="Copied media ID"
                            textContent={id}
                        />
                    </div>
                )
            },
            enableSorting: true,
            enableHiding: false,
            enableResizing: true,
            enableMultiSort: false,
            size: 180,
            minSize: 120,
            maxSize: 300,
        },
        {
            id: 'file_name',
            accessorKey: 'file_name',
            header: (props) => (
                <DataTableColumnHeader {...props} title="File Name">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { file_name },
                },
            }) => (
                <div className="mx-auto">
                    <p>{file_name}</p>
                </div>
            ),
            enableMultiSort: false,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            minSize: 80,
            maxSize: 500,
        },
        {
            id: 'file_type',
            accessorKey: 'file_type',
            header: (props) => (
                <DataTableColumnHeader {...props} title="File Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({ row: { original } }) => {
                return (
                    <div className="mx-auto flex items-center">
                        <MediaResourceFileIcon
                            className="shrink-0"
                            media={original}
                        />
                        <p className="text-sm">{original.file_type}</p>
                    </div>
                )
            },
            enableMultiSort: false,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            size: 150,
            maxSize: 200,
            minSize: 100,
        },
        {
            id: 'file_size',
            accessorKey: 'file_size',
            header: (props) => (
                <DataTableColumnHeader {...props} title="File Size">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { file_size },
                },
            }) => (
                <div className="mx-auto">
                    <p>{formatBytes(file_size)}</p>
                </div>
            ),
            enableMultiSort: false,
            enableSorting: true,
            enableResizing: true,
            enableHiding: false,
            minSize: 80,
            maxSize: 200,
        },
        {
            id: 'created_at',
            accessorKey: 'created_at',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}></ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { created_at },
                },
            }) => <div>{toReadableDate(created_at)}</div>,
            enableMultiSort: false,
            enableResizing: true,
            minSize: 100,
        },
        {
            id: 'download',
            accessorKey: 'download_url',
            header: (props) => (
                <DataTableColumnHeader {...props} title="">
                    {/* <ColumnActions {...props}></ColumnActions> */}
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { download_url, file_name },
                },
            }) => {
                const handleDownload = () =>
                    downloadFile(download_url, file_name)

                return (
                    <div>
                        <Button
                            className="gap-x-2"
                            onClick={() => handleDownload()}
                            size="sm"
                            variant="ghost"
                        >
                            Download <DownloadIcon />
                        </Button>
                    </div>
                )
            },
            enableResizing: false,
            enableMultiSort: false,
            maxSize: 120,
        },
    ]
}

interface Props extends IClassProps {
    userId?: TEntityId
}

const FilesTableView = ({
    files,
    className,
}: { files: IMedia[] } & IClassProps) => {
    const { pagination, setPagination } = usePagination()
    const { tableSorting, setTableSorting } = useDataTableSorting()

    const columns = useMemo(() => FileMediaColumns(), [])

    const {
        getRowIdFn,
        columnOrder,
        setColumnOrder,
        isScrollable,
        columnVisibility,
        setColumnVisibility,
        rowSelectionState,
    } = useDataTableState<IMedia>({
        defaultColumnVisibility: {
            isEmailVerified: false,
            isContactVerified: false,
        },
        defaultColumnOrder: columns.map((c) => c.id!),
        // onSelectData,
    })

    // const handleRowSelectionChange = createHandleRowSelectionChange(data)

    const table = useReactTable({
        columns,
        data: files,
        initialState: {
            columnPinning: { left: ['mediaId'] },
        },
        state: {
            sorting: tableSorting,
            pagination,
            columnOrder,
            rowSelection: rowSelectionState.rowSelection,
            columnVisibility,
        },
        getRowId: getRowIdFn,
        enableMultiSort: true,
        columnResizeMode: 'onChange',
        onSortingChange: setTableSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        onColumnOrderChange: setColumnOrder,
        getSortedRowModel: getSortedRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        // onRowSelectionChange: handleRowSelectionChange,
    })

    return (
        <div
            className={cn(
                'relative flex h-full flex-col gap-y-2 py-4',
                className,
                !isScrollable && 'h-fit !max-h-none'
            )}
        >
            <DataTable
                className={cn('mb-2', isScrollable && 'flex-1')}
                isScrollable={isScrollable}
                isStickyFooter
                isStickyHeader
                setColumnOrder={setColumnOrder}
                table={table}
            />
        </div>
    )
}

const MemberFileMediaDisplay = ({ userId, className }: Props) => {
    const {
        data,
        isPending,
        error: rawError,
    } = useUserMedias({
        userId: userId as unknown as TEntityId,
        options: {
            enabled: !!userId,
        },
    })

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <div className={cn('min-h-[50vh] space-y-4', className)}>
            <div className="flex justify-between">
                <SectionTitle
                    Icon={FolderFillIcon}
                    subTitle="View all medias/files this user has"
                    title="Member Medias"
                />
                <p className="text-sm text-muted-foreground/80">
                    {(data ?? []).length} Files
                </p>
            </div>
            {!data && error && (
                <FormErrorMessage
                    className="w-fit mx-auto text-xs"
                    errorMessage={error}
                />
            )}
            {isPending && userId && <LoadingSpinner className="mx-auto" />}
            {data && <FilesTableView className="!p-0" files={data ?? []} />}
            {!userId && (
                <div className="mx-auto max-w-md items-center gap-3 space-y-4 rounded-lg text-sm text-muted-foreground">
                    <WarningIcon className="mx-auto size-4" />
                    <p className="text-center">
                        We are unable to locate files since this member profile
                        has no User Account.
                    </p>
                </div>
            )}
        </div>
    )
}

export default MemberFileMediaDisplay
