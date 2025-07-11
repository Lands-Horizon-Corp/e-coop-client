import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { permissionArrayToMap, permissionMapToPermissionArray } from '@/utils'
import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import PermissionMatrix from '@/components/permission/permission-matrix'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { userOrgPermissionSchema } from '@/validations/form-validation/user-organization-permission-schema'

import { useUpdateUserOrganizationPermission } from '@/hooks/api-hooks/use-user-organization'
import { useModalState } from '@/hooks/use-modal-state'

import {
    IClassProps,
    IForm,
    IUserOrganizationPermissionRequest,
    TEntityId,
} from '@/types'

import { ShieldCheckIcon } from '../icons'
import PermissionPicker from '../pickers/permission-template-picker'

type TUserOrgPermissionFormValues = z.infer<typeof userOrgPermissionSchema>

export interface IUserOrgPermissionUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IUserOrganizationPermissionRequest>,
            IUserOrganizationPermissionRequest,
            string,
            TUserOrgPermissionFormValues
        > {
    userOrganizatrionId: TEntityId
    readOnly?: boolean
}

const UserOrgPermissionUpdateForm = ({
    userOrganizatrionId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: IUserOrgPermissionUpdateFormProps) => {
    const permissionTemplate = useModalState()
    const form = useForm<TUserOrgPermissionFormValues>({
        resolver: zodResolver(userOrgPermissionSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            permission_name: '',
            permission_description: '',
            permissions: [],
            ...defaultValues,
        },
    })

    const updateMutation = useUpdateUserOrganizationPermission({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((formData) => {
        updateMutation.mutate({
            id: userOrganizatrionId,
            data: formData as IUserOrganizationPermissionRequest,
        })
    })

    const { error, isPending } = updateMutation

    const isDisabled = (field: Path<TUserOrgPermissionFormValues>) =>
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
                    <div className="border p-2 rounded-xl flex items-center justify-between bg-card">
                        <div>
                            <p>Select permission instead</p>
                            <p className="text-xs text-muted-foreground/80">
                                Choose from pre-configured permission templates
                                based on common roles like Admin, Editor, or
                                Viewer
                            </p>
                        </div>
                        <PermissionPicker
                            triggerClassName="hidden"
                            modalState={permissionTemplate}
                            onSelect={(picked) =>
                                form.reset({
                                    permission_name: picked.name,
                                    permission_description: picked.description,
                                    permissions: picked.permissions,
                                })
                            }
                        />
                        <Button
                            size="sm"
                            type="button"
                            variant="secondary"
                            onClick={() =>
                                permissionTemplate.onOpenChange(true)
                            }
                        >
                            <ShieldCheckIcon className="mr-1" />
                            Choose Permission Template
                        </Button>
                    </div>

                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="permission_name"
                            label="Permission Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Permission Name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="permission_description"
                            label="Permission Description *"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    placeholder="Describe the permission"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    rows={3}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="permissions"
                            label="Permissions *"
                            render={({ field }) => (
                                <PermissionMatrix
                                    controlledState={{
                                        value: permissionArrayToMap(
                                            field.value
                                        ),
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
                            {isPending ? <LoadingSpinner /> : 'Update'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const UserOrgPermissionUpdateFormModal = ({
    title = 'Update Organization Permission',
    description = 'Update the organization permission details.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IUserOrgPermissionUpdateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('max-w-[95vw]', className)}
            {...props}
        >
            <UserOrgPermissionUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default UserOrgPermissionUpdateForm
