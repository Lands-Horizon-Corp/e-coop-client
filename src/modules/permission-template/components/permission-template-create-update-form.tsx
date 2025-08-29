import { Path, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import PermissionMatrix from '@/modules/permission/components/permission-matrix'
import { TPermission } from '@/modules/permission/permission.types'
import {
    permissionArrayToMap,
    permissionMapToPermissionArray,
} from '@/modules/permission/permission.utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreatePermissionTemplate,
    useUpdatePermissionTemplateById,
} from '../permission-template.service'
import {
    IPermissionTemplate,
    IPermissionTemplateRequest,
} from '../permission-template.types'
import {
    PermissionTemplateSchema,
    TPermissionTemplateSchema,
} from '../permission-template.validation'

export interface IPermissionTemplateFormProps
    extends IClassProps,
        IForm<Partial<IPermissionTemplateRequest>, IPermissionTemplate, Error> {
    permissionTemplateId?: TEntityId
}

const PermissionTemplateCreateUpdateForm = ({
    readOnly,
    className,
    permissionTemplateId,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IPermissionTemplateFormProps) => {
    const form = useForm<TPermissionTemplateSchema>({
        resolver: standardSchemaResolver(PermissionTemplateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
            ...defaultValues,
        },
    })

    const createMutation = useCreatePermissionTemplate({
        options: {
            ...withToastCallbacks({
                textError: 'Failed to create',
                textSuccess: 'Permission created',
                onError,
                onSuccess,
            }),
        },
    })
    const updateMutation = useUpdatePermissionTemplateById({
        options: {
            ...withToastCallbacks({
                textError: 'Failed to update',
                textSuccess: 'Permission updated',
                onError,
                onSuccess,
            }),
        },
    })

    const onSubmit = form.handleSubmit((formData) => {
        if (permissionTemplateId) {
            updateMutation.mutate({
                id: permissionTemplateId,
                payload: {
                    ...formData,
                    permissions: formData.permissions as TPermission[],
                },
            })
        } else {
            createMutation.mutate({
                ...formData,
                permissions: formData.permissions as TPermission[],
            })
        }
    })

    const { error, isPending, reset } = permissionTemplateId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TPermissionTemplateSchema>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('w-full max-w-full min-w-0 space-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="space-y-4 sm:space-y-3 w-full min-w-0 max-w-full "
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="name"
                        label="Name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                placeholder="Template Name"
                                disabled={isDisabled(field.name)}
                                className="input"
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
                                placeholder="Short Description"
                                disabled={isDisabled(field.name)}
                                className="textarea"
                                // textEditorClassName="bg-background !max-w-none"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="permissions"
                        label="Permissions"
                        render={({ field }) => (
                            <PermissionMatrix
                                controlledState={{
                                    value: permissionArrayToMap(field.value),
                                    onValueChange: (value) =>
                                        field.onChange(
                                            permissionMapToPermissionArray(
                                                value
                                            )
                                        ),
                                }}
                            />
                        )}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    className="sticky bottom-2"
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={permissionTemplateId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const PermissionTemplateCreateUpdateFormModal = ({
    title = 'Create Permission Template',
    description = 'Fill out the form to add a new permission template.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IPermissionTemplateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('!max-w-6xl', className)}
            {...props}
        >
            <PermissionTemplateCreateUpdateForm
                {...formProps}
                className="w-full min-w-0 max-w-full"
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default PermissionTemplateCreateUpdateForm
