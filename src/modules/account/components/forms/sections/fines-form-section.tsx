import { Path, UseFormReturn } from 'react-hook-form'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { FaCalendarCheckIcon, MoneyBagIcon } from '@/components/icons'
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
            <div className="flex gap-x-3">
                <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Fines Amort (%)"
                            name="fines_amort"
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
                            label="Fines Mat. (%)"
                            name="fines_maturity"
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
                            label="Fines G.P. Amort."
                            name="fines_grace_period_amortization"
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
                                        placeholder="Fines Grace Period Amortization"
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
                            label="Addtl. G.P."
                            name="additional_grace_period"
                            render={({ field }) => (
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
                                    placeholder="Additional Grace Period"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Fines G.P. Mat.:"
                            name="fines_grace_period_maturity"
                            render={({ field }) => (
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
                                    placeholder="Fines Grace Period Maturity"
                                />
                            )}
                        />
                    </div>
                </div>
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
                                                Interest Computation Month End
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
                                                Fines Computation Rest By Rate
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
                                onCheckedChange={(e) => field.onChange(e)}
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
                                        Disable daily grace period calculation
                                        for fines.
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
                                <GradientBackground gradientOnly key={type}>
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
        </div>
    )
}
