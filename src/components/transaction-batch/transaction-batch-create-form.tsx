import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import TextEditor from '../text-editor'
import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import SignatureField from '../ui/signature-field'
import { Separator } from '@/components/ui/separator'
import Modal, { IModalProps } from '@/components/modals/modal'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import { entityIdSchema } from '@/validations/common'
import { useCreateTransactionBatch } from '@/hooks/api-hooks/use-transaction-batch'

import {
    IForm,
    IMedia,
    IClassProps,
    ITransactionBatchMinimal,
    IBatchFundingRequest,
} from '@/types'
import EmployeePicker from '../pickers/employee-picker'

const transactionBatchSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0.01, 'Amount is required'),
    description: z.string().optional(),
    organization_id: z.string().optional(),
    branch_id: z.string().optional(),
    provided_by_user_id: entityIdSchema.min(1, 'Provider is required'),
    provided_by_user: z.any(),
    signature_media_id: z.string().optional(),
    signature_media: z.any(),
})

type TTransactionBatchFormValues = z.infer<typeof transactionBatchSchema>

export interface ITransactionBatchCreateFormProps
    extends IClassProps,
        IForm<
            Partial<IBatchFundingRequest>,
            ITransactionBatchMinimal,
            string,
            TTransactionBatchFormValues
        > {}

const TransactionBatchCreateForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: ITransactionBatchCreateFormProps) => {
    const form = useForm<TTransactionBatchFormValues>({
        resolver: zodResolver(transactionBatchSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            amount: 0,
            description: '',
            provided_by_user_id: '',
            ...defaultValues,
        },
    })

    const isDisabled = (field: Path<TTransactionBatchFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const {
        mutate: createBatch,
        error,
        isPending,
    } = useCreateTransactionBatch({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit(async (formData) => {
        createBatch(formData)
    })

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
                            label="Batch Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Batch Name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div>
                            <p>Starting Balance Info</p>
                            <div className="grid gap-x-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    name="amount"
                                    label="Amount *"
                                    render={({ field }) => (
                                        <Input
                                            {...field}
                                            id={field.name}
                                            type="number"
                                            step="1"
                                            placeholder="Amount"
                                            autoComplete="off"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="provided_by_user_id"
                                    label="Provided By *"
                                    render={({ field }) => (
                                        <EmployeePicker
                                            {...field}
                                            value={form.getValues(
                                                'provided_by_user'
                                            )}
                                            onSelect={(value) => {
                                                form.setValue(
                                                    'provided_by_user_id',
                                                    value.user_id
                                                )
                                                form.setValue(
                                                    'provided_by_user',
                                                    value.user
                                                )
                                            }}
                                            placeholder="Select Employee"
                                            disabled={isDisabled(field.name)}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    name="signature_media_id"
                                    label="Provider Signature"
                                    render={({ field }) => {
                                        const value =
                                            form.watch('signature_media')
                                        return (
                                            <SignatureField
                                                {...field}
                                                placeholder="Signature of the provider that gives the fund"
                                                value={
                                                    value
                                                        ? (value as IMedia)
                                                              .download_url
                                                        : value
                                                }
                                                onChange={(newImage) => {
                                                    if (newImage)
                                                        field.onChange(
                                                            newImage.id
                                                        )
                                                    else
                                                        field.onChange(
                                                            undefined
                                                        )

                                                    form.setValue(
                                                        'signature_media',
                                                        newImage
                                                    )
                                                }}
                                            />
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            name="description"
                            label="Description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    placeholder="Description"
                                    disabled={isDisabled(field.name)}
                                    textEditorClassName="!max-w-none bg-background"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormErrorMessage errorMessage={error} />
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
                            type="button"
                            variant="ghost"
                            onClick={() => form.reset()}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? <LoadingSpinner /> : 'Create'}
                        </Button>
                    </div>
                </div>
            </form>
        </Form>
    )
}

export const TransactionBatchCreateFormModal = ({
    title = 'Create Transaction Batch',
    description = 'Fill out the form to create a new transaction batch.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITransactionBatchCreateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <TransactionBatchCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionBatchCreateForm
