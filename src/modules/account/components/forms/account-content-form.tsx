import { Path, UseFormReturn } from 'react-hook-form'

import { CurrencyInput } from '@/modules/currency'
import { GENERAL_LEDGER_TYPE } from '@/modules/general-ledger'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { MoneyBagIcon, SettingsIcon } from '@/components/icons'
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

import {
    ACCOUNT_TYPE,
    OTHER_INFORMATION_OF_AN_ACCOUNT,
} from '../../account.constants'
import { TAccountType } from '../../account.types'
import { TAccountFormValues } from '../../account.validation'
import { DepositFormSection } from './sections/deposit-form-section'
import { FinesFormSection } from './sections/fines-form-section'
import { InterestFormSection } from './sections/interest-form-section'
import { LoanFormSection } from './sections/loan-form-section'
import { SVFLedgerFormSection } from './sections/svf-ledger-form-section'

type AccountContentFormProps = {
    form: UseFormReturn<TAccountFormValues>
    isDisabled: (fieldName: Path<TAccountFormValues>) => boolean
    isLoading?: boolean
}

const AccountContentForm = ({
    form,
    isDisabled,
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
                        className="flex ecoop-scroll overflow-x-auto gap-x-2"
                        disabled={isDisabled(field.name)}
                        onValueChange={(value: TAccountType) => {
                            field.onChange(value)

                            if (form.getValues('general_ledger_type')) return

                            if (value === 'Loan')
                                form.setValue(
                                    'general_ledger_type',
                                    'Liabilities'
                                )
                            else if (value === 'Deposit')
                                form.setValue('general_ledger_type', 'Assets')
                            else if (value === 'A/R-Ledger')
                                form.setValue('general_ledger_type', 'Assets')
                            else if (value === 'A/R-Aging')
                                form.setValue('general_ledger_type', 'Assets')
                            else if (value === 'Fines')
                                form.setValue('general_ledger_type', 'Revenue')
                            else if (value === 'Interest')
                                form.setValue('general_ledger_type', 'Revenue')
                            else if (value === 'SVF-Ledger')
                                form.setValue('general_ledger_type', 'Equity')
                            else if (value === 'W-Off')
                                form.setValue('general_ledger_type', 'Expenses')
                            else if (value === 'A/P-Ledger')
                                form.setValue(
                                    'general_ledger_type',
                                    'Liabilities'
                                )
                            else if (value === 'Other')
                                form.setValue('general_ledger_type', 'Equity')
                            else if (value === 'Time Deposit')
                                form.setValue('general_ledger_type', 'Assets')
                        }}
                        value={field.value}
                    >
                        {ACCOUNT_TYPE.map((type) => (
                            <GradientBackground
                                className="rounded-lg shrink-0 hover:cursor-pointer"
                                gradientOnly
                                key={type}
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
                <DepositFormSection form={form} isDisabled={isDisabled} />
                <LoanFormSection form={form} isDisabled={isDisabled} />
                <FinesFormSection form={form} isDisabled={isDisabled} />
                <InterestFormSection form={form} isDisabled={isDisabled} />
                <SVFLedgerFormSection form={form} isDisabled={isDisabled} />
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
                                                        {GENERAL_LEDGER_TYPE.map(
                                                            (GLType) => {
                                                                return (
                                                                    <SelectItem
                                                                        key={
                                                                            GLType
                                                                        }
                                                                        value={
                                                                            GLType
                                                                        }
                                                                    >
                                                                        {GLType}
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
                                <div className="grid grid-cols-2 gap-2">
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
                                                {OTHER_INFORMATION_OF_AN_ACCOUNT.map(
                                                    (type) => (
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
                                                                            {
                                                                                type
                                                                            }
                                                                        </Label>
                                                                        <p
                                                                            className="text-xs text-muted-foreground"
                                                                            id={`other-info-${type}-description`}
                                                                        >
                                                                            {type ===
                                                                                'None' &&
                                                                                'No other specific information is assigned.'}
                                                                            {type ===
                                                                                'Jewelry' &&
                                                                                'This account is related to jewelry.'}
                                                                            {type ===
                                                                                'Grocery' &&
                                                                                'This account is related to groceries.'}
                                                                            {type ===
                                                                                'Restructured' &&
                                                                                'This account has been restructured.'}
                                                                        </p>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </GradientBackground>
                                                    )
                                                )}
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
