import { Path, useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { IBatchFundingRequest } from '@/modules/batch-funding'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import { IMedia } from '@/modules/media'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import SignatureField from '@/components/ui/signature-field'

import { IClassProps, IForm } from '@/types'

import { useCreate } from '../../transaction-batch.service'
import { ITransactionBatchMinimal } from '../../transaction-batch.types'
import { TransactionBatchCreateSchema } from '../../transaction-batch.validation'

type TTransactionBatchFormValues = z.infer<typeof TransactionBatchCreateSchema>

export interface ITransactionBatchCreateFormProps
    extends IClassProps,
        IForm<
            Partial<IBatchFundingRequest>,
            ITransactionBatchMinimal,
            Error,
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
        resolver: standardSchemaResolver(TransactionBatchCreateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            amount: 0,
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
        reset,
    } = useCreate({
        options: {
            onSuccess,
            onError,
        },
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
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <div className="space-y-1">
                            <p>Starting Balance Info</p>
                            <div className="grid gap-x-4 space-y-4">
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
                                                field.onChange(value?.user_id)
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
                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText="Create"
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
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
