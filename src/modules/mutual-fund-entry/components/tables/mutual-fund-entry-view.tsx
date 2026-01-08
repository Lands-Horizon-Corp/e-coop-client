import { RefObject, useEffect, useMemo, useRef, useState } from 'react'

import Fuse from 'fuse.js'

import { formatNumber } from '@/helpers/number-utils'
import { cn } from '@/helpers/tw-utils'
import { currencyFormat } from '@/modules/currency'
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

import { MagnifyingGlassIcon, RenderIcon, TIcon } from '@/components/icons'
import ImageDisplay from '@/components/image-display'
import { Input } from '@/components/ui/input'
import { TableCell, TableRow } from '@/components/ui/table'

import { IClassProps } from '@/types'

import { IMutualFundEntry } from '../../mutual-fund-entry.types'

interface Props extends IClassProps {
    entries: IMutualFundEntry[]
    total_amount?: number
}

export const generateMockMutualFundEntries = (
    count: number
): IMutualFundEntry[] => {
    const firstNames = [
        'JULIET',
        'ASUNCION',
        'PURIFICACION',
        'MATILDE',
        'LOURDES',
        'RODRIGO',
        'ELEANOR',
        'MARTINA',
        'FLORENCIO',
        'LORNA',
        'ANITA',
        'PEDRITA',
        'SAMUEL',
        'ESTEFANIA',
        'PACITA',
        'SANTIAGO',
        'TERESITA',
        'JUANITO',
    ]
    const lastNames = [
        'APUSEM',
        'BANGCOD',
        'LABADOR',
        'BATALLANG',
        'GAO-AY',
        'MUTONG',
        'SUMABAT',
        'BANGAOIL',
        'ARZABAL',
        'INCIONG',
        'RUBANG',
        'VALENCIA',
        'LIYO',
        'RAQUEPO',
        'LIGAYO',
        'NGASEO',
        'TUCAY',
        'SALLONG',
        'FELINO',
    ]
    const mutualFundNames = [
        'Growth Fund',
        'Balanced Fund',
        'Income Fund',
        'Index Fund',
        'Bond Fund',
        'Money Market Fund',
        'Equity Fund',
        'Dividend Fund',
    ]

    return Array.from({ length: count }, (_, i) => {
        const firstName =
            firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const amount = Math.random() * 50000 + 1000

        return {
            id: `${i + 1}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            account_id: `${300 + (i % 50)}`,
            member_profile_id: `${1000000 + i}`,
            mutual_fund_id: `${1 + (i % 8)}`,
            amount,
            member_profile: {
                id: `${1000000 + i}`,
                passbook: `${String(i + 5).padStart(7, '0')}`,
                full_name: `${lastName}, ${firstName}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            account: {
                id: `${300 + (i % 50)}`,
                name: `Account ${300 + (i % 50)}`,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
            mutual_fund: {
                id: `${1 + (i % 8)}`,
                name: mutualFundNames[i % mutualFundNames.length],
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString(),
            },
        } as IMutualFundEntry
    })
}

const SearchInput = ({ onSearch }: { onSearch: (value: string) => void }) => {
    const [value, setValue] = useState('')

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(value)
        }, 300) // 300ms debounce

        return () => clearTimeout(timeoutId)
    }, [value, onSearch])

    return (
        <div className="relative w-full max-w-sm">
            <Input
                className="pr-9"
                onChange={(e) => setValue(e.target.value)}
                placeholder="Search by passbook number..."
                type="text"
                value={value}
            />
            <MagnifyingGlassIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
    )
}

interface TableBodyProps {
    table: Table<IMutualFundEntry>
    tableContainerRef: RefObject<HTMLDivElement | null>
}

function TableBody({ table, tableContainerRef }: TableBodyProps) {
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
                const row = rows[virtualRow.index] as Row<IMutualFundEntry>
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

interface TableBodyRowProps {
    row: Row<IMutualFundEntry>
    virtualRow: VirtualItem
    rowVirtualizer: Virtualizer<HTMLDivElement, HTMLTableRowElement>
}

function TableBodyRow({ row, virtualRow, rowVirtualizer }: TableBodyRowProps) {
    // Calculate total size for proportional widths
    const totalSize = row
        .getAllCells()
        .reduce((sum, cell) => sum + cell.column.getSize(), 0)

    return (
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
                const isRightAlign = ['amount'].includes(cell.column.id)
                return (
                    <TableCell
                        className={cn(
                            'p-3.5 align-middle flex items-center',
                            isRightAlign && 'text-right font-mono justify-end',
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
    )
}

const MutualFundEntryView = ({
    entries,
    total_amount = 0,
    className,
}: Props) => {
    const tableContainerRef = useRef<HTMLDivElement>(null)
    const [searchQuery, setSearchQuery] = useState('')

    // Configure Fuse.js for fuzzy search on passbook
    const fuse = useMemo(
        () =>
            new Fuse(entries, {
                keys: ['member_profile.passbook'],
                threshold: 0.3,
                includeScore: true,
            }),
        [entries]
    )

    // Filter entries based on search query
    const filteredEntries = useMemo(() => {
        if (!searchQuery.trim()) {
            return entries
        }

        const results = fuse.search(searchQuery)
        return results.map((result) => result.item)
    }, [entries, fuse, searchQuery])

    const columns = useMemo<ColumnDef<IMutualFundEntry>[]>(
        () => [
            {
                accessorKey: 'member_profile.passbook',
                id: 'member_profile.passbook',
                header: () => <p className="w-full">PB No</p>,
                cell: (info) =>
                    info.row.original.member_profile?.passbook || 'N/A',
                size: 100,
            },
            {
                accessorKey: 'member_profile.full_name',
                header: () => <p className="w-full">Member Name</p>,
                cell: (info) => (
                    <div className="flex items-center gap-1 min-w-0">
                        <div className="flex-shrink-0">
                            <ImageDisplay
                                src={
                                    info.row.original.member_profile?.media
                                        ?.download_url
                                }
                            />
                        </div>
                        <span className="truncate">
                            {info.row.original.member_profile?.full_name ||
                                'N/A'}
                        </span>
                    </div>
                ),
                size: 280,
            },
            {
                accessorKey: 'account.name',
                id: 'account.name',
                header: () => <p className="w-full">Account</p>,
                cell: (info) => (
                    <div className="flex items-center gap-1 min-w-0">
                        <RenderIcon
                            className="flex-shrink-0"
                            icon={info.row.original.account?.icon as TIcon}
                        />
                        <span className="truncate">
                            {info.row.original.account?.name || 'N/A'}
                        </span>
                    </div>
                ),
                size: 150,
            },
            {
                accessorKey: 'amount',
                header: () => <p className="w-full text-right">Amount</p>,
                cell: (info) => {
                    const currency = info.row.original.account?.currency
                    return currencyFormat((info.getValue() as number) || 0, {
                        currency,
                        showSymbol: !!currency,
                    })
                },
                size: 150,
            },
        ],
        []
    )

    const table = useReactTable({
        data: filteredEntries,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    const totalSize = table
        .getAllColumns()
        .reduce((sum, col) => sum + col.getSize(), 0)

    return (
        <div
            className={cn(
                'rounded-lg h-full flex flex-col overflow-hidden',
                className
            )}
        >
            <div className="flex items-center justify-between gap-4 px-4 py-3 rounded-t bg-muted/50">
                <SearchInput onSearch={setSearchQuery} />
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                        {formatNumber(entries.length)} entr
                        {entries.length > 1 ? 'ies' : 'y'}
                    </span>
                    <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary/10 border border-primary/70">
                        <span className="text-sm font-medium text-muted-foreground">
                            Total Amount:
                        </span>
                        <span className="text-sm font-semibold text-primary">
                            {currencyFormat(total_amount)}
                        </span>
                    </div>
                </div>
            </div>

            <div
                className="flex-1 overflow-auto rounded-b-xl ecoop-scroll relative"
                ref={tableContainerRef}
            >
                <table style={{ width: '100%' }}>
                    <thead
                        style={{
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
                    {filteredEntries.length === 0 ? (
                        <tbody>
                            <tr className="border-b w-full transition-colors hover:bg-muted/50">
                                <td
                                    className="h-24 text-center p-4 align-middle"
                                    colSpan={columns.length}
                                >
                                    <p>
                                        {searchQuery
                                            ? 'No matching entries found'
                                            : 'No entries found'}
                                    </p>
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
    )
}

export default MutualFundEntryView
