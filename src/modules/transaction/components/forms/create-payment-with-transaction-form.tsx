import { useEffect, useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/helpers'
import { AccountPicker } from '@/modules/account'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import { IGeneralLedger } from '@/modules/general-ledger'
import { IMedia } from '@/modules/media'
import { useGetAll } from '@/modules/payment-type'
import { IPaymentRequest } from '@/modules/quick-transfer'
import {
    ITransactionRequest,
    PaymentWithTransactionSchema,
    TPaymentWithTransactionFormValues,
    TransactionAmountField,
    TransactionPaymentTypeComboBox,
    useCreateTransactionPaymentByMode,
} from '@/modules/transaction'
import { useGetUserSettings } from '@/modules/user-profile'
import { useTransactionStore } from '@/store/transaction/transaction-store'
import { useHotkeys } from 'react-hotkeys-hook'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

import ReferenceNumber from '../input/transaction-reference-number-field'
import TransactionReverseRequestFormModal from '../modals/transaction-modal-request-reverse'

interface PaymentWithTransactionFormProps
    extends IClassProps,
        IForm<
            Partial<IPaymentRequest>,
            IGeneralLedger,
            string,
            TPaymentWithTransactionFormValues
        > {
    transactionId?: TEntityId
    memberProfileId?: TEntityId
    memberJointId?: TEntityId
}

const PaymentWithTransactionForm = ({
    defaultValues,
    onSuccess,
    transactionId,
    memberProfileId,
    memberJointId,
}: PaymentWithTransactionFormProps) => {
    const { focusTypePayment, selectedAccount, selectedMember } =
        useTransactionStore()
    const { open, onOpenChange } = useModalState()
    const [isVerified, setIsVerified] = useState(false)
    const {
        userSettingOR,
        settings_accounting_payment_default_value,
        settings_accounting_payment_default_value_id,
        settings_payment_type_default_value_id,
    } = useGetUserSettings()

    const form = useForm<TPaymentWithTransactionFormValues>({
        resolver: zodResolver(PaymentWithTransactionSchema),
        defaultValues: {
            ...defaultValues,
            account_id:
                settings_accounting_payment_default_value_id || undefined,
            account: settings_accounting_payment_default_value || undefined,
            payment_type_id:
                settings_payment_type_default_value_id || undefined,
            reference_number: userSettingOR,
            entry_date: new Date().toISOString(),
            description: '',
        },
    })

    useEffect(() => {
        if (selectedAccount) {
            form.setValue('account', selectedAccount)
            form.setValue('account_id', selectedAccount?.id)
        }
        form.setFocus('amount')
    }, [selectedAccount, form, selectedMember])

    const formReset = () => {
        form.reset({
            reference_number: userSettingOR,
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
                form.setValue('account', transaction.account || '')
                form.setValue('account_id', transaction?.account?.id ?? '')
                form.setValue(
                    'payment_type_id',
                    settings_payment_type_default_value_id || ''
                )
                form.setFocus('amount')
                onSuccess?.(transaction)
                setIsVerified(false)
            },
        },
    })

    const { data: paymentTypes } = useGetAll()

    const handleSubmit = form.handleSubmit(
        (data: TPaymentWithTransactionFormValues) => {
            const entryDate = data.entry_date
                ? new Date(data.entry_date).toISOString()
                : undefined

            if (data.amount < 0) {
                if (!isVerified) {
                    onOpenChange(true)
                    return
                }
            }
            const transactionpayPayload: ITransactionRequest = {
                ...data,
                member_profile_id: memberProfileId,
                member_joint_account_id: memberJointId,
                source: 'payment',
            }
            creatTransactionDeposit({
                data: {
                    ...data,
                    entry_date: entryDate,
                },
                mode: 'payment',
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
    const handleSetOR = () => {
        form.setValue('reference_number', userSettingOR)
    }

    useHotkeys('A', (e) => {
        form.setFocus('amount')
        e.preventDefault()
    })

    useHotkeys(
        'ctrl+Enter',
        (e) => {
            e.preventDefault()
            handleSubmit()
        },
        {
            enableOnFormTags: ['INPUT', 'SELECT', 'TEXTAREA'],
            scopes: ['transaction'],
        }
    )

    return (
        <Card className="sticky bottom-2 left-5 right-5 m-2 w-[99%] !p-0 h-fit bg-sidebar/93">
            <CardContent className="!h-fit grid grid-cols-1 p-2 lg:!p-0 items-center w-full lg:!w-full">
                <Form {...form}>
                    <TransactionReverseRequestFormModal
                        open={open}
                        onOpenChange={onOpenChange}
                        formProps={{
                            onSuccess: () => {
                                toast.success('success request verification')
                                setIsVerified(true)
                            },
                        }}
                    />
                    <form
                        onSubmit={handleSubmit}
                        className=" !w-full flex flex-col lg:justify-between lg:flex-row overflow-auto "
                    >
                        <div className="overflow-y-auto ecoop-scroll p-2">
                            {isOnlinePayment && (
                                <Card className="absolute bottom-[105%] bg-sidebar left-0 ">
                                    <CardContent className="grid w-ful grid-cols-1 lg:grid-cols-5 !min-w-fit gap-5 p-0 py-2 px-2 ">
                                        <FormFieldWrapper
                                            control={form.control}
                                            labelClassName="text-xs font-medium relative text-muted-foreground"
                                            name="bank_id"
                                            label="Bank"
                                            render={({ field }) => (
                                                <BankCombobox
                                                    {...field}
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    placeholder="Select a bank"
                                                    onChange={(selectedBank) =>
                                                        field.onChange(
                                                            selectedBank.id
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="entry_date"
                                            labelClassName="text-xs font-medium relative text-muted-foreground"
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
                                            labelClassName="text-xs font-medium relative text-muted-foreground"
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    value={
                                                        field.value ?? undefined
                                                    }
                                                    placeholder="add a bank reference number"
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="proof_of_payment_media_id"
                                            labelClassName="text-xs font-medium relative text-muted-foreground"
                                            label="Proof of Payment"
                                            render={({ field }) => {
                                                const value = form.watch(
                                                    'proof_of_payment_media'
                                                )
                                                return (
                                                    <ImageField
                                                        {...field}
                                                        placeholder="Upload Photo"
                                                        className="!max-h-10"
                                                        isFieldView
                                                        value={
                                                            value
                                                                ? (
                                                                      value as IMedia
                                                                  ).download_url
                                                                : value
                                                        }
                                                        onChange={(
                                                            newImage
                                                        ) => {
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
                                    </CardContent>
                                </Card>
                            )}
                            <div className=" !min-w-fit lg:!min-w-[900px] h-fit grid grid-cols-1 md:grid-cols-2 gap-3 lg:grid-cols-4  ">
                                <div className="relative">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="reference_number"
                                        label="Reference Number"
                                        className="relative"
                                        labelClassName="text-xs font-medium relative text-muted-foreground"
                                        render={({ field }) => (
                                            <div className="flex flex-col ">
                                                <ReferenceNumber
                                                    {...field}
                                                    id={field.name}
                                                    ref={field.ref}
                                                    placeholder="Reference Number"
                                                    value={field.value}
                                                    onChange={field.onChange}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="or_auto_generated"
                                        labelClassName="text-xs font-medium  text-muted-foreground"
                                        className="absolute left-1 -bottom-8 w-fit"
                                        render={({ field }) => (
                                            <div className="flex py-2 items-center">
                                                <Checkbox
                                                    className="mr-2"
                                                    checked={field.value}
                                                    onCheckedChange={(
                                                        value
                                                    ) => {
                                                        field.onChange(value)
                                                        if (value) {
                                                            handleSetOR()
                                                        }
                                                    }}
                                                />
                                                <Label className="text-xs font-medium text-muted-foreground">
                                                    OR Auto Generated
                                                </Label>
                                            </div>
                                        )}
                                    />
                                </div>
                                <FormFieldWrapper
                                    control={form.control}
                                    name="amount"
                                    label="Amount"
                                    labelClassName="text-xs font-medium text-muted-foreground"
                                    render={({ field }) => {
                                        return (
                                            <TransactionAmountField
                                                isDefault
                                                {...field}
                                            />
                                        )
                                    }}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="account_id"
                                    label="Account"
                                    labelClassName="text-xs font-medium text-muted-foreground"
                                    render={({ field }) => (
                                        <AccountPicker
                                            mode={focusTypePayment}
                                            value={form.watch('account')}
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
                                            nameOnly
                                            placeholder="Select an account"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Payment Type"
                                    name="payment_type_id"
                                    labelClassName="text-xs font-medium text-muted-foreground"
                                    render={({ field }) => (
                                        <TransactionPaymentTypeComboBox
                                            {...field}
                                            value={field.value ?? undefined}
                                            placeholder="Select a payment type"
                                            onChange={(selectedPaymentType) => {
                                                field.onChange(
                                                    selectedPaymentType.id
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
                                        />
                                    )}
                                />

                                <Accordion
                                    type="single"
                                    collapsible
                                    className="w-full col-span-4 !p-0 overflow-auto"
                                >
                                    <AccordionItem
                                        value="item-1"
                                        className=" w-full border-0"
                                    >
                                        <AccordionTrigger
                                            className={cn(
                                                'p-1 text-xs justify-end text-primary flex w-full gap-x-2'
                                            )}
                                        >
                                            others
                                        </AccordionTrigger>
                                        <AccordionContent className="overflow-x-auto ecoop-scroll flex gap-x-2 ">
                                            <FormFieldWrapper
                                                control={form.control}
                                                name="description"
                                                label="Description"
                                                className="h-full col-span-2"
                                                render={({ field }) => (
                                                    <Textarea
                                                        {...field}
                                                        id={field.name}
                                                        value={field.value}
                                                        placeholder="a short description..."
                                                        autoComplete="off"
                                                        className="!h-12 !max-h-20 !border"
                                                    />
                                                )}
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                name="signature_media_id"
                                                label="Signature"
                                                className="h-15"
                                                render={({ field }) => {
                                                    const value =
                                                        form.watch('signature')
                                                    return (
                                                        <SignatureField
                                                            {...field}
                                                            className="!max-h-15 min-h-15 "
                                                            placeholder="Signature"
                                                            hideIcon
                                                            value={
                                                                value
                                                                    ? (
                                                                          value as IMedia
                                                                      )
                                                                          .download_url
                                                                    : value
                                                            }
                                                            onChange={(
                                                                newImage
                                                            ) => {
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
                                                        />
                                                    )
                                                }}
                                            />
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </div>
                            <FormErrorMessage errorMessage={error} />
                        </div>
                        <div className="flex items-center justify-end mb-2 gap-x-2">
                            <Button
                                size="sm"
                                type="button"
                                variant="ghost"
                                id="select-member-button"
                                onClick={() => formReset()}
                                className=" w-full self-end px-8 sm:w-fit"
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
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}

export default PaymentWithTransactionForm
