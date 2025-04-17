import {
    ColumnDef,
    useReactTable,
    getCoreRowModel,
    getSortedRowModel,
} from '@tanstack/react-table'
import { useMemo } from 'react'

import SectionTitle from '../section-title'
import DataTable from '@/components/data-table'
import { Button } from '@/components/ui/button'
import CopyTextButton from '@/components/copy-text-button'
import { DownloadIcon, FolderFillIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import MediaResourceFileIcon from '@/components/media-resource-file-icon'
import DataTableColumnHeader from '@/components/data-table/data-table-column-header'
import ColumnActions from '@/components/data-table/data-table-column-header/column-actions'

import { cn } from '@/lib'
import { toReadableDate } from '@/utils'
import { IClassProps } from '@/types'
import { IMediaResource, TEntityId } from '@/server'
import { downloadFile, formatBytes } from '@/helpers'
import { usePagination } from '@/hooks/use-pagination'
import { useMemberMedias } from '@/hooks/api-hooks/member/use-member'
import useDataTableState from '@/hooks/data-table-hooks/use-datatable-state'
import { useDataTableSorting } from '@/hooks/data-table-hooks/use-datatable-sorting'

interface Props extends IClassProps {
    memberId?: TEntityId
}

const FileMediaColumns = (): ColumnDef<IMediaResource>[] => {
    return [
        {
            id: 'mediaId',
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
                            textContent={id}
                            className="shrink-0"
                            successText="Copied media ID"
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
            id: 'Filename',
            accessorKey: 'fileName',
            header: (props) => (
                <DataTableColumnHeader {...props} title="File Name">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { fileName },
                },
            }) => (
                <div className="mx-auto">
                    <p>{fileName}</p>
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
            id: 'Filetype',
            accessorKey: 'fileType',
            header: (props) => (
                <DataTableColumnHeader {...props} title="File Type">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({ row: { original } }) => {
                return (
                    <div className="mx-auto flex items-center">
                        <MediaResourceFileIcon
                            media={original}
                            className="shrink-0"
                        />
                        <p className="text-sm">{original.fileType}</p>
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
            id: 'fileSize',
            accessorKey: 'fileSize',
            header: (props) => (
                <DataTableColumnHeader {...props} title="File Size">
                    <ColumnActions {...props} />
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { fileSize },
                },
            }) => (
                <div className="mx-auto">
                    <p>{formatBytes(fileSize)}</p>
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
            id: 'createdAt',
            accessorKey: 'createdAt',
            header: (props) => (
                <DataTableColumnHeader {...props} title="Date Created">
                    <ColumnActions {...props}></ColumnActions>
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { createdAt },
                },
            }) => <div>{toReadableDate(createdAt)}</div>,
            enableMultiSort: false,
            enableResizing: true,
            minSize: 100,
        },
        {
            id: 'download',
            accessorKey: 'downloadURL',
            header: (props) => (
                <DataTableColumnHeader {...props} title="">
                    {/* <ColumnActions {...props}></ColumnActions> */}
                </DataTableColumnHeader>
            ),
            cell: ({
                row: {
                    original: { downloadURL, fileName },
                },
            }) => {
                const handleDownload = () => downloadFile(downloadURL, fileName)

                return (
                    <div>
                        <Button
                            size="sm"
                            className="gap-x-2"
                            variant="ghost"
                            onClick={() => handleDownload()}
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

const FilesTableView = ({
    files,
    className,
}: { files: IMediaResource[] } & IClassProps) => {
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
    } = useDataTableState<IMediaResource>({
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
                table={table}
                isStickyHeader
                isStickyFooter
                isScrollable={isScrollable}
                setColumnOrder={setColumnOrder}
                className={cn('mb-2', isScrollable && 'flex-1')}
            />
        </div>
    )
}

const MemberFileMediaDisplay = ({ memberId, className }: Props) => {
    const { data, isPending, error } = useMemberMedias({
        memberId: memberId as unknown as TEntityId,
        enabled: !!memberId,
    })

    return (
        <div className={cn('min-h-[50vh] space-y-4', className)}>
            <div className="flex justify-between">
                <SectionTitle
                    title="Member Medias"
                    Icon={FolderFillIcon}
                    subTitle="View all medias/files this user has"
                />
                <p className="text-sm text-muted-foreground/80">
                    {(data ?? []).length} Files
                </p>
            </div>
            {!data && error && (
                <p className="text-center text-xs text-muted-foreground/70">
                    {error}
                </p>
            )}
            {isPending && <LoadingSpinner className="mx-auto" />}
            {data && <FilesTableView className="!p-0" files={data ?? []} />}
        </div>
    )
}

export default MemberFileMediaDisplay
