'use client'

import { UseFormReturn, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import {
    ChecklistTemplate,
    ValueChecklistMeter,
} from '@/modules/authentication/components/value-checklist-indicator'
import PermissionPicker from '@/modules/permission-template/components/permission-template-picker'
import PermissionMatrix from '@/modules/permission/components/permission-matrix'
import {
    permissionArrayToMap,
    permissionMapToPermissionArray,
} from '@/modules/permission/permission.utils'
import { IUserOrganization } from '@/modules/user-organization'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { ShieldCheckIcon, VerifiedPatchIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form, FormItem } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import PasswordInput from '@/components/ui/password-input'
import { PhoneInput } from '@/components/ui/phone-input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm } from '@/types'

import { useCreateEmployee } from '../../employee.service'
import { IEmployeeCreateRequest } from '../../employee.types'
import { EmployeeCreateSchema } from '../../employee.validation'

type TEmployeeCreateSchema = z.infer<typeof EmployeeCreateSchema>

export interface IEmployeeCreateFormProps
    extends IClassProps,
        IForm<
            Partial<IEmployeeCreateRequest>,
            IUserOrganization,
            Error,
            TEmployeeCreateSchema
        > {}

const EmployeeCreateForm = ({
    className,
    ...formProps
}: IEmployeeCreateFormProps) => {
    const form = useForm<TEmployeeCreateSchema>({
        resolver: standardSchemaResolver(EmployeeCreateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            first_name: '',
            middle_name: '',
            last_name: '',
            full_name: '',
            suffix: '',
            birthdate: undefined,
            contact_number: '',
            user_name: '',
            email: '',
            password: '',
            confirm_password: '',
            permission_name: '',
            permission_description: '',
            permissions: [],
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateEmployee({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TEmployeeCreateSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        createMutation.mutate({
            data: {
                ...formData,
                full_name:
                    `${formData.first_name} ${formData.middle_name || ''} ${formData.last_name} ${formData.suffix || ''}`.replace(
                        '  ',
                        ' '
                    ),
            } as IEmployeeCreateRequest,
        })
    }, handleFocusError)

    const { error: rawError, isPending, reset } = createMutation
    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full min-w-0 max-w-full flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-6 min-w-0 "
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Employee Photo"
                        name="media_id"
                        render={({ field }) => {
                            const value = form.watch('media')
                            return (
                                <ImageField
                                    {...field}
                                    onChange={(media) => {
                                        field.onChange(media?.id)
                                        form.setValue('media', media)
                                    }}
                                    placeholder="Upload photo"
                                    value={value?.download_url}
                                />
                            )
                        }}
                    />

                    <div className="space-y-2">
                        <div>
                            <p>Personal Information</p>
                            <p className="text-sm text-muted-foreground">
                                Basic details about the employee
                            </p>
                            <Separator className="mt-2" />
                        </div>
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-10">
                            <FormFieldWrapper
                                className="col-span-3"
                                control={form.control}
                                label="First Name *"
                                name="first_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="given-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="First Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-3"
                                control={form.control}
                                label="Middle Name"
                                name="middle_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="additional-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Middle Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-3"
                                control={form.control}
                                label="Last Name *"
                                name="last_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="family-name"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder="Last Name"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                className="col-span-1"
                                control={form.control}
                                label="Suffix"
                                name="suffix"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="honorific-suffix"
                                        disabled={isDisabled(field.name)}
                                        id={field.name}
                                        placeholder=""
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <p>Birth Information</p>
                            <p className="text-sm text-muted-foreground">
                                Date and place of birth
                            </p>
                            <Separator className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                className="relative"
                                control={form.control}
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                label="Date of Birth *"
                                name="birthdate"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <p>Contact & Account</p>
                            <p className="text-sm text-muted-foreground">
                                Contact information and login credentials
                            </p>
                            <Separator className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                label="Contact Number"
                                name="contact_number"
                                render={({
                                    field,
                                    fieldState: { invalid, error },
                                }) => (
                                    <div className="relative flex flex-1 items-center gap-x-2">
                                        <VerifiedPatchIcon
                                            className={cn(
                                                'absolute right-2 top-1/2 z-20 size-4 -translate-y-1/2 text-primary delay-300 duration-300 ease-in-out',
                                                (invalid || error) &&
                                                    'text-destructive'
                                            )}
                                        />
                                        <PhoneInput
                                            {...field}
                                            className="w-full"
                                            defaultCountry="PH"
                                        />
                                    </div>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Email *"
                                name="email"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        autoComplete="email"
                                        id={field.name}
                                        placeholder="example@email.com"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Username *"
                                name="user_name"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        placeholder="Username"
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div>
                            <p>Contact & Account</p>
                            <p className="text-sm text-muted-foreground">
                                Contact information and login credentials
                            </p>
                            <Separator className="mt-2" />
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                            <FormFieldWrapper
                                control={form.control}
                                label="Password"
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <PasswordInput
                                            {...field}
                                            autoComplete="new-password"
                                            defaultVisibility
                                            id={field.name}
                                            placeholder="+8 Character Password"
                                        />
                                        <ValueChecklistMeter
                                            checkList={ChecklistTemplate[
                                                'password-checklist'
                                            ].concat([
                                                {
                                                    regex: /^.{0,50}$/,
                                                    text: 'No more than 50 characters',
                                                },
                                            ])}
                                            hideOnComplete
                                            showChecklist={false}
                                            value={field.value}
                                        />
                                    </FormItem>
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Confirm Password"
                                name="confirm_password"
                                render={({ field }) => (
                                    <FormItem>
                                        <PasswordInput
                                            {...field}
                                            autoComplete="new-password"
                                            defaultVisibility
                                            id={field.name}
                                            placeholder="Confirm password"
                                        />
                                        <ValueChecklistMeter
                                            checkList={ChecklistTemplate[
                                                'password-checklist'
                                            ].concat([
                                                {
                                                    regex: /^.{0,50}$/,
                                                    text: 'No more than 50 characters',
                                                },
                                            ])}
                                            hideOnComplete
                                            showChecklist={false}
                                            value={field.value}
                                        />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </div>

                    <PermissionSection form={form} />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Create"
                />
            </form>
        </Form>
    )
}

const PermissionSection = ({
    form,
}: {
    form: UseFormReturn<IEmployeeCreateRequest>
}) => {
    const permissionTemplate = useModalState()

    return (
        <div className="min-w-0 space-y-4">
            <div>
                <p>Permissions</p>
                <p className="text-sm text-muted-foreground">
                    Define the employee's access level
                </p>
                <Separator className="mt-2" />
            </div>
            <div className="border p-2 rounded-xl flex items-center justify-between bg-card">
                <div>
                    <p>Select permission instead</p>
                    <p className="text-xs text-muted-foreground/80">
                        Choose from pre-configured permission templates based on
                        common roles like Admin, Editor, or Viewer
                    </p>
                </div>
                <PermissionPicker
                    modalState={permissionTemplate}
                    onSelect={(picked) => {
                        form.setValue('permission_name', picked.name)
                        form.setValue(
                            'permission_description',
                            picked.description
                        )
                        form.setValue('permissions', picked.permissions)
                    }}
                    triggerClassName="hidden"
                />
                <Button
                    onClick={() => permissionTemplate.onOpenChange(true)}
                    size="sm"
                    type="button"
                    variant="secondary"
                >
                    <ShieldCheckIcon className="mr-1" />
                    Choose Permission Template
                </Button>
            </div>

            <fieldset className="space-y-3 min-w-0">
                <FormFieldWrapper
                    control={form.control}
                    label="Permission Name *"
                    name="permission_name"
                    render={({ field }) => (
                        <Input
                            {...field}
                            autoComplete="off"
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
                                value: permissionArrayToMap(field.value || []),
                                onValueChange: (value) =>
                                    field.onChange(
                                        permissionMapToPermissionArray(value)
                                    ),
                            }}
                        />
                    )}
                />
            </fieldset>
        </div>
    )
}

export const EmployeeCreateFormModal = ({
    title = 'Create Employee',
    description = 'Fill out the form to create a new employee.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IEmployeeCreateFormProps, 'className'>
}) => {
    return (
        <Modal
            {...props}
            className={cn('w-full !max-w-4xl', className)}
            description={description}
            title={title}
        >
            <EmployeeCreateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default EmployeeCreateForm
