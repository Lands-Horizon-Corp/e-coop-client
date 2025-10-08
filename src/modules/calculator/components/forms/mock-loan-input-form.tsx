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
        <>
            <AccountCreateUpdateFormModal
                {...viewAccountModal}
                description="See full account details."
                formProps={{
                    accountId: selectedAccount?.id,
                    defaultValues: selectedAccount,
                    onSuccess(data) {
                        inputForm.setValue('account', data)
                    },
                }}
                title="View Account"
            />
            <Form {...inputForm}>
                <form
                    className={cn('space-y-4', className)}
                    onSubmit={inputForm.handleSubmit(onSubmit)}
                    ref={formRef}
                >
                    <fieldset
                        className="grid gap-4 group"
                        disabled={disabled || loading}
                    >
                        <FormFieldWrapper
                            control={inputForm.control}
                            label="Applied Amount *"
                            name="applied_1"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    id={field.name}
                                    placeholder="Applied Amount"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={inputForm.control}
                            label={
                                <span className="flex justify-between items-center">
                                    <span>Loan Account</span>
                                    {selectedAccount && (
                                        <span
                                            className="text-xs text-muted-foreground hover:underline ease-in-out duration-200 hover:text-foreground cursor-pointer"
                                            onClick={() =>
                                                viewAccountModal.onOpenChange(
                                                    true
                                                )
                                            }
                                        >
                                            <EyeIcon className="inline size-2.5" />{' '}
                                            View
                                        </span>
                                    )}
                                </span>
                            }
                            name="account_id"
                            render={({ field }) => (
                                <AccountPicker
                                    hideDescription
                                    mode="loan"
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        inputForm.setValue('account', account)
                                    }}
                                    placeholder="Select Loan Account"
                                    value={inputForm.getValues('account')}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={inputForm.control}
                            label="Terms *"
                            name="terms"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    id={field.name}
                                    placeholder="Terms"
                                />
                            )}
                        />
                        <div className="flex max-w-full overflow-x-auto ecoop-scroll items-center gap-3">
                            <FormFieldWrapper
                                className="shrink-0 w-fit col-span-4"
                                control={inputForm.control}
                                label="Mode of Payment"
                                name="mode_of_payment"
                                render={({ field }) => (
                                    <RadioGroup
                                        className="flex flex-wrap gap-x-2"
                                        onValueChange={field.onChange}
                                        value={field.value ?? ''}
                                    >
                                        {LOAN_MODE_OF_PAYMENT.map((mop) => (
                                            <FormItem
                                                className="flex items-center gap-4 group-disabled:opacity-50"
                                                key={mop}
                                            >
                                                <label
                                                    className="border-accent/50 hover:bg-accent/40 ease-in-out duration-100 bg-muted has-data-[state=checked]:text-primary-foreground has-data-[state=checked]:border-primary/50 has-data-[state=checked]:not-disabled:bg-primary has-focus-visible:border-ring has-focus-visible:ring-ring/50 relative flex cursor-pointer items-center gap-1 rounded-md border py-2.5 px-3 text-center shadow-xs outline-none has-focus-visible:ring-[3px] has-data-disabled:cursor-not-allowed has-data-disabled:opacity-50"
                                                    key={`mop-${mop}`}
                                                >
                                                    <RadioGroupItem
                                                        className="absolute peer border-0 inset-0 opacity-0 cursor-pointer"
                                                        id={`mop-${mop}`}
                                                        value={mop}
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
                                className="mb-1"
                                control={inputForm.control}
                                name="mode_of_payment_monthly_exact_day"
                                render={({ field }) => (
                                    <div
                                        className="group inline-flex items-center gap-2"
                                        data-state={
                                            field.value
                                                ? 'checked'
                                                : 'unchecked'
                                        }
                                    >
                                        <span
                                            aria-controls={field.name}
                                            className="group-data-[state=checked]:text-muted-foreground/70 flex-1 text-nowrap cursor-pointer text-right text-sm font-medium"
                                            id={`${field.name}-off`}
                                            onClick={() =>
                                                field.onChange(false)
                                            }
                                        >
                                            By 30 Days
                                        </span>
                                        <Switch
                                            aria-labelledby={`${field.name}-off ${field.name}-on`}
                                            checked={field.value}
                                            className="ease-in-out duration-200"
                                            id={field.name}
                                            onCheckedChange={(switchValue) =>
                                                field.onChange(switchValue)
                                            }
                                        />
                                        <span
                                            aria-controls={field.name}
                                            className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
                                            id={`${field.name}-on`}
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
                                    className="space-y-1 col-span-1"
                                    control={inputForm.control}
                                    label="Fixed Days"
                                    name="mode_of_payment_fixed_days"
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
                                    className="space-y-1 col-span-1"
                                    control={inputForm.control}
                                    label="Weekdays"
                                    name="mode_of_payment_weekly"
                                    render={({ field }) => (
                                        <WeekdayCombobox {...field} />
                                    )}
                                />
                            </>
                        )}
                        {mode_of_payment === 'semi-monthly' && (
                            <div className="grid grid-cols-2 gap-3">
                                <FormFieldWrapper
                                    className="col-span-1"
                                    control={inputForm.control}
                                    label="Pay 1 (Day of Month) *"
                                    name="mode_of_payment_semi_monthly_pay_1"
                                    render={({ field }) => <Input {...field} />}
                                />
                                <FormFieldWrapper
                                    className="col-span-1"
                                    control={inputForm.control}
                                    label="Pay 2 (Day of Month) *"
                                    name="mode_of_payment_semi_monthly_pay_2"
                                    render={({ field }) => <Input {...field} />}
                                />
                            </div>
                        )}
                        <FormFieldWrapper
                            className="grow"
                            control={inputForm.control}
                            name="is_add_on"
                            render={({ field }) => (
                                <div className="border-input has-data-[state=checked]:border-primary/50 border-2 has-data-[state=checked]:bg-primary/20 duration-200 ease-in-out relative flex items-center gap-2 rounded-xl px-2 py-2 shadow-xs outline-none">
                                    <Switch
                                        aria-describedby={`loan-add-on-description`}
                                        checked={field.value}
                                        className="order-1 h-4 w-6 after:absolute after:inset-0 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                        id="loan-add-on"
                                        onCheckedChange={field.onChange}
                                        tabIndex={0}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <ShapesIcon className="text-primary size-4" />
                                        <div className="flex items-center gap-x-2">
                                            <Label htmlFor={'loan-add-on'}>
                                                Add-On{' '}
                                            </Label>
                                            <p
                                                className="text-muted-foreground"
                                                id="loan-add-on-description"
                                            >
                                                Include Add-On&apos;s
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                        <FormErrorMessage errorMessage={firstError} />
                        <Button className="sticky bottom-0" type="submit">
                            Apply
                        </Button>
                    </fieldset>
                </form>
            </Form>
        </>
    )
}

export default MockLoanInputForm
