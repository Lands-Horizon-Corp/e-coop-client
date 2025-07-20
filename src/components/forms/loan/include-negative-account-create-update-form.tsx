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
import { Textarea } from '@/components/ui/textarea'

import { cn } from '@/lib/utils'

import { includeNegativeAccountSchema } from '@/validations/loan/include-negative-accoun-schema'

import {
    useCreateIncludeNegativeAccount,
    useUpdateIncludeNegativeAccount,
} from '@/hooks/api-hooks/loan/use-include-negative-account'

import { IForm, IIncludeNegativeAccountRequest, TEntityId } from '@/types'

type TFormValues = z.infer<typeof includeNegativeAccountSchema>

export interface IIncludeNegativeAccountFormProps
    extends IForm<
        Partial<TFormValues>,
        IIncludeNegativeAccountRequest,
        string
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
        resolver: zodResolver(includeNegativeAccountSchema),
        defaultValues: {
            computation_sheet_id: '',
            account_id: '',
            description: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateIncludeNegativeAccount({
        onSuccess,
        onError,
    })

    const updateMutation = useUpdateIncludeNegativeAccount({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit((data) => {
        if (includeNegativeAccountId) {
            updateMutation.mutate({ id: includeNegativeAccountId, data })
        } else {
            createMutation.mutate(data)
        }
    })

    const { error, isPending } =
        includeNegativeAccountId !== undefined ? updateMutation : createMutation

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
                                onSelect={(account) => {
                                    field.onChange(account.id)
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
                        ) : includeNegativeAccountId ? (
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
