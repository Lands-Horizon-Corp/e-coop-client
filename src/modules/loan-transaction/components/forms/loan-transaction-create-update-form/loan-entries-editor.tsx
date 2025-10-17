import { KeyboardEvent, forwardRef, memo, useRef, useState } from 'react'

import { UseFormReturn } from 'react-hook-form'
import { toast } from 'sonner'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker, IAccount } from '@/modules/account'
import AccountMiniCard from '@/modules/account/components/account-mini-card'
import { currencyFormat } from '@/modules/currency'
import {
    ILoanTransactionEntry,
    useDeleteLoanTransactionEntryById,
    useLoanTransactionEntryRestoreById,
} from '@/modules/loan-transaction-entry'
import { LoanTransactionEntryCreateUpdateModal } from '@/modules/loan-transaction-entry/components/forms/loan-transaction-entry-create-update-modal'
import {
    getLoanTransactionById,
    useLoanTransactionChangeCashEquivalenceAccount,
} from '@/modules/loan-transaction/loan-transaction.service'
import { ILoanTransaction } from '@/modules/loan-transaction/loan-transaction.types'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    ArrowDownIcon,
    CalendarNumberIcon,
    EyeIcon,
    EyeNoneIcon,
    PencilFillIcon,
    PlusIcon,
    RefreshIcon,
    RenderIcon,
    ShapesIcon,
    SwapArrowIcon,
    TIcon,
    TrashIcon,
} from '@/components/icons'
import Modal from '@/components/modals/modal'
import ActionTooltip from '@/components/tooltips/action-tooltip'
import InfoTooltip from '@/components/tooltips/info-tooltip'
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
import { Toggle } from '@/components/ui/toggle'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

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
        const [showDeleted, setShowDeleted] = useState(false)
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
        const loanType = form.watch('loan_type')

        const amortization = form.watch('amortization') || 0

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

        const handleGetLoanTransactionEntry = () => {
            toast.promise(
                getLoanTransactionById({ id: loanTransactionId as TEntityId }),
                {
                    loading: 'Fetching latest loan transaction data...',
                    success: (data) => {
                        form.reset(data)
                        return 'Loan transaction data updated'
                    },
                    error: (err) =>
                        `Failed to fetch latest loan transaction data ${serverRequestErrExtractor({ error: err })}`,
                }
            )
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
                                accountId={
                                    originalEntry.account_id as TEntityId
                                }
                                className="border-dashed border-2 border-destructive bg-destructive/40"
                                defaultAccount={originalEntry.account}
                            />
                            <ArrowDownIcon className="size-4 shrink-0" />
                            <AccountMiniCard
                                accountId={account.id}
                                className="border-2 border-primary"
                                defaultAccount={account}
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
                    disabled={isReadOnly || isDisabled}
                    modalState={cashAccountPickerModal}
                    mode="cash-and-cash-equivalence"
                    onSelect={handleChangeCashEntryAccount}
                    triggerClassName="sr-only"
                />
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <p className="font-medium">
                            Loan Entries
                            <span
                                className={`text-xs px-2 py-1 ml-2 rounded-sm ${
                                    isBalanced
                                        ? 'bg-green-300 dark:bg-green-300/20 text-green-800 dark:text-green-400'
                                        : 'bg-destructive text-destructive-foreground'
                                }`}
                            >
                                {isBalanced
                                    ? '✓ Balanced'
                                    : `⚠ Difference: ${currencyFormat(
                                          difference,
                                          form.watch('account').currency
                                      )}`}
                            </span>
                        </p>
                        {deductionsTotal > 0 && (
                            <p className="text-xs text-muted-foreground">
                                <span className="ml-1 text-orange-600">
                                    (
                                    {currencyFormat(
                                        deductionsTotal,
                                        form.watch('account').currency
                                    )}{' '}
                                    deducted)
                                </span>
                            </p>
                        )}
                        {totalAddOns > 0 && (
                            <p className="text-xs text-green-600">
                                Add-on charges:{' '}
                                {currencyFormat(
                                    totalAddOns,
                                    form.watch('account').currency
                                )}
                            </p>
                        )}
                    </div>
                    <div className="flex items-center shrink-0 flex-1 justify-end gap-2">
                        <Button
                            className="size-fit px-2 py-0.5 text-xs"
                            disabled={isReadOnly || isDisabled}
                            onClick={() =>
                                cashAccountPickerModal.onOpenChange(true)
                            }
                            size="sm"
                            tabIndex={0}
                            type="button"
                            variant="ghost"
                        >
                            Change Cash Equivalence
                            <SwapArrowIcon className="inline" />
                        </Button>
                        <Button
                            className="size-fit px-2 py-0.5 text-xs"
                            disabled={
                                isReadOnly ||
                                isDisabled ||
                                loanType === 'renewal without deduction'
                            }
                            onClick={() =>
                                addChargeModalState.onOpenChange(true)
                            }
                            size="sm"
                            tabIndex={0}
                            type="button"
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
                            className="w-fit"
                            control={form.control}
                            name="is_add_on"
                            render={({ field }) => (
                                <div className="border-input has-data-[state=checked]:border-primary/50 border-2 has-data-[state=checked]:bg-primary/20 duration-200 ease-in-out relative flex w-fit items-center gap-2 rounded-xl px-2 py-0.5 shadow-xs outline-none">
                                    <Switch
                                        aria-describedby={`loan-add-on-description`}
                                        checked={field.value}
                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                        disabled={isReadOnly || isDisabled}
                                        id="loan-add-on"
                                        onCheckedChange={field.onChange}
                                        tabIndex={0}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <ShapesIcon className="text-primary size-4" />
                                        <div className="text-xs flex items-center gap-x-2">
                                            <Label
                                                className="text-xs"
                                                htmlFor={'loan-add-on'}
                                            >
                                                Add-On{' '}
                                            </Label>
                                            <p
                                                className="text-muted-foreground text-xs"
                                                id="loan-add-on-description"
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
                    onKeyDown={handleKeyDown}
                    ref={ref}
                    tabIndex={0}
                    wrapperClassName="max-h-[95vh] bg-secondary rounded-xl ecoop-scroll"
                >
                    {loanTransactionId && (
                        <LoanTransactionEntryCreateUpdateModal
                            {...addChargeModalState}
                            formProps={{
                                onSuccess: (newLoanTransaction) =>
                                    form.reset(newLoanTransaction),
                                loanTransactionId,
                            }}
                        />
                    )}
                    <TableHeader>
                        <TableRow className="bg-secondary/40">
                            <TableHead>Description</TableHead>
                            <TableHead className="text-right">Debit</TableHead>
                            <TableHead className="text-right">Credit</TableHead>
                            <TableHead className="w-16">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {loanEntries
                            .filter((entry) => {
                                if (showDeleted) return true
                                return !entry.is_automatic_loan_deduction_deleted
                            })
                            .map((loanEntry, index) => (
                                <LoanEntryRow
                                    entry={loanEntry}
                                    form={form}
                                    key={`${loanEntry.id}`}
                                    onDelete={() =>
                                        handleGetLoanTransactionEntry()
                                    }
                                    onRestore={(newLoanTransaction) =>
                                        form.reset(newLoanTransaction)
                                    }
                                    ref={(el) => {
                                        rowRefs.current[index] = el
                                    }}
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
                            <TableCell className="font-semibold flex items-center gap-2">
                                <ActionTooltip tooltipContent="Show/Hide deleted automatic deductions">
                                    <Toggle
                                        className="!p-2 size-fit"
                                        disabled={
                                            loanType ===
                                            'renewal without deduction'
                                        }
                                        onPressedChange={(state) => {
                                            toast.info(
                                                state
                                                    ? 'Deleted deductions shown'
                                                    : 'Deleted deductions hidden'
                                            )
                                            setShowDeleted(state)
                                        }}
                                        pressed={showDeleted}
                                    >
                                        {showDeleted ? (
                                            <EyeIcon />
                                        ) : (
                                            <EyeNoneIcon />
                                        )}
                                    </Toggle>
                                </ActionTooltip>
                                <AmortizationView
                                    loanTransactionId={loanTransactionId}
                                />
                                <InfoTooltip content="Total interest to be paid for this loan.">
                                    <span className="py-1 px-3 rounded-md bg-primary/50 font-mono terxt-primary-foreground">
                                        {currencyFormat(
                                            amortization,
                                            form.watch('account').currency
                                        )}
                                    </span>
                                </InfoTooltip>
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {currencyFormat(
                                    totalDebit,
                                    form.watch('account').currency
                                )}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                                {currencyFormat(
                                    totalCredit,
                                    form.watch('account').currency
                                )}
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
    entry: ILoanTransactionEntry
    form: UseFormReturn<TLoanTransactionSchema>
    disabled?: boolean
    onDelete?: () => void
    onRestore?: (newLoanTransaction: ILoanTransaction) => void
}

const LoanEntryRow = memo(
    forwardRef<HTMLTableRowElement, ILoanEntryRowProps>(
        ({ entry, disabled, form, onDelete, onRestore }, ref) => {
            const rowRef = useRef<HTMLTableRowElement>(null)
            const { onOpen } = useConfirmModalStore()

            const editModalState = useModalState()

            const isEditable = entry.type.includes('deduction')
            const isRemovable = entry.type.includes('deduction')

            const deleteMutation = useDeleteLoanTransactionEntryById()

            const handleDelete = () => {
                onOpen({
                    title: 'Remove Entry',
                    content: `Are you sure you want to remove entry?`,
                    confirmString: 'Remove',
                    onConfirm: () => {
                        toast.promise(
                            deleteMutation.mutateAsync(entry.id as TEntityId),
                            {
                                loading: 'Removing entry...',
                                success: () => {
                                    onDelete?.()
                                    return 'Entry removed'
                                },
                                error: (err) =>
                                    `Failed to remove entry ${serverRequestErrExtractor({ error: err })}`,
                            }
                        )
                    },
                })
            }

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

                    handleDelete()
                } else if (e.key === 'F2') {
                    if (!isEditable)
                        return toast.info(`Entry ${entry.name} not editable`)
                    e.preventDefault()
                    e.stopPropagation()
                    editModalState.onOpenChange(true)
                }
            }

            const restoreMutation = useLoanTransactionEntryRestoreById({
                options: {
                    onSuccess: onRestore,
                },
            })

            return (
                <>
                    <TableRow
                        className={cn(
                            'focus:bg-background/20',
                            entry.is_automatic_loan_deduction_deleted &&
                                'opacity-50 italic'
                        )}
                        onDoubleClick={() => {
                            if (disabled) return
                            editModalState.onOpenChange(true)
                        }}
                        onKeyDown={handleRowKeyDown}
                        ref={(el) => {
                            rowRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        tabIndex={0}
                    >
                        <TableCell className="py-2 h-fit">
                            <div className="flex flex-col">
                                <span className="font-medium flex gap-x-1 items-center">
                                    {entry.account?.icon && (
                                        <RenderIcon
                                            icon={entry.account.icon as TIcon}
                                        />
                                    )}
                                    {entry.name || 'Unknown'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {entry.description || '...'}
                                </span>
                                <div className="flex gap-2 mt-1">
                                    {entry.is_automatic_loan_deduction_deleted && (
                                        <span className="text-xs text-destructive-foreground bg-destructive p-1 rounded-md font-medium">
                                            • Deleted
                                        </span>
                                    )}
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
                                    {entry.type === 'automatic-deduction' && (
                                        <span className="text-xs text-blue-600 font-medium">
                                            • Automatic Deduction
                                        </span>
                                    )}
                                    {entry.type === 'previous' && (
                                        <span className="text-xs text-orange-400 font-medium">
                                            • Previous Loan
                                        </span>
                                    )}
                                    {entry.type.includes('deduction') &&
                                        entry.is_add_on && (
                                            <span className="text-xs text-green-600 font-medium">
                                                • Add-On
                                            </span>
                                        )}
                                </div>
                            </div>
                        </TableCell>
                        <TableCell className="text-right py-2 h-fit">
                            {entry.debit
                                ? `${currencyFormat(
                                      entry.debit,
                                      form.watch('account').currency
                                  )}`
                                : ''}
                        </TableCell>
                        <TableCell className="text-right py-2 h-fit">
                            {entry.credit
                                ? `${currencyFormat(
                                      entry.credit,
                                      form.watch('account').currency
                                  )}`
                                : ''}
                        </TableCell>
                        <TableCell className="text-right py-2 h-fit">
                            <div className="flex gap-1">
                                {isEditable &&
                                    !entry.is_automatic_loan_deduction_deleted && (
                                        <Button
                                            className="size-8 p-0"
                                            disabled={disabled}
                                            onClick={() =>
                                                editModalState.onOpenChange(
                                                    true
                                                )
                                            }
                                            size="sm"
                                            type="button"
                                            variant="ghost"
                                        >
                                            <PencilFillIcon className="size-4" />
                                            <span className="sr-only">
                                                Edit entry
                                            </span>
                                        </Button>
                                    )}
                                {isRemovable &&
                                    !entry.is_automatic_loan_deduction_deleted && (
                                        <Button
                                            className="h-8 w-8 p-0"
                                            disabled={disabled}
                                            onClick={() => handleDelete()}
                                            size="sm"
                                            type="button"
                                            variant="destructive"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                            <span className="sr-only">
                                                Remove entry
                                            </span>
                                        </Button>
                                    )}
                                {entry.is_automatic_loan_deduction_deleted && (
                                    <Button
                                        className="size-8 p-0"
                                        disabled={disabled}
                                        onClick={() =>
                                            toast.promise(
                                                restoreMutation.mutateAsync(
                                                    entry.id
                                                ),
                                                {
                                                    loading:
                                                        'Restoring entry...',
                                                    success: 'Entry restored',
                                                    error: (err) =>
                                                        `Failed to restore entry ${serverRequestErrExtractor({ error: err })}`,
                                                }
                                            )
                                        }
                                        size="sm"
                                        type="button"
                                        variant="ghost"
                                    >
                                        <RefreshIcon className="size-4" />
                                        <span className="sr-only">Restore</span>
                                    </Button>
                                )}
                            </div>
                        </TableCell>
                    </TableRow>
                    <LoanTransactionEntryCreateUpdateModal
                        {...editModalState}
                        description="Update the deduction details."
                        formProps={{
                            defaultValues: entry,
                            loanTransactionId: entry.loan_transaction_id,
                            id: entry.id,
                            onSuccess: (updatedData) => {
                                form.reset(updatedData)
                            },
                        }}
                        onOpenChange={(state) => {
                            if (!state) {
                                rowRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Deduction"
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
                    className="!max-w-[90vw] p-0 shadow-none border-none bg-transparent gap-y-0"
                    closeButtonClassName="top-2 right-2"
                    description=""
                    descriptionClassName="sr-only"
                    title=""
                    titleClassName="sr-only"
                >
                    <LoanAmortization
                        className="col-span-5 p-0 bg-transparent"
                        loanTransactionId={loanTransactionId}
                    />
                </Modal>
            )}
            <Button
                aria-label="See amortization"
                aria-name="View amortization"
                className="text-xs size-fit !pl-4 py-0.5"
                disabled={!loanTransactionId}
                onClick={() => amortViewer.onOpenChange(!amortViewer.open)}
                size="sm"
                type="button"
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
