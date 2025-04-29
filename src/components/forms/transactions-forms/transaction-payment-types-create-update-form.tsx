import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import {
    useCreateTransactionType,
    useUpdateTransactionType,
} from '@/hooks/api-hooks/transactions/use-transaction-payment-types'
import { TransactionTypeRequestSchema } from '@/validations/transactions/transaction-type-schema'

import { IClassProps } from '@/types'
import { IForm } from '@/types'
import { TEntityId } from '@/types'
import { ITransactionPaymentTypesRequest } from '@/types'
import AccountingChequePicker from '@/components/pickers/accounting-cheque-picker'

type TTransactionTypeFormValues = z.infer<typeof TransactionTypeRequestSchema>

export interface ITransactionTypeFormProps
    extends IClassProps,
        IForm<Partial<ITransactionPaymentTypesRequest>, unknown, string> {
    transactionTypeId?: TEntityId
}

const TransactionTypeCreateUpdateForm = ({
    transactionTypeId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: ITransactionTypeFormProps) => {
    const form = useForm<TTransactionTypeFormValues>({
        resolver: zodResolver(TransactionTypeRequestSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            chequeId: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateTransactionType({ onSuccess })
    const updateMutation = useUpdateTransactionType({ onSuccess, onError })

    const onSubmit = form.handleSubmit((formData) => {
        if (transactionTypeId) {
            updateMutation.mutate({ id: transactionTypeId, data: formData })
        } else {
            createMutation.mutate(formData)
        }
    })

    const { error, isPending } = transactionTypeId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TTransactionTypeFormValues>) =>
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
                            name="name"
                            label="Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Transaction Type Name"
                                    autoComplete="transaction-type-name"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Description"
                                    autoComplete="transaction-type-description"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="chequeId"
                            label="Cheque"
                            render={({ field }) => {
                                return (
                                    <AccountingChequePicker
                                        value={
                                            transactionTypeId
                                                ? defaultValues?.description
                                                : field.value
                                        }
                                        onSelect={(cheque) => {
                                            field.onChange(cheque.id)
                                        }}
                                        placeholder="Select Cheque"
                                    />
                                )
                            }}
                        />
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : transactionTypeId ? (
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

export const TransactionPaymentTypesCreateUpdateFormModal = ({
    title = 'Create Transaction Type',
    description = 'Fill out the form to add a new transaction type.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITransactionTypeFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <TransactionTypeCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionTypeCreateUpdateForm
