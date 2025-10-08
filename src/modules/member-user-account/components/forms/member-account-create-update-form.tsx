import { useEffect } from 'react'

import { useForm, useWatch } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/modules/authentication/components/value-checklist-indicator'
import { IMemberProfile } from '@/modules/member-profile'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { VerifiedPatchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form, FormItem } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import PasswordInput from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateMemberProfileUserAccount,
    useUpdateMemberProfileUserAccount,
} from '../../member-user-account.service'
import { IMemberProfileUserAccountRequest } from '../../member-user-account.types'
import { MemberProfileUserAccountSchema } from '../../member-user-account.validation'

type TForm = z.infer<typeof MemberProfileUserAccountSchema>

interface IMemberUserAccountFormProps
    extends IClassProps,
        IForm<Partial<TForm>, IMemberProfile, Error> {
    memberProfileId: TEntityId
    userId?: TEntityId
}

const MemberUserAccountCreateUpdateForm = ({
    userId,
    memberProfileId,
    className,
    ...formProps
}: IMemberUserAccountFormProps) => {
    const form = useForm<TForm>({
        resolver: standardSchemaResolver(MemberProfileUserAccountSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            email: '',
            user_name: '',
            first_name: '',
            last_name: '',
            full_name: '',
            contact_number: '',
            middle_name: '',
            suffix: '',
            ...formProps.defaultValues,
            with_password: formProps.defaultValues?.with_password ?? false,
            birthdate: toReadableDate(new Date(), 'yyyy-MM-dd'),
        },
    })

    const first_name = useWatch({ control: form.control, name: 'first_name' })
    const middle_name = useWatch({ control: form.control, name: 'middle_name' })
    const last_name = useWatch({ control: form.control, name: 'last_name' })
    const suffix = useWatch({ control: form.control, name: 'suffix' })

    const with_password = useWatch({
        control: form.control,
        name: 'with_password',
    })

    useEffect(() => {
        const fullName = [first_name, middle_name, last_name]
            .filter((name) => name && name.trim() !== '')
            .join(' ')
        form.setValue('full_name', suffix ? `${fullName}, ${suffix}` : fullName)
    }, [first_name, middle_name, last_name, suffix, form])

    const createMutation = useCreateMemberProfileUserAccount({
        options: {
            ...withToastCallbacks({
                onError: formProps.onError,
                onSuccess: formProps.onSuccess,
                textSuccess: 'Created member user account',
                textError: 'Failed to create member user account',
            }),
        },
    })

    const updateMutation = useUpdateMemberProfileUserAccount({
        options: {
            ...withToastCallbacks({
                onError: formProps.onError,
                onSuccess: formProps.onSuccess,
                textSuccess: 'Updated member user account',
                textError: 'Failed to update member user account',
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } = useFormHelper<TForm>({
        form,
        ...formProps,
    })

    const handleSubmit = form.handleSubmit((formData: TForm) => {
        const finalPayload: IMemberProfileUserAccountRequest = {
            ...formData,
            birthdate: new Date(formData.birthdate).toISOString(),
        }

        if (userId === undefined)
            return createMutation.mutate({
                memberProfileId,
                data: finalPayload,
            })

        return updateMutation.mutate({
            userId,
            memberProfileId,
            data: finalPayload,
        })
    }, handleFocusError)

    const {
        isPending: isLoading,
        error: rawError,
        reset,
    } = userId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={handleSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid grid-cols-1 gap-x-6 gap-y-8"
                    disabled={isLoading || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <legend>Personal Information</legend>
                        <div className="grid grid-cols-3 gap-x-2">
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="First Name *"
                                name="first_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="given-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="First Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="Middle Name *"
                                name="middle_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="additional-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Middle Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="Last Name *"
                                name="last_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="family-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Last Name"
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            className="relative"
                            control={form.control}
                            description="mm/dd/yyyy"
                            descriptionClassName="absolute top-0 right-0"
                            label="Date of Birth *"
                            name="birthdate"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    className="block"
                                    disabled={isDisabled(field.name)}
                                    value={field.value ?? ''}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Contact Number"
                            name="contact_number"
                            render={({
                                field,
                                fieldState: { invalid, error },
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
                    </fieldset>

                    <fieldset className="space-y-3">
                        <legend>Credentials</legend>

                        <FormFieldWrapper
                            control={form.control}
                            label="User Name *"
                            name="user_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="username"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Username"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Email *"
                            name="email"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="email"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="example@email.com"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label={`Password ${!userId ? '*' : ''}`}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <PasswordInput
                                        {...field}
                                        autoComplete="new-password"
                                        defaultVisibility
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        onChange={(e) => {
                                            const inputValue = e.target.value

                                            form.setValue(
                                                'with_password',
                                                inputValue !== undefined &&
                                                    inputValue.length > 0
                                            )

                                            field.onChange(e)
                                        }}
                                        placeholder="+8 Character Password"
                                    />
                                    {with_password && (
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
                                            value={field.value ?? ''}
                                        />
                                    )}
                                </FormItem>
                            )}
                        />
                    </fieldset>
                </fieldset>
                {userId === undefined && (
                    <div className="grid gap-2">
                        <p className="text-xs text-muted-foreground">
                            Make sure the member agrees to the eCoop{' '}
                            <a className="font-medium underline">
                                terms of service
                            </a>
                            ,{' '}
                            <a className="font-medium underline">
                                privacy policy
                            </a>
                            , and{' '}
                            <a className="font-medium underline">
                                notification settings
                            </a>
                        </p>
                    </div>
                )}
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isLoading}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={userId === undefined ? 'Create' : 'Update'}
                />
            </form>
        </Form>
    )
}

export const MemberUserAccountCreateUpdateFormModal = ({
    title = 'Setup Member User Account',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberUserAccountFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('w-fit !max-w-7xl', className)}
            title={title}
            {...props}
        >
            <MemberUserAccountCreateUpdateForm
                {...formProps}
                className="mt-4"
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberUserAccountCreateUpdateForm
