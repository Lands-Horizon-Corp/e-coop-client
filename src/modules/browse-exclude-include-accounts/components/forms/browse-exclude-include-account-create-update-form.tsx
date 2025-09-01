'use client'

import { Path, useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'

import { IForm, TEntityId } from '@/types'

import {
    useCreateBrowseExcludeIncludeAccounts,
    useUpdateBrowseExcludeIncludeAccountsById,
} from '../..'
import { IBrowseExcludeIncludeAccountsRequest } from '../../browse-exclude-include-accounts.types'
import {
    BrowseExcludeIncludeAccountsSchema,
    TBrowseExcludeIncludeAccountsSchema,
} from '../../browse-exclude-include-accounts.validation'

export interface IBrowseExcludeIncludeAccountsFormProps
    extends IForm<
        Partial<TBrowseExcludeIncludeAccountsSchema>,
        IBrowseExcludeIncludeAccountsRequest,
        Error
    > {
    browseExcludeIncludeAccountId?: TEntityId
    readOnly?: boolean
    className?: string
    disabledFields?: Path<TBrowseExcludeIncludeAccountsSchema>[]
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
    const form = useForm<TBrowseExcludeIncludeAccountsSchema>({
        resolver: standardSchemaResolver(BrowseExcludeIncludeAccountsSchema),
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

    const createMutation = useCreateBrowseExcludeIncludeAccounts({
        options: {
            ...withToastCallbacks({
                onSuccess,
                onError,
            }),
        },
    })
    const updateMutation = useUpdateBrowseExcludeIncludeAccountsById({
        options: {
            ...withToastCallbacks({
                onSuccess,
                onError,
            }),
        },
    })

    const onSubmit = form.handleSubmit((data) => {
        if (browseExcludeIncludeAccountId) {
            updateMutation.mutate({
                id: browseExcludeIncludeAccountId,
                payload: data,
            })
        } else {
            createMutation.mutate(data)
        }
    })

    const {
        error: rawError,
        isPending,
        reset,
    } = browseExcludeIncludeAccountId !== undefined
        ? updateMutation
        : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    const isDisabled = (field: Path<TBrowseExcludeIncludeAccountsSchema>) =>
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
                                hideDescription
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
                                hideDescription
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
                                hideDescription
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
                                hideDescription
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
                                hideDescription
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

                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={
                        browseExcludeIncludeAccountId ? 'Update' : 'Create'
                    }
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                />
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
