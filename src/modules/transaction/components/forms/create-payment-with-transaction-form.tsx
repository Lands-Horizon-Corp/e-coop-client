import { useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/helpers'
import { AccountPicker, IAccount } from '@/modules/account'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import { IGeneralLedger, TGeneralLedgerSource } from '@/modules/general-ledger'
import { IMedia } from '@/modules/media'
import { useGetAll } from '@/modules/payment-type'
import {
    IPaymentRequest,
    ITransactionRequest,
    PaymentWithTransactionSchema,
    TPaymentWithTransactionFormValues,
    TransactionAmountField,
    TransactionPaymentTypeComboBox,
    TransactionReferenceNumber,
    useCreateTransactionPaymentByMode,
} from '@/modules/transaction'
import { useTransactionStore } from '@/store/transaction/transaction-store'

import Modal, { IModalProps } from '@/components/modals/modal'
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

import { IClassProps, IForm, TEntityId } from '@/types'

interface PaymentWithTransactionFormProps
    extends IClassProps,
        IForm<
            Partial<IPaymentRequest>,
            IGeneralLedger,
            string,
            TPaymentWithTransactionFormValues
        > {
    transactionId?: TEntityId
    referenceNumber?: string
    memberProfileId?: TEntityId
    memberJointId?: TEntityId
    isReferenceNumberCheck?: boolean
    description?: string
    account?: IAccount
}

const PaymentWithTransactionForm = ({
    defaultValues,
    onSuccess,
    referenceNumber,
    transactionId,
    memberProfileId,
    memberJointId,
    description,
    account,
}: PaymentWithTransactionFormProps) => {
    const { focusTypePayment } = useTransactionStore()

    const form = useForm<TPaymentWithTransactionFormValues>({
        resolver: zodResolver(PaymentWithTransactionSchema),
        defaultValues: {
            ...defaultValues,
            account: account,
        },
    })

    const {
        mutate: creatTransactionDeposit,
        isPending,
        error,
    } = useCreateTransactionPaymentByMode({ options: { onSuccess } })

    const { data: paymentTypes } = useGetAll()

    const handleSubmit = form.handleSubmit(
        (data: TPaymentWithTransactionFormValues) => {
            const entryDate = data.entry_date
                ? new Date(data.entry_date).toISOString()
                : undefined

            const source: TGeneralLedgerSource =
                focusTypePayment === 'payment'
                    ? 'payment'
                    : focusTypePayment === 'withdraw'
                      ? 'withdraw'
                      : 'deposit'

            const transactionpayPayload: ITransactionRequest = {
                ...data,
                reference_number: referenceNumber,
                member_profile_id: memberProfileId,
                member_joint_account_id: memberJointId,
                source: source,
                description: description ?? '',
            }

            creatTransactionDeposit({
                data: {
                    ...data,
                    entry_date: entryDate,
                },
                mode: focusTypePayment,
                transactionId,
                transactionPayload: transactionpayPayload,
            })
        }
    )

    const paymentTypeType = paymentTypes?.find(
        (type) => type.id === form.watch('payment_type_id')
    )?.type

    const isOnlinePayment = ['bank', 'online', 'check'].includes(
        paymentTypeType?.toLowerCase() ?? ''
    )

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="flex w-full flex-col space-y-2">
                    <div className="grid grid-cols-1 w-full lg:grid-cols-2 gap-x-2 gap-y-2">
                        <TransactionReferenceNumber
                            value={referenceNumber ?? ''}
                            disabled
                            className="col-span-2 w-full"
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="amount"
                            label="Amount"
                            className="col-span-2"
                            render={({ field }) => {
                                return (
                                    <TransactionAmountField
                                        {...field}
                                        value={field.value}
                                        onChange={field.onChange}
                                    />
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="account_id"
                            label="Account"
                            className="col-span-2"
                            render={({ field }) => (
                                <AccountPicker
                                    mode={focusTypePayment}
                                    value={form.getValues('account')}
                                    onSelect={(account) => {
                                        field.onChange(account.id)
                                        form.setValue('account', account, {
                                            shouldDirty: true,
                                        })
                                    }}
                                    placeholder="Select an account"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Payment Type"
                            name="payment_type_id"
                            className="col-span-2"
                            render={({ field }) => (
                                <TransactionPaymentTypeComboBox
                                    {...field}
                                    value={field.value ?? undefined}
                                    placeholder="Select a payment type"
                                    onChange={(selectedPaymentType) => {
                                        field.onChange(selectedPaymentType.id)
                                        if (isOnlinePayment) {
                                            form.setValue(
                                                'entry_date',
                                                new Date().toISOString(),
                                                {
                                                    shouldValidate: true,
                                                }
                                            )
                                        }
                                    }}
                                />
                            )}
                        />

                        {isOnlinePayment && (
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
                                    label="Bank Date"
                                    className="relative"
                                    description="mm/dd/yyyy"
                                    descriptionClassName="absolute top-0 right-0"
                                    render={({ field }) => (
                                        <InputDate
                                            {...field}
                                            placeholder="Bank Date"
                                            className="block"
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
                                                    if (newImage) {
                                                        field.onChange(
                                                            newImage.id
                                                        )
                                                        form.setValue(
                                                            'proof_of_payment_media',
                                                            newImage as IMedia
                                                        )
                                                    } else {
                                                        field.onChange(
                                                            undefined
                                                        )
                                                        form.setValue(
                                                            'proof_of_payment_media',
                                                            undefined
                                                        )
                                                    }
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
                            label="Description"
                            className="h-full"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="a short description..."
                                    autoComplete="off"
                                    className="h-[85%]"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="signature_media_id"
                            label="Signature"
                            className=""
                            render={({ field }) => {
                                const value = form.watch('signature')
                                return (
                                    <SignatureField
                                        {...field}
                                        className="max-h-52 !h-20"
                                        placeholder="Signature"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage) {
                                                field.onChange(newImage.id)
                                                form.setValue(
                                                    'signature',
                                                    newImage as IMedia
                                                )
                                            } else {
                                                field.onChange(undefined)
                                                form.setValue(
                                                    'signature',
                                                    undefined
                                                )
                                            }
                                        }}
                                    />
                                )
                            }}
                        />
                    </div>
                    <Separator className="my-2 sm:my-4" />
                    <FormErrorMessage
                        errorMessage={error ? error.message : null}
                    />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : (
                                <>{focusTypePayment}</>
                            )}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

const TransactionCreateWithPaymentFormModal = ({
    title = '',
    description = '',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<PaymentWithTransactionFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-[70vw]', className)}
            title={title}
            description={description}
            {...props}
        >
            <PaymentWithTransactionForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionCreateWithPaymentFormModal
