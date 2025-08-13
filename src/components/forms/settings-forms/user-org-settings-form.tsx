import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import PaymentTypeComboBox from '@/components/comboboxes/payment-type-combobox'
import InfoTooltip from '@/components/elements/info-tooltip'
import {
    BillIcon,
    CreditCardIcon,
    InfoIcon,
    ReceiptIcon,
    ShieldCheckIcon,
    WeightScaleIcon,
} from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import AccountPicker from '@/components/pickers/account-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { userOrganizationSettingsSchema } from '@/validations/form-validation/settings/user-organization-settings-schema'

import { useUpdateUserOrganizationSettings } from '@/hooks/api-hooks/use-user-organization'
import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, IUserOrganization, TEntityId } from '@/types'

export type TUserOrgSettingsFormValues = z.infer<
    typeof userOrganizationSettingsSchema
>

export interface IUserOrgSettingsFormProps
    extends IClassProps,
        IForm<Partial<TUserOrgSettingsFormValues>, IUserOrganization, string> {
    mode: 'current' | 'specific'
    userOrganizationId?: TEntityId
}

const UserOrgSettingsForm = ({
    mode,
    readOnly,
    className,
    userOrganizationId,
    defaultValues,
    disabledFields,
    resetOnDefaultChange,
    onError,
    onSuccess,
}: IUserOrgSettingsFormProps &
    (
        | { mode: 'specific'; userOrganizationId: TEntityId }
        | { mode: 'current' }
    )) => {
    const form = useForm<TUserOrgSettingsFormValues>({
        resolver: zodResolver(userOrganizationSettingsSchema),
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
        onSuccess: (data) => {
            form.reset(data)
            onSuccess?.(data)
        },
        onError,
    })

    const onSubmit = form.handleSubmit(async (formData) => {
        await updateMutation.mutateAsync({
            id: userOrganizationId,
            data: formData,
        })
    })

    const { error, isPending } = updateMutation

    const isDisabled = (field: Path<TUserOrgSettingsFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    useFormHelper<TUserOrgSettingsFormValues>({
        form,
        defaultValues,
        resetOnDefaultChange: resetOnDefaultChange,
    })

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="space-y-6"
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
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="Enter description (optional)"
                                    className="resize-none"
                                    rows={3}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="user_setting_description"
                            label="User Setting Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    placeholder="Enter user setting description"
                                    className="resize-none"
                                    rows={3}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>

                    <Separator />

                    {/* Transaction Automation Section */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-green-100 p-2 dark:bg-green-900/20">
                                <ReceiptIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
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
                                name="user_setting_start_or"
                                label="Start OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="Start OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="user_setting_end_or"
                                label="End OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="End OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="user_setting_used_or"
                                label="Used OR"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="Used OR"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="user_setting_start_voucher"
                                label="Start Voucher"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="Start Voucher"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="user_setting_end_voucher"
                                label="End Voucher"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="End Voucher"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="user_setting_used_voucher"
                                label="Used Voucher"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="Used Voucher"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="user_setting_number_padding"
                                label="Number Padding"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        type="number"
                                        min="0"
                                        placeholder="Number Padding"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <Separator />

                    {/* Withdrawal and Balance Settings */}
                    <div className="space-y-4 p-4 bg-secondary/60 dark:bg-popover rounded-xl">
                        <div className="flex items-center gap-3">
                            <div className="size-fit rounded-full bg-red-100 p-2 dark:bg-red-900/20">
                                <BillIcon className="h-5 w-5 text-red-600 dark:text-red-400" />
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
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="order-1 after:absolute after:inset-0"
                                        aria-describedby={`${field.name}`}
                                        disabled={isDisabled(field.name)}
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
                                                id={`${field.name}`}
                                                className="text-xs text-muted-foreground"
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
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="order-1 after:absolute after:inset-0"
                                        aria-describedby={`${field.name}`}
                                        disabled={isDisabled(field.name)}
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
                                                id={`${field.name}`}
                                                className="text-xs text-muted-foreground"
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
                                        id={field.name}
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                        className="order-1 after:absolute after:inset-0"
                                        aria-describedby={`${field.name}`}
                                        disabled={isDisabled(field.name)}
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
                                                id={`${field.name}`}
                                                className="text-xs text-muted-foreground"
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
                            name="settings_payment_type_default_value_id"
                            label={
                                <span>
                                    Default Payment Type{' '}
                                    <InfoTooltip content="Select the default payment type to be used for payment transactions. This type will be automatically selected during payment operations, ensuring consistency and efficiency." />
                                </span>
                            }
                            render={({ field }) => (
                                <PaymentTypeComboBox
                                    placeholder="Select default payment type"
                                    value={
                                        field.value ? field.value : undefined
                                    }
                                    onChange={(paymentType) => {
                                        field.onChange(paymentType?.id)
                                    }}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="settings_accounting_payment_default_value_id"
                            label={
                                <span>
                                    Default Account for Payment{' '}
                                    <InfoTooltip content="Select the default account to be used for payment transactions. This account will be automatically selected during payment operations." />
                                </span>
                            }
                            render={({ field }) => (
                                <AccountPicker
                                    value={form.getValues(
                                        'settings_accounting_payment_default_value'
                                    )}
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        form.setValue(
                                            'settings_accounting_payment_default_value',
                                            account
                                        )
                                    }}
                                    placeholder="Select default payment account"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="settings_accounting_deposit_default_value_id"
                            label={
                                <span>
                                    Default Account for Deposit{' '}
                                    <InfoTooltip content="Select the default account to be used for deposit transactions. This account will be automatically selected during deposit operations." />
                                </span>
                            }
                            render={({ field }) => (
                                <AccountPicker
                                    value={form.getValues(
                                        'settings_accounting_deposit_default_value'
                                    )}
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        form.setValue(
                                            'settings_accounting_deposit_default_value',
                                            account
                                        )
                                    }}
                                    placeholder="Select default deposit account"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="settings_accounting_withdraw_default_value_id"
                            label={
                                <span>
                                    Default Account for Withdrawal{' '}
                                    <InfoTooltip content="Select the default account to be used for withdrawal transactions. This account will be automatically selected during withdrawal operations." />
                                </span>
                            }
                            render={({ field }) => (
                                <AccountPicker
                                    value={form.getValues(
                                        'settings_accounting_withdraw_default_value'
                                    )}
                                    onSelect={(account) => {
                                        field.onChange(account?.id)
                                        form.setValue(
                                            'settings_accounting_withdraw_default_value',
                                            account
                                        )
                                    }}
                                    placeholder="Select default withdraw account"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>
                </fieldset>

                <FormErrorMessage errorMessage={error} />

                <fieldset disabled={readOnly || !form.formState.isDirty}>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : mode === 'current' ? (
                                'Update Current Settings'
                            ) : (
                                'Update User Settings'
                            )}
                        </Button>
                    </div>
                </fieldset>
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
            title={title}
            description={description}
            className={cn('max-w-4xl', className)}
            {...props}
        >
            {formProps.mode === 'specific' ? (
                <UserOrgSettingsForm
                    {...formProps}
                    mode="specific"
                    userOrganizationId={
                        formProps.userOrganizationId as TEntityId
                    }
                    onSuccess={(updatedData) => {
                        formProps?.onSuccess?.(updatedData)
                        props.onOpenChange?.(false)
                    }}
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
