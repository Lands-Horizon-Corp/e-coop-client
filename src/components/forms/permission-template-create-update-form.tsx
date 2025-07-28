import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import {
    permissionArrayToMap,
    permissionMapToPermissionArray,
} from '@/utils/permission-utils'
import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { permissionTemplateSchema } from '@/validations/form-validation/permission-template'

import {
    useCreatePermissionTemplate,
    useUpdatePermissionTemplate,
} from '@/hooks/api-hooks/use-permission-template'

import {
    IClassProps,
    IForm,
    IPermissionTemplate,
    IPermissionTemplateRequest,
    TEntityId,
    TPermission,
} from '@/types'

import PermissionMatrix from '../permission/permission-matrix'
import { Textarea } from '../ui/textarea'

type TFormValues = z.infer<typeof permissionTemplateSchema>

export interface IPermissionTemplateFormProps
    extends IClassProps,
        IForm<
            Partial<IPermissionTemplateRequest>,
            IPermissionTemplate,
            string
        > {
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
    const form = useForm<TFormValues>({
        resolver: zodResolver(permissionTemplateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            permissions: [],
            ...defaultValues,
        },
    })

    const createMutation = useCreatePermissionTemplate({ onSuccess, onError })
    const updateMutation = useUpdatePermissionTemplate({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (permissionTemplateId) {
            updateMutation.mutate({
                permissionTemplateId,
                data: {
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

    const { error, isPending } = permissionTemplateId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TFormValues>) =>
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
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : permissionTemplateId ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
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
            className={cn('max-w-6xl', className)}
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
