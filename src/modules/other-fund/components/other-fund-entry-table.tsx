import { forwardRef, useCallback, useMemo } from 'react'

import { UseFormReturn, useFieldArray, useWatch } from 'react-hook-form'

import { cn } from '@/helpers'
import { IAccount, TAccountType } from '@/modules/account'
import { AccountPicker } from '@/modules/account/components'
import { CurrencyInput, ICurrency } from '@/modules/currency'
import LoanPicker from '@/modules/loan-transaction/components/loan-picker'
import { IMemberProfile } from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { IOtherFundEntryRequest } from '@/modules/other-fund-entry'
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

import { TOtherFundSchema } from '../other-fund.validation'

const columns: ColumnDef<IOtherFundEntryRequest>[] = [
    {
        accessorKey: 'account',
        id: 'account',
        header: 'Account',
        minSize: 200,
        size: 350,
        cell: (props) => {
            const meta = props.table.options.meta as OtherFundEntryTableMeta
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
                            `other_fund_entries.${rowIndex}.account`,
                            selectedAccount
                        )
                        form.setValue(
                            `other_fund_entries.${rowIndex}.account_id`,
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
            const meta = props.table.options.meta as OtherFundEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index

            return (
                <MemberPicker
                    allowClear
                    onSelect={(selectedMember) => {
                        form.setValue(
                            `other_fund_entries.${rowIndex}.member_profile`,
                            selectedMember
                        )
                        form.setValue(
                            `other_fund_entries.${rowIndex}.member_profile_id`,
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
            const meta = props.table.options.meta as OtherFundEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index
            const original = props.row.original
            const account = original.account as IAccount

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
                    onSelect={(loan) => {
                        form.setValue(
                            `other_fund_entries.${rowIndex}.loan_transaction`,
                            loan
                        )
                        form.setValue(
                            `other_fund_entries.${rowIndex}.loan_transaction_id`,
                            loan.id
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
        minSize: 150,
        size: 180,
        cell: (props) => {
            const meta = props.table.options.meta as OtherFundEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index

            return (
                <CurrencyInput
                    className="text-left w-full! min-w-0!"
                    currency={props.row.original.account?.currency}
                    onValueChange={(newValue) => {
                        const numValue =
                            typeof newValue === 'string'
                                ? parseFloat(newValue) || 0
                                : (newValue ?? 0)
                        form.setValue(
                            `other_fund_entries.${rowIndex}.debit`,
                            numValue
                        )
                        if (numValue > 0)
                            form.setValue(
                                `other_fund_entries.${rowIndex}.credit`,
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
        minSize: 150,
        size: 180,
        cell: (props) => {
            const meta = props.table.options.meta as OtherFundEntryTableMeta
            const form = meta.form
            const rowIndex = props.row.index

            return (
                <CurrencyInput
                    className="text-left w-full! min-w-0!"
                    currency={props.row.original.account?.currency}
                    onKeyDown={(e) => {
                        if (
                            e.key === 'Tab' &&
                            rowIndex ===
                                form.watch('other_fund_entries').length - 1
                        ) {
                            e.preventDefault()
                            meta.handleAddRow()
                        }
                    }}
                    onValueChange={(newValue) => {
                        const numValue =
                            typeof newValue === 'string'
                                ? parseFloat(newValue) || 0
                                : (newValue ?? 0)
                        form.setValue(
                            `other_fund_entries.${rowIndex}.credit`,
                            numValue
                        )
                        if (numValue > 0)
                            form.setValue(
                                `other_fund_entries.${rowIndex}.debit`,
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
            const meta = row.table.options.meta as OtherFundEntryTableMeta
            return (
                <Button
                    className="w-full hover:bg-primary/10 p-0! text-destructive"
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
        size: 50,
    },
]

type OtherFundEntryTableProps = {
    defaultMemberProfile?: IMemberProfile
    otherFundId: TEntityId
    className?: string
    currency?: ICurrency
    TableClassName?: string
    transactionBatchId?: TEntityId
    mode: 'readOnly' | 'update' | 'create'
    form: UseFormReturn<TOtherFundSchema>
}

type OtherFundEntryTableMeta = {
    handleDeleteRow: (index: number) => void
    defaultCurrency?: ICurrency
    form: UseFormReturn<TOtherFundSchema>
    handleAddRow: () => void
}

export const OtherFundEntryTable = forwardRef(
    ({
        className,
        currency,
        TableClassName,
        defaultMemberProfile,
        transactionBatchId,
        mode,
        form,
    }: OtherFundEntryTableProps) => {
        const isUpdateMode = mode === 'update'
        const isReadOnlyMode = mode === 'readOnly'

        const {
            fields,
            append: addEntry,
            remove: removeEntry,
        } = useFieldArray({
            name: 'other_fund_entries',
            control: form.control,
        })

        const { append: addDeletedId } = useFieldArray({
            name: 'other_fund_entries_deleted',
            control: form.control,
        })

        const watchedEntries = useWatch({
            control: form.control,
            name: 'other_fund_entries',
        })
        const handleDeleteRow = useCallback(
            (index: number) => {
                if (isReadOnlyMode) return
                const entryId = form.getValues(`other_fund_entries.${index}.id`)
                if (entryId && isUpdateMode) {
                    addDeletedId(entryId)
                }
                removeEntry(index)
            },
            [isReadOnlyMode, form, isUpdateMode, removeEntry, addDeletedId]
        )

        const tableData = useMemo(() => {
            return fields.map((field, index) => ({
                ...field,
                ...watchedEntries?.[index],
            }))
        }, [fields, watchedEntries])

        const handleAddRow = useCallback(() => {
            if (isReadOnlyMode) return
            addEntry({
                debit: 0,
                credit: 0,
                member_profile_id: defaultMemberProfile?.id,
                member_profile: defaultMemberProfile,
                account_id: '' as TEntityId,
                transaction_batch_id: transactionBatchId ?? undefined,
            })
        }, [addEntry, defaultMemberProfile, isReadOnlyMode, transactionBatchId])

        const table = useReactTable<IOtherFundEntryRequest>({
            data: tableData,
            columns: columns,
            getCoreRowModel: getCoreRowModel(),
            meta: {
                defaultCurrency: currency,
                handleDeleteRow,
                form,
                handleAddRow,
            } as OtherFundEntryTableMeta,
        })

        useHotkeys(
            'Shift+i',
            (e) => {
                e.preventDefault()
                if (!isReadOnlyMode) handleAddRow()
            },
            { enabled: !isReadOnlyMode }
        )

        return (
            <div className={cn('space-y-2', className)}>
                <div className="w-full flex justify-end">
                    <div className="flex py-2 items-center space-x-2">
                        <Button
                            aria-label="Add new journal entry"
                            className="size-fit px-2 py-0.5 text-xs"
                            disabled={isReadOnlyMode}
                            onClick={(e) => {
                                e.preventDefault()
                                handleAddRow()
                            }}
                            size="sm"
                            tabIndex={-1}
                            type="button"
                        >
                            Add <PlusIcon className="inline" />
                        </Button>
                        <CommandShortcut className="bg-secondary min-w-fit p-1 px-2 text-primary rounded-sm mr-1">
                            Shift + I
                        </CommandShortcut>
                    </div>
                </div>

                <Table
                    wrapperClassName={cn(
                        'max-h-[400px] ecoop-scroll rounded-md',
                        TableClassName
                    )}
                >
                    <TableHeader className="sticky top-0 z-10 bg-sidebar shadow-sm">
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow
                                className="hover:bg-transparent"
                                key={headerGroup.id}
                            >
                                {headerGroup.headers.map((header) => (
                                    <TableHead
                                        key={header.id}
                                        style={{ width: header.getSize() }}
                                    >
                                        {flexRender(
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
                                    className="text-center py-10 text-muted-foreground text-sm"
                                    colSpan={columns.length}
                                >
                                    No entries added. Click "Add Entry" to
                                    begin.
                                </TableCell>
                            </TableRow>
                        ) : (
                            table.getRowModel().rows.map((row) => (
                                <TableRow
                                    className="hover:bg-muted/30"
                                    key={row.id}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            className="p-1"
                                            key={cell.id}
                                        >
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
)
