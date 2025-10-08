import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreate, useUpdateById } from '../member-department.service'
import {
    IMemberDepartment,
    IMemberDepartmentRequest,
} from '../member-department.types'
import { MemberDepartmentSchema } from '../member-department.validation'

export type TMemberDepartmentFormValues = z.infer<typeof MemberDepartmentSchema>

export interface IMemberDepartmentFormProps
    extends IClassProps,
        IForm<
            Partial<IMemberDepartmentRequest>,
            IMemberDepartment,
            Error,
            TMemberDepartmentFormValues
        > {
    memberDepartmentId?: TEntityId
}

const MemberDepartmentCreateUpdateForm = ({
    memberDepartmentId,
    className,
    ...formProps
}: IMemberDepartmentFormProps) => {
    const form = useForm<TMemberDepartmentFormValues>({
        resolver: standardSchemaResolver(MemberDepartmentSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            icon: undefined,
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
        useFormHelper<TMemberDepartmentFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (memberDepartmentId) {
            updateMutation.mutate({ id: memberDepartmentId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = memberDepartmentId ? updateMutation : createMutation

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
                            label="Department Name *"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Department Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Department Icon"
                            name="icon"
                            render={({ field }) => (
                                <IconCombobox
                                    disabled={isDisabled(field.name)}
                                    onChange={(selected) => {
                                        field.onChange(selected || null)
                                    }}
                                    placeholder="Select department icon..."
                                    value={field.value as TIcon}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Department description"
                                    rows={3}
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
                    submitText={memberDepartmentId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const MemberDepartmentCreateUpdateFormModal = ({
    title = 'Create Member Department',
    description = 'Fill out the form to add a new member department.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IMemberDepartmentFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <MemberDepartmentCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default MemberDepartmentCreateUpdateForm
