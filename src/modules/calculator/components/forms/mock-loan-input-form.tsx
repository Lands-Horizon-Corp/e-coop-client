import { useEffect } from 'react'

import { UseFormReturn, useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import {
    AccountPicker,
    AccountTypeBadge,
    IAccount,
    useGetAllAccount,
} from '@/modules/account'
import { AccountViewerModal } from '@/modules/account/components/account-viewer/account-viewer'
import { CurrencyInput } from '@/modules/currency'
import WeekdayCombobox from '@/modules/loan-transaction/components/weekday-combobox'
import { LOAN_MODE_OF_PAYMENT } from '@/modules/loan-transaction/loan.constants'
import MemberTypeCombobox from '@/modules/member-type/components/member-type-combobox'
import { XIcon } from 'lucide-react'

import {
    CheckIcon,
    EyeIcon,
    LinkIcon,
    PlusIcon,
    RenderIcon,
    ShapesIcon,
} from '@/components/icons'
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

import { IClassProps, TEntityId } from '@/types'

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
    const form = useForm<TMockCloanInputSchema>({
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
            accounts: [],
            mode_of_payment_fixed_days: undefined,
            mode_of_payment_weekly: 'monday',
            mode_of_payment_semi_monthly_pay_1: undefined,
            mode_of_payment_semi_monthly_pay_2: undefined,
            ...initialData,
        },
    })

    const selectedAccount = form.watch('account')

    const mode_of_payment = form.watch('mode_of_payment')

    const { firstError, formRef } = useFormHelper({
        form,
        autoSave: autoSubmit,
    })

    return (
        <>
            <AccountViewerModal
                {...viewAccountModal}
                accountViewerProps={{
                    accountId: selectedAccount?.id as TEntityId,
                    defaultValue: selectedAccount,
                }}
                description="See full account details."
                title="View Account"
            />
            <Form {...form}>
                <form
                    className={cn('space-y-4', className)}
                    onSubmit={form.handleSubmit(onSubmit)}
                    ref={formRef}
                >
                    <fieldset
                        className="flex flex-col gap-4 group"
                        disabled={disabled || loading}
                    >
                        <div className="flex flex-1 gap-x-3">
                            <ConnectedAccountsSection form={form} />
                            <div className="space-y-3 group flex-1">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Applied Amount *"
                                    name="applied_1"
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            className="bg-background"
                                            currency={
                                                form.watch('account')?.currency
                                            }
                                            onValueChange={(newValue = '') => {
                                                onChange(newValue)
                                            }}
                                            placeholder="Applied Amount"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
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
                                                form.setValue(
                                                    'account',
                                                    account
                                                )
                                                form.setValue('accounts', [])
                                            }}
                                            placeholder="Select Loan Account"
                                            value={form.getValues('account')}
                                        />
                                    )}
                                />
                                <div className="grid grid-cols-2 gap-3">
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Terms *"
                                        name="terms"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                autoComplete="off"
                                                className="bg-background"
                                                id={field.name}
                                                placeholder="Terms"
                                            />
                                        )}
                                    />
                                    <FormFieldWrapper
                                        control={form.control}
                                        label="Member Type"
                                        name={`member_type_id`}
                                        render={({ field }) => (
                                            <MemberTypeCombobox
                                                {...field}
                                                onChange={(memberType) => {
                                                    field.onChange(
                                                        memberType?.id
                                                    )
                                                    form.setValue(
                                                        'member_type',
                                                        memberType
                                                    )
                                                }}
                                                placeholder="Member Type"
                                            />
                                        )}
                                    />
                                </div>
                                <div className="flex max-w-full overflow-x-auto ecoop-scroll items-center gap-3">
                                    <FormFieldWrapper
                                        className="shrink-0 w-fit col-span-4 py-2"
                                        control={form.control}
                                        label="Mode of Payment"
                                        name="mode_of_payment"
                                        render={({ field }) => (
                                            <RadioGroup
                                                className="flex flex-wrap gap-x-2"
                                                onValueChange={field.onChange}
                                                value={field.value ?? ''}
                                            >
                                                {LOAN_MODE_OF_PAYMENT.map(
                                                    (mop) => (
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
                                                                {field.value ===
                                                                    mop && (
                                                                    <CheckIcon className="inline pointer-events-none" />
                                                                )}
                                                            </label>
                                                        </FormItem>
                                                    )
                                                )}
                                            </RadioGroup>
                                        )}
                                    />
                                </div>
                                {mode_of_payment === 'monthly' && (
                                    <FormFieldWrapper
                                        className="mb-1"
                                        control={form.control}
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
                                                    onCheckedChange={(
                                                        switchValue
                                                    ) =>
                                                        field.onChange(
                                                            switchValue
                                                        )
                                                    }
                                                />
                                                <span
                                                    aria-controls={field.name}
                                                    className="group-data-[state=unchecked]:text-muted-foreground/70 flex-1 cursor-pointer text-left text-sm font-medium"
                                                    id={`${field.name}-on`}
                                                    onClick={() =>
                                                        field.onChange(true)
                                                    }
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
                                            control={form.control}
                                            label="Fixed Days"
                                            name="mode_of_payment_fixed_days"
                                            render={({ field }) => (
                                                <Input
                                                    {...field}
                                                    className="bg-background"
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
                                            control={form.control}
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
                                            control={form.control}
                                            label="Pay 1 (Day of Month) *"
                                            name="mode_of_payment_semi_monthly_pay_1"
                                            render={({ field }) => (
                                                <Input {...field} />
                                            )}
                                        />
                                        <FormFieldWrapper
                                            className="col-span-1"
                                            control={form.control}
                                            label="Pay 2 (Day of Month) *"
                                            name="mode_of_payment_semi_monthly_pay_2"
                                            render={({ field }) => (
                                                <Input {...field} />
                                            )}
                                        />
                                    </div>
                                )}
                                <FormFieldWrapper
                                    className="grow"
                                    control={form.control}
                                    name="is_add_on"
                                    render={({ field }) => (
                                        <div className="border-input bg-background has-data-[state=checked]:border-primary/50 border-2 has-data-[state=checked]:bg-primary/20 duration-200 ease-in-out relative flex items-center gap-2 rounded-xl px-2 py-2 shadow-xs outline-none">
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
                                                    <Label
                                                        htmlFor={'loan-add-on'}
                                                    >
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
                                <div className="flex gap-x-2 w-fit items-center">
                                    <FormFieldWrapper
                                        className="mb-1"
                                        control={form.control}
                                        name="exclude_holiday"
                                        render={({ field }) => (
                                            <div className="inline-flex items-center gap-2">
                                                <Switch
                                                    aria-label="Toggle exclude holiday"
                                                    checked={
                                                        field.value || false
                                                    }
                                                    className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                    id={field.name}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                                <Label
                                                    className="shrink-0 text-xs font-medium"
                                                    htmlFor={field.name}
                                                >
                                                    Exclude Holiday
                                                </Label>
                                            </div>
                                        )}
                                    />

                                    <FormFieldWrapper
                                        className="mb-1"
                                        control={form.control}
                                        name="exclude_saturday"
                                        render={({ field }) => (
                                            <div className="inline-flex items-center gap-2">
                                                <Switch
                                                    aria-label="Toggle exclude saturday"
                                                    checked={
                                                        field.value || false
                                                    }
                                                    className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                    id={field.name}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                                <Label
                                                    className="shrink-0 text-xs font-medium"
                                                    htmlFor={field.name}
                                                >
                                                    Exclude Saturday
                                                </Label>
                                            </div>
                                        )}
                                    />

                                    <FormFieldWrapper
                                        className="mb-1"
                                        control={form.control}
                                        name="exclude_sunday"
                                        render={({ field }) => (
                                            <div className="inline-flex items-center gap-2">
                                                <Switch
                                                    aria-label="Toggle exclude sunday"
                                                    checked={
                                                        field.value || false
                                                    }
                                                    className="peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input h-4 w-6 [&_span]:size-3 data-[state=checked]:[&_span]:translate-x-2 data-[state=checked]:[&_span]:rtl:-translate-x-2"
                                                    id={field.name}
                                                    onCheckedChange={
                                                        field.onChange
                                                    }
                                                />
                                                <Label
                                                    className="font-medium text-xs"
                                                    htmlFor={field.name}
                                                >
                                                    Exclude Sunday
                                                </Label>
                                            </div>
                                        )}
                                    />
                                </div>
                            </div>
                        </div>
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

const ConnectedAccountsSection = ({
    form,
}: {
    form: UseFormReturn<TMockCloanInputSchema>
}) => {
    const connectedAccounts: IAccount[] = form.watch('accounts')
    const accountId = form.watch('account_id')
    const accountPickerModal = useModalState()

    const { data } = useGetAllAccount({
        accountId,
        mode: 'loan-account-connections',
        options: {
            enabled: accountId !== undefined,
        },
    })

    const { append, remove: handleRemove } = useFieldArray({
        name: 'accounts',
        control: form.control,
    })

    const selectedAccount = form.watch('account')

    useEffect(() => {
        if (connectedAccounts.length === 0 && data?.length) {
            form.setValue(
                'accounts',
                data.map((data) => ({ ...data, static: true }))
            )
        }
    }, [accountId, connectedAccounts.length, data, form])

    return (
        <div className="space-y-2 p-2 min-w-[200px] rounded-xl bg-popover overflow-y-auto sticky top-0">
            <AccountPicker
                currencyId={selectedAccount?.currency_id}
                modalState={accountPickerModal}
                mode="loan-connectable-account-currency"
                onSelect={(selectedAccount) => {
                    if (
                        connectedAccounts
                            .map(({ id }) => id)
                            .includes(selectedAccount.id)
                    )
                        return toast.warning('Account already connected')

                    append(selectedAccount)
                }}
                triggerClassName="hidden"
            />
            <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-popover-foreground/70">
                    Accounts
                </p>

                <Button
                    className="size-fit p-1"
                    hoverVariant="secondary"
                    onClick={() => accountPickerModal.onOpenChange(true)}
                    size="icon"
                    type="button"
                    variant="ghost"
                >
                    <PlusIcon className="size-3" />
                </Button>
            </div>
            {connectedAccounts.map((account, i) => (
                <ConnectedAccountItem
                    account={account}
                    key={account.id}
                    onRemove={() => handleRemove(i)}
                />
            ))}
        </div>
    )
}

const ConnectedAccountItem = ({
    account,
    onRemove,
}: {
    account: IAccount & { static?: boolean }
    onRemove?: () => void
}) => {
    const viewModalState = useModalState()

    return (
        <>
            <AccountViewerModal
                accountViewerProps={{
                    accountId: account.id,
                    defaultValue: account,
                }}
                {...viewModalState}
            />
            <div
                className={cn(
                    'relative p-3 rounded-md border hover:border-primary cursor-pointer duration-200 text-xs space-y-1 bg-accent/70 gap-x-1 text-accent-foreground',
                    !account.static && 'border-dashed'
                )}
                key={account.id}
                onClick={() => viewModalState.onOpenChange(true)}
            >
                <div className="flex items-center gap-x-2">
                    <RenderIcon className="shrink-0" icon={account.icon} />
                    <p className="flex flex-1 items-center gap-x-2 truncate">
                        {account.currency?.emoji && (
                            <span>{account.currency.emoji}</span>
                        )}
                        {account.name}
                    </p>
                    {!account.static ? (
                        <Button
                            className="size-fit shrink-0 p-1"
                            hoverVariant="destructive"
                            onClick={onRemove}
                            size="icon"
                            variant="ghost"
                        >
                            <XIcon className="size-2" />
                        </Button>
                    ) : (
                        <LinkIcon className="inline size-xs" />
                    )}
                </div>
                <AccountTypeBadge size="xs" type={account.type} />
            </div>
        </>
    )
}

export default MockLoanInputForm
