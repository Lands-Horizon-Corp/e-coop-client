import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import { BillIcon, ShieldCheckIcon, WeightScaleIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
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

    const onSubmit = form.handleSubmit((formData) => {
        updateMutation.mutate({ id: userOrganizationId, data: formData })
    })

    const { error, isPending } = updateMutation

    const isDisabled = (field: Path<TUserOrgSettingsFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-3">
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
                                <Input
                                    {...field}
                                    placeholder="Enter user setting description"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

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
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
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
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
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
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                )}
                            />
                        </div>

                        <div className="grid gap-x-4 gap-y-3 md:grid-cols-3">
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
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
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
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
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
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
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
                                        onChange={(e) =>
                                            field.onChange(
                                                Number(e.target.value)
                                            )
                                        }
                                    />
                                )}
                            />
                        </div>

                        <div className="space-y-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="allow_withdraw_negative_balance"
                                render={({ field }) => (
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
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
                                                    Allow Withdraw Negative
                                                    Balance
                                                </Label>
                                                <p
                                                    id={`${field.name}`}
                                                    className="text-xs text-muted-foreground"
                                                >
                                                    Allow withdrawal with
                                                    negative balance for this
                                                    user organization.
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
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
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
                                    <div className="shadow-xs relative flex w-full items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out has-[:checked]:border-primary/30 has-[:checked]:bg-gradient-to-br has-[:checked]:from-primary/50 has-[:checked]:to-primary/10">
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
                    </fieldset>
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
