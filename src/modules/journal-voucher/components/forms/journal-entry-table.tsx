import { useEffect, useState } from 'react'

import { cn } from '@/helpers'
import { IJournalVoucherEntryRequest } from '@/modules/journal-voucher-entry'
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
        accessorKey: 'account_id',
        header: 'Account',
        cell: (props) => <EditableCell inputType="account-picker" {...props} />,
    },
    {
        accessorKey: 'member_profile_id',
        header: 'Member',
        cell: (props) => <EditableCell inputType="member-picker" {...props} />,
    },
    {
        accessorKey: 'description',
        header: 'Description',
        cell: (props) => (
            <EditableCell
                className="min-w-[200px]"
                inputType="text"
                {...props}
            />
        ),
    },
    {
        accessorKey: 'cash_check_voucher_number',
        header: 'CV Number',
        cell: (props) => <EditableCell inputType="text" {...props} />,
    },
    {
        accessorKey: 'debit',
        header: 'Debit',
        cell: (props) => (
            <EditableCell
                className="min-w-[50px]"
                inputType="number"
                {...props}
            />
        ),
    },
    {
        accessorKey: 'credit',
        header: 'Credit',
        cell: (props) => (
            <EditableCell
                className="min-w-[50px]"
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
                variant="ghost"
                size="icon"
                className=" w-full hover:bg-primary/10 !p-0 text-destructive"
                onClick={(e) => {
                    e.preventDefault()
                    row.table.options.meta?.handleDeleteRow(row.row)
                }}
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
    defaultMemberProfileId?: TEntityId
    journalVoucherId: TEntityId
    isUpdateMode?: boolean
    rowData?: IJournalVoucherEntryRequest[]
    className?: string
    TableClassName?: string
}
export const JournalEntryTable = ({
    defaultMemberProfileId,
    isUpdateMode = false,
    rowData,
    className,
    TableClassName,
}: JournalEntryTableProps) => {
    const [journalEntries, setJournalEntries] = useState<
        IJournalVoucherEntryRequest[]
    >(rowData || [])
    const {
        selectedJournalVoucherEntry,
        setSelectedJournalVoucherEntry,
        setJournalVoucherEntriesDeleted,
    } = useJournalVoucherStore()

    useEffect(() => {
        if (journalEntries) {
            setSelectedJournalVoucherEntry(journalEntries)
        }
    }, [journalEntries, setSelectedJournalVoucherEntry])

    const handleDeleteRow = (row: Row<IJournalVoucherEntryRequest>) => {
        const id = row.original.id
        const rowId = row.original.rowId
        if (isUpdateMode) {
            const validation = entityIdSchema.safeParse(id)
            if (validation.success) {
                setJournalVoucherEntriesDeleted(id as TEntityId)
                const updatedData = selectedJournalVoucherEntry.filter(
                    (data) => data.id !== id
                )
                setJournalEntries(updatedData)
            } else {
                const updatedData = selectedJournalVoucherEntry.filter(
                    (data) => data.rowId !== rowId
                )
                setJournalEntries(updatedData)
            }
        }
    }
    const table = useReactTable({
        data: journalEntries,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            updateData: (rowIndex, columnId, value) => {
                const updatedEntries = (journalEntries ?? []).map(
                    (entry, index) => {
                        if (index === rowIndex) {
                            return {
                                ...entry,
                                [columnId]: value,
                            }
                        }
                        return entry
                    }
                )
                setJournalEntries(updatedEntries)
            },
            handleDeleteRow: handleDeleteRow,
        },
    })

    const handleAddRow = (
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
    ) => {
        e.preventDefault()
        const newRow: IJournalVoucherEntryRequest = {
            account_id: '',
            description: '',
            member_profile_id: defaultMemberProfileId,
            debit: 0,
            credit: 0,
            rowId: crypto.randomUUID(),
            cash_check_voucher_number: '',
        }
        setJournalEntries([...selectedJournalVoucherEntry, newRow])
    }

    useHotkeys(
        'Shift+i',
        (e) => {
            e.preventDefault()
            handleAddRow(
                e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>
            )
        },
        [selectedJournalVoucherEntry]
    )

    return (
        <div className={cn('', className)}>
            <div className="w-full flex justify-between">
                <h1 className="text-lg font-semibold">Journal Entries</h1>
                <div className="flex py-2 items-center space-x-2">
                    <Button
                        size="sm"
                        type="button"
                        tabIndex={0}
                        className="size-fit px-2 py-0.5 text-xs"
                        onClick={(e) => handleAddRow(e)}
                        aria-label="Add new suggested payment"
                    >
                        Add <PlusIcon className="inline" />
                    </Button>
                    <CommandShortcut className="bg-accent min-w-fit p-1 px-2 text-primary rounded-sm mr-1">
                        Shift + I
                    </CommandShortcut>
                </div>
            </div>
            <Table wrapperClassName={cn('max-h-64', TableClassName)}>
                <TableHeader className={cn('sticky top-0 z-10')}>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <TableRow
                            key={headerGroup.id}
                            className={cn('h-fit hover:bg-background')}
                        >
                            {headerGroup.headers.map((header) => (
                                <TableHead
                                    key={header.id}
                                    colSpan={header.colSpan}
                                    className={cn(
                                        'h-10 bg-sidebar',
                                        'first:!rounded-tl-2xl',
                                        'last:!rounded-tr-2xl'
                                    )}
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
                            key={row.id}
                            className={cn(
                                'hover:bg-background !border-b-[0.5px] border-b-primary/20'
                            )}
                        >
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id} className="!p-2">
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
