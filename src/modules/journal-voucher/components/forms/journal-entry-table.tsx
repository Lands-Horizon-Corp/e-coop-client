import { useEffect, useState } from 'react'

import { cn } from '@/helpers'
import { ICurrency } from '@/modules/currency'
import { IJournalVoucherEntryRequest } from '@/modules/journal-voucher-entry'
import { IMemberProfile } from '@/modules/member-profile'
import { useJournalVoucherStore } from '@/store/journal-voucher-store'
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

const columns: ColumnDef<IJournalVoucherEntryRequest>[] = [
    {
        accessorKey: 'account',
        header: 'Account',
        minSize: 200,
        size: 350,
        cell: (props) => {
            return (
                <EditableCell
                    inputProps={{
                        currency: props.table.options.meta?.defaultCurrency,
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
        minSize: 200,
        size: 200,
        cell: (props) => (
            <EditableCell
                inputProps={{
                    currency: props.row.original.account?.currency,
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
        minSize: 200,
        size: 200,
        cell: (props) => (
            <EditableCell
                inputProps={{
                    currency: props.row.original.account?.currency,
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
type JournalEntryTableProps = {
    defaultMemberProfile?: IMemberProfile
    journalVoucherId: TEntityId
    rowData?: IJournalVoucherEntryRequest[]
    className?: string
    currency?: ICurrency
    TableClassName?: string
    transactionBatchId?: TEntityId
    mode: 'readOnly' | 'update' | 'create'
}

declare module '@tanstack/react-table' {
    interface TableMeta<TData> {
        updateData: <TValue>(
            rowIndex: number,
            columnId: keyof TData,
            value: TValue
        ) => void
        handleDeleteRow: (row: Row<TData>) => void
        defaultCurrency?: ICurrency
    }
}

export const JournalEntryTable = ({
    rowData,
    className,
    currency,
    TableClassName,
    defaultMemberProfile,
    transactionBatchId,
    mode,
}: JournalEntryTableProps) => {
    const isUpdateMode = mode === 'update'
    const isReadOnlyMode = mode === 'readOnly'
    const [journalVoucherEntry, setJournalVoucherEntry] = useState<
        IJournalVoucherEntryRequest[]
    >(() => {
        if (rowData && rowData.length > 0 && (isUpdateMode || isReadOnlyMode)) {
            return rowData
        }
        return []
    })

    const { setSelectedJournalVoucherEntry, setJournalVoucherEntriesDeleted } =
        useJournalVoucherStore()

    useEffect(() => {
        if (isUpdateMode || isReadOnlyMode) {
            setSelectedJournalVoucherEntry(journalVoucherEntry)
        }
    }, [
        isUpdateMode,
        isReadOnlyMode,
        journalVoucherEntry,
        setSelectedJournalVoucherEntry,
    ])

    const handleDeleteRow = (row: Row<IJournalVoucherEntryRequest>) => {
        const id = row.original.id
        const rowId = row.original.rowId
        if (isUpdateMode) {
            const validation = entityIdSchema.safeParse(id)
            if (validation.success) {
                setJournalVoucherEntriesDeleted(id as TEntityId)
                const updatedData = journalVoucherEntry.filter(
                    (data) => data.id !== id
                )
                setJournalVoucherEntry(updatedData)
            } else {
                const updatedData = journalVoucherEntry.filter(
                    (data) => data.rowId !== rowId
                )
                setJournalVoucherEntry(updatedData)
            }
        }
    }
    const table = useReactTable<IJournalVoucherEntryRequest>({
        data: journalVoucherEntry,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            defaultCurrency: currency,
            updateData: (rowIndex, columnId, value) => {
                const updatedEntries = (journalVoucherEntry ?? []).map(
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
                setJournalVoucherEntry(updatedEntries)
            },
            handleDeleteRow: handleDeleteRow,
        },
    })

    const handleAddRow = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        const newRow: IJournalVoucherEntryRequest = {
            debit: 0,
            credit: 0,
            rowId: crypto.randomUUID(),
            cash_check_voucher_number: '',
            member_profile_id: defaultMemberProfile?.id,
            member_profile: defaultMemberProfile,
            transaction_batch_id: transactionBatchId ?? undefined,
        }
        setJournalVoucherEntry([...journalVoucherEntry, newRow])
    }

    useHotkeys(
        'Shift+i',
        (e) => {
            e.preventDefault()
            if (isReadOnlyMode) return
            handleAddRow(
                e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>
            )
        },
        [journalVoucherEntry]
    )

    return (
        <div className={cn('', className)}>
            <div className="w-full flex justify-between">
                <h1 className="text-lg font-semibold">Journal Entries</h1>
                <div className="flex py-2 items-center space-x-2">
                    <Button
                        aria-label="Add new suggested payment"
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
            {/* Increased max-height for better vertical space management */}
            <Table
                wrapperClassName={cn(
                    'max-h-[400px] ecoop-scroll',
                    TableClassName
                )}
            >
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
