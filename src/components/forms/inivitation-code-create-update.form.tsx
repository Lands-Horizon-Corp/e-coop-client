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
import { useAuthUser } from '@/store/user-auth-store'
import { Input } from '../ui/input'
import InputDatePicker from '../date-time-pickers/input-date-picker'
import { Textarea } from '../ui/textarea'

import { useCreateInvitationCode } from '@/hooks/api-hooks/use-invitation-code'

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
    InivitationCodeId?: TEntityId
    OrganizationId: TEntityId
    BranchId: TEntityId
}

const InvitationCodeCreateUpdateForm = ({
    InivitationCodeId,
    BranchId,
    OrganizationId,
    readOnly,
    className,
    disabledFields,
    onError,
    onSuccess,
}: InvitationCodeFormProps) => {
    const form = useForm<InvitationCodeFormValues>({
        resolver: zodResolver(InviationCodeSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            code: '',
            description: '',
            current_use: 0,
            expiration_date: new Date(),
        },
    })

    const { currentAuth: user } = useAuthUser()

    const createInivationCodeMutate = useCreateInvitationCode(
        OrganizationId,
        BranchId
    )

    if (!user.user_organization?.user_type) return <>user not found</>
    const userType = user.user_organization.user_type

    const createMutation = createInivationCodeMutate({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (!userType) {
            onError?.('User type is not defined')
            return
        }
        if (InivitationCodeId) {
            // updateMutation.mutate({ InivitationCodeId, data: formData })
        } else {
            const requestData = {
                ...formData,
                user_type: userType,
                expiration_date: formData.expiration_date.toISOString(),
            }
            createMutation.mutate(requestData)
        }
    })

    const { error, isPending, reset } = createMutation

    const isDisabled = (field: Path<InvitationCodeFormValues>) =>
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
                                reset()
                            }}
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
                            ) : InivitationCodeId ? (
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
    formProps?: Omit<
        InvitationCodeFormProps,
        'className' | 'OrganizationId' | 'BranchId'
    >
    organizationId: TEntityId
    branchId: TEntityId
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
                BranchId={props.branchId}
                OrganizationId={props.organizationId}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default InvitationCodeCreateUpdateForm
