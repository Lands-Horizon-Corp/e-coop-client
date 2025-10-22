import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IBatchFundingRequest } from '@/modules/batch-funding'
import { CurrencyCombobox, CurrencyInput } from '@/modules/currency'
import EmployeePicker from '@/modules/employee/components/employee-picker'
import { IMedia } from '@/modules/media'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import SignatureField from '@/components/ui/signature-field'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useCreateTransactionBatch } from '../../transaction-batch.service'
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
    className,
    ...formProps
}: ITransactionBatchCreateFormProps) => {
    const form = useForm<TTransactionBatchFormValues>({
        resolver: standardSchemaResolver(TransactionBatchCreateSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            amount: 0,
            provided_by_user_id: '',
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: createBatch,
        error: rawError,
        isPending,
        reset,
    } = useCreateTransactionBatch({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTransactionBatchFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        createBatch(formData)
    }, handleFocusError)

    const error = serverRequestErrExtractor({ error: rawError })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-x-6 gap-y-4 sm:gap-y-3"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Batch Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Batch Name"
                                />
                            )}
                        />
                        <div className="space-y-1">
                            <p>Starting Balance Info</p>
                            <div className="grid gap-x-4 space-y-4">
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Currency *"
                                    name="currency_id"
                                    render={({ field }) => (
                                        <CurrencyCombobox
                                            {...field}
                                            onChange={(currency) => {
                                                field.onChange(currency?.id)
                                                form.setValue(
                                                    'currency',
                                                    currency
                                                )
                                            }}
                                            value={field.value}
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Amount *"
                                    name="amount"
                                    render={({
                                        field: { onChange, ...field },
                                    }) => (
                                        <CurrencyInput
                                            {...field}
                                            currency={form.watch('currency')}
                                            disabled={isDisabled(field.name)}
                                            onValueChange={(newValue = '') => {
                                                onChange(newValue)
                                            }}
                                            placeholder="Amount"
                                        />
                                    )}
                                />
                                <FormFieldWrapper
                                    control={form.control}
                                    label="Provided By *"
                                    name="provided_by_user_id"
                                    render={({ field }) => (
                                        <EmployeePicker
                                            {...field}
                                            disabled={isDisabled(field.name)}
                                            onSelect={(value) => {
                                                field.onChange(value?.user_id)
                                                form.setValue(
                                                    'provided_by_user',
                                                    value.user
                                                )
                                            }}
                                            placeholder="Select Employee"
                                            value={form.getValues(
                                                'provided_by_user'
                                            )}
                                        />
                                    )}
                                />

                                <FormFieldWrapper
                                    control={form.control}
                                    label="Provider Signature"
                                    name="signature_media_id"
                                    render={({ field }) => {
                                        const value =
                                            form.watch('signature_media')
                                        return (
                                            <SignatureField
                                                {...field}
                                                disabled={isDisabled(
                                                    field.name
                                                )}
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
                                                placeholder="Signature of the provider that gives the fund"
                                                value={
                                                    value
                                                        ? (value as IMedia)
                                                              .download_url
                                                        : value
                                                }
                                            />
                                        )
                                    }}
                                />
                            </div>
                        </div>

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <TextEditor
                                    {...field}
                                    content={field.value}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Description"
                                    textEditorClassName="!max-w-none bg-background"
                                />
                            )}
                        />
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    className="sticky bottom-0"
                    disableSubmit={!form.formState.isDirty}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText="Create"
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
            className={cn('', className)}
            description={description}
            title={title}
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
