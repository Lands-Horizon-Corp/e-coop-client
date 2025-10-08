import { useEffect, useState } from 'react'

import { cn } from '@/helpers'
import { ICashCheckVoucherEntryRequest } from '@/modules/cash-check-voucher-entry'
import { IMemberProfile } from '@/modules/member-profile'
import { useCashCheckVoucherStore } from '@/store/cash-check-voucher-store'
import { entityIdSchema } from '@/validation'
import {
    ColumnDef,
    Row,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

import { PlusIcon, TrashIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import { EditableCell } from '@/components/ui/editable-columns'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { TEntityId } from '@/types'

const columns: ColumnDef<ICashCheckVoucherEntryRequest>[] = [
    {
        accessorKey: 'account',
        header: 'Account',
        minSize: 200,
        size: 350,
        cell: (props) => {
            return (
                <EditableCell
                    inputProps={{
                        className: '!w-full !min-w-0 flex-1',
                    }}
                    inputType="account-picker"
                    {...props}
                />
            )
        },
    },
    {
        accessorKey: 'member_profile',
        header: 'Member',
        minSize: 200,
        size: 350,
        cell: (props) => {
            return (
                <EditableCell
                    inputProps={{
                        className: '!w-full !min-w-0 flex-1',
                    }}
                    inputType="member-picker"
                    {...props}
                />
            )
        },
    },
    {
        accessorKey: 'cash_check_voucher_number',
        header: 'CV Number',
        minSize: 120,
        size: 150,
        cell: (props) => (
            <EditableCell
                inputProps={{
                    className: '!w-full !min-w-0',
                }}
                inputType="text"
                {...props}
            />
        ),
    },
    {
        accessorKey: 'debit',
        header: 'Debit',
        minSize: 100,
        size: 120,
        cell: (props) => (
            <EditableCell
                inputProps={{
                    className: '!w-full !min-w-0',
                }}
                inputType="number"
                {...props}
            />
        ),
    },
    {
        accessorKey: 'credit',
        header: 'Credit',
        minSize: 100,
        size: 120,
        cell: (props) => (
            <EditableCell
                inputProps={{
                    className: '!w-full !min-w-0',
                }}
                inputType="number"
                {...props}
            />
        ),
    },
    {
        accessorKey: 'action',
        header: 'Action',
        cell: (row) => (
            <Button
                className="w-full hover:bg-primary/10 !p-0 text-destructive"
                onClick={(e) => {
                    e.preventDefault()
                    row.table.options.meta?.handleDeleteRow(row.row)
                }}
                size="icon"
                variant="ghost"
            >
                <TrashIcon />
            </Button>
        ),
        enableSorting: false,
        enableColumnFilter: false,
        size: 50,
    },
]

type CashCheckJournalEntryTableProps = {
    defaultMemberProfile?: IMemberProfile
    cashCheckVoucherId: TEntityId
    isUpdateMode?: boolean
    rowData?: ICashCheckVoucherEntryRequest[]
    className?: string
    TableClassName?: string
}

export const CashCheckJournalEntryTable = ({
    defaultMemberProfile,
    isUpdateMode = false,
    rowData,
    className,
    TableClassName,
}: CashCheckJournalEntryTableProps) => {
    const [cashCheckVoucherEntry, setCashCheckVoucherEntry] = useState<
        ICashCheckVoucherEntryRequest[]
    >(() => {
        if (rowData && rowData.length > 0 && isUpdateMode) {
            return rowData
        }
        return []
    })
    const {
        setCashCheckVoucherEntriesDeleted,
        setSelectedCashCheckVoucherEntry,
    } = useCashCheckVoucherStore()

    useEffect(() => {
        if (isUpdateMode) {
            setSelectedCashCheckVoucherEntry(cashCheckVoucherEntry)
        }
    }, [isUpdateMode, cashCheckVoucherEntry, setSelectedCashCheckVoucherEntry])

    const handleDeleteRow = (row: Row<ICashCheckVoucherEntryRequest>) => {
        const id = row.original.id
        const rowId = row.original.rowId
        if (isUpdateMode) {
            const validation = entityIdSchema.safeParse(id)
            if (validation.success) {
                setCashCheckVoucherEntriesDeleted(id as TEntityId)
                const updatedData = cashCheckVoucherEntry.filter(
                    (data) => data.id !== id
                )
                setCashCheckVoucherEntry(updatedData)
            } else {
                const updatedData = cashCheckVoucherEntry.filter(
                    (data) => data.rowId !== rowId
                )
                setCashCheckVoucherEntry(updatedData)
            }
        }
    }

    const table = useReactTable({
        data: cashCheckVoucherEntry,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                const updatedEntries = (cashCheckVoucherEntry ?? []).map(
                    (entry, index) => {
                        if (index === rowIndex) {
                            const updatedEntry = { ...entry, [columnId]: value }
                            if (columnId === 'debit') {
                                updatedEntry.credit = 0
                            } else if (columnId === 'credit') {
                                updatedEntry.debit = 0
                            }
                            return updatedEntry
                        }
                        return entry
                    }
                )
                setCashCheckVoucherEntry(updatedEntries)
            },
            handleDeleteRow: handleDeleteRow,
        },
    })
    const handleAddRow = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        const newRow: ICashCheckVoucherEntryRequest = {
            account_id: '',
            description: '',
            debit: 0,
            credit: 0,
            rowId: crypto.randomUUID(),
            member_profile_id: defaultMemberProfile?.id,
            member_profile: defaultMemberProfile,
        }
        setCashCheckVoucherEntry([...cashCheckVoucherEntry, newRow])
    }

    useHotkeys(
        'Shift+i',
        (e) => {
            e.preventDefault()
            handleAddRow(
                e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>
            )
        },
        [cashCheckVoucherEntry]
    )

    return (
        <div className={cn('', className)}>
            <div className="w-full flex justify-between">
                <h1 className="text-lg font-semibold">Cash Check Entries</h1>
                <div className="flex py-2 items-center space-x-2">
                    <Button
                        aria-label="Add new cash check entry"
                        className="size-fit px-2 py-0.5 text-xs"
                        onClick={(e) => handleAddRow(e)}
                        size="sm"
                        tabIndex={0}
                        type="button"
                    >
                        Add <PlusIcon className="inline" />
                    </Button>
                    <CommandShortcut className="bg-accent min-w-fit p-1 px-2 text-primary rounded-sm mr-1">
                        Shift + I
                    </CommandShortcut>
                </div>
            </div>
            <Table wrapperClassName={cn('max-h-[400px]', TableClassName)}>
                <TableHeader className={cn('sticky top-0 z-10')}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            className={cn('h-fit hover:bg-background')}
                            key={headerGroup.id}
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    className={cn(
                                        'h-10 bg-sidebar',
                                        'first:!rounded-tl-2xl',
                                        'last:!rounded-tr-2xl'
                                    )}
                                    colSpan={header.colSpan}
                                    key={header.id}
                                    style={{ width: header.getSize() }}
                                >
                                    {!header.isPlaceholder &&
                                        flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                </TableHead>
                            ))}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {table.getRowModel().rows.map((row) => (
                        <TableRow
                            className={cn(
                                'hover:bg-background !border-b-[0.5px] border-b-primary/20'
                            )}
                            key={row.id}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell className="!p-1" key={cell.id}>
                                    {flexRender(
                                        cell.column.columnDef.cell,
                                        cell.getContext()
                                    )}
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    )
}
