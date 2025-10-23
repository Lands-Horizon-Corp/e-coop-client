import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/modules/authentication/components/value-checklist-indicator'
import { IUserBase } from '@/modules/user/user.types'
import useConfirmModalStore from '@/store/confirm-modal-store'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { Form, FormItem } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import PasswordInput from '@/components/ui/password-input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useUpdateUserProfileSecurity } from '../../user-profile.service'
import { UserProfileSecuritySchema } from '../../user-profile.validation'

type TAccountSecurityFormValues = z.infer<typeof UserProfileSecuritySchema>

export interface IAccountSecurityFormProps
    extends IClassProps,
        IForm<Partial<TAccountSecurityFormValues>, IUserBase> {}

const AccountSecurityForm = ({
    className,
    ...formProps
}: IAccountSecurityFormProps) => {
    const { onOpen } = useConfirmModalStore()

    const form = useForm<TAccountSecurityFormValues>({
        resolver: standardSchemaResolver(UserProfileSecuritySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            old_password: '',
            new_password: '',
            confirm_password: '',
            ...formProps.defaultValues,
        },
    })

    const {
        error: rawError,
        mutate,
        isPending,
        reset,
    } = useUpdateUserProfileSecurity({
        options: {
            onError: formProps.onError,
            onSuccess: (newUserData) => {
                formProps.onSuccess?.(newUserData)
                toast.success('Your password has been changed!')
                form.reset()
            },
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TAccountSecurityFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        onOpen({
            title: 'Change Password',
            description:
                'Are you sure to change your password? You will be signed out after saving. Continue?',
            onConfirm: () => mutate(formData),
        })
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            label="Old Password"
                            name="old_password"
                            render={({ field }) => (
                                <PasswordInput
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Old Password"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="New Password"
                            name="new_password"
                            render={({ field }) => (
                                <FormItem>
                                    <PasswordInput
                                        {...field}
                                        autoComplete="new-password"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="+8 Character Password"
                                    />
                                    <ValueChecklistMeter
                                        checkList={ChecklistTemplate[
                                            'password-checklist'
                                        ].concat([
                                            {
                                                regex: /^.{0,50}$/,
                                                text: 'No more than 50 characters',
                                            },
                                        ])}
                                        hideOnComplete
                                        value={field.value}
                                    />
                                </FormItem>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Confirm Password"
                            name="confirm_password"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Confirm your new password"
                                    type="password"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Update"
                />
            </form>
        </Form>
    )
}

export default AccountSecurityForm
