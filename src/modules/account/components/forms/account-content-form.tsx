import { Path, UseFormReturn } from 'react-hook-form'

import ComputationSheetCombobox from '@/modules/computation-sheet/components/computation-sheet-combobox'
import { CurrencyInput } from '@/modules/currency'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import {
    ExcludeIcon,
    FaCalendarCheckIcon,
    HandDepositIcon,
    InternalIcon,
    MoneyBagIcon,
    ReceiveMoneyIcon,
    SettingsIcon,
} from '@/components/icons'
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from '@/components/ui/accordion'
import { Checkbox } from '@/components/ui/checkbox'
import { FormControl } from '@/components/ui/form'
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
import { Switch } from '@/components/ui/switch'

import { ACCOUNT_INTEREST_STANDARD_COMPUTATION } from '../../account.constants'
import {
    AccountTypeEnum,
    ComputationTypeEnum,
    EarnedUnearnedInterestEnum,
    GeneralLedgerTypeEnum,
    InterestDeductionEnum,
    InterestFinesComputationDiminishingEnum,
    InterestFinesComputationDiminishingStraightDiminishingYearlyEnum,
    InterestSavingTypeDiminishingStraightEnum,
    LoanSavingTypeEnum,
    LumpsumComputationTypeEnum,
    OtherDeductionEntryEnum,
    OtherInformationOfAnAccountEnum,
} from '../../account.types'
import { TAccountFormValues } from '../../account.validation'

type AccountContentFormProps = {
    form: UseFormReturn<TAccountFormValues>
    isDisabled: (fieldName: Path<TAccountFormValues>) => boolean
    setSelectedAccountType: (type: AccountTypeEnum) => void
    selectedAccountType: AccountTypeEnum
    isLoading?: boolean
}

const accountExclusiveSetting = [
    {
        name: 'Enable Internal',
        value: 'is_internal',
    },
    {
        name: 'Enable Cash on Hand',
        value: 'cash_on_hand',
    },
    {
        name: 'Enable Paid Up Share Capital',
        value: 'paid_up_share_capital',
    },
]

const AccountContentForm = ({
    form,
    isDisabled,
    setSelectedAccountType,
    selectedAccountType,
    isLoading,
}: AccountContentFormProps) => {
    const isCompassionFundEnabled = form.watch('compassion_fund')
    return (
        <div className="py-2 w-full space-y-2">
            <FormFieldWrapper
                className=" p-2 "
                control={form.control}
                label="Account Type *"
                name="type"
                render={({ field }) => (
                    <RadioGroup
                        className="grid grid-cols-3 ecoop-scroll overflow-y-auto gap-x-2 sm:grid-cols-3 lg:grid-cols-10"
                        disabled={isDisabled(field.name)}
                        onValueChange={(value) => {
                            field.onChange(value)
                            setSelectedAccountType(value as AccountTypeEnum)
                        }}
                        value={field.value}
                    >
                        {Object.values(AccountTypeEnum).map((type) => (
                            <GradientBackground
                                className="rounded-lg hover:cursor-pointer"
                                gradientOnly
                            >
                                <div
                                    className="shadow-xs  relative min-w-fit flex w-full h-10 items-center  gap-2 rounded-lg border  px-2 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                    key={type}
                                >
                                    <RadioGroupItem
                                        className="order-1 has-[:checked]:text-primary after:absolute after:inset-0"
                                        id={`other-info-${type}`}
                                        value={type}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="grid gap-2">
                                            <Label
                                                className=""
                                                htmlFor={`other-info-${type}`}
                                                key={type}
                                            >
                                                {type}
                                            </Label>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        ))}
                    </RadioGroup>
                )}
            />
            <div className="w-full bg-card/50 rounded-3xl ">
                {selectedAccountType === AccountTypeEnum.Deposit && (
                    <div className="flex flex-col gap-y-2 p-5">
                        <h1 className="text-primary text-md font-bold">
                            <HandDepositIcon className="inline-block mr-2 mb-1" />
                            Deposit
                        </h1>
                        <div className="flex-1 flex  items-end gap-x-2">
                            <FormFieldWrapper
                                className="grow"
                                control={form.control}
                                label="Min Amount"
                                name="minAmount"
                                render={({ field: { onChange, ...field } }) => (
                                    <CurrencyInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onValueChange={(newValue) => {
                                            onChange(newValue ?? '')
                                        }}
                                        placeholder="Min Amount"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="grow"
                                control={form.control}
                                label="Max Amount"
                                name="maxAmount"
                                render={({ field: { onChange, ...field } }) => (
                                    <CurrencyInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onValueChange={(newValue = '') => {
                                            onChange(newValue)
                                        }}
                                        placeholder="Max Amount"
                                    />
                                )}
                            />
                        </div>

                        <div className="flex">
                            <div className="flex flex-1 gap-x-2">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="general_ledger_grouping_exclude_account"
                                    render={({ field }) => {
                                        return (
                                            <GradientBackground gradientOnly>
                                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                    <Switch
                                                        aria-describedby={`${field.name}-description`}
                                                        checked={field.value}
                                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                        id={field.name}
                                                        onCheckedChange={(e) =>
                                                            field.onChange(e)
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
                                                    <Switch
                                                        aria-describedby={`${field.name}-description`}
                                                        checked={field.value}
                                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                        id={field.name}
                                                        onCheckedChange={(e) =>
                                                            field.onChange(e)
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
                        </div>
                        <label className=" text-foreground/80 font-medium text-sm">
                            Account Exclusive Settings
                        </label>
                        <div className="w-full flex gap-x-2 ">
                            {accountExclusiveSetting.map((item) => {
                                return (
                                    <FormFieldWrapper
                                        control={form.control}
                                        name={
                                            item.value as Path<TAccountFormValues>
                                        }
                                        render={({ field }) => (
                                            <GradientBackground gradientOnly>
                                                <div
                                                    className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-2
                                                     outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
                                                >
                                                    <div className="flex grow items-center gap-3">
                                                        <div className="size-fit rounded-full bg-secondary p-2">
                                                            <InternalIcon />
                                                        </div>
                                                        <div className="flex-2 grid gap-2">
                                                            <Label
                                                                htmlFor={
                                                                    field.name
                                                                }
                                                            >
                                                                {item.name}
                                                            </Label>
                                                        </div>

                                                        <Switch
                                                            aria-describedby={`${field.name}-description`}
                                                            checked={
                                                                field.value
                                                            }
                                                            className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                            id={field.name}
                                                            onCheckedChange={(
                                                                e
                                                            ) =>
                                                                field.onChange(
                                                                    e
                                                                )
                                                            }
                                                        />
                                                    </div>
                                                </div>
                                            </GradientBackground>
                                        )}
                                    />
                                )
                            })}
                        </div>
                        <FormFieldWrapper
                            className="col-span-1"
                            control={form.control}
                            label="Cash and Cash Equivalence"
                            name="cash_and_cash_equivalence"
                            render={({ field }) => (
                                <div className="relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/20">
                                    <Switch
                                        aria-describedby={`${field.name}-description`}
                                        checked={field.value}
                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                        id={field.name}
                                        onCheckedChange={(e) =>
                                            field.onChange(e)
                                        }
                                    />
                                    <div className="grid grow gap-2">
                                        <Label htmlFor={field.name}>
                                            Cash and Cash Equivalence{' '}
                                        </Label>
                                        <p
                                            className="text-xs text-muted-foreground"
                                            id={`${field.name}-description`}
                                        >
                                            Cash and cash equivalents represent
                                            the company’s funds that are readily
                                            available for use in operations,
                                            payments, or investment without
                                            significant risk of value change.
                                        </p>
                                    </div>
                                </div>
                            )}
                        />
                    </div>
                )}
                {selectedAccountType === AccountTypeEnum.Loan && (
                    <div className="p-5 ">
                        <h1 className="text-primary text-md font-bold">
                            <ReceiveMoneyIcon className="inline-block mr-2 mb-1" />
                            Loan
                        </h1>
                        <div className="grid grid-cols-5 flex-col gap-2">
                            <FormFieldWrapper
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
                                            onValueChange={(selectedValue) => {
                                                field.onChange(selectedValue)
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
                                control={form.control}
                                disabled={isLoading}
                                label="Computation Sheet/Scheme"
                                name="computation_sheet_id"
                                render={({ field }) => (
                                    <ComputationSheetCombobox
                                        onChange={(computationSheet) =>
                                            field.onChange(computationSheet.id)
                                        }
                                        value={
                                            field.value
                                                ? String(field.value)
                                                : undefined
                                        }
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                disabled={isLoading}
                                label="Fines Amortization"
                                name="fines_amort"
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
                                            placeholder="Fines Amortization"
                                            value={field.value ?? ''}
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                disabled={isLoading}
                                label="Fines Maturity"
                                name="fines_maturity"
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
                                            placeholder="Fines Maturity"
                                            value={field.value ?? ''}
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                disabled={isLoading}
                                label="Interest Standard"
                                name="interest_standard"
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
                                            placeholder="Interest Standard"
                                            value={field.value ?? ''}
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                disabled={isLoading}
                                label="Interest Secured"
                                name="interest_secured"
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
                                            placeholder="Interest Secured"
                                            value={field.value ?? ''}
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                disabled={isLoading}
                                label="Fines Grace Period Maturity (Days)"
                                name="fines_grace_period_maturity"
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
                                                        : parseInt(
                                                              e.target.value,
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
                                render={({ field: { onChange, ...field } }) => (
                                    <CurrencyInput
                                        {...field}
                                        disabled={
                                            isDisabled(field.name) || isLoading
                                        }
                                        onValueChange={(newValue = '') => {
                                            onChange(newValue)
                                        }}
                                        placeholder="Yearly Subscription Fee"
                                    />
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
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
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
                                            placeholder="Loan Cut-Off Days"
                                            value={field.value ?? ''}
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
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
                                                isDisabled(field.name) ||
                                                isLoading
                                            }
                                            onValueChange={(selectedValue) => {
                                                field.onChange(selectedValue)
                                            }}
                                        >
                                            <SelectTrigger className="w-full">
                                                {field.value ||
                                                    'select Computation Type'}
                                            </SelectTrigger>
                                            <SelectContent>
                                                {ACCOUNT_INTEREST_STANDARD_COMPUTATION.map(
                                                    (interestComputation) => {
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
                            <FormFieldWrapper
                                className="col-span-5"
                                control={form.control}
                                label="Earned/Unearned Interest Calculation"
                                name="earned_unearned_interest"
                                render={({ field }) => (
                                    <GradientBackground
                                        className="p-2"
                                        gradientOnly
                                    >
                                        <RadioGroup
                                            className="grid grid-cols-1 gap-4 sm:grid-cols-4"
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
                                className="col-span-5"
                                control={form.control}
                                label="Loan/Saving Ledger Type"
                                name="loan_saving_type"
                                render={({ field }) => (
                                    <GradientBackground
                                        className="p-2"
                                        gradientOnly
                                    >
                                        <RadioGroup
                                            className="grid grid-cols-1 gap-4 sm:grid-cols-5"
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
                            <FormFieldWrapper
                                className="col-span-5"
                                control={form.control}
                                label="Diminishing Balance Computation Method"
                                name="interest_fines_computation_diminishing"
                                render={({ field }) => (
                                    <GradientBackground
                                        className="p-2"
                                        gradientOnly
                                    >
                                        <RadioGroup
                                            className="grid grid-cols-1 gap-4 sm:grid-cols-3"
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
                            {/* --- Interest Deduction Field --- */}
                            <FormFieldWrapper
                                className="col-span-2"
                                control={form.control}
                                label="Interest Deduction Method"
                                name="interest_deduction"
                                render={({ field }) => (
                                    <GradientBackground
                                        className="p-2"
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

                            <FormFieldWrapper
                                className="col-span-5"
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
                        </div>
                    </div>
                )}
            </div>
            <Accordion collapsible type="single">
                <AccordionItem
                    className="bg-card/70 rounded-xl"
                    value="account-others-config"
                >
                    <AccordionTrigger className="px-5 hover:no-underline">
                        <div className="flex items-center text-primary gap-2">
                            <SettingsIcon className="size-4" />
                            <span>Other Configuration</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent>
                        <div className="flex w-full  rounded-2xl px-5 flex-col gap-5 md:flex-row">
                            <div className="flex flex-col w-full gap-y-2">
                                <div className="hidden">
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
                                                            'select General Ledger Type'}
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {Object.values(
                                                            GeneralLedgerTypeEnum
                                                        ).map((account) => {
                                                            return (
                                                                <SelectItem
                                                                    key={
                                                                        account
                                                                    }
                                                                    value={
                                                                        account
                                                                    }
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
                                </div>
                                {/* --- Lumpsum Computation Type Field --- */}
                                <div className="grid grid-cols-2 gap-2">
                                    <FormFieldWrapper
                                        className="bg-card col-span-2 p-3 pb-3 rounded-xl"
                                        control={form.control}
                                        label="Select Lumpsum Computation Type"
                                        name="lumpsum_computation_type"
                                        render={({ field }) => (
                                            <RadioGroup
                                                className="grid grid-cols-1 gap-2 sm:grid-cols-4"
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
                                                    <GradientBackground
                                                        gradientOnly
                                                    >
                                                        <div
                                                            className="shadow-xs relative flex w-full h-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
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
                                                    </GradientBackground>
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                    {/* --- Other Deduction Entry Field --- */}
                                    <div className="flex col-span-2 items-center  justify-between space-x-2">
                                        <FormFieldWrapper
                                            className="bg-card p-3 pb-3 rounded-xl"
                                            control={form.control}
                                            label="Other Deduction Entry"
                                            name="other_deduction_entry"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    className="grid grid-cols-1 gap- 2 sm:grid-cols-2"
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    {Object.values(
                                                        OtherDeductionEntryEnum
                                                    ).map((type) => (
                                                        <GradientBackground
                                                            gradientOnly
                                                        >
                                                            <div
                                                                className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
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
                                                                            {
                                                                                type
                                                                            }
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
                                                        </GradientBackground>
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        />
                                        {/* --- Interest Saving Type Diminishing Straight Field --- */}
                                        <FormFieldWrapper
                                            className="bg-card p-3 pb-3 rounded-xl"
                                            control={form.control}
                                            label="Interest Saving Type (Diminishing/Straight)"
                                            name="interest_saving_type_diminishing_straight"
                                            render={({ field }) => (
                                                <RadioGroup
                                                    className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                                                    disabled={
                                                        isDisabled(
                                                            field.name
                                                        ) || isLoading
                                                    }
                                                    onValueChange={
                                                        field.onChange
                                                    }
                                                    value={field.value}
                                                >
                                                    {Object.values(
                                                        InterestSavingTypeDiminishingStraightEnum
                                                    ).map((type) => (
                                                        <GradientBackground
                                                            gradientOnly
                                                        >
                                                            <div
                                                                className="shadow-xs relative h-full flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
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
                                                                            {
                                                                                type
                                                                            }
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
                                                        </GradientBackground>
                                                    ))}
                                                </RadioGroup>
                                            )}
                                        />
                                    </div>
                                    {/* --- Other Information Of An Account Field --- */}
                                    <FormFieldWrapper
                                        className=" col-span-2 bg-card p-3 pb-3 rounded-xl"
                                        control={form.control}
                                        label="Other Account Information / Classification"
                                        name="other_information_of_an_account"
                                        render={({ field }) => (
                                            <RadioGroup
                                                className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
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
                                                    <GradientBackground
                                                        gradientOnly
                                                    >
                                                        <div
                                                            className="shadow-xs relative flex w-full h-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40"
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
                                                    </GradientBackground>
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                    <div className="flex flex-col col-span-2">
                                        <div>
                                            <h4 className="text-sm font-medium text-muted-foreground">
                                                Compassion Fund (Damayan)
                                            </h4>
                                            <FormFieldWrapper
                                                control={form.control}
                                                name="compassion_fund"
                                                render={({ field }) => (
                                                    <GradientBackground
                                                        gradientOnly
                                                    >
                                                        <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                                            <Checkbox
                                                                checked={
                                                                    field.value
                                                                }
                                                                className="order-1 after:absolute after:inset-0"
                                                                disabled={
                                                                    isDisabled(
                                                                        field.name
                                                                    ) ||
                                                                    isLoading
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
                                                                        htmlFor={
                                                                            field.name
                                                                        }
                                                                    >
                                                                        Enable
                                                                        Compassion
                                                                        Fund
                                                                    </Label>
                                                                    <p className="text-xs text-muted-foreground">
                                                                        Enable
                                                                        compassion
                                                                        fund
                                                                        (damayan)
                                                                        for this
                                                                        account
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </GradientBackground>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <FormFieldWrapper
                                                control={form.control}
                                                label="Compassion Fund Amount"
                                                name="compassion_fund_amount"
                                                render={({
                                                    field: {
                                                        onChange,
                                                        ...field
                                                    },
                                                }) => (
                                                    <CurrencyInput
                                                        {...field}
                                                        disabled={
                                                            isDisabled(
                                                                field.name
                                                            ) ||
                                                            isLoading ||
                                                            !isCompassionFundEnabled
                                                        }
                                                        onValueChange={(
                                                            newValue = ''
                                                        ) => {
                                                            onChange(newValue)
                                                        }}
                                                        placeholder="Enter compassion fund amount"
                                                    />
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <legend>
                                    Reporting & Display Configuration
                                </legend>
                                <div className="grid grid-cols-3 gap-2">
                                    <FormFieldWrapper
                                        className=""
                                        control={form.control}
                                        disabled={isLoading}
                                        name="header_row"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
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
                                                    placeholder="Header Row"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        className=""
                                        control={form.control}
                                        disabled={isLoading}
                                        name="center_row"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
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
                                                    placeholder="Center Row"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        disabled={isLoading}
                                        name="total_row"
                                        render={({ field }) => (
                                            <div className="flex grow flex-col gap-y-2">
                                                <Input
                                                    {...field}
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
                                                    placeholder="Total Row"
                                                    value={field.value ?? ''}
                                                />
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default AccountContentForm
