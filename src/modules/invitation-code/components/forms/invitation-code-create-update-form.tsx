import { Path, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toReadableDate } from '@/helpers/date-utils'
import {
    permissionArrayToMap,
    permissionMapToPermissionArray,
} from '@/helpers/permission-utils'
import {
    IInvitationCode,
    IInvitationCodeRequest,
    InviationCodeSchema,
    TInvitationCodeFormValues,
    useCreate,
    useUpdateById,
} from '@/modules/invitation-code'
import { setHours } from 'date-fns'
import { ShieldCheckIcon, UserIcon } from 'lucide-react'

import { UsersAddIcon } from '@/components/icons/index'
import Modal, { IModalProps } from '@/components/modals/modal'
import PermissionMatrix from '@/components/permission/permission-matrix'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'
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
    readOnly,
    className,
    disabledFields,
    onSuccess,
    defaultValues,
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
            ...defaultValues,
            permissions: defaultValues?.permissions ?? [],
            expiration_date: toReadableDate(
                defaultValues?.expiration_date ?? new Date(),
                'yyyy-MM-dd'
            ),
        },
    })

    const {
        mutate: createInvitationCode,
        isPending: isCreating,
        error: createError,
        reset: resetCreate,
    } = useCreate({ options: { onSuccess: onSuccess } })

    const {
        mutate: updateInvitationCode,
        isPending: isUpdating,
        error: updateError,
        reset: resetUpdate,
    } = useUpdateById({ options: { onSuccess: onSuccess } })

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
    })

    const isPending = isCreating || isUpdating
    const error = createError || updateError

    const isDisabled = (field: Path<TInvitationCodeFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isInvitationOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(defaultValues)

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn(
                    'flex w-full flex-col gap-y-4  max-w-full min-w-0',
                    className
                )}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3  max-w-full min-w-0"
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            name="user_type"
                            label="User Type *"
                            render={({ field }) => (
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    disabled={isDisabled(field.name)}
                                    className="flex items-center gap-x-3"
                                >
                                    <div
                                        className={`shadow-xs relative flex w-full cursor-pointer items-start gap-2 rounded-lg border border-input p-4 outline-none duration-200 ease-out ${
                                            field.value === 'employee'
                                                ? 'border-primary/30 bg-primary/40'
                                                : 'hover:border-primary/20'
                                        }`}
                                    >
                                        <RadioGroupItem
                                            value="employee"
                                            id="employee"
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby="employee-description"
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <UsersAddIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="employee"
                                                    className="cursor-pointer"
                                                >
                                                    Employee
                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                                </Label>
                                                <p
                                                    id="employee-description"
                                                    className="text-xs text-muted-foreground"
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
                                            value="member"
                                            id="member"
                                            className="order-1 after:absolute after:inset-0"
                                            aria-describedby="member-description"
                                        />
                                        <div className="flex grow items-center gap-3">
                                            <div className="size-fit rounded-full bg-secondary p-2">
                                                <UserIcon className="h-4 w-4" />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label
                                                    htmlFor="member"
                                                    className="cursor-pointer"
                                                >
                                                    Member
                                                    <span className="text-xs font-normal leading-[inherit] text-muted-foreground"></span>
                                                </Label>
                                                <p
                                                    id="member-description"
                                                    className="text-xs text-muted-foreground"
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
                            name="code"
                            label="Code"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="Code"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <div className="grid grid-cols-1 gap-x-3 gap-y-4 sm:grid-cols-3">
                            <FormFieldWrapper
                                control={form.control}
                                name="expiration_date"
                                label="Expiration Date"
                                className="relative"
                                description="mm/dd/yyyy"
                                descriptionClassName="absolute top-0 right-0"
                                render={({ field }) => (
                                    <InputDate
                                        {...field}
                                        value={field.value ?? ''}
                                        className="block"
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="max_use"
                                label="Max Use"
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Max Use"
                                        type="number"
                                        onChange={(e) => {
                                            field.onChange(
                                                parseInt(e.target.value)
                                            )
                                        }}
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                            <FormFieldWrapper
                                control={form.control}
                                name="current_use"
                                label="curent Use"
                                hiddenFields={
                                    invitationCodeId ? ['max_use'] : []
                                }
                                render={({ field }) => (
                                    <Input
                                        {...field}
                                        placeholder="Max Use"
                                        type="number"
                                        onChange={(e) => {
                                            field.onChange(
                                                parseInt(e.target.value)
                                            )
                                        }}
                                        disabled={isDisabled(field.name)}
                                    />
                                )}
                            />
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    id={field.name}
                                    autoComplete="off"
                                    placeholder="Description"
                                    className="max-h-40"
                                    disabled={isDisabled(field.name)}
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
                        {/* <PermissionPicker
                            triggerClassName="hidden"
                            modalState={permissionTemplate}
                            onSelect={(picked) => {
                                form.setValue('permission_name', picked.name)
                                form.setValue(
                                    'permission_description',
                                    picked.description
                                )
                                form.setValue('permissions', picked.permissions)
                            }}
                        /> */}
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

                    <fieldset className="space-y-3 max-w-full min-w-0">
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
                <Separator />
                <div className="space-y-2">
                    <FormErrorMessage
                        errorMessage={
                            error
                                ? typeof error === 'string'
                                    ? error
                                    : error.message
                                : null
                        }
                    />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                form.reset()
                                resetCreate()
                                resetUpdate()
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending || !isInvitationOnChanged}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : invitationCodeId ? (
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
            title={title}
            description={description}
            className={cn('max-w-[90vw] max-h-[95vh]', className)}
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
