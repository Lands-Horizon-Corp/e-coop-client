import { Path, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import PermissionPicker from '@/modules/permission-template/components/permission-template-picker'
import PermissionMatrix from '@/modules/permission/components/permission-matrix'
import {
    permissionArrayToMap,
    permissionMapToPermissionArray,
} from '@/modules/permission/permission.utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { ShieldCheckIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useUpdateUserOrganizationPermission } from '../../user-organization.service'
import { IUserOrganizationPermissionRequest } from '../../user-organization.types'
import {
    TUserOrgPermissionSchema,
    UserOrgPermissionSchema,
} from '../../user-organization.validation'

export interface IUserOrgPermissionUpdateFormProps
    extends IClassProps,
        IForm<
            Partial<IUserOrganizationPermissionRequest>,
            IUserOrganizationPermissionRequest,
            Error,
            TUserOrgPermissionSchema
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
    const form = useForm<TUserOrgPermissionSchema>({
        resolver: standardSchemaResolver(UserOrgPermissionSchema),
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
        options: {
            ...withToastCallbacks({
                onSuccess,
                onError,
            }),
        },
    })

    const onSubmit = form.handleSubmit((formData) => {
        updateMutation.mutate({
            id: userOrganizatrionId,
            data: formData as IUserOrganizationPermissionRequest,
        })
    })

    const { error: rawError, isPending, reset } = updateMutation

    const error = serverRequestErrExtractor({ error: rawError })

    const isDisabled = (field: Path<TUserOrgPermissionSchema>) =>
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
                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText="Update"
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                />
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
            className={cn('!max-w-[95vw]', className)}
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
