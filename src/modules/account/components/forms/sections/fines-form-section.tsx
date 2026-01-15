import { Path, UseFormReturn } from 'react-hook-form'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { FaCalendarCheckIcon, MoneyBagIcon } from '@/components/icons'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import {
    InputGroup,
    InputGroupAddon,
    InputGroupInput,
    InputGroupText,
} from '@/components/ui/input-group'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

import {
    INTEREST_FINES_COMPUTATION_DIMINISHING,
    INTEREST_FINES_COMPUTATION_DIMINISHING_STRAIGHT_DIMINISHING_YEARLY,
    LUMPSUM_COMPUTATION_TYPE,
} from '../../../account.constants'
import { TAccountFormValues } from '../../../account.validation'

type FinesFormSectionProps = {
    form: UseFormReturn<TAccountFormValues>
    isDisabled: (fieldName: Path<TAccountFormValues>) => boolean
}

export const FinesFormSection = ({
    form,
    isDisabled,
}: FinesFormSectionProps) => {
    if (form.watch('type') !== 'Fines') return null

    return (
        <div className="p-5 space-y-4">
            <h1 className="text-primary text-md font-bold">
                <MoneyBagIcon className="inline-block mr-2 mb-1" />
                Fines Configuration
            </h1>
            <div className="grid grid-cols-12 gap-x-3">
                <div className="col-span-8 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        {/* Interest Computation Month End */}
                        <FormFieldWrapper
                            control={form.control}
                            name="interest_computation_month_end"
                            render={({ field }) => (
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
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Interest Computation Month
                                                    End
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        {/* Fines Computation By Next Amortization */}
                        <FormFieldWrapper
                            control={form.control}
                            name="fines_computation_by_next_amortization"
                            render={({ field }) => (
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
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Fines Computation By Next
                                                    Amortization
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        {/* Computation Fines Lumpsum */}
                        <FormFieldWrapper
                            control={form.control}
                            name="computation_fines_lumpsum"
                            render={({ field }) => (
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
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Computation Fines Lumpsum
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        {/* Fines Computation Daily By Amortization */}
                        <FormFieldWrapper
                            control={form.control}
                            name="fines_computation_daily_by_amortization"
                            render={({ field }) => (
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
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Fines Computation Daily By
                                                    Amortization
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        {/* Fines Computation Rest By Rate */}
                        <FormFieldWrapper
                            control={form.control}
                            name="fines_computation_rest_by_rate"
                            render={({ field }) => (
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
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Fines Computation Rest By
                                                    Rate
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />

                        {/* Compute Fines After Maturity */}
                        <FormFieldWrapper
                            control={form.control}
                            name="compute_fines_after_maturity"
                            render={({ field }) => (
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
                                            <div className="grid gap-2">
                                                <Label htmlFor={field.name}>
                                                    Compute Fines After Maturity
                                                </Label>
                                            </div>
                                        </div>
                                    </div>
                                </GradientBackground>
                            )}
                        />
                    </div>

                    {/* No Grace Period Daily */}
                    <FormFieldWrapper
                        control={form.control}
                        name="no_grace_period_daily"
                        render={({ field }) => (
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
                                            <FaCalendarCheckIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                No Grace Period Daily
                                            </Label>
                                            <p
                                                className="text-xs"
                                                id={`${field.name}-description`}
                                            >
                                                Disable daily grace period
                                                calculation for fines.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )}
                    />

                    <div className="grid grid-cols-4 gap-3">
                        {/* Lumpsum Computation Type */}
                        <FormFieldWrapper
                            className="bg-card col-span-4 p-3 pb-3 rounded-xl"
                            control={form.control}
                            label="Select Lumpsum Computation Type"
                            name="lumpsum_computation_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="grid grid-cols-1 gap-2 sm:grid-cols-4"
                                    disabled={isDisabled(field.name)}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    {LUMPSUM_COMPUTATION_TYPE.map((type) => (
                                        <GradientBackground
                                            gradientOnly
                                            key={type}
                                        >
                                            <div className="shadow-xs relative flex w-full h-full items-center gap-2 rounded-2xl border border-input p-3 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
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
                                                            {type === 'None' &&
                                                                'No specific lumpsum computation will be applied.'}
                                                            {type ===
                                                                'Compute Fines Maturity' &&
                                                                'Calculates lumpsum based on fines maturity.'}
                                                            {type ===
                                                                'Compute Interest Maturity / Terms' &&
                                                                'Calculates lumpsum based on interest maturity or terms.'}
                                                            {type ===
                                                                'Compute Advance Interest' &&
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
                        {/* Int/Fines Computation (Dim.) */}
                        <FormFieldWrapper
                            className="bg-card/50 col-span-2 p-3 pb-3 rounded-xl"
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
                            className="bg-card/50 p-3 col-span-2 pb-3 rounded-xl"
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
                                            <GradientBackground
                                                gradientOnly
                                                key={type}
                                            >
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
                </div>
                <div className="col-span-4 grid grid-cols-2 p-2 bg-accent/40 rounded-xl gap-x-3 gap-y-2">
                    <div className="space-y-2 p-2 bg-popover rounded-md">
                        <p className="text-xs text-popover-foreground/60">
                            Fines Grace Period & Amort.
                        </p>
                        <FormFieldWrapper
                            control={form.control}
                            label="Fines Amort (%)"
                            name="fines_amort"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(e) => {
                                            const amortizationFields = [
                                                'coh_cib_fines_grace_period_entry_daily_amortization',
                                                'coh_cib_fines_grace_period_entry_weekly_amortization',
                                                'coh_cib_fines_grace_period_entry_monthly_amortization',
                                                'coh_cib_fines_grace_period_entry_semi_monthly_amortization',
                                                'coh_cib_fines_grace_period_entry_quarterly_amortization',
                                                'coh_cib_fines_grace_period_entry_semi_annual_amortization',
                                                'coh_cib_fines_grace_period_entry_annual_amortization',
                                                'coh_cib_fines_grace_period_entry_lumpsum_amortization',
                                            ]

                                            const prevValue = `${field.value}`

                                            amortizationFields.forEach(
                                                (field) => {
                                                    const value = `${form.getValues(
                                                        field as Path<TAccountFormValues>
                                                    )}`

                                                    if (
                                                        value === prevValue ||
                                                        value === '' ||
                                                        value === undefined
                                                    )
                                                        form.setValue(
                                                            field as Path<TAccountFormValues>,
                                                            e.target.value
                                                        )
                                                }
                                            )

                                            field.onChange(e)
                                        }}
                                        placeholder="Fines Amortization"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Fines Grace Period Amort"
                            name="fines_grace_period_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>Days</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Daily Amort"
                            name="coh_cib_fines_grace_period_entry_daily_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Daily "
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Weekly Amort"
                            name="coh_cib_fines_grace_period_entry_weekly_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Weekly "
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Monthly Amort"
                            name="coh_cib_fines_grace_period_entry_monthly_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Monthly"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Semi Monthly Amort"
                            name="coh_cib_fines_grace_period_entry_semi_monthly_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Semi Monthly"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Quarterly Amort"
                            name="coh_cib_fines_grace_period_entry_quarterly_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Quarterly"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Semi Annual Amort"
                            name="coh_cib_fines_grace_period_entry_semi_annual_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Semi Annual"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Semi Annual Amort"
                            name="coh_cib_fines_grace_period_entry_annual_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Semi Annual"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Lumpsum Amort"
                            name="coh_cib_fines_grace_period_entry_lumpsum_amortization"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Lumpsum"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />
                    </div>

                    <div className="space-y-2 p-2 bg-popover rounded-md">
                        <p className="text-xs text-popover-foreground/60">
                            Fines Grace Period Maturity
                        </p>
                        <FormFieldWrapper
                            control={form.control}
                            label="Fines Mat. (%)"
                            name="fines_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(e) => {
                                            const maturityFields = [
                                                'coh_cib_fines_grace_period_entry_daily_maturity',
                                                'coh_cib_fines_grace_period_entry_weekly_maturity',
                                                'coh_cib_fines_grace_period_entry_monthly_maturity',
                                                'coh_cib_fines_grace_period_entry_semi_monthly_maturity',
                                                'coh_cib_fines_grace_period_entry_quarterly_maturity',
                                                'coh_cib_fines_grace_period_entry_semi_annual_maturity',
                                                'coh_cib_fines_grace_period_entry_annual_maturity',
                                                'coh_cib_fines_grace_period_entry_lumpsum_maturity',
                                            ]

                                            const prevValue = `${field.value}`

                                            maturityFields.forEach((field) => {
                                                const value = `${form.getValues(
                                                    field as Path<TAccountFormValues>
                                                )}`

                                                if (
                                                    value === prevValue ||
                                                    value === '' ||
                                                    value === undefined
                                                )
                                                    form.setValue(
                                                        field as Path<TAccountFormValues>,
                                                        e.target.value
                                                    )
                                            })

                                            field.onChange(e)
                                        }}
                                        placeholder="Fines Maturity"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Fines Grace Period Maturity"
                            name="fines_grace_period_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>Days</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Daily Maturity"
                            name="coh_cib_fines_grace_period_entry_daily_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Daily"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Weekly Maturity"
                            name="coh_cib_fines_grace_period_entry_weekly_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Weekly"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Monthly Maturity"
                            name="coh_cib_fines_grace_period_entry_monthly_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Monthly"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Semi Monthly Maturity"
                            name="coh_cib_fines_grace_period_entry_semi_monthly_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Semi Monthly"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Quarterly Maturity"
                            name="coh_cib_fines_grace_period_entry_quarterly_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Quarterly"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Semi Annual Maturity"
                            name="coh_cib_fines_grace_period_entry_semi_annual_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Semi Annual"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Annual Maturity"
                            name="coh_cib_fines_grace_period_entry_annual_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Annual"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Lumpsum Maturity"
                            name="coh_cib_fines_grace_period_entry_lumpsum_maturity"
                            render={({ field }) => (
                                <InputGroup>
                                    <InputGroupInput
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Lumpsum"
                                        value={field.value ?? ''}
                                    />
                                    <InputGroupAddon align="inline-end">
                                        <InputGroupText>%</InputGroupText>
                                    </InputGroupAddon>
                                </InputGroup>
                            )}
                        />
                    </div>

                    <FormFieldWrapper
                        className="col-span-2"
                        control={form.control}
                        label="Additional Grace Period"
                        name="additional_grace_period"
                        render={({ field }) => (
                            <InputGroup className="bg-background">
                                <InputGroupInput
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Fines Amortization"
                                    value={field.value ?? ''}
                                />
                                <InputGroupAddon align="inline-end">
                                    <InputGroupText>Days</InputGroupText>
                                </InputGroupAddon>
                            </InputGroup>
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
