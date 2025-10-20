import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import useActionSecurityStore from '@/store/action-security-store'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { IUserBase } from '../../../user/user.types'
import { useUpdateUserProfile } from '../../user-profile.service'
import { UserProfileSchema } from '../../user-profile.validation'

type TAccountProfileFormValues = z.infer<typeof UserProfileSchema>

export interface IAccountProfileFormProps
    extends IClassProps,
        IForm<Partial<TAccountProfileFormValues>, IUserBase> {}

const AccountProfileForm = ({
    className,
    ...formProps
}: IAccountProfileFormProps) => {
    const form = useForm<TAccountProfileFormValues>({
        resolver: standardSchemaResolver(UserProfileSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            first_name: '',
            middle_name: '',
            last_name: '',
            suffix: '',
            birthdate: toInputDateString(
                formProps.defaultValues?.birthdate ?? new Date()
            ),
            ...formProps.defaultValues,
        },
    })

    const {
        isPending,
        error: rawError,
        mutate,
        reset,
    } = useUpdateUserProfile({
        options: {
            onError: formProps.onError,
            onSuccess: (newData) => {
                form.reset(newData)
                formProps.onSuccess?.(newData)
            },
        },
    })

    const { onOpenSecurityAction } = useActionSecurityStore()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TAccountProfileFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        onOpenSecurityAction({
            title: 'Protected Action',
            description:
                'This action carries significant impact and requires your password for verification.',
            onSuccess: () =>
                mutate({
                    ...formData,
                    full_name: `${formData.first_name || ''} ${formData.middle_name || ''} ${formData.last_name || ''} ${formData.suffix || ''}`,
                }),
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
                            label="First Name"
                            name="first_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="First Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Middle Name"
                            name="middle_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Middle Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Last Name"
                            name="last_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Last Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Suffix"
                            name="suffix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Suffix"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            className="relative"
                            control={form.control}
                            description="mm/dd/yyyy"
                            descriptionClassName="absolute top-0 right-0"
                            hiddenFields={formProps.hiddenFields}
                            label="Date of Birth"
                            name="birthdate"
                            render={({ field }) => (
                                <InputDate
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    value={field.value ?? ''}
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

export const AccountProfileFormModal = ({
    title = 'Edit profile details',
    description = 'Update your profile information here. Changes will be reflected across the platform.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IAccountProfileFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <AccountProfileForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AccountProfileForm
