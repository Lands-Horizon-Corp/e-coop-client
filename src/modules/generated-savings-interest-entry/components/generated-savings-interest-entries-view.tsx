import { RefObject, useEffect, useMemo, useRef } from 'react'

import { formatNumber } from '@/helpers/number-utils'
import { cn } from '@/helpers/tw-utils'
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

import { TableCell, TableRow } from '@/components/ui/table'

import { IClassProps } from '@/types'

import { IGeneratedSavingsInterestEntry } from '../generated-savings-interest-entry.types'

interface Props extends IClassProps {
    entries: IGeneratedSavingsInterestEntry[]
}

export const generateMockSavingsIntEntries = (
    count: number
): IGeneratedSavingsInterestEntry[] => {
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

    return Array.from({ length: count }, (_, i) => {
        const firstName =
            firstNames[Math.floor(Math.random() * firstNames.length)]
        const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
        const balance = Math.random() * 100000 + 1000
        const interestRate = 0.02 + Math.random() * 0.03

        return {
            id: `${i + 1}`,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            generated_savings_interest_id: '1',
            account_id: `${300 + (i % 50)}`,
            member_profile_id: `${1000000 + i}`,
            interest_amount: balance * interestRate,
            interest_tax: 0,
            ending_balance: balance,
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
        } as IGeneratedSavingsInterestEntry
    })
}

interface TableBodyProps {
    table: Table<IGeneratedSavingsInterestEntry>
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

interface TableBodyRowProps {
    row: Row<IGeneratedSavingsInterestEntry>
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
                            isRightAlign && 'text-right font-mono justify-end',
                            cell.column.id === 'net_interest' && 'font-medium',
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

const GeneratedSavingsInterestEntriesView = ({ entries, className }: Props) => {
    const tableContainerRef = useRef<HTMLDivElement>(null)

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
        ],
        []
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
        <div
            className={cn(
                'rounded-lg border h-full flex flex-col overflow-hidden',
                className
            )}
        >
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
                    {entries.length === 0 ? (
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
    )
}

export default GeneratedSavingsInterestEntriesView
