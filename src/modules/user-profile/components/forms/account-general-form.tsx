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
                            label="Username"
                            name="user_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Username"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Bio / About"
                            name="description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Write short description about yourself"
                                    textEditorClassName="w-full bg-popover/60 !rounded-xl max-h-32 !max-w-full"
                                />
                            )}
                        />
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="Email"
                                name="email"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Email"
                                    />
                                )}
                            />

                            <FormFieldWrapper
                                control={form.control}
                                label="Contact Number"
                                name="contact_number"
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

export default AccountGeneralForm
