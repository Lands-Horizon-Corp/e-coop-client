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
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}

const LoanTermsAndConditionReceiptSection = ({ form, isDisabled }: Props) => {
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
                        control={form.control}
                        name="remarks_payroll_deduction"
                        className="w-fit"
                        render={({ field }) => (
                            <div className="inline-flex items-center gap-2">
                                <Switch
                                    id={field.name}
                                    aria-label="Toggle payroll deduction"
                                    aria-describedby="payroll-deduction-desc"
                                    checked={field.value || false}
                                    onCheckedChange={field.onChange}
                                    disabled={isDisabled(field.name)}
                                />
                                <Label
                                    htmlFor={field.name}
                                    className="text-sm font-medium"
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
                    name="remarks_other_terms"
                    label="Remarks"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            id={field.name}
                            placeholder="Remarks other terms"
                            disabled={isDisabled(field.name)}
                            aria-describedby="remarks-help"
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
            />

            <LoanTermsAndConditionReceiptField
                form={form}
                isDisabled={isDisabled}
            />

            <div className="grid grid-cols-2 gap-x-3">
                <FormFieldWrapper
                    control={form.control}
                    name="collateral_offered"
                    label="Collateral Offered"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            id={field.name}
                            placeholder="Collateral Offered"
                            disabled={isDisabled(field.name)}
                            aria-describedby="collateral-help"
                        />
                    )}
                />

                <FormFieldWrapper
                    control={form.control}
                    name="record_of_loan_payments_or_loan_status"
                    label="Record of Loan Payments / Loan Status"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            id={field.name}
                            placeholder="Record of loan payments or loan status"
                            disabled={isDisabled(field.name)}
                            aria-describedby="payments-help"
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
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
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

    useHotkeys('shift+r', () => {
        addReceiptModal?.onOpenChange(true)
    })

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
                disabled={disabled}
                className="space-y-2"
                aria-labelledby="receipts-section"
            >
                <div className="flex items-center justify-between">
                    <p className="font-medium" id="receipts-section">
                        Amount Receipts
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            type="button"
                            tabIndex={0}
                            className="size-fit px-2 py-0.5 text-xs"
                            onClick={() => addReceiptModal.onOpenChange(true)}
                            aria-label="Add new receipt"
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
                            ref={field.ref}
                            role="list"
                            aria-label="Amount receipts list"
                            className="grid grid-cols-1 md:grid-cols-3 max-h-[50vh] overflow-y-auto ecoop-scroll lg:grid-cols-4 bg-muted border rounded-xl p-2 gap-4"
                        >
                            {receipts.map((receipt, index) => (
                                <LoanTermsAndConditionReceiptCard
                                    key={receipt.fieldKey}
                                    receipt={receipt}
                                    index={index}
                                    ref={(el) => {
                                        cardRefs.current[index] = el
                                    }}
                                    onRemove={handleRemoveReceipt}
                                    onUpdate={handleUpdateReceipt}
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
    onRemove: (index: number, id?: TEntityId) => void
    onUpdate: (
        index: number,
        updatedData: ILoanTermsAndConditionAmountReceiptRequest
    ) => void
}

const LoanTermsAndConditionReceiptCard = memo(
    forwardRef<HTMLDivElement, ILoanTermsAndConditionReceiptCardProps>(
        ({ receipt, index, onRemove, onUpdate }, ref) => {
            const cardRef = useRef<HTMLDivElement>(null)
            const editModalState = useModalState()

            const handleCardKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
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
                        ref={(el) => {
                            cardRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        tabIndex={0}
                        role="listitem"
                        onKeyDown={handleCardKeyDown}
                        aria-label={`Receipt ${index + 1}: ${receipt.account_id || 'No account'}, Amount: ${formatNumber(receipt.amount || 0)}`}
                        className="cursor-pointer relative group flex flex-col focus-within:bg-background transition-colors hover:bg-background focus:ring-2 focus:ring-ring focus:outline-0 rounded-lg border border-popover bg-background/60 p-4"
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
                                    type="button"
                                    size="icon"
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        editModalState.onOpenChange(true)
                                    }}
                                    className="size-fit p-1"
                                    aria-label={`Edit receipt ${index + 1}`}
                                >
                                    <PencilFillIcon className="size-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    type="button"
                                    variant="destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemove(index, receipt.id)
                                    }}
                                    className="size-fit p-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                    aria-label={`Remove receipt ${index + 1}`}
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
                        title="Edit Amount Receipt"
                        description="Update the amount receipt details."
                        formProps={{
                            defaultValues: receipt,
                            onSuccess: (updatedData) => {
                                onUpdate(index, { ...receipt, ...updatedData })
                            },
                        }}
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
    isDisabled,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
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

    useHotkeys('shift+p', () => {
        addSuggestedPaymentModal?.onOpenChange(true)
    })

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
                disabled={disabled}
                className="space-y-2"
                aria-labelledby="suggested-payments-section"
            >
                <div className="flex items-center justify-between">
                    <p className="font-medium" id="suggested-payments-section">
                        Suggested Payment
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            size="sm"
                            type="button"
                            tabIndex={0}
                            className="size-fit px-2 py-0.5 text-xs"
                            onClick={() =>
                                addSuggestedPaymentModal.onOpenChange(true)
                            }
                            aria-label="Add new suggested payment"
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
                            ref={field.ref}
                            role="list"
                            aria-label="Suggested payment list"
                            className="grid grid-cols-1 md:grid-cols-2 max-h-[50vh] overflow-y-auto ecoop-scroll lg:grid-cols-3 bg-muted border rounded-xl p-2 gap-4"
                        >
                            {suggestedPayments.map((payment, index) => (
                                <LoanTermsAndConditionSuggestedPaymentCard
                                    key={payment.fieldKey}
                                    payment={payment}
                                    index={index}
                                    ref={(el) => {
                                        cardRefs.current[index] = el
                                    }}
                                    onRemove={handleRemoveSuggestedPayment}
                                    onUpdate={handleUpdateSuggestedPayment}
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
                        ref={(el) => {
                            cardRef.current = el
                            if (typeof ref === 'function') {
                                ref(el)
                            } else if (ref) {
                                ref.current = el
                            }
                        }}
                        tabIndex={0}
                        role="listitem"
                        onKeyDown={handleCardKeyDown}
                        aria-label={`Payment method ${index + 1}: ${payment.name || 'Unnamed payment method'}`}
                        className="cursor-pointer relative group flex flex-col focus-within:bg-background transition-colors hover:bg-background focus:ring-2 focus:ring-ring focus:outline-0 rounded-lg border border-popover bg-background/60 p-4"
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
                                    type="button"
                                    size="icon"
                                    variant="secondary"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        editModalState.onOpenChange(true)
                                    }}
                                    className="size-fit p-1"
                                    aria-label={`Edit suggested payment ${index + 1}`}
                                >
                                    <PencilFillIcon className="size-3" />
                                </Button>
                                <Button
                                    size="icon"
                                    type="button"
                                    variant="destructive"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        onRemove(index, payment.id)
                                    }}
                                    className="size-fit p-1 text-destructive hover:text-destructive-foreground hover:bg-destructive"
                                    aria-label={`Name ${index + 1}`}
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
                        onOpenChange={(state) => {
                            if (!state) {
                                cardRef.current?.focus()
                            }
                            editModalState.onOpenChange(state)
                        }}
                        title="Edit Suggested Payment"
                        description="Update the suggested payment details."
                        formProps={{
                            defaultValues: payment,
                            onSuccess: (updatedData) => {
                                onUpdate(index, { ...payment, ...updatedData })
                            },
                        }}
                    />
                </>
            )
        }
    )
)

LoanTermsAndConditionSuggestedPaymentCard.displayName =
    'LoanTermsAndConditionSuggestedPaymentCard'

export default LoanTermsAndConditionReceiptSection
