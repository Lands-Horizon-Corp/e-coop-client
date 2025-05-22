import z from 'zod'
import { useForm, Path } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import { Form } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import TextEditor from '@/components/text-editor'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'
import Modal, { IModalProps } from '@/components/modals/modal'
import EmployeePicker from '@/components/pickers/employee-picker'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import LoadingSpinner from '@/components/spinners/loading-spinner'

import { cn } from '@/lib/utils'
import { entityIdSchema } from '@/validations/common'
import { useCreateBatchFunding } from '@/hooks/api-hooks/use-transaction-batch-funding'

import {
    IForm,
    IMedia,
    TEntityId,
    IClassProps,
    IIntraBatchFunding,
    IIntraBatchFundingRequest,
} from '@/types'

const batchFundingSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    amount: z.coerce.number().min(0.01, 'Amount is required'),
    description: z.string().optional(),
    organization_id: z.string().optional(),
    branch_id: z.string().optional(),
    transaction_batch_id: entityIdSchema.min(1, 'Batch is required'),
    provided_by_user_id: entityIdSchema.min(1, 'Provider is required'),
    provided_by_user: z.any(),
    signature_media_id: z.string().optional(),
    signature_media: z.any(),
})

type TBatchFundingFormValues = z.infer<typeof batchFundingSchema>

export interface IBatchFundingCreateFormProps
    extends IClassProps,
        IForm<
            Partial<IIntraBatchFundingRequest>,
            IIntraBatchFunding,
            string,
            TBatchFundingFormValues
        > {
    transactionBatchId: TEntityId
}

const BatchFundingCreateForm = ({
    readOnly,
    className,
    defaultValues,
    disabledFields,
    transactionBatchId,
    onError,
    onSuccess,
}: IBatchFundingCreateFormProps) => {
    const form = useForm<TBatchFundingFormValues>({
        resolver: zodResolver(batchFundingSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            amount: 0,
            description: '',
            provided_by_user_id: '',
            transaction_batch_id: transactionBatchId,
            ...defaultValues,
        },
    })

    const isDisabled = (field: Path<TBatchFundingFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

    const {
        mutate: createBatchFunding,
        error,
        isPending,
    } = useCreateBatchFunding({
        onSuccess,
        onError,
    })

    const onSubmit = form.handleSubmit(async (formData) => {
        createBatchFunding({
            ...formData,
            transaction_batch_id: transactionBatchId,
        })
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
                            label="Fund Name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Fund Name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
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
                                    value={form.getValues('provided_by_user')}
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
                                const value = form.watch('signature_media')
                                return (
                                    <SignatureField
                                        {...field}
                                        placeholder="Signature of the provider that gives the fund"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'signature_media',
                                                newImage
                                            )
                                        }}
                                    />
                                )
                            }}
                        />

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

export const BatchFundingCreateFormModal = ({
    title = 'Add Batch Funding',
    description = 'Fill out the form to add a new batch funding.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: Omit<IBatchFundingCreateFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <BatchFundingCreateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BatchFundingCreateForm
