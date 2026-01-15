import { useCallback } from 'react'

import { UseFormReturn, useFieldArray } from 'react-hook-form'

import { cn } from '@/helpers'
import { IAccount, TAccountType } from '@/modules/account'
import { AccountPicker } from '@/modules/account/components'
import { CurrencyInput, ICurrency } from '@/modules/currency'
import { IJournalVoucherEntryRequest } from '@/modules/journal-voucher-entry'
import LoanPicker from '@/modules/loan-transaction/components/loan-picker'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import {
    ColumnDef,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { useHotkeys } from 'react-hotkeys-hook'

import { PlusIcon, TrashIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
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
        id: 'account',
        header: 'Account',
        minSize: 200,
        size: 350,
        cell: (props) => {
            const meta = props.table.options.meta as JournalEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index

            return (
                <AccountPicker
                    allowClear
                    currencyId={meta.defaultCurrency?.id as TEntityId}
                    mode={meta.defaultCurrency ? 'currency' : 'all'}
                    nameOnly
                    onSelect={(selectedAccount) => {
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.account`,
                            selectedAccount
                        )
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.account_id`,
                            selectedAccount?.id as TEntityId
                        )
                    }}
                    placeholder="Select an Account"
                    triggerClassName="!w-full !min-w-0 flex-1"
                    value={props.row.original.account as IAccount}
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
            const meta = props.table.options.meta as JournalEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index

            return (
                <MemberPicker
                    allowClear
                    onSelect={(selectedMember) => {
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.member_profile`,
                            selectedMember
                        )
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.member_profile_id`,
                            selectedMember?.id as TEntityId
                        )
                    }}
                    placeholder="Select Member"
                    showPBNo={false}
                    triggerClassName="!w-full !min-w-0 flex-1"
                    triggerVariant="outline"
                    value={props.row.original.member_profile as IMemberProfile}
                />
            )
        },
    },
    {
        accessorKey: 'loan_transaction_id',
        header: 'Loan',
        minSize: 120,
        size: 150,
        cell: (props) => {
            const meta = props.table.options.meta as JournalEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index

            const original = props.row.original
            const account: IAccount | undefined = original.account

            return (
                <LoanPicker
                    disabled={
                        !account ||
                        !(
                            [
                                'Loan',
                                'SVF-Ledger',
                                'Fines',
                                'Interest',
                            ] as TAccountType[]
                        ).includes(account?.type) ||
                        !original.member_profile_id
                    }
                    memberProfileId={original.member_profile_id as TEntityId}
                    mode={'member-profile'}
                    onSelect={(loanTransaction) => {
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.loan_transaction`,
                            loanTransaction
                        )
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.loan_transaction_id`,
                            loanTransaction.id
                        )
                    }}
                    value={original.loan_transaction}
                />
            )
        },
    },
    {
        accessorKey: 'debit',
        header: 'Debit',
        minSize: 200,
        size: 200,
        cell: (props) => {
            const meta = props.table.options.meta as JournalEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index

            return (
                <CurrencyInput
                    className="text-left !w-full !min-w-0"
                    currency={props.row.original.account?.currency}
                    onValueChange={(newValue) => {
                        const numValue =
                            typeof newValue === 'string'
                                ? parseFloat(newValue) || 0
                                : (newValue ?? 0)
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.debit`,
                            numValue
                        )
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.credit`,
                            0
                        )
                    }}
                    value={props.row.original.debit}
                />
            )
        },
    },
    {
        accessorKey: 'credit',
        header: 'Credit',
        minSize: 200,
        size: 200,
        cell: (props) => {
            const meta = props.table.options.meta as JournalEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index

            return (
                <CurrencyInput
                    className="text-left !w-full !min-w-0"
                    currency={props.row.original.account?.currency}
                    onValueChange={(newValue) => {
                        const numValue =
                            typeof newValue === 'string'
                                ? parseFloat(newValue) || 0
                                : (newValue ?? 0)
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.credit`,
                            numValue
                        )
                        form.setValue(
                            `journal_voucher_entries.${rowIndex}.debit`,
                            0
                        )
                    }}
                    value={props.row.original.credit}
                />
            )
        },
    },
    {
        accessorKey: 'action',
        header: 'Action',
        cell: (row) => {
            const meta = row.table.options.meta as JournalEntryTableMeta
            return (
                <Button
                    className="w-full hover:bg-primary/10 !p-0 text-destructive"
                    onClick={(e) => {
                        e.preventDefault()
                        meta.handleDeleteRow(row.row.index)
                    }}
                    size="icon"
                    variant="ghost"
                >
                    <TrashIcon />
                </Button>
            )
        },
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

type JournalEntryTableMeta = {
    handleDeleteRow: (index: number) => void
    defaultCurrency?: ICurrency
    form: UseFormReturn<TJournalVoucherSchema>
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

    const { append: addEntry, remove: removeEntry } = useFieldArray({
        name: 'journal_voucher_entries',
        control: form.control,
    })

    const { append: addRemoveId } = useFieldArray({
        name: 'journal_voucher_entries_deleted',
        control: form.control,
    })

    const handleDeleteRow = useCallback(
        (index: number) => {
            if (isReadOnlyMode) return

            const entryId = form.getValues(
                `journal_voucher_entries.${index}.id`
            )

            if (entryId && isUpdateMode) {
                removeEntry(index)
                addRemoveId(entryId)
                return
            }

            removeEntry(index)
        },
        [isReadOnlyMode, form, isUpdateMode, removeEntry, addRemoveId]
    )

    const handleAddRow = useCallback(
        (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
            e.preventDefault()

            if (isReadOnlyMode) return

            const newRow: IJournalVoucherEntryRequest = {
                debit: '' as unknown as number,
                credit: '' as unknown as number,
                member_profile_id: defaultMemberProfile?.id,
                member_profile: defaultMemberProfile,
                account_id: '' as TEntityId,
                transaction_batch_id: transactionBatchId ?? undefined,
            }

            addEntry(newRow)
        },
        [addEntry, defaultMemberProfile, isReadOnlyMode, transactionBatchId]
    )

    const table = useReactTable<IJournalVoucherEntryRequest>({
        data: watchedJournalEntries || [],
        columns: columns,
        getCoreRowModel: getCoreRowModel(),
        meta: {
            defaultCurrency: currency,
            handleDeleteRow,
            form,
        } as JournalEntryTableMeta,
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
