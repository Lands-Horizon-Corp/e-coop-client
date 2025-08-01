import { useEffect } from 'react'
import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form, FormItem } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input'
import { Separator } from '@/components/ui/separator'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/components/value-checklist-indicator'

import { cn } from '@/lib/utils'

import { userSettingsSecuritySchema } from '@/validations/user-settings'

import { useUpdateUserSettingsSecurity } from '@/hooks/api-hooks/use-user-settings'

import { IClassProps, IForm, IUserBase } from '@/types'

type TAccountSecurityFormValues = z.infer<typeof userSettingsSecuritySchema>

export interface IAccountSecurityFormProps
    extends IClassProps,
        IForm<Partial<TAccountSecurityFormValues>, IUserBase, string> {}

const AccountSecurityForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IAccountSecurityFormProps) => {
    const form = useForm<TAccountSecurityFormValues>({
        resolver: zodResolver(userSettingsSecuritySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
            ...defaultValues,
        },
    })

    const updateMutation = useUpdateUserSettingsSecurity({
        onError,
        onSuccess: (newUserData) => {
            onSuccess?.(newUserData)
        },
        showMessage: true,
    })

    const onSubmit = form.handleSubmit((formData) => {
        updateMutation.mutate(formData)
    })

    const { error, isPending } = updateMutation

    const isDisabled = (field: Path<TAccountSecurityFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    useEffect(() => {
        form.reset(defaultValues)
    }, [defaultValues, form])

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
                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="old_password"
                            label="Old Password"
                            render={({ field }) => (
                                <PasswordInput
                                    {...field}
                                    id={field.name}
                                    placeholder="Old Password"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="new_password"
                            render={({ field }) => (
                                <FormItem>
                                    <PasswordInput
                                        {...field}
                                        id={field.name}
                                        placeholder="+8 Character Password"
                                        autoComplete="new-password"
                                    />
                                    <ValueChecklistMeter
                                        value={field.value}
                                        hideOnComplete
                                        checkList={ChecklistTemplate[
                                            'password-checklist'
                                        ].concat([
                                            {
                                                regex: /^.{0,50}$/,
                                                text: 'No more than 50 characters',
                                            },
                                        ])}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="confirm_password"
                            label="Confirm Password"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    placeholder="Confirm your new password"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                {form.formState.isDirty && ( // Only show buttons when the form is dirty
                    <div>
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
                                {isPending ? <LoadingSpinner /> : 'Update'}
                            </Button>
                        </div>
                    </div>
                )}
            </form>
        </Form>
    )
}

export default AccountSecurityForm
