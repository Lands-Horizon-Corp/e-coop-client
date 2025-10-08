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
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            hiddenFields={formProps.hiddenFields}
                            label="Photo"
                            name="picture_media_id"
                            render={({ field }) => {
                                const value = form.watch('picture_media')

                                return (
                                    <ImageField
                                        {...field}
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'picture_media',
                                                newImage
                                            )
                                        }}
                                        placeholder="Upload Photo"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            hiddenFields={formProps.hiddenFields}
                            label="Signature"
                            name="signature_media_id"
                            render={({ field }) => {
                                const value = form.watch('signature_media')
                                return (
                                    <SignatureField
                                        {...field}
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'signature_media',
                                                newImage
                                            )
                                        }}
                                        placeholder="Signature"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
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
                                    className="col-span-3"
                                    control={form.control}
                                    hiddenFields={formProps.hiddenFields}
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
                                    className="col-span-3"
                                    control={form.control}
                                    hiddenFields={formProps.hiddenFields}
                                    label="Middle Name"
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
                                    className="col-span-3"
                                    control={form.control}
                                    hiddenFields={formProps.hiddenFields}
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

                                <FormFieldWrapper
                                    className="col-span-1"
                                    control={form.control}
                                    hiddenFields={formProps.hiddenFields}
                                    label="Suffix"
                                    name="suffix"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            autoComplete="honorific-suffix"
                                            disabled={isDisabled(field.name)}
                                            id={field.name}
                                            placeholder=""
                                        />
                                    )}
                                />
                            </div>
                        </div>
                        <div className="grid gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                className="relative"
                                control={form.control}
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                label="Birthday *"
                                name="birthday"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Birthday"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Relationship *"
                                name="family_relationship"
                                render={({ field }) => (
                                    <RelationshipCombobox
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Select Relationship"
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Description..."
                                    textEditorClassName="!max-w-none bg-background"
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
                    submitText={jointAccountId ? 'Update' : 'Create'}
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
            className={cn('w-full !max-w-2xl', className)}
            description={description}
            title={title}
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
