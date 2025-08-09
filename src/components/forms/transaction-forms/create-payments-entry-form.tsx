import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib'
import { useForm } from 'react-hook-form'

import BankCombobox from '@/components/comboboxes/bank-combobox'
import PaymentTypeComboBox from '@/components/comboboxes/payment-type-combobox'
import Modal, { IModalProps } from '@/components/modals/modal'
import AccountPicker from '@/components/pickers/account-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import {
    TransactionEntryFormValues,
    TransactionEntrySchema,
} from '@/validations/transactions/transaction-entry-schema'

import { useGetAllpaymentTypes } from '@/hooks/api-hooks/use-payment-type'
import {
    useCreatePaymentTransaction,
    useCreateTransactionWithPayment,
} from '@/hooks/api-hooks/use-transaction'

import {
    IClassProps,
    IForm,
    IGeneralLedger,
    IMedia,
    IPaymentRequest,
    TEntityId,
    TGeneralLedgerSource,
} from '@/types'

import AmountField from '../../../routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/amount-field'
import ReferenceNumber from '../../../routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/reference-number-field'

interface TransactionEntryFormProps
    extends IClassProps,
        IForm<
            Partial<IPaymentRequest>,
            IGeneralLedger,
            string,
            TransactionEntryFormValues
        > {
    referenceNumber?: string
    memberProfileId?: TEntityId
    memberJointId?: TEntityId
    isReferenceNumberCheck?: boolean
    description?: string
    transactionId?: TEntityId
    onSuccessPayment: (transaction: IGeneralLedger) => void
}

const PaymentsEntryForm = ({
    defaultValues,
    onSuccess,
    referenceNumber,
    memberJointId,
    memberProfileId,
    isReferenceNumberCheck = false,
    description = '',
    transactionId,
    onSuccessPayment,
}: TransactionEntryFormProps) => {
    const form = useForm<TransactionEntryFormValues>({
        resolver: zodResolver(TransactionEntrySchema),
        defaultValues: {
            ...defaultValues,
        },
    })

    const {
        mutate: createPaymentWithTransaction,
        isPending: isPendingCreatePaymentWithTransaction,
        error: createPaymentWithTransactionError,
    } = useCreateTransactionWithPayment({ onSuccess })

    const {
        mutate: createPayment,
        isPending: isPendingCreatePayment,
        error: createPaymentError,
    } = useCreatePaymentTransaction({ onSuccess: onSuccessPayment })

    const { data: paymentType } = useGetAllpaymentTypes()

    const handleSubmit = form.handleSubmit(
        (data: TransactionEntryFormValues) => {
            if (transactionId) {
                createPayment({
                    data: {
                        ...data,
                        entry_date: new Date(
                            data.entry_date ?? new Date()
                        ).toISOString(),
                    },
                    transactionId: transactionId,
                })
            } else {
                const transactionPayload = {
                    reference_number: referenceNumber,
                    member_profile_id: memberProfileId,
                    member_joint_account_id: memberJointId,
                    is_reference_number_checked: isReferenceNumberCheck,
                    source: 'payment' as TGeneralLedgerSource,
                    description: description,
                }
                createPaymentWithTransaction({
                    data: data as IPaymentRequest,
                    transactionPayload,
                })
            }
        }
    )

    const paymentTypeType = paymentType?.find(
        (type) => type.id === form.watch('payment_type_id')
    )?.type

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit}>
                <FormErrorMessage
                    className="mb-2"
                    errorMessage={
                        createPaymentWithTransactionError
                            ? createPaymentWithTransactionError
                            : createPaymentError
                    }
                />
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <ReferenceNumber
                        value={referenceNumber}
                        disabled
                        className="col-span-2 w-full"
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="account_id"
                        label="Account"
                        className="col-span-2"
                        render={({ field }) => (
                            <AccountPicker
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                }}
                                value={field.value ?? undefined}
                                placeholder="Select an account"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="amount"
                        label="Amount"
                        className="col-span-2"
                        render={({ field }) => {
                            return (
                                <AmountField
                                    {...field}
                                    value={field.value}
                                    onChange={field.onChange}
                                />
                            )
                        }}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Payment Type"
                        name="payment_type_id"
                        className="col-span-2"
                        render={({ field }) => (
                            <PaymentTypeComboBox
                                {...field}
                                value={field.value ?? undefined}
                                placeholder="Select a payment type"
                                onChange={(selectedPaymentType) =>
                                    field.onChange(selectedPaymentType.id)
                                }
                            />
                        )}
                    />

                    {['bank', 'online'].includes(
                        paymentTypeType?.toLowerCase() ?? ''
                    ) && (
                        <>
                            <FormFieldWrapper
                                control={form.control}
                                name="bank_id"
                                label="Bank"
                                className="col-span-2"
                                render={({ field }) => (
                                    <BankCombobox
                                        {...field}
                                        value={field.value ?? undefined}
                                        placeholder="Select a bank"
                                        onChange={(selectedBank) =>
                                            field.onChange(selectedBank.id)
                                        }
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="entry_date"
                                label="Entry Date "
                                className="relative"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="bank_reference_number"
                                label="Bank Reference Number"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        value={field.value ?? undefined}
                                        placeholder="add a bank reference number"
                                        onChange={field.onChange}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="proof_of_payment_media_id"
                                label="Proof of Payment"
                                render={({ field }) => {
                                    const value = form.watch(
                                        'proof_of_payment_media'
                                    )

                                    return (
                                        <ImageField
                                            {...field}
                                            placeholder="Upload Photo"
                                            value={
                                                value
                                                    ? (value as IMedia)
                                                          .download_url
                                                    : value
                                            }
                                            onChange={(newImage) => {
                                                if (newImage)
                                                    field.onChange(newImage.id)
                                                else field.onChange(undefined)

                                                form.setValue(
                                                    'proof_of_payment_media',
                                                    newImage
                                                )
                                            }}
                                        />
                                    )
                                }}
                            />
                        </>
                    )}
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Note"
                        className="h-[85%]"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                className="h-full"
                                placeholder="what is this payment for?"
                                autoComplete="off"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="signature"
                        label="Signature"
                        render={({ field }) => {
                            const value = form.watch('signature')
                            return (
                                <SignatureField
                                    {...field}
                                    placeholder="Signature"
                                    value={
                                        value
                                            ? (value as IMedia).download_url
                                            : value
                                    }
                                    className="!max-h-16 h-55 !bg-red-500"
                                    onChange={(newImage) => {
                                        if (newImage)
                                            field.onChange(newImage.id)
                                        else field.onChange(undefined)

                                        form.setValue('signature', newImage)
                                    }}
                                />
                            )
                        }}
                    />
                </div>
                <Separator className="my-2 sm:my-4" />
                <div className="flex items-center justify-end gap-x-2">
                    <Button
                        size="sm"
                        type="button"
                        variant="ghost"
                        onClick={() => form.reset()}
                        className="w-full self-end px-8 sm:w-fit"
                    >
                        cancel
                    </Button>
                    <Button
                        size="sm"
                        type="submit"
                        disabled={
                            isPendingCreatePaymentWithTransaction ||
                            isPendingCreatePayment
                        }
                        className="w-full self-end px-8 sm:w-fit"
                    >
                        {isPendingCreatePaymentWithTransaction ||
                        isPendingCreatePayment ? (
                            <LoadingSpinner />
                        ) : (
                            'pay'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

const TransactionPaymentEntryModal = ({
    title = 'Create Payment Entry',
    description = 'Fill up the form to create payment entry',
    titleClassName,
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<TransactionEntryFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            title={title}
            description={description}
            titleClassName={titleClassName}
            {...props}
        >
            <PaymentsEntryForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionPaymentEntryModal
