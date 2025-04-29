import { useCallback } from 'react'
import { useForm, UseFormReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { Input } from '@/components/ui/input'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import {
    Form,
    FormField,
    FormItem,
    FormControl,
    FormMessage,
} from '@/components/ui/form'
import { IForm } from '@/types/components'
import { Button } from '@/components/ui/button'

import Modal, { IModalProps } from '@/components/modals/modal'

import AccountsPicker from '@/components/pickers/accounts-picker'
import TransactionPaymentTypesPicker from '@/components/pickers/transaction-payment-types-picker'
import CheckClearingFormModal from './create-check-clearing-form'

import {
    DEFAULT_TRANSACTION_TYPE,
    paymentsEntrySchema,
} from '@/validations/transactions/payments-entry'

import {
    capitalize,
    commaSeparators,
    formatNumberOnBlur,
    isValidDecimalInput,
    sanitizeNumberInput,
} from '@/helpers'
import { cn } from '@/lib'
import { TEntityId } from '@/types'
import {
    IPaymentsEntry,
    IPaymentsEntryRequest,
    TRANSACTION_TYPE,
} from '@/types/coop-types/transactions/payments-entry'
import { IClassProps } from '@/types'
import { Separator } from '@/components/ui/separator'
import { AccountsIcon, MoneyIcon } from '@/components/icons'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useShortcut } from '@/components/use-shorcuts'
import { useMemberPickerStore } from '@/store/use-member-picker-state-store'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import {
    usePaymentsDataStore,
    usePaymentsModalStore,
} from '@/store/transaction/payments-entry-store'
import { toast } from 'sonner'
import { useCreatePaymentEntry } from '@/hooks/api-hooks/transactions/use-payments-entry'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { IGenerateORNumberResource } from '@/types/coop-types/transactions/generate-or-number'
import { RefetchOptions, QueryObserverResult } from '@tanstack/react-query'

const CHECK_BANK_LIST = ['trans-pay-002', 'trans-pay-003']

export type TPaymentFormValues = z.infer<typeof paymentsEntrySchema>

export interface IPaymentFormProps
    extends IClassProps,
        IForm<TPaymentFormValues> {
    selectedMemberId: TEntityId
    error?: string
    ORNumber?: number
    hadSelectedPayments?: boolean
    resetForm: () => void
    resetMemberSelectionAndForm?: () => void
    handlePrintTransactionEntry?: (payments: IPaymentsEntryRequest[]) => void
    form: UseFormReturn<TPaymentFormValues>
    refetchGenerateOrNumber?: (
        options?: RefetchOptions
    ) => Promise<QueryObserverResult<IGenerateORNumberResource, Error>>
}

const PaymentsEntryFormModal = ({
    selectedMemberId,
    form,
    resetForm,
    error,
    ORNumber,
    hadSelectedPayments,
    refetchGenerateOrNumber,
    resetMemberSelectionAndForm,
    handlePrintTransactionEntry,
    disabledFields,
}: Omit<IPaymentFormProps, 'open' | 'onOpenChange'>) => {
    const {
        openCheckClearingFormModal,
        setOpenCheckClearingFormModal,
        setOpenPaymentsEntryModal,
        setTransactionType,
        transactionType,
    } = usePaymentsModalStore()

    const {
        selectedPayments,
        setSelectedPayments,
        selectedMember,
        setSelectedAccounts,
        selectedAccounts,
        focusTypePayment,
        setFocusTypePayment,
    } = usePaymentsDataStore()

    const { isOpen } = useMemberPickerStore()
    const { isOpen: isOpenConfirm } = useConfirmModalStore()

    const paymentOptions = [
        {
            value: 'payment',
            label: 'payment',
            disabled: false,
        },
        {
            value: 'deposit',
            label: 'deposit',
            disabled: !hadSelectedPayments,
        },
        {
            value: 'withdraw',
            label: 'withdraw',
            disabled: !hadSelectedPayments,
        },
    ]

    const {
        mutate: createPayment,
        isPending: isPendingCreatePayments,
        error: createPaymentError,
    } = useCreatePaymentEntry({
        onSuccess: (data) => {
            resetForm()
            setOpenPaymentsEntryModal(false)
            setSelectedAccounts(null)
            resetMemberSelectionAndForm && resetMemberSelectionAndForm()
            refetchGenerateOrNumber && refetchGenerateOrNumber()
            toast.success(
                `${data.length} ${transactionType} is successfully added`
            )
            handlePrintTransactionEntry && handlePrintTransactionEntry(data)
        },
        onError: (error) => {
            toast.error(error)
        },
    })

    const isNotPayment = transactionType !== TRANSACTION_TYPE.payment

    const handleSubmit = useCallback(
        async (values: TPaymentFormValues) => {
            try {
                if (!transactionType) {
                    console.error('Transaction type is missing')
                    return
                }

                if (CHECK_BANK_LIST.includes(values.paymentType)) {
                    setOpenCheckClearingFormModal(true)
                    return
                }

                if (!selectedMember?.id) {
                    toast.error('Please select a member')
                    return
                }

                if (!selectedAccounts) {
                    toast.error('Please select an account')
                    return
                }

                if (!values.accountsId) {
                    toast.error('Account ID is required')
                    return
                }
                if (!ORNumber) {
                    toast.error('ORNumber is Required')
                    return
                }

                const paymentEntry: IPaymentsEntry = {
                    accountsId: values.accountsId,
                    memberId: selectedMemberId,
                    ORNumber,
                    isPrinted: values.isPrinted ?? false,
                    amount: values.amount,
                    paymentType: values.paymentType,
                    account: selectedAccounts,
                    type: TRANSACTION_TYPE.payment,
                }

                if (isNotPayment) {
                    const depositAndWithdraw: IPaymentsEntryRequest = {
                        ...paymentEntry,
                        type:
                            transactionType === TRANSACTION_TYPE.deposit
                                ? TRANSACTION_TYPE.deposit
                                : TRANSACTION_TYPE.withdraw,
                    }
                    createPayment([depositAndWithdraw])
                } else {
                    setSelectedPayments([...selectedPayments, paymentEntry])
                    setOpenPaymentsEntryModal(false)
                    toast.success('1 payment added')
                    resetForm()
                }
            } catch (error) {
                console.error('Submission error:', error)
            }
        },
        [
            selectedMember?.id,
            selectedAccounts,
            ORNumber,
            selectedMemberId,
            transactionType,
            createPayment,
            setSelectedPayments,
            resetForm,
            setOpenCheckClearingFormModal,
            setOpenPaymentsEntryModal,
            selectedPayments,
            isNotPayment,
        ]
    )

    useShortcut('Enter', async (event) => {
        event.preventDefault()
        const activeElement = document.activeElement as HTMLElement
        if (
            activeElement.tagName === 'INPUT' ||
            activeElement.tagName === 'TEXTAREA'
        ) {
            return
        }
        const isValid = await form.trigger()
        if (isValid && !isOpen && !isOpenConfirm) {
            handleSubmit(form.getValues() as TPaymentFormValues)
        }
    })

    const errorMessage = `Payment: ${createPaymentError} FormError: ${error}`

    return (
        <>
            <CheckClearingFormModal
                formProps={{
                    resetPaymentsForm: resetForm,
                    paymentFormsValue: form.getValues(),
                    amount: form.getValues('amount'),
                    ORNumber: ORNumber,
                }}
                open={openCheckClearingFormModal}
                onOpenChange={setOpenCheckClearingFormModal}
            />
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)}>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                        <div className="md:col-span-2">
                            <FormFieldWrapper
                                className="md:col-span-2"
                                control={form.control}
                                name="transactionType"
                                label="transaction Type"
                                disabled={disabledFields?.includes(
                                    'transactionType'
                                )}
                                render={({ field }) => {
                                    return (
                                        <div className="flex w-full gap-x-2">
                                            {paymentOptions.map(
                                                (
                                                    { value, label, disabled },
                                                    idx
                                                ) => (
                                                    <RadioGroup
                                                        defaultValue={
                                                            field.value
                                                        }
                                                        className="flex grow items-center"
                                                        onValueChange={(
                                                            value
                                                        ) => {
                                                            setTransactionType(
                                                                value
                                                            )
                                                            field.onChange(
                                                                value
                                                            )
                                                        }}
                                                        onFocus={(item) => {
                                                            setFocusTypePayment(
                                                                `${item.target.id}`
                                                            )
                                                        }}
                                                        defaultChecked={true}
                                                        id={field.name}
                                                        value={field.value}
                                                    >
                                                        <Label
                                                            key={value}
                                                            tabIndex={idx}
                                                            className={cn(
                                                                'relative flex w-full cursor-pointer items-start gap-3 rounded-lg border border-input p-4 shadow-sm shadow-black/5 duration-300 ease-in-out hover:bg-secondary/60 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-secondary/80',
                                                                focusTypePayment ===
                                                                    value
                                                                    ? 'border-primary/80 bg-secondary/80'
                                                                    : '',
                                                                disabled
                                                                    ? 'cursor-not-allowed hover:bg-transparent'
                                                                    : ''
                                                            )}
                                                        >
                                                            <RadioGroupItem
                                                                value={value}
                                                                id={value}
                                                                aria-describedby={
                                                                    value
                                                                }
                                                                disabled={
                                                                    disabled
                                                                }
                                                                className="order-1 border"
                                                            />
                                                            <div className="grow">
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-lg"></span>
                                                                    {label}
                                                                </div>
                                                            </div>
                                                        </Label>
                                                    </RadioGroup>
                                                )
                                            )}
                                        </div>
                                    )
                                }}
                            />
                        </div>
                        <FormFieldWrapper
                            className="md:col-span-2"
                            control={form.control}
                            name="amount"
                            label="Payment Amount"
                            disabled={disabledFields?.includes('amount')}
                            render={({ field }) => (
                                <div className="relative w-full">
                                    <Input
                                        {...field}
                                        id={field.name}
                                        className={cn(
                                            'h-16 rounded-2xl pl-8 pr-10 text-lg font-bold text-primary placeholder:text-sm placeholder:font-normal placeholder:text-foreground/40'
                                        )}
                                        type="text"
                                        inputMode="decimal"
                                        placeholder="Enter the payment amount"
                                        autoComplete="off"
                                        value={
                                            field.value !== undefined &&
                                            field.value !== null
                                                ? commaSeparators(
                                                      field.value.toString()
                                                  )
                                                : ''
                                        }
                                        onChange={(e) => {
                                            const rawValue =
                                                sanitizeNumberInput(
                                                    e.target.value
                                                )
                                            if (isValidDecimalInput(rawValue)) {
                                                field.onChange(rawValue)
                                            }
                                        }}
                                        onBlur={(e) =>
                                            formatNumberOnBlur(
                                                e.target.value,
                                                field.onChange
                                            )
                                        }
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary after:content-['₱']"></span>
                                </div>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="paymentType"
                            label="Payment Method"
                            render={({ field }) => (
                                <div className="relative w-full">
                                    <TransactionPaymentTypesPicker
                                        value={field.value}
                                        disabled={disabledFields?.includes(
                                            'paymentType'
                                        )}
                                        onSelect={(type) =>
                                            field.onChange(type.id)
                                        }
                                        defaultValue={DEFAULT_TRANSACTION_TYPE}
                                        leftIcon={
                                            <MoneyIcon className="text-foreground" />
                                        }
                                        placeholder="Select a payment method"
                                    />
                                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary"></span>
                                </div>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="accountsId"
                            label="Select Account"
                            render={({ field }) => (
                                <AccountsPicker
                                    value={field.value}
                                    disabled={disabledFields?.includes(
                                        'accountsId'
                                    )}
                                    onSelect={(account) => {
                                        field.onChange(account.id)
                                        setSelectedAccounts({
                                            ...account,
                                            noGracePeriodDaily:
                                                account.noGracePeriodDaily ??
                                                false,
                                        })
                                    }}
                                    leftIcon={
                                        <AccountsIcon className="text-foreground" />
                                    }
                                    placeholder="Choose an account"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            className="md:col-span-2"
                            control={form.control}
                            name="notes"
                            label="Additional Notes"
                            disabled={disabledFields?.includes('notes')}
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="Add any extra details or comments (optional)"
                                    className="resize-none"
                                />
                            )}
                        />
                        {selectedAccounts?.print && (
                            <div className="md:col-span-2">
                                <FormField
                                    name="isPrinted"
                                    disabled={disabledFields?.includes(
                                        'isPrinted'
                                    )}
                                    control={form.control}
                                    render={({ field }) => {
                                        const id = 'allowPrinting'
                                        return (
                                            <FormItem className="flex flex-col">
                                                <FormControl>
                                                    <div className="relative flex w-full items-start gap-2 rounded-lg border border-input shadow-sm shadow-black/5 duration-300 ease-in-out hover:bg-secondary/60 has-[[data-state=checked]]:border-ring has-[[data-state=checked]]:bg-secondary/80">
                                                        <Checkbox
                                                            id={id}
                                                            checked={
                                                                field.value
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                            className="absolute right-4 top-4"
                                                            aria-describedby={`${id}-description`}
                                                        />
                                                        <Label
                                                            htmlFor={id}
                                                            className="flex grow cursor-pointer items-center gap-3 p-4"
                                                        >
                                                            <div className="grid gap-2">
                                                                <p>
                                                                    Enable
                                                                    Printing{' '}
                                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground">
                                                                        (Check
                                                                        this box
                                                                        if you
                                                                        need a
                                                                        printed
                                                                        copy)
                                                                    </span>
                                                                </p>
                                                            </div>
                                                        </Label>
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    {createPaymentError && error && (
                        <FormErrorMessage errorMessage={errorMessage} />
                    )}
                    <div className="col-span-2">
                        <Separator className="my-2 sm:my-4" />
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                type="button"
                                variant="ghost"
                                disabled={isPendingCreatePayments}
                                onClick={() => resetForm()}
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                Reset
                            </Button>
                            <Button
                                disabled={isPendingCreatePayments}
                                type="submit"
                                id="create-payment"
                                className="w-full self-end px-8 sm:w-fit"
                            >
                                {isPendingCreatePayments ? (
                                    <LoadingSpinner />
                                ) : (
                                    'create'
                                )}
                            </Button>
                        </div>
                    </div>
                </form>
            </Form>
        </>
    )
}

export const TransactionPaymentEntryFormModal = ({
    description = 'Fill out the form to add a new transaction.',
    className,
    onOpenChange,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IPaymentFormProps, 'className' | 'form' | 'resetForm'>
}) => {
    const { onOpen } = useConfirmModalStore()
    const { transactionType } = usePaymentsModalStore()

    const form = useForm<TPaymentFormValues>({
        resolver: zodResolver(paymentsEntrySchema),
        mode: 'onSubmit',
        defaultValues: {
            amount: 0,
            transactionType: 'payment',
            accountsId: '',
            notes: '',
            isPrinted: false,
            paymentType: DEFAULT_TRANSACTION_TYPE,
        },
    })

    const resetForm = () => {
        form.reset({
            amount: 0,
            transactionType: 'payment',
            accountsId: '',
            notes: '',
            isPrinted: false,
            paymentType: DEFAULT_TRANSACTION_TYPE,
        })
    }

    const onPaymentsEntryModalClose = (isOpen: boolean) => {
        const { isDirty } = form.formState

        if (!isOpen) {
            if (!isDirty) {
                onOpenChange?.(false)
            } else {
                onOpen({
                    title: `Discard ${capitalize(transactionType ?? '')}`,
                    description:
                        'Are you sure you want to discard this transaction?',
                    onConfirm: () => {
                        resetForm()
                        onOpenChange?.(false)
                    },
                    confirmString: 'Discard',
                })
            }
        }
    }

    return (
        <Modal
            title={`Create ${capitalize(transactionType ?? '')}`}
            description={description}
            className={cn('w-[44rem] p-10', className)}
            onOpenChange={onPaymentsEntryModalClose}
            {...props}
        >
            <PaymentsEntryFormModal
                {...formProps}
                form={form}
                resetForm={resetForm}
                selectedMemberId={formProps?.selectedMemberId ?? ''}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionPaymentEntryFormModal
