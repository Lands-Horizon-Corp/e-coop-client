import { Path, UseFormReturn } from 'react-hook-form'

import { GradientBackground } from '@/components/gradient-background/gradient-background'
import { ExcludeIcon, HandDepositIcon, InternalIcon } from '@/components/icons'
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
                                                <Label htmlFor={field.name}>
                                                    Exclude general ledger
                                                    grouping
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
                </div>
            </div>
            <label className=" text-foreground/80 font-medium text-sm">
                Account Exclusive Settings
            </label>
            <div className="w-full flex gap-x-2 ">
                <FormFieldWrapper
                    control={form.control}
                    name="is_internal"
                    render={({ field }) => (
                        <GradientBackground gradientOnly>
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-2 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                <div className="flex grow items-center gap-3">
                                    <div className="size-fit rounded-full bg-secondary p-2">
                                        <InternalIcon />
                                    </div>
                                    <div className="flex-2 grid gap-2">
                                        <Label htmlFor={field.name}>
                                            Enable Internal Account
                                        </Label>
                                    </div>
                                    <Switch
                                        aria-describedby={`${field.name}-description`}
                                        checked={field.value}
                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                        id={field.name}
                                        onCheckedChange={(e) => {
                                            field.onChange(e)
                                            form.setValue('cash_on_hand', false)
                                            form.setValue(
                                                'paid_up_share_capital',
                                                false
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                        </GradientBackground>
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    name="cash_on_hand"
                    render={({ field }) => (
                        <GradientBackground gradientOnly>
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-2 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                <div className="flex grow items-center gap-3">
                                    <div className="size-fit rounded-full bg-secondary p-2">
                                        <InternalIcon />
                                    </div>
                                    <div className="flex-2 grid gap-2">
                                        <Label htmlFor={field.name}>
                                            Enable Cash on Hand
                                        </Label>
                                    </div>

                                    <Switch
                                        aria-describedby={`${field.name}-description`}
                                        checked={field.value}
                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                        id={field.name}
                                        onCheckedChange={(e) => {
                                            field.onChange(e)
                                            form.setValue('is_internal', false)
                                            form.setValue(
                                                'paid_up_share_capital',
                                                false
                                            )
                                        }}
                                    />
                                </div>
                            </div>
                        </GradientBackground>
                    )}
                />
                <FormFieldWrapper
                    control={form.control}
                    name="paid_up_share_capital"
                    render={({ field }) => (
                        <GradientBackground gradientOnly>
                            <div className="shadow-xs relative flex w-full items-start gap-2 rounded-2xl border border-input p-2 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-primary/40">
                                <div className="flex grow items-center gap-3">
                                    <div className="size-fit rounded-full bg-secondary p-2">
                                        <InternalIcon />
                                    </div>
                                    <div className="flex-2 grid gap-2">
                                        <Label htmlFor={field.name}>
                                            Enable Paid Up Share Capital
                                        </Label>
                                    </div>

                                    <Switch
                                        aria-describedby={`${field.name}-description`}
                                        checked={field.value}
                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                        id={field.name}
                                        onCheckedChange={(e) => {
                                            field.onChange(e)
                                            form.setValue('is_internal', false)
                                            form.setValue('cash_on_hand', false)
                                        }}
                                    />
                                </div>
                            </div>
                        </GradientBackground>
                    )}
                />
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
                            onCheckedChange={(e) => field.onChange(e)}
                        />
                        <div className="grid grow gap-2">
                            <Label htmlFor={field.name}>
                                Cash and Cash Equivalence{' '}
                            </Label>
                            <p
                                className="text-xs text-muted-foreground"
                                id={`${field.name}-description`}
                            >
                                Cash and cash equivalents represent the
                                company's funds that are readily available for
                                use in operations, payments, or investment
                                without significant risk of value change.
                            </p>
                        </div>
                    </div>
                )}
            />
        </div>
    )
}
