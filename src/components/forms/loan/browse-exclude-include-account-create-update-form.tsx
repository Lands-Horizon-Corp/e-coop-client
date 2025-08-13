'use client'

import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { Path, useForm } from 'react-hook-form'

import Modal, { IModalProps } from '@/components/modals/modal'
import AccountPicker from '@/components/pickers/account-picker'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { browseExcludeIncludeAccountsSchema } from '@/validations/loan/browse-exclude-include-accounts-schema'

import {
    useCreateBrowseExcludeIncludeAccount,
    useUpdateBrowseExcludeIncludeAccount,
} from '@/hooks/api-hooks/loan/use-browse-exclude-include-accounts'

import { IBrowseExcludeIncludeAccountsRequest, IForm, TEntityId } from '@/types'

type TFormValues = z.infer<typeof browseExcludeIncludeAccountsSchema>

export interface IBrowseExcludeIncludeAccountsFormProps
    extends IForm<
        Partial<TFormValues>,
        IBrowseExcludeIncludeAccountsRequest,
        string
    > {
    browseExcludeIncludeAccountId?: TEntityId
    readOnly?: boolean
    className?: string
    disabledFields?: Path<TFormValues>[]
}

const BrowseExcludeIncludeAccountsCreateUpdateForm = ({
    browseExcludeIncludeAccountId,
    defaultValues,
    onSuccess,
    onError,
    readOnly,
    className,
    disabledFields,
}: IBrowseExcludeIncludeAccountsFormProps) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(browseExcludeIncludeAccountsSchema),
        defaultValues: {
            computation_sheet_id: '',
            fines_account_id: '',
            comaker_account_id: '',
            interest_account_id: '',
            deliquent_account_id: '',
            include_existing_loan_account_id: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateBrowseExcludeIncludeAccount({
        onSuccess,
        onError,
    })
    const updateMutation = useUpdateBrowseExcludeIncludeAccount({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((data) => {
        if (browseExcludeIncludeAccountId) {
            updateMutation.mutate({ id: browseExcludeIncludeAccountId, data })
        } else {
            createMutation.mutate(data)
        }
    })

    const { error, isPending } =
        browseExcludeIncludeAccountId !== undefined
            ? updateMutation
            : createMutation

    const isDisabled = (field: Path<TFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    return (
        <Form {...form}>
            <form
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || readOnly}
                    className="space-y-4"
                >
                    <FormFieldWrapper
                        control={form.control}
                        name="fines_account_id"
                        label="Fines Account"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                value={form.getValues('fines_account')}
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('fines_account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                disabled={isDisabled('fines_account_id')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="comaker_account_id"
                        label="Comaker Account"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                value={form.getValues('comaker_account')}
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('comaker_account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                disabled={isDisabled('comaker_account_id')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="interest_account_id"
                        label="Interest Account"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                value={form.getValues('interest_account')}
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('interest_account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                disabled={isDisabled('interest_account_id')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="deliquent_account_id"
                        label="Delinquent Account"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                value={form.getValues('deliquent_account')}
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue(
                                        'deliquent_account',
                                        account,
                                        {
                                            shouldDirty: true,
                                        }
                                    )
                                }}
                                disabled={isDisabled('deliquent_account_id')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="include_existing_loan_account_id"
                        label="Existing Loan Account"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                value={form.getValues(
                                    'include_existing_loan_account'
                                )}
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue(
                                        'include_existing_loan_account',
                                        account,
                                        {
                                            shouldDirty: true,
                                        }
                                    )
                                }}
                                disabled={isDisabled(
                                    'include_existing_loan_account_id'
                                )}
                            />
                        )}
                    />
                </fieldset>

                <FormErrorMessage errorMessage={error} />

                <Separator className="my-4" />
                <div className="flex justify-end gap-x-2">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={() => form.reset()}
                        className="px-6"
                    >
                        Reset
                    </Button>
                    <Button type="submit" disabled={isPending} className="px-6">
                        {isPending ? (
                            <LoadingSpinner />
                        ) : browseExcludeIncludeAccountId ? (
                            'Update'
                        ) : (
                            'Create'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export const BrowseExcludeIncludeAccountsCreateUpdateFormModal = ({
    title = 'Browse Excluded/Included Accounts',
    description = 'Specify account roles for this computation sheet.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IBrowseExcludeIncludeAccountsFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <BrowseExcludeIncludeAccountsCreateUpdateForm
                {...formProps}
                onSuccess={(created) => {
                    formProps?.onSuccess?.(created)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BrowseExcludeIncludeAccountsCreateUpdateForm
