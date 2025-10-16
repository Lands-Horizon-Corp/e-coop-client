import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account';
import CurrencyCombobox from '@/modules/currency/components/currency-combobox';
import { PaymentTypeCombobox } from '@/modules/transaction';



import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit';
import {
    BillIcon,
    CoinsStackIcon,
    CreditCardIcon,
    InfoIcon,
    ReceiptIcon,
    ShieldCheckIcon,
    WeightScaleIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import InfoTooltip from '@/components/tooltips/info-tooltip'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useUpdateUserOrganizationSettings } from '../../user-organization.service'
import { IUserOrganization } from '../../user-organization.types'
import {
    TUserOrganizationSettingsSchema,
    UserOrganizationSettingsSchema,
} from '../../user-organization.validation'

export type TUserOrgSettingsFormValues = TUserOrganizationSettingsSchema

export interface IUserOrgSettingsFormProps
    extends IClassProps,
        IForm<Partial<TUserOrgSettingsFormValues>, IUserOrganization, Error> {
    mode: 'current' | 'specific'
    userOrganizationId?: TEntityId
}

const UserOrgSettingsForm = ({
    mode,
    readOnly,
    className,
    userOrganizationId,
    defaultValues,
    resetOnDefaultChange,
    onError,
    onSuccess,
}: IUserOrgSettingsFormProps &
    (
        | { mode: 'specific'; userOrganizationId: TEntityId }
        | { mode: 'current' }
    )) => {
    const form = useForm<TUserOrgSettingsFormValues>({
        resolver: standardSchemaResolver(UserOrganizationSettingsSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            user_type: 'member',
            description: '',
            user_setting_description: '',
            user_setting_start_or: 0,
            user_setting_end_or: 0,
            user_setting_used_or: 0,
            user_setting_start_voucher: 0,
            user_setting_end_voucher: 0,
            user_setting_used_voucher: 0,
            user_setting_number_padding: 0,
            allow_withdraw_negative_balance: false,
            allow_withdraw_exact_balance: false,
            maintaining_balance: false,
            ...defaultValues,
        },
    })

    const updateMutation = useUpdateUserOrganizationSettings({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Settings saved',
                textError: 'Failed to save sattings',
                onSuccess: (data) => {
                    form.reset(data)
                    onSuccess?.(data)
                },
                onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TUserOrgSettingsFormValues>({
            form,
            defaultValues,
            resetOnDefaultChange: resetOnDefaultChange,
            autoSave: true,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        await updateMutation.mutateAsync({
            id: userOrganizationId,
            data: formData,
        })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = updateMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-6"
                    disabled={isPending || readOnly}
                >
                    {/* Description Section */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-blue-100 p-2 dark:bg-blue-900/20">
                                <InfoIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    General Information
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    Provide a description and additional details
                                    for the user organization settings.
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className="resize-none"
                                    disabled={isDisabled(field.name)}
                                    placeholder="Enter description (optional)"
                                    rows={3}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="User Setting Description"
                            name="user_setting_description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    className="resize-none"
                                    disabled={isDisabled(field.name)}
                                    placeholder="Enter user setting description"
                                    rows={3}
                                />
                            )}
                        />
                    </div>

                    <Separator />

                    {/* Transaction Automation Section */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-primary/10 p-2 dark:bg-primary/10/20">
                                <ReceiptIcon className="h-5 w-5 text-primary dark:text-primary" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Transaction Automation
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    These fields are used by the system to
                                    automatically generate and manage official
                                    receipt (OR) and voucher numbers. They act
                                    as counters to ensure proper sequencing and
                                    automation.
                                </p>
                            </div>
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                label="Start OR"
                                name="user_setting_start_or"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start OR"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="End OR"
                                name="user_setting_end_or"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="End OR"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Used OR"
                                name="user_setting_used_or"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Used OR"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Start Voucher"
                                name="user_setting_start_voucher"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Start Voucher"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="End Voucher"
                                name="user_setting_end_voucher"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="End Voucher"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Used Voucher"
                                name="user_setting_used_voucher"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Used Voucher"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Number Padding"
                                name="user_setting_number_padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        min="0"
                                        placeholder="Number Padding"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Withdrawal and Balance Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-destructive/40 p-2 dark:bg-destructive/40/20">
                                <BillIcon className="h-5 w-5 text-destructive dark:text-destructive" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Withdrawal and Balance Settings
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    These settings control withdrawal behavior
                                    and balance requirements for the user
                                    organization.
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="allow_withdraw_negative_balance"
                            render={({ field }) => (
                                <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                    <Switch
                                        aria-describedby={`${field.name}`}
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <BillIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Allow Withdraw Negative Balance
                                            </Label>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}`}
                                            >
                                                Allow withdrawal with negative
                                                balance for this user
                                                organization.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="allow_withdraw_exact_balance"
                            render={({ field }) => (
                                <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                    <Switch
                                        aria-describedby={`${field.name}`}
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <WeightScaleIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Allow Withdraw Exact Balance
                                            </Label>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}`}
                                            >
                                                Allow withdrawal of exact
                                                balance amount for this user
                                                organization.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="maintaining_balance"
                            render={({ field }) => (
                                <div className="shadow-xs bg-background/50 relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
                                    <Switch
                                        aria-describedby={`${field.name}`}
                                        checked={field.value}
                                        className="order-1 after:absolute after:inset-0"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onCheckedChange={field.onChange}
                                    />
                                    <div className="flex grow items-center gap-3">
                                        <div className="size-fit rounded-full bg-secondary p-2">
                                            <ShieldCheckIcon />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label htmlFor={field.name}>
                                                Maintaining Balance
                                            </Label>
                                            <p
                                                className="text-xs text-muted-foreground"
                                                id={`${field.name}`}
                                            >
                                                Require maintaining minimum
                                                balance for this user
                                                organization.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        />
                    </div>

                    <Separator />

                    {/* Accounting Default Values */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                                <CreditCardIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">
                                    Accounting Default Values
                                </h3>
                                <p className="text-xs text-muted-foreground">
                                    These settings allow you to configure
                                    default accounts for payment, deposit, and
                                    withdrawal transactions.
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Default Payment Type{' '}
                                    <InfoTooltip content="Select the default payment type to be used for payment transactions. This type will be automatically selected during payment operations, ensuring consistency and efficiency." />
                                </span>
                            }
                            name="settings_payment_type_default_value_id"
                            render={({ field }) => (
                                <PaymentTypeCombobox
                                    onChange={(paymentType) => {
                                        field.onChange(paymentType?.id)
                                    }}
                                    placeholder="Select default payment type"
                                    value={
                                        field.value ? field.value : undefined
                                    }
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Default Account for Payment{' '}
                                    <InfoTooltip content="Select the default account to be used for payment transactions. This account will be automatically selected during payment operations." />
                                </span>
                            }
                            name="settings_accounting_payment_default_value_id"
                            render={({ field }) => (
                                <AccountPicker
                                    disabled={isDisabled(field.name)}
                                    hideDescription
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        form.setValue(
                                            'settings_accounting_payment_default_value',
                                            account
                                        )
                                    }}
                                    placeholder="Select default payment account"
                                    value={form.getValues(
                                        'settings_accounting_payment_default_value'
                                    )}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Default Account for Deposit{' '}
                                    <InfoTooltip content="Select the default account to be used for deposit transactions. This account will be automatically selected during deposit operations." />
                                </span>
                            }
                            name="settings_accounting_deposit_default_value_id"
                            render={({ field }) => (
                                <AccountPicker
                                    disabled={isDisabled(field.name)}
                                    hideDescription
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        form.setValue(
                                            'settings_accounting_deposit_default_value',
                                            account
                                        )
                                    }}
                                    placeholder="Select default deposit account"
                                    value={form.getValues(
                                        'settings_accounting_deposit_default_value'
                                    )}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Default Account for Withdrawal{' '}
                                    <InfoTooltip content="Select the default account to be used for withdrawal transactions. This account will be automatically selected during withdrawal operations." />
                                </span>
                            }
                            name="settings_accounting_withdraw_default_value_id"
                            render={({ field }) => (
                                <AccountPicker
                                    disabled={isDisabled(field.name)}
                                    hideDescription
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        form.setValue(
                                            'settings_accounting_withdraw_default_value',
                                            account
                                        )
                                    }}
                                    placeholder="Select default withdraw account"
                                    value={form.getValues(
                                        'settings_accounting_withdraw_default_value'
                                    )}
                                />
                            )}
                        />
                    </div>

                    <Separator />

                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-purple-100 p-2 dark:bg-purple-900/20">
                                <CoinsStackIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold">Currency</h3>
                                <p className="text-xs text-muted-foreground">
                                    Manage currency settings
                                </p>
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label={
                                <span>
                                    Default Payment Type{' '}
                                    <InfoTooltip content="Select the default payment type to be used for payment transactions. This type will be automatically selected during payment operations, ensuring consistency and efficiency." />
                                </span>
                            }
                            name="settings_currency_default_value_id"
                            render={({ field }) => (
                                <CurrencyCombobox
                                    {...field}
                                    onChange={(currency) => {
                                        field.onChange(currency?.id)
                                    }}
                                    value={field.value}
                                />
                            )}
                        />
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    className="sticky bottom-0 bg-popover rounded-xl p-4"
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                    readOnly={readOnly}
                    submitText={
                        mode === 'current'
                            ? 'Update Current Settings'
                            : 'Update User Settings'
                    }
                />
            </form>
        </Form>
    )
}

export const UserOrgSettingsFormModal = ({
    title = 'User Organization Settings',
    description = 'Update user organization settings.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IUserOrgSettingsFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('max-w-4xl', className)}
            description={description}
            title={title}
            {...props}
        >
            {formProps.mode === 'specific' ? (
                <UserOrgSettingsForm
                    {...formProps}
                    mode="specific"
                    onSuccess={(updatedData) => {
                        formProps?.onSuccess?.(updatedData)
                        props.onOpenChange?.(false)
                    }}
                    userOrganizationId={
                        formProps.userOrganizationId as TEntityId
                    }
                />
            ) : (
                <UserOrgSettingsForm
                    {...formProps}
                    mode="current"
                    onSuccess={(updatedData) => {
                        formProps?.onSuccess?.(updatedData)
                        props.onOpenChange?.(false)
                    }}
                />
            )}
        </Modal>
    )
}

export default UserOrgSettingsForm
