import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { AccountPicker } from '@/modules/account'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'

import { useFormHelper } from '@/hooks/use-form-helper'

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
    className?: string
}

const BrowseExcludeIncludeAccountsCreateUpdateForm = ({
    browseExcludeIncludeAccountId,
    className,
    ...formProps
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
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateBrowseExcludeIncludeAccounts({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateBrowseExcludeIncludeAccountsById({
        options: {
            ...withToastCallbacks({
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TBrowseExcludeIncludeAccountsSchema>({
            form,
            ...formProps,
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
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = browseExcludeIncludeAccountId !== undefined
        ? updateMutation
        : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="space-y-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <FormFieldWrapper
                        control={form.control}
                        label="Fines Account"
                        name="fines_account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                disabled={isDisabled('fines_account_id')}
                                hideDescription
                                mode="all"
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('fines_account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                value={form.getValues('fines_account')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Comaker Account"
                        name="comaker_account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                disabled={isDisabled('comaker_account_id')}
                                hideDescription
                                mode="all"
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('comaker_account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                value={form.getValues('comaker_account')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Interest Account"
                        name="interest_account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                disabled={isDisabled('interest_account_id')}
                                hideDescription
                                mode="all"
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('interest_account', account, {
                                        shouldDirty: true,
                                    })
                                }}
                                value={form.getValues('interest_account')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Delinquent Account"
                        name="deliquent_account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                disabled={isDisabled('deliquent_account_id')}
                                hideDescription
                                mode="all"
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
                                value={form.getValues('deliquent_account')}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Existing Loan Account"
                        name="include_existing_loan_account_id"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                disabled={isDisabled(
                                    'include_existing_loan_account_id'
                                )}
                                hideDescription
                                mode="all"
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
                                value={form.getValues(
                                    'include_existing_loan_account'
                                )}
                            />
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={
                        browseExcludeIncludeAccountId ? 'Update' : 'Create'
                    }
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
            className={cn('', className)}
            description={description}
            title={title}
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
