import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Path, UseFormReturn, useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker, TAccountType } from '@/modules/account'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import { CurrencyInput } from '@/modules/currency'
import { IGeneralLedger } from '@/modules/general-ledger'
import { LoanGuideModal } from '@/modules/loan-guide/components/loan-guide'
import LoanTransactionCombobox from '@/modules/loan-transaction/components/loan-combobox'
import { IMedia } from '@/modules/media'
import { useGetAll } from '@/modules/payment-type'
import { IPaymentRequest } from '@/modules/quick-transfer'
import {
    ITransaction,
    ITransactionRequest,
    PaymentTypeCombobox,
    PaymentWithTransactionSchema,
    TPaymentTransactionProps,
    TPaymentWithTransactionFormValues,
    TransactionFromSchema,
    TransactionNoFoundBatch,
    useCreateTransactionPaymentByMode,
} from '@/modules/transaction'
import { TTransactionBatchFullorMin } from '@/modules/transaction-batch'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { useGetUserSettings } from '@/modules/user-profile'
import { useTransactionReverseSecurityStore } from '@/store/transaction-reverse-security-store'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { useHotkeys } from 'react-hotkeys-hook'

import { CalendarNumberIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

interface PaymentWithTransactionFormProps
    extends
        IClassProps,
        IForm<
            Partial<IPaymentRequest>,
            IGeneralLedger,
            string,
            TPaymentWithTransactionFormValues
        > {
    currentTransactionBatch?: TTransactionBatchFullorMin | null
    transaction?: ITransaction
    transactionId?: TEntityId
    memberProfileId?: TEntityId
    memberJointId?: TEntityId
    transactionForm: UseFormReturn<z.infer<typeof TransactionFromSchema>>
    handleResetTransaction: () => void
}

const PaymentWithTransactionForm = ({
    defaultValues,
    onSuccess,
    transaction,
    transactionId,
    memberProfileId,
    memberJointId,
    disabledFields,
    currentTransactionBatch,
    readOnly,
    transactionForm,
    handleResetTransaction,
}: PaymentWithTransactionFormProps) => {
    const { focusTypePayment, openSuccessModal } = useTransactionStore()
    const loanPaymentGuideModal = useModalState()
    const queryClient = useQueryClient()
    const {
        settings_accounting_payment_default_value,
        settings_accounting_payment_default_value_id,
        settings_payment_type_default_value_id,
        userOrganization,
    } = useGetUserSettings()

    const form = useForm<TPaymentWithTransactionFormValues>({
        resolver: standardSchemaResolver(PaymentWithTransactionSchema),
        defaultValues: {
            ...defaultValues,
            account_id:
                settings_accounting_payment_default_value_id || undefined,
            account: settings_accounting_payment_default_value || undefined,
            payment_type_id:
                settings_payment_type_default_value_id || undefined,
            entry_date: new Date().toISOString(),
            description: '',
        },
    })

    const formReset = () => {
        form.reset({
            description: '',
            amount: undefined,
            bank_id: undefined,
            entry_date: undefined,
            bank_reference_number: '',
            proof_of_payment_media_id: undefined,
            signature_media_id: undefined,
            signature: undefined,
            account: settings_accounting_payment_default_value || undefined,
            account_id:
                settings_accounting_payment_default_value_id || undefined,
            payment_type_id:
                settings_payment_type_default_value_id || undefined,
        })
    }

    const {
        mutate: creatTransactionDeposit,
        isPending,
        error,
    } = useCreateTransactionPaymentByMode({
        options: {
            onSuccess: (transaction) => {
                formReset()
                form.setFocus('amount')
                form.reset({
                    account: transaction.account,
                    account_id: transaction.account.id,
                    payment_type_id: transaction.payment_type_id,
                })
                queryClient.invalidateQueries({ queryKey: ['auth', 'context'] })
                onSuccess?.(transaction)
            },
        },
    })

    // watch account properly
    const selectedAccount = useWatch({
        control: transactionForm.control,
        name: 'account',
    })

    useEffect(() => {
        if (!selectedAccount) return

        form.setValue('account', selectedAccount)
        form.setValue('account_id', selectedAccount.id)
        form.setFocus('account_id')
    }, [selectedAccount, form])

    useEffect(() => {
        if (!openSuccessModal) {
            form.setFocus('amount')
        }
    }, [openSuccessModal, form])

    useEffect(() => {
        if (!transaction) return

        transactionForm.setValue(
            'reference_number',
            transaction.reference_number
        )
    }, [transaction, transactionForm])

    const { data: paymentTypes } = useGetAll()

    const { onOpenReverseRequestAction } = useTransactionReverseSecurityStore()

    const handleSubmitForm = async (
        data: TPaymentWithTransactionFormValues
    ) => {
        const transactionPaymentPayload: ITransactionRequest = {
            ...data,
            currency_id: (transaction?.currency_id ||
                currentTransactionBatch?.currency_id) as TEntityId,
            member_profile_id: memberProfileId,
            member_joint_account_id: memberJointId,
            source: 'payment',
            reference_number: transactionForm.getValues('reference_number'),
            is_reference_number_checked:
                transactionForm.getValues('or_auto_generated'),
        }

        const finalPayload: TPaymentTransactionProps = {
            data: {
                ...data,
                currency_id:
                    transaction?.currency_id ||
                    currentTransactionBatch?.currency_id,
            },
            mode: 'payment',
            transactionId,
            transactionPayload: transactionPaymentPayload,
        }
        const isDirty = transactionForm.formState.dirtyFields.reference_number
        if (isDirty) {
            handleResetTransaction()
            creatTransactionDeposit({
                ...finalPayload,
                transactionId: undefined,
            })
        } else {
            creatTransactionDeposit({
                ...finalPayload,
            })
        }
    }
    const handleSubmit = form.handleSubmit(
        async (data: TPaymentWithTransactionFormValues, event) => {
            event?.preventDefault()
            const trigger = await transactionForm.trigger()
            if (!trigger) return
            if (data.amount < 0) {
                onOpenReverseRequestAction({
                    onSuccess: () => {
                        handleSubmitForm(data)
                    },
                })
                return
            }
            handleSubmitForm(data)
        }
    )

    const paymentTypeType = paymentTypes?.find(
        (type) => type.id === form.watch('payment_type_id')
    )?.type

    const isOnlinePayment = ['bank', 'online', 'check'].includes(
        paymentTypeType?.toLowerCase() ?? ''
    )

    const isDisabled = (field: Path<TPaymentWithTransactionFormValues>) =>
        readOnly || disabledFields?.includes(field) || isPending || false

    const isFormIsDirty = form.formState.isDirty

    useHotkeys(
        'control+Enter',
        (e) => {
            e.preventDefault()
            if (readOnly || isPending || !isFormIsDirty) return
            handleSubmit()
        },
        {
            enableOnFormTags: true,
        }
    )

    useHotkeys(
        'Alt + W',
        (e) => {
            form.setFocus('amount')
            e.preventDefault()
        },
        { enableOnFormTags: true, keydown: true }
    )

    const errorMessage = serverRequestErrExtractor({ error })
    const { hasNoTransactionBatch } = useTransactionBatchStore()

    return (
        <Card
            className={cn(
                'sticky bottom-5 z-50 left-5 right-5 m-2 border-0 w-full md:w-fit p-0! h-fit bg-sidebar/93',
                !hasNoTransactionBatch ? 'xl:py-5!' : 'py-0'
            )}
        >
            <CardContent className="h-fit! p-2 lg:p-0! items-center w-full lg:w-full!">
                <TransactionNoFoundBatch mode="payment" />
                <Form {...form}>
                    <form
                        className="w-full md:w-fit flex flex-col overflow-auto overflow-y-auto ecoop-scroll p-2"
                        onSubmit={handleSubmit}
                    >
                        {isOnlinePayment && (
                            <Card className="absolute bottom-[105%] bg-sidebar left-0 ">
                                <CardContent className="grid w-full grid-cols-1 md:grid-cols-2 xl:grid-cols-4 min-w-fit! gap-5 p-0 py-2 px-2 ">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Bank"
                                        labelClassName="text-xs font-medium relative text-muted-foreground"
                                        name="bank_id"
                                        render={({ field }) => (
                                            <BankCombobox
                                                {...field}
                                                disabled={isDisabled('bank_id')}
                                                onChange={(selectedBank) =>
                                                    field.onChange(
                                                        selectedBank.id
                                                    )
                                                }
                                                placeholder="Select a bank"
                                                value={field.value ?? undefined}
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="relative"
                                        control={form.control}
                                        description="mm/dd/yyyy"
                                        descriptionClassName="absolute top-0 right-0"
                                        label="Bank Date"
                                        labelClassName="text-xs font-medium relative text-muted-foreground"
                                        name="entry_date"
                                        render={({ field }) => (
                                            <InputDate
                                                {...field}
                                                className="block"
                                                disabled={isDisabled(
                                                    'entry_date'
                                                )}
                                                placeholder="Bank Date"
                                                value={field.value ?? ''}
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Bank Reference Number"
                                        labelClassName="text-xs font-medium relative text-muted-foreground"
                                        name="bank_reference_number"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                disabled={isDisabled(
                                                    'bank_reference_number'
                                                )}
                                                onChange={field.onChange}
                                                placeholder="add a bank reference number"
                                                value={field.value ?? undefined}
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Proof of Payment"
                                        labelClassName="text-xs font-medium relative text-muted-foreground"
                                        name="proof_of_payment_media_id"
                                        render={({ field }) => {
                                            const value = form.watch(
                                                'proof_of_payment_media'
                                            )
                                            return (
                                                <ImageField
                                                    {...field}
                                                    className="max-h-10!"
                                                    disabled={isDisabled(
                                                        'proof_of_payment_media_id'
                                                    )}
                                                    isFieldView
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
                                                    placeholder="Upload Photo"
                                                    value={
                                                        value
                                                            ? (value as IMedia)
                                                                  .download_url
                                                            : value
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                </CardContent>
                            </Card>
                        )}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-2">
                            <FormFieldWrapper
                                className="self-center"
                                control={form.control}
                                label="Payment Type"
                                labelClassName="text-xs font-medium text-muted-foreground"
                                name="payment_type_id"
                                render={({ field }) => (
                                    <PaymentTypeCombobox
                                        {...field}
                                        disabled={isDisabled('payment_type_id')}
                                        onChange={(selectedPaymentType) => {
                                            field.onChange(
                                                selectedPaymentType?.id
                                            )
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
                                        placeholder="Select a payment type"
                                        value={field.value ?? undefined}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="self-center"
                                control={form.control}
                                label="Account"
                                labelClassName="text-xs font-medium text-muted-foreground"
                                name="account_id"
                                render={({ field }) => (
                                    <AccountPicker
                                        currencyId={
                                            (transaction?.currency_id ||
                                                currentTransactionBatch?.currency_id) as TEntityId
                                        }
                                        disabled={isDisabled('account_id')}
                                        mode={
                                            transaction ||
                                            currentTransactionBatch
                                                ? 'currency-payment'
                                                : focusTypePayment
                                        }
                                        nameOnly
                                        onSelect={(account) => {
                                            field.onChange(account.id)
                                            form.setValue('account', account, {
                                                shouldDirty: true,
                                            })
                                        }}
                                        placeholder="Select an account"
                                        value={form.watch('account')}
                                    />
                                )}
                            />
                            <div className="flex md:col-span-2 space-x-2">
                                <FormFieldWrapper
                                    className="self-center min-w-[10rem]"
                                    control={form.control}
                                    label="Amount"
                                    labelClassName="text-xs font-medium text-muted-foreground"
                                    name="amount"
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            currency={
                                                form.watch('account')?.currency
                                            }
                                            disabled={isDisabled('amount')}
                                            onValueChange={(newValue = '') =>
                                                onChange(newValue)
                                            }
                                            placeholder="Amount"
                                            showIcon
                                        />
                                    )}
                                />
                                <Button
                                    className="self-start px-8 mt-6 min-w-[15rem] "
                                    disabled={isPending}
                                    tabIndex={-1}
                                    type="submit"
                                >
                                    {isPending ? (
                                        <LoadingSpinner />
                                    ) : (
                                        <>{focusTypePayment}</>
                                    )}
                                </Button>
                            </div>
                            {(
                                [
                                    'Loan',
                                    'SVF-Ledger',
                                    'Interest',
                                    'Fines',
                                ] as TAccountType[]
                            ).includes(form.watch('account')?.type) && (
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Loan"
                                    labelClassName="text-xs font-medium text-muted-foreground"
                                    name="loan_transaction_id"
                                    render={({ field }) => (
                                        <LoanTransactionCombobox
                                            {...field}
                                            disabled={isDisabled(
                                                'loan_transaction_id'
                                            )}
                                            loanAccountId={form.watch(
                                                'account_id'
                                            )}
                                            memberProfileId={memberProfileId}
                                            mode="member-profile-loan-account"
                                            onChange={(selectedLoanAccount) => {
                                                field.onChange(
                                                    selectedLoanAccount?.id
                                                )
                                            }}
                                            placeholder="Select loan type"
                                            value={field.value ?? undefined}
                                        />
                                    )}
                                />
                            )}

                            <FormErrorMessage errorMessage={errorMessage} />
                        </div>
                        <Accordion
                            className="w-full hidden p-0! overflow-auto"
                            collapsible
                            type="single"
                        >
                            <AccordionItem
                                className=" w-full border-0"
                                value="item-1"
                            >
                                <AccordionTrigger
                                    className={cn(
                                        'p-1 text-sm justify-end text-primary flex w-full gap-x-2'
                                    )}
                                >
                                    others
                                </AccordionTrigger>
                                <AccordionContent className="overflow-x-auto ecoop-scroll flex gap-x-2 ">
                                    <FormFieldWrapper
                                        className="h-full col-span-2"
                                        control={form.control}
                                        label="Description"
                                        name="description"
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                autoComplete="off"
                                                className="h-12! max-h-20! border!"
                                                disabled={isDisabled(
                                                    'description'
                                                )}
                                                id={field.name}
                                                placeholder="a short description..."
                                                value={field.value}
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="h-15"
                                        control={form.control}
                                        label="Signature"
                                        name="signature_media_id"
                                        render={({ field }) => {
                                            const value =
                                                form.watch('signature')
                                            return (
                                                <SignatureField
                                                    {...field}
                                                    className="max-h-15! min-h-15 "
                                                    disabled={isDisabled(
                                                        'signature_media_id'
                                                    )}
                                                    hideIcon
                                                    onChange={(newImage) => {
                                                        if (newImage) {
                                                            field.onChange(
                                                                newImage.id
                                                            )
                                                            form.setValue(
                                                                'signature',
                                                                newImage as IMedia
                                                            )
                                                        } else {
                                                            field.onChange(
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                'signature',
                                                                undefined
                                                            )
                                                        }
                                                    }}
                                                    placeholder="Signature"
                                                    value={
                                                        value
                                                            ? (value as IMedia)
                                                                  .download_url
                                                            : value
                                                    }
                                                />
                                            )
                                        }}
                                    />
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                        <div className="flex items-center w-fit mb-2 justify-end">
                            {form.watch('loan_transaction_id') && (
                                <>
                                    <div
                                        className="absolute"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {/* <LoanPaymentScheduleModal
                                            {...loanPaymentScheduleModal}
                                            loanPaymentProps={{
                                                accountDefaultId:
                                                    form.watch('account_id'),
                                                loanTransactionId: form.watch(
                                                    'loan_transaction_id'
                                                ) as TEntityId,
                                            }}
                                        /> */}
                                        <LoanGuideModal
                                            {...loanPaymentGuideModal}
                                            loanTransactionId={
                                                form.watch(
                                                    'loan_transaction_id'
                                                )!
                                            }
                                        />
                                    </div>
                                    <Button
                                        className="text-xs px-2 w-fit ml-2 mr-auto"
                                        onClick={() =>
                                            loanPaymentGuideModal.onOpenChange(
                                                true
                                            )
                                        }
                                        size="sm"
                                        type="button"
                                    >
                                        <CalendarNumberIcon /> Loan Payment
                                        Schedule
                                    </Button>
                                </>
                            )}
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default PaymentWithTransactionForm
