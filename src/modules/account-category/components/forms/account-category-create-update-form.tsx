import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
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
import { useFormHelper } from '@/hooks/use-form-helper'

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
    className,
    ...formProps
}: AccountCategoryFormProps) => {
    const { currentAuth: user } = useAuthUserWithOrg()
    const userType = user.user_organization.user_type

    const form = useForm<AccountCategoryFormValues>({
        resolver: standardSchemaResolver(AccountCategorySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: formProps.defaultValues || {
            name: '',
            description: '',
        },
    })

    const {
        error: createError,
        isPending: isCreating,
        reset: resetCreate,
        mutate: createAccountCategoryMutate,
    } = useCreate({ options: { onSuccess: formProps.onSuccess } })

    const {
        error: updateError,
        isPending: isUpdating,
        reset: resetUpdate,
        mutate: updateAccountCategory,
    } = useUpdateById({ options: { onSuccess: formProps.onSuccess } })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<AccountCategoryFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (!userType) {
            formProps?.onError?.('User type is not defined')
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
    }, handleFocusError)

    const isPending = isCreating || isUpdating
    const error = serverRequestErrExtractor({
        error: createError || updateError,
    })

    const isAccountCategoryOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(formProps.defaultValues)

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

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
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Category Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="e.g., Assets, Liabilities"
                                />
                            )}
                        />

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
                                    placeholder="Optional description for the category"
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
                            className="w-full self-end px-8 sm:w-fit"
                            onClick={() => {
                                form.reset(formProps.defaultValues)
                                resetCreate()
                                resetUpdate()
                            }}
                            size="sm"
                            type="button"
                            variant="ghost"
                        >
                            Reset
                        </Button>
                        <Button
                            className="w-full self-end px-8 sm:w-fit"
                            disabled={isPending || !isAccountCategoryOnChanged}
                            size="sm"
                            type="submit"
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
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <AccountCategoryCreateUpdateForm
                {...formProps}
                branchId={props.branchId}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
                organizationId={props.organizationId}
            />
        </Modal>
    )
}

export default AccountCategoryCreateUpdateForm
