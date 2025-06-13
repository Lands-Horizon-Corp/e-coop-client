import { z } from 'zod'
import { cn } from '@/lib'
import { useState } from 'react'

import {
    ExcludeIcon,
    FaCalendarCheckIcon,
    InternalIcon,
    LoadingSpinnerIcon,
    MoneyBagIcon,
    MoneyIcon,
} from '@/components/icons'

import {
    IAccountRequestSchema,
    AccountExclusiveSettingTypeEnum,
} from '@/validations/accounting/account-schema'

import { Path, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateAccount } from '@/hooks/api-hooks/use-account'
import { useAuthUserWithOrgBranch } from '@/store/user-auth-store'

import {
    IAccount,
    IAccountRequest,
    AccountTypeEnum,
    LoanSavingTypeEnum,
    ComputationTypeEnum,
    InterestDeductionEnum,
    GeneralLedgerTypeEnum,
    OtherDeductionEntryEnum,
    LumpsumComputationTypeEnum,
    FinancialStatementTypeEnum,
    EarnedUnearnedInterestEnum,
    OtherInformationOfAnAccountEnum,
    InterestFinesComputationDiminishingEnum,
    InterestSavingTypeDiminishingStraightEnum,
    InterestFinesComputationDiminishingStraightDiminishingYearlyEnum,
} from '@/types/coop-types/accounts/account'
import { IClassProps, IForm, TEntityId } from '@/types'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Checkbox } from '@/components/ui/checkbox'
import { Form, FormControl } from '@/components/ui/form'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import FormErrorMessage from '@/components/ui/form-error-message'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import AccountCategoryPicker from '@/components/pickers/account-category-picker'
import MemberTypePicker from '@/components/pickers/account-classification-picker'
import { GradientBackground } from '@/components/gradient-background/gradient-background'
import AccountClassificationPicker from '@/components/pickers/account-classification-picker'

type TAccountFormValues = z.infer<typeof IAccountRequestSchema>

interface IAccountCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<IAccountRequest>, IAccount, string, TAccountFormValues> {
    accountId?: TEntityId
}

const AccountCreateUpdateForm = ({
    defaultValues,
    className,
    readOnly,
    disabledFields,
    accountId,
}: IAccountCreateUpdateFormProps) => {
    const { currentAuth } = useAuthUserWithOrgBranch()
    const organizationId = currentAuth.user_organization.organization_id
    const branchId = currentAuth.user_organization.branch_id

    const [selectedItem, setSelectedItem] = useState('Deposit')
    type TAccountFormValues = z.infer<typeof IAccountRequestSchema>

    const form = useForm<TAccountFormValues>({
        resolver: zodResolver(IAccountRequestSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            type: AccountTypeEnum.Deposit,
            ...defaultValues,
        },
    })

    const isDisabled = (field: Path<TAccountFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const { mutate: createAccount, isPending, error } = useCreateAccount()

    const isLoading = isPending

    const handleSubmit = form.handleSubmit((data: TAccountFormValues) => {
        const request = {
            branch_id: branchId,
            organization_id: organizationId,
            ...data,
        }
        createAccount(request)
    })

    return (
        <Form {...form}>
            <form onSubmit={handleSubmit} className={cn('w-full', className)}>
                <FormErrorMessage errorMessage={error} />
                <div className="flex w-full flex-col gap-5 md:flex-row">
                    <fieldset
                        disabled={readOnly}
                        className="space-y-3 md:w-[80%]"
                    >
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Account Name *"
                            disabled={isLoading}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Account Name"
                                    autoComplete="off"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="alternative_code"
                            label="Alternative Code"
                            disabled={isLoading}
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Account Name"
                                    autoComplete="off"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="account_classification_id"
                            label="Account Classification"
                            render={({ field }) => (
                                <AccountClassificationPicker
                                    {...field}
                                    onSelect={(selectedAccountClassification) =>
                                        field.onChange(
                                            selectedAccountClassification.id
                                        )
                                    }
                                    placeholder="Select Account Classification"
                                    disabled={
                                        isDisabled(field.name) || isLoading
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="account_category_id"
                            label="Account Category"
                            disabled={isLoading}
                            render={({ field }) => (
                                <AccountCategoryPicker
                                    {...field}
                                    onSelect={(selectedAccountCategory) =>
                                        field.onChange(
                                            selectedAccountCategory.id
                                        )
                                    }
                                    placeholder="Select Account Category"
                                    disabled={
                                        isDisabled(field.name) || isLoading
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="member_type_id"
                            label="Member Type *"
                            disabled={isLoading}
                            render={({ field }) => (
                                <MemberTypePicker
                                    {...field}
                                    onSelect={(selectedMemberType) =>
                                        field.onChange(selectedMemberType.id)
                                    }
                                    placeholder="Select Member Type"
                                    disabled={
                                        isDisabled(field.name) || isLoading
                                    }
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Account type"
                            name="type"
                            className="col-span-4"
                            disabled={isLoading}
                            render={({ field }) => (
                                <FormControl>
                                    <Select
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        onValueChange={(selectedValue) => {
                                            field.onChange(selectedValue)
                                            setSelectedItem(selectedValue)
                                        }}
                                        defaultValue={field.value}
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
                            label="Account Description *"
                            name="description"
                            className="col-span-4"
                            render={({ field }) => {
                                const { ref: _ref, ...rest } = field
                                return (
                                    <TextEditor
                                        {...rest}
                                        content={field.value ?? ''}
                                        disabled={isLoading}
                                        textEditorClassName="!max-w-none !h-32"
                                        placeholder="Write some description about the account..."
                                    />
                                )
                            }}
                        />
                        <div className="">
                            <FormFieldWrapper
                                control={form.control}
                                name="account_exclusive_setting_type"
                                className=""
                                render={({ field }) => (
                                    <>
                                        {/* Checkbox for Is Internal */}
                                        <GradientBackground gradientOnly>
                                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                <Checkbox
                                                    disabled={isLoading}
                                                    id="is_internal_checkbox"
                                                    checked={
                                                        field.value ===
                                                        AccountExclusiveSettingTypeEnum.IsInternal
                                                    }
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        field.onChange(
                                                            checked
                                                                ? AccountExclusiveSettingTypeEnum.IsInternal
                                                                : AccountExclusiveSettingTypeEnum.None
                                                        )
                                                    }
                                                    name={field.name}
                                                    className="order-1 after:absolute after:inset-0"
                                                    aria-describedby="is_internal_description"
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
                                                            id="is_internal_description"
                                                            className="text-xs text-muted-foreground"
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
                                                    id="cash_on_hand_checkbox"
                                                    checked={
                                                        field.value ===
                                                        AccountExclusiveSettingTypeEnum.CashOnHand
                                                    }
                                                    disabled={isLoading}
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        field.onChange(
                                                            checked
                                                                ? AccountExclusiveSettingTypeEnum.CashOnHand
                                                                : AccountExclusiveSettingTypeEnum.None
                                                        )
                                                    }
                                                    name={field.name}
                                                    className="order-1 after:absolute after:inset-0"
                                                    aria-describedby="cash_on_hand_description"
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
                                                            id="cash_on_hand_description"
                                                            className="text-xs text-muted-foreground"
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
                                                    disabled={isLoading}
                                                    id="paid_up_share_capital_checkbox"
                                                    checked={
                                                        field.value ===
                                                        AccountExclusiveSettingTypeEnum.PaidUpShareCapital
                                                    }
                                                    onCheckedChange={(
                                                        checked: boolean
                                                    ) =>
                                                        field.onChange(
                                                            checked
                                                                ? AccountExclusiveSettingTypeEnum.PaidUpShareCapital
                                                                : AccountExclusiveSettingTypeEnum.None
                                                        )
                                                    }
                                                    name={field.name}
                                                    className="order-1 after:absolute after:inset-0"
                                                    aria-describedby="paid_up_share_capital_description"
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
                                                            id="paid_up_share_capital_description"
                                                            className="text-xs text-muted-foreground"
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
                                control={form.control}
                                label="Header Row"
                                name="header_row"
                                className="grow"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <div className="flex grow flex-col gap-y-2">
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
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
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Center Row"
                                name="center_row"
                                className="grow"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <div className="flex grow flex-col gap-y-2">
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
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
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Total Row"
                                name="total_row"
                                className="grow"
                                disabled={isLoading}
                                render={({ field }) => (
                                    <div className="flex grow flex-col gap-y-2">
                                        <Input
                                            {...field}
                                            value={field.value ?? ''}
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
                                        />
                                    </div>
                                )}
                            />
                        </fieldset>
                        <FormFieldWrapper
                            control={form.control}
                            name="interest_fines_computation_diminishing"
                            label="Diminishing Balance Computation Method"
                            className="col-span-2"
                            render={({ field }) => (
                                <GradientBackground
                                    gradientOnly
                                    className="p-5"
                                >
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        disabled={isLoading}
                                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                    >
                                        {Object.values(
                                            InterestFinesComputationDiminishingEnum
                                        ).map((type) => (
                                            <div
                                                key={type}
                                                className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                            >
                                                <RadioGroupItem
                                                    value={type}
                                                    id={`interest-fines-diminishing-${type}`}
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`interest-fines-diminishing-${type}`}
                                                        >
                                                            {type}
                                                        </Label>
                                                        <p
                                                            id={`interest-fines-diminishing-${type}-description`}
                                                            className="text-xs text-muted-foreground"
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
                            control={form.control}
                            name="interest_fines_computation_diminishing_straight_diminishing_yearly"
                            label="Detailed Diminishing/Straight/Yearly Computation"
                            className="col-span-2"
                            render={({ field }) => (
                                <GradientBackground
                                    gradientOnly
                                    opacity={0.03}
                                    className="p-5"
                                >
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 gap-4"
                                        disabled={isLoading}
                                    >
                                        {Object.values(
                                            InterestFinesComputationDiminishingStraightDiminishingYearlyEnum
                                        ).map((type) => (
                                            <div
                                                key={type}
                                                className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                            >
                                                <RadioGroupItem
                                                    value={type}
                                                    id={`interest-fines-yearly-${type}`}
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`interest-fines-yearly-${type}`}
                                                        >
                                                            {type}
                                                        </Label>
                                                        <p
                                                            id={`interest-fines-yearly-${type}-description`}
                                                            className="text-xs text-muted-foreground"
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
                                    control={form.control}
                                    label="Min Amount"
                                    name="minAmount"
                                    className="grow"
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <div className="flex grow flex-col gap-y-2">
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
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
                                            />
                                        </div>
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Max Amount"
                                    name="maxAmount"
                                    className="grow"
                                    disabled={isLoading}
                                    render={({ field }) => (
                                        <div className="flex grow flex-col gap-y-2">
                                            <Input
                                                {...field}
                                                value={field.value ?? ''}
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
                                    control={form.control}
                                    label="Computation type"
                                    name="computation_type"
                                    className="col-span-4"
                                    render={({ field }) => (
                                        <FormControl>
                                            <Select
                                                disabled={isLoading}
                                                onValueChange={(
                                                    selectedValue
                                                ) => {
                                                    field.onChange(
                                                        selectedValue
                                                    )
                                                }}
                                                defaultValue={field.value}
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
                                <div className="grid grid-cols-4 gap-2">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Fines Amortization"
                                        name="fines_amort"
                                        className="grow"
                                        disabled={isLoading}
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
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
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Fines Maturity"
                                        name="fines_maturity"
                                        className="grow"
                                        disabled={isLoading}
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
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
                                                />
                                            </div>
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Interest Standard"
                                        name="interest_standard"
                                        className="grow"
                                        disabled={isLoading}
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
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
                                                />
                                            </div>
                                        )}
                                    />

                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Interest Secured"
                                        name="interest_secured"
                                        className="grow"
                                        disabled={isLoading}
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
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
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="flex flex-col gap-x-2 md:flex-row">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Fines Grace Period Maturity (Days)"
                                        name="fines_grace_period_maturity"
                                        className="w-[120%]"
                                        disabled={isLoading}
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
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
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Yearly Subscription Fee"
                                        name="yearly_subscription_fee"
                                        disabled={isLoading}
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
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
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Loan Cut-Off Days"
                                        name="loan_cut_off_days"
                                        disabled={isLoading}
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
                                                    value={field.value ?? ''}
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
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                                <FormFieldWrapper
                                    control={form.control}
                                    name="earned_unearned_interest"
                                    label="Earned/Unearned Interest Calculation"
                                    className="col-span-2"
                                    render={({ field }) => (
                                        <GradientBackground
                                            gradientOnly
                                            className="p-5"
                                        >
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                                disabled={isLoading}
                                            >
                                                {Object.values(
                                                    EarnedUnearnedInterestEnum
                                                ).map((type) => (
                                                    <div
                                                        key={type}
                                                        className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                    >
                                                        <RadioGroupItem
                                                            value={type}
                                                            id={`earned-unearned-${type}`}
                                                            className="order-1 after:absolute after:inset-0"
                                                        />
                                                        <div className="flex grow items-center gap-3">
                                                            <div className="grid gap-2">
                                                                <Label
                                                                    htmlFor={`earned-unearned-${type}`}
                                                                >
                                                                    {type}
                                                                </Label>
                                                                <p
                                                                    id={`earned-unearned-${type}-description`}
                                                                    className="text-xs text-muted-foreground"
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
                                    control={form.control}
                                    name="loan_saving_type"
                                    label="Loan/Saving Ledger Type"
                                    className="col-span-2"
                                    render={({ field }) => (
                                        <GradientBackground
                                            gradientOnly
                                            className="p-5"
                                        >
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                                disabled={isLoading}
                                            >
                                                {Object.values(
                                                    LoanSavingTypeEnum
                                                ).map((type) => (
                                                    <div
                                                        key={type}
                                                        className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                    >
                                                        <RadioGroupItem
                                                            value={type}
                                                            id={`loan-saving-${type}`}
                                                            className="order-1 after:absolute after:inset-0"
                                                        />
                                                        <div className="flex grow items-center gap-3">
                                                            <div className="grid gap-2">
                                                                <Label
                                                                    htmlFor={`loan-saving-${type}`}
                                                                >
                                                                    {type}
                                                                </Label>
                                                                <p
                                                                    id={`loan-saving-${type}-description`}
                                                                    className="text-xs text-muted-foreground"
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
                                    control={form.control}
                                    name="interest_deduction"
                                    label="Interest Deduction Method"
                                    className="col-span-2"
                                    render={({ field }) => (
                                        <GradientBackground
                                            gradientOnly
                                            className="p-5"
                                        >
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                                disabled={isLoading}
                                            >
                                                {Object.values(
                                                    InterestDeductionEnum
                                                ).map((type) => (
                                                    <div
                                                        key={type}
                                                        className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                    >
                                                        <RadioGroupItem
                                                            value={type}
                                                            id={`interest-deduction-${type}`}
                                                            className="order-1 after:absolute after:inset-0"
                                                        />
                                                        <div className="flex grow items-center gap-3">
                                                            <div className="grid gap-2">
                                                                <Label
                                                                    htmlFor={`interest-deduction-${type}`}
                                                                >
                                                                    {type}
                                                                </Label>
                                                                <p
                                                                    id={`interest-deduction-${type}-description`}
                                                                    className="text-xs text-muted-foreground"
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
                                control={form.control}
                                label="General Ledger Type"
                                name="general_ledger_type"
                                className="col-span-4"
                                render={({ field }) => (
                                    <FormControl>
                                        <Select
                                            onValueChange={(selectedValue) => {
                                                field.onChange(selectedValue)
                                            }}
                                            disabled={isLoading}
                                            defaultValue={field.value}
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
                                control={form.control}
                                label="Financial Statement Type"
                                name="financial_statement_type"
                                className="col-span-4"
                                render={({ field }) => (
                                    <FormControl>
                                        <Select
                                            onValueChange={(selectedValue) => {
                                                field.onChange(selectedValue)
                                            }}
                                            defaultValue={field.value}
                                            disabled={isLoading}
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
                                                        id={field.name}
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        disabled={isLoading}
                                                        name={field.name}
                                                        className="order-1 after:absolute after:inset-0"
                                                        aria-describedby={`${field.name}`}
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
                                                                id={`${field.name}`}
                                                                className="text-xs text-muted-foreground"
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
                                                        id={field.name}
                                                        checked={field.value}
                                                        onCheckedChange={
                                                            field.onChange
                                                        }
                                                        name={field.name}
                                                        disabled={isLoading}
                                                        className="order-1 after:absolute after:inset-0"
                                                        aria-describedby={`${field.name}`}
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
                                                                id={`${field.name}`}
                                                                className="text-xs text-muted-foreground"
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
                            <FormFieldWrapper
                                control={form.control}
                                name="lumpsum_computation_type"
                                label="Select Lumpsum Computation Type"
                                className="col-span-2"
                                render={({ field }) => (
                                    <GradientBackground
                                        gradientOnly
                                        className="p-5"
                                    >
                                        <RadioGroup
                                            value={field.value}
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                        >
                                            {Object.values(
                                                LumpsumComputationTypeEnum
                                            ).map((type) => (
                                                <div
                                                    key={type}
                                                    className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                >
                                                    <RadioGroupItem
                                                        value={type}
                                                        id={`lumpsum-type-${type}`}
                                                        className="order-1 after:absolute after:inset-0"
                                                    />
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="grid gap-2">
                                                            <Label
                                                                htmlFor={`lumpsum-type-${type}`}
                                                            >
                                                                {type}
                                                            </Label>
                                                            <p
                                                                id={`lumpsum-type-${type}-description`}
                                                                className="text-xs text-muted-foreground"
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
                        </fieldset>
                        {/* --- Other Deduction Entry Field --- */}
                        <FormFieldWrapper
                            control={form.control}
                            name="other_deduction_entry"
                            label="Other Deduction Entry"
                            className="col-span-2"
                            render={({ field }) => (
                                <GradientBackground
                                    gradientOnly
                                    className="p-5"
                                >
                                    <RadioGroup
                                        value={field.value}
                                        disabled={isLoading}
                                        onValueChange={field.onChange}
                                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                    >
                                        {Object.values(
                                            OtherDeductionEntryEnum
                                        ).map((type) => (
                                            <div
                                                key={type}
                                                className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                            >
                                                <RadioGroupItem
                                                    value={type}
                                                    id={`other-deduction-${type}`}
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`other-deduction-${type}`}
                                                        >
                                                            {type}
                                                        </Label>
                                                        <p
                                                            id={`other-deduction-${type}-description`}
                                                            className="text-xs text-muted-foreground"
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
                            control={form.control}
                            name="interest_saving_type_diminishing_straight"
                            label="Interest Saving Type (Diminishing/Straight)"
                            className="col-span-2"
                            render={({ field }) => (
                                <GradientBackground
                                    gradientOnly
                                    className="p-5"
                                >
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
                                        disabled={isLoading}
                                    >
                                        {Object.values(
                                            InterestSavingTypeDiminishingStraightEnum
                                        ).map((type) => (
                                            <div
                                                key={type}
                                                className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                            >
                                                <RadioGroupItem
                                                    value={type}
                                                    id={`interest-saving-type-${type}`}
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`interest-saving-type-${type}`}
                                                        >
                                                            {type}
                                                        </Label>
                                                        <p
                                                            id={`interest-saving-type-${type}-description`}
                                                            className="text-xs text-muted-foreground"
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
                            control={form.control}
                            name="other_information_of_an_account"
                            label="Other Account Information / Classification"
                            className="col-span-2"
                            render={({ field }) => (
                                <GradientBackground
                                    gradientOnly
                                    opacity={0.03}
                                    className="p-5"
                                >
                                    <RadioGroup
                                        onValueChange={field.onChange}
                                        value={field.value}
                                        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
                                        disabled={isLoading}
                                    >
                                        {Object.values(
                                            OtherInformationOfAnAccountEnum
                                        ).map((type) => (
                                            <div
                                                key={type}
                                                className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                            >
                                                <RadioGroupItem
                                                    value={type}
                                                    id={`other-info-${type}`}
                                                    className="order-1 after:absolute after:inset-0"
                                                />
                                                <div className="flex grow items-center gap-3">
                                                    <div className="grid gap-2">
                                                        <Label
                                                            htmlFor={`other-info-${type}`}
                                                        >
                                                            {type}
                                                        </Label>
                                                        <p
                                                            id={`other-info-${type}-description`}
                                                            className="text-xs text-muted-foreground"
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
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            disabled={isLoading}
                            onClick={() => {
                                form.reset()
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button type="submit" disabled={isLoading} className="">
                            {isLoading ? (
                                <div className="flex space-x-2">
                                    {accountId ? 'updating ' : 'Creating '}{' '}
                                    <LoadingSpinnerIcon
                                        size={18}
                                        className="ml-2 animate-spin"
                                    />
                                </div>
                            ) : (
                                `${accountId ? 'Update' : 'Create'} Account `
                            )}
                        </Button>
                    </div>
                </div>
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
            title={title}
            description={description}
            className={cn('max-w-[80rem]', className)}
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

export default AccountCreateUpdateForm
