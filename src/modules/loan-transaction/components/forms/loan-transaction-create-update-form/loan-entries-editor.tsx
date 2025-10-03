import { KeyboardEvent, forwardRef, memo, useRef, useState } from 'react'

import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { formatNumber } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker, IAccount } from '@/modules/account'
import AccountMiniCard from '@/modules/account/components/account-mini-card'
import {
    ILoanTransactionEntry,
    ILoanTransactionEntryRequest,
} from '@/modules/loan-transaction-entry'
import { useLoanTransactionChangeCashEquivalenceAccount } from '@/modules/loan-transaction/loan-transaction.service'
import { ILoanTransaction } from '@/modules/loan-transaction/loan-transaction.types'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    ArrowDownIcon,
    CalendarNumberIcon,
    PencilFillIcon,
    PlusIcon,
    RenderIcon,
    ShapesIcon,
    SwapArrowIcon,
    TrashIcon,
} from '@/components/icons'
import Modal from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
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

import { LoanChargeCreateModal } from '../../../../loan-transaction-entry/components/forms/loan-charge-create-modal'
import { TLoanTransactionSchema } from '../../../loan-transaction.validation'
import LoanAmortization from '../../loan-amortization'

// Loan Entires Tab Content
const LoanEntriesEditor = forwardRef<
    HTMLTableElement,
    {
        form: UseFormReturn<TLoanTransactionSchema>
        disabled?: boolean
        isReadOnly?: boolean
        loanTransactionId?: TEntityId
        onUpdateLoading?: (state: boolean) => void
        onUpdateAnything?: (data: ILoanTransaction) => void
    }
>(
    (
        {
            form,
            loanTransactionId,
            isReadOnly,
            onUpdateLoading,
            onUpdateAnything,
            disabled,
        },
        ref
    ) => {
        const addChargeModalState = useModalState()
        const cashAccountPickerModal = useModalState()
        const { onOpen } = useConfirmModalStore()

        const rowRefs = useRef<(HTMLTableRowElement | null)[]>([])
        const [focusedIndex, setFocusedIndex] = useState(-1)

        const loanEntries = form.watch(
            'loan_transaction_entries'
        ) as ILoanTransactionEntry[]

        const totalCredit = form.watch('total_credit') || 0
        const totalDebit = form.watch('total_debit') || 0
        const totalAddOns = form.watch('total_add_on') || 0

        const deductionsTotal = loanEntries.reduce(
            (sum, entry) =>
                sum +
                (entry.type.includes('deduction') && !entry.is_add_on
                    ? Number(entry.credit) || 0
                    : 0),
            0
        )

        const isDisabled =
            disabled ||
            loanEntries[0] === undefined ||
            loanEntries[1] === undefined ||
            isReadOnly

        const isBalanced = totalDebit === totalCredit
        const difference = Math.abs(totalDebit - totalCredit)

        useHotkeys('shift+n', () => addChargeModalState.onOpenChange(true), {
            enabled: !isDisabled,
        })

        const handleRemoveEntry = (index: number) => {
            const entry = loanEntries[index]
            if (entry?.type === 'deduction') {
                // remove(index)
            }
            if (entry.id) {
                // addToDeletedField(entry.id)
            }
        }

        const handleKeyDown = (e: KeyboardEvent<HTMLTableElement>) => {
            if (e.key === 'ArrowDown') {
                e.preventDefault()
                const nextIndex = Math.min(
                    focusedIndex + 1,
                    loanEntries.length - 1
                )
                setFocusedIndex(nextIndex)
                rowRefs.current[nextIndex]?.focus()
            } else if (e.key === 'ArrowUp') {
                e.preventDefault()
                const prevIndex = Math.max(focusedIndex - 1, 0)
                setFocusedIndex(prevIndex)
                rowRefs.current[prevIndex]?.focus()
            }
        }

        const changeCashEquivalenceMutation =
            useLoanTransactionChangeCashEquivalenceAccount()

        const handleChangeCashEntryAccount = (account: IAccount) => {
            const entries = form.getValues('loan_transaction_entries')

            if (!entries || !entries[0] || entries[0].type !== 'static') {
                toast.warning(
                    'Sorry cash account entry does not exist in loan transaction.'
                )
                return
            }

            const originalEntry = entries[0]

            if (originalEntry.account_id === account.id)
                return toast.warning('Invalid : Account is alread selected')

            onOpen({
                title: 'Replace cash account',
                modalClassName: 'w-fit !max-w-none',
                content: (
                    <div className="space-y-4">
                        <div className="bg-muted/50 p-4 rounded-lg">
                            <p className="text-sm text-muted-foreground">
                                The cash source for this loan entry will be
                                updated to use a different account
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-y-4">
                            <AccountMiniCard
                                defaultAccount={originalEntry.account}
                                accountId={
                                    originalEntry.account_id as TEntityId
                                }
                                className="border-dashed border-2 border-destructive bg-destructive/40"
                            />
                            <ArrowDownIcon className="size-4 shrink-0" />
                            <AccountMiniCard
                                accountId={account.id}
                                defaultAccount={account}
                                className="border-2 border-primary"
                            />
                        </div>
                    </div>
                ),
                confirmString: 'Replace',
                onConfirm: () => {
                    onUpdateLoading?.(true)
                    toast.promise(
                        changeCashEquivalenceMutation.mutateAsync({
                            loanTransactionId: loanTransactionId as TEntityId,
                            cashAccountId: account.id,
                        }),
                        {
                            loading: 'Changing cash equivalence account...',
                            success: (data) => {
                                onUpdateAnything?.(data)
                                return 'Cash equivalence account changed'
                            },
                            error: (err) => {
                                return `Failed to change cash equivalence account ${serverRequestErrExtractor({ error: err })}`
                            },
                            finally: () => onUpdateLoading?.(false),
                        }
                    )
                },
            })
        }

        return (
            <div className="relative">
                <AccountPicker
                    triggerClassName="sr-only"
                    mode="cash-and-cash-equivalence"
                    modalState={cashAccountPickerModal}
                    onSelect={handleChangeCashEntryAccount}
                    disabled={isReadOnly || isDisabled}
                />
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="font-medium">
                            Loan Entries
                            <span
                                className={`text-xs px-2 py-1 ml-2 rounded-sm ${
                                    isBalanced
                                        ? 'bg-primary/20 dark:bg-primary/20'
                                        : 'bg-destructive text-destructive-foreground'
                                }`}
                            >
                                {isBalanced
                                    ? '✓ Balanced'
                                    : `⚠ Difference: ${formatNumber(difference)}`}
                            </span>
                        </p>
                        {deductionsTotal > 0 && (
                            <p className="text-xs text-muted-foreground">
                                <span className="ml-1 text-orange-600">
                                    ({formatNumber(deductionsTotal)} deducted)
                                </span>
                            </p>
                        )}
                        {totalAddOns > 0 && (
                            <p className="text-xs text-green-600">
                                Add-on charges: {formatNumber(totalAddOns)}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center shrink-0 flex-1 justify-end gap-2">
                        <Button
                            size="sm"
                            tabIndex={0}
                            type="button"
                            variant="ghost"
                            className="size-fit px-2 py-0.5 text-xs"
                            disabled={isReadOnly || isDisabled}
                            onClick={() =>
                                cashAccountPickerModal.onOpenChange(true)
                            }
                        >
                            Change Cash Equivalence
                            <SwapArrowIcon className="inline" />
                        </Button>
                        <Button
                            size="sm"
                            type="button"
                            tabIndex={0}
                            className="size-fit px-2 py-0.5 text-xs"
                            disabled={isReadOnly || isDisabled}
                            onClick={() =>
                                addChargeModalState.onOpenChange(true)
                            }
                        >
                            Add Deduction <PlusIcon className="inline" />
                        </Button>
                        <p className="text-xs p-1 px-2 bg-muted text-muted-foreground rounded-sm">
                            Press{' '}
                            <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                                Shift + N
                            </CommandShortcut>
                            to add
                        </p>
                        <FormFieldWrapper
                            control={form.control}
                            name="is_add_on"
                            className="w-fit"
                            render={({ field }) => (
                                <div className="border-input has-data-[state=checked]:border-primary/50 border-2 has-data-[state=checked]:bg-primary/20 duration-200 ease-in-out relative flex w-fit items-center gap-2 rounded-xl px-2 py-0.5 shadow-xs outline-none">
                                    <Switch
                                        tabIndex={0}
                                        id="loan-add-on"
                                        disabled={isReadOnly || isDisabled}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        aria-describedby={`loan-add-on-description`}
                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <ShapesIcon className="text-primary size-4" />
                                        <div className="text-xs flex items-center gap-x-2">
                                            <Label
                                                htmlFor={'loan-add-on'}
                                                className="text-xs"
                                            >
                                                Add-On{' '}
                                            </Label>
                                            <p
                                                id="loan-add-on-description"
                                                className="text-muted-foreground text-xs"
                                            >
                                                Include Add-On&apos;s
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                </div>
                <Table
                    ref={ref}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    wrapperClassName="max-h-[95vh] bg-secondary rounded-xl ecoop-scroll"
                >
                    {/* <LoanChargeCreateModal
                        {...addChargeModalState}
                        formProps={{
                            onSuccess: (charge) => {
                                append({
                                    account_id: charge.account_id,
                                    account: charge.account,
                                    name: charge.account?.name || '',
                                    debit: 0,
                                    credit: charge.amount,
                                    index: 2 + deductionEntries.length,
                                    description: charge.description || '',
                                    is_add_on: charge.is_add_on,
                                    type: 'deduction',
                                })
                            },
                        }}
                    /> */}
                    <TableHeader>
                        <TableRow className="bg-secondary/40">
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                            <TableHead className="w-16">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loanEntries.map((field, index) => (
                            <LoanEntryRow
                                disabled={isReadOnly || disabled}
                                key={`${field.id}-${index}`}
                                entry={field}
                                index={index}
                                form={form}
                                ref={(el) => {
                                    rowRefs.current[index] = el
                                }}
                                onRemove={handleRemoveEntry}
                                // onUpdate={(index, updatedData) =>
                                //     update(index, updatedData)
                                // }
                            />
                        ))}
                        {loanEntries.length === 0 && (
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
                                        isBalanced
                                            ? 'bg-green-500'
                                            : 'bg-destructive'
                                    }`}
                                />
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        )
    }
)

interface ILoanEntryRowProps {
    entry: ILoanTransactionEntryRequest
    index: number
    form: UseFormReturn<TLoanTransactionSchema>
    disabled?: boolean
    onRemove: (index: number) => void
    // onUpdate: (index: number, updatedData: ILoanTransactionEntryRequest) => void
}

const LoanEntryRow = memo(
    forwardRef<HTMLTableRowElement, ILoanEntryRowProps>(
        ({ entry, index, disabled, onRemove }, ref) => {
            const rowRef = useRef<HTMLTableRowElement>(null)

            const editModalState = useModalState()

            const isEditable = entry.type === 'deduction'
            const isRemovable = entry.type === 'deduction'

            const handleRowKeyDown = (
                e: KeyboardEvent<HTMLTableRowElement>
            ) => {
                if (disabled) {
                    e.preventDefault()
                    e.stopPropagation()
                    return
                }

                if (e.key === 'Delete') {
                    if (!isRemovable)
                        return toast.info(`Entry ${entry.name} not removable`)
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(index)
                } else if (e.key === 'F2') {
                    if (!isEditable)
                        return toast.info(`Entry ${entry.name} not editable`)
                    e.preventDefault()
                    e.stopPropagation()
                    editModalState.onOpenChange(true)
                }
            }

            return (
                <>
                    <TableRow
                        onDoubleClick={() => {
                            if (disabled) return
                            editModalState.onOpenChange(true)
                        }}
                        ref={(el) => {
                            rowRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        onKeyDown={handleRowKeyDown}
                        tabIndex={0}
                        className="focus:bg-background/20"
                    >
                        <TableCell className="py-2 h-fit">
                            <div className="flex flex-col">
                                <span className="font-medium flex gap-x-1 items-center">
                                    {entry.account?.icon && (
                                        <RenderIcon icon={entry.account.icon} />
                                    )}
                                    {entry.name || 'Unknown'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {entry.description || '...'}
                                </span>
                                <div className="flex gap-2 mt-1">
                                    {entry.type === 'add-on' && (
                                        <span className="text-xs text-green-600 font-medium">
                                            • Add-on Interest
                                        </span>
                                    )}
                                    {entry.type === 'deduction' && (
                                        <span className="text-xs text-orange-600 font-medium">
                                            • Deduction
                                        </span>
                                    )}
                                    {entry.type === 'deduction' &&
                                        entry.is_add_on && (
                                            <span className="text-xs text-green-600 font-medium">
                                                • Add-On
                                            </span>
                                        )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right py-2 h-fit">
                            {entry.debit ? `${formatNumber(entry.debit)}` : ''}
                        </TableCell>
                        <TableCell className="text-right py-2 h-fit">
                            {entry.credit
                                ? `${formatNumber(entry.credit)}`
                                : ''}
                        </TableCell>
                        <TableCell className="text-right py-2 h-fit">
                            <div className="flex gap-1">
                                {isEditable && (
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        disabled={disabled}
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
                                        disabled={disabled}
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
                            defaultValues: entry,
                            // onSuccess: (updatedData) => {
                            //     onUpdate(index, {
                            //         ...entry,
                            //         account_id: updatedData.account_id,
                            //         account: updatedData.account,
                            //         credit: updatedData.amount,
                            //         is_add_on: updatedData.is_add_on,
                            //     })
                            // },
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

/*
        // // Pang Display Computation totals
        // const {
        //     totalDebit,
        //     totalCredit,
        //     difference,
        //     deductionsTotal,
        //     netCashAmount,
        //     addOnTotal,
        // } = useMemo(() => {
        //     const debitTotal = loanEntries.reduce(
        //         (sum, field) => sum + (Number(field.debit) || 0),
        //         0
        //     )
        //     const creditTotal = loanEntries.reduce(
        //         (sum, field) => sum + (Number(field.credit) || 0),
        //         0
        //     )

        //     const regularDeductions = loanEntries
        //         .filter(
        //             (field) => field.type === 'deduction' && !field.is_add_on
        //         )
        //         .reduce((sum, field) => sum + (Number(field.credit) || 0), 0)

        //     const addOnCharges = loanEntries
        //         .filter(
        //             (field) => field.type === 'deduction' && field.is_add_on
        //         )
        //         .reduce((sum, field) => sum + (Number(field.credit) || 0), 0)

        //     const netCash = (applied_1 || 0) - regularDeductions

        //     return {
        //         totalDebit: debitTotal,
        //         totalCredit: creditTotal,
        //         difference: Math.abs(debitTotal - creditTotal),
        //         deductionsTotal: regularDeductions,
        //         netCashAmount: netCash,
        //         addOnTotal: addOnCharges,
        //     }
        // }, [loanEntries, applied_1])

        // // Para sa Computed/Generated Entries (Pang display lang)
        // const computedLoanEntries = useMemo(() => {
        //     const cash_on_hand = loanEntries[0]
        //     const found_account_entry = loanEntries[1]

        //     const account_entry: ILoanTransactionEntryRequest = {
        //         ...found_account_entry,
        //         type: 'static',
        //         index: 1,
        //         account,
        //         account_id: account?.id,
        //         name: account?.name || 'No account name',
        //         description: account?.description || 'No Description',
        //     }

        //     const add_on_entry = loanEntries.find(
        //         (entry) => entry.type === 'add-on' && !!entry.id
        //     )

        //     if (!cash_on_hand || !account_entry || !applied_1) return []

        //     const deductionEntries = loanEntries.filter(
        //         (entry) => entry.type === 'deduction'
        //     )

        //     const addOnCharges = deductionEntries
        //         .filter((entry) => entry.is_add_on)
        //         .reduce((sum, entry) => sum + (Number(entry.credit) || 0), 0)

        //     let allEntries = []

        //     const addOnEntry: ILoanTransactionEntryRequest[] =
        //         addOnCharges > 0 && is_add_on
        //             ? [
        //                   {
        //                       ...add_on_entry,
        //                       account_id: undefined,
        //                       account: undefined,
        //                       debit: addOnCharges || 0,
        //                       credit: 0,
        //                       index: 1 + deductionEntries.length,
        //                       name: 'Add-On',
        //                       description: 'Add on Interest',
        //                       is_add_on: false,
        //                       type: 'add-on',
        //                   },
        //               ]
        //             : []

        //     allEntries = [
        //         ...loanEntries.slice(0, 2),
        //         ...deductionEntries,
        //         ...addOnEntry,
        //     ]

        //     return allEntries
        // }, [account, applied_1, is_add_on, loanEntries])

        // // Pang stable deduction tracking
        // const deductionEntries = useMemo(() => {
        //     return loanEntries.filter((entry) => entry.type === 'deduction')
        // }, [loanEntries])

        // // Pang stable entry signature dependency
        // // need to para di mag unexpected reupdate sa pang updat eng COH
        // const deductionsSignature = useMemo(() => {
        //     return deductionEntries
        //         .map(
        //             (entry) =>
        //                 `${entry.id || 'new'}:${entry.account_id}:${entry.credit}:${entry.is_add_on}`
        //         )
        //         .join('|')
        // }, [deductionEntries])

        // // Pang update ng COH, ADD_ON entry
        // useEffect(() => {
        //     if (!applied_1 || !account) return

        //     const entries = form.getValues('loan_transaction_entries')

        //     // Totals
        //     const regularDeductions = deductionEntries
        //         .filter((entry) => !entry.is_add_on)
        //         .reduce((sum, entry) => sum + (Number(entry.credit) || 0), 0)

        //     const addOnCharges = deductionEntries
        //         .filter((entry) => entry.is_add_on)
        //         .reduce((sum, entry) => sum + (Number(entry.credit) || 0), 0)

        //     const cashEntry = entries[0]

        //     // Update (Cash on Hand) Entry
        //     if (cashEntry) {
        //         const newCashCredit = is_add_on
        //             ? applied_1 - regularDeductions
        //             : applied_1 - (regularDeductions + addOnCharges)

        //         if (cashEntry.credit !== newCashCredit) {
        //             update(0, {
        //                 ...cashEntry,
        //                 credit: newCashCredit,
        //                 debit: 0,
        //             })
        //         }
        //     }

        //     // Update (Loan Account)
        //     const loanAccountEntry = entries[1]
        //     if (loanAccountEntry && account) {
        //         const shouldUpdate =
        //             loanAccountEntry.account_id !== account.id ||
        //             loanAccountEntry.debit !== applied_1

        //         if (shouldUpdate) {
        //             update(1, {
        //                 ...loanAccountEntry,
        //                 account_id: account.id,
        //                 account: account,
        //                 name: account.name,
        //                 description: account.description || 'Loan account',
        //                 debit: applied_1,
        //                 credit: 0,
        //             })
        //         }
        //     }

        //     // Add/Update/Remove add-on entry
        //     const currentAddOnIndex = entries.findIndex(
        //         (entry) => entry.type === 'add-on'
        //     )
        //     const shouldHaveAddOn = is_add_on && addOnCharges > 0
        //     const expectedAddOnIndex = 2 + deductionEntries.length // nilagay ko sa pang last na index

        //     if (shouldHaveAddOn) {
        //         const addOnEntryData = {
        //             id:
        //                 currentAddOnIndex !== -1
        //                     ? entries[currentAddOnIndex].id
        //                     : undefined,
        //             account_id: undefined,
        //             account: undefined,
        //             debit: addOnCharges,
        //             credit: 0,
        //             index: expectedAddOnIndex,
        //             name: 'Add-On',
        //             description: 'Add on Interest',
        //             is_add_on: false,
        //             type: 'add-on' as const,
        //         }

        //         if (currentAddOnIndex === -1) {
        //             // Add add on entry
        //             append(addOnEntryData)
        //         } else if (currentAddOnIndex !== expectedAddOnIndex) {
        //             // Modify existing add on index since may na add/naremove sa deductions
        //             const currentAddOn = entries[currentAddOnIndex]
        //             remove(currentAddOnIndex)
        //             append({
        //                 ...addOnEntryData,
        //                 id: currentAddOn.id,
        //             })
        //         } else {
        //             // Update sa existing add-on entry
        //             const currentAddOn = entries[currentAddOnIndex]
        //             if (currentAddOn.debit !== addOnCharges) {
        //                 update(currentAddOnIndex, addOnEntryData)
        //             }
        //         }
        //     } else {
        //         // Remove if not need add on entry
        //         if (currentAddOnIndex !== -1) {
        //             const addOnToRemove = entries[currentAddOnIndex]
        //             if (addOnToRemove.id) {
        //                 addToDeletedField(addOnToRemove.id)
        //             }
        //             remove(currentAddOnIndex)
        //         }
        //     }
        // }, [
        //     is_add_on,
        //     applied_1,
        //     account,
        //     deductionEntries,
        //     deductionsSignature,
        //     append,
        //     update,
        //     remove,
        //     addToDeletedField,
        //     form,
        // ])

*/
