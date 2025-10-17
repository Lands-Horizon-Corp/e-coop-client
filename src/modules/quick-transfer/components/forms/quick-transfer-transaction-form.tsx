import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Path, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { SHORTCUT_SCOPES } from '@/constants'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import { CurrencyInput } from '@/modules/currency'
import { IGeneralLedger } from '@/modules/general-ledger'
import { IMedia } from '@/modules/media'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import { useGetAll } from '@/modules/payment-type'
import {
    IPaymentQuickRequest,
    QuickWithdrawSchema,
    TPaymentMode,
    TQuickWithdrawSchemaFormValues,
} from '@/modules/quick-transfer'
import {
    PaymentTypeCombobox,
    // TransactionAmountField,
    TransactionModalJointMember,
    TransactionNoFoundBatch,
    TransactionReferenceNumber,
    useCreateQuickTransactionPayment,
} from '@/modules/transaction'
import { useGetUserSettings } from '@/modules/user-profile'
import { useDepositWithdrawStore } from '@/store/transaction/deposit-withdraw-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
// import { useShortcutContext } from '@/components/shorcuts/general-shortcuts-wrapper'
import { Checkbox } from '@/components/ui/checkbox'
import { CommandShortcut } from '@/components/ui/command'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import { IClassProps, IForm } from '@/types'

interface TransactionEntryFormProps
    extends IClassProps,
        IForm<
            Partial<IPaymentQuickRequest>,
            IGeneralLedger,
            string,
            TQuickWithdrawSchemaFormValues
        > {
    mode: TPaymentMode
}

export const QuickTransferTransactionForm = ({
    mode,
    readOnly,
    onSuccess,
    defaultValues,
    disabledFields,
}: TransactionEntryFormProps) => {
    // const { setActiveScope } = useShortcutContext()
    const {
        userSettingOR,
        settings_accounting_withdraw_default_value,
        settings_accounting_deposit_default_value,
        settings_payment_type_default_value_id,
    } = useGetUserSettings()

    const defaultAccount =
        mode === 'withdraw'
            ? settings_accounting_withdraw_default_value
            : settings_accounting_deposit_default_value

    const queryClient = useQueryClient()

    const {
        setSelectedMember,
        selectedMember,
        selectedAccount,
        openMemberPicker,
        setOpenMemberPicker,
    } = useDepositWithdrawStore()

    const form = useForm<TQuickWithdrawSchemaFormValues>({
        resolver: standardSchemaResolver(QuickWithdrawSchema),
        defaultValues: {
            ...defaultValues,
            account: defaultAccount,
            account_id: defaultAccount?.id || undefined,
            payment_type_id:
                settings_payment_type_default_value_id || undefined,
        },
    })

    const handleReset = (transaction: IGeneralLedger) => {
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
            payment_type_id:
                settings_payment_type_default_value_id || undefined,

            // transaction-specific fields
            member: transaction.member_profile,
            member_profile_id: transaction.member_profile?.id ?? '',
            account: transaction.account,
            account_id: transaction.account_id,
        })
    }

    const {
        mutate: createQuickTransaction,
        isPending: isQuickTransactionPending,
        error: quickTransactionError,
    } = useCreateQuickTransactionPayment({
        options: {
            onSuccess: (transaction) => {
                onSuccess?.(transaction)
                handleReset(transaction)
                queryClient.invalidateQueries({
                    queryKey: ['member-accounting-ledger'],
                })
            },
        },
    })
    const { data: paymentType } = useGetAll()

    const handleSubmit = form.handleSubmit(
        (data: TQuickWithdrawSchemaFormValues, event) => {
            event?.preventDefault()
            const entryDate = data.entry_date
                ? new Date(data.entry_date).toISOString()
                : undefined

            createQuickTransaction({
                data: {
                    ...data,
                    entry_date: entryDate,
                },
                mode: mode,
            })
        }
    )

    const paymentTypeType = paymentType?.find(
        (type) => type.id === form.watch('payment_type_id')
    )?.type

    const isOnlinePayment = ['bank', 'online', 'check'].includes(
        paymentTypeType?.toLowerCase() ?? ''
    )

    const isDisabled = (field: Path<TQuickWithdrawSchemaFormValues>) =>
        readOnly ||
        disabledFields?.includes(field) ||
        isQuickTransactionPending ||
        false

    const isFormIsDirty = form.formState.isDirty

    useEffect(() => {
        if (selectedAccount) {
            form.setValue('account', selectedAccount)
            form.setValue('account_id', selectedAccount?.id)
        }
        if (selectedMember) {
            form.setValue('member', selectedMember)
            form.setValue('member_profile_id', selectedMember?.id)
        }

        // setActiveScope(SHORTCUT_SCOPES.QUICK_TRANSFER)
        form.setFocus('amount')
    }, [selectedAccount, form, selectedMember /*, setActiveScope*/])

    useHotkeys('A', (e) => {
        form.setFocus('amount')
        e.preventDefault()
    })

    useHotkeys(
        'ctrl+Enter',
        (e) => {
            e.preventDefault()
            if (readOnly || isQuickTransactionPending || !isFormIsDirty) return
            handleSubmit()
        },
        {
            enableOnFormTags: ['INPUT', 'SELECT', 'TEXTAREA'],
        }
    )

    useHotkeys(
        'esc',
        (e) => {
            e.preventDefault()
            form.reset()
            setSelectedMember(null)
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
                payment_type_id:
                    settings_payment_type_default_value_id || undefined,

                // transaction-specific fields
                member: null,
                member_profile_id: '',
                account: defaultAccount,
                account_id: defaultAccount?.id || undefined,
            })
        },
        {
            scopes: [SHORTCUT_SCOPES.QUICK_TRANSFER],
            enableOnFormTags: ['INPUT', 'SELECT', 'TEXTAREA'],
        },
        [setSelectedMember, form]
    )
    const errorMessage = serverRequestErrExtractor({
        error: quickTransactionError,
    })

    return (
        <Form {...form}>
            <form className="min-w-[200px] relative" onSubmit={handleSubmit}>
                <TransactionNoFoundBatch mode="deposit-withdrawal" />
                <div className="flex flex-end">
                    <CommandShortcut className="rounded-md bg-primary/20 p-1">
                        <div className="text-[min(10px,1rem)] text-muted-foreground/80">
                            ↵ select member | Esc - reset Form
                        </div>
                    </CommandShortcut>
                </div>
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                    {/* Member */}
                    <FormFieldWrapper
                        className="col-span-2"
                        control={form.control}
                        label="Member"
                        name="member_profile_id"
                        render={({ field }) => (
                            <MemberPicker
                                allowShorcutCommand
                                disabled={isDisabled('member_profile_id')}
                                modalState={{
                                    open: openMemberPicker,
                                    onOpenChange: setOpenMemberPicker,
                                }}
                                onSelect={(selectedMember) => {
                                    if (isDisabled('member_profile_id')) return
                                    field.onChange(selectedMember?.id)
                                    form.setValue('member', selectedMember)
                                    setSelectedMember(selectedMember)
                                }}
                                placeholder="Select Member"
                                triggerVariant="outline"
                                value={form.getValues('member') ?? undefined}
                            />
                        )}
                    />

                    {/* Joint Member */}
                    <FormFieldWrapper
                        className="col-span-2"
                        control={form.control}
                        label="Joint Member"
                        name="member_joint_account_id"
                        render={({ field }) => (
                            <TransactionModalJointMember
                                memberJointProfile={
                                    selectedMember?.member_joint_accounts ?? []
                                }
                                onSelect={(jointMember) => {
                                    if (isDisabled('member_joint_account_id'))
                                        return
                                    field.onChange(jointMember?.id)
                                    form.setValue(
                                        'member_joint_account',
                                        jointMember
                                    )
                                }}
                                triggerClassName="hover:bg-secondary/40"
                                triggerProps={{
                                    disabled:
                                        form.watch('member_profile_id') ===
                                            '' ||
                                        isDisabled('member_joint_account_id'),
                                }}
                                value={
                                    form.getValues('member_joint_account_id') ??
                                    undefined
                                }
                            />
                        )}
                    />

                    {/* Reference Number */}
                    <FormFieldWrapper
                        className="col-span-2"
                        control={form.control}
                        label="Reference Number"
                        name="reference_number"
                        render={({ field }) => (
                            <TransactionReferenceNumber
                                {...field}
                                className="col-span-2 w-full"
                                disabled={isDisabled('reference_number')}
                                value={field.value ?? ''}
                            />
                        )}
                    />

                    {/* Auto-generated OR */}
                    <FormFieldWrapper
                        className="col-span-2"
                        control={form.control}
                        name="or_auto_generated"
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={field.value ?? false}
                                    disabled={isDisabled('or_auto_generated')}
                                    onCheckedChange={(checked) => {
                                        if (isDisabled('or_auto_generated'))
                                            return
                                        field.onChange(checked)
                                        if (checked) {
                                            form.setValue(
                                                'reference_number',
                                                userSettingOR
                                            )
                                        }
                                    }}
                                />
                                <span className="text-sm text-muted-foreground">
                                    Auto generate reference number
                                </span>
                            </div>
                        )}
                    />

                    {/* Account */}
                    <FormFieldWrapper
                        className="col-span-2"
                        control={form.control}
                        label="Account"
                        name="account_id"
                        render={({ field }) => (
                            <AccountPicker
                                disabled={isDisabled('account_id')}
                                nameOnly
                                onSelect={(account) => {
                                    if (isDisabled('account_id')) return
                                    field.onChange(account.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                placeholder="Select an account"
                                value={
                                    form.getValues('account') || selectedAccount
                                }
                            />
                        )}
                    />

                    {/* Amount */}
                    <FormFieldWrapper
                        className="col-span-2"
                        control={form.control}
                        label="Amount"
                        name="amount"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                currency={form.watch('account')?.currency}
                                disabled={isDisabled('amount')}
                                onValueChange={(newValue) => onChange(newValue)}
                                placeholder="Amount"
                            />
                        )}
                    />

                    {/* Payment Type */}
                    <FormFieldWrapper
                        className="col-span-2"
                        control={form.control}
                        label="Payment Type"
                        name="payment_type_id"
                        render={({ field }) => (
                            <PaymentTypeCombobox
                                disabled={isDisabled('payment_type_id')}
                                onChange={(selectedPaymentType) => {
                                    if (isDisabled('payment_type_id')) return
                                    field.onChange(selectedPaymentType.id)
                                }}
                                placeholder="Select a payment type"
                                value={field.value ?? undefined}
                            />
                        )}
                    />

                    {/* Online Payment Extra Fields */}
                    {isOnlinePayment && (
                        <>
                            <FormFieldWrapper
                                className="col-span-2"
                                control={form.control}
                                label="Bank"
                                name="bank_id"
                                render={({ field }) => (
                                    <BankCombobox
                                        {...field}
                                        disabled={isDisabled('bank_id')}
                                        onChange={(selectedBank) => {
                                            if (isDisabled('bank_id')) return
                                            field.onChange(selectedBank.id)
                                        }}
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
                                label="Entry Date"
                                name="entry_date"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        disabled={isDisabled('entry_date')}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Bank Reference Number"
                                name="bank_reference_number"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(
                                            'bank_reference_number'
                                        )}
                                        onChange={(e) => {
                                            if (
                                                isDisabled(
                                                    'bank_reference_number'
                                                )
                                            )
                                                return
                                            field.onChange(e)
                                        }}
                                        placeholder="add a bank reference number"
                                        value={field.value ?? undefined}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Proof of Payment"
                                name="proof_of_payment_media_id"
                                render={({ field }) => {
                                    const value = form.watch(
                                        'proof_of_payment_media'
                                    )
                                    return (
                                        <ImageField
                                            {...field}
                                            disabled={isDisabled(
                                                'proof_of_payment_media_id'
                                            )}
                                            onChange={(newImage) => {
                                                if (
                                                    isDisabled(
                                                        'proof_of_payment_media_id'
                                                    )
                                                )
                                                    return
                                                if (newImage)
                                                    field.onChange(newImage.id)
                                                else field.onChange(undefined)

                                                form.setValue(
                                                    'proof_of_payment_media',
                                                    newImage
                                                )
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
                        </>
                    )}

                    {/* Note */}
                    <FormFieldWrapper
                        className="h-[85%]"
                        control={form.control}
                        label="Note"
                        name="description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                autoComplete="off"
                                className="h-full"
                                disabled={isDisabled('description')}
                                id={field.name}
                                placeholder="what is this payment for?"
                            />
                        )}
                    />

                    {/* Signature */}
                    <FormFieldWrapper
                        control={form.control}
                        label="Signature"
                        name="signature_media_id"
                        render={({ field }) => {
                            const value = form.watch('signature')
                            return (
                                <SignatureField
                                    {...field}
                                    className="!max-h-25 h-25"
                                    disabled={isDisabled('signature_media_id')}
                                    onChange={(newImage) => {
                                        if (isDisabled('signature_media_id'))
                                            return
                                        if (newImage)
                                            field.onChange(newImage.id)
                                        else field.onChange(undefined)

                                        form.setValue('signature', newImage)
                                    }}
                                    placeholder="Signature"
                                    value={
                                        value
                                            ? (value as IMedia).download_url
                                            : value
                                    }
                                />
                            )
                        }}
                    />
                </div>

                <Separator className="my-2 sm:my-4" />
                <FormFooterResetSubmit
                    className="sticky bottom-0 bg-background/80 pt-2"
                    disableSubmit={
                        !form.formState.isDirty ||
                        isQuickTransactionPending ||
                        readOnly
                    }
                    error={errorMessage}
                    isLoading={isQuickTransactionPending || !isFormIsDirty}
                    onReset={() => form.reset()}
                    submitText={
                        <p className="">
                            {mode}{' '}
                            <span className="text-xs text-muted-foreground bg-secondary/10 p-0.5 rounded-md ">
                                ctrl + ↵
                            </span>
                        </p>
                    }
                />
            </form>
        </Form>
    )
}
export default QuickTransferTransactionForm
