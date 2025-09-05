import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IUserBase } from '@/modules/user/user.types'
import useActionSecurityStore from '@/store/action-security-store'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { VerifiedPatchIcon } from '@/components/icons'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useUpdateUserProfileGeneral } from '../../user-profile.service'
import { UserProfileGeneralSchema } from '../../user-profile.validation'

type TAccountGeneralFormValues = z.infer<typeof UserProfileGeneralSchema>

export interface IAccountGeneralFormProps
    extends IClassProps,
        IForm<Partial<TAccountGeneralFormValues>, IUserBase> {
    accountId?: TEntityId
}

export type TFormRef = UseFormReturn<TAccountGeneralFormValues>

const AccountGeneralForm = ({
    className,
    ...formProps
}: IAccountGeneralFormProps) => {
    const form: TFormRef = useForm<TAccountGeneralFormValues>({
        resolver: standardSchemaResolver(UserProfileGeneralSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            user_name: '',
            email: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: update,
        error: rawError,
        isPending,
        reset,
    } = useUpdateUserProfileGeneral({
        options: {
            onError: formProps.onError,
            onSuccess: (userData) => {
                form.reset(userData)
                formProps.onSuccess?.(userData)
            },
        },
    })

    const { onOpenSecurityAction } = useActionSecurityStore()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TAccountGeneralFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        onOpenSecurityAction({
            title: 'Protected Action',
            description:
                'This action carries significant impact and requires your password for verification.',
            onSuccess: () => update(formData),
        })
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <fieldset className="space-y-4">
                        <FormFieldWrapper
                            control={form.control}
                            name="user_name"
                            label="Username"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Username"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Bio / About"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    textEditorClassName="w-full !max-w-full"
                                    placeholder="Write short description about yourself"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="email"
                                label="Email"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        id={field.name}
                                        placeholder="Email"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                name="contact_number"
                                label="Contact Number"
                                render={({
                                    field,
                                    fieldState: { error, invalid },
                                }) => (
                                    <div className="relative flex flex-1 items-center gap-x-2">
                                        <VerifiedPatchIcon
                                            className={cn(
                                                'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                (invalid || error) &&
                                                    'text-destructive'
                                            )}
                                        />
                                        <PhoneInput
                                            {...field}
                                            className="w-full"
                                            defaultCountry="PH"
                                            disabled={isDisabled(field.name)}
                                        />
                                    </div>
                                )}
                            />
                        </div>
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText="Update"
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export default AccountGeneralForm
