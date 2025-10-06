import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { AccountCreateUpdateFormModal, AccountPicker } from '@/modules/account'
import WeekdayCombobox from '@/modules/loan-transaction/components/weekday-combobox'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'

import { CheckIcon, EyeIcon, ShapesIcon } from '@/components/icons'
import { Button } from '@/components/ui/button'
import { Form, FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Switch } from '@/components/ui/switch'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps } from '@/types'

import {
    MockLoanInputSchema,
    TMockCloanInputSchema,
} from '../../calculator.validation'

type Props = {
    loading?: boolean
    disabled?: boolean
    autoSubmit?: boolean
    onSubmit: (data: TMockCloanInputSchema) => void | Promise<void>
    initialData?: Partial<TMockCloanInputSchema>
} & IClassProps

const MockLoanInputForm = ({
    onSubmit,
    className,
    disabled,
    loading,
    initialData,
    autoSubmit = false,
}: Props) => {
    const viewAccountModal = useModalState()
    const inputForm = useForm<TMockCloanInputSchema>({
        resolver: standardSchemaResolver(MockLoanInputSchema),
        mode: 'onChange',
        defaultValues: {
            applied_1: 0,
            terms: 0,
            is_add_on: false,
            mode_of_payment: 'monthly',
            mode_of_payment_monthly_exact_day: false,
            account_id: undefined,
            account: undefined,
            mode_of_payment_fixed_days: undefined,
            mode_of_payment_weekly: 'monday',
            mode_of_payment_semi_monthly_pay_1: undefined,
            mode_of_payment_semi_monthly_pay_2: undefined,
            ...initialData,
        },
    })

    const selectedAccount = inputForm.watch('account')

    const mode_of_payment = inputForm.watch('mode_of_payment')

    const { firstError, formRef } = useFormHelper({
        form: inputForm,
        autoSave: autoSubmit,
    })

    return (
        <Form {...inputForm}>
            <form
                ref={formRef}
                onSubmit={inputForm.handleSubmit(onSubmit)}
                className={cn('space-y-4', className)}
            >
                <AccountCreateUpdateFormModal
                    {...viewAccountModal}
                    title="View Account"
                    description="See full account details."
                    formProps={{
                        readOnly: true,
                        defaultValues: selectedAccount,
                    }}
                />
                <fieldset
                    disabled={disabled || loading}
                    className="grid gap-4 group"
                >
                    <FormFieldWrapper
                        control={inputForm.control}
                        name="applied_1"
                        label="Applied Amount *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                autoComplete="off"
                                placeholder="Applied Amount"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={inputForm.control}
                        name="account_id"
                        label={
                            <span className="flex justify-between items-center">
                                <span>Loan Account</span>
                                {selectedAccount && (
                                    <span
                                        onClick={() =>
                                            viewAccountModal.onOpenChange(true)
                                        }
                                        className="text-xs text-muted-foreground hover:underline ease-in-out duration-200 hover:text-foreground cursor-pointer"
                                    >
                                        <EyeIcon className="inline size-2.5" />{' '}
                                        View
                                    </span>
                                )}
                            </span>
                        }
                        render={({ field }) => (
                            <AccountPicker
                                mode="loan"
                                hideDescription
                                value={inputForm.getValues('account')}
                                placeholder="Select Loan Account"
                                onSelect={(account) => {
                                    field.onChange(account?.id)
                                    inputForm.setValue('account', account)
                                }}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={inputForm.control}
                        name="terms"
                        label="Terms *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Terms"
                                autoComplete="off"
                            />
                        )}
                    />
                    <div className="flex max-w-full overflow-x-auto ecoop-scroll items-center gap-3">
                        <FormFieldWrapper
                            control={inputForm.control}
                            name="mode_of_payment"
                            label="Mode of Payment"
                            className="shrink-0 w-fit col-span-4"
                            render={({ field }) => (
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    value={field.value ?? ''}
                                    className="flex flex-wrap gap-x-2"
                                >
                                    {LOAN_MODE_OF_PAYMENT.map((mop) => (
                                        <FormItem
                                            key={mop}
                                            className="flex items-center gap-4 group-disabled:opacity-50"
                                        >
                                            <label
                                                key={`mop-${mop}`}
                                                className="border-accent/50 hover:bg-accent/40 ease-in-out duration-100 bg-muted has-data-[state=checked]:text-primary-foreground has-data-[state=checked]:border-primary/50 has-data-[state=checked]:not-disabled:bg-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer items-center gap-1 rounded-md border py-2.5 px-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                                            >
                                                <RadioGroupItem
                                                    value={mop}
                                                    id={`mop-${mop}`}
                                                    className="absolute peer border-0 inset-0 opacity-0 cursor-pointer"
                                                />
                                                <p className="capitalize text-xs leading-none font-medium pointer-events-none">
                                                    {mop}
                                                </p>
                                                {field.value === mop && (
                                                    <CheckIcon className="inline pointer-events-none" />
                                                )}
                                            </label>
                                        </FormItem>
                                    ))}
                                </RadioGroup>
                            )}
                        />
                    </div>
                    {mode_of_payment === 'monthly' && (
                        <FormFieldWrapper
                            control={inputForm.control}
                            name="mode_of_payment_monthly_exact_day"
                            className="mb-1"
                            render={({ field }) => (
                                <div
                                    className="group inline-flex items-center gap-2"
                                    data-state={
                                        field.value ? 'checked' : 'unchecked'
                                    }
                                >
                                    <span
                                        id={`${field.name}-off`}
                                        className="group-data-[state=checked]:text-muted-foreground/70 flex-1 text-nowrap cursor-pointer text-right text-sm font-medium"
                                        aria-controls={field.name}
                                        onClick={() => field.onChange(false)}
                                    >
                                        By 30 Days
                                    </span>
                                    <Switch
                                        id={field.name}
                                        checked={field.value}
                                        className="ease-in-out duration-200"
                                        onCheckedChange={(switchValue) =>
                                            field.onChange(switchValue)
                                        }
                                        aria-labelledby={`${field.name}-off ${field.name}-on`}
                                    />
                                    <span
                                        id={`${field.name}-on`}
                                        className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
                                        aria-controls={field.name}
                                        onClick={() => field.onChange(true)}
                                    >
                                        Exact Day
                                    </span>
                                </div>
                            )}
                        />
                    )}
                    {mode_of_payment === 'day' && (
                        <>
                            <FormFieldWrapper
                                control={inputForm.control}
                                name="mode_of_payment_fixed_days"
                                label="Fixed Days"
                                className="space-y-1 col-span-1"
                                render={({ field }) => (
                                    <Input
                                        {...field}
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
                                control={inputForm.control}
                                name="mode_of_payment_weekly"
                                label="Weekdays"
                                className="space-y-1 col-span-1"
                                render={({ field }) => (
                                    <WeekdayCombobox {...field} />
                                )}
                            />
                        </>
                    )}
                    {mode_of_payment === 'semi-monthly' && (
                        <div className="grid grid-cols-2 gap-3">
                            <FormFieldWrapper
                                control={inputForm.control}
                                name="mode_of_payment_semi_monthly_pay_1"
                                label="Pay 1 (Day of Month) *"
                                className="col-span-1"
                                render={({ field }) => <Input {...field} />}
                            />
                            <FormFieldWrapper
                                control={inputForm.control}
                                name="mode_of_payment_semi_monthly_pay_2"
                                label="Pay 2 (Day of Month) *"
                                className="col-span-1"
                                render={({ field }) => <Input {...field} />}
                            />
                        </div>
                    )}
                    <FormFieldWrapper
                        control={inputForm.control}
                        name="is_add_on"
                        className="grow"
                        render={({ field }) => (
                            <div className="border-input has-data-[state=checked]:border-primary/50 border-2 has-data-[state=checked]:bg-primary/20 duration-200 ease-in-out relative flex items-center gap-2 rounded-xl px-2 py-2 shadow-xs outline-none">
                                <Switch
                                    tabIndex={0}
                                    id="loan-add-on"
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    aria-describedby={`loan-add-on-description`}
                                    className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                />
                                <div className="flex grow items-center gap-3">
                                    <ShapesIcon className="text-primary size-4" />
                                    <div className="flex items-center gap-x-2">
                                        <Label htmlFor={'loan-add-on'}>
                                            Add-On{' '}
                                        </Label>
                                        <p
                                            id="loan-add-on-description"
                                            className="text-muted-foreground"
                                        >
                                            Include Add-On&apos;s
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    />
                    <FormErrorMessage errorMessage={firstError} />
                    <Button type="submit" className="sticky bottom-0">
                        Apply
                    </Button>
                </fieldset>
            </form>
        </Form>
    )
}

export default MockLoanInputForm
