import { useCallback, useRef, useState } from 'react'

import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import LoanPurposeCombobox from '@/modules/loan-purpose/components/loan-purpose-combobox'
import LoanStatusCombobox from '@/modules/loan-status/components/loan-status-combobox'
import {
    LOAN_MODE_OF_PAYMENT,
    LOAN_TYPE,
} from '@/modules/loan-transaction/loan.constants'
import { resolveLoanDatesToStatus } from '@/modules/loan-transaction/loan.utils'
import {
    IMemberProfile,
    useGetMemberProfileById,
} from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import MemberProfileInfoViewLoanCard from '@/modules/member-profile/components/member-profile-info-loan-view-card'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    BadgeCheckFillIcon,
    BookOpenIcon,
    BuildingBranchIcon,
    CheckIcon,
    DotsHorizontalIcon,
    HashIcon,
    PinLocationIcon,
    QuestionCircleIcon,
    ScanLineIcon,
    TextFileFillIcon,
    TransactionListIcon,
    UserIcon,
    Users3FillIcon,
    WandSparkleIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import QrCodeScanner from '@/components/qrcode-scanner'
import { CommandShortcut } from '@/components/ui/command'
import { Form, FormControl, FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'
import { useQeueryHookCallback } from '@/hooks/use-query-hook-cb'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateLoanTransaction,
    useUpdateLoanTransactionById,
} from '../../..'
import {
    ILoanTransaction,
    ILoanTransactionRequest,
} from '../../../loan-transaction.types'
import {
    LoanTransactionSchema,
    TLoanTransactionSchema,
} from '../../../loan-transaction.validation'
import LoanStatusIndicator from '../../loan-status-indicator'
import { LoanTagsManagerPopover } from '../../loan-tag-manager'
import WeekdayCombobox from '../../weekday-combobox'
import LoanClearanceAnalysis from './loan-clearance-analysis'
import LoanComakerSection from './loan-comaker-section'
import LoanEntriesEditor from './loan-entries-editor'
import LoanTermsAndConditionReceiptSection from './loan-terms-and-condition-receipt'

export interface ILoanTransactionFormProps
    extends IClassProps,
        IForm<Partial<ILoanTransactionRequest>, ILoanTransaction, Error> {
    loanTransactionId?: TEntityId
}

const LoanMemberProfileScanner = ({
    disabled,
    startScan,
    setStartScan,
    onSelect,
}: {
    startScan: boolean
    disabled?: boolean
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

    useHotkeys('s', (e) => {
        if (disabled) {
            e.preventDefault()
            e.stopPropagation()
        }

        setStartScan(true)
    })

    return (
        <div className="flex flex-col flex-shrink-0 w-fit justify-center items-center">
            <div className=" size-40">
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

type TLoanFormTabs =
    | 'entries'
    | 'clearance'
    | 'terms-condition-receipt'
    | 'other'

const TAB_FIELD_MAPPING = {
    clearance: [
        'mount_to_be_closed',
        'share_capital',
        'damayan_fund',
        'length_of_service',
    ],
    'terms-condition-receipt': [
        'remarks_other_terms',
        'collateral_offered',
        'record_of_loan_payments_or_loan_status',
        'remarks_payroll_deduction',
    ],
    other: ['appraised_value', 'appraised_value_description'],
} as const

type TLoanFormTabs2 = 'loan-details' | 'comakers'

const TAB_FIELD_MAPPING2 = {
    'loan-details': [
        'official_receipt_number',
        'loan_status_id',
        'loan_type',
        'collector_place',
        'loan_purpose_id',
        'applied_1',
        'terms',
        'mode_of_payment',
        'mode_of_payment_fixed_days',
        'mode_of_payment_weekly',
        'mode_of_payment_semi_monthly_pay_1',
        'mode_of_payment_semi_monthly_pay_2',
        'exclude_holiday',
        'exclude_saturday',
        'exclude_sunday',
    ],
    comaker: [
        'comaker_type',
        'comaker_member_profiles',
        'comaker_collaterals',
        'comaker_deposit_member_accounting_ledger_id',
        'comaker_deposit_member_accounting_ledger',
    ],
} as const

const getTabForField = (
    fieldName: string,
    mapping: Record<string, readonly string[]> = TAB_FIELD_MAPPING
) => {
    for (const [tab, fields] of Object.entries(mapping)) {
        if (fields.includes(fieldName as unknown as never)) {
            return tab
        }
    }
    return
}

const LoanTransactionCreateUpdateForm = ({
    className,
    loanTransactionId: defaultLoanId,
    readOnly,
    ...formProps
}: ILoanTransactionFormProps) => {
    const [tab, setTab] = useState<TLoanFormTabs>('entries')
    const [tab2, setTab2] = useState<TLoanFormTabs2>('loan-details')
    const [startScan, setStartScan] = useState(false)
    const memberPickerModal = useModalState()

    const {
        currentAuth: {
            user_organization: {
                user_setting_used_or,
                user_setting_number_padding,
            },
        },
    } = useAuthUserWithOrgBranch()

    const hasAutoCreatedRef = useRef(false)

    const form = useForm<TLoanTransactionSchema>({
        resolver: standardSchemaResolver(LoanTransactionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            mode_of_payment_fixed_days: 0,
            is_add_on: false,
            loan_type: 'standard',
            applied_1: 0,

            comaker_type: 'none',
            mode_of_payment: 'monthly',

            comaker_member_profiles: [],
            comaker_member_profiles_deleted: [],

            comaker_collaterals: [],
            comaker_collaterals_deleted: [],

            loan_clearance_analysis: [],
            loan_clearance_analysis_deleted: [],

            loan_transaction_entries: [],
            loan_transaction_entries_deleted: [],

            loan_terms_and_condition_amount_receipt: [],
            loan_clearance_analysis_institution_deleted: [],

            loan_terms_and_condition_suggested_payment: [],
            loan_terms_and_condition_suggested_payment_deleted: [],

            ...formProps.defaultValues,
        },
    })

    const loanTransactionId = form.watch('id') || defaultLoanId
    const [printedDate, approvedDate, releasedDate] = form.watch([
        'printed_date',
        'approved_date',
        'released_date',
    ])

    const resolvedApplicationStatus = resolveLoanDatesToStatus({
        printed_date: printedDate,
        approved_date: approvedDate,
        released_date: releasedDate,
    })

    const isReadOnly = resolvedApplicationStatus !== 'draft' || readOnly

    const createMutation = useCreateLoanTransaction({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateLoanTransactionById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled, firstError } =
        useFormHelper<TLoanTransactionSchema>({
            form,
            ...formProps,
            readOnly: isReadOnly,
            autoSave: !!loanTransactionId,
            autoSaveDelay: 2000,
        })

    const onSubmit = form.handleSubmit(
        async (payload) => {
            const targetId = loanTransactionId

            let promise = undefined

            if (targetId) {
                promise = updateMutation.mutateAsync(
                    { id: targetId, payload },
                    {
                        onSuccess: (data) =>
                            form.reset({
                                comaker_member_profiles_deleted: [],
                                comaker_collaterals: [],
                                comaker_collaterals_deleted: [],
                                loan_clearance_analysis_deleted: [],
                                loan_clearance_analysis_institution_deleted: [],
                                loan_terms_and_condition_suggested_payment_deleted:
                                    [],
                                ...data,
                            }),
                    }
                )
            } else {
                promise = createMutation.mutateAsync(payload, {
                    onSuccess: (data) =>
                        form.reset({
                            comaker_member_profiles_deleted: [],
                            comaker_collaterals: [],
                            comaker_collaterals_deleted: [],
                            loan_clearance_analysis_deleted: [],
                            loan_clearance_analysis_institution_deleted: [],
                            loan_terms_and_condition_suggested_payment_deleted:
                                [],
                            ...data,
                        }),
                })
            }
            if (promise)
                toast.promise(promise, {
                    loading: 'Saving...',
                    success: 'Saved',
                    error: 'Failed to save',
                })

            await promise
        },
        (errors) => {
            const firstErrorField = Object.keys(errors)[0]

            if (firstErrorField) {
                const targetTab = getTabForField(firstErrorField)
                const targetTab2 = getTabForField(
                    firstErrorField,
                    TAB_FIELD_MAPPING2
                )

                if (targetTab) {
                    setTab(targetTab as TLoanFormTabs)
                }

                if (targetTab2) {
                    setTab2(targetTab2 as TLoanFormTabs2)
                }
            }
            handleFocusError()
        }
    )

    useHotkeys('Ctrl + Enter', () => {
        memberPickerModal.onOpenChange(!memberPickerModal.open)
    })

    const {
        error: rawError,
        isPending,
        reset,
    } = loanTransactionId ? updateMutation : createMutation

    const error = firstError || serverRequestErrExtractor({ error: rawError })

    const mode_of_payment = form.watch('mode_of_payment')
    const memberProfile = form.watch('member_profile')

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('w-full max-w-full', className)}
            >
                <div className="p-4 space-y-3 max-w-full min-w-0">
                    <div className="space-y-1 rounded-xl bg-popover p-4">
                        <div className="flex items-center justify-between">
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

                            <div className="flex items-center gap-x-1">
                                {loanTransactionId && (
                                    <LoanTagsManagerPopover
                                        size="sm"
                                        loanTransactionId={loanTransactionId}
                                    />
                                )}
                                <LoanStatusIndicator
                                    loanTransactionDates={{
                                        printed_date: printedDate,
                                        approved_date: approvedDate,
                                        released_date: releasedDate,
                                    }}
                                />
                                {printedDate === undefined && (
                                    <p className="text-xs p-1 px-2 bg-muted text-muted-foreground/70 rounded-sm">
                                        Select or Replace Member
                                        <CommandShortcut className="bg-accent p-0.5 px-1 text-primary rounded-sm ml-1">
                                            CTRL + Enter
                                        </CommandShortcut>
                                    </p>
                                )}
                            </div>
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
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                setStartScan={setStartScan}
                                                onSelect={(memberProfile) => {
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
                                                }}
                                            />
                                        )}
                                        <div className="space-y-1 flex-1 bg-gradient-to-br flex flex-col items-center justify-center from-primary/10 to-background bg-popover rounded-xl">
                                            {memberProfile ? (
                                                <>
                                                    <MemberProfileInfoViewLoanCard
                                                        className="w-full"
                                                        memberProfile={
                                                            memberProfile
                                                        }
                                                    />
                                                </>
                                            ) : (
                                                <div className="p-4 flex-col items-center justify-center">
                                                    <UserIcon className="size-12 mx-auto text-muted-foreground" />
                                                    <p className="text-center text-muted-foreground">
                                                        Please Select Member
                                                    </p>
                                                    <p className="text-center text-muted-foreground/80 text-xs">
                                                        select member or press
                                                        'CTRL + Enter' to show
                                                        picker | or press 'Shit
                                                        + S' to scan QR Code
                                                    </p>
                                                </div>
                                            )}
                                            <MemberPicker
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                modalState={{
                                                    ...memberPickerModal,
                                                }}
                                                value={memberProfile}
                                                placeholder="Select Member"
                                                triggerClassName="hidden"
                                                onSelect={(memberProfile) => {
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
                    <Tabs
                        value={tab2}
                        onValueChange={(selectedTab) =>
                            setTab2(selectedTab as TLoanFormTabs2)
                        }
                        className="max-w-full min-w-0"
                    >
                        <ScrollArea>
                            <TabsList className="before:bg-border justify-start relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                                <TabsTrigger
                                    value="loan-details"
                                    className="bg-muted overflow-hidden rounded-b-none rounded-t-lg border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                >
                                    <BookOpenIcon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Loan Details
                                </TabsTrigger>
                                <TabsTrigger
                                    value="comaker"
                                    className="bg-muted overflow-hidden rounded-b-none rounded-t-lg border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                >
                                    <Users3FillIcon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Comaker
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <TabsContent
                            value="loan-details"
                            tabIndex={0}
                            // className="bg-popover p-4 space-y-4 rounded-xl"
                        >
                            {/* LOAN DETAILS */}
                            <div className="space-y-4 rounded-xl p-4 bg-popover">
                                <div className="justify-between flex items-center">
                                    <div className="shrink-0">
                                        <p className="font-medium">
                                            <TextFileFillIcon className="inline text-primary" />{' '}
                                            Loan Details
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            Specify loan type, amount, and
                                            payment terms
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="official_receipt_number"
                                            label={
                                                <span className="flex items-center justify-between pb-1">
                                                    <span>
                                                        OR{' '}
                                                        <HashIcon className="inline text-muted-foreground" />
                                                    </span>
                                                    <button
                                                        disabled={isDisabled(
                                                            'official_receipt_number'
                                                        )}
                                                        type="button"
                                                        onClick={() => {
                                                            const constructedOR =
                                                                user_setting_used_or
                                                                    .toString()
                                                                    .padStart(
                                                                        user_setting_number_padding,
                                                                        '0'
                                                                    )

                                                            form.setValue(
                                                                'official_receipt_number',
                                                                constructedOR,
                                                                {
                                                                    shouldDirty: true,
                                                                }
                                                            )

                                                            toast.info(
                                                                `Set or to ${constructedOR}`
                                                            )
                                                        }}
                                                        className="text-xs disabled:pointer-events-none text-muted-foreground duration-150 cursor-pointer hover:text-foreground underline-offset-4 underline"
                                                    >
                                                        Auto OR{' '}
                                                        <WandSparkleIcon className="inline" />
                                                    </button>
                                                </span>
                                            }
                                            className="col-span-1 max-w-72"
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="loan_status_id"
                                            label="Loan Status"
                                            labelClassName="text-right grow block"
                                            className="w-fit"
                                            render={({ field }) => (
                                                <LoanStatusCombobox
                                                    value={field.value}
                                                    disabled={false}
                                                    onChange={(loanStatus) =>
                                                        field.onChange(
                                                            loanStatus.id
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="loan_type"
                                            label="Loan Type"
                                            labelClassName="text-right grow block"
                                            className="col-span-1"
                                            render={({ field }) => (
                                                <Select
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    onValueChange={
                                                        field.onChange
                                                    }
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
                                                        {LOAN_TYPE.map(
                                                            (loan_type) => (
                                                                <SelectItem
                                                                    key={
                                                                        loan_type
                                                                    }
                                                                    value={
                                                                        loan_type
                                                                    }
                                                                    className="capitalize"
                                                                >
                                                                    {loan_type}
                                                                </SelectItem>
                                                            )
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                    </div>
                                </div>
                                {!memberProfile && (
                                    <FormErrorMessage errorMessage="Select member profile first to enable this section" />
                                )}
                                <fieldset
                                    disabled={!memberProfile || isReadOnly}
                                    className="grid grid-cols-12 gap-x-4"
                                >
                                    <div className="space-y-4 col-span-5">
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="loan_purpose_id"
                                            label="Loan Purpose"
                                            className="col-span-1"
                                            render={({ field }) => (
                                                <LoanPurposeCombobox
                                                    {...field}
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    onChange={(loanPurpose) =>
                                                        field.onChange(
                                                            loanPurpose.id
                                                        )
                                                    }
                                                />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            control={form.control}
                                            name="collector_place"
                                            label="Collector"
                                            className="shrink-0 col-span-3 w-full"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    value={field.value ?? ''}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    className="grid grid-cols-2"
                                                >
                                                    <FormItem className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/20 hover:bg-accent/60 hover:border-primary ease-in-out duration-200 relative flex w-full items-start gap-2 rounded-md border p-2.5 shadow-xs outline-none">
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
                                                                    Field
                                                                    Collection
                                                                </label>
                                                                <p
                                                                    id="collector-field-description"
                                                                    className="text-muted-foreground text-xs"
                                                                >
                                                                    visits
                                                                    member's
                                                                    location
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </FormItem>
                                                    <FormItem className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/20 hover:bg-accent/60 hover:border-primary ease-in-out duration-200 relative flex w-full items-start gap-2 rounded-md border p-2.5 shadow-xs outline-none">
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
                                                                    Office
                                                                    Collection
                                                                </label>
                                                                <p
                                                                    id="collector-office-description"
                                                                    className="text-muted-foreground text-xs"
                                                                >
                                                                    payments at
                                                                    the office
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </FormItem>
                                                </RadioGroup>
                                            )}
                                        />
                                        <div className="flex gap-x-2 w-fit items-center">
                                            <FormFieldWrapper
                                                control={form.control}
                                                name="exclude_holiday"
                                                className="mb-1"
                                                render={({ field }) => (
                                                    <div className="inline-flex items-center gap-2">
                                                        <Switch
                                                            id={field.name}
                                                            aria-label="Toggle exclude holiday"
                                                            checked={
                                                                field.value ||
                                                                false
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                            className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                        />
                                                        <Label
                                                            htmlFor={field.name}
                                                            className="shrink-0 text-xs font-medium"
                                                        >
                                                            Exclude Holiday
                                                        </Label>
                                                    </div>
                                                )}
                                            />

                                            <FormFieldWrapper
                                                control={form.control}
                                                name="exclude_saturday"
                                                className="mb-1"
                                                render={({ field }) => (
                                                    <div className="inline-flex items-center gap-2">
                                                        <Switch
                                                            id={field.name}
                                                            aria-label="Toggle exclude saturday"
                                                            checked={
                                                                field.value ||
                                                                false
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                            className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                        />
                                                        <Label
                                                            htmlFor={field.name}
                                                            className="shrink-0 text-xs font-medium"
                                                        >
                                                            Exclude Saturday
                                                        </Label>
                                                    </div>
                                                )}
                                            />

                                            <FormFieldWrapper
                                                control={form.control}
                                                name="exclude_sunday"
                                                className="mb-1"
                                                render={({ field }) => (
                                                    <div className="inline-flex items-center gap-2">
                                                        <Switch
                                                            id={field.name}
                                                            aria-label="Toggle exclude sunday"
                                                            checked={
                                                                field.value ||
                                                                false
                                                            }
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                            className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                        />
                                                        <Label
                                                            htmlFor={field.name}
                                                            className="font-medium text-xs"
                                                        >
                                                            Exclude Sunday
                                                        </Label>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-4 col-span-7 flex-1">
                                        <div className="flex gap-3">
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
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                    />
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
                                        <div className="space-y-4">
                                            <div className="flex max-w-full overflow-x-auto ecoop-scroll items-center gap-3">
                                                <FormFieldWrapper
                                                    control={form.control}
                                                    name="mode_of_payment"
                                                    label="Mode of Payment"
                                                    className="shrink-0 w-fit col-span-4"
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                            className="flex flex-wrap gap-x-2"
                                                        >
                                                            {LOAN_MODE_OF_PAYMENT.map(
                                                                (mop) => (
                                                                    <FormItem
                                                                        key={
                                                                            mop
                                                                        }
                                                                        className="flex items-center gap-4"
                                                                    >
                                                                        <label
                                                                            key={`mop-${mop}`}
                                                                            className="border-accent/50 hover:bg-accent/40 ease-in-out duration-100 bg-muted has-data-[state=checked]:text-primary-foreground has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer items-center gap-1 rounded-md border py-2.5 px-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                                                                        >
                                                                            <RadioGroupItem
                                                                                value={
                                                                                    mop
                                                                                }
                                                                                id={`mop-${mop}`}
                                                                                className="absolute border-0 inset-0 opacity-0 cursor-pointer"
                                                                            />
                                                                            <p className="capitalize text-xs leading-none font-medium pointer-events-none">
                                                                                {
                                                                                    mop
                                                                                }
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
                                            </div>
                                            {mode_of_payment === 'monthly' && (
                                                <FormFieldWrapper
                                                    control={form.control}
                                                    name="mode_of_payment_monthly_exact_day"
                                                    className="mb-1"
                                                    render={({ field }) => (
                                                        <div
                                                            className="group inline-flex items-center gap-2"
                                                            data-state={
                                                                field.value
                                                                    ? 'checked'
                                                                    : 'unchecked'
                                                            }
                                                        >
                                                            <span
                                                                id={`${field.name}-off`}
                                                                className="group-data-[state=checked]:text-muted-foreground/70 flex-1 text-nowrap cursor-pointer text-right text-sm font-medium"
                                                                aria-controls={
                                                                    field.name
                                                                }
                                                                onClick={() =>
                                                                    field.onChange(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                By 30 Days
                                                            </span>
                                                            <Switch
                                                                id={field.name}
                                                                checked={
                                                                    field.value
                                                                }
                                                                className="ease-in-out duration-200"
                                                                onCheckedChange={(
                                                                    switchValue
                                                                ) =>
                                                                    field.onChange(
                                                                        switchValue
                                                                    )
                                                                }
                                                                aria-labelledby={`${field.name}-off ${field.name}-on`}
                                                            />
                                                            <span
                                                                id={`${field.name}-on`}
                                                                className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
                                                                aria-controls={
                                                                    field.name
                                                                }
                                                                onClick={() =>
                                                                    field.onChange(
                                                                        true
                                                                    )
                                                                }
                                                            >
                                                                Exact Day
                                                            </span>
                                                        </div>
                                                        // <div className="inline-flex items-center gap-2">
                                                        //     <Switch
                                                        //         id={field.name}
                                                        //         aria-label="Toggle exact day"
                                                        //         checked={
                                                        //             field.value ||
                                                        //             false
                                                        //         }
                                                        //         onCheckedChange={
                                                        //             field.onChange
                                                        //         }
                                                        //         className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                        //     />
                                                        //     <Label
                                                        //         htmlFor={
                                                        //             field.name
                                                        //         }
                                                        //         className="text-sm font-medium"
                                                        //     >

                                                        //     </Label>
                                                        // </div>
                                                    )}
                                                />
                                            )}
                                            {mode_of_payment === 'day' && (
                                                <>
                                                    <FormFieldWrapper
                                                        control={form.control}
                                                        name="mode_of_payment_fixed_days"
                                                        label="Fixed Days"
                                                        className="space-y-1 col-span-1"
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                id={field.name}
                                                                placeholder="No of Days"
                                                                disabled={isDisabled(
                                                                    field.name
                                                                )}
                                                            />
                                                        )}
                                                    />
                                                </>
                                            )}
                                            {mode_of_payment === 'weekly' && (
                                                <>
                                                    <FormFieldWrapper
                                                        control={form.control}
                                                        name="mode_of_payment_weekly"
                                                        label="Weekdays"
                                                        className="space-y-1 col-span-1"
                                                        render={({ field }) => (
                                                            <WeekdayCombobox
                                                                {...field}
                                                            />
                                                        )}
                                                    />
                                                </>
                                            )}
                                            {mode_of_payment ===
                                                'semi-monthly' && (
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
                                    </div>
                                </fieldset>
                            </div>
                        </TabsContent>
                        <TabsContent value="comaker">
                            {/* COMAKER DETAILS */}
                            <LoanComakerSection
                                disabled={isReadOnly}
                                isDisabled={isDisabled}
                                form={form}
                            />
                        </TabsContent>
                    </Tabs>

                    <Separator />

                    <Tabs
                        value={tab}
                        onValueChange={(tab) => setTab(tab as TLoanFormTabs)}
                        className="max-w-full min-w-0"
                    >
                        <ScrollArea>
                            <TabsList className="before:bg-border justify-start relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                                <TabsTrigger
                                    value="entries"
                                    className="bg-muted overflow-hidden rounded-b-none rounded-t-lg border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                >
                                    <TransactionListIcon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Loan Entries
                                </TabsTrigger>
                                <TabsTrigger
                                    value="clearance"
                                    className="bg-muted overflow-hidden rounded-b-none rounded-t-lg border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                >
                                    <BadgeCheckFillIcon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Clearance
                                </TabsTrigger>
                                <TabsTrigger
                                    value="terms-and-condition-receipt"
                                    className="bg-muted overflow-hidden rounded-t-lg rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                >
                                    <QuestionCircleIcon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Terms & Condition / Receipt
                                </TabsTrigger>
                                <TabsTrigger
                                    value="other"
                                    className="bg-muted overflow-hidden rounded-t-lg rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                >
                                    <DotsHorizontalIcon
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                        aria-hidden="true"
                                    />
                                    Other
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <TabsContent
                            value="entries"
                            tabIndex={0}
                            className="bg-popover relative p-4 rounded-xl max-w-full min-w-0"
                        >
                            <FormFieldWrapper
                                control={form.control}
                                name="loan_transaction_entries"
                                className="col-span-7"
                                render={({ field }) => (
                                    <LoanEntriesEditor
                                        {...field}
                                        form={form}
                                        loanTransactionId={loanTransactionId}
                                        disabled={
                                            loanTransactionId === undefined ||
                                            isReadOnly ||
                                            isDisabled(field.name)
                                        }
                                    />
                                )}
                            />
                        </TabsContent>
                        <TabsContent
                            value="clearance"
                            tabIndex={0}
                            className="bg-popover p-4 rounded-xl min-w-0"
                        >
                            <LoanClearanceAnalysis
                                form={form}
                                isReadOnly={isReadOnly}
                                isDisabled={isDisabled}
                            />
                        </TabsContent>
                        <TabsContent
                            value="terms-and-condition-receipt"
                            tabIndex={0}
                            className="bg-popover p-4 space-y-4 rounded-xl"
                        >
                            <LoanTermsAndConditionReceiptSection
                                form={form}
                                isReadOnly={isReadOnly}
                                isDisabled={isDisabled}
                            />
                        </TabsContent>
                        <TabsContent
                            value="other"
                            className="bg-popover p-4 rounded-xl"
                        >
                            <FormFieldWrapper
                                control={form.control}
                                name="appraised_value"
                                label="Appraised Value"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Appraised Value"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="appraised_value_description"
                                label="Description"
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        id={field.name}
                                        placeholder="Description"
                                        disabled={isDisabled(field.name)}
                                        className="min-h-44"
                                    />
                                )}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
                <FormFooterResetSubmit
                    className="grow min-w-0 max-w-full p-4 z-10 sticky bottom-0 mx-4 mb-4 bg-popover/70 rounded-xl"
                    error={error}
                    readOnly={isReadOnly}
                    isLoading={isPending}
                    // disableSubmit={
                    //     formMode === 'create' && !areRequiredFieldsFilled
                    // }
                    submitText={loanTransactionId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset?.()
                        hasAutoCreatedRef.current = false
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
    formProps?: Omit<ILoanTransactionFormProps, 'className'>
}) => {
    return (
        <Modal
            title=""
            description=""
            titleClassName="sr-only"
            descriptionClassName="sr-only"
            className={cn('p-0 !max-w-5xl gap-y-0', className)}
            {...props}
        >
            <LoanTransactionCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                }}
            />
        </Modal>
    )
}

export default LoanTransactionCreateUpdateForm
