import { Path, useForm } from 'react-hook-form'

import { zodResolver } from '@hookform/resolvers/zod'

import { cn } from '@/helpers/tw-utils'
import {
    AccountCategoryFormValues,
    AccountCategorySchema,
    IAccountCategory,
    IAccountCategoryRequest,
    useCreate,
    useUpdateById,
} from '@/modules/account-category'
import { useAuthUserWithOrg } from '@/modules/authentication/authgentication.store'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { useAlertBeforeClosing } from '@/hooks/use-alert-before-closing'

import { IClassProps, IForm, TEntityId } from '@/types'

export interface AccountCategoryFormProps
    extends IClassProps,
        IForm<
            Partial<IAccountCategoryRequest>,
            IAccountCategory,
            string,
            AccountCategoryFormValues
        > {
    accountCategoryId?: TEntityId
    organizationId: TEntityId
    branchId: TEntityId
}

const AccountCategoryCreateUpdateForm = ({
    accountCategoryId,
    branchId,
    organizationId,
    readOnly,
    className,
    disabledFields,
    onError,
    onSuccess,
    defaultValues,
}: AccountCategoryFormProps) => {
    const { currentAuth: user } = useAuthUserWithOrg()
    const userType = user.user_organization.user_type

    const form = useForm<AccountCategoryFormValues>({
        resolver: zodResolver(AccountCategorySchema),
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
        mutate: createAccountCategoryMutate,
    } = useCreate({ options: { onSuccess } })

    const {
        error: updateError,
        isPending: isUpdating,
        reset: resetUpdate,
        mutate: updateAccountCategory,
    } = useUpdateById({ options: { onSuccess } })

    const onSubmit = form.handleSubmit((formData) => {
        if (!userType) {
            onError?.('User type is not defined')
            return
        }
        if (accountCategoryId) {
            updateAccountCategory({
                id: accountCategoryId,
                payload: formData,
            })
        } else {
            const requestData: IAccountCategoryRequest = {
                ...formData,
                organization_id: organizationId,
                branch_id: branchId,
            }
            createAccountCategoryMutate(requestData)
        }
    })

    const isPending = isCreating || isUpdating
    const error = createError || updateError

    const isDisabled = (field: Path<AccountCategoryFormValues>) =>
        readOnly || disabledFields?.includes(field) || isPending || false

    const isAccountCategoryOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(defaultValues)

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

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
                            label="Category Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    placeholder="e.g., Assets, Liabilities"
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
                                    placeholder="Optional description for the category"
                                    className="max-h-40"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <Separator />
                <div className="space-y-2">
                    <FormErrorMessage
                        errorMessage={error ? error.toString() : null}
                    />
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
                            disabled={isPending || !isAccountCategoryOnChanged}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : accountCategoryId ? (
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

export const AccountCategoryFormModal = ({
    title = 'Create Account Category',
    description = 'Fill out the form to add a new account category',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<
        AccountCategoryFormProps,
        'className' | 'organizationId' | 'branchId'
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
            <AccountCategoryCreateUpdateForm
                {...formProps}
                branchId={props.branchId}
                organizationId={props.organizationId}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default AccountCategoryCreateUpdateForm
