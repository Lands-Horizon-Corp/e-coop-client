import { useState } from 'react'

import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/lib'
import JointMemberProfileListModal from '@/routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/joint-member-profile-list-modal'
import MemberProfileTransactionView from '@/routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/member-profile-view-card'
import NoMemberSelectedView from '@/routes/org/$orgname/branch.$branchname/(employee)/transaction/-components/no-member-selected-view'
import { usePaymentsDataStore } from '@/store/transaction/payments-entry-store'
import { useAuthUserWithOrg } from '@/store/user-auth-store'
import { useForm } from 'react-hook-form'

import BankCombobox from '@/components/comboboxes/bank-combobox'
import PaymentTypeComboBox from '@/components/comboboxes/payment-type-combobox'
import { HandShakeHeartIcon, XIcon } from '@/components/icons'
import MemberAccountingLedger from '@/components/member-infos/member-accounts-loans/member-accounting-ledger'
import SectionTitle from '@/components/member-infos/section-title'
import Modal, { IModalProps } from '@/components/modals/modal'
import AccountPicker from '@/components/pickers/account-picker'
import MemberPicker from '@/components/pickers/member-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import { Textarea } from '@/components/ui/textarea'

import {
    DepositEntryFormValues,
    QuickTransactionPaymentSchema,
} from '@/validations/transactions/deposit-entry-schema'

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
            DepositEntryFormValues
        > {
    transaction?: ITransactionResponse
}

const QuickPaymentEntryForm = ({
    defaultValues,
    onSuccess,
}: QuickPaymentEntryFormProps) => {
    const { selectedMember, setSelectedMember, focusTypePayment } =
        usePaymentsDataStore()
    const [openMemberPicker, setOpenMemberPicker] = useState(false)
    const form = useForm<DepositEntryFormValues>({
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
    const { currentAuth: user } = useAuthUserWithOrg()
    const {
        user_organization: {
            user_setting_used_or: userSettingOR,
            user_setting_number_padding: user_setting_number_padding,
        },
    } = user

    const handleSubmit = form.handleSubmit((data: DepositEntryFormValues) => {
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
            creatTransactionDeposit({
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
    })

    const paymentTypeType = paymentTypes?.find(
        (type) => type.id === form.watch('payment_type_id')
    )?.type

    const JointAccount = selectedMember?.member_joint_accounts ?? []

    const hasSelectedMember = !!selectedMember

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className="flex space-x-2">
                <div className="flex w-full flex-col space-y-2">
                    {!hasSelectedMember && (
                        <NoMemberSelectedView
                            onClick={(e) => {
                                e.preventDefault()
                                setOpenMemberPicker(true)
                            }}
                        />
                    )}
                    <FormFieldWrapper
                        control={form.control}
                        name="member"
                        className="hidden"
                        label="Select a Member"
                        render={({ field }) => (
                            <MemberPicker
                                value={field.value}
                                modalState={{
                                    open: openMemberPicker,
                                    onOpenChange: setOpenMemberPicker,
                                }}
                                onSelect={(selectedMember) => {
                                    field.onChange(selectedMember)
                                    setSelectedMember(selectedMember)
                                    form.setValue(
                                        'member_profile_id',
                                        selectedMember?.id
                                    )
                                }}
                                placeholder="Select Member"
                            />
                        )}
                    />
                    {selectedMember && (
                        <div className="space-y-2">
                            <MemberProfileTransactionView
                                memberInfo={selectedMember}
                            />
                            <Drawer>
                                <div className="flex items-center justify-between space-x-2">
                                    <DrawerTrigger
                                        asChild
                                        className="w-full border h-10 cursor-pointer text-center flex items-center justify-center rounded-md bg-muted hover:bg-accent hover:text-foreground"
                                    >
                                        <span className="text-sm">
                                            View Member Ledger
                                        </span>
                                    </DrawerTrigger>
                                    <Button
                                        variant={'destructive'}
                                        size={'icon'}
                                        className="flex"
                                        onClick={() => {
                                            setSelectedMember(null)
                                            form.reset({
                                                member_profile_id: undefined,
                                            })
                                        }}
                                    >
                                        <XIcon className="grow" />
                                    </Button>
                                </div>
                                <DrawerContent className="w-full min-h-52 p-5">
                                    <div>
                                        <MemberAccountingLedger
                                            memberProfileId={selectedMember.id}
                                        />
                                    </div>
                                </DrawerContent>
                            </Drawer>
                        </div>
                    )}
                    <div className="grid grid-cols-1 w-full lg:grid-cols-2 gap-x-2 gap-y-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="reference_number"
                            label="Reference Number"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Reference Number"
                                    autoComplete="off"
                                    disabled={form.watch('or_auto_generated')}
                                />
                            )}
                        />{' '}
                        <FormFieldWrapper
                            control={form.control}
                            name="member_joint_account_id"
                            label="Select a co-owner"
                            disabled={!selectedMember}
                            render={({ field }) => (
                                <JointMemberProfileListModal
                                    triggerProps={{
                                        disabled: !selectedMember,
                                    }}
                                    title={
                                        <SectionTitle
                                            title="Joint Accounts"
                                            subTitle="Co-owners of this account that have the access and share  financial responsibility of this account (Select a one joint member )"
                                            Icon={HandShakeHeartIcon}
                                        />
                                    }
                                    onSelect={(jointMember) => {
                                        field.onChange(jointMember?.id)
                                    }}
                                    selectedMemberJointId={
                                        field.value ?? undefined
                                    }
                                    memberJointProfile={JointAccount}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            className="h-5 flex items-center col-span-2"
                            name="or_auto_generated"
                            render={({ field }) => (
                                <div className="flex items-center text-muted-foreground space-x-2">
                                    <Checkbox
                                        id={field.name}
                                        defaultChecked={field.value}
                                        onChange={field.onChange}
                                        checked={field.value}
                                        onCheckedChange={(checked) => {
                                            field.onChange(checked)
                                            if (checked) {
                                                form.setValue(
                                                    'reference_number',
                                                    userSettingOR
                                                        ?.toString()
                                                        .padStart(
                                                            user_setting_number_padding,
                                                            '0'
                                                        ) ?? ''
                                                )
                                            }
                                        }}
                                        name={field.name}
                                    />
                                    <Label className="text-xs">
                                        Auto Generate OR Number
                                    </Label>
                                </div>
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
                            className=""
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
