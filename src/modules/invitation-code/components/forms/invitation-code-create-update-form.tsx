import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import {
    IInvitationCode,
    IInvitationCodeRequest,
    InviationCodeSchema,
    TInvitationCodeFormValues,
    useCreate,
    useUpdateById,
} from '@/modules/invitation-code'
import PermissionPicker from '@/modules/permission-template/components/permission-template-picker'
import PermissionMatrix from '@/modules/permission/components/permission-matrix'
import {
    permissionArrayToMap,
    permissionMapToPermissionArray,
} from '@/modules/permission/permission.utils'
import { setHours } from 'date-fns'
import { ShieldCheckIcon, UserIcon } from 'lucide-react'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { UsersAddIcon } from '@/components/icons/index'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'
import { useModalState } from '@/hooks/use-modal-state'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface InvitationCodeFormProps
    extends IClassProps,
        IForm<
            Partial<TInvitationCodeFormValues>,
            IInvitationCode,
            string,
            TInvitationCodeFormValues
        > {
    invitationCodeId?: TEntityId
}

const InvitationCodeCreateUpdateForm = ({
    invitationCodeId,
    className,
    ...formProps
}: InvitationCodeFormProps) => {
    const permissionTemplate = useModalState()

    const form = useForm<TInvitationCodeFormValues>({
        resolver: standardSchemaResolver(InviationCodeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            code: toReadableDate(new Date(), `'code'-hhmmsssyyyyMMdd`),
            user_type: 'member',
            current_use: 0,
            max_use: 1,
            description: '',
            permission_name: '',
            permission_description: '',
            ...formProps.defaultValues,
            permissions: formProps.defaultValues?.permissions ?? [],
            expiration_date: toReadableDate(
                formProps.defaultValues?.expiration_date ?? new Date(),
                'yyyy-MM-dd'
            ),
        },
    })

    const {
        mutate: createInvitationCode,
        isPending: isCreating,
        error: createError,
        reset: resetCreate,
    } = useCreate({ options: { onSuccess: formProps.onSuccess } })

    const {
        mutate: updateInvitationCode,
        isPending: isUpdating,
        error: updateError,
        reset: resetUpdate,
    } = useUpdateById({ options: { onSuccess: formProps.onSuccess } })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TInvitationCodeFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        const requestData = {
            ...formData,
            expiration_date: setHours(
                new Date(formData.expiration_date),
                24
            ).toISOString(),
        }
        if (invitationCodeId) {
            updateInvitationCode({
                payload: requestData as IInvitationCodeRequest,
                id: invitationCodeId,
            })
        } else {
            createInvitationCode(requestData as IInvitationCodeRequest)
        }
    }, handleFocusError)

    const isPending = isCreating || isUpdating
    const rawError = createError || updateError
    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn(
                    'flex w-full flex-col gap-y-4  max-w-full min-w-0',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3  max-w-full min-w-0"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="User Type *"
                            name="user_type"
                            render={({ field }) => (
                                <RadioGroup
                                    className="flex items-center gap-x-3"
                                    disabled={isDisabled(field.name)}
                                    onValueChange={field.onChange}
                                    value={field.value}
                                >
                                    <div
                                        className={`shadow-xs relative flex w-full cursor-pointer items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out ${
                                            field.value === 'employee'
                                                ? 'border-primary/30 bg-primary/40'
                                                : 'hover:border-primary/20'
                                        }`}
                                    >
                                        <RadioGroupItem
                                            aria-describedby="employee-description"
                                            className="order-1 after:absolute after:inset-0"
                                            id="employee"
                                            value="employee"
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <UsersAddIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label
                                                    className="cursor-pointer"
                                                    htmlFor="employee"
                                                >
                                                    Employee
                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id="employee-description"
                                                >
                                                    Staff member with
                                                    administrative access and
                                                    responsibilities.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div
                                        className={`shadow-xs relative flex w-full cursor-pointer items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out ${
                                            field.value === 'member'
                                                ? 'border-primary/30 bg-primary/40'
                                                : 'hover:border-primary/20'
                                        }`}
                                    >
                                        <RadioGroupItem
                                            aria-describedby="member-description"
                                            className="order-1 after:absolute after:inset-0"
                                            id="member"
                                            value="member"
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label
                                                    className="cursor-pointer"
                                                    htmlFor="member"
                                                >
                                                    Member
                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                                </Label>
                                                <p
                                                    className="text-xs text-muted-foreground"
                                                    id="member-description"
                                                >
                                                    Community member with
                                                    standard user privileges and
                                                    access.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Code"
                            name="code"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Code"
                                />
                            )}
                        />

                        <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-3">
                            <FormFieldWrapper
                                className="relative"
                                control={form.control}
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                label="Expiration Date"
                                name="expiration_date"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        className="block"
                                        disabled={isDisabled(field.name)}
                                        value={field.value ?? ''}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                label="Max Use"
                                name="max_use"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(e) => {
                                            field.onChange(
                                                parseInt(e.target.value)
                                            )
                                        }}
                                        placeholder="Max Use"
                                        type="number"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                hiddenFields={
                                    invitationCodeId ? ['max_use'] : []
                                }
                                label="Current Use"
                                name="current_use"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        disabled={isDisabled(field.name)}
                                        onChange={(e) => {
                                            field.onChange(
                                                parseInt(e.target.value)
                                            )
                                        }}
                                        placeholder="Current Use"
                                        type="number"
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    className="max-h-40"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
                                />
                            )}
                        />
                    </fieldset>
                    <Separator />
                    <div className="border p-2 rounded-xl flex items-center justify-between bg-card">
                        <div>
                            <p>Quick permission template</p>
                            <p className="text-xs text-muted-foreground/80">
                                Choose from pre-configured permission templates
                                based on common roles like Admin, Editor, or
                                Viewer
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

                    <fieldset className="space-y-3 max-w-full min-w-0">
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
                <Separator />
                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        resetCreate()
                        resetUpdate()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={invitationCodeId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

const InvitationCodeCreateUpdateFormModal = ({
    title = 'Create Invitation Code',
    description = 'Fill out the form to add new invitation code',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<InvitationCodeFormProps, 'className' | 'InvitationCodeId'>
}) => {
    return (
        <Modal
            className={cn('!max-w-[90vw] max-h-[95vh]', className)}
            description={description}
            title={title}
            {...props}
        >
            <InvitationCodeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default InvitationCodeCreateUpdateFormModal
