import { useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { formatNumber } from '@/helpers'
import { dateAgo, toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountTypeBadge } from '@/modules/account'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store';
import BankCombobox from '@/modules/bank/components/bank-combobox';
import { ICurrency } from '@/modules/currency';
import CurrencyInput from '@/modules/currency/components/currency-input';
import { TGeneralLedgerSource } from '@/modules/general-ledger';
import { ILoanPayableAccount } from '@/modules/loan-transaction';
import { IMedia } from '@/modules/media';
import { IPaymentType } from '@/modules/payment-type';
import { ITransaction, PaymentTypeCombobox, useCreateMultiTransactionPayment, useCreateTransaction } from '@/modules/transaction';



import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit';
import { CalendarNumberIcon, HashIcon, SignatureLightIcon, TextFileFillIcon, WandSparkleIcon } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormFieldWrapper from '@/components/ui/form-field-wrapper';
import ImageField from '@/components/ui/image-field';
import { Input } from '@/components/ui/input';
import InputDate from '@/components/ui/input-date';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import SignatureField from '@/components/ui/signature-field';
import { Textarea } from '@/components/ui/textarea';



import { useFormHelper } from '@/hooks/use-form-helper';



import { IForm, TEntityId } from '@/types';



import { LoanPayablePaymentSchema, TLoanPayablePaymentSchema } from '../../loan-payment.validation';





export interface LoanPayablesFormProps
    extends IForm<
        Partial<TLoanPayablePaymentSchema>,
        ITransaction,
        Error,
        TLoanPayablePaymentSchema
    > {
    payables: ILoanPayableAccount[]
    memberProfileId: TEntityId
    currency?: ICurrency
    className?: string
}

const LoanPayablesForm = ({
    payables,
    currency,
    className,
    ...formProps
}: LoanPayablesFormProps) => {
    const [transaction, setTransaction] = useState<ITransaction>()

    const {
        currentAuth: {
            user_organization: {
                user_setting_used_or,
                user_setting_number_padding,
                settings_payment_type_default_value_id,
                settings_payment_type_default_value,
            },
        },
    } = useAuthUserWithOrgBranch()

    const form = useForm<TLoanPayablePaymentSchema>({
        mode: 'onChange',
        resolver: standardSchemaResolver(LoanPayablePaymentSchema),
        defaultValues: {
            total_amount: payables.reduce(
                (sum, p) => sum + (p.suggested_payment_amount || 0),
                0
            ),
            reference_number: '',
            is_reference_number_checked: false,
            payables: payables.map((p) => ({
                account_id: p.account_id,
                account: p.account,
                reference_number: '',
                amount: p.suggested_payment_amount || 0,
                payment_type: settings_payment_type_default_value || undefined,
                payment_type_id: settings_payment_type_default_value_id || '',
            })),
            ...formProps.defaultValues,
        },
    })

    const { formRef, isDisabled } = useFormHelper<TLoanPayablePaymentSchema>({
        form,
        autoSave: formProps.autoSave,
        readOnly: formProps.readOnly,
        hiddenFields: formProps.hiddenFields,
        disabledFields: formProps.disabledFields,
        defaultValues: formProps.defaultValues,
    })

    const totalSuggestedAmount = payables.reduce(
        (sum, p) => sum + (p.suggested_payment_amount || 0),
        0
    )

    const handleTotalAmountChange = (amount: number) => {
        let remaining = amount
        if (isNaN(remaining)) return

        const newPayables = payables.map((p) => {
            const suggested = p.suggested_payment_amount || 0
            const alloc = Math.min(suggested, remaining)
            remaining -= alloc
            return {
                account_id: p.account_id,
                account: p.account,
                reference_number: form.getValues('reference_number'),
                amount: parseFloat(alloc.toFixed(2)),
                entry_date: toInputDateString(new Date()),
                payment_type_id: settings_payment_type_default_value_id || '',
            }
        })

        form.setValue('total_amount', amount)
        form.setValue('payables', newPayables)
    }

    const createTransaction = useCreateTransaction()
    const multiPaymentMutation = useCreateMultiTransactionPayment()

    const onSubmit = form.handleSubmit(async (data) => {
        const toastId = 'loan-payment-process'
        try {
            toast.loading('Creating transaction...', { id: toastId })

            let focusedTransaction = transaction

            if (!focusedTransaction) {
                const payload = {
                    member_profile_id: formProps.memberProfileId,
                    source: 'payment' as TGeneralLedgerSource,
                    reference_number: data.reference_number,
                    is_reference_number_checked:
                        data.is_reference_number_checked,
                    description: `Loan payment for loan transaction ID: ${formProps.loanTransacitonId}`,
                }

                const createdTransaction =
                    await createTransaction.mutateAsync(payload)
                focusedTransaction = createdTransaction
                setTransaction(createdTransaction)
            }

            toast.loading('Saving payments...', { id: toastId })

            if (focusedTransaction) {
                await multiPaymentMutation.mutateAsync({
                    transactionId: focusedTransaction.id,
                    payments: data.payables.map((entry) => ({
                        ...entry,
                        transaction_id: focusedTransaction.id,
                    })),
                })
                toast.success('Payment complete!', { id: toastId })
                formProps.onSuccess?.(focusedTransaction)
            }
        } catch (error) {
            toast.error(
                `An error occurred. Please try again. ${serverRequestErrExtractor({ error })}`,
                { id: toastId }
            )
        }
    })

    const handlePayableAmountChange = (index: number, amount: number) => {
        const payables = [...form.getValues('payables')]
        payables.splice(index, 1)
        const payableTotals =
            payables.reduce((sum, p) => sum + (Number(p.amount) || 0), 0) +
                amount || 0
        form.setValue('total_amount', payableTotals)
        form.setValue(`payables.${index}.amount`, amount)
    }

    return (
        <Form {...form}>
            <form
                className={`space-y-2 ${className ?? ''}`}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <div className="flex items-center justify-between">
                    <p>Payable Accounts</p>
                    <p className="text-sm text-accent-foreground px-2 py-0.5 rounded-full bg-accent">
                        <span className="text-xs text-muted-foreground/60">
                            suggested:{' '}
                        </span>
                        {formatNumber(totalSuggestedAmount)}
                    </p>
                </div>
                <div className="flex items-end justify-between gap-x-2">
                    <FormFieldWrapper
                        className="space-y-4"
                        control={form.control}
                        label="Disbursable Amount"
                        name="total_amount"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                currency={currency}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue) => {
                                    onChange(newValue)
                                    handleTotalAmountChange(
                                        newValue ? Number(newValue) : 0
                                    )
                                }}
                                placeholder="Disbursable Amount"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        className="space-y-4"
                        control={form.control}
                        label={
                            <span className="flex items-center justify-between pb-1">
                                <span>
                                    Reference No{' '}
                                    <HashIcon className="inline text-muted-foreground" />
                                </span>
                                <button
                                    className="text-xs disabled:pointer-events-none text-muted-foreground duration-150 cursor-pointer hover:text-foreground underline-offset-4 underline"
                                    disabled={isDisabled('reference_number')}
                                    onClick={() => {
                                        alert('trigged')

                                        const constructedOR =
                                            user_setting_used_or
                                                .toString()
                                                .padStart(
                                                    user_setting_number_padding,
                                                    '0'
                                                )

                                        form.setValue(
                                            'reference_number',
                                            constructedOR,
                                            {
                                                shouldDirty: true,
                                            }
                                        )
                                        toast.info(`Set or to ${constructedOR}`)
                                    }}
                                    type="button"
                                >
                                    Auto OR{' '}
                                    <WandSparkleIcon className="inline" />
                                </button>
                            </span>
                        }
                        name="reference_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                onChange={(e) => {
                                    field.onChange(e.target.value)
                                }}
                                placeholder="Reference no"
                            />
                        )}
                    />
                    <Button disabled={formProps.readOnly} type="button">
                        <CalendarNumberIcon /> Amort
                    </Button>
                </div>
                <Separator />
                <div className="space-y-4">
                    {payables.map((p, idx) => {
                        const paymentType = form.getValues(
                            `payables.${idx}.payment_type`
                        ) as IPaymentType | undefined

                        const isBankPayment = ['bank', 'online'].includes(
                            paymentType?.type || ''
                        )

                        return (
                            <div
                                className="rounded-xl p-3 space-y-1 bg-popover"
                                key={p.account_id}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="mb-2">
                                        <p className="inline mr-1">
                                            {p.account?.name || (
                                                <span className="text-xs text-muted-foreground/80">
                                                    Unknown
                                                </span>
                                            )}
                                        </p>
                                        {p.account?.type && (
                                            <AccountTypeBadge
                                                type={p.account.type}
                                            />
                                        )}
                                    </div>
                                    {p.last_payment_date && (
                                        <p className="text-xs text-right text-muted-foreground/60">
                                            Last Pay :{' '}
                                            {dateAgo(p.last_payment_date)}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-end gap-x-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Payment Type"
                                        labelClassName="text-xs font-medium text-muted-foreground"
                                        name={`payables.${idx}.payment_type_id`}
                                        render={({ field }) => (
                                            <PaymentTypeCombobox
                                                {...field}
                                                disabled={isDisabled(
                                                    'payables'
                                                )}
                                                onChange={(
                                                    selectedPaymentType
                                                ) => {
                                                    field.onChange(
                                                        selectedPaymentType.id
                                                    )
                                                    form.setValue(
                                                        `payables.${idx}.payment_type`,
                                                        selectedPaymentType
                                                    )
                                                }}
                                                placeholder="Select a payment type"
                                                value={field.value ?? undefined}
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="w-3/6"
                                        control={form.control}
                                        label="Amount"
                                        name={`payables.${idx}.amount`}
                                        render={({
                                            field: { onChange, ...field },
                                        }) => (
                                            <CurrencyInput
                                                {...field}
                                                currency={
                                                    form.watch(
                                                        `payables.${idx}.account`
                                                    )?.currency
                                                }
                                                disabled={isDisabled(
                                                    `payables.${idx}.amount`
                                                )}
                                                id={field.name}
                                                onValueChange={(newValue) => {
                                                    onChange(newValue)
                                                    handlePayableAmountChange(
                                                        idx,
                                                        Number(newValue) || 0
                                                    )
                                                }}
                                                placeholder="Amount"
                                            />
                                        )}
                                    />

                                    <FormFieldWrapper
                                        className="w-fit"
                                        control={form.control}
                                        name={`payables.${idx}.signature_media_id`}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        name={field.name}
                                                        ref={field.ref}
                                                        size="icon"
                                                        type="button"
                                                        variant="outline"
                                                    >
                                                        <SignatureLightIcon />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="min-w-[400px] rounded-xl">
                                                    <SignatureField
                                                        onChange={(
                                                            newImage
                                                        ) => {
                                                            if (newImage)
                                                                field.onChange(
                                                                    newImage.id
                                                                )
                                                            else
                                                                field.onChange(
                                                                    undefined
                                                                )
                                                            form.setValue(
                                                                `payables.${idx}.signature_media`,
                                                                newImage
                                                            )
                                                        }}
                                                        placeholder="Signature"
                                                        value={
                                                            form.watch(
                                                                `payables.${idx}.signature_media`
                                                            )
                                                                ? (
                                                                      form.watch(
                                                                          `payables.${idx}.signature_media`
                                                                      ) as IMedia
                                                                  ).download_url
                                                                : form.watch(
                                                                      `payables.${idx}.signature_media`
                                                                  )
                                                        }
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="w-fit"
                                        control={form.control}
                                        name={`payables.${idx}.description`}
                                        render={({ field }) => (
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button
                                                        name={field.name}
                                                        ref={field.ref}
                                                        size="icon"
                                                        type="button"
                                                        variant="outline"
                                                    >
                                                        <TextFileFillIcon />
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="min-w-[400px] rounded-xl">
                                                    <Textarea
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter description"
                                                        rows={4}
                                                        value={field.value}
                                                    />
                                                </PopoverContent>
                                            </Popover>
                                        )}
                                    />
                                </div>
                                {isBankPayment && (
                                    <>
                                        <Separator className="mt-4" />
                                        <div className="grid grid-cols-3 gap-2">
                                            <FormFieldWrapper
                                                control={form.control}
                                                label="Bank"
                                                name={`payables.${idx}.bank_id`}
                                                render={({ field }) => (
                                                    <BankCombobox
                                                        {...field}
                                                        onChange={(bank) => {
                                                            field.onChange(
                                                                bank.id
                                                            )
                                                        }}
                                                        placeholder="Select a bank"
                                                    />
                                                )}
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                label="Bank Reference"
                                                name={`payables.${idx}.bank_reference_number`}
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        autoComplete="off"
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                        id={field.name}
                                                        placeholder="Bank Reference"
                                                    />
                                                )}
                                            />
                                            <FormFieldWrapper
                                                className="relative"
                                                control={form.control}
                                                description="mm/dd/yyyy"
                                                descriptionClassName="absolute top-0 right-0"
                                                label="Bank Date"
                                                name={`payables.${idx}.entry_date`}
                                                render={({ field }) => (
                                                    <InputDate
                                                        {...field}
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                    />
                                                )}
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                label="Proof of Payment"
                                                name={`payables.${idx}.proof_of_payment_media_id`}
                                                render={({ field }) => {
                                                    const value = form.watch(
                                                        `payables.${idx}.proof_of_payment_media`
                                                    )
                                                    return (
                                                        <ImageField
                                                            {...field}
                                                            className="!max-h-10"
                                                            disabled={isDisabled(
                                                                `payables`
                                                            )}
                                                            isFieldView
                                                            onChange={(
                                                                newImage
                                                            ) => {
                                                                if (newImage)
                                                                    field.onChange(
                                                                        newImage.id
                                                                    )
                                                                else
                                                                    field.onChange(
                                                                        undefined
                                                                    )

                                                                form.setValue(
                                                                    `payables.${idx}.proof_of_payment_media`,
                                                                    newImage
                                                                )
                                                            }}
                                                            placeholder="Upload Photo"
                                                            value={
                                                                value?.download_url as
                                                                    | string
                                                                    | undefined
                                                            }
                                                        />
                                                    )
                                                }}
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        )
                    })}
                </div>
                <FormFooterResetSubmit
                    className="sticky bottom-0"
                    disableSubmit={!form.formState.isDirty}
                    isLoading={false}
                    onReset={() => form.reset()}
                    readOnly={formProps.readOnly}
                    submitText="Pay"
                />
            </form>
        </Form>
    )
}

export default LoanPayablesForm
