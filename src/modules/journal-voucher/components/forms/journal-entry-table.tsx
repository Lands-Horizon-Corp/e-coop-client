import { useCallback, useMemo } from 'react'

import { UseFormReturn } from 'react-hook-form'

import { cn } from '@/helpers'
import { IAccount } from '@/modules/account'
import { ICurrency } from '@/modules/currency'
import { IJournalVoucherEntryRequest } from '@/modules/journal-voucher-entry'
import { IMemberProfile } from '@/modules/member-profile'
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

import { TJournalVoucherSchema } from '../../journal-voucher.validation'

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
    ref: React.Ref<HTMLDivElement>
    form: UseFormReturn<TJournalVoucherSchema>
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
    className,
    currency,
    TableClassName,
    defaultMemberProfile,
    transactionBatchId,
    mode,
    form,
}: JournalEntryTableProps) => {
    const isUpdateMode = mode === 'update'
    const isReadOnlyMode = mode === 'readOnly'

    const watchedJournalEntries = form.watch('journal_voucher_entries')
    const watchedDeletedEntries = form.watch('journal_voucher_entries_deleted')

    const journalVoucherEntry = useMemo(
        () => watchedJournalEntries || [],
        [watchedJournalEntries]
    )

    const deletedJournalVoucherEntries = useMemo(
        () => watchedDeletedEntries || [],
        [watchedDeletedEntries]
    )

    const handleDeleteRow = useCallback(
        (row: Row<IJournalVoucherEntryRequest>) => {
            if (isReadOnlyMode) return
            const id = row.original.id
            if (isUpdateMode && id) {
                const validation = entityIdSchema.safeParse(id)
                if (validation.success) {
                    form.setValue('journal_voucher_entries_deleted', [
                        ...deletedJournalVoucherEntries,
                        id as TEntityId,
                    ])
                    const updatedData = journalVoucherEntry.filter(
                        (data) => data.id !== id
                    )
                    form.setValue('journal_voucher_entries', updatedData)
                    form.trigger('journal_voucher_entries')
                }
            } else {
                const updatedData = journalVoucherEntry.filter(
                    (_, index) => index !== row.index
                )
                form.setValue('journal_voucher_entries', updatedData)
                form.trigger('journal_voucher_entries')
            }
        },
        [
            isUpdateMode,
            isReadOnlyMode,
            form,
            journalVoucherEntry,
            deletedJournalVoucherEntries,
        ]
    )

    const handleAddRow = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault()

            if (isReadOnlyMode) return

            const newRow: IJournalVoucherEntryRequest = {
                debit: 0,
                credit: 0,
                rowId: crypto.randomUUID(),
                cash_check_voucher_number: '',
                member_profile_id: defaultMemberProfile?.id,
                member_profile: defaultMemberProfile,
                account_id: '' as TEntityId,
                transaction_batch_id: transactionBatchId ?? undefined,
            }

            const updatedEntries = [...journalVoucherEntry, newRow]
            form.setValue('journal_voucher_entries', updatedEntries)
            form.trigger('journal_voucher_entries')
        },
        [
            isReadOnlyMode,
            defaultMemberProfile,
            transactionBatchId,
            journalVoucherEntry,
            form,
        ]
    )

    const updateData = useCallback(
        <TValue,>(
            rowIndex: number,
            columnId: keyof IJournalVoucherEntryRequest,
            value: TValue
        ) => {
            const updatedEntries = journalVoucherEntry.map((entry, index) => {
                if (index === rowIndex) {
                    const updatedEntry = { ...entry }

                    if (columnId === 'debit') {
                        updatedEntry.debit = value as number
                        updatedEntry.credit = 0 // Clear credit when debit is set
                    } else if (columnId === 'credit') {
                        updatedEntry.credit = value as number
                        updatedEntry.debit = 0 // Clear debit when credit is set
                    } else if (columnId === 'account') {
                        updatedEntry.account = value
                        updatedEntry.account_id = (value as IAccount)
                            ?.id as TEntityId
                    } else if (columnId === 'member_profile') {
                        updatedEntry.member_profile = value
                        updatedEntry.member_profile_id = (
                            value as IMemberProfile
                        )?.id as TEntityId
                    }

                    return updatedEntry
                }
                return entry
            })

            form.setValue('journal_voucher_entries', updatedEntries)
            form.trigger('journal_voucher_entries')
        },
        [journalVoucherEntry, form]
    )

    const table = useReactTable<IJournalVoucherEntryRequest>({
        data: journalVoucherEntry,
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            defaultCurrency: currency,
            updateData,
            handleDeleteRow,
        },
    })

    useHotkeys(
        'Shift+i',
        (e) => {
            e.preventDefault()
            if (isReadOnlyMode) return
            handleAddRow(
                e as unknown as React.MouseEvent<HTMLButtonElement, MouseEvent>
            )
        },
        {
            enabled: !isReadOnlyMode,
        }
    )

    return (
        <div className={cn('', className)}>
            <div className="w-full flex justify-between">
                <h1 className="text-lg font-semibold">Journal Entries</h1>
                <div className="flex py-2 items-center space-x-2">
                    <Button
                        aria-label="Add new journal entry"
                        className="size-fit px-2 py-0.5 text-xs"
                        disabled={isReadOnlyMode}
                        onClick={handleAddRow}
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

            {/* Table */}
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
                    {table.getRowModel().rows.length === 0 ? (
                        <TableRow>
                            <TableCell
                                className="text-center py-8 text-muted-foreground"
                                colSpan={columns.length}
                            >
                                No journal entries. Click "Add" to create one.
                            </TableCell>
                        </TableRow>
                    ) : (
                        table.getRowModel().rows.map((row) => (
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
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}
