import { useForm } from 'react-hook-form'

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

import { useFormHelper } from '@/hooks/use-form-helper'
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
}

const UserOrgPermissionUpdateForm = ({
    userOrganizatrionId,
    className,
    ...formProps
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
            ...formProps.defaultValues,
        },
    })

    const updateMutation = useUpdateUserOrganizationPermission({
        options: {
            ...withToastCallbacks({
                textSuccess: 'User permission saved',
                textError: 'Failed to update user permission',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TUserOrgPermissionSchema>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        updateMutation.mutate({
            id: userOrganizatrionId,
            data: formData as IUserOrganizationPermissionRequest,
        })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = updateMutation

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
                            modalState={permissionTemplate}
                            onSelect={(picked) =>
                                form.reset({
                                    permission_name: picked.name,
                                    permission_description: picked.description,
                                    permissions: picked.permissions,
                                })
                            }
                            triggerClassName="hidden"
                        />
                        <Button
                            onClick={() =>
                                permissionTemplate.onOpenChange(true)
                            }
                            size="sm"
                            type="button"
                            variant="secondary"
                        >
                            <ShieldCheckIcon className="mr-1" />
                            Choose Permission Template
                        </Button>
                    </div>

                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Permission Name *"
                            name="permission_name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Permission Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Permission Description *"
                            name="permission_description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Describe the permission"
                                    rows={3}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Permissions *"
                            name="permissions"
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
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Update"
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
            className={cn('!max-w-[95vw]', className)}
            description={description}
            title={title}
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
