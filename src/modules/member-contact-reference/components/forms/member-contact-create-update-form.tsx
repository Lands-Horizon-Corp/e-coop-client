import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { VerifiedPatchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

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
    className,
    ...formProps
}: IMemberContactReferenceFormProps) => {
    const form = useForm<TMemberContactReferenceFormValues>({
        resolver: standardSchemaResolver(MemberContactReferenceSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            contact_number: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateMemberProfileContactReference({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateMemberProfileContactReference({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberContactReferenceFormValues>({
            form,
            ...formProps,
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
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = contactReferenceId ? updateMutation : createMutation

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
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Name *"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Contact Number *"
                            name="contact_number"
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
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
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
                    submitText={contactReferenceId ? 'Update' : 'Create'}
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
            className={cn('', className)}
            description={description}
            title={title}
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
