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
import { Textarea } from '@/components/ui/textarea'

import { IForm, TEntityId } from '@/types'

import {
    useCreateIncludeNegativeAccounts,
    useUpdateIncludeNegativeAccountsById,
} from '../..'
import { IIncludeNegativeAccountsRequest } from '../../include-negative-accounts.types'
import {
    IncludeNegativeAccountsSchema,
    TIncludeNegativeAccountsSchema,
} from '../../include-negative-accounts.validation'

type TFormValues = TIncludeNegativeAccountsSchema

export interface IIncludeNegativeAccountFormProps
    extends IForm<
        Partial<TFormValues>,
        IIncludeNegativeAccountsRequest,
        Error
    > {
    includeNegativeAccountId?: TEntityId
    readOnly?: boolean
    className?: string
    disabledFields?: Path<TFormValues>[]
}

const IncludeNegativeAccountCreateUpdateForm = ({
    includeNegativeAccountId,
    defaultValues,
    onError,
    onSuccess,
    readOnly,
    className,
    disabledFields,
}: IIncludeNegativeAccountFormProps) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(IncludeNegativeAccountsSchema),
        defaultValues: {
            computation_sheet_id: '',
            account_id: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateIncludeNegativeAccounts({
        options: {
            ...withToastCallbacks({
                onSuccess,
                onError,
            }),
        },
    })

    const updateMutation = useUpdateIncludeNegativeAccountsById({
        options: {
            ...withToastCallbacks({
                onSuccess,
                onError,
            }),
        },
    })

    const onSubmit = form.handleSubmit((data) => {
        if (includeNegativeAccountId) {
            updateMutation.mutate({
                id: includeNegativeAccountId,
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
    } = includeNegativeAccountId !== undefined ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

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
                        name="account_id"
                        label="Account"
                        render={({ field }) => (
                            <AccountPicker
                                {...field}
                                hideDescription
                                value={form.getValues('account')}
                                onSelect={(account) => {
                                    field.onChange(account.id)
                                    form.setValue('account', account, {
                                        shouldDirty: true,
                                    })
                                }}
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
                                content={field.value}
                                placeholder="Optional description"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={includeNegativeAccountId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
                />
            </form>
        </Form>
    )
}

export const IncludeNegativeAccountCreateUpdateFormModal = ({
    title = 'Include Negative Account',
    description = 'Specify an account to be treated as a negative inclusion in this computation sheet.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IIncludeNegativeAccountFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <IncludeNegativeAccountCreateUpdateForm
                {...formProps}
                onSuccess={(created) => {
                    formProps?.onSuccess?.(created)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default IncludeNegativeAccountCreateUpdateForm
