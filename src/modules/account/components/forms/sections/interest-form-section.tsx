import { Path, UseFormReturn } from 'react-hook-form'

import { CurrencyInput } from '@/modules/currency'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { ReceiveMoneyIcon } from '@/components/icons'
import { FormControl } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'

import {
    COMPUTATION_TYPE,
    EARNED_UNEARNED_INTEREST,
    INTEREST_DEDUCTION,
    INTEREST_FINES_COMPUTATION_DIMINISHING,
    INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_DIMINISHING_YEARLY,
    INTEREST_SAVING_TYPE_DIMINISHING_STRAIGHT,
} from '../../../account.constants'
import { TAccountFormValues } from '../../../account.validation'

type InterestFormSectionProps = {
    form: UseFormReturn<TAccountFormValues>
    isDisabled: (fieldName: Path<TAccountFormValues>) => boolean
}

export const InterestFormSection = ({
    form,
    isDisabled,
}: InterestFormSectionProps) => {
    if (form.watch('type') !== 'Interest') return null
    return (
        <div className="flex flex-col gap-y-2 p-5">
            <h1 className="text-primary text-md font-bold">
                <ReceiveMoneyIcon className="inline-block mr-2 mb-1" />
                Interest Configuration
            </h1>

            <div className="grid grid-cols-2 gap-x-3">
                {/* Min/Max Amount and Computation Type */}
                <div className="flex flex-col gap-4">
                    <FormFieldWrapper
                        control={form.control}
                        label="Max Amount"
                        name="max_amount"
                        render={({ field: { onChange, ...field } }) => (
                            <div className="flex grow flex-col gap-y-2">
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('currency')}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(newValue = '') => {
                                        onChange(newValue)
                                    }}
                                    placeholder="0.0"
                                />
                            </div>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Min Amount"
                        name="min_amount"
                        render={({ field: { onChange, ...field } }) => (
                            <div className="flex grow flex-col gap-y-2">
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('currency')}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(newValue = '') => {
                                        onChange(newValue)
                                    }}
                                    placeholder="0.00"
                                />
                            </div>
                        )}
                    />
                    <FormFieldWrapper
                        className="col-span-1"
                        control={form.control}
                        label="Computation Type *"
                        name="computation_type"
                        render={({ field }) => (
                            <FormControl>
                                <Select
                                    defaultValue={field.value}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(selectedValue) => {
                                        field.onChange(selectedValue)
                                    }}
                                >
                                    <SelectTrigger className="w-full">
                                        {field.value ||
                                            'Select Computation Type'}
                                    </SelectTrigger>
                                    <SelectContent>
                                        {COMPUTATION_TYPE.map((compType) => {
                                            return (
                                                <SelectItem
                                                    key={compType}
                                                    value={compType}
                                                >
                                                    {compType}
                                                </SelectItem>
                                            )
                                        })}
                                    </SelectContent>
                                </Select>
                            </FormControl>
                        )}
                    />
                </div>

                {/* Interest Standard */}
                <div className="flex flex-col gap-4">
                    <FormFieldWrapper
                        control={form.control}
                        label="Interest Standard (%)"
                        name="interest_standard"
                        render={({ field }) => (
                            <InputGroup>
                                <InputGroupInput
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ''
                                                ? undefined
                                                : parseFloat(e.target.value)
                                        )
                                    }
                                    placeholder="Interest Standard"
                                    value={field.value ?? ''}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>%</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        )}
                    />
                    {/* Cut-Off Days and Months */}
                    <FormFieldWrapper
                        control={form.control}
                        label="Cut-Off Months"
                        name="cut_off_months"
                        render={({ field }) => (
                            <div className="flex grow flex-col gap-y-2">
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ''
                                                ? undefined
                                                : parseInt(e.target.value, 10)
                                        )
                                    }
                                    placeholder="Cut-Off Months"
                                    value={field.value ?? ''}
                                />
                            </div>
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Cut-Off Days"
                        name="cut_off_days"
                        render={({ field }) => (
                            <div className="flex grow flex-col gap-y-2">
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(e) =>
                                        field.onChange(
                                            e.target.value === ''
                                                ? undefined
                                                : parseInt(e.target.value, 10)
                                        )
                                    }
                                    placeholder="Cut-Off Days"
                                    value={field.value ?? ''}
                                />
                            </div>
                        )}
                    />
                </div>
            </div>

            <div className="flex gap-x-3">
                {/* Int/Fines Computation (Dim.) */}
                <FormFieldWrapper
                    className="bg-card/50 p-3 pb-3 rounded-xl"
                    control={form.control}
                    label="Int/Fines Computation (Dim.)"
                    name="interest_fines_computation_diminishing"
                    render={({ field }) => (
                        <RadioGroup
                            className="flex flex-col gap-2"
                            disabled={isDisabled(field.name)}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            {INTEREST_FINES_COMPUTATION_DIMINISHING.map(
                                (type) => (
                                    <GradientBackground
                                        className="flex-1"
                                        gradientOnly
                                        key={type}
                                    >
                                        <div className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                            <RadioGroupItem
                                                className="order-1 after:absolute after:inset-0"
                                                id={`int-fines-dim-${type}`}
                                                value={type}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`int-fines-dim-${type}`}
                                                    >
                                                        {type}
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </GradientBackground>
                                )
                            )}
                        </RadioGroup>
                    )}
                />

                {/* Int/Fines Computation Dim. Straight, Dim. Yearly */}
                <FormFieldWrapper
                    className="bg-card/50 p-3 pb-3 rounded-xl"
                    control={form.control}
                    label="Int/Fines Computation (Dim. Straight, Dim. Yearly)"
                    name="interest_fines_computation_diminishing_straight_diminishing_yearly"
                    render={({ field }) => (
                        <RadioGroup
                            className="flex flex-col gap-2"
                            disabled={isDisabled(field.name)}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            {INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_DIMINISHING_YEARLY.map(
                                (type) => (
                                    <GradientBackground gradientOnly key={type}>
                                        <div className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                            <RadioGroupItem
                                                className="order-1 after:absolute after:inset-0"
                                                id={`int-fines-dim-str-yearly-${type}`}
                                                value={type}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`int-fines-dim-str-yearly-${type}`}
                                                    >
                                                        {type}
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </GradientBackground>
                                )
                            )}
                        </RadioGroup>
                    )}
                />
            </div>

            <div className="grid grid-cols-4 gap-x-2">
                {/* Earned/Unearned Interest */}
                <FormFieldWrapper
                    className="bg-card/50 p-3 pb-3 col-span-2 rounded-xl"
                    control={form.control}
                    label="Earned/Unearned Interest"
                    name="earned_unearned_interest"
                    render={({ field }) => (
                        <RadioGroup
                            className="grid grid-cols-1 gap-2 sm:grid-cols-2"
                            disabled={isDisabled(field.name)}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            {EARNED_UNEARNED_INTEREST.map((type) => (
                                <GradientBackground gradientOnly key={type}>
                                    <div className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
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
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            ))}
                        </RadioGroup>
                    )}
                />

                {/* Interest Deduction */}
                <FormFieldWrapper
                    className="bg-card/50 p-3 pb-3 rounded-xl"
                    control={form.control}
                    label="Interest Deduction"
                    name="interest_deduction"
                    render={({ field }) => (
                        <RadioGroup
                            className="grid grid-cols-1 gap-2"
                            disabled={isDisabled(field.name)}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            {INTEREST_DEDUCTION.map((type) => (
                                <GradientBackground gradientOnly key={type}>
                                    <div className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
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
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            ))}
                        </RadioGroup>
                    )}
                />

                {/* Interest Saving Type Dim. Straight */}
                <FormFieldWrapper
                    className="bg-card/50 p-3 pb-3 rounded-xl"
                    control={form.control}
                    label="Interest Saving Type (Dim. Straight)"
                    name="interest_saving_type_diminishing_straight"
                    render={({ field }) => (
                        <RadioGroup
                            className="grid grid-cols-1 gap-2"
                            disabled={isDisabled(field.name)}
                            onValueChange={field.onChange}
                            value={field.value}
                        >
                            {INTEREST_SAVING_TYPE_DIMINISHING_STRAIGHT.map(
                                (type) => (
                                    <GradientBackground gradientOnly key={type}>
                                        <div className="shadow-xs relative flex w-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                            <RadioGroupItem
                                                className="order-1 after:absolute after:inset-0"
                                                id={`interest-saving-type-dim-str-${type}`}
                                                value={type}
                                            />
                                            <div className="flex grow items-center gap-3">
                                                <div className="grid gap-2">
                                                    <Label
                                                        htmlFor={`interest-saving-type-dim-str-${type}`}
                                                    >
                                                        {type}
                                                    </Label>
                                                </div>
                                            </div>
                                        </div>
                                    </GradientBackground>
                                )
                            )}
                        </RadioGroup>
                    )}
                />
            </div>

            {/* Interest Diminishing by Year */}
            <div className="grid grid-cols-2 gap-x-3">
                <FormFieldWrapper
                    className="col-span-2"
                    control={form.control}
                    name="interest_diminishing_by_year"
                    render={({ field }) => (
                        <div className="relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 shadow-xs outline-none has-data-[state=checked]:border-primary/50 has-data-[state=checked]:bg-primary/20">
                            <Switch
                                aria-describedby={`${field.name}-description`}
                                checked={field.value}
                                className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                id={field.name}
                                onCheckedChange={(e) => field.onChange(e)}
                            />
                            <div className="grid grow gap-2">
                                <Label htmlFor={field.name}>
                                    Interest Diminishing by Year
                                </Label>
                                <p
                                    className="text-xs text-muted-foreground"
                                    id={`${field.name}-description`}
                                >
                                    Enable interest diminishing calculation by
                                    year. When enabled, interest will be
                                    calculated on a diminishing balance basis
                                    annually.
                                </p>
                            </div>
                        </div>
                    )}
                />
            </div>
        </div>
    )
}
