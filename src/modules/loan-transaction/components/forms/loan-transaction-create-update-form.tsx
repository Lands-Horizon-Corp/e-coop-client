import { useCallback, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import CollateralCombobox from '@/modules/collateral/components/collateral-combobox'
import LoanPurposeCombobox from '@/modules/loan-purpose/components/loan-purpose-combobox'
import MemberAccountingLedgerPicker from '@/modules/member-accounting-ledger/components/member-accounting-ledger-picker'
import {
    IMemberProfile,
    useGetMemberProfileById,
} from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import MemberProfileInfoViewCard from '@/modules/member-profile/components/member-profile-info-loan-view-card'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    BadgeExclamationIcon,
    BuildingBranchIcon,
    CheckIcon,
    DotsHorizontalIcon,
    HandDepositIcon,
    HashIcon,
    PinLocationIcon,
    ScanLineIcon,
    ShapesIcon,
    TextFileFillIcon,
    UserIcon,
    XIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import QrCodeScanner from '@/components/qrcode-scanner'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'
import { useSimpleShortcut } from '@/hooks/use-simple-shortcut'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateLoanTransaction, useUpdateLoanTransactionById } from '../..'
import {
    ILoanTransaction,
    ILoanTransactionRequest,
} from '../../loan-transaction.types'
import {
    LoanTransactionSchema,
    TLoanTransactionSchema,
} from '../../loan-transaction.validation'
import { LOAN_MODE_OF_PAYMENT, LOAN_TYPE } from '../../loan.constants'
import LoanPicker from '../loan-picker'
import WeekdayCombobox from '../weekday-combobox'

type TLoanTransactionFormMode = 'create' | 'update'

export interface ILoanTransactionFormProps
    extends IClassProps,
        IForm<Partial<ILoanTransactionRequest>, ILoanTransaction, Error> {
    loanTransactionId?: TEntityId
    mode: TLoanTransactionFormMode
}

const LoanMemberProfileScanner = ({
    startScan,
    setStartScan,
    onSelect,
}: {
    startScan: boolean
    setStartScan: (state: boolean) => void
    onSelect: (value: IMemberProfile | undefined) => void
}) => {
    const [memberProfileId, setMemberProfileId] = useState<
        undefined | TEntityId
    >()
    const [previousScanned, setPreviousScanned] = useState<
        undefined | TEntityId
    >()

    const {
        data,
        isError,
        error: rawError,
        isSuccess,
    } = useGetMemberProfileById({
        id: memberProfileId as TEntityId,
        options: {
            enabled: !!memberProfileId,
            retry: 0,
        },
    })

    const handleSuccess = useCallback(
        (data: IMemberProfile) => {
            if (data && previousScanned !== data.id) {
                onSelect(data)
                setPreviousScanned(data.id)
            }
        },
        [onSelect, previousScanned]
    )

    useQeueryHookCallback({
        data,
        onSuccess: handleSuccess,
        onError: () =>
            toast.error('QR Code is valid, but member profile not found.'),
        error: rawError,
        isError,
        isSuccess,
    })

    useSimpleShortcut(['S'], () => setStartScan(true))

    return (
        <div className="flex flex-col flex-shrink-0 w-fit justify-center items-center">
            <div className=" size-56">
                {startScan ? (
                    <div className="aspect-square size-full rounded-xl overflow-hidden ">
                        <QrCodeScanner<IQRMemberProfileDecodedResult>
                            onSuccessDecode={(data) => {
                                if (data.type !== 'member-qr') {
                                    return toast.error(
                                        'Invalid QR. Please use a valid Member Profile QR'
                                    )
                                }
                                setMemberProfileId(data.data.member_profile_id)
                            }}
                        />
                    </div>
                ) : (
                    <div className="flex flex-col size-full bg-muted rounded-xl items-center justify-center text-center py-8">
                        <ScanLineIcon className="mx-auto h-16 w-16 text-muted-foreground/70" />
                        <p className="text-xs text-muted-foreground/70 text-center">
                            Press "S" to start scan
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

const LoanTransactionCreateUpdateForm = ({
    className,
    loanTransactionId,
    mode = 'create',
    ...formProps
}: ILoanTransactionFormProps) => {
    const [startScan, setStartScan] = useState(false)
    const [formMode, setFormMode] = useState<TLoanTransactionFormMode>(mode)
    const memberPickerModal = useModalState()

    const [createdLoanTransactionId, setCreatedLoanTransactionId] =
        useState<TEntityId | null>(null)
    const hasAutoCreatedRef = useRef(false)

    const form = useForm<TLoanTransactionSchema>({
        resolver: standardSchemaResolver(LoanTransactionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            loan_type: 'standard',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateLoanTransaction({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Transaction Created',
                onSuccess: (loanTransaction) => {
                    setFormMode('update')
                    setCreatedLoanTransactionId(loanTransaction.id)
                    hasAutoCreatedRef.current = true
                    // Don't reset form, keep current values
                },
            }),
        },
    })

    const updateMutation = useUpdateLoanTransactionById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Transaction Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TLoanTransactionSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((payload) => {
        const targetId = loanTransactionId || createdLoanTransactionId
        if (formMode === 'update' && targetId) {
            updateMutation.mutate({ id: targetId, payload })
        } else if (formMode === 'create' && !hasAutoCreatedRef.current) {
            // Manual create if auto-create hasn't happened
            createMutation.mutate(payload)
        }
    }, handleFocusError)

    useSimpleShortcut(['Control', 'Enter'], () => {
        memberPickerModal.onOpenChange(!memberPickerModal.open)
    })

    const {
        error: rawError,
        isPending,
        reset,
    } = formMode === 'update' ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    // console.log(form.formState.errors)

    const mode_of_payment = form.watch('mode_of_payment')
    const memberProfile = form.watch('member_profile')
    const comaker_type = form.watch('comaker_type')
    const comaker_member_profile = form.watch('comaker_member_profile')
    const comaker_deposit_member_accounting_ledger = form.watch(
        'comaker_deposit_member_accounting_ledger'
    )
    const previous_loan = form.watch('previous_loan')

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 p-4 gap-y-4 sm:gap-y-3"
                >
                    <div className="space-y-3">
                        <div className="space-y-4 rounded-xl bg-popover p-4">
                            <div>
                                <p className="font-medium">
                                    <UserIcon className="inline text-primary" />{' '}
                                    Member Information & Loan Account
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Basic member details and loan account
                                    information
                                </p>
                            </div>

                            <FormFieldWrapper
                                control={form.control}
                                name="member_profile_id"
                                render={({ field }) => {
                                    return (
                                        <div className="gap-x-2 flex items-center">
                                            {!memberProfile && (
                                                <LoanMemberProfileScanner
                                                    startScan={startScan}
                                                    setStartScan={setStartScan}
                                                    onSelect={(
                                                        memberProfile
                                                    ) => {
                                                        field.onChange(
                                                            memberProfile?.id
                                                        )
                                                        form.setValue(
                                                            'member_profile',
                                                            memberProfile,
                                                            {
                                                                shouldDirty: true,
                                                            }
                                                        )

                                                        if (
                                                            comaker_member_profile?.id ===
                                                            memberProfile?.id
                                                        ) {
                                                            form.setValue(
                                                                'comaker_member_profile_id',
                                                                undefined as unknown as TEntityId
                                                            )
                                                            form.setValue(
                                                                'comaker_member_profile',
                                                                undefined
                                                            )
                                                        }
                                                    }}
                                                />
                                            )}
                                            <div className="space-y-2 flex-1 bg-gradient-to-br flex flex-col items-center justify-center from-primary/10 to-background bg-popover rounded-xl p-4">
                                                {memberProfile ? (
                                                    <>
                                                        <MemberProfileInfoViewCard
                                                            className="w-full"
                                                            memberProfile={
                                                                memberProfile
                                                            }
                                                        />
                                                        <Button
                                                            size="sm"
                                                            type="button"
                                                            onClick={() => {
                                                                field.onChange(
                                                                    undefined
                                                                )
                                                                form.setValue(
                                                                    'member_profile',
                                                                    undefined
                                                                )
                                                            }}
                                                            variant="secondary"
                                                            className="w-full"
                                                        >
                                                            Replace
                                                        </Button>
                                                    </>
                                                ) : (
                                                    <div className="p-4 flex-col items-center justify-center">
                                                        <UserIcon className="size-12 mx-auto text-muted-foreground" />
                                                        <p className="text-center text-muted-foreground">
                                                            Please Select Member
                                                        </p>
                                                        <p className="text-center text-muted-foreground/80 text-xs">
                                                            select member or
                                                            press 'CTRL + Enter'
                                                            to show picker | or
                                                            press 'Shit + S' to
                                                            scan QR Code
                                                        </p>
                                                    </div>
                                                )}
                                                <MemberPicker
                                                    modalState={{
                                                        ...memberPickerModal,
                                                    }}
                                                    value={memberProfile}
                                                    placeholder="Select Member"
                                                    triggerClassName="hidden"
                                                    onSelect={(
                                                        memberProfile
                                                    ) => {
                                                        field.onChange(
                                                            memberProfile?.id
                                                        )
                                                        form.setValue(
                                                            'member_profile',
                                                            memberProfile,
                                                            {
                                                                shouldDirty: true,
                                                            }
                                                        )

                                                        if (
                                                            comaker_member_profile?.id ===
                                                            memberProfile?.id
                                                        ) {
                                                            form.setValue(
                                                                'comaker_member_profile_id',
                                                                undefined as unknown as TEntityId
                                                            )
                                                            form.setValue(
                                                                'comaker_member_profile',
                                                                undefined
                                                            )
                                                        }
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    )
                                }}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="account_id"
                                label="Loan Account"
                                render={({ field }) => (
                                    <AccountPicker
                                        mode="loan"
                                        value={form.getValues('account')}
                                        placeholder="Select Loan Account"
                                        onSelect={(account) => {
                                            field.onChange(account?.id)

                                            form.setValue('account', account)
                                        }}
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>

                        <Separator />

                        <fieldset
                            disabled={!memberProfile}
                            className="space-y-4 rounded-xl p-4 bg-popover"
                        >
                            <div>
                                <p className="font-medium">
                                    <TextFileFillIcon className="inline text-primary" />{' '}
                                    Loan Details
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Specify loan type, amount, and payment terms
                                </p>
                            </div>

                            {!memberProfile && (
                                <FormErrorMessage errorMessage="Select member profile first to enable this section" />
                            )}

                            <div className="items-center grid grid-cols-3 gap-3">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="loan_purpose_id"
                                    label="Loan Purpose"
                                    className="col-span-1"
                                    render={({ field }) => (
                                        <LoanPurposeCombobox
                                            {...field}
                                            onChange={(loanPurpose) =>
                                                field.onChange(loanPurpose.id)
                                            }
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="loan_type"
                                    label="Loan Type"
                                    className="col-span-1"
                                    render={({ field }) => (
                                        <Select
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="w-full capitalize">
                                                    <SelectValue
                                                        placeholder="Select Loan Type"
                                                        className="capitalize"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {LOAN_TYPE.map((loan_type) => (
                                                    <SelectItem
                                                        className="capitalize"
                                                        value={loan_type}
                                                    >
                                                        {loan_type}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="applied_1"
                                    label="Applied Amount *"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Applied Amount"
                                            className="border-primary/70 border-2"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 gap-3">
                                {/* <FormFieldWrapper
                                    control={form.control}
                                    name="applied_2"
                                    label={
                                        <span>
                                            Applied Amount{' '}
                                            <span className="text-muted-foreground ml-1 text-xs">
                                                (secondary)
                                            </span>
                                        </span>
                                    }
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Applied Amount (secondary)"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                /> */}
                            </div>

                            <Separator />

                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="mode_of_payment"
                                        label="Mode of Payment"
                                        className="shrink-0 w-fit col-span-4"
                                        render={({ field }) => (
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value ?? ''}
                                                className="flex gap-x-2"
                                            >
                                                {LOAN_MODE_OF_PAYMENT.map(
                                                    (mop) => (
                                                        <FormItem
                                                            key={mop}
                                                            className="flex items-center gap-4"
                                                        >
                                                            <label
                                                                key={`mop-${mop}`}
                                                                className="border-accent hover:bg-accent ease-in-out duration-100 bg-muted has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/40 has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer items-center gap-1 rounded-md border py-2.5 px-6 text-center shadow-xs outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                                                            >
                                                                <RadioGroupItem
                                                                    value={mop}
                                                                    id={`mop-${mop}`}
                                                                    tabIndex={0}
                                                                    className="absolute inset-0 opacity-0 cursor-pointer"
                                                                />
                                                                <p className="text-foreground capitalize text-xs leading-none font-medium pointer-events-none">
                                                                    {mop}
                                                                </p>
                                                                {field.value ===
                                                                    mop && (
                                                                    <CheckIcon className="inline pointer-events-none" />
                                                                )}
                                                            </label>
                                                        </FormItem>
                                                    )
                                                )}
                                            </RadioGroup>
                                        )}
                                    />
                                    <Separator
                                        className="min-h-8 mt-6"
                                        orientation="vertical"
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="terms"
                                        label="Terms"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                id={field.name}
                                                placeholder="Terms"
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                            />
                                        )}
                                    />
                                </div>
                                {mode_of_payment === 'weekly' && (
                                    <>
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="mode_of_payment_weekly"
                                            label="Weekdays"
                                            className="space-y-1 col-span-1"
                                            render={({ field }) => (
                                                <WeekdayCombobox {...field} />
                                            )}
                                        />
                                    </>
                                )}
                                {mode_of_payment === 'semi-monthly' && (
                                    <div className="grid grid-cols-2 gap-3">
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="mode_of_payment_semi_monthly_pay_1"
                                            label="Pay 1 (Day of Month) *"
                                            className="col-span-1"
                                            render={({ field }) => (
                                                <Input {...field} />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="mode_of_payment_semi_monthly_pay_2"
                                            label="Pay 2 (Day of Month) *"
                                            className="col-span-1"
                                            render={({ field }) => (
                                                <Input {...field} />
                                            )}
                                        />
                                    </div>
                                )}
                            </div>

                            <Separator />

                            <fieldset
                                disabled={!memberProfile}
                                className="flex gap-x-2"
                            >
                                <FormFieldWrapper
                                    control={form.control}
                                    name="official_receipt_number"
                                    label={
                                        <span>
                                            OR{' '}
                                            <HashIcon className="inline text-muted-foreground" />
                                        </span>
                                    }
                                    className="col-span-1"
                                    render={({ field }) => <Input {...field} />}
                                />
                                <Separator
                                    orientation="vertical"
                                    className="min-h-9 mt-6"
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="previous_loan_id"
                                    label="Change prev. loan to amt. applied"
                                    className="col-span-1"
                                    render={({ field }) => (
                                        <LoanPicker
                                            mode="member-profile"
                                            value={previous_loan}
                                            memberProfileId={
                                                form.getValues(
                                                    'member_profile_id'
                                                ) as TEntityId
                                            }
                                            disabled={
                                                memberProfile === undefined
                                            }
                                            placeholder="Select previous loan"
                                            onSelect={(loan) => {
                                                field.onChange(loan?.id)
                                                form.setValue(
                                                    'previous_loan',
                                                    loan
                                                )
                                            }}
                                        />
                                    )}
                                />
                                <Separator
                                    orientation="vertical"
                                    className="min-h-9 mt-6"
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="is_add_on"
                                    render={({ field }) => (
                                        <div className="border-input mt-5 has-data-[state=checked]:border-primary/50 border-2 has-data-[state=checked]:bg-primary/20 duration-200 ease-in-out relative flex w-full items-center gap-2 rounded-xl px-2 py-0.5 shadow-xs outline-none">
                                            <Switch
                                                id="loan-add-on"
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                                aria-describedby={`loan-add-on-description`}
                                                className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <ShapesIcon className="text-primary size-4" />
                                                <div className="text-xs">
                                                    <Label
                                                        htmlFor={'loan-add-on'}
                                                        className="text-xs"
                                                    >
                                                        Add-On{' '}
                                                    </Label>
                                                    <p
                                                        id="loan-add-on-description"
                                                        className="text-muted-foreground text-xs"
                                                    >
                                                        Include Add-On&apos;s
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                />
                            </fieldset>
                        </fieldset>

                        <Separator />

                        <fieldset
                            disabled={!memberProfile}
                            className="space-y-4 bg-popover rounded-xl p-4"
                        >
                            <div>
                                <p className="font-medium">
                                    <BadgeExclamationIcon className="inline text-primary" />{' '}
                                    Additional Info
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    Co-maker details, and loan purpose
                                </p>
                            </div>

                            {!memberProfile && (
                                <FormErrorMessage errorMessage="Select member profile first to enable this section" />
                            )}
                            <FormFieldWrapper
                                control={form.control}
                                name="collector_place"
                                label="Collector"
                                className="shrink-0 w-full"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value ?? ''}
                                        onValueChange={field.onChange}
                                        className="grid grid-cols-2 gap-2"
                                    >
                                        <FormItem>
                                            <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/20 hover:bg-accent hover:border-primary ease-in-out duration-200 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                                                <RadioGroupItem
                                                    value="field"
                                                    id="collector-field"
                                                    aria-describedby="collector-field-description"
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-start gap-3">
                                                    <PinLocationIcon
                                                        aria-hidden="true"
                                                        className="shrink-0 size-4 opacity-60"
                                                    />
                                                    <div>
                                                        <label
                                                            htmlFor="collector-field"
                                                            className="text-foreground text-sm font-medium cursor-pointer"
                                                        >
                                                            Field Collection
                                                            <span className="text-muted-foreground text-xs leading-[inherit] font-normal ml-1">
                                                                (On-site)
                                                            </span>
                                                        </label>
                                                        <p
                                                            id="collector-field-description"
                                                            className="text-muted-foreground text-xs"
                                                        >
                                                            Collector visits
                                                            member's location
                                                            for payment
                                                            collection
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormItem>

                                        <FormItem>
                                            <div className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/20 hover:bg-accent hover:border-primary ease-in-out duration-200 relative flex w-full items-start gap-2 rounded-md border p-4 shadow-xs outline-none">
                                                <RadioGroupItem
                                                    value="office"
                                                    id="collector-office"
                                                    aria-describedby="collector-office-description"
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-start gap-3">
                                                    <BuildingBranchIcon
                                                        aria-hidden="true"
                                                        className="shrink-0 size-4 opacity-60"
                                                    />
                                                    <div>
                                                        <label
                                                            htmlFor="collector-office"
                                                            className="text-foreground text-sm font-medium cursor-pointer"
                                                        >
                                                            Office Collection
                                                            <span className="text-muted-foreground text-xs leading-[inherit] font-normal ml-1">
                                                                (Branch)
                                                            </span>
                                                        </label>
                                                        <p
                                                            id="collector-office-description"
                                                            className="text-muted-foreground text-xs"
                                                        >
                                                            Collector receives
                                                            payments at the
                                                            office or branch
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormItem>
                                    </RadioGroup>
                                )}
                            />

                            <Separator />

                            <FormFieldWrapper
                                control={form.control}
                                name="comaker_type"
                                label="Comaker"
                                className="shrink-0 w-full"
                                render={({ field }) => (
                                    <RadioGroup
                                        value={field.value ?? ''}
                                        onValueChange={field.onChange}
                                        className="grid grid-cols-3 gap-2"
                                    >
                                        <FormItem>
                                            <div className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 hover:border-primary ease-in-out duration-200 relative flex w-full items-start gap-2 rounded-xl border-2 p-4 shadow-xs outline-none">
                                                <RadioGroupItem
                                                    value="member"
                                                    id="comaker-member"
                                                    aria-describedby="comaker-member-description"
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <UserIcon
                                                        size={32}
                                                        aria-hidden="true"
                                                        className="shrink-0 opacity-60"
                                                    />
                                                    <div className="grid grow gap-2">
                                                        <label
                                                            htmlFor="comaker-member"
                                                            className="text-foreground text-sm font-medium cursor-pointer"
                                                        >
                                                            Member
                                                            <span className="text-muted-foreground text-xs leading-[inherit] font-normal ml-1">
                                                                (Co-member)
                                                            </span>
                                                        </label>
                                                        <p
                                                            id="comaker-member-description"
                                                            className="text-muted-foreground text-xs"
                                                        >
                                                            Another cooperative
                                                            member acts as
                                                            co-maker
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormItem>

                                        <FormItem>
                                            <div className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 hover:border-primary ease-in-out duration-200 relative flex w-full items-start gap-2 rounded-xl border-2 p-4 shadow-xs outline-none">
                                                <RadioGroupItem
                                                    value="deposit"
                                                    id="comaker-deposit"
                                                    aria-describedby="comaker-deposit-description"
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <HandDepositIcon
                                                        size={32}
                                                        aria-hidden="true"
                                                        className="shrink-0 opacity-60"
                                                    />
                                                    <div className="grid grow gap-2">
                                                        <label
                                                            htmlFor="comaker-deposit"
                                                            className="text-foreground text-sm font-medium cursor-pointer"
                                                        >
                                                            Deposit
                                                            <span className="text-muted-foreground text-xs leading-[inherit] font-normal ml-1">
                                                                (Hold-out)
                                                            </span>
                                                        </label>
                                                        <p
                                                            id="comaker-deposit-description"
                                                            className="text-muted-foreground text-xs"
                                                        >
                                                            Member's deposit
                                                            serves as
                                                            collateral/co-maker
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormItem>

                                        <FormItem>
                                            <div className="border-input has-data-[state=checked]:border-primary has-data-[state=checked]:bg-primary/10 hover:border-primary ease-in-out duration-200 relative flex w-full items-start gap-2 rounded-xl border-2 p-4 shadow-xs outline-none">
                                                <RadioGroupItem
                                                    value="others"
                                                    id="comaker-others"
                                                    aria-describedby="comaker-others-description"
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <DotsHorizontalIcon
                                                        size={32}
                                                        aria-hidden="true"
                                                        className="shrink-0 opacity-60"
                                                    />
                                                    <div className="grid grow gap-2">
                                                        <label
                                                            htmlFor="comaker-others"
                                                            className="text-foreground text-sm font-medium cursor-pointer"
                                                        >
                                                            Others
                                                            <span className="text-muted-foreground text-xs leading-[inherit] font-normal ml-1">
                                                                (External)
                                                            </span>
                                                        </label>
                                                        <p
                                                            id="comaker-others-description"
                                                            className="text-muted-foreground text-xs"
                                                        >
                                                            Non-member
                                                            individual or
                                                            external guarantor
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </FormItem>
                                    </RadioGroup>
                                )}
                            />

                            {comaker_type === 'member' && (
                                <>
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="comaker_member_profile_id"
                                        label="Comaker"
                                        className="shrink-0 w-full"
                                        render={({ field }) => (
                                            <span className="flex gap-x-2 items-center">
                                                <MemberPicker
                                                    triggerClassName="flex-1"
                                                    value={form.getValues(
                                                        'comaker_member_profile'
                                                    )}
                                                    onSelect={(
                                                        memberProfile
                                                    ) => {
                                                        if (
                                                            memberProfile &&
                                                            memberProfile.id ===
                                                                form.getValues(
                                                                    'member_profile_id'
                                                                )
                                                        ) {
                                                            return toast.warning(
                                                                "Can't select member as comaker himself/herself, select other member instead."
                                                            )
                                                        }

                                                        field.onChange(
                                                            memberProfile?.id
                                                        )

                                                        form.setValue(
                                                            'comaker_member_profile',
                                                            memberProfile
                                                        )
                                                    }}
                                                />
                                                {comaker_member_profile && (
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() => {
                                                            form.setValue(
                                                                'comaker_member_profile_id',
                                                                undefined as unknown as TEntityId
                                                            )
                                                            form.setValue(
                                                                'comaker_member_profile',
                                                                undefined
                                                            )
                                                        }}
                                                        className="shrink-0"
                                                        size="icon"
                                                    >
                                                        <XIcon />
                                                    </Button>
                                                )}
                                            </span>
                                        )}
                                    />
                                </>
                            )}

                            {comaker_type === 'others' && (
                                <>
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="comaker_collateral_id"
                                        label="Comaker Collateral"
                                        className="shrink-0"
                                        render={({ field }) => (
                                            <span className="flex gap-x-2 items-center">
                                                <CollateralCombobox
                                                    {...field}
                                                    onChange={(collateral) =>
                                                        field.onChange(
                                                            collateral?.id
                                                        )
                                                    }
                                                    className="flex-1"
                                                />
                                                {form.getValues(
                                                    'comaker_collateral_id'
                                                ) !== undefined && (
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() =>
                                                            field.onChange(
                                                                undefined
                                                            )
                                                        }
                                                        className="shrink-0"
                                                        size="icon"
                                                    >
                                                        <XIcon />
                                                    </Button>
                                                )}
                                            </span>
                                        )}
                                    />
                                </>
                            )}

                            {comaker_type === 'deposit' && (
                                <>
                                    <FormFieldWrapper
                                        control={form.control}
                                        name="comaker_deposit_member_accounting_ledger_id"
                                        label="Comaker Member Deposit Account Ledger"
                                        className="shrink-0"
                                        render={({ field }) => (
                                            <span className="flex gap-x-2 items-center">
                                                <MemberAccountingLedgerPicker
                                                    mode="member"
                                                    triggerClassName="flex-1"
                                                    memberProfileId={
                                                        memberProfile.id
                                                    }
                                                    value={
                                                        comaker_deposit_member_accounting_ledger
                                                    }
                                                    onSelect={(
                                                        memberAccountingLedger
                                                    ) => {
                                                        field.onChange(
                                                            memberAccountingLedger.id
                                                        )

                                                        form.setValue(
                                                            'comaker_deposit_member_accounting_ledger',
                                                            memberAccountingLedger
                                                        )
                                                    }}
                                                />
                                                {form.getValues(
                                                    'comaker_deposit_member_accounting_ledger_id'
                                                ) !== undefined && (
                                                    <Button
                                                        type="button"
                                                        variant="secondary"
                                                        onClick={() => {
                                                            field.onChange(
                                                                undefined
                                                            )
                                                            form.setValue(
                                                                'comaker_deposit_member_accounting_ledger',
                                                                undefined
                                                            )
                                                        }}
                                                        className="shrink-0"
                                                        size="icon"
                                                    >
                                                        <XIcon />
                                                    </Button>
                                                )}
                                            </span>
                                        )}
                                    />
                                </>
                            )}
                        </fieldset>
                    </div>
                </fieldset>
                <FormFooterResetSubmit
                    className="p-4 sticky bottom-0 mx-4 mb-4 bg-popover/70 rounded-xl"
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    // disableSubmit={
                    //     formMode === 'create' && !areRequiredFieldsFilled
                    // }
                    submitText={
                        formMode === 'update' ? 'Update' : 'Create'
                        // : areRequiredFieldsFilled
                        //   ? 'Creating...'
                        //   : 'Save'
                    }
                    onReset={() => {
                        form.reset()
                        reset?.()
                        hasAutoCreatedRef.current = false
                        setFormMode('create')
                        setCreatedLoanTransactionId(null)
                    }}
                />
            </form>
        </Form>
    )
}

export const LoanTransactionCreateUpdateFormModal = ({
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<ILoanTransactionFormProps, 'className'>
}) => {
    return (
        <Modal
            title=""
            description=""
            titleClassName="sr-only"
            descriptionClassName="sr-only"
            className={cn('p-0 !max-w-7xl gap-y-0', className)}
            {...props}
        >
            <LoanTransactionCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTransactionCreateUpdateForm
