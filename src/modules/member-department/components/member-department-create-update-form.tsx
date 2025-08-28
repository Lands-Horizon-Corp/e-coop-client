import { Path, useForm } from 'react-hook-form'
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

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

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
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IMemberDepartmentFormProps) => {
    const form = useForm<TMemberDepartmentFormValues>({
        resolver: standardSchemaResolver(MemberDepartmentSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            icon: undefined,
            ...defaultValues,
        },
    })

    const createMutation = useCreate({ options: { onSuccess, onError } })
    const updateMutation = useUpdateById({ options: { onSuccess, onError } })

    const onSubmit = form.handleSubmit((formData) => {
        if (memberDepartmentId) {
            updateMutation.mutate({ id: memberDepartmentId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const {
        error: rawError,
        isPending,
        reset,
    } = memberDepartmentId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    const isDisabled = (field: Path<TMemberDepartmentFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

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
                            label="Department Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Department Name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="icon"
                            label="Department Icon"
                            render={({ field }) => (
                                <IconCombobox
                                    value={field.value as TIcon}
                                    placeholder="Select department icon..."
                                    disabled={isDisabled(field.name)}
                                    onChange={(selected) => {
                                        field.onChange(selected || null)
                                    }}
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
                                    autoComplete="off"
                                    placeholder="Department description"
                                    disabled={isDisabled(field.name)}
                                    rows={3}
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
                    submitText={memberDepartmentId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
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
            title={title}
            description={description}
            className={cn('', className)}
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
