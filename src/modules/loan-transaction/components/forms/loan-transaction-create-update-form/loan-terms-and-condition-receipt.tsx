import { KeyboardEvent, forwardRef, memo, useRef } from 'react'

import { Path, UseFormReturn, useFieldArray } from 'react-hook-form'
import { toast } from 'sonner'

import { formatNumber } from '@/helpers'
import { ILoanTermsAndConditionAmountReceiptRequest } from '@/modules/loan-terms-and-condition-amount-receipt'
import { LoanTermsAndConditionAmountReceiptCreateModal } from '@/modules/loan-terms-and-condition-amount-receipt/components/forms/loan-terms-and-condition-amount-receipt-create-update-form'
import { ILoanTermsAndConditionSuggestedPaymentRequest } from '@/modules/loan-terms-and-condition-suggested-payment'
import { LoanTermsAndConditionSuggestedPaymentCreateModal } from '@/modules/loan-terms-and-condition-suggested-payment/components/forms/loan-terms-and-condition-suggested-payment-create-update-form'
import { useHotkeys } from 'react-hotkeys-hook'

import {
    CheckFillIcon,
    CreditCardIcon,
    PencilFillIcon,
    PlusIcon,
    QuestionCircleFillIcon,
    ReceiptIcon,
    RenderIcon,
    TrashIcon,
} from '@/components/icons'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { useModalState } from '@/hooks/use-modal-state'

import { TEntityId } from '@/types'

import { TLoanTransactionSchema } from '../../../loan-transaction.validation'

type Props = {
    form: UseFormReturn<TLoanTransactionSchema>
    isReadOnly?: boolean
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}

const LoanTermsAndConditionReceiptSection = ({
    form,
    isReadOnly,
    isDisabled,
}: Props) => {
    return (
        <div className="space-y-4">
            <div className="space-y-4 rounded-xl bg-popover">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="font-medium">
                            Terms and Condition / Receipt
                        </p>
                    </div>
                    <FormFieldWrapper
                        className="w-fit"
                        control={form.control}
                        name="remarks_payroll_deduction"
                        render={({ field }) => (
                            <div className="inline-flex items-center gap-2">
                                <Switch
                                    aria-describedby="payroll-deduction-desc"
                                    aria-label="Toggle payroll deduction"
                                    checked={field.value || false}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    onCheckedChange={field.onChange}
                                />
                                <Label
                                    className="text-sm font-medium"
                                    htmlFor={field.name}
                                    id="payroll-deduction-desc"
                                >
                                    Payroll Deduction
                                </Label>
                            </div>
                        )}
                    />
                </div>

                <FormFieldWrapper
                    control={form.control}
                    label="Remarks"
                    name="remarks_other_terms"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            aria-describedby="remarks-help"
                            disabled={isDisabled(field.name)}
                            id={field.name}
                            placeholder="Remarks other terms"
                        />
                    )}
                />
                <div className="sr-only" id="remarks-help">
                    Additional terms and conditions for this loan
                </div>
            </div>

            <LoanTermsAndConditionSuggestedPaymentField
                form={form}
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
            />

            <LoanTermsAndConditionReceiptField
                form={form}
                isDisabled={isDisabled}
                isReadOnly={isReadOnly}
            />

            <div className="grid grid-cols-2 gap-x-3">
                <FormFieldWrapper
                    control={form.control}
                    label="Collateral Offered"
                    name="collateral_offered"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            aria-describedby="collateral-help"
                            disabled={isDisabled(field.name)}
                            id={field.name}
                            placeholder="Collateral Offered"
                        />
                    )}
                />

                <FormFieldWrapper
                    control={form.control}
                    label="Record of Loan Payments / Loan Status"
                    name="record_of_loan_payments_or_loan_status"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            aria-describedby="payments-help"
                            disabled={isDisabled(field.name)}
                            id={field.name}
                            placeholder="Record of loan payments or loan status"
                        />
                    )}
                />

                <div className="sr-only" id="collateral-help">
                    Security or assets offered as guarantee for the loan
                </div>
                <div className="sr-only" id="payments-help">
                    Historical payment records and current loan status
                </div>
            </div>
        </div>
    )
}

// LOAN TERMS AND CONDITION RECEIPT FIELD
const LoanTermsAndConditionReceiptField = ({
    form,
    isReadOnly,
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
    isReadOnly?: boolean
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}) => {
    const addReceiptModal = useModalState()
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])

    const {
        fields: receipts,
        remove,
        update,
        append,
    } = useFieldArray({
        control: form.control,
        name: 'loan_terms_and_condition_amount_receipt',
        keyName: 'fieldKey',
    })

    const { append: addDeletedReceipt } = useFieldArray({
        control: form.control,
        name: 'loan_terms_and_condition_amount_receipt_deleted',
        keyName: 'fieldKey',
    })

    useHotkeys(
        'shift+r',
        () => {
            addReceiptModal?.onOpenChange(true)
        },
        { enabled: !isReadOnly }
    )

    const disabled = isDisabled('loan_terms_and_condition_amount_receipt')

    const handleRemoveReceipt = (index: number, id?: TEntityId) => {
        remove(index)
        if (id) addDeletedReceipt(id)
        toast.warning(
            <span>Receipt Removed. Don&apos;t forget to save changes.</span>
        )
    }

    const handleUpdateReceipt = (
        index: number,
        updatedData: ILoanTermsAndConditionAmountReceiptRequest
    ) => {
        const currentReceipt = receipts[index]
        const mergedData = { ...currentReceipt, ...updatedData }
        update(index, mergedData)
        toast(
            <span>
                <CheckFillIcon className="mr-1 text-primary inline" /> Receipt
                Updated. Don&apos;t forget to save changes.
            </span>
        )
    }

    return (
        <>
            <LoanTermsAndConditionAmountReceiptCreateModal
                {...addReceiptModal}
                formProps={{
                    loanTransactionId: form.getValues('id'),
                    onSuccess: (receipt) => {
                        append(receipt)
                        toast(
                            <span>
                                <PlusIcon className="mr-1 text-primary inline" />{' '}
                                Receipt Added. Don&apos;t forget to save
                                changes.
                            </span>
                        )
                    },
                }}
            />

            <fieldset
                aria-labelledby="receipts-section"
                className="space-y-2"
                disabled={disabled}
            >
                <div className="flex items-center justify-between">
                    <p className="font-medium" id="receipts-section">
                        Amount Receipts
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            aria-label="Add new receipt"
                            className="size-fit px-2 py-0.5 text-xs"
                            onClick={() => addReceiptModal.onOpenChange(true)}
                            size="sm"
                            tabIndex={0}
                            type="button"
                        >
                            Add <PlusIcon className="inline" />
                        </Button>
                        <p className="text-xs p-1 px-2 bg-muted text-muted-foreground rounded-sm">
                            or Press{' '}
                            <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                                Shift + R
                            </CommandShortcut>
                        </p>
                    </div>
                </div>
                <FormFieldWrapper
                    control={form.control}
                    name="loan_terms_and_condition_amount_receipt"
                    render={({ field }) => (
                        <div
                            aria-label="Amount receipts list"
                            className="grid grid-cols-1 md:grid-cols-3 max-h-[50vh] overflow-y-auto ecoop-scroll lg:grid-cols-4 bg-muted border rounded-xl p-2 gap-4"
                            ref={field.ref}
                            role="list"
                        >
                            {receipts.map((receipt, index) => (
                                <LoanTermsAndConditionReceiptCard
                                    disabled={
                                        isReadOnly || isDisabled(field.name)
                                    }
                                    index={index}
                                    key={receipt.fieldKey}
                                    onRemove={handleRemoveReceipt}
                                    onUpdate={handleUpdateReceipt}
                                    receipt={receipt}
                                    ref={(el) => {
                                        cardRefs.current[index] = el
                                    }}
                                />
                            ))}
                            {receipts.length === 0 && (
                                <div className="col-span-full">
                                    <div className="border-dashed border-2 bg-muted/30 rounded-lg">
                                        <div className="flex items-center justify-center py-16">
                                            <p className="text-center text-sm text-muted-foreground/80">
                                                No amount receipts yet.
                                                <br />
                                                <span className="text-xs">
                                                    Press Shift + R to add one.
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                />
            </fieldset>
        </>
    )
}

interface ILoanTermsAndConditionReceiptCardProps {
    receipt: ILoanTermsAndConditionAmountReceiptRequest & { fieldKey: string }
    index: number
    disabled?: boolean
    onRemove: (index: number, id?: TEntityId) => void
    onUpdate: (
        index: number,
        updatedData: ILoanTermsAndConditionAmountReceiptRequest
    ) => void
}

const LoanTermsAndConditionReceiptCard = memo(
    forwardRef<HTMLDivElement, ILoanTermsAndConditionReceiptCardProps>(
        ({ receipt, index, disabled, onRemove, onUpdate }, ref) => {
            const cardRef = useRef<HTMLDivElement>(null)
            const editModalState = useModalState()

            const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
                if (disabled) {
                    e.stopPropagation()
                    e.preventDefault()
                    return
                }

                if (e.key === 'Delete') {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(index, receipt.id)
                } else if (e.key === 'F2') {
                    e.preventDefault()
                    e.stopPropagation()
                    editModalState.onOpenChange(true)
                }
            }

            return (
                <>
                    <div
                        aria-label={`Receipt ${index + 1}: ${receipt.account_id || 'No account'}, Amount: ${formatNumber(receipt.amount || 0)}`}
                        className="cursor-pointer relative group flex flex-col focus-within:bg-background transition-colors hover:bg-background focus:ring-2 focus:ring-ring focus:outline-0 rounded-lg border border-popover bg-background/60 p-4"
                        onKeyDown={handleCardKeyDown}
                        ref={(el) => {
                            cardRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        role="listitem"
                        tabIndex={0}
                    >
                        <div className="flex items-start justify-between pb-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                    <RenderIcon icon={receipt.account?.icon} />{' '}
                                    {receipt.account?.name || 'No Account Name'}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                    account{' '}
                                    {receipt?.account?.description && (
                                        <InfoTooltip
                                            content={
                                                <div className="!max-w-64 p-1 block space-y-2">
                                                    <span className="block">
                                                        {receipt?.account
                                                            ?.name ||
                                                            'Unknown Account'}
                                                    </span>
                                                    <p className="text-xs text-muted-foreground">
                                                        {
                                                            receipt.account
                                                                ?.description
                                                        }
                                                    </p>
                                                </div>
                                            }
                                        >
                                            <QuestionCircleFillIcon className="inline" />
                                        </InfoTooltip>
                                    )}
                                </span>
                            </div>
                            <ReceiptIcon className="absolute top-5 right-5 text-muted-foreground" />
                            <div className="flex absolute drop-shadow-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-focus:opacity-100 ease-in-out duration-200 right-0 top-0 group-hover:-right-2 group-focus-within:-right-2 group-focus-within:-top-2.5 group-hover:-top-2.5">
                                <Button
                                    aria-label={`Edit receipt ${index + 1}`}
                                    className="size-fit p-1"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        editModalState.onOpenChange(true)
                                    }}
                                    size="icon"
                                    type="button"
                                    variant="secondary"
                                >
                                    <PencilFillIcon className="size-3" />
                                </Button>
                                <Button
                                    aria-label={`Remove receipt ${index + 1}`}
                                    className="size-fit p-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemove(index, receipt.id)
                                    }}
                                    size="icon"
                                    type="button"
                                    variant="destructive"
                                >
                                    <TrashIcon className="size-3" />
                                </Button>
                            </div>
                        </div>
                        <div className="flex items-center w-full justify-between">
                            <p className="text-xs text-muted-foreground">
                                Amount
                            </p>
                            <p className="text-lg font-semibold ">
                                {formatNumber(receipt.amount || 0, 2)}
                            </p>
                        </div>
                    </div>

                    <LoanTermsAndConditionAmountReceiptCreateModal
                        {...editModalState}
                        description="Update the amount receipt details."
                        formProps={{
                            defaultValues: receipt,
                            onSuccess: (updatedData) => {
                                onUpdate(index, { ...receipt, ...updatedData })
                            },
                        }}
                        title="Edit Amount Receipt"
                    />
                </>
            )
        }
    )
)

LoanTermsAndConditionReceiptCard.displayName =
    'LoanTermsAndConditionReceiptCard'

// LOAN TERMS AND CONDITION SUGGESTED PAYMENT FIELD
const LoanTermsAndConditionSuggestedPaymentField = ({
    form,
    isReadOnly,
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
    isReadOnly?: boolean
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}) => {
    const addSuggestedPaymentModal = useModalState()
    const cardRefs = useRef<(HTMLDivElement | null)[]>([])

    const {
        fields: suggestedPayments,
        remove,
        update,
        append,
    } = useFieldArray({
        control: form.control,
        name: 'loan_terms_and_condition_suggested_payment',
        keyName: 'fieldKey',
    })

    const { append: addDeletedSuggestedPayment } = useFieldArray({
        control: form.control,
        name: 'loan_terms_and_condition_suggested_payment_deleted',
        keyName: 'fieldKey',
    })

    useHotkeys(
        'shift+p',
        () => {
            addSuggestedPaymentModal?.onOpenChange(true)
        },
        { enabled: !isReadOnly }
    )

    const disabled = isDisabled('loan_terms_and_condition_suggested_payment')

    const handleRemoveSuggestedPayment = (index: number, id?: TEntityId) => {
        remove(index)
        if (id) addDeletedSuggestedPayment(id)
        toast.warning(
            <span>
                Suggested Payment Removed. Don&apos;t forget to save changes.
            </span>
        )
    }

    const handleUpdateSuggestedPayment = (
        index: number,
        updatedData: ILoanTermsAndConditionSuggestedPaymentRequest
    ) => {
        const currentPayment = suggestedPayments[index]
        const mergedData = { ...currentPayment, ...updatedData }
        update(index, mergedData)
        toast(
            <span>
                <CheckFillIcon className="mr-1 text-primary inline" /> Suggested
                Payment Updated. Don&apos;t forget to save changes.
            </span>
        )
    }

    return (
        <>
            <LoanTermsAndConditionSuggestedPaymentCreateModal
                {...addSuggestedPaymentModal}
                formProps={{
                    loanTransactionId: form.getValues('id'),
                    onSuccess: (payment) => {
                        append(payment)

                        toast(
                            <span>
                                <PlusIcon className="mr-1 text-primary inline" />{' '}
                                Suggested Payment Added. Don&apos;t forget to
                                save changes.
                            </span>
                        )
                    },
                }}
            />

            <fieldset
                aria-labelledby="suggested-payments-section"
                className="space-y-2"
                disabled={disabled}
            >
                <div className="flex items-center justify-between">
                    <p className="font-medium" id="suggested-payments-section">
                        Suggested Payment
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            aria-label="Add new suggested payment"
                            className="size-fit px-2 py-0.5 text-xs"
                            onClick={() =>
                                addSuggestedPaymentModal.onOpenChange(true)
                            }
                            size="sm"
                            tabIndex={0}
                            type="button"
                        >
                            Add <PlusIcon className="inline" />
                        </Button>
                        <p className="text-xs p-1 px-2 bg-muted text-muted-foreground rounded-sm">
                            or Press{' '}
                            <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm mr-1">
                                Shift + P
                            </CommandShortcut>
                        </p>
                    </div>
                </div>

                <FormFieldWrapper
                    control={form.control}
                    name="loan_terms_and_condition_suggested_payment"
                    render={({ field }) => (
                        <div
                            aria-label="Suggested payment list"
                            className="grid grid-cols-1 md:grid-cols-2 max-h-[50vh] overflow-y-auto ecoop-scroll lg:grid-cols-3 bg-muted border rounded-xl p-2 gap-4"
                            ref={field.ref}
                            role="list"
                        >
                            {suggestedPayments.map((payment, index) => (
                                <LoanTermsAndConditionSuggestedPaymentCard
                                    index={index}
                                    key={payment.fieldKey}
                                    onRemove={handleRemoveSuggestedPayment}
                                    onUpdate={handleUpdateSuggestedPayment}
                                    payment={payment}
                                    ref={(el) => {
                                        cardRefs.current[index] = el
                                    }}
                                />
                            ))}

                            {suggestedPayments.length === 0 && (
                                <div className="col-span-full">
                                    <div className="border-dashed border-2 bg-muted/30 rounded-lg">
                                        <div className="flex items-center justify-center py-16">
                                            <p className="text-center text-sm text-muted-foreground/80">
                                                No suggested payment yet.
                                                <br />
                                                <span className="text-xs">
                                                    Press Shift + P to add one.
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                />
            </fieldset>
        </>
    )
}

interface ILoanTermsAndConditionSuggestedPaymentCardProps {
    payment: ILoanTermsAndConditionSuggestedPaymentRequest & {
        fieldKey: string
    }
    index: number
    onRemove: (index: number, id?: TEntityId) => void
    onUpdate: (
        index: number,
        updatedData: ILoanTermsAndConditionSuggestedPaymentRequest
    ) => void
}

const LoanTermsAndConditionSuggestedPaymentCard = memo(
    forwardRef<HTMLDivElement, ILoanTermsAndConditionSuggestedPaymentCardProps>(
        ({ payment, index, onRemove, onUpdate }, ref) => {
            const cardRef = useRef<HTMLDivElement>(null)
            const editModalState = useModalState()

            const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
                if (e.key === 'Delete') {
                    e.preventDefault()
                    e.stopPropagation()
                    onRemove(index, payment.id)
                } else if (e.key === 'F2') {
                    e.preventDefault()
                    e.stopPropagation()
                    editModalState.onOpenChange(true)
                }
            }

            return (
                <>
                    <div
                        aria-label={`Payment method ${index + 1}: ${payment.name || 'Unnamed payment method'}`}
                        className="cursor-pointer relative group flex flex-col focus-within:bg-background transition-colors hover:bg-background focus:ring-2 focus:ring-ring focus:outline-0 rounded-lg border border-popover bg-background/60 p-4"
                        onKeyDown={handleCardKeyDown}
                        ref={(el) => {
                            cardRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        role="listitem"
                        tabIndex={0}
                    >
                        <div className="flex items-start justify-between pb-2">
                            <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm truncate">
                                    {payment.name || 'Unknown Name'}
                                </h4>
                                <span className="text-xs text-muted-foreground">
                                    Name
                                </span>
                                <CreditCardIcon className="absolute top-5 right-5 text-muted-foreground" />
                            </div>
                            <div className="flex absolute drop-shadow-sm opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 group-focus:opacity-100 ease-in-out duration-200 right-0 top-0 group-hover:-right-2 group-focus-within:-right-2 group-focus-within:-top-2.5 group-hover:-top-2.5">
                                <Button
                                    aria-label={`Edit suggested payment ${index + 1}`}
                                    className="size-fit p-1"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        editModalState.onOpenChange(true)
                                    }}
                                    size="icon"
                                    type="button"
                                    variant="secondary"
                                >
                                    <PencilFillIcon className="size-3" />
                                </Button>
                                <Button
                                    aria-label={`Name ${index + 1}`}
                                    className="size-fit p-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemove(index, payment.id)
                                    }}
                                    size="icon"
                                    type="button"
                                    variant="destructive"
                                >
                                    <TrashIcon className="size-3" />
                                </Button>
                            </div>
                        </div>

                        <div className="flex-1">
                            <p className="text-xs text-muted-foreground line-clamp-3">
                                {payment.description ||
                                    'No description provided'}
                            </p>
                        </div>
                    </div>

                    <LoanTermsAndConditionSuggestedPaymentCreateModal
                        {...editModalState}
                        description="Update the suggested payment details."
                        formProps={{
                            defaultValues: payment,
                            onSuccess: (updatedData) => {
                                onUpdate(index, { ...payment, ...updatedData })
                            },
                        }}
                        onOpenChange={(state) => {
                            if (!state) {
                                cardRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Suggested Payment"
                    />
                </>
            )
        }
    )
)

LoanTermsAndConditionSuggestedPaymentCard.displayName =
    'LoanTermsAndConditionSuggestedPaymentCard'

export default LoanTermsAndConditionReceiptSection
