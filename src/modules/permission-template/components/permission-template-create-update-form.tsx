import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
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

import { useFormHelper } from '@/hooks/use-form-helper'

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
    className,
    permissionTemplateId,
    ...formProps
}: IPermissionTemplateFormProps) => {
    const form = useForm<TPermissionTemplateSchema>({
        resolver: standardSchemaResolver(PermissionTemplateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreatePermissionTemplate({
        options: {
            ...withToastCallbacks({
                textError: 'Failed to create',
                textSuccess: 'Permission created',
                onError: formProps.onError,
                onSuccess: formProps.onSuccess,
            }),
        },
    })
    const updateMutation = useUpdatePermissionTemplateById({
        options: {
            ...withToastCallbacks({
                textError: 'Failed to update',
                textSuccess: 'Permission updated',
                onError: formProps.onError,
                onSuccess: formProps.onSuccess,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TPermissionTemplateSchema>({
            form,
            ...formProps,
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
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = permissionTemplateId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('w-full max-w-full min-w-0 space-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-4 sm:space-y-3 w-full min-w-0 max-w-full "
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Name"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                className="input"
                                disabled={isDisabled(field.name)}
                                placeholder="Template Name"
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
                                className="textarea"
                                disabled={isDisabled(field.name)}
                                placeholder="Short Description"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Permissions"
                        name="permissions"
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
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={permissionTemplateId ? 'Update' : 'Create'}
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
            className={cn('!max-w-6xl', className)}
            description={description}
            title={title}
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
