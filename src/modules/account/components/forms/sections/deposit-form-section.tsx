import { Path, UseFormReturn } from 'react-hook-form'

import { CurrencyInput } from '@/modules/currency'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { ExcludeIcon, HandDepositIcon, MoneyBagIcon } from '@/components/icons'
import { Checkbox } from '@/components/ui/checkbox'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import { TAccountFormValues } from '../../../account.validation'

type DepositFormSectionProps = {
    form: UseFormReturn<TAccountFormValues>
    isDisabled: (fieldName: Path<TAccountFormValues>) => boolean
}

export const DepositFormSection = ({ form }: DepositFormSectionProps) => {
    if (form.watch('type') !== 'Deposit') return null

    return (
        <div className="flex flex-col gap-y-2 p-5">
            <h1 className="text-primary text-md font-bold">
                <HandDepositIcon className="inline-block mr-2 mb-1" />
                Deposit
            </h1>

            <div className="grid grid-cols-2 gap-x-4">
                <FormFieldWrapper
                    className="col-span-2"
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
                                            <Label htmlFor={field.name}>
                                                Exclude general ledger grouping
                                            </Label>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}`}
                                            >
                                                Exclude the General ledger
                                                Grouping.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </GradientBackground>
                        )
                    }}
                />
                <div className="col-span-2 grid grid-cols-4 gap-3">
                    <h4 className="text-sm col-span-4 font-medium text-muted-foreground">
                        Compassion Fund (Damayan)
                    </h4>
                    <FormFieldWrapper
                        className="col-span-4"
                        control={form.control}
                        name="compassion_fund"
                        render={({ field }) => (
                            <GradientBackground gradientOnly>
                                <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                    <Checkbox
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <MoneyBagIcon className="size-4" />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Enable Compassion Fund
                                            </Label>
                                            <p className="text-xs text-muted-foreground">
                                                Enable compassion fund (damayan)
                                                for this account
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
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="Enter compassion fund amount"
                            />
                        )}
                    />
                </div>
            </div>
        </div>
    )
}
