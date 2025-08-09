import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib'
import ReferenceNumber from '@/routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/reference-number-field'
import { usePaymentsDataStore } from '@/store/transaction/payments-entry-store'
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
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import {
    QuickPaymentTransactionFormValues,
    QuickTransactionPaymentSchema,
} from '@/validations/transactions/payment-transaction-entry-schema'

import { useGetAllpaymentTypes } from '@/hooks/api-hooks/use-payment-type'
import { usecreateQuickTransactionPayment } from '@/hooks/api-hooks/use-transaction'

import {
    IClassProps,
    IForm,
    IGeneralLedger,
    IMedia,
    IPaymentQuickRequest,
    ITransactionResponse,
} from '@/types'

import AmountField from '../../../routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/amount-field'

interface QuickPaymentEntryFormProps
    extends IClassProps,
        IForm<
            Partial<IPaymentQuickRequest>,
            IGeneralLedger,
            string,
            QuickPaymentTransactionFormValues
        > {
    transaction?: ITransactionResponse
}

const QuickPaymentEntryForm = ({
    defaultValues,
    onSuccess,
}: QuickPaymentEntryFormProps) => {
    const { focusTypePayment } = usePaymentsDataStore()
    const form = useForm<QuickPaymentTransactionFormValues>({
        resolver: zodResolver(QuickTransactionPaymentSchema),
        defaultValues: {
            ...defaultValues,
        },
    })

    const {
        mutate: creatTransactionDeposit,
        isPending,
        error,
    } = usecreateQuickTransactionPayment({ onSuccess })

    const { data: paymentTypes } = useGetAllpaymentTypes()

    const handleSubmit = form.handleSubmit(
        async (data: QuickPaymentTransactionFormValues) => {
            const {
                account_id,
                amount,
                payment_type_id,
                description,
                member_profile_id,
                member_joint_account_id,
                entry_date,
                or_auto_generated,
                bank_id,
                proof_of_payment_media_id,
                reference_number,
                bank_reference_number,
            } = data

            if (focusTypePayment) {
                await creatTransactionDeposit({
                    data: {
                        amount,
                        signature_media_id: data.signature.id,
                        proof_of_payment_media_id,
                        bank_id,
                        bank_reference_number,
                        entry_date: entry_date
                            ? new Date(entry_date).toISOString()
                            : undefined,
                        account_id,
                        payment_type_id,
                        description,
                        member_profile_id,
                        member_joint_account_id,
                        reference_number,
                        or_auto_generated,
                    },
                    mode: focusTypePayment,
                })
            }
        }
    )

    const paymentTypeType = paymentTypes?.find(
        (type) => type.id === form.watch('payment_type_id')
    )?.type

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="flex w-full flex-col space-y-2">
                    <div className="grid grid-cols-1 w-full lg:grid-cols-2 gap-x-2 gap-y-2">
                        <ReferenceNumber
                            value={defaultValues?.reference_number}
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
                                            value={field.value ?? ''}
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
                                                        field.onChange(
                                                            newImage.id
                                                        )
                                                    else
                                                        field.onChange(
                                                            undefined
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
                            name="signature"
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
                                            if (newImage)
                                                form.setValue(
                                                    'signature',
                                                    newImage
                                                )
                                            else
                                                form.setValue(
                                                    'signature',
                                                    undefined
                                                )
                                        }}
                                    />
                                )
                            }}
                        />
                    </div>
                    <Separator className="my-2 sm:my-4" />
                    <FormErrorMessage errorMessage={error} />
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

const QuickPaymentEntryModal = ({
    title = '',
    description = '',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<QuickPaymentEntryFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-[70vw]', className)}
            title={title}
            description={description}
            {...props}
        >
            <QuickPaymentEntryForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default QuickPaymentEntryModal
