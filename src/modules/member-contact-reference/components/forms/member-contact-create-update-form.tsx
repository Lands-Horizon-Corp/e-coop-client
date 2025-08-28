import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { VerifiedPatchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Textarea } from '@/components/ui/textarea'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateMemberProfileContactReference,
    useUpdateMemberProfileContactReference,
} from '../../member-contact-reference.service'
import { IMemberContactReference } from '../../member-contact-reference.types'
import { MemberContactReferenceSchema } from '../../member-contact-reference.validation'

type TMemberContactReferenceFormValues = z.infer<
    typeof MemberContactReferenceSchema
>

export interface IMemberContactReferenceFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberContactReference>,
            IMemberContactReference,
            Error,
            TMemberContactReferenceFormValues
        > {
    memberProfileId: TEntityId
    contactReferenceId?: TEntityId
}

const MemberContactCreateUpdateForm = ({
    memberProfileId,
    contactReferenceId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberContactReferenceFormProps) => {
    const form = useForm<TMemberContactReferenceFormValues>({
        resolver: standardSchemaResolver(MemberContactReferenceSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            contact_number: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateMemberProfileContactReference({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess,
                onError,
            }),
        },
    })
    const updateMutation = useUpdateMemberProfileContactReference({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess,
                onError,
            }),
        },
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (contactReferenceId) {
            updateMutation.mutate({
                memberProfileId,
                contactReferenceId,
                data: formData,
            })
        } else {
            createMutation.mutate({
                memberProfileId,
                data: formData,
            })
        }
    })

    const { error, isPending, reset } = contactReferenceId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TMemberContactReferenceFormValues>) =>
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
                            name="name"
                            label="Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="contact_number"
                            label="Contact Number *"
                            render={({ field, fieldState: { invalid } }) => (
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
                                    />
                                </div>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Description"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={contactReferenceId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const MemberContactCreateUpdateFormModal = ({
    title = 'Create Contact Reference',
    description = 'Fill out the form to add or update contact reference.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IMemberContactReferenceFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberContactCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberContactCreateUpdateForm
