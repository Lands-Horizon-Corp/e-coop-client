import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import FormFieldWrapper from '../ui/form-field-wrapper'
import { useAuthUserWithOrg } from '@/store/user-auth-store'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'

import InputDatePicker from '../date-time-pickers/input-date-picker'

import {
    useCreateInvitationCode,
    useUpdateInvitationCode,
} from '@/hooks/api-hooks/use-invitation-code'

import { cn } from '@/lib/utils'

import {
    IForm,
    IClassProps,
    IInvitationCode,
    IInvitationCodeRequest,
    TEntityId,
} from '@/types'

const InviationCodeSchema = z.object({
    code: z.string().min(1, 'invitation code is required'),
    expiration_date: z.date().refine((date) => date !== undefined, {
        message: 'Expiration date is Required',
    }),
    current_use: z.coerce.number().min(0, 'Current use cannot be negative'),
    max_use: z.coerce.number().min(0, 'Current use cannot be negative'),
    description: z.string(),
})

type InvitationCodeFormValues = z.infer<typeof InviationCodeSchema>

export interface InvitationCodeFormProps
    extends IClassProps,
        IForm<
            Partial<IInvitationCodeRequest>,
            IInvitationCode,
            string,
            InvitationCodeFormValues
        > {
    InvitationCodeId?: TEntityId
}

const InvitationCodeCreateUpdateForm = ({
    InvitationCodeId,
    readOnly,
    className,
    disabledFields,
    onError,
    onSuccess,
    defaultValues,
}: InvitationCodeFormProps) => {
    const { currentAuth: user } = useAuthUserWithOrg()
    const userType = user.user_organization.user_type
    const branchId = user.user_organization.branch_id
    const organizationId = user.user_organization.organization_id

    const formDefaultValues: InvitationCodeFormValues = defaultValues
        ? {
              code: defaultValues.code || '',
              expiration_date: defaultValues.expiration_date
                  ? new Date(defaultValues.expiration_date)
                  : new Date(),
              current_use: defaultValues.current_use || 0,
              max_use: defaultValues.max_use || 0,
              description: defaultValues.description || '',
          }
        : {
              max_use: 0,
              code: '',
              description: '',
              current_use: 0,
              expiration_date: new Date(),
          }

    const form = useForm<InvitationCodeFormValues>({
        resolver: zodResolver(InviationCodeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: formDefaultValues,
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
        if (!userType) {
            onError?.('User type is not defined')
            return
        }
        const requestData = {
            ...formData,
            user_type: userType,
            branchId: branchId,
            organizationId: organizationId,
            expiration_date: formData.expiration_date.toISOString(),
        }
        if (InvitationCodeId) {
            updateInvitationCode({
                data: requestData,
                invitationCodeId: InvitationCodeId,
            })
        } else {
            createInvitationCode({
                data: requestData,
            })
        }
    })

    const isPending = isCreating || isUpdating
    const error = createError || updateError

    const isDisabled = (field: Path<InvitationCodeFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const isInvitationOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(formDefaultValues)

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
                            render={({ field }) => {
                                return (
                                    <InputDatePicker
                                        id={field.name}
                                        value={field.value}
                                        onChange={field.onChange}
                                        captionLayout="dropdown-buttons"
                                        disabled={(date) => date < new Date()}
                                    />
                                )
                            }}
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
                            ) : InvitationCodeId ? (
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
