import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    IMemberType,
    MemberTypeSchema,
    useCreate,
    useUpdateById,
} from '@/modules/member-type'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

export type TMemberTypeForm = z.infer<typeof MemberTypeSchema>

export interface IMemberTypeCreateUpdateFormProps
    extends IClassProps,
        IForm<Partial<TMemberTypeForm>, IMemberType> {
    memberTypeId?: TEntityId
}

const MemberTypeCreateUpdateForm = ({
    memberTypeId,
    className,
    ...formProps
}: IMemberTypeCreateUpdateFormProps) => {
    const form = useForm<TMemberTypeForm>({
        resolver: standardSchemaResolver(MemberTypeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            prefix: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreate({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const updateMutation = useUpdateById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TMemberTypeForm>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (memberTypeId) {
            updateMutation.mutate({ id: memberTypeId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = memberTypeId ? updateMutation : createMutation

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
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="name"
                            label="Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Member Type Name"
                                    autoComplete="member-type-name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="prefix"
                            label="Prefix"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Prefix"
                                    autoComplete="member-type-prefix"
                                    disabled={isDisabled(field.name)}
                                />
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
                                    autoComplete="member-type-description"
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
                    submitText={memberTypeId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const MemberTypeCreateUpdateFormModal = ({
    title = 'Create Member Type',
    description = 'Fill out the form to add a new member type.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberTypeCreateUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <MemberTypeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberTypeCreateUpdateForm
