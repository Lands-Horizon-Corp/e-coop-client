import { useState } from 'react'

import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    ACCOUNT_INTEREST_STANDARD_COMPUTATION,
    AccountExclusiveSettingTypeEnum,
    AccountTypeEnum,
    ComputationTypeEnum,
    EarnedUnearnedInterestEnum,
    FinancialStatementTypeEnum,
    GeneralLedgerTypeEnum,
    IAccount,
    IAccountRequest,
    IAccountRequestSchema,
    InterestDeductionEnum,
    InterestFinesComputationDiminishingEnum,
    InterestFinesComputationDiminishingStraightDiminishingYearlyEnum,
    InterestSavingTypeDiminishingStraightEnum,
    LoanSavingTypeEnum,
    LumpsumComputationTypeEnum,
    OtherDeductionEntryEnum,
    OtherInformationOfAnAccountEnum,
    TAccountFormValues,
    useCreate,
    useUpdateById,
} from '@/modules/account'
import { AccountCategoryComboBox } from '@/modules/account-category'
import { AccountClassificationComboBox } from '@/modules/account-classification'
import { AccountTagsManagerPopover } from '@/modules/account-tag/components/account-tag-management'
import { useAuthUserWithOrgBranch } from '@/modules/authentication/authgentication.store'
import ComputationSheetCombobox from '@/modules/computation-sheet/components/computation-sheet-combobox'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    ExcludeIcon,
    FaCalendarCheckIcon,
    HandCoinsIcon,
    InternalIcon,
    LoadingSpinnerIcon,
    MoneyBagIcon,
    MoneyIcon,
    TIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl } from '@/components/ui/form'
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
} from '@/components/ui/select'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface IAccountCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IAccountRequest>, IAccount, string, TAccountFormValues> {
    accountId?: TEntityId
}

const AccountCreateUpdateForm = ({
    className,
    accountId,
    ...formProps
}: IAccountCreateUpdateFormProps) => {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const organizationId = currentAuth.user_organization.organization_id
    const branchId = currentAuth.user_organization.branch_id

    const [selectedItem, setSelectedItem] = useState<string>(
        formProps.defaultValues?.type || ''
    )

    const form = useForm<TAccountFormValues>({
        resolver: standardSchemaResolver(IAccountRequestSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            show_in_general_ledger_source_withdraw: true,
            show_in_general_ledger_source_deposit: true,
            show_in_general_ledger_source_journal: true,
            show_in_general_ledger_source_payment: true,
            show_in_general_ledger_source_adjustment: true,
            show_in_general_ledger_source_journal_voucher: true,
            show_in_general_ledger_source_check_voucher: true,
            compassion_fund: false,
            compassion_fund_amount: 0,
            icon: 'Money Bag',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreate({
        options: {
            onSuccess: formProps.onSuccess,
        },
    })

    const updateMutation = useUpdateById({
        options: { onSuccess: formProps.onSuccess },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TAccountFormValues>({
            form,
            ...formProps,
            autoSave: accountId !== undefined, // No autosave for accounts
        })

    const onSubmit = form.handleSubmit((data: TAccountFormValues) => {
        const request = {
            branch_id: branchId,
            organization_id: organizationId,
            ...data,
        }
        if (accountId) {
            updateMutation.mutate({ id: accountId, payload: request })
        } else {
            createMutation.mutate(request)
        }
    }, handleFocusError)

    const { error: errorResponse, isPending: isLoading } = accountId
        ? updateMutation
        : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    const isCompassionFundEnabled = form.watch('compassion_fund')

    return (
        <Form {...form}>
            <form
                className={cn('w-full', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                {accountId && (
                    <div className="absolute top-4 right-10">
                        <AccountTagsManagerPopover
                            accountId={accountId}
                            size="sm"
                        />
                    </div>
                )}
                <FormErrorMessage errorMessage={error} />
                <div className="flex w-full flex-col gap-5 md:flex-row">
                    <fieldset
                        className="space-y-3 md:w-[80%]"
                        disabled={formProps.readOnly}
                    >
                        <FormFieldWrapper
                            control={form.control}
                            disabled={isLoading}
                            label="Account Name *"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    id={field.name}
                                    placeholder="Account Name"
                                    value={field.value ?? ''}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            className="col-span-4"
                            control={form.control}
                            disabled={isLoading}
                            label="Account type"
                            name="type"
                            render={({ field }) => (
                                <FormControl>
                                    <Select
                                        defaultValue={field.value}
                                        disabled={
                                            formProps.readOnly || isLoading
                                        }
                                        onValueChange={(selectedValue) => {
                                            field.onChange(selectedValue)
                                            setSelectedItem(selectedValue)
                                        }}
                                    >
                                        <SelectTrigger className="w-full">
                                            {field.value ||
                                                'select Account Type'}
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.values(AccountTypeEnum).map(
                                                (account) => {
                                                    return (
                                                        <SelectItem
                                                            key={account}
                                                            value={account}
                                                        >
                                                            {account}
                                                        </SelectItem>
                                                    )
                                                }
                                            )}
                                        </SelectContent>
                                    </Select>
                                </FormControl>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            disabled={isLoading}
                            label="Alternative Code"
                            name="alternative_code"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    id={field.name}
                                    placeholder="Account Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            className="col-span-1"
                            control={form.control}
                            label="Member Type"
                            name="member_type_id"
                            render={({ field }) => (
                                <MemberTypeCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(selected) =>
                                        field.onChange(selected.id)
                                    }
                                    placeholder="Select Member Type"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Account Classification"
                            name="account_classification_id"
                            render={({ field }) => (
                                <AccountClassificationComboBox
                                    disabled={
                                        isDisabled(field.name) || isLoading
                                    }
                                    onChange={(selected) =>
                                        field.onChange(selected.id)
                                    }
                                    placeholder="Select Account Classification"
                                    value={field.value}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            disabled={isLoading}
                            label="Icon"
                            name="icon"
                            render={({ field }) => (
                                <IconCombobox
                                    {...field}
                                    placeholder="Select Icon"
                                    value={field.value as TIcon}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            disabled={isLoading}
                            label="Account Category"
                            name="account_category_id"
                            render={({ field }) => (
                                <AccountCategoryComboBox
                                    disabled={
                                        isDisabled(field.name) || isLoading
                                    }
                                    onChange={(selected) =>
                                        field.onChange(selected.id)
                                    }
                                    placeholder="Select Account Category"
                                    value={field.value}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            className="col-span-4"
                            control={form.control}
                            label="Account Description"
                            name="description"
                            render={({ field }) => {
                                const { ref: _ref, ...rest } = field
                                return (
                                    <TextEditor
                                        {...rest}
                                        content={field.value ?? ''}
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        placeholder="Write some description about the account..."
                                        textEditorClassName="!max-w-none !h-32"
                                    />
                                )
                            }}
                        />
                        <div className="">
                            <FormFieldWrapper
                                className=""
                                control={form.control}
                                name="account_exclusive_setting_type"
                                render={({ field }) => (
                                    <>
                                        {/* Checkbox for Is Internal */}
                                        <GradientBackground gradientOnly>
                                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                <Checkbox
                                                    aria-describedby="is_internal_description"
                                                    checked={
                                                        field.value ===
                                                        AccountExclusiveSettingTypeEnum.IsInternal
                                                    }
                                                    className="order-1 after:absolute after:inset-0"
                                                    disabled={isLoading}
                                                    id="is_internal_checkbox"
                                                    name={field.name}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        field.onChange(
                                                            checked
                                                                ? AccountExclusiveSettingTypeEnum.IsInternal
                                                                : AccountExclusiveSettingTypeEnum.None
                                                        )
                                                    }
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="size-fit rounded-full bg-secondary p-2">
                                                        <InternalIcon />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="is_internal_checkbox">
                                                            Is Internal Account
                                                        </Label>
                                                        <p
                                                            className="text-xs text-muted-foreground"
                                                            id="is_internal_description"
                                                        >
                                                            Mark this account as
                                                            for internal use
                                                            only.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </GradientBackground>

                                        {/* Checkbox for Cash on Hand */}
                                        <GradientBackground gradientOnly>
                                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                <Checkbox
                                                    aria-describedby="cash_on_hand_description"
                                                    checked={
                                                        field.value ===
                                                        AccountExclusiveSettingTypeEnum.CashOnHand
                                                    }
                                                    className="order-1 after:absolute after:inset-0"
                                                    disabled={isLoading}
                                                    id="cash_on_hand_checkbox"
                                                    name={field.name}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        field.onChange(
                                                            checked
                                                                ? AccountExclusiveSettingTypeEnum.CashOnHand
                                                                : AccountExclusiveSettingTypeEnum.None
                                                        )
                                                    }
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="size-fit rounded-full bg-secondary p-2">
                                                        <MoneyIcon />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="cash_on_hand_checkbox">
                                                            Cash on Hand
                                                        </Label>
                                                        <p
                                                            className="text-xs text-muted-foreground"
                                                            id="cash_on_hand_description"
                                                        >
                                                            Designate this as a
                                                            Cash on Hand
                                                            account.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </GradientBackground>

                                        {/* Checkbox for Paid-Up Share Capital */}
                                        <GradientBackground gradientOnly>
                                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                <Checkbox
                                                    aria-describedby="paid_up_share_capital_description"
                                                    checked={
                                                        field.value ===
                                                        AccountExclusiveSettingTypeEnum.PaidUpShareCapital
                                                    }
                                                    className="order-1 after:absolute after:inset-0"
                                                    disabled={isLoading}
                                                    id="paid_up_share_capital_checkbox"
                                                    name={field.name}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        field.onChange(
                                                            checked
                                                                ? AccountExclusiveSettingTypeEnum.PaidUpShareCapital
                                                                : AccountExclusiveSettingTypeEnum.None
                                                        )
                                                    }
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="size-fit rounded-full bg-secondary p-2">
                                                        <MoneyBagIcon />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label htmlFor="paid_up_share_capital_checkbox">
                                                            Paid-Up Share
                                                            Capital
                                                        </Label>
                                                        <p
                                                            className="text-xs text-muted-foreground"
                                                            id="paid_up_share_capital_description"
                                                        >
                                                            This account
                                                            represents paid-up
                                                            share capital.
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </GradientBackground>
                                    </>
                                )}
                            />
                        </div>
                        <fieldset className="grid grid-cols-3 gap-2">
                            <legend>Reporting & Display Configuration</legend>
                            <FormFieldWrapper
                                className="grow"
                                control={form.control}
                                disabled={isLoading}
                                label="Header Row"
                                name="header_row"
                                render={({ field }) => (
                                    <div className="flex grow flex-col gap-y-2">
                                        <Input
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === ''
                                                        ? undefined
                                                        : parseInt(
                                                              e.target.value,
                                                              10
                                                          )
                                                )
                                            }
                                            placeholder="Header Row"
                                            value={field.value ?? ''}
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                className="grow"
                                control={form.control}
                                disabled={isLoading}
                                label="Center Row"
                                name="center_row"
                                render={({ field }) => (
                                    <div className="flex grow flex-col gap-y-2">
                                        <Input
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === ''
                                                        ? undefined
                                                        : parseInt(
                                                              e.target.value,
                                                              10
                                                          )
                                                )
                                            }
                                            placeholder="Center Row"
                                            value={field.value ?? ''}
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                className="grow"
                                control={form.control}
                                disabled={isLoading}
                                label="Total Row"
                                name="total_row"
                                render={({ field }) => (
                                    <div className="flex grow flex-col gap-y-2">
                                        <Input
                                            {...field}
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === ''
                                                        ? undefined
                                                        : parseInt(
                                                              e.target.value,
                                                              10
                                                          )
                                                )
                                            }
                                            placeholder="Total Row"
                                            value={field.value ?? ''}
                                        />
                                    </div>
                                )}
                            />
                        </fieldset>
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            label="Diminishing Balance Computation Method"
                            name="interest_fines_computation_diminishing"
                            render={({ field }) => (
                                <GradientBackground
                                    className="p-5"
                                    gradientOnly
                                >
                                    <RadioGroup
                                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {Object.values(
                                            InterestFinesComputationDiminishingEnum
                                        ).map((type) => (
                                            <div
                                                className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                key={type}
                                            >
                                                <RadioGroupItem
                                                    className="order-1 after:absolute after:inset-0"
                                                    id={`interest-fines-diminishing-${type}`}
                                                    value={type}
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`interest-fines-diminishing-${type}`}
                                                        >
                                                            {type}
                                                        </Label>
                                                        <p
                                                            className="text-xs text-muted-foreground"
                                                            id={`interest-fines-diminishing-${type}-description`}
                                                        >
                                                            {type ===
                                                                InterestFinesComputationDiminishingEnum.None &&
                                                                'No specific diminishing computation method.'}
                                                            {type ===
                                                                InterestFinesComputationDiminishingEnum.ByAmortization &&
                                                                'Calculates interest/fines based on amortization.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </GradientBackground>
                            )}
                        />
                        <FormFieldWrapper
                            className="col-span-2"
                            control={form.control}
                            label="Detailed Diminishing/Straight/Yearly Computation"
                            name="interest_fines_computation_diminishing_straight_diminishing_yearly"
                            render={({ field }) => (
                                <GradientBackground
                                    className="p-5"
                                    gradientOnly
                                    opacity={0.03}
                                >
                                    <RadioGroup
                                        className="grid grid-cols-1 gap-4"
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        value={field.value}
                                    >
                                        {Object.values(
                                            InterestFinesComputationDiminishingStraightDiminishingYearlyEnum
                                        ).map((type) => (
                                            <div
                                                className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                key={type}
                                            >
                                                <RadioGroupItem
                                                    className="order-1 after:absolute after:inset-0"
                                                    id={`interest-fines-yearly-${type}`}
                                                    value={type}
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`interest-fines-yearly-${type}`}
                                                        >
                                                            {type}
                                                        </Label>
                                                        <p
                                                            className="text-xs text-muted-foreground"
                                                            id={`interest-fines-yearly-${type}-description`}
                                                        >
                                                            {type ===
                                                                InterestFinesComputationDiminishingStraightDiminishingYearlyEnum.None &&
                                                                'No specific advanced computation method.'}
                                                            {type ===
                                                                InterestFinesComputationDiminishingStraightDiminishingYearlyEnum.ByDailyOnInterestBasedOnLoanBalanceByYearPrincipalInterestAmortizationFinesFinesGracePeriodMonthEndAmortization &&
                                                                'Interest calculated daily based on loan balance by year with adjustable principal.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </GradientBackground>
                            )}
                        />
                    </fieldset>
                    <div className="md:w-full">
                        {selectedItem === AccountTypeEnum.Deposit && (
                            <fieldset className="grid w-full grid-cols-2 gap-x-2">
                                <legend>Deposit</legend>
                                <FormFieldWrapper
                                    className="grow"
                                    control={form.control}
                                    label="Min Amount"
                                    name="minAmount"
                                    render={({ field }) => (
                                        <div className="flex grow flex-col gap-y-2">
                                            <Input
                                                {...field}
                                                disabled={
                                                    isDisabled(field.name) ||
                                                    isLoading
                                                }
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === ''
                                                            ? undefined
                                                            : parseFloat(
                                                                  e.target.value
                                                              )
                                                    )
                                                }
                                                placeholder="Min Amount"
                                                value={field.value ?? ''}
                                            />
                                        </div>
                                    )}
                                />
                                <FormFieldWrapper
                                    className="grow"
                                    control={form.control}
                                    label="Max Amount"
                                    name="maxAmount"
                                    render={({ field }) => (
                                        <div className="flex grow flex-col gap-y-2">
                                            <Input
                                                {...field}
                                                disabled={
                                                    isDisabled(field.name) ||
                                                    isLoading
                                                }
                                                onChange={(e) =>
                                                    field.onChange(
                                                        e.target.value === ''
                                                            ? undefined
                                                            : parseFloat(
                                                                  e.target.value
                                                              )
                                                    )
                                                }
                                                placeholder="Max Amount"
                                                value={field.value ?? ''}
                                            />
                                        </div>
                                    )}
                                />
                            </fieldset>
                        )}
                        {selectedItem === AccountTypeEnum.Loan && (
                            <fieldset className="flex flex-col gap-2">
                                <legend>Loan</legend>
                                <FormFieldWrapper
                                    className="col-span-4"
                                    control={form.control}
                                    label="Computation type"
                                    name="computation_type"
                                    render={({ field }) => (
                                        <FormControl>
                                            <Select
                                                defaultValue={
                                                    field.value || undefined
                                                }
                                                disabled={
                                                    isDisabled(field.name) ||
                                                    isLoading
                                                }
                                                onValueChange={(
                                                    selectedValue
                                                ) => {
                                                    field.onChange(
                                                        selectedValue
                                                    )
                                                }}
                                            >
                                                <SelectTrigger className="w-full">
                                                    {field.value ||
                                                        'select Computation Type'}
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {Object.values(
                                                        ComputationTypeEnum
                                                    ).map((account) => {
                                                        return (
                                                            <SelectItem
                                                                key={account}
                                                                value={account}
                                                            >
                                                                {account}
                                                            </SelectItem>
                                                        )
                                                    })}
                                                </SelectContent>
                                            </Select>
                                        </FormControl>
                                    )}
                                />
                                <FormFieldWrapper
                                    className="col-span-4"
                                    control={form.control}
                                    disabled={isLoading}
                                    label="Computation Sheet/Scheme"
                                    name="computation_sheet_id"
                                    render={({ field }) => (
                                        <ComputationSheetCombobox
                                            onChange={(computationSheet) =>
                                                field.onChange(
                                                    computationSheet.id
                                                )
                                            }
                                            value={
                                                field.value
                                                    ? String(field.value)
                                                    : undefined
                                            }
                                        />
                                    )}
                                />
                                <div className="grid grid-cols-4 gap-2">
                                    <FormFieldWrapper
                                        className="grow"
                                        control={form.control}
                                        disabled={isLoading}
                                        label="Fines Amortization"
                                        name="fines_amort"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ''
                                                                ? undefined
                                                                : parseFloat(
                                                                      e.target
                                                                          .value
                                                                  )
                                                        )
                                                    }
                                                    placeholder="Fines Amortization"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="grow"
                                        control={form.control}
                                        disabled={isLoading}
                                        label="Fines Maturity"
                                        name="fines_maturity"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ''
                                                                ? undefined
                                                                : parseFloat(
                                                                      e.target
                                                                          .value
                                                                  )
                                                        )
                                                    }
                                                    placeholder="Fines Maturity"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="grow"
                                        control={form.control}
                                        disabled={isLoading}
                                        label="Interest Standard"
                                        name="interest_standard"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ''
                                                                ? undefined
                                                                : parseFloat(
                                                                      e.target
                                                                          .value
                                                                  )
                                                        )
                                                    }
                                                    placeholder="Interest Standard"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="grow"
                                        control={form.control}
                                        disabled={isLoading}
                                        label="Interest Secured"
                                        name="interest_secured"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ''
                                                                ? undefined
                                                                : parseFloat(
                                                                      e.target
                                                                          .value
                                                                  )
                                                        )
                                                    }
                                                    placeholder="Interest Secured"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="col-span-2"
                                        control={form.control}
                                        disabled={isLoading}
                                        label="Fines Grace Period Maturity (Days)"
                                        name="fines_grace_period_maturity"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ''
                                                                ? undefined
                                                                : parseInt(
                                                                      e.target
                                                                          .value,
                                                                      10
                                                                  )
                                                        )
                                                    }
                                                    placeholder="Fines Grace Period Maturity"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        disabled={isLoading}
                                        label="Yearly Subscription Fee"
                                        name="yearly_subscription_fee"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ''
                                                                ? undefined
                                                                : parseFloat(
                                                                      e.target
                                                                          .value
                                                                  )
                                                        )
                                                    }
                                                    placeholder="Yearly Subscription Fee"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        disabled={isLoading}
                                        label="Loan Cut-Off Days"
                                        name="loan_cut_off_days"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onChange={(e) =>
                                                        field.onChange(
                                                            e.target.value ===
                                                                ''
                                                                ? undefined
                                                                : parseInt(
                                                                      e.target
                                                                          .value,
                                                                      10
                                                                  )
                                                        )
                                                    }
                                                    placeholder="Loan Cut-Off Days"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className="col-span-4"
                                        control={form.control}
                                        label="Interest Standard Computation"
                                        name="interest_standard_computation"
                                        render={({ field }) => (
                                            <FormControl>
                                                <Select
                                                    defaultValue={
                                                        field.value || undefined
                                                    }
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onValueChange={(
                                                        selectedValue
                                                    ) => {
                                                        field.onChange(
                                                            selectedValue
                                                        )
                                                    }}
                                                >
                                                    <SelectTrigger className="w-full">
                                                        {field.value ||
                                                            'select Computation Type'}
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {ACCOUNT_INTEREST_STANDARD_COMPUTATION.map(
                                                            (
                                                                interestComputation
                                                            ) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={
                                                                            interestComputation
                                                                        }
                                                                        value={
                                                                            interestComputation
                                                                        }
                                                                    >
                                                                        {
                                                                            interestComputation
                                                                        }
                                                                    </SelectItem>
                                                                )
                                                            }
                                                        )}
                                                    </SelectContent>
                                                </Select>
                                            </FormControl>
                                        )}
                                    />
                                </div>
                                <FormFieldWrapper
                                    className="col-span-2"
                                    control={form.control}
                                    label="Earned/Unearned Interest Calculation"
                                    name="earned_unearned_interest"
                                    render={({ field }) => (
                                        <GradientBackground
                                            className="p-5"
                                            gradientOnly
                                        >
                                            <RadioGroup
                                                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                                disabled={
                                                    isDisabled(field.name) ||
                                                    isLoading
                                                }
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                {Object.values(
                                                    EarnedUnearnedInterestEnum
                                                ).map((type) => (
                                                    <div
                                                        className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                        key={type}
                                                    >
                                                        <RadioGroupItem
                                                            className="order-1 after:absolute after:inset-0"
                                                            id={`earned-unearned-${type}`}
                                                            value={type}
                                                        />
                                                        <div className="flex grow items-center gap-3">
                                                            <div className="grid gap-2">
                                                                <Label
                                                                    htmlFor={`earned-unearned-${type}`}
                                                                >
                                                                    {type}
                                                                </Label>
                                                                <p
                                                                    className="text-xs text-muted-foreground"
                                                                    id={`earned-unearned-${type}-description`}
                                                                >
                                                                    {type ===
                                                                        EarnedUnearnedInterestEnum.None &&
                                                                        'No specific method for earned/unearned interest.'}
                                                                    {type ===
                                                                        EarnedUnearnedInterestEnum.ByFormula &&
                                                                        'Earned/unearned interest is calculated by formula.'}
                                                                    {type ===
                                                                        EarnedUnearnedInterestEnum.ByAdvanceInterestActualPay &&
                                                                        'Earned/unearned interest is based on advance interest plus actual payments.'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </GradientBackground>
                                    )}
                                />

                                {/* --- Loan Saving Type Field --- */}
                                <FormFieldWrapper
                                    className="col-span-2"
                                    control={form.control}
                                    label="Loan/Saving Ledger Type"
                                    name="loan_saving_type"
                                    render={({ field }) => (
                                        <GradientBackground
                                            className="p-5"
                                            gradientOnly
                                        >
                                            <RadioGroup
                                                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                                disabled={
                                                    isDisabled(field.name) ||
                                                    isLoading
                                                }
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                {Object.values(
                                                    LoanSavingTypeEnum
                                                ).map((type) => (
                                                    <div
                                                        className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                        key={type}
                                                    >
                                                        <RadioGroupItem
                                                            className="order-1 after:absolute after:inset-0"
                                                            id={`loan-saving-${type}`}
                                                            value={type}
                                                        />
                                                        <div className="flex grow items-center gap-3">
                                                            <div className="grid gap-2">
                                                                <Label
                                                                    htmlFor={`loan-saving-${type}`}
                                                                >
                                                                    {type}
                                                                </Label>
                                                                <p
                                                                    className="text-xs text-muted-foreground"
                                                                    id={`loan-saving-${type}-description`}
                                                                >
                                                                    {type ===
                                                                        LoanSavingTypeEnum.Separate &&
                                                                        'Loans and savings are managed in separate ledgers.'}
                                                                    {type ===
                                                                        LoanSavingTypeEnum.SingleLedger &&
                                                                        'Loans and savings are managed in a single combined ledger.'}
                                                                    {type ===
                                                                        LoanSavingTypeEnum.SingleLedgerIfNotZero &&
                                                                        'Loans and savings are managed in a single ledger with semi-monthly (15/30) entries.'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </GradientBackground>
                                    )}
                                />

                                {/* --- Interest Deduction Field --- */}
                                <FormFieldWrapper
                                    className="col-span-2"
                                    control={form.control}
                                    label="Interest Deduction Method"
                                    name="interest_deduction"
                                    render={({ field }) => (
                                        <GradientBackground
                                            className="p-5"
                                            gradientOnly
                                        >
                                            <RadioGroup
                                                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                                disabled={isLoading}
                                                onValueChange={field.onChange}
                                                value={field.value}
                                            >
                                                {Object.values(
                                                    InterestDeductionEnum
                                                ).map((type) => (
                                                    <div
                                                        className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                        key={type}
                                                    >
                                                        <RadioGroupItem
                                                            className="order-1 after:absolute after:inset-0"
                                                            id={`interest-deduction-${type}`}
                                                            value={type}
                                                        />
                                                        <div className="flex grow items-center gap-3">
                                                            <div className="grid gap-2">
                                                                <Label
                                                                    htmlFor={`interest-deduction-${type}`}
                                                                >
                                                                    {type}
                                                                </Label>
                                                                <p
                                                                    className="text-xs text-muted-foreground"
                                                                    id={`interest-deduction-${type}-description`}
                                                                >
                                                                    {type ===
                                                                        InterestDeductionEnum.Above &&
                                                                        'Interest is deducted from the amount above the principal.'}
                                                                    {type ===
                                                                        InterestDeductionEnum.Below &&
                                                                        'Interest is deducted from the amount below the principal.'}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        </GradientBackground>
                                    )}
                                />
                            </fieldset>
                        )}
                        <fieldset className="my-5 flex flex-col gap-y-2">
                            <legend className="text-primary">Other</legend>
                            <FormFieldWrapper
                                className="col-span-4"
                                control={form.control}
                                label="General Ledger Type *"
                                name="general_ledger_type"
                                render={({ field }) => (
                                    <FormControl>
                                        <Select
                                            defaultValue={field.value}
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            onValueChange={(selectedValue) => {
                                                field.onChange(selectedValue)
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                {field.value ||
                                                    'select General Ledger Type'}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(
                                                    GeneralLedgerTypeEnum
                                                ).map((account) => {
                                                    return (
                                                        <SelectItem
                                                            key={account}
                                                            value={account}
                                                        >
                                                            {account}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-4"
                                control={form.control}
                                label="Financial Statement Type *"
                                name="financial_statement_type"
                                render={({ field }) => (
                                    <FormControl>
                                        <Select
                                            defaultValue={field.value}
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            onValueChange={(selectedValue) => {
                                                field.onChange(selectedValue)
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                {field.value ||
                                                    'select Financial Statement Type'}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {Object.values(
                                                    FinancialStatementTypeEnum
                                                ).map((account) => {
                                                    return (
                                                        <SelectItem
                                                            key={account}
                                                            value={account}
                                                        >
                                                            {account}
                                                        </SelectItem>
                                                    )
                                                })}
                                            </SelectContent>
                                        </Select>
                                    </FormControl>
                                )}
                            />
                            <div className="grid w-full grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-2 md:gap-y-0">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="general_ledger_grouping_exclude_account"
                                    render={({ field }) => {
                                        return (
                                            <GradientBackground gradientOnly>
                                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                    <Checkbox
                                                        aria-describedby={`${field.name}`}
                                                        checked={field.value}
                                                        className="order-1 after:absolute after:inset-0"
                                                        disabled={
                                                            isDisabled(
                                                                field.name
                                                            ) || isLoading
                                                        }
                                                        id={field.name}
                                                        name={field.name}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="size-fit rounded-full bg-secondary p-2">
                                                            <ExcludeIcon />
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor={
                                                                    field.name
                                                                }
                                                            >
                                                                Exclude general
                                                                ledger grouping
                                                            </Label>
                                                            <p
                                                                className="text-xs text-muted-foreground"
                                                                id={`${field.name}`}
                                                            >
                                                                Exclude the
                                                                General ledger
                                                                Grouping.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </GradientBackground>
                                        )
                                    }}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    name="number_grace_period_daily"
                                    render={({ field }) => {
                                        return (
                                            <GradientBackground gradientOnly>
                                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                    <Checkbox
                                                        aria-describedby={`${field.name}`}
                                                        checked={field.value}
                                                        className="order-1 after:absolute after:inset-0"
                                                        disabled={
                                                            isDisabled(
                                                                field.name
                                                            ) || isLoading
                                                        }
                                                        id={field.name}
                                                        name={field.name}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="size-fit rounded-full bg-secondary p-2">
                                                            <FaCalendarCheckIcon />{' '}
                                                        </div>
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor={
                                                                    field.name
                                                                }
                                                            >
                                                                Number Grace
                                                                Period Daily
                                                            </Label>
                                                            <p
                                                                className="text-xs text-muted-foreground"
                                                                id={`${field.name}`}
                                                            >
                                                                Enable daily
                                                                grace period
                                                                calculation.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </GradientBackground>
                                        )
                                    }}
                                />
                            </div>

                            {/* --- Lumpsum Computation Type Field --- */}
                            <FormFieldWrapper
                                className="col-span-2"
                                control={form.control}
                                label="Select Lumpsum Computation Type"
                                name="lumpsum_computation_type"
                                render={({ field }) => (
                                    <GradientBackground
                                        className="p-5"
                                        gradientOnly
                                    >
                                        <RadioGroup
                                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {Object.values(
                                                LumpsumComputationTypeEnum
                                            ).map((type) => (
                                                <div
                                                    className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                    key={type}
                                                >
                                                    <RadioGroupItem
                                                        className="order-1 after:absolute after:inset-0"
                                                        id={`lumpsum-type-${type}`}
                                                        value={type}
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor={`lumpsum-type-${type}`}
                                                            >
                                                                {type}
                                                            </Label>
                                                            <p
                                                                className="text-xs text-muted-foreground"
                                                                id={`lumpsum-type-${type}-description`}
                                                            >
                                                                {type ===
                                                                    LumpsumComputationTypeEnum.None &&
                                                                    'No specific lumpsum computation will be applied.'}
                                                                {type ===
                                                                    LumpsumComputationTypeEnum.ComputeFinesMaturity &&
                                                                    'Calculates lumpsum based on fines maturity.'}
                                                                {type ===
                                                                    LumpsumComputationTypeEnum.ComputeInterestMaturityTerms &&
                                                                    'Calculates lumpsum based on interest maturity or terms.'}
                                                                {type ===
                                                                    LumpsumComputationTypeEnum.ComputeAdvanceInterest &&
                                                                    'Calculates lumpsum based on advance interest.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </GradientBackground>
                                )}
                            />

                            {/* --- Other Deduction Entry Field --- */}
                            <FormFieldWrapper
                                className="col-span-2"
                                control={form.control}
                                label="Other Deduction Entry"
                                name="other_deduction_entry"
                                render={({ field }) => (
                                    <GradientBackground
                                        className="p-5"
                                        gradientOnly
                                    >
                                        <RadioGroup
                                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {Object.values(
                                                OtherDeductionEntryEnum
                                            ).map((type) => (
                                                <div
                                                    className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                    key={type}
                                                >
                                                    <RadioGroupItem
                                                        className="order-1 after:absolute after:inset-0"
                                                        id={`other-deduction-${type}`}
                                                        value={type}
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor={`other-deduction-${type}`}
                                                            >
                                                                {type}
                                                            </Label>
                                                            <p
                                                                className="text-xs text-muted-foreground"
                                                                id={`other-deduction-${type}-description`}
                                                            >
                                                                {type ===
                                                                    OtherDeductionEntryEnum.None &&
                                                                    'No additional deductions will be applied.'}
                                                                {type ===
                                                                    OtherDeductionEntryEnum.HealthCare &&
                                                                    'Allows for healthcare-related deductions.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </GradientBackground>
                                )}
                            />

                            {/* --- Interest Saving Type Diminishing Straight Field --- */}
                            <FormFieldWrapper
                                className="col-span-2"
                                control={form.control}
                                label="Interest Saving Type (Diminishing/Straight)"
                                name="interest_saving_type_diminishing_straight"
                                render={({ field }) => (
                                    <GradientBackground
                                        className="p-5"
                                        gradientOnly
                                    >
                                        <RadioGroup
                                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {Object.values(
                                                InterestSavingTypeDiminishingStraightEnum
                                            ).map((type) => (
                                                <div
                                                    className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                    key={type}
                                                >
                                                    <RadioGroupItem
                                                        className="order-1 after:absolute after:inset-0"
                                                        id={`interest-saving-type-${type}`}
                                                        value={type}
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor={`interest-saving-type-${type}`}
                                                            >
                                                                {type}
                                                            </Label>
                                                            <p
                                                                className="text-xs text-muted-foreground"
                                                                id={`interest-saving-type-${type}-description`}
                                                            >
                                                                {type ===
                                                                    InterestSavingTypeDiminishingStraightEnum.Spread &&
                                                                    'Interest savings are spread across payments.'}
                                                                {type ===
                                                                    InterestSavingTypeDiminishingStraightEnum.FirstPayment &&
                                                                    'Interest savings are applied to the first payment.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </GradientBackground>
                                )}
                            />

                            {/* --- Other Information Of An Account Field --- */}
                            <FormFieldWrapper
                                className="col-span-2"
                                control={form.control}
                                label="Other Account Information / Classification"
                                name="other_information_of_an_account"
                                render={({ field }) => (
                                    <GradientBackground
                                        className="p-5"
                                        gradientOnly
                                        opacity={0.03}
                                    >
                                        <RadioGroup
                                            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            onValueChange={field.onChange}
                                            value={field.value}
                                        >
                                            {Object.values(
                                                OtherInformationOfAnAccountEnum
                                            ).map((type) => (
                                                <div
                                                    className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                    key={type}
                                                >
                                                    <RadioGroupItem
                                                        className="order-1 after:absolute after:inset-0"
                                                        id={`other-info-${type}`}
                                                        value={type}
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor={`other-info-${type}`}
                                                            >
                                                                {type}
                                                            </Label>
                                                            <p
                                                                className="text-xs text-muted-foreground"
                                                                id={`other-info-${type}-description`}
                                                            >
                                                                {type ===
                                                                    OtherInformationOfAnAccountEnum.None &&
                                                                    'No other specific information is assigned.'}
                                                                {type ===
                                                                    OtherInformationOfAnAccountEnum.Jewelry &&
                                                                    'This account is related to jewelry.'}
                                                                {type ===
                                                                    OtherInformationOfAnAccountEnum.Grocery &&
                                                                    'This account is related to groceries.'}
                                                                {type ===
                                                                    OtherInformationOfAnAccountEnum.Restructured &&
                                                                    'This account has been restructured.'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </RadioGroup>
                                    </GradientBackground>
                                )}
                            />
                        </fieldset>

                        <div className="space-y-2">
                            <h4 className="text-sm font-medium text-muted-foreground">
                                Compassion Fund (Damayan)
                            </h4>
                            <div className="grid w-full grid-cols-1 gap-x-2 gap-y-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="compassion_fund"
                                    render={({ field }) => (
                                        <GradientBackground gradientOnly>
                                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                <Checkbox
                                                    checked={field.value}
                                                    className="order-1 after:absolute after:inset-0"
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    id={field.name}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="size-fit rounded-full bg-secondary p-2">
                                                        <MoneyBagIcon className="size-4" />
                                                    </div>
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={field.name}
                                                        >
                                                            Enable Compassion
                                                            Fund
                                                        </Label>
                                                        <p className="text-xs text-muted-foreground">
                                                            Enable compassion
                                                            fund (damayan) for
                                                            this account
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </GradientBackground>
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Compassion Fund Amount"
                                    name="compassion_fund_amount"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading ||
                                                !isCompassionFundEnabled
                                            }
                                            min="0"
                                            onChange={(e) =>
                                                field.onChange(
                                                    e.target.value === ''
                                                        ? 0
                                                        : parseFloat(
                                                              e.target.value
                                                          )
                                                )
                                            }
                                            placeholder="Enter compassion fund amount"
                                            step="0.01"
                                            type="number"
                                            value={field.value ?? ''}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">
                        General Ledger Source Visibility
                    </h4>
                    <div className="grid w-full grid-cols-1 gap-x-2 gap-y-2 md:grid-cols-2 lg:grid-cols-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="show_in_general_ledger_source_withdraw"
                            render={({ field }) => (
                                <GradientBackground gradientOnly>
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <HandCoinsIcon className="size-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Show in Withdraw
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Show this account in
                                                    withdraw transactions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="show_in_general_ledger_source_deposit"
                            render={({ field }) => (
                                <GradientBackground gradientOnly>
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <MoneyIcon className="size-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Show in Deposit
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Show this account in deposit
                                                    transactions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="show_in_general_ledger_source_journal"
                            render={({ field }) => (
                                <GradientBackground gradientOnly>
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <InternalIcon className="size-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Show in Journal
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Show this account in journal
                                                    entries
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="show_in_general_ledger_source_payment"
                            render={({ field }) => (
                                <GradientBackground gradientOnly>
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <MoneyBagIcon className="size-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Show in Payment
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Show this account in payment
                                                    transactions
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="show_in_general_ledger_source_adjustment"
                            render={({ field }) => (
                                <GradientBackground gradientOnly>
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <ExcludeIcon className="size-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Show in Adjustment
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Show this account in
                                                    adjustment entries
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="show_in_general_ledger_source_journal_voucher"
                            render={({ field }) => (
                                <GradientBackground gradientOnly>
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <InternalIcon className="size-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Show in Journal Voucher
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Show this account in journal
                                                    vouchers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="show_in_general_ledger_source_check_voucher"
                            render={({ field }) => (
                                <GradientBackground gradientOnly>
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                        <Checkbox
                                            checked={field.value}
                                            className="order-1 after:absolute after:inset-0"
                                            disabled={
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            id={field.name}
                                            onCheckedChange={field.onChange}
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <FaCalendarCheckIcon className="size-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Show in Check Voucher
                                                </Label>
                                                <p className="text-xs text-muted-foreground">
                                                    Show this account in check
                                                    vouchers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />
                    </div>
                </div>

                {!formProps.readOnly && (
                    <div className="space-y-2 sticky bottom-0">
                        <div className="flex items-center justify-end gap-x-2">
                            <Button
                                className="w-full self-end px-8 sm:w-fit"
                                disabled={isLoading}
                                onClick={() => {
                                    form.reset()
                                }}
                                size="sm"
                                type="button"
                                variant="ghost"
                            >
                                Reset
                            </Button>
                            <Button
                                className=""
                                disabled={isLoading}
                                type="submit"
                            >
                                {isLoading ? (
                                    <div className="flex space-x-2">
                                        {accountId ? 'updating ' : 'Creating '}{' '}
                                        <LoadingSpinnerIcon
                                            className="ml-2 animate-spin"
                                            size={18}
                                        />
                                    </div>
                                ) : (
                                    `${accountId ? 'Update' : 'Create'} Account `
                                )}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export const AccountCreateUpdateFormModal = ({
    title = 'Create Account',
    description = 'Fill out the form to add a new account',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAccountCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('!max-w-[95vw]', className)}
            description={description}
            title={title}
            {...props}
        >
            <AccountCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AccountCreateUpdateFormModal
