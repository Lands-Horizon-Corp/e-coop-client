import { useEffect, useState } from 'react'

import { Path, useForm, useWatch } from 'react-hook-form'

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
import { useGetAllPaymentType } from '@/modules/payment-type'
import { IPaymentRequest, TPaymentMode } from '@/modules/quick-transfer'
import {
    ITransactionRequest,
    PaymentTypeCombobox,
    PaymentWithTransactionSchema,
    TPaymentTransactionProps,
    TPaymentWithTransactionFormValues,
    TransactionNoFoundBatch,
    useCreateTransactionPaymentByMode,
} from '@/modules/transaction'
import { useTransactionBatchStore } from '@/modules/transaction-batch/store/transaction-batch-store'
import { useHotkeys } from 'react-hotkeys-hook'

import { CalendarNumberIcon, ChevronDownIcon } from '@/components/icons'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useTransactionContext } from '../../context/transaction-context'
import { usePaymentOnSuccessStore } from '../../hooks/use-transaction-payment-success'

interface PaymentWithTransactionFormProps
    extends
        IClassProps,
        IForm<
            Partial<IPaymentRequest>,
            IGeneralLedger,
            string,
            TPaymentWithTransactionFormValues
        > {}

const PaymentWithTransactionForm = ({
    defaultValues,
    disabledFields,
    readOnly,
}: PaymentWithTransactionFormProps) => {
    const {
        accountPicker,
        accountPayment,
        transactionId,
        transaction,
        form: transactionForm,
        navigate,
        paymentSuccess,
        history,
        modalTransactionReverseState,
        settings_accounting_payment_default_value,
        settings_accounting_payment_default_value_id,
        settings_payment_type_default_value_id,
        allow_withdraw_negative_balance,
    } = useTransactionContext()

    const { onOpenReverseRequestAction } = modalTransactionReverseState

    const [focusTypePayment, _] = useState<TPaymentMode>('payment')

    const { data: currentTransactionBatch } = useTransactionBatchStore()

    const memberProfileId = transactionForm.getValues('member_profile_id')
    const memberJointId = transactionForm.getValues('member_join_id')
    const selectedAccountFromTable = transactionForm.getValues('account_id')
    const loanPaymentGuideModal = useModalState()
    const othersAccordionState = useModalState()

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

    const { onOpen } = usePaymentOnSuccessStore()

    const {
        mutate: creatTransactionDeposit,
        isPending,
        error,
    } = useCreateTransactionPaymentByMode({
        options: {
            onSuccess: (generalLedger) => {
                navigate.open(generalLedger.transaction_id)
                formReset()
                paymentSuccess.onOpenChange(true)
                onOpen({
                    generalLedger,
                    mode: 'payment',
                })
                othersAccordionState.onOpenChange(false)
                transactionForm.reset(
                    {
                        general_ledger_id: generalLedger.id,
                        reference_number: generalLedger.reference_number,
                        general_ledger: generalLedger,
                    },
                    {
                        keepDirtyValues: false,
                    }
                )
                form.setFocus('amount')
            },
        },
    })

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

    const { data: paymentTypes } = useGetAllPaymentType()

    const handleSubmitForm = async (
        data: TPaymentWithTransactionFormValues
    ) => {
        const currencyId = (transaction?.currency_id ||
            currentTransactionBatch?.currency_id) as TEntityId

        const transactionPaymentPayload: ITransactionRequest = {
            ...data,
            currency_id: currencyId,
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
                currency_id: currencyId,
            },
            mode: 'payment',
            transactionId,
            transactionPayload: transactionPaymentPayload,
        }

        const isORDirty = transactionForm.formState.dirtyFields.reference_number
        const submissionPayload = isORDirty
            ? { ...finalPayload, transactionId: undefined }
            : finalPayload

        creatTransactionDeposit(submissionPayload)
    }
    const handleSubmit = form.handleSubmit(
        async (data: TPaymentWithTransactionFormValues, event) => {
            event?.preventDefault()
            if (data.amount < 0 && !allow_withdraw_negative_balance) {
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
        'Alt + 1',
        (e) => {
            e.preventDefault()
            if (accountPicker.open) return
            accountPayment.onOpenChange(!accountPayment.open)
        },
        { enableOnFormTags: true, keydown: true },
        [accountPayment.open, accountPicker.open]
    )

    useHotkeys(
        'Alt + 3',
        (e) => {
            form.setFocus('amount')
            e.preventDefault()
        },
        { enableOnFormTags: true, keydown: true }
    )

    useHotkeys(
        'Alt + 2',
        (e) => {
            e.preventDefault()
            if (accountPayment.open) return
            accountPicker.onOpenChange(!accountPicker.open)
        },
        { enableOnFormTags: true, keydown: true },
        [accountPicker.open, accountPayment.open]
    )

    const errorMessage = serverRequestErrExtractor({ error })
    const { hasNoTransactionBatch } = useTransactionBatchStore()

    useEffect(() => {
        if (memberProfileId || selectedAccountFromTable) {
            form.setFocus('amount')
        }
    }, [
        memberProfileId,
        accountPicker.open,
        accountPayment.open,
        form,
        selectedAccountFromTable,
        history.open,
    ])

    if (!memberProfileId) return

    return (
        <Card
            className={cn(
                'sticky bottom-5 z-50 left-5  right-5 m-2 border-0 w-full md:w-fit p-0! h-fit bg-background',
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
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2">
                            <FormFieldWrapper
                                className="self-center"
                                control={form.control}
                                name="payment_type_id"
                                render={({ field }) => (
                                    <>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Payment Type{' '}
                                            <span>
                                                <KbdGroup>
                                                    <Kbd>Alt</Kbd>
                                                    <span>+</span>
                                                    <Kbd>1</Kbd>
                                                </KbdGroup>
                                            </span>
                                        </Label>
                                        <PaymentTypeCombobox
                                            {...field}
                                            disabled={isDisabled(
                                                'payment_type_id'
                                            )}
                                            modalState={accountPayment}
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
                                    </>
                                )}
                            />
                            <FormFieldWrapper
                                className="self-center"
                                control={form.control}
                                name="account_id"
                                render={({ field }) => (
                                    <>
                                        <Label className="text-xs font-medium text-muted-foreground">
                                            Account{' '}
                                            <span>
                                                <KbdGroup>
                                                    <Kbd>Alt</Kbd>
                                                    <span>+</span>
                                                    <Kbd>2</Kbd>
                                                </KbdGroup>
                                            </span>
                                        </Label>
                                        <AccountPicker
                                            currencyId={
                                                (transaction?.currency_id ||
                                                    currentTransactionBatch?.currency_id) as TEntityId
                                            }
                                            disabled={isDisabled('account_id')}
                                            modalState={accountPicker}
                                            mode={
                                                transaction ||
                                                currentTransactionBatch
                                                    ? 'currency-payment'
                                                    : focusTypePayment
                                            }
                                            nameOnly
                                            onSelect={(account) => {
                                                field.onChange(account.id)
                                                form.setValue(
                                                    'account',
                                                    account,
                                                    {
                                                        shouldDirty: true,
                                                    }
                                                )
                                            }}
                                            placeholder="Select an account"
                                            value={form.watch('account')}
                                        />
                                    </>
                                )}
                            />
                            <div className="flex space-x-2">
                                <FormFieldWrapper
                                    className="self-center relative flex-1 min-w-[12rem]"
                                    control={form.control}
                                    name="amount"
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <>
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Amount{' '}
                                                <span>
                                                    <KbdGroup>
                                                        <Kbd>Alt</Kbd>
                                                        <span>+</span>
                                                        <Kbd>3</Kbd>
                                                    </KbdGroup>
                                                </span>
                                            </Label>
                                            <CurrencyInput
                                                {...field}
                                                currency={
                                                    form.watch('account')
                                                        ?.currency
                                                }
                                                disabled={isDisabled('amount')}
                                                onValueChange={(
                                                    newValue = ''
                                                ) => onChange(newValue)}
                                                placeholder="Amount"
                                                showIcon
                                            />
                                        </>
                                    )}
                                />
                                <Button
                                    className="self-start px-8 flex-0 mt-6 "
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
                        <Collapsible
                            {...othersAccordionState}
                            className="w-full p-0! justify-end  overflow-auto"
                        >
                            <CollapsibleTrigger
                                className={cn(
                                    'p-1 text-sm justify-end w-full flex text-primary gap-x-2'
                                )}
                            >
                                <span className="flex items-center space-x-2">
                                    <span>others</span>

                                    <ChevronDownIcon
                                        className={cn(
                                            'ml-auto ease-in-out duration-200',
                                            !othersAccordionState.open &&
                                                ' rotate-180'
                                        )}
                                    />
                                </span>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="overflow-x-auto w-full ecoop-scroll flex gap-x-2 ">
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
                                            disabled={isDisabled('description')}
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
                                        const value = form.watch('signature')
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
                            </CollapsibleContent>
                        </Collapsible>
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
