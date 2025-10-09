import { useCallback, useRef, useState } from 'react'

import { Path, UseFormReturn, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import LoanPurposeCombobox from '@/modules/loan-purpose/components/loan-purpose-combobox'
import LoanStatusCombobox from '@/modules/loan-status/components/loan-status-combobox'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'
import { resolveLoanDatesToStatus } from '@/modules/loan-transaction/loan.utils'
import {
    IMemberProfile,
    useGetMemberProfileById,
} from '@/modules/member-profile'
import MemberPicker from '@/modules/member-profile/components/member-picker'
import MemberProfileInfoViewLoanCard from '@/modules/member-profile/components/member-profile-info-loan-view-card'
import { IQRMemberProfileDecodedResult } from '@/modules/qr-crypto'
import useConfirmModalStore from '@/store/confirm-modal-store'
import { useHotkeys } from 'react-hotkeys-hook'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import {
    BadgeCheckFillIcon,
    BookOpenIcon,
    BuildingBranchIcon,
    CheckIcon,
    DotsHorizontalIcon,
    HashIcon,
    PercentIcon,
    PinLocationIcon,
    QuestionCircleIcon,
    ScanLineIcon,
    TextFileFillIcon,
    TransactionListIcon,
    UserIcon,
    UserPlusIcon,
    Users3FillIcon,
    WandSparkleIcon,
    XIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import QrCodeScanner from '@/components/qrcode-scanner'
import { Button } from '@/components/ui/button'
import { CommandShortcut } from '@/components/ui/command'
import { Form, FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
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
import LoanTypeConfirmDisplay from '../../confirm-dialog-displays/loan-type-confirm-display'
import LoanPicker from '../../loan-picker'
import LoanStatusIndicator from '../../loan-status-indicator'
import { LoanTagsManagerPopover } from '../../loan-tag-manager'
import LoanTypeCombobox from '../../loan-type-combobox'
import WeekdayCombobox from '../../weekday-combobox'
import { LoanSuggestedAmortizationFormModal } from '../loan-suggested-amortization-form'
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
    const [customLoading, setCustomLoading] = useState(false)
    const memberPickerModal = useModalState()
    const { onOpen } = useConfirmModalStore()

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
        'terms',
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

    const isLoading = isPending || customLoading
    const error = firstError || serverRequestErrExtractor({ error: rawError })

    const mode_of_payment = form.watch('mode_of_payment')
    const memberProfile = form.watch('member_profile')

    return (
        <Form {...form}>
            <form
                className={cn('w-full max-w-full', className)}
                onSubmit={onSubmit}
                ref={formRef}
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
                                        loanTransactionId={loanTransactionId}
                                        size="sm"
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
                                        <CommandShortcut
                                            className="bg-accent p-0.5 cursor-pointer hover:text-primary px-1 text-primary/80 hover:bg-popover duration-300 outline rounded-sm ml-1"
                                            onClick={() =>
                                                memberPickerModal.onOpenChange(
                                                    true
                                                )
                                            }
                                        >
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
                                                disabled={isDisabled(
                                                    field.name
                                                )}
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
                                                setStartScan={setStartScan}
                                                startScan={startScan}
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
                                                <button
                                                    className="p-4  flex-col items-center w-full gap-y-4 justify-center"
                                                    onClick={() =>
                                                        memberPickerModal.onOpenChange(
                                                            true
                                                        )
                                                    }
                                                    type="button"
                                                >
                                                    <div className="border cursor-pointer hover:bg-popover text-primary/70  hover:text-primary ease-in-out duration-300 border-dashed bg-muted/40 border-primary p-4 mb-2 space-y-2 mx-auto rounded-xl">
                                                        <UserPlusIcon className="size-7 mx-auto " />
                                                        <p className="text-center text-xs">
                                                            Please Select Member
                                                        </p>
                                                    </div>
                                                    <p className="text-center text-muted-foreground/80 text-xs">
                                                        select member or press
                                                        'CTRL + Enter' to show
                                                        picker | or press 'Shit
                                                        + S' to scan QR Code
                                                    </p>
                                                </button>
                                            )}
                                            <MemberPicker
                                                disabled={isDisabled(
                                                    field.name
                                                )}
                                                modalState={{
                                                    ...memberPickerModal,
                                                }}
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
                                                placeholder="Select Member"
                                                triggerClassName="hidden"
                                                value={memberProfile}
                                            />
                                        </div>
                                    </div>
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Loan Account"
                            name="account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    disabled={isDisabled(field.name)}
                                    mode="loan"
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        form.setValue('account', account)
                                    }}
                                    placeholder="Select Loan Account"
                                    value={form.getValues('account')}
                                />
                            )}
                        />
                    </div>
                    <Tabs
                        className="max-w-full min-w-0"
                        onValueChange={(selectedTab) =>
                            setTab2(selectedTab as TLoanFormTabs2)
                        }
                        value={tab2}
                    >
                        <ScrollArea>
                            <TabsList className="before:bg-border justify-start relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                                <TabsTrigger
                                    className="bg-muted overflow-hidden rounded-b-none rounded-t-lg border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                    value="loan-details"
                                >
                                    <BookOpenIcon
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                    Loan Details
                                </TabsTrigger>
                                <TabsTrigger
                                    className="bg-muted overflow-hidden rounded-b-none rounded-t-lg border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                    value="comaker"
                                >
                                    <Users3FillIcon
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                    Comaker
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <TabsContent
                            tabIndex={0}
                            value="loan-details"
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
                                            className="col-span-1 max-w-72"
                                            control={form.control}
                                            label={
                                                <span className="flex items-center justify-between pb-1">
                                                    <span>
                                                        OR{' '}
                                                        <HashIcon className="inline text-muted-foreground" />
                                                    </span>
                                                    <button
                                                        className="text-xs disabled:pointer-events-none text-muted-foreground duration-150 cursor-pointer hover:text-foreground underline-offset-4 underline"
                                                        disabled={isDisabled(
                                                            'official_receipt_number'
                                                        )}
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
                                                        type="button"
                                                    >
                                                        Auto OR{' '}
                                                        <WandSparkleIcon className="inline" />
                                                    </button>
                                                </span>
                                            }
                                            name="official_receipt_number"
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
                                            className="w-fit"
                                            control={form.control}
                                            label="Loan Status"
                                            labelClassName="text-right grow block"
                                            name="loan_status_id"
                                            render={({ field }) => (
                                                <LoanStatusCombobox
                                                    disabled={false}
                                                    onChange={(loanStatus) =>
                                                        field.onChange(
                                                            loanStatus.id
                                                        )
                                                    }
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            className="col-span-1"
                                            control={form.control}
                                            label="Loan Type"
                                            labelClassName="text-right grow block"
                                            name="loan_type"
                                            render={({ field }) => (
                                                <LoanTypeCombobox
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    onChange={(loanType) => {
                                                        onOpen({
                                                            title: 'Change Loan Type',
                                                            description:
                                                                'Are you sure you want to change loan type? This action will affect loan entries.',
                                                            content:
                                                                LoanTypeConfirmDisplay(
                                                                    { loanType }
                                                                ),
                                                            onConfirm: () => {
                                                                field.onChange(
                                                                    loanType
                                                                )
                                                            },
                                                        })
                                                    }}
                                                    value={field.value}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                                {!memberProfile && (
                                    <FormErrorMessage errorMessage="Select member profile first to enable this section" />
                                )}
                                <fieldset
                                    className="grid grid-cols-12 gap-x-4"
                                    disabled={!memberProfile || isReadOnly}
                                >
                                    <div className="space-y-4 col-span-5">
                                        <FormFieldWrapper
                                            className="col-span-1"
                                            control={form.control}
                                            label="Loan Purpose"
                                            name="loan_purpose_id"
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
                                            className="shrink-0 col-span-3 w-full"
                                            control={form.control}
                                            label="Collector"
                                            name="collector_place"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    className="grid grid-cols-2"
                                                    disabled={isDisabled(
                                                        field.name
                                                    )}
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value ?? ''}
                                                >
                                                    <FormItem className="border-input has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/20 hover:bg-accent/60 hover:border-primary ease-in-out duration-200 relative flex w-full items-start gap-2 rounded-md border p-2.5 shadow-xs outline-none">
                                                        <RadioGroupItem
                                                            aria-describedby="collector-field-description"
                                                            className="order-1 after:absolute after:inset-0"
                                                            id="collector-field"
                                                            value="field"
                                                        />
                                                        <div className="flex grow items-start gap-3">
                                                            <PinLocationIcon
                                                                aria-hidden="true"
                                                                className="shrink-0 size-4 opacity-60"
                                                            />
                                                            <div>
                                                                <label
                                                                    className="text-foreground text-sm font-medium cursor-pointer"
                                                                    htmlFor="collector-field"
                                                                >
                                                                    Field
                                                                    Collection
                                                                </label>
                                                                <p
                                                                    className="text-muted-foreground text-xs"
                                                                    id="collector-field-description"
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
                                                            aria-describedby="collector-office-description"
                                                            className="order-1 after:absolute after:inset-0"
                                                            id="collector-office"
                                                            value="office"
                                                        />
                                                        <div className="flex grow items-start gap-3">
                                                            <BuildingBranchIcon
                                                                aria-hidden="true"
                                                                className="shrink-0 size-4 opacity-60"
                                                            />
                                                            <div>
                                                                <label
                                                                    className="text-foreground text-sm font-medium cursor-pointer"
                                                                    htmlFor="collector-office"
                                                                >
                                                                    Office
                                                                    Collection
                                                                </label>
                                                                <p
                                                                    className="text-muted-foreground text-xs"
                                                                    id="collector-office-description"
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
                                                className="mb-1"
                                                control={form.control}
                                                name="exclude_holiday"
                                                render={({ field }) => (
                                                    <div className="inline-flex items-center gap-2">
                                                        <Switch
                                                            aria-label="Toggle exclude holiday"
                                                            checked={
                                                                field.value ||
                                                                false
                                                            }
                                                            className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                            id={field.name}
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                        <Label
                                                            className="shrink-0 text-xs font-medium"
                                                            htmlFor={field.name}
                                                        >
                                                            Exclude Holiday
                                                        </Label>
                                                    </div>
                                                )}
                                            />

                                            <FormFieldWrapper
                                                className="mb-1"
                                                control={form.control}
                                                name="exclude_saturday"
                                                render={({ field }) => (
                                                    <div className="inline-flex items-center gap-2">
                                                        <Switch
                                                            aria-label="Toggle exclude saturday"
                                                            checked={
                                                                field.value ||
                                                                false
                                                            }
                                                            className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                            id={field.name}
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                        <Label
                                                            className="shrink-0 text-xs font-medium"
                                                            htmlFor={field.name}
                                                        >
                                                            Exclude Saturday
                                                        </Label>
                                                    </div>
                                                )}
                                            />

                                            <FormFieldWrapper
                                                className="mb-1"
                                                control={form.control}
                                                name="exclude_sunday"
                                                render={({ field }) => (
                                                    <div className="inline-flex items-center gap-2">
                                                        <Switch
                                                            aria-label="Toggle exclude sunday"
                                                            checked={
                                                                field.value ||
                                                                false
                                                            }
                                                            className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                            id={field.name}
                                                            onCheckedChange={
                                                                field.onChange
                                                            }
                                                        />
                                                        <Label
                                                            className="font-medium text-xs"
                                                            htmlFor={field.name}
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
                                                label="Applied Amount *"
                                                name="applied_1"
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        className="border-primary/70 border-2"
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                        id={field.name}
                                                        placeholder="Applied Amount"
                                                    />
                                                )}
                                            />
                                            <Separator
                                                className="min-h-8 mt-6"
                                                orientation="vertical"
                                            />
                                            <FormFieldWrapper
                                                control={form.control}
                                                label="Terms"
                                                name="terms"
                                                render={({ field }) => (
                                                    <Input
                                                        {...field}
                                                        disabled={isDisabled(
                                                            field.name
                                                        )}
                                                        id={field.name}
                                                        placeholder="Terms"
                                                    />
                                                )}
                                            />
                                            <SuggestedAmortizationSection
                                                form={form}
                                            />
                                        </div>
                                        <LoanPickerSection
                                            form={form}
                                            isDisabled={isDisabled}
                                        />
                                        <div className="space-y-4">
                                            <div className="flex max-w-full overflow-x-auto ecoop-scroll items-center gap-3">
                                                <FormFieldWrapper
                                                    className="shrink-0 w-fit col-span-4"
                                                    control={form.control}
                                                    label="Mode of Payment"
                                                    name="mode_of_payment"
                                                    render={({ field }) => (
                                                        <RadioGroup
                                                            className="flex flex-wrap gap-x-2"
                                                            onValueChange={
                                                                field.onChange
                                                            }
                                                            value={
                                                                field.value ??
                                                                ''
                                                            }
                                                        >
                                                            {LOAN_MODE_OF_PAYMENT.map(
                                                                (mop) => (
                                                                    <FormItem
                                                                        className="flex items-center gap-4"
                                                                        key={
                                                                            mop
                                                                        }
                                                                    >
                                                                        <label
                                                                            className="border-accent/50 hover:bg-accent/40 ease-in-out duration-100 bg-muted has-data-[state=checked]:text-primary-foreground has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer items-center gap-1 rounded-md border py-2.5 px-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                                                                            key={`mop-${mop}`}
                                                                        >
                                                                            <RadioGroupItem
                                                                                className="absolute border-0 inset-0 opacity-0 cursor-pointer"
                                                                                id={`mop-${mop}`}
                                                                                value={
                                                                                    mop
                                                                                }
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
                                                    className="mb-1"
                                                    control={form.control}
                                                    name="mode_of_payment_monthly_exact_day"
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
                                                                aria-controls={
                                                                    field.name
                                                                }
                                                                className="group-data-[state=checked]:text-muted-foreground/70 flex-1 text-nowrap cursor-pointer text-right text-sm font-medium"
                                                                id={`${field.name}-off`}
                                                                onClick={() =>
                                                                    field.onChange(
                                                                        false
                                                                    )
                                                                }
                                                            >
                                                                By 30 Days
                                                            </span>
                                                            <Switch
                                                                aria-labelledby={`${field.name}-off ${field.name}-on`}
                                                                checked={
                                                                    field.value
                                                                }
                                                                className="ease-in-out duration-200"
                                                                id={field.name}
                                                                onCheckedChange={(
                                                                    switchValue
                                                                ) =>
                                                                    field.onChange(
                                                                        switchValue
                                                                    )
                                                                }
                                                            />
                                                            <span
                                                                aria-controls={
                                                                    field.name
                                                                }
                                                                className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
                                                                id={`${field.name}-on`}
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
                                                        className="space-y-1 col-span-1"
                                                        control={form.control}
                                                        label="Fixed Days"
                                                        name="mode_of_payment_fixed_days"
                                                        render={({ field }) => (
                                                            <Input
                                                                {...field}
                                                                disabled={isDisabled(
                                                                    field.name
                                                                )}
                                                                id={field.name}
                                                                placeholder="No of Days"
                                                            />
                                                        )}
                                                    />
                                                </>
                                            )}
                                            {mode_of_payment === 'weekly' && (
                                                <>
                                                    <FormFieldWrapper
                                                        className="space-y-1 col-span-1"
                                                        control={form.control}
                                                        label="Weekdays"
                                                        name="mode_of_payment_weekly"
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
                                                        className="col-span-1"
                                                        control={form.control}
                                                        label="Pay 1 (Day of Month) *"
                                                        name="mode_of_payment_semi_monthly_pay_1"
                                                        render={({ field }) => (
                                                            <Input {...field} />
                                                        )}
                                                    />
                                                    <FormFieldWrapper
                                                        className="col-span-1"
                                                        control={form.control}
                                                        label="Pay 2 (Day of Month) *"
                                                        name="mode_of_payment_semi_monthly_pay_2"
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
                                form={form}
                                isDisabled={isDisabled}
                            />
                        </TabsContent>
                    </Tabs>

                    <Separator />

                    <Tabs
                        className="max-w-full min-w-0"
                        onValueChange={(tab) => setTab(tab as TLoanFormTabs)}
                        value={tab}
                    >
                        <ScrollArea>
                            <TabsList className="before:bg-border justify-start relative h-auto w-full gap-0.5 bg-transparent p-0 before:absolute before:inset-x-0 before:bottom-0 before:h-px">
                                <TabsTrigger
                                    className="bg-muted overflow-hidden rounded-b-none rounded-t-lg border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                    value="entries"
                                >
                                    <TransactionListIcon
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                    Loan Entries
                                </TabsTrigger>
                                <TabsTrigger
                                    className="bg-muted overflow-hidden rounded-b-none rounded-t-lg border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                    value="clearance"
                                >
                                    <BadgeCheckFillIcon
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                    Clearance
                                </TabsTrigger>
                                <TabsTrigger
                                    className="bg-muted overflow-hidden rounded-t-lg rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                    value="terms-and-condition-receipt"
                                >
                                    <QuestionCircleIcon
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                    Terms & Condition / Receipt
                                </TabsTrigger>
                                <TabsTrigger
                                    className="bg-muted overflow-hidden rounded-t-lg rounded-b-none border-x border-t py-2 data-[state=active]:z-10 data-[state=active]:shadow-none"
                                    value="other"
                                >
                                    <DotsHorizontalIcon
                                        aria-hidden="true"
                                        className="-ms-0.5 me-1.5 opacity-60"
                                        size={16}
                                    />
                                    Other
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                        <TabsContent
                            className="bg-popover relative p-4 rounded-xl max-w-full min-w-0"
                            tabIndex={0}
                            value="entries"
                        >
                            <FormFieldWrapper
                                className="col-span-7"
                                control={form.control}
                                name="loan_transaction_entries"
                                render={({ field }) => (
                                    <LoanEntriesEditor
                                        {...field}
                                        disabled={
                                            loanTransactionId === undefined ||
                                            isReadOnly ||
                                            isDisabled(field.name)
                                        }
                                        form={form}
                                        loanTransactionId={loanTransactionId}
                                        onUpdateAnything={(newData) => {
                                            form.reset(newData)
                                            updateMutation.reset()
                                            createMutation.reset()
                                        }}
                                        onUpdateLoading={setCustomLoading}
                                    />
                                )}
                            />
                        </TabsContent>
                        <TabsContent
                            className="bg-popover p-4 rounded-xl min-w-0"
                            tabIndex={0}
                            value="clearance"
                        >
                            <LoanClearanceAnalysis
                                form={form}
                                isDisabled={isDisabled}
                                isReadOnly={isReadOnly}
                            />
                        </TabsContent>
                        <TabsContent
                            className="bg-popover p-4 space-y-4 rounded-xl"
                            tabIndex={0}
                            value="terms-and-condition-receipt"
                        >
                            <LoanTermsAndConditionReceiptSection
                                form={form}
                                isDisabled={isDisabled}
                                isReadOnly={isReadOnly}
                            />
                        </TabsContent>
                        <TabsContent
                            className="bg-popover p-4 rounded-xl"
                            value="other"
                        >
                            <FormFieldWrapper
                                control={form.control}
                                label="Appraised Value"
                                name="appraised_value"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Appraised Value"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Description"
                                name="appraised_value_description"
                                render={({ field }) => (
                                    <Textarea
                                        {...field}
                                        className="min-h-44"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Description"
                                    />
                                )}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
                <FormFooterResetSubmit
                    className="grow min-w-0 max-w-full p-4 z-10 sticky bottom-0 mx-4 mb-4 bg-popover/70 rounded-xl"
                    error={error}
                    hideReset={loanTransactionId !== undefined}
                    isLoading={isLoading}
                    onReset={() => {
                        form.reset()
                        reset?.()
                        hasAutoCreatedRef.current = false
                    }}
                    readOnly={isReadOnly}
                    // disableSubmit={
                    //     formMode === 'create' && !areRequiredFieldsFilled
                    // }
                    submitText={loanTransactionId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

const LoanPickerSection = ({
    form,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
    isDisabled: (fieldName: Path<TLoanTransactionSchema>) => boolean
}) => {
    const loanType = form.watch('loan_type')
    const memberProfileId = form.watch('member_profile_id')

    if (
        !['renewal', 'restructured', 'renewal without deduction'].includes(
            loanType
        )
    ) {
        return null
    }

    return (
        <FormFieldWrapper
            control={form.control}
            label="Previous Loan"
            name="previous_loan_id"
            render={({ field }) => (
                <div className="flex items-center gap-x-1">
                    <LoanPicker
                        memberProfileId={memberProfileId as TEntityId}
                        mode="member-profile-released"
                        onSelect={(loan) => {
                            field.onChange(loan?.id)
                            form.setValue('previous_loan', loan)
                        }}
                        triggerClassName="flex-1"
                        value={form.getValues('previous_loan')}
                    />
                    <Button
                        className="size-fit !p-2.5 shrink-0"
                        onClick={() => {
                            field.onChange(undefined)
                            form.setValue('previous_loan', undefined)
                        }}
                        type="button"
                        variant="destructive"
                    >
                        <XIcon />
                    </Button>
                </div>
            )}
        />
    )
}

const SuggestedAmortizationSection = ({
    form,
}: {
    form: UseFormReturn<TLoanTransactionSchema>
}) => {
    const suggestedAmortizationState = useModalState()
    const principal = form.watch('applied_1') || 0
    const mode_of_payment = form.watch('mode_of_payment') || 'monthly'
    const fixed_days = form.watch('mode_of_payment_fixed_days') || 0

    return (
        <>
            <LoanSuggestedAmortizationFormModal
                {...suggestedAmortizationState}
                formProps={{
                    defaultValues: {
                        amount: 0,
                        principal,
                        mode_of_payment,
                        fixed_days,
                    },
                    onSuccess: (data) => {
                        form.setValue('terms', data.terms, {
                            shouldDirty: true,
                        })
                    },
                }}
            />
            <Button
                className="mt-6"
                onClick={() => suggestedAmortizationState.onOpenChange(true)}
                size="icon"
                type="button"
            >
                <PercentIcon />
            </Button>
        </>
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
            className={cn('p-0 !max-w-5xl gap-y-0', className)}
            description=""
            descriptionClassName="sr-only"
            title=""
            titleClassName="sr-only"
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
