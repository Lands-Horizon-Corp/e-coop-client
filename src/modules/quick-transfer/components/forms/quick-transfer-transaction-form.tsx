import { useEffect } from 'react'

import { useQueryClient } from '@tanstack/react-query'
import { Path, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { SHORTCUT_SCOPES } from '@/constants'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import BankCombobox from '@/modules/bank/components/bank-combobox'
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
    TransactionAmountField,
    TransactionModalJointMember,
    TransactionNoFoundBatch,
    TransactionPaymentTypeComboBox,
    TransactionReferenceNumber,
    useCreateQuickTransactionPayment,
} from '@/modules/transaction'
import { useGetUserSettings } from '@/modules/user-profile'
import { useDepositWithdrawStore } from '@/store/transaction/deposit-withdraw-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { useShortcutContext } from '@/components/shorcuts/general-shortcuts-wrapper'
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
    const { setActiveScope } = useShortcutContext()
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
        resolver: zodResolver(QuickWithdrawSchema),
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

        setActiveScope(SHORTCUT_SCOPES.QUICK_TRANSFER)
        form.setFocus('amount')
    }, [selectedAccount, form, selectedMember, setActiveScope])

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
            <form onSubmit={handleSubmit} className="min-w-[200px] relative">
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
                        control={form.control}
                        name="member_profile_id"
                        label="Member"
                        className="col-span-2"
                        render={({ field }) => (
                            <MemberPicker
                                modalState={{
                                    open: openMemberPicker,
                                    onOpenChange: setOpenMemberPicker,
                                }}
                                value={form.getValues('member') ?? undefined}
                                onSelect={(selectedMember) => {
                                    if (isDisabled('member_profile_id')) return
                                    field.onChange(selectedMember?.id)
                                    form.setValue('member', selectedMember)
                                    setSelectedMember(selectedMember)
                                }}
                                triggerVariant="outline"
                                placeholder="Select Member"
                                disabled={isDisabled('member_profile_id')}
                                allowShorcutCommand
                            />
                        )}
                    />

                    {/* Joint Member */}
                    <FormFieldWrapper
                        control={form.control}
                        name="member_joint_account_id"
                        label="Joint Member"
                        className="col-span-2"
                        render={({ field }) => (
                            <TransactionModalJointMember
                                triggerProps={{
                                    disabled:
                                        form.watch('member_profile_id') ===
                                            '' ||
                                        isDisabled('member_joint_account_id'),
                                }}
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
                                value={
                                    form.getValues('member_joint_account_id') ??
                                    undefined
                                }
                                memberJointProfile={
                                    selectedMember?.member_joint_accounts ?? []
                                }
                            />
                        )}
                    />

                    {/* Reference Number */}
                    <FormFieldWrapper
                        control={form.control}
                        name="reference_number"
                        label="Reference Number"
                        className="col-span-2"
                        render={({ field }) => (
                            <TransactionReferenceNumber
                                {...field}
                                value={field.value ?? ''}
                                className="col-span-2 w-full"
                                disabled={isDisabled('reference_number')}
                            />
                        )}
                    />

                    {/* Auto-generated OR */}
                    <FormFieldWrapper
                        control={form.control}
                        name="or_auto_generated"
                        className="col-span-2"
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={field.value ?? false}
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
                                    disabled={isDisabled('or_auto_generated')}
                                />
                                <span className="text-sm text-muted-foreground">
                                    Auto generate reference number
                                </span>
                            </div>
                        )}
                    />

                    {/* Account */}
                    <FormFieldWrapper
                        control={form.control}
                        name="account_id"
                        label="Account"
                        className="col-span-2"
                        render={({ field }) => (
                            <AccountPicker
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
                                disabled={isDisabled('account_id')}
                            />
                        )}
                    />

                    {/* Amount */}
                    <FormFieldWrapper
                        control={form.control}
                        name="amount"
                        label="Amount"
                        className="col-span-2"
                        render={({ field }) => (
                            <TransactionAmountField
                                {...field}
                                disabled={isDisabled('amount')}
                            />
                        )}
                    />

                    {/* Payment Type */}
                    <FormFieldWrapper
                        control={form.control}
                        label="Payment Type"
                        name="payment_type_id"
                        className="col-span-2"
                        render={({ field }) => (
                            <TransactionPaymentTypeComboBox
                                value={field.value ?? undefined}
                                placeholder="Select a payment type"
                                onChange={(selectedPaymentType) => {
                                    if (isDisabled('payment_type_id')) return
                                    field.onChange(selectedPaymentType.id)
                                }}
                                disabled={isDisabled('payment_type_id')}
                            />
                        )}
                    />

                    {/* Online Payment Extra Fields */}
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
                                        onChange={(selectedBank) => {
                                            if (isDisabled('bank_id')) return
                                            field.onChange(selectedBank.id)
                                        }}
                                        disabled={isDisabled('bank_id')}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="entry_date"
                                label="Entry Date"
                                className="relative"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        value={field.value ?? ''}
                                        disabled={isDisabled('entry_date')}
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
                                        onChange={(e) => {
                                            if (
                                                isDisabled(
                                                    'bank_reference_number'
                                                )
                                            )
                                                return
                                            field.onChange(e)
                                        }}
                                        disabled={isDisabled(
                                            'bank_reference_number'
                                        )}
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
                                            disabled={isDisabled(
                                                'proof_of_payment_media_id'
                                            )}
                                        />
                                    )
                                }}
                            />
                        </>
                    )}

                    {/* Note */}
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
                                disabled={isDisabled('description')}
                            />
                        )}
                    />

                    {/* Signature */}
                    <FormFieldWrapper
                        control={form.control}
                        name="signature_media_id"
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
                                    className="!max-h-25 h-25"
                                    onChange={(newImage) => {
                                        if (isDisabled('signature_media_id'))
                                            return
                                        if (newImage)
                                            field.onChange(newImage.id)
                                        else field.onChange(undefined)

                                        form.setValue('signature', newImage)
                                    }}
                                    disabled={isDisabled('signature_media_id')}
                                />
                            )
                        }}
                    />
                </div>

                <Separator className="my-2 sm:my-4" />
                <FormFooterResetSubmit
                    error={errorMessage}
                    isLoading={isQuickTransactionPending || !isFormIsDirty}
                    submitText={
                        <p className="">
                            {mode}{' '}
                            <span className="text-xs text-muted-foreground bg-secondary/10 p-0.5 rounded-md ">
                                ctrl + ↵
                            </span>
                        </p>
                    }
                    disableSubmit={
                        !form.formState.isDirty ||
                        isQuickTransactionPending ||
                        readOnly
                    }
                    className="sticky bottom-0 bg-background/80 pt-2"
                    onReset={() => form.reset()}
                />
            </form>
        </Form>
    )
}
export default QuickTransferTransactionForm
