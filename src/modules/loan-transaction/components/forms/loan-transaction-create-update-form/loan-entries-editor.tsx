import {
    KeyboardEvent,
    forwardRef,
    memo,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react'

import { UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { formatNumber } from '@/helpers'
import { IAccount } from '@/modules/account'
import { ILoanTransactionEntryRequest } from '@/modules/loan-transaction-entry'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    CalendarNumberIcon,
    PencilFillIcon,
    PlusIcon,
    RenderIcon,
    TrashIcon,
} from '@/components/icons'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import {
    Table,
    TableBody,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { TLoanTransactionSchema } from '../../../loan-transaction.validation'
import LoanAmortization from '../../loan-amortization'
import { LoanChargeCreateModal } from '../loan-charge-create-modal'

// Loan Entires Tab Content
const LoanEntriesEditor = forwardRef<
    HTMLTableElement,
    {
        form: UseFormReturn<TLoanTransactionSchema>
        disabled?: boolean
        loanTransactionId?: TEntityId
    }
>(({ form, loanTransactionId, disabled }, ref) => {
    const addChargeModalState = useModalState()
    const rowRefs = useRef<(HTMLTableRowElement | null)[]>([])
    const [focusedIndex, setFocusedIndex] = useState(-1)

    const handleKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault()
            const nextIndex = Math.min(focusedIndex + 1, fields.length - 1)
            setFocusedIndex(nextIndex)
            rowRefs.current[nextIndex]?.focus()
        } else if (e.key === 'ArrowUp') {
            e.preventDefault()
            const prevIndex = Math.max(focusedIndex - 1, 0)
            setFocusedIndex(prevIndex)
            rowRefs.current[prevIndex]?.focus()
        }
    }

    const { fields, replace, append, update, remove } = useFieldArray({
        control: form.control,
        name: 'loan_transaction_entries',
        keyName: 'fieldKey',
    })

    const { append: addToDeletedField } = useFieldArray({
        control: form.control,
        name: 'loan_transaction_entries_deleted',
        keyName: 'fieldKey',
    })

    const applied_1 = form.watch('applied_1')
    const is_add_on = form.watch('is_add_on')
    const account: IAccount | undefined = form.watch('account')

    const {
        totalDebit,
        totalCredit,
        difference,
        deductionsTotal,
        netCashAmount,
        addOnTotal,
    } = useMemo(() => {
        const debitTotal = fields.reduce(
            (sum, field) => sum + (Number(field.debit) || 0),
            0
        )
        const creditTotal = fields.reduce(
            (sum, field) => sum + (Number(field.credit) || 0),
            0
        )

        const regularDeductions = fields
            .filter((field) => field.type === 'deduction' && !field.is_add_on)
            .reduce((sum, field) => sum + (Number(field.credit) || 0), 0)

        const addOnCharges = fields
            .filter((field) => field.type === 'deduction' && field.is_add_on)
            .reduce((sum, field) => sum + (Number(field.credit) || 0), 0)

        const netCash = (applied_1 || 0) - regularDeductions

        return {
            totalDebit: debitTotal,
            totalCredit: creditTotal,
            difference: Math.abs(debitTotal - creditTotal),
            deductionsTotal: regularDeductions,
            netCashAmount: netCash,
            addOnTotal: addOnCharges,
        }
    }, [fields, applied_1])

    const isBalanced = totalDebit === totalCredit

    const deductionsSignature = useMemo(
        () =>
            fields
                .filter((f) => f.type === 'deduction')
                .map((f) => `${f.account_id}:${f.credit}:${f.is_add_on}`)
                .join('|'),
        [fields]
    )

    useEffect(() => {
        const cash_on_hand = fields[0]
        const found_account_entry = fields[1]

        const account_entry: ILoanTransactionEntryRequest = {
            ...found_account_entry,
            type: 'static',
            index: 1,
            account,
            account_id: account?.id,
            name: account?.name || 'No account name',
            description: account?.description || 'No Description',
        }

        const add_on_entry = fields.find(
            (entry) => entry.type === 'add-on' && !!entry.id
        )

        if (!cash_on_hand || !account_entry || !applied_1) return

        const deductionEntries = fields.filter(
            (entry) => entry.type === 'deduction'
        )

        const regularDeductions = deductionEntries
            .filter((entry) => {
                if (is_add_on) return !entry.is_add_on
                return true
            })
            .reduce((sum, entry) => sum + (Number(entry.credit) || 0), 0)

        const addOnCharges = deductionEntries
            .filter((entry) => entry.is_add_on)
            .reduce((sum, entry) => sum + (Number(entry.credit) || 0), 0)

        let allEntries = []

        if (is_add_on && addOnCharges > 0) {
            const cashAmount = applied_1 - regularDeductions
            const loanAmount = applied_1

            const staticEntries: ILoanTransactionEntryRequest[] = [
                {
                    ...cash_on_hand,
                    account_id: cash_on_hand?.account_id,
                    account: cash_on_hand.account,
                    debit: 0,
                    credit: cashAmount,
                    index: 0,
                    name:
                        cash_on_hand?.account?.name || cash_on_hand?.name || '',
                    description: cash_on_hand?.description || 'Cash on Hand',
                    is_add_on: false,
                    type: 'static',
                },
                {
                    ...account_entry,
                    account_id: account_entry.account_id,
                    account: account_entry?.account,
                    debit: loanAmount,
                    credit: 0,
                    index: 1,
                    name:
                        account_entry?.name ||
                        account_entry?.account?.name ||
                        'Unknown account',
                    description: account_entry?.description || '...',
                    is_add_on: false,
                    type: 'static',
                },
            ]

            const addOnEntry: ILoanTransactionEntryRequest[] =
                addOnCharges > 0 && is_add_on
                    ? [
                          {
                              ...add_on_entry,
                              account_id: undefined,
                              account: undefined,
                              debit: addOnCharges || 0,
                              credit: 0,
                              index: 1 + deductionEntries.length,
                              name: 'Add-On',
                              description: 'Add on Interest',
                              is_add_on: false,
                              type: 'add-on',
                          },
                      ]
                    : []

            allEntries = [...staticEntries, ...deductionEntries, ...addOnEntry]
        } else {
            const netCashAmount = applied_1 - regularDeductions
            const loanAmount = applied_1

            const staticEntries: ILoanTransactionEntryRequest[] = [
                {
                    ...cash_on_hand,
                    account_id: cash_on_hand?.account_id,
                    account: cash_on_hand,
                    debit: 0,
                    index: 0,
                    credit: netCashAmount,
                    name:
                        cash_on_hand?.account?.name || cash_on_hand?.name || '',
                    description: cash_on_hand?.description || 'Cash on Hand',
                    is_add_on: false,
                    type: 'static',
                },
                {
                    ...account_entry,
                    account_id: account_entry?.account_id,
                    account: account_entry,
                    debit: loanAmount,
                    credit: 0,
                    index: 1,
                    name:
                        account_entry?.name ||
                        account_entry?.account?.name ||
                        'Unknown account',
                    description: account_entry?.description || '...',
                    is_add_on: false,
                    type: 'static',
                },
            ]

            allEntries = [...staticEntries, ...deductionEntries]
        }

        replace(allEntries.map((entry, i) => ({ ...entry, index: i })))

        if (!is_add_on || addOnCharges <= 0) {
            if (add_on_entry?.id) addToDeletedField(add_on_entry.id)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [account, applied_1, is_add_on, deductionsSignature, replace])

    useHotkeys('shift+n', () => addChargeModalState.onOpenChange(true))

    const handleRemoveEntry = (index: number) => {
        const entry = fields[index]
        if (entry?.type === 'deduction') {
            remove(index)
        }
        if (entry.id) {
            addToDeletedField(entry.id)
        }
    }

    const isDisabled =
        disabled || fields[0] === undefined || fields[1] === undefined

    if (isDisabled)
        return (
            <div className="min-h-48 flex items-center justify-center">
                <p className="text-muted-foreground text-sm">
                    Please save the loan transaction first before entering loan
                    entries
                </p>
            </div>
        )

    return (
        <fieldset disabled={isDisabled} className="relative">
            <div className="flex items-center justify-between mb-4">
                <div>
                    <p className="font-medium">Loan Entries</p>
                    {deductionsTotal > 0 && (
                        <p className="text-xs text-muted-foreground">
                            Net cash: {formatNumber(netCashAmount)}
                            <span className="ml-1 text-orange-600">
                                ({formatNumber(deductionsTotal)} deducted)
                            </span>
                        </p>
                    )}
                    {addOnTotal > 0 && (
                        <p className="text-xs text-green-600">
                            Add-on charges: {formatNumber(addOnTotal)}
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <div
                        className={`text-xs px-2 py-1 rounded-sm ${
                            isBalanced
                                ? 'bg-primary/20 dark:bg-primary/20'
                                : 'bg-destructive text-destructive-foreground'
                        }`}
                    >
                        {isBalanced
                            ? '✓ Balanced'
                            : `⚠ Difference: ${formatNumber(difference)}`}
                    </div>
                    <Button
                        size="sm"
                        type="button"
                        tabIndex={0}
                        className="size-fit px-2 py-0.5 text-xs"
                        onClick={() => addChargeModalState.onOpenChange(true)}
                    >
                        Add Deduction <PlusIcon className="inline" />
                    </Button>
                    <p className="text-xs p-1 px-2 bg-muted text-muted-foreground rounded-sm">
                        Press{' '}
                        <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                            Shift + N
                        </CommandShortcut>
                        to add deduction
                    </p>
                </div>
            </div>

            <Table
                ref={ref}
                onKeyDown={handleKeyDown}
                tabIndex={0}
                wrapperClassName="max-h-[95vh] bg-secondary rounded-xl ecoop-scroll"
            >
                <LoanChargeCreateModal
                    {...addChargeModalState}
                    formProps={{
                        onSuccess: (charge) => {
                            append({
                                account_id: charge.account_id,
                                account: charge.account,
                                name: charge.account?.name || '',
                                debit: 0,
                                credit: charge.amount,
                                description: charge.description || '',
                                is_add_on: charge.is_add_on,
                                type: 'deduction',
                            })
                        },
                    }}
                />
                <TableHeader>
                    <TableRow className="bg-secondary/40">
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Debit</TableHead>
                        <TableHead className="text-right">Credit</TableHead>
                        <TableHead className="w-16">Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {fields.map((field, index) => (
                        <LoanEntryRow
                            key={field.fieldKey}
                            field={field}
                            index={index}
                            form={form}
                            ref={(el) => {
                                rowRefs.current[index] = el
                            }}
                            onRemove={handleRemoveEntry}
                            onUpdate={(index, updatedData) =>
                                update(index, updatedData)
                            }
                        />
                    ))}
                    {fields.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={4}>
                                <p className="py-16 text-center text-sm text-muted-foreground/80">
                                    No entries yet.
                                </p>
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
                <TableFooter>
                    <TableRow className="bg-muted/50 text-xl">
                        <TableCell className="font-semibold">
                            <AmortizationView
                                loanTransactionId={loanTransactionId}
                            />
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatNumber(totalDebit)}
                        </TableCell>
                        <TableCell className="text-right font-semibold">
                            {formatNumber(totalCredit)}
                        </TableCell>
                        <TableCell>
                            <div
                                className={`w-3 h-3 rounded-full ${
                                    isBalanced ? 'bg-green-500' : 'bg-red-500'
                                }`}
                            />
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </fieldset>
    )
})

interface ILoanEntryRowProps {
    field: ILoanTransactionEntryRequest & { fieldKey: string }
    index: number
    form: UseFormReturn<TLoanTransactionSchema>
    onRemove: (index: number) => void
    onUpdate: (index: number, updatedData: ILoanTransactionEntryRequest) => void
}

const LoanEntryRow = memo(
    forwardRef<HTMLTableRowElement, ILoanEntryRowProps>(
        ({ field, index, onRemove, onUpdate }, ref) => {
            const rowRef = useRef<HTMLTableRowElement>(null)

            const editModalState = useModalState()

            const isEditable = field.type === 'deduction'
            const isRemovable = field.type === 'deduction'

            const handleRowKeyDown = (
                e: KeyboardEvent<HTMLTableRowElement>
            ) => {
                if (e.key === 'Delete') {
                    if (!isRemovable)
                        return toast.info(`Entry ${field.name} not removable`)
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(index)
                } else if (e.key === 'F2') {
                    if (!isEditable)
                        return toast.info(`Entry ${field.name} not editable`)
                    e.preventDefault()
                    e.stopPropagation()
                    editModalState.onOpenChange(true)
                }
            }

            return (
                <>
                    <TableRow
                        ref={(el) => {
                            rowRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        key={field.fieldKey}
                        onKeyDown={handleRowKeyDown}
                        tabIndex={0}
                        className="focus:bg-background/20"
                    >
                        <TableCell>
                            <div className="flex flex-col">
                                <span className="font-medium flex gap-x-1 items-center">
                                    {field.account?.icon && (
                                        <RenderIcon icon={field.account.icon} />
                                    )}
                                    {field.name || 'Unknown'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {field.description || '...'}
                                </span>
                                <div className="flex gap-2 mt-1">
                                    {field.type === 'add-on' && (
                                        <span className="text-xs text-green-600 font-medium">
                                            • Add-on Interest
                                        </span>
                                    )}
                                    {field.type === 'deduction' && (
                                        <span className="text-xs text-orange-600 font-medium">
                                            • Deduction
                                        </span>
                                    )}
                                    {field.type === 'deduction' &&
                                        field.is_add_on && (
                                            <span className="text-xs text-green-600 font-medium">
                                                • Add-On
                                            </span>
                                        )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right">
                            {field.debit ? `${formatNumber(field.debit)}` : ''}
                        </TableCell>
                        <TableCell className="text-right">
                            {field.credit
                                ? `${formatNumber(field.credit)}`
                                : ''}
                        </TableCell>
                        <TableCell>
                            <div className="flex gap-1">
                                {isEditable && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            editModalState.onOpenChange(true)
                                        }
                                        className="size-8 p-0"
                                    >
                                        <PencilFillIcon className="size-4" />
                                        <span className="sr-only">
                                            Edit entry
                                        </span>
                                    </Button>
                                )}
                                {isRemovable && (
                                    <Button
                                        size="sm"
                                        type="button"
                                        variant="ghost"
                                        onClick={() => onRemove(index)}
                                        className="h-8 w-8 p-0 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                        <span className="sr-only">
                                            Remove entry
                                        </span>
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                    <LoanChargeCreateModal
                        {...editModalState}
                        onOpenChange={(state) => {
                            if (!state) {
                                rowRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Deduction"
                        description="Update the deduction details."
                        formProps={{
                            defaultValues: field,
                            onSuccess: (updatedData) => {
                                onUpdate(index, {
                                    ...field,
                                    account_id: updatedData.account_id,
                                    account: updatedData.account,
                                    credit: updatedData.amount,
                                    is_add_on: updatedData.is_add_on,
                                })
                            },
                        }}
                    />
                </>
            )
        }
    )
)

LoanEntryRow.displayName = 'LoanEntryRow'

const AmortizationView = ({
    loanTransactionId,
}: {
    loanTransactionId?: TEntityId
}) => {
    const amortViewer = useModalState()

    useHotkeys('shift+a', (e) => {
        e.preventDefault()
        e.stopPropagation()
        amortViewer.onOpenChange(!amortViewer.open)
    })

    return (
        <>
            {loanTransactionId && (
                <Modal
                    {...amortViewer}
                    title=""
                    description=""
                    closeButtonClassName="top-2 right-2"
                    titleClassName="sr-only"
                    descriptionClassName="sr-only"
                    className="!max-w-[90vw] p-0 shadow-none border-none bg-transparent gap-y-0"
                >
                    <LoanAmortization
                        className="col-span-5 p-0 bg-transparent"
                        loanTransactionId={loanTransactionId}
                    />
                </Modal>
            )}
            <Button
                size="sm"
                type="button"
                className="text-xs size-fit !pl-4 py-0.5"
                disabled={!loanTransactionId}
                onClick={() => amortViewer.onOpenChange(!amortViewer.open)}
                aria-label="See amortization"
                aria-name="View amortization"
            >
                <CalendarNumberIcon className="inline size-3" /> See
                Amortization
                <p className="text-xs p-1 px-2 bg-muted/90 text-muted-foreground rounded-sm">
                    Press{' '}
                    <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                        Shift + A
                    </CommandShortcut>
                    to view amortization
                </p>
            </Button>
        </>
    )
}

export default LoanEntriesEditor
