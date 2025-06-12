import { Form } from '@/components/ui/form'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Textarea } from '@/components/ui/textarea'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'

import { useAuthUserWithOrg } from '@/store/user-auth-store'

import { IForm, IClassProps, TEntityId } from '@/types'
import {
    IAccountClassification,
    IAccountClassificationRequest,
} from '@/types/coop-types/account-classification'

import {
    useCreateAccountClassification,
    useUpdateAccountClassification,
} from '@/hooks/api-hooks/use-account-classification'

import { cn } from '@/lib/utils'
import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

const AccountClassificationSchema = z.object({
    name: z.string().min(1, 'Classification name is required'),
    description: z.string().optional(),
})

type AccountClassificationFormValues = z.infer<
    typeof AccountClassificationSchema
>

export interface AccountClassificationFormProps
    extends IClassProps,
        IForm<
            Partial<IAccountClassificationRequest>,
            IAccountClassification,
            string,
            AccountClassificationFormValues
        > {
    accountClassificationId?: TEntityId
}

const AccountClassificationCreateUpdateForm = ({
    accountClassificationId,
    readOnly,
    className,
    disabledFields,
    onError,
    onSuccess,
    defaultValues,
}: AccountClassificationFormProps) => {
    const { currentAuth: user } = useAuthUserWithOrg()
    const userType = user.user_organization.user_type
    const branchId = user.user_organization.branch_id
    const organizationId = user.user_organization.organization_id

    const form = useForm<AccountClassificationFormValues>({
        resolver: zodResolver(AccountClassificationSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: defaultValues || {
            name: '',
            description: '',
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        reset: resetCreate,
        mutate: createAccountClassificationMutate,
    } = useCreateAccountClassification({ onSuccess, onError })

    const {
        error: updateError,
        isPending: isUpdating,
        reset: resetUpdate,
        mutate: updateAccountClassification,
    } = useUpdateAccountClassification({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (!userType) {
            onError?.('User type is not defined')
            return
        }
        if (accountClassificationId) {
            updateAccountClassification({
                accountClassificationId: accountClassificationId,
                data: formData,
            })
        } else {
            const requestData: IAccountClassificationRequest = {
                ...formData,
                organization_id: organizationId,
                branch_id: branchId,
            }
            createAccountClassificationMutate(requestData)
        }
    })

    const isPending = isCreating || isUpdating
    const error = createError || updateError

    const isDisabled = (field: Path<AccountClassificationFormValues>) =>
        readOnly || disabledFields?.includes(field) || isPending || false

    const isAccountClassificationOnChanged =
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
                            name="name"
                            label="Classification Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="e.g., Savings, Checking"
                                    disabled={isDisabled(field.name)}
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
                                    placeholder="Optional description for the classification"
                                    className="max-h-40"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
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
                                form.reset(defaultValues)
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
                            disabled={
                                isPending || !isAccountClassificationOnChanged
                            }
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : accountClassificationId ? (
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

export const AccountClassificationFormModal = ({
    title = 'Create Account Classification',
    description = 'Fill out the form to add a new account classification',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<AccountClassificationFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <AccountClassificationCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AccountClassificationCreateUpdateForm
