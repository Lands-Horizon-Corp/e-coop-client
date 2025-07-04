import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { toReadableDate } from '@/utils'
import { setHours } from 'date-fns'
import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { stringDateSchema, userAccountTypeSchema } from '@/validations/common'

import {
    useCreateInvitationCode,
    useUpdateInvitationCode,
} from '@/hooks/api-hooks/use-invitation-code'

import { IClassProps, IForm, IInvitationCode, TEntityId } from '@/types'

import { UserIcon, UsersAddIcon } from '../icons'
import FormFieldWrapper from '../ui/form-field-wrapper'
import { Input } from '../ui/input'
import InputDate from '../ui/input-date'
import { Label } from '../ui/label'
import { RadioGroup, RadioGroupItem } from '../ui/radio-group'
import { Textarea } from '../ui/textarea'

const InviationCodeSchema = z.object({
    code: z.string().min(1, 'invitation code is required'),
    expiration_date: stringDateSchema,
    current_use: z.coerce.number().min(0, 'Current use cannot be negative'),
    max_use: z.coerce.number().min(0, 'Current use cannot be negative'),
    description: z.string(),
    user_type: userAccountTypeSchema,
})

type TInvitationCodeFormValues = z.infer<typeof InviationCodeSchema>

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
    onError,
    onSuccess,
    defaultValues,
}: InvitationCodeFormProps) => {
    const form = useForm<TInvitationCodeFormValues>({
        resolver: zodResolver(InviationCodeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            code: toReadableDate(new Date(), `'code'-hhmmsssyyyyMMdd`),
            user_type: 'member',
            current_use: 0,
            max_use: 1,
            description: '',
            ...defaultValues,
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
    } = useCreateInvitationCode({ onSuccess, onError })

    const {
        mutate: updateInvitationCode,
        isPending: isUpdating,
        error: updateError,
        reset: resetUpdate,
    } = useUpdateInvitationCode({ onSuccess, onError })

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
                data: requestData,
                invitationCodeId: invitationCodeId,
            })
        } else {
            createInvitationCode({
                data: requestData,
            })
        }
    })

    const isPending = isCreating || isUpdating
    const error = createError || updateError

    const isDisabled = (field: Path<TInvitationCodeFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isInvitationOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(defaultValues)

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
                        <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
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
                    </fieldset>
                </fieldset>
                <Separator />
                <div className="space-y-2">
                    <FormErrorMessage errorMessage={error} />
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

export const InivationCodeFormModal = ({
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
            className={cn('', className)}
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

export default InvitationCodeCreateUpdateForm
