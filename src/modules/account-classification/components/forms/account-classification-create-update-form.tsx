import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import {
    AccountClassificationFormValues,
    AccountClassificationSchema,
    IAccountClassification,
    IAccountClassificationRequest,
    useUpdateById,
} from '@/modules/account-classification'
import { useCreate } from '@/modules/account-classification'
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
    className,
    ...formProps
}: AccountClassificationFormProps) => {
    const { currentAuth: user } = useAuthUserWithOrg()
    const userType = user.user_organization.user_type
    const branchId = user.user_organization.branch_id
    const organizationId = user.user_organization.organization_id

    const form = useForm<AccountClassificationFormValues>({
        resolver: standardSchemaResolver(AccountClassificationSchema),
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
        mutate: createAccountClassificationMutate,
    } = useCreate({
        options: { onSuccess: formProps.onSuccess },
    })

    const {
        error: updateError,
        isPending: isUpdating,
        reset: resetUpdate,
        mutate: updateAccountClassification,
    } = useUpdateById({ options: { onSuccess: formProps.onSuccess } })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<AccountClassificationFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (!userType) {
            formProps.onError?.('User type is not defined')
            return
        }
        if (accountClassificationId) {
            updateAccountClassification({
                id: accountClassificationId,
                payload: formData,
            })
        } else {
            const requestData: IAccountClassificationRequest = {
                ...formData,
                organization_id: organizationId,
                branch_id: branchId,
            }
            createAccountClassificationMutate(requestData)
        }
    }, handleFocusError)

    const isPending = isCreating || isUpdating
    const error = createError || updateError

    const isAccountClassificationOnChanged =
        JSON.stringify(form.watch()) !== JSON.stringify(formProps.defaultValues)

    const isDirty = Object.keys(form.formState.dirtyFields).length > 0

    useAlertBeforeClosing(isDirty)

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
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
                    <FormErrorMessage
                        errorMessage={error ? error.toString() : null}
                    />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                form.reset(formProps.defaultValues)
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

export default AccountClassificationFormModal
