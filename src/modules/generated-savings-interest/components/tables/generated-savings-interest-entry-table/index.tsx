import { ReactNode, RefObject, useEffect, useMemo, useRef } from 'react'

import { formatNumber } from '@/helpers/number-utils'
import { cn } from '@/helpers/tw-utils'
import { IGeneratedSavingsInterestEntry } from '@/modules/generated-savings-interest-entry'
import { GeneratedSavingsInterestEntryCreateUpdateFormModal } from '@/modules/generated-savings-interest-entry/components/forms/generated-savings-interest-entry-create-update-form'
import {
    type ColumnDef,
    Row,
    Table,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import {
    VirtualItem,
    Virtualizer,
    useVirtualizer,
} from '@tanstack/react-virtual'
import { Plus } from 'lucide-react'

import { TableRowActionStoreProvider } from '@/components/data-table/store/data-table-action-store'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { TableCell, TableRow } from '@/components/ui/table'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, TEntityId } from '@/types'

import { useGetAllGeneratedSavingsInterestEntry } from '../../../generated-savings-interest.service'
import {
    GeneratedSavingsInterestEntryAction,
    GeneratedSavingsInterestEntryRowContext,
    GeneratedSavingsInterestEntryTableActionManager,
} from './row-action-context'

export interface IGeneratedSavingsInterestEntryTableActionComponentProp {
    row: Row<IGeneratedSavingsInterestEntry>
}

interface Props extends IClassProps {
    generatedSavingsInterestId: TEntityId
    actionComponent?: (
        props: IGeneratedSavingsInterestEntryTableActionComponentProp
    ) => ReactNode
}

interface TableBodyProps {
    table: Table<IGeneratedSavingsInterestEntry>
    tableContainerRef: RefObject<HTMLDivElement | null>
}

interface TableBodyRowProps {
    row: Row<IGeneratedSavingsInterestEntry>
    virtualRow: VirtualItem
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
}

const TableBody = ({ table, tableContainerRef }: TableBodyProps) => {
    const { rows } = table.getRowModel()

    const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
        count: rows.length,
        estimateSize: () => 45,
        getScrollElement: () => tableContainerRef.current,
        measureElement:
            typeof window !== 'undefined' &&
            navigator.userAgent.indexOf('Firefox') === -1
                ? (element) => element?.getBoundingClientRect().height
                : undefined,
        overscan: 10,
    })

    useEffect(() => {
        if (tableContainerRef.current) {
            rowVirtualizer.measure()
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tableContainerRef.current, rowVirtualizer])

    return (
        <tbody
            style={{
                display: 'grid',
                height: `${rowVirtualizer.getTotalSize()}px`,
                position: 'relative',
            }}
        >
            {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[
                    virtualRow.index
                ] as Row<IGeneratedSavingsInterestEntry>
                return (
                    <TableBodyRow
                        key={row.id}
                        row={row}
                        rowVirtualizer={rowVirtualizer}
                        virtualRow={virtualRow}
                    />
                )
            })}
        </tbody>
    )
}

const TableBodyRow = ({ row, virtualRow, rowVirtualizer }: TableBodyRowProps) => {
    // Calculate total size for proportional widths
    const totalSize = row
        .getAllCells()
        .reduce((sum, cell) => sum + cell.column.getSize(), 0)

    return (
        <GeneratedSavingsInterestEntryRowContext row={row}>
            <TableRow
                className="flex border-b-border/40 transition-colors hover:bg-muted/50"
                data-index={virtualRow.index}
                key={row.id}
                ref={(node) => rowVirtualizer.measureElement(node)}
                style={{
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`,
                    width: '100%',
                }}
            >
                {row.getVisibleCells().map((cell) => {
                    const isRightAlign = [
                        'ending_balance',
                        'interest_amount',
                        'interest_tax',
                        'net_interest',
                    ].includes(cell.column.id)
                    return (
                        <TableCell
                            className={cn(
                                'p-3.5 align-middle flex items-center',
                                isRightAlign &&
                                    'text-right font-mono justify-end',
                                cell.column.id === 'net_interest' &&
                                    'font-medium',
                                cell.column.id === 'member_profile.passbook' &&
                                    'font-medium'
                            )}
                            key={cell.id}
                            style={{
                                width: `${(cell.column.getSize() / totalSize) * 100}%`,
                            }}
                        >
                            {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                            )}
                        </TableCell>
                    )
                })}
            </TableRow>
        </GeneratedSavingsInterestEntryRowContext>
    )
}

interface CreateEntryButtonProps {
    generatedSavingsInterestId: TEntityId
}

const CreateEntryButton = ({
    generatedSavingsInterestId,
}: CreateEntryButtonProps) => {
    const modalState = useModalState()

    return (
        <>
            <Button onClick={() => modalState.onOpenChange(true)} size="sm">
                <Plus className="mr-2 size-4" />
                Add
            </Button>

            <GeneratedSavingsInterestEntryCreateUpdateFormModal
                formProps={{
                    defaultValues: {
                        id: generatedSavingsInterestId,
                    },
                    onSuccess: () => {
                        modalState.onOpenChange(false)
                    },
                }}
                {...modalState}
            />
        </>
    )
}

export const GeneratedSavingsInterestEntryTable = ({
    generatedSavingsInterestId,
    className,
    actionComponent = GeneratedSavingsInterestEntryAction,
}: Props) => {
    const tableContainerRef = useRef<HTMLDivElement>(null)

    // Fetch entries using the hook from service
    const { data: entries = [], isLoading } =
        useGetAllGeneratedSavingsInterestEntry({
            generatedSavingsInterestId,
        })

    const columns = useMemo<ColumnDef<IGeneratedSavingsInterestEntry>[]>(
        () => [
            {
                accessorKey: 'member_profile.passbook',
                header: 'PB No',
                cell: (info) =>
                    info.row.original.member_profile?.passbook || 'N/A',
                size: 100,
            },
            {
                accessorKey: 'member_profile.full_name',
                header: 'Member Name',
                cell: (info) =>
                    info.row.original.member_profile?.full_name || 'N/A',
                size: 130,
            },
            {
                accessorKey: 'account.name',
                header: 'Account',
                cell: (info) => info.row.original.account?.name || 'N/A',
                size: 150,
            },
            {
                accessorKey: 'ending_balance',
                header: 'Ending Balance',
                cell: (info) => formatNumber(info.getValue() as number, 2, 2),
                size: 150,
            },
            {
                accessorKey: 'interest_amount',
                header: 'Interest Amt',
                cell: (info) => formatNumber(info.getValue() as number, 2, 2),
                size: 130,
            },
            {
                accessorKey: 'interest_tax',
                header: 'Interest Tax',
                cell: (info) => formatNumber(info.getValue() as number, 2, 2),
                size: 130,
            },
            {
                id: 'net_interest',
                header: 'Net Interest',
                cell: (info) => {
                    const netInterest =
                        info.row.original.interest_amount -
                        info.row.original.interest_tax
                    return formatNumber(netInterest, 2, 2)
                },
                size: 140,
            },
            {
                id: 'actions',
                header: 'Actions',
                cell: ({ row }) => {
                    return actionComponent({ row })
                },
                size: 120,
            },
        ],
        [actionComponent]
    )

    const table = useReactTable({
        data: entries,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    // Calculate total size for proportional widths
    const totalSize = table
        .getAllColumns()
        .reduce((sum, col) => sum + col.getSize(), 0)

    return (
        <TableRowActionStoreProvider>
            <div
                className={cn(
                    'rounded-lg border h-full flex flex-col overflow-hidden',
                    className
                )}
            >
                {/* Header Section */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/50">
                    <h3 className="text-lg font-medium">Entries</h3>
                    <CreateEntryButton
                        generatedSavingsInterestId={generatedSavingsInterestId}
                    />
                </div>

                {/* Table Section */}
                <div
                    className="flex-1 overflow-auto ecoop-scroll relative"
                    ref={tableContainerRef}
                >
                    <table style={{ display: 'grid', width: '100%' }}>
                        <thead
                            style={{
                                display: 'grid',
                                position: 'sticky',
                                top: 0,
                                zIndex: 10,
                            }}
                        >
                            {table.getHeaderGroups().map((headerGroup) => (
                                <tr
                                    className="border-b hover:bg-transparent bg-secondary dark:bg-popover"
                                    key={headerGroup.id}
                                    style={{ display: 'flex', width: '100%' }}
                                >
                                    {headerGroup.headers.map((header) => (
                                        <th
                                            className="h-12 px-4 text-left align-middle font-medium text-muted-foreground whitespace-nowrap bg-secondary dark:bg-popover flex items-center"
                                            key={header.id}
                                            style={{
                                                width: `${(header.getSize() / totalSize) * 100}%`,
                                            }}
                                        >
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                      header.column.columnDef
                                                          .header,
                                                      header.getContext()
                                                  )}
                                        </th>
                                    ))}
                                </tr>
                            ))}
                        </thead>
                        {isLoading ? (
                            <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td
                                        className="h-24 text-center p-4 align-middle"
                                        colSpan={columns.length}
                                    >
                                        Loading entries...
                                    </td>
                                </tr>
                            </tbody>
                        ) : entries.length === 0 ? (
                            <tbody>
                                <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td
                                        className="h-24 text-center p-4 align-middle"
                                        colSpan={columns.length}
                                    >
                                        No entries found
                                    </td>
                                </tr>
                            </tbody>
                        ) : (
                            <TableBody
                                table={table}
                                tableContainerRef={tableContainerRef}
                            />
                        )}
                    </table>
                </div>
            </div>
            <GeneratedSavingsInterestEntryTableActionManager />
        </TableRowActionStoreProvider>
    )
}

export const GeneratedSavingsInterestEntryTableModal = ({
    title = 'Savings Interest Entries',
    description,
    className,
    tableProps,
    ...props
}: IModalProps & {
    tableProps: Omit<Props, 'className'>
}) => {
    const { data: entries = [] } = useGetAllGeneratedSavingsInterestEntry({
        generatedSavingsInterestId: tableProps.generatedSavingsInterestId,
    })

    const defaultDescription = `Showing ${formatNumber(entries.length)} savings interest entries. You can edit or delete entries from this view.`

    return (
        <Modal
            className={cn('!max-w-7xl', className)}
            description={description || defaultDescription}
            title={title}
            {...props}
        >
            <GeneratedSavingsInterestEntryTable
                className="h-[70vh]"
                {...tableProps}
            />
        </Modal>
    )
}

