import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IForm } from '@/types'
import { IClassProps } from '@/types'
import { TEntityId } from '@/types'

import { useCreate, useUpdateById } from '../member-group.service'
import { IMemberGroup, IMemberGroupRequest } from '../member-group.types'
import { MemberGroupSchema } from '../member-group.validation'

type TGroupFormValues = z.infer<typeof MemberGroupSchema>

export interface IMemberGroupFormProps
    extends IClassProps,
        IForm<Partial<IMemberGroupRequest>, IMemberGroup> {
    groupId?: TEntityId
}

const MemberGroupCreateUpdateForm = ({
    groupId,
    className,
    ...formProps
}: IMemberGroupFormProps) => {
    const form = useForm<TGroupFormValues>({
        resolver: standardSchemaResolver(MemberGroupSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreate({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })
    const updateMutation = useUpdateById({
        options: { onSuccess: formProps.onSuccess, onError: formProps.onError },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TGroupFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (groupId) {
            updateMutation.mutate({ id: groupId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = groupId ? updateMutation : createMutation

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
                            label="Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="group-name"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Group Name"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="group-description"
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
                    submitText={groupId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MemberGroupCreateUpdateFormModal = ({
    title = 'Create Group',
    description = 'Fill out the form to add a new group.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberGroupFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberGroupCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberGroupCreateUpdateForm
