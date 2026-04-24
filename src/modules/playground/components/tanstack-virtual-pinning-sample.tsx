import { useEffect, useMemo, useRef, useState } from 'react'

import {
    Column,
    ColumnDef,
    ColumnPinningState,
    RowSelectionState,
    ColumnSizingState,
    flexRender,
    getCoreRowModel,
    OnChangeFn,
    useReactTable,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'

import { Checkbox } from '@/components/ui/checkbox'
import {
    ContextMenu,
    ContextMenuContent,
    ContextMenuItem,
    ContextMenuLabel,
    ContextMenuSeparator,
    ContextMenuTrigger,
} from '@/components/ui/context-menu'

type RowItem = {
    id: number
    accountCode: string
    memberName: string
    branch: string
    product: string
    status: 'Active' | 'Dormant' | 'Closed'
    balance: number
    txnCount: number
    dueDate: string
    createdAt: string
}

const firstNames = [
    'Ari',
    'Nina',
    'Ken',
    'Mila',
    'Liam',
    'Noel',
    'Iris',
    'Hana',
    'Zed',
    'Theo',
]

const lastNames = [
    'Santos',
    'Reyes',
    'Mendoza',
    'Lim',
    'Garcia',
    'Ramos',
    'Dy',
    'Tan',
    'Cruz',
    'Dizon',
]

const branches = ['Main', 'North', 'South', 'East', 'West']
const products = ['Savings', 'Loan', 'Time Deposit', 'Insurance', 'Share Cap']
const statuses: Array<RowItem['status']> = ['Active', 'Dormant', 'Closed']

function pad2(value: number) {
    return String(value).padStart(2, '0')
}

function mockRows(count: number): RowItem[] {
    return Array.from({ length: count }, (_, index) => {
        const id = index + 1
        const first = firstNames[index % firstNames.length]
        const last = lastNames[(index * 3) % lastNames.length]
        const year = 2024 + (index % 3)
        const month = (index % 12) + 1
        const day = ((index * 7) % 28) + 1

        return {
            id,
            accountCode: `ACCT-${pad2((index % 97) + 1)}-${1000 + index}`,
            memberName: `${first} ${last}`,
            branch: branches[index % branches.length],
            product: products[index % products.length],
            status: statuses[index % statuses.length],
            balance: Number(((index * 113.79) % 250000).toFixed(2)),
            txnCount: (index * 5) % 120,
            dueDate: `${year}-${pad2(month)}-${pad2(day)}`,
            createdAt: `${year - 1}-${pad2(((month + 4) % 12) + 1)}-${pad2(
                ((day + 8) % 28) + 1
            )}`,
        }
    })
}

function getPinStyles<TData>(column: Column<TData>) {
    const pinPosition = column.getIsPinned()

    if (!pinPosition) {
        return {
            left: undefined,
            right: undefined,
            position: 'relative' as const,
            zIndex: 0,
            boxShadow: undefined,
        }
    }

    const isLastLeftPinnedColumn =
        pinPosition === 'left' && column.getIsLastColumn('left')
    const isFirstRightPinnedColumn =
        pinPosition === 'right' && column.getIsFirstColumn('right')

    return {
        left: pinPosition === 'left' ? `${column.getStart('left')}px` : undefined,
        right:
            pinPosition === 'right' ? `${column.getAfter('right')}px` : undefined,
        position: 'sticky' as const,
        zIndex: 2,
        boxShadow: isLastLeftPinnedColumn
            ? '2px 0 0 0 rgb(226 232 240) inset'
            : isFirstRightPinnedColumn
              ? '-2px 0 0 0 rgb(226 232 240) inset'
              : undefined,
    }
}

export default function TanstackVirtualPinningSample() {
    const data = useMemo(() => mockRows(500), [])
    const tableContainerRef = useRef<HTMLDivElement>(null)
    const isFirefox =
        typeof navigator !== 'undefined' && /firefox/i.test(navigator.userAgent)
    const [containerWidth, setContainerWidth] = useState(0)
    const [columnSizing, setColumnSizing] = useState<ColumnSizingState>({})
    const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
    const [lastRowAction, setLastRowAction] = useState('No row action yet')
    const isAutoSizingRef = useRef(false)

    const [columnPinning, setColumnPinning] = useState<ColumnPinningState>({
        left: ['id', 'accountCode'],
        right: ['createdAt'],
    })

    const columns = useMemo<ColumnDef<RowItem>[]>(
        () => [
            {
                accessorKey: 'id',
                minSize: 120,
                size: 160,
                header: ({ table }) => (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            aria-label="Select all rows"
                            checked={
                                table.getIsAllRowsSelected() ||
                                (table.getIsSomeRowsSelected()
                                    ? 'indeterminate'
                                    : false)
                            }
                            onCheckedChange={(checked) =>
                                table.toggleAllRowsSelected(!!checked)
                            }
                        />
                        <span>ID</span>
                    </div>
                ),
                cell: ({ row, getValue }) => (
                    <div className="flex items-center gap-2">
                        <Checkbox
                            aria-label={`Select row ${row.id}`}
                            checked={row.getIsSelected()}
                            onCheckedChange={(checked) =>
                                row.toggleSelected(!!checked)
                            }
                        />
                        <span>{getValue<number>()}</span>
                    </div>
                ),
            },
            {
                accessorKey: 'accountCode',
                header: 'Account Code',
                minSize: 140,
                size: 180,
            },
            {
                accessorKey: 'memberName',
                header: 'Member Name',
                minSize: 160,
                size: 220,
            },
            { accessorKey: 'branch', header: 'Branch', minSize: 120, size: 150 },
            {
                accessorKey: 'product',
                header: 'Product',
                minSize: 130,
                size: 170,
            },
            { accessorKey: 'status', header: 'Status', minSize: 120, size: 140 },
            {
                accessorKey: 'balance',
                header: 'Balance',
                minSize: 140,
                size: 160,
                cell: (info) => info.getValue<number>().toLocaleString(),
            },
            {
                accessorKey: 'txnCount',
                header: 'Txn Count',
                minSize: 110,
                size: 130,
            },
            { accessorKey: 'dueDate', header: 'Due Date', minSize: 130, size: 150 },
            {
                accessorKey: 'createdAt',
                header: 'Created At',
                minSize: 140,
                size: 180,
            },
        ],
        []
    )

    const handleColumnSizingChange: OnChangeFn<ColumnSizingState> = (updater) => {
        setColumnSizing((previousSizing) => {
            const nextSizing =
                typeof updater === 'function'
                    ? updater(previousSizing)
                    : updater

            return nextSizing
        })
        isAutoSizingRef.current = false
    }

    const table = useReactTable({
        data,
        columns,
        state: { columnPinning, columnSizing, rowSelection },
        getRowId: (row) => String(row.id),
        onColumnPinningChange: setColumnPinning,
        onColumnSizingChange: handleColumnSizingChange,
        onRowSelectionChange: setRowSelection,
        columnResizeMode: 'onChange',
        enableColumnResizing: true,
        enableRowSelection: true,
        getCoreRowModel: getCoreRowModel(),
    })

    useEffect(() => {
        const container = tableContainerRef.current

        if (!container) return

        const observer = new ResizeObserver((entries) => {
            const nextWidth = Math.floor(entries[0].contentRect.width)
            setContainerWidth((previousWidth) =>
                previousWidth === nextWidth ? previousWidth : nextWidth
            )
        })

        observer.observe(container)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!containerWidth) return

        const leafColumns = table.getVisibleLeafColumns()

        if (!leafColumns.length) return

        const currentTotalWidth = leafColumns.reduce(
            (total, col) => total + col.getSize(),
            0
        )

        if (currentTotalWidth >= containerWidth) return

        const extraWidth = containerWidth - currentTotalWidth
        const evenExtra = Math.floor(extraWidth / leafColumns.length)
        const remainder = extraWidth % leafColumns.length

        const nextSizing = leafColumns.reduce<ColumnSizingState>(
            (sizing, col, index) => {
                const target =
                    col.getSize() + evenExtra + (index < remainder ? 1 : 0)
                sizing[col.id] = target
                return sizing
            },
            {}
        )

        const unchanged = leafColumns.every((col) => col.getSize() === nextSizing[col.id])

        if (unchanged) return

        isAutoSizingRef.current = true
        setColumnSizing(nextSizing)
    }, [columnSizing, containerWidth, table])

    const rows = table.getRowModel().rows

    const rowVirtualizer = useVirtualizer<HTMLDivElement, HTMLTableRowElement>({
        count: rows.length,
        estimateSize: () => 44,
        getScrollElement: () => tableContainerRef.current,
        measureElement: (element) => {
            if (!element) return 44

            // Firefox can report inconsistent table-row metrics via getBoundingClientRect.
            // scrollHeight gives a stable dynamic height for variable cell content.
            if (isFirefox) {
                return element.scrollHeight
            }

            return element.getBoundingClientRect().height
        },
        overscan: 8,
    })

    return (
        <section className="space-y-4 rounded-xl border border-border/70 bg-card p-4 text-card-foreground shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
                <button
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
                    onClick={() =>
                        setColumnPinning({
                            left: ['id', 'accountCode'],
                            right: ['createdAt'],
                        })
                    }
                    type="button"
                >
                    Reset Pinning
                </button>
                <button
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
                    onClick={() => setColumnPinning({ left: [], right: [] })}
                    type="button"
                >
                    Unpin All
                </button>
                <button
                    className="rounded-md border border-border bg-background px-3 py-1.5 text-sm hover:bg-muted"
                    onClick={() => setColumnSizing({})}
                    type="button"
                >
                    Stretch Columns
                </button>
                <p className="text-sm text-muted-foreground">
                    Rows: {rows.length} | Cols: {table.getVisibleLeafColumns().length} |
                    Selected: {table.getSelectedRowModel().rows.length}
                </p>
                <p className="text-sm text-muted-foreground">{lastRowAction}</p>
            </div>

            <div
                className="overflow-auto rounded-lg ecoop-scroll border border-border"
                ref={tableContainerRef}
                style={{ height: '560px', position: 'relative' }}
            >
                <table
                    style={{
                        display: 'grid',
                        width: Math.max(table.getTotalSize(), containerWidth),
                    }}
                >
                    <thead
                        className="bg-muted/50"
                        style={{
                            display: 'grid',
                            position: 'sticky',
                            top: 0,
                            zIndex: 3,
                        }}
                    >
                        {table.getHeaderGroups().map((headerGroup) => (
                            <tr
                                className="border-b border-border"
                                key={headerGroup.id}
                                style={{ display: 'flex', width: '100%' }}
                            >
                                {headerGroup.headers.map((header) => {
                                    const pinStyles = getPinStyles(header.column)
                                    return (
                                        <th
                                            key={header.id}
                                            style={{
                                                display: 'flex',
                                                width: header.getSize(),
                                                minWidth: header.getSize(),
                                                maxWidth: header.getSize(),
                                                background: 'hsl(var(--muted))',
                                                ...pinStyles,
                                            }}
                                        >
                                            <div className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide">
                                                <span>
                                                    {header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                              header.column
                                                                  .columnDef
                                                                  .header,
                                                              header.getContext()
                                                          )}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <button
                                                        className="rounded border border-border px-1 text-[10px]"
                                                        onClick={() =>
                                                            header.column.pin(
                                                                'left'
                                                            )
                                                        }
                                                        type="button"
                                                    >
                                                        L
                                                    </button>
                                                    <button
                                                        className="rounded border border-border px-1 text-[10px]"
                                                        onClick={() =>
                                                            header.column.pin(
                                                                false
                                                            )
                                                        }
                                                        type="button"
                                                    >
                                                        C
                                                    </button>
                                                    <button
                                                        className="rounded border border-border px-1 text-[10px]"
                                                        onClick={() =>
                                                            header.column.pin(
                                                                'right'
                                                            )
                                                        }
                                                        type="button"
                                                    >
                                                        R
                                                    </button>
                                                </span>
                                            </div>
                                            <div
                                                className="absolute right-0 top-0 h-full w-1 cursor-col-resize select-none bg-transparent hover:bg-border/70"
                                                onMouseDown={header.getResizeHandler()}
                                                onTouchStart={header.getResizeHandler()}
                                            />
                                        </th>
                                    )
                                })}
                            </tr>
                        ))}
                    </thead>

                    <tbody
                        style={{
                            display: 'grid',
                            height: `${rowVirtualizer.getTotalSize()}px`,
                            position: 'relative',
                        }}
                    >
                        {rowVirtualizer.getVirtualItems().map((virtualRow) => {
                            const row = rows[virtualRow.index]

                            return (
                                <ContextMenu key={row.id}>
                                    <ContextMenuTrigger asChild>
                                        <tr
                                            className="border-b border-border/70 odd:bg-background even:bg-muted/20 data-[selected=true]:bg-primary/10"
                                            data-index={virtualRow.index}
                                            data-selected={row.getIsSelected()}
                                            ref={(node) => rowVirtualizer.measureElement(node)}
                                            style={{
                                                display: 'flex',
                                                position: 'absolute',
                                                transform: `translateY(${virtualRow.start}px)`,
                                                width: '100%',
                                            }}
                                        >
                                            {row.getVisibleCells().map((cell) => {
                                                const pinStyles = getPinStyles(
                                                    cell.column
                                                )

                                                return (
                                                    <td
                                                        className="px-3 py-2 text-sm"
                                                        key={cell.id}
                                                        style={{
                                                            display: 'flex',
                                                            width: cell.column.getSize(),
                                                            minWidth:
                                                                cell.column.getSize(),
                                                            maxWidth:
                                                                cell.column.getSize(),
                                                            background:
                                                                cell.column.getIsPinned()
                                                                    ? 'hsl(var(--background))'
                                                                    : undefined,
                                                            ...pinStyles,
                                                        }}
                                                    >
                                                        {flexRender(
                                                            cell.column
                                                                .columnDef.cell,
                                                            cell.getContext()
                                                        )}
                                                    </td>
                                                )
                                            })}
                                        </tr>
                                    </ContextMenuTrigger>
                                    <ContextMenuContent className="w-56">
                                        <ContextMenuLabel>
                                            Row #{row.original.id}
                                        </ContextMenuLabel>
                                        <ContextMenuSeparator />
                                        <ContextMenuItem
                                            onSelect={() => {
                                                row.toggleSelected(true)
                                                setLastRowAction(
                                                    `Selected row ${row.original.id}`
                                                )
                                            }}
                                        >
                                            Select row
                                        </ContextMenuItem>
                                        <ContextMenuItem
                                            onSelect={() => {
                                                row.toggleSelected(false)
                                                setLastRowAction(
                                                    `Unselected row ${row.original.id}`
                                                )
                                            }}
                                        >
                                            Unselect row
                                        </ContextMenuItem>
                                        <ContextMenuItem
                                            onSelect={async () => {
                                                const text = `ID:${row.original.id} | ${row.original.memberName}`
                                                try {
                                                    await navigator.clipboard.writeText(
                                                        text
                                                    )
                                                    setLastRowAction(
                                                        `Copied: ${text}`
                                                    )
                                                } catch {
                                                    setLastRowAction(
                                                        `Copy failed for row ${row.original.id}`
                                                    )
                                                }
                                            }}
                                        >
                                            Copy row identity
                                        </ContextMenuItem>
                                        <ContextMenuSeparator />
                                        <ContextMenuItem
                                            onSelect={() => {
                                                alert(
                                                    `Row ${row.original.id}\n${row.original.memberName}\n${row.original.accountCode}`
                                                )
                                            }}
                                        >
                                            Quick inspect
                                        </ContextMenuItem>
                                    </ContextMenuContent>
                                </ContextMenu>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
