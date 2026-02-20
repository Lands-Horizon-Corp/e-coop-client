import { useCallback, useEffect } from 'react'

import { Path, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import { CurrencyInput } from '@/modules/currency'
import { IGeneralLedger } from '@/modules/general-ledger'
import { IMedia } from '@/modules/media'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import {
    IPaymentQuickRequest,
    QuickWithdrawSchema,
    TPaymentMode,
    TQuickWithdrawSchemaFormValues,
} from '@/modules/quick-transfer'
import {
    PaymentTypeCombobox,
    TransactionModalJointMember,
    TransactionModalSuccessPayment,
    TransactionNoFoundBatch,
    TransactionReferenceNumber,
    useCreateQuickTransactionPayment,
} from '@/modules/transaction'
import { usePaymentOnSuccessStore } from '@/modules/transaction/hooks/use-transaction-payment-success'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { ChevronDownIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Kbd, KbdGroup } from '@/components/ui/kbd'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { IClassProps, IForm } from '@/types'

import { useQuickTransferContext } from '../../context/quick-transfer-context'
import { useQuickTransferHotKeys } from '../../hooks/use-quick-hot-keys'

interface TransactionEntryFormProps
    extends
        IClassProps,
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
    const {
        finalOR,
        setSelectedMember,
        selectedAccount,
        selectedMember,
        openMemberPicker,
        accountPickerState,
        paymentType,
        paymentTypeModalState,
        othersState,
        modalTransactionReverseState: { onOpenReverseRequestAction },
        branchSetting,
        settings_payment_type_default_value_id,
        allow_withdraw_negative_balance,
        // allowUserInputreferenceNumber,
        // defaultReferenceNumber,
        defaultAccount,
        user_organization,
    } = useQuickTransferContext()
    const { onOpen } = usePaymentOnSuccessStore()

    const form = useForm<TQuickWithdrawSchemaFormValues>({
        resolver: standardSchemaResolver(QuickWithdrawSchema),
        defaultValues: {
            ...defaultValues,
            account: defaultAccount,
            account_id: defaultAccount?.id || undefined,
            reference_number: '',
            // is_reference_number_checked: !allowUserInputreferenceNumber,
            payment_type_id:
                settings_payment_type_default_value_id || undefined,
        },
    })

    const handleAutoGenerateOR = useCallback(
        (isAuto?: boolean) => {
            form.setValue('is_reference_number_checked', isAuto)
            if (!finalOR)
                return toast.warning(
                    'Failed to generate quick transfer OR, could not retrieve settings'
                )

            if (isAuto) {
                form.setValue('reference_number', finalOR)
            }
        },
        [finalOR, form]
    )

    useEffect(() => {
        if (mode === 'deposit') {
            const shouldGenerate =
                !form.getValues('reference_number') &&
                (!branchSetting.deposit_allow_user_input ||
                    user_organization?.deposit_auto_increment)

            if (!shouldGenerate) return
        }
        if (mode === 'withdraw') {
            const shouldGenerate =
                !form.getValues('reference_number') &&
                (!branchSetting?.withdraw_allow_user_input ||
                    user_organization?.withdraw_auto_increment)
            if (!shouldGenerate) return
        }
        handleAutoGenerateOR(true)
    }, [user_organization, branchSetting, form, mode, handleAutoGenerateOR])

    const {
        mutate: createQuickTransaction,
        isPending: isQuickTransactionPending,
        error: quickTransactionError,
        isSuccess,
    } = useCreateQuickTransactionPayment({
        options: {
            onSuccess: (transaction) => {
                onSuccess?.(transaction)
                form.resetField('is_reference_number_checked')
                form.resetField('amount')
                form.reset(
                    {
                        account_id: transaction.account_id,
                        account: transaction.account,
                        member: selectedMember,
                        member_profile_id: selectedMember?.id,
                        reference_number: transaction.reference_number,
                    },
                    { keepDefaultValues: true }
                )
                othersState.onOpenChange(false)
                onOpen({
                    generalLedger: transaction,
                    mode: mode,
                })
            },
        },
    })

    const handleSubmitForm = (data: TQuickWithdrawSchemaFormValues) => {
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

    const handleSubmit = form.handleSubmit(
        (data: TQuickWithdrawSchemaFormValues, event) => {
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

    const handleResetAll = () => {
        const isReferenceNumber =
            mode === 'deposit'
                ? !branchSetting.deposit_allow_user_input ||
                  user_organization?.deposit_auto_increment
                : !branchSetting?.withdraw_allow_user_input ||
                  user_organization?.withdraw_auto_increment

        form.reset({
            reference_number: finalOR,
            is_reference_number_checked: isReferenceNumber,
            account: defaultAccount,
            account_id: defaultAccount?.id || undefined,
            payment_type_id:
                settings_payment_type_default_value_id || undefined,
        })
        setSelectedMember(null)
        othersState.onOpenChange(false)
    }

    const errorMessage = serverRequestErrExtractor({
        error: quickTransactionError,
    })

    useQuickTransferHotKeys({
        form,
        handleResetAll,
        readOnly,
        isQuickTransactionPending,
        isFormIsDirty,
        handleSubmit,
    })

    useEffect(() => {
        if (selectedMember) {
            form.setFocus('amount')
        }
    }, [isSuccess, selectedMember, accountPickerState.open, form])

    const handleAllowToInput = (mode: TPaymentMode) => {
        if (mode === 'deposit') {
            return branchSetting.deposit_allow_user_input
        }
        return branchSetting.withdraw_allow_user_input
    }
    console.log(handleAllowToInput(mode))

    return (
        <>
            <TransactionModalSuccessPayment
                onOpenPicker={() => {
                    accountPickerState.onOpenChange(true)
                }}
            />
            <TransactionNoFoundBatch mode="deposit-withdrawal" />
            <Form {...form}>
                <form
                    className="min-w-[200px] relative"
                    onSubmit={handleSubmit}
                >
                    <div className="flex justify-end w-full ">
                        <Button
                            className="text-[min(10px,1rem)] "
                            onClick={(e) => {
                                e.preventDefault()
                                handleResetAll()
                            }}
                            size={'sm'}
                            variant="outline"
                        >
                            ↵ select member | Esc - reset Form
                        </Button>
                    </div>
                    <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
                        {/* Member */}
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            name="member_profile_id"
                            render={({ field }) => (
                                <>
                                    <Label className="text-xs font-medium inline-flex items-center text-muted-foreground">
                                        Member{' '}
                                        <span>
                                            <KbdGroup className="">
                                                <Kbd className="text-[10px]">
                                                    Enter
                                                </Kbd>
                                            </KbdGroup>
                                        </span>
                                    </Label>
                                    <MemberPicker
                                        {...openMemberPicker}
                                        allowShorcutCommand
                                        disabled={isDisabled(
                                            'member_profile_id'
                                        )}
                                        onSelect={(selectedMember) => {
                                            if (isDisabled('member_profile_id'))
                                                return
                                            field.onChange(selectedMember?.id)
                                            form.setValue(
                                                'member',
                                                selectedMember
                                            )
                                            setSelectedMember(selectedMember)
                                        }}
                                        placeholder="Select Member"
                                        triggerVariant="outline"
                                        value={
                                            form.getValues('member') ??
                                            undefined
                                        }
                                    />
                                </>
                            )}
                        />

                        {/* Reference Number */}
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            name="reference_number"
                            render={({ field }) => (
                                <>
                                    <Label className="text-xs font-medium inline-flex items-center text-muted-foreground">
                                        Reference Number
                                        <span>
                                            <KbdGroup className="ml-1">
                                                <Kbd className="text-[10px]">
                                                    Alt
                                                </Kbd>
                                                <span className="text-[10px]">
                                                    +
                                                </span>
                                                <Kbd className="text-[10px]">
                                                    1
                                                </Kbd>
                                            </KbdGroup>
                                        </span>
                                    </Label>{' '}
                                    <TransactionReferenceNumber
                                        {...field}
                                        className="col-span-2 w-full"
                                        disabled={
                                            !handleAllowToInput(mode) ||
                                            isDisabled('reference_number')
                                        }
                                        value={field.value ?? ''}
                                    />
                                </>
                            )}
                        />

                        {/* Auto-generated OR */}
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            name="is_reference_number_checked"
                            render={({ field }) => (
                                <div className="flex items-center gap-2">
                                    <Switch
                                        checked={field.value}
                                        className="mr-2 max-h-4 max-w-9"
                                        disabled={isDisabled(
                                            'is_reference_number_checked'
                                        )}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked)
                                            if (checked) {
                                                form.setValue(
                                                    'reference_number',
                                                    finalOR,
                                                    { shouldDirty: true }
                                                )
                                            }
                                            if (
                                                isDisabled(
                                                    'is_reference_number_checked'
                                                )
                                            )
                                                return
                                        }}
                                        thumbClassName="size-3"
                                    />
                                    <Label className="text-xs font-medium text-muted-foreground">
                                        OR Auto Generated
                                    </Label>
                                    <Label className="text-[10px] font-medium text-muted-foreground">
                                        <KbdGroup className="ml-1">
                                            <Kbd className="text-[10px]">
                                                Alt
                                            </Kbd>
                                            <span className="text-[10px]">
                                                +
                                            </span>
                                            <Kbd className="text-[10px]">E</Kbd>
                                        </KbdGroup>
                                    </Label>
                                </div>
                            )}
                        />

                        {/* Account */}
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            name="account_id"
                            render={({ field }) => (
                                <>
                                    <Label className="text-xs font-medium inline-flex items-center text-muted-foreground">
                                        Account
                                        <KbdGroup className="ml-1">
                                            <Kbd className="text-[10px]">
                                                Alt
                                            </Kbd>
                                            <span className="text-[10px]">
                                                +
                                            </span>
                                            <Kbd className="text-[10px]">2</Kbd>
                                        </KbdGroup>
                                    </Label>{' '}
                                    <AccountPicker
                                        disabled={isDisabled('account_id')}
                                        modalState={accountPickerState}
                                        mode="deposit"
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
                                            form.getValues('account') ||
                                            selectedAccount
                                        }
                                    />
                                </>
                            )}
                        />

                        {/* Amount */}
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            name="amount"
                            render={({ field: { onChange, ...field } }) => (
                                <>
                                    <Label className="text-xs font-medium inline-flex items-center text-muted-foreground">
                                        Amount
                                        <KbdGroup className="ml-1">
                                            <Kbd className="text-[10px]">
                                                Alt
                                            </Kbd>
                                            <span className="text-[10px]">
                                                +
                                            </span>
                                            <Kbd className="text-[10px]">3</Kbd>
                                        </KbdGroup>
                                    </Label>{' '}
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
                                    />
                                </>
                            )}
                        />

                        {/* Payment Type */}
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            name="payment_type_id"
                            render={({ field }) => (
                                <>
                                    <Label className="text-xs font-medium inline-flex items-center text-muted-foreground">
                                        Payment type
                                        <span>
                                            <KbdGroup className="ml-1">
                                                <Kbd className="text-[10px]">
                                                    Alt
                                                </Kbd>
                                                <span className="text-[10px]">
                                                    +
                                                </span>
                                                <Kbd className="text-[10px]">
                                                    4
                                                </Kbd>
                                            </KbdGroup>
                                        </span>
                                    </Label>{' '}
                                    <PaymentTypeCombobox
                                        {...paymentTypeModalState}
                                        disabled={isDisabled('payment_type_id')}
                                        onChange={(selectedPaymentType) => {
                                            if (isDisabled('payment_type_id'))
                                                return
                                            field.onChange(
                                                selectedPaymentType?.id
                                            )
                                        }}
                                        placeholder="Select a payment type"
                                        value={field.value ?? undefined}
                                    />
                                </>
                            )}
                        />
                        <Collapsible {...othersState} className=" col-span-2">
                            <CollapsibleTrigger className="flex w-full items-center justify-between">
                                <Label className="text-xs font-medium ">
                                    Others
                                    <span>
                                        <KbdGroup className="ml-1">
                                            <Kbd className="text-[10px]">
                                                f1
                                            </Kbd>
                                        </KbdGroup>
                                    </span>
                                </Label>{' '}
                                <>
                                    <ChevronDownIcon
                                        className={` duration-300 ease-in-out ${othersState.open ? 'rotate-180' : ''}`}
                                    />
                                </>
                            </CollapsibleTrigger>
                            <CollapsibleContent className=" col-span-2 w-full">
                                <Separator className="my-2" />
                                <FormFieldWrapper
                                    className="col-span-2"
                                    control={form.control}
                                    name="member_joint_account_id"
                                    render={({ field }) => (
                                        <>
                                            <Label className="text-xs font-medium text-muted-foreground">
                                                Joint Member
                                                <span>
                                                    <KbdGroup>
                                                        <Kbd>Alt</Kbd>
                                                        <span>+</span>
                                                        <Kbd>5</Kbd>
                                                    </KbdGroup>
                                                </span>
                                            </Label>
                                            <TransactionModalJointMember
                                                jointMembers={
                                                    selectedMember?.member_joint_accounts ??
                                                    []
                                                }
                                                onSelect={(jointMember) => {
                                                    if (
                                                        isDisabled(
                                                            'member_joint_account_id'
                                                        )
                                                    )
                                                        return
                                                    field.onChange(
                                                        jointMember?.id
                                                    )
                                                    form.setValue(
                                                        'member_joint_account',
                                                        jointMember
                                                    )
                                                }}
                                                shortcutKeyTrigger="Alt + 5"
                                                triggerClassName="hover:bg-secondary/40 block"
                                                triggerContentMode="full"
                                                triggerProps={{
                                                    disabled:
                                                        form.getValues(
                                                            'member_profile_id'
                                                        ) === '' ||
                                                        isDisabled(
                                                            'member_joint_account_id'
                                                        ),
                                                }}
                                                value={form.getValues(
                                                    'member_joint_account'
                                                )}
                                            />
                                        </>
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
                                                    disabled={isDisabled(
                                                        'bank_id'
                                                    )}
                                                    onChange={(
                                                        selectedBank
                                                    ) => {
                                                        if (
                                                            isDisabled(
                                                                'bank_id'
                                                            )
                                                        )
                                                            return
                                                        field.onChange(
                                                            selectedBank.id
                                                        )
                                                    }}
                                                    placeholder="Select a bank"
                                                    value={
                                                        field.value ?? undefined
                                                    }
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
                                                    disabled={isDisabled(
                                                        'entry_date'
                                                    )}
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
                                                    value={
                                                        field.value ?? undefined
                                                    }
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
                                                        onChange={(
                                                            newImage
                                                        ) => {
                                                            if (
                                                                isDisabled(
                                                                    'proof_of_payment_media_id'
                                                                )
                                                            )
                                                                return
                                                            if (newImage)
                                                                field.onChange(
                                                                    newImage.id
                                                                )
                                                            else
                                                                field.onChange(
                                                                    undefined
                                                                )

                                                            form.setValue(
                                                                'proof_of_payment_media',
                                                                newImage
                                                            )
                                                        }}
                                                        placeholder="Upload Photo"
                                                        value={
                                                            value
                                                                ? (
                                                                      value as IMedia
                                                                  ).download_url
                                                                : value
                                                        }
                                                    />
                                                )
                                            }}
                                        />
                                    </>
                                )}

                                <div className="w-full grid grid-cols-2 gap-2">
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
                                                className="h-full min-h-full max-h-fit ecoop-scroll"
                                                disabled={isDisabled(
                                                    'description'
                                                )}
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
                                            const value =
                                                form.watch('signature')
                                            return (
                                                <SignatureField
                                                    {...field}
                                                    className="max-h-25! h-25"
                                                    disabled={isDisabled(
                                                        'signature_media_id'
                                                    )}
                                                    onChange={(newImage) => {
                                                        if (
                                                            isDisabled(
                                                                'signature_media_id'
                                                            )
                                                        )
                                                            return
                                                        if (newImage)
                                                            field.onChange(
                                                                newImage.id
                                                            )
                                                        else
                                                            field.onChange(
                                                                undefined
                                                            )

                                                        form.setValue(
                                                            'signature',
                                                            newImage
                                                        )
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
                                </div>
                            </CollapsibleContent>
                        </Collapsible>
                        {/* Joint Member */}
                    </div>
                    <FormFooterResetSubmit
                        className="sticky bottom-0 bg-background/80 pt-2"
                        disableSubmit={
                            !form.formState.isDirty ||
                            isQuickTransactionPending ||
                            readOnly
                        }
                        error={errorMessage}
                        isLoading={isQuickTransactionPending}
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
        </>
    )
}
export default QuickTransferTransactionForm
