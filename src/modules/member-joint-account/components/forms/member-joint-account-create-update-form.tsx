import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IMedia } from '@/modules/media'

import RelationshipCombobox from '@/components/comboboxes/relationship-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import SignatureField from '@/components/ui/signature-field'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateMemberJointAccount,
    useUpdateMemberJointAccount,
} from '../../member-joint-account.service'
import { IMemberJointAccount } from '../../member-joint-account.types'
import { MemberJointAccountSchema } from '../../member-joint-account.validation'

type TMemberJointAccountFormValues = z.infer<typeof MemberJointAccountSchema>

export interface IMemberJointAccountFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberJointAccount>,
            IMemberJointAccount,
            Error,
            TMemberJointAccountFormValues
        > {
    memberProfileId: TEntityId
    jointAccountId?: TEntityId
}

const MemberJointAccountCreateUpdateForm = ({
    memberProfileId,
    jointAccountId,
    className,
    ...formProps
}: IMemberJointAccountFormProps) => {
    const form = useForm<TMemberJointAccountFormValues>({
        resolver: standardSchemaResolver(MemberJointAccountSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            first_name: '',
            last_name: '',
            ...formProps.defaultValues,
            birthday: toInputDateString(
                formProps.defaultValues?.birthday ?? new Date()
            ),
        },
    })

    const createMutation = useCreateMemberJointAccount({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateMemberJointAccount({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberJointAccountFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (jointAccountId) {
            updateMutation.mutate({
                memberProfileId,
                jointAccountId,
                data: {
                    ...formData,
                    full_name: `${formData.first_name ?? ''} ${formData.middle_name ?? ''} ${formData.last_name ?? ''} ${formData.suffix ?? ''}`,
                },
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: {
                    ...formData,
                    full_name: `${formData.first_name ?? ''} ${formData.middle_name ?? ''} ${formData.last_name ?? ''} ${formData.suffix ?? ''}`,
                },
            })
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = jointAccountId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                >
                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="picture_media_id"
                            label="Photo"
                            hiddenFields={formProps.hiddenFields}
                            render={({ field }) => {
                                const value = form.watch('picture_media')

                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'picture_media',
                                                newImage
                                            )
                                        }}
                                    />
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="signature_media_id"
                            label="Signature"
                            hiddenFields={formProps.hiddenFields}
                            render={({ field }) => {
                                const value = form.watch('signature_media')
                                return (
                                    <SignatureField
                                        {...field}
                                        placeholder="Signature"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'signature_media',
                                                newImage
                                            )
                                        }}
                                    />
                                )
                            }}
                        />
                    </div>
                    <fieldset className="space-y-3">
                        <div className="space-y-4">
                            <p>Personal Information</p>
                            <div className="grid grid-cols-1 gap-2 sm:grid-cols-10">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="first_name"
                                    label="First Name *"
                                    className="col-span-3"
                                    hiddenFields={formProps.hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="First Name"
                                            autoComplete="given-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="middle_name"
                                    label="Middle Name"
                                    className="col-span-3"
                                    hiddenFields={formProps.hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Middle Name"
                                            autoComplete="additional-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="last_name"
                                    label="Last Name *"
                                    className="col-span-3"
                                    hiddenFields={formProps.hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder="Last Name"
                                            autoComplete="family-name"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="suffix"
                                    label="Suffix"
                                    className="col-span-1"
                                    hiddenFields={formProps.hiddenFields}
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            placeholder=""
                                            autoComplete="honorific-suffix"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                name="birthday"
                                label="Birthday *"
                                className="relative"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        id={field.name}
                                        placeholder="Birthday"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="family_relationship"
                                label="Relationship *"
                                render={({ field }) => (
                                    <RelationshipCombobox
                                        {...field}
                                        id={field.name}
                                        placeholder="Select Relationship"
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    placeholder="Description..."
                                    textEditorClassName="!max-w-none bg-background"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={jointAccountId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const MemberJointAccountCreateUpdateFormModal = ({
    title = 'Create Joint Account',
    description = 'Fill out the form to add or update joint account.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberJointAccountFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('w-full !max-w-2xl', className)}
            {...props}
        >
            <MemberJointAccountCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberJointAccountCreateUpdateForm
