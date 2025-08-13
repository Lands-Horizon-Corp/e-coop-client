import { useQueryClient } from '@tanstack/react-query'

import { zodResolver } from '@hookform/resolvers/zod'

import JointMemberProfileListModal from '@/routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/joint-member-profile-list-modal'
import { useTransactionShortcuts } from '@/routes/org/$orgname/branch.$branchname/(employee)/transaction/quick-transfer/-component/quick-transaction-shortcuts'
import { useImagePreview } from '@/store/image-preview-store'
import { useDepositWithdrawStore } from '@/store/transaction/deposit-withdraw-store'
import { useForm } from 'react-hook-form'

import BankCombobox from '@/components/comboboxes/bank-combobox'
import PaymentTypeComboBox from '@/components/comboboxes/payment-type-combobox'
import AccountPicker from '@/components/pickers/account-picker'
import MemberPicker from '@/components/pickers/member-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { CommandShortcut } from '@/components/ui/command'
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
    QuickWithdrawSchema,
    QuickWithdrawSchemaFormValues,
} from '@/validations/transactions/quick-withdraw-schema'

import { useGetAllpaymentTypes } from '@/hooks/api-hooks/use-payment-type'
import { useCreateQuickTransactionPayment } from '@/hooks/api-hooks/use-transaction'
import { useGetUserSettings } from '@/hooks/use-get-use-settings'

import {
    IClassProps,
    IForm,
    IGeneralLedger,
    IMedia,
    IPaymentQuickRequest,
    TPaymentMode,
} from '@/types'

import AmountField from '../../../routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/amount-field'
import ReferenceNumber from '../../../routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/reference-number-field'

interface TransactionEntryFormProps
    extends IClassProps,
        IForm<
            Partial<IPaymentQuickRequest>,
            IGeneralLedger,
            string,
            QuickWithdrawSchemaFormValues
        > {
    mode: TPaymentMode
}

export const QuickTransferTransactionForm = ({
    defaultValues,
    onSuccess,
    mode,
}: TransactionEntryFormProps) => {
    const { userSettingOR } = useGetUserSettings()
    const queryClient = useQueryClient()
    const { isOpen } = useImagePreview()

    const {
        setSelectedMember,
        selectedMember,
        selectedAccount,
        setSelectedAccount,
        openMemberPicker,
        setOpenMemberPicker,
    } = useDepositWithdrawStore()

    const form = useForm<QuickWithdrawSchemaFormValues>({
        resolver: zodResolver(QuickWithdrawSchema),
        defaultValues: {
            ...defaultValues,
            account_id: selectedAccount?.id,
        },
    })

    const handleReset = () => {
        form.reset()
        setSelectedAccount(undefined)
    }

    const {
        mutate: createQuickTransaction,
        isPending: isQuickTransactionPending,
        error: quickTransactionError,
    } = useCreateQuickTransactionPayment({
        onSuccess: (transaction) => {
            onSuccess?.(transaction)
            handleReset()
            form.setValue('member_profile_id', transaction.member_profile_id)
            form.setValue('member', transaction.member_profile)

            queryClient.invalidateQueries({
                queryKey: [
                    'member-accounting-ledger',
                    'resource-query',
                    'member',
                    transaction.member_profile_id,
                ],
            })
        },
    })

    const { data: paymentType } = useGetAllpaymentTypes()

    const handleSubmit = form.handleSubmit(
        (data: QuickWithdrawSchemaFormValues) => {
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

    useTransactionShortcuts({
        canSelectMember: () => {
            setOpenMemberPicker(true)
        },
        canResetAll: () => {
            if (isOpen) return
            handleReset()
            setSelectedMember(null)
        },
        canUnselectMember: () => setSelectedMember(null),
    })

    const isFormIsDirty = form.formState.isDirty

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="min-w-[300px]">
                <div className="flex flex-end">
                    <CommandShortcut className="rounded-md bg-secondary p-1">
                        <div className="text-[min(10px,1rem)] text-muted-foreground/80">
                            ↵ select member | Esc - reset Form
                        </div>
                    </CommandShortcut>
                </div>
                <FormErrorMessage
                    className="mb-2"
                    errorMessage={quickTransactionError}
                />
                <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
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
                                    field.onChange(selectedMember?.id)
                                    form.setValue('member', selectedMember)
                                    setSelectedMember(selectedMember)
                                }}
                                placeholder="Select Member"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="member_joint_account_id"
                        label="Joint Member"
                        className="col-span-2"
                        render={({ field }) => (
                            <JointMemberProfileListModal
                                triggerProps={{
                                    disabled:
                                        form.watch('member_profile_id') === '',
                                }}
                                onSelect={(jointMember) => {
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
                    <FormFieldWrapper
                        control={form.control}
                        name="reference_number"
                        label="Reference Number"
                        className="col-span-2"
                        render={({ field }) => (
                            <ReferenceNumber
                                {...field}
                                value={field.value ?? ''}
                                disabled={form.watch('or_auto_generated')}
                                className="col-span-2 w-full"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="or_auto_generated"
                        className="col-span-2"
                        render={({ field }) => (
                            <div className="flex items-center gap-2">
                                <Checkbox
                                    checked={field.value ?? false}
                                    onCheckedChange={(checked) => {
                                        field.onChange(checked)
                                        if (checked) {
                                            form.setValue(
                                                'reference_number',
                                                userSettingOR
                                            )
                                        }
                                    }}
                                    className=""
                                />
                                <span className="text-sm text-muted-foreground">
                                    Auto generate reference number
                                </span>
                            </div>
                        )}
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
                    <FormFieldWrapper
                        control={form.control}
                        name="amount"
                        label="Amount"
                        className="col-span-2"
                        render={({ field }) => {
                            return (
                                <AmountField
                                    {...field}
                                    ref={field.ref}
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
                                value={field.value ?? undefined}
                                placeholder="Select a payment type"
                                onChange={(selectedPaymentType) =>
                                    field.onChange(selectedPaymentType.id)
                                }
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
                        onClick={() => handleReset()}
                        className="w-full self-end px-8 sm:w-fit"
                    >
                        reset
                    </Button>
                    <Button
                        size="sm"
                        type="submit"
                        disabled={isQuickTransactionPending || !isFormIsDirty}
                        className="w-full self-end px-8 sm:w-fit"
                    >
                        {isQuickTransactionPending ||
                        isQuickTransactionPending ? (
                            <LoadingSpinner />
                        ) : (
                            mode
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
