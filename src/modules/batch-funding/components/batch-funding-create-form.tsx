import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { CurrencyInput } from '@/modules/currency'
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

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateBatchFunding } from '../batch-funding.service'
import { IBatchFunding, IBatchFundingRequest } from '../batch-funding.types'
import { BatchFundingSchema } from '../batch-funding.validation'

type TBatchFundingFormValues = z.infer<typeof BatchFundingSchema>

export interface IBatchFundingCreateFormProps
    extends IClassProps,
        IForm<
            Partial<IBatchFundingRequest>,
            IBatchFunding,
            Error,
            TBatchFundingFormValues
        > {
    transactionBatchId: TEntityId
}

const BatchFundingCreateForm = ({
    className,
    transactionBatchId,
    ...formProps
}: IBatchFundingCreateFormProps) => {
    const form = useForm<TBatchFundingFormValues>({
        resolver: standardSchemaResolver(BatchFundingSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            amount: 0,
            description: '',
            provided_by_user_id: '',
            transaction_batch_id: transactionBatchId,
            ...formProps.defaultValues,
        },
    })

    const {
        mutate: createBatchFunding,
        error: rawError,
        reset,
        isPending,
    } = useCreateBatchFunding({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TBatchFundingFormValues>({
            form,
            ...formProps,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit(async (formData) => {
        createBatchFunding({
            ...formData,
            transaction_batch_id: transactionBatchId,
        })
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
                            label="Fund Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Fund Name"
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            label="Amount *"
                            name="amount"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    currency={form.watch('currency')}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(newValue) => {
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
                                    value={form.getValues('provided_by_user')}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Provider Signature"
                            name="signature_media_id"
                            render={({ field }) => {
                                const value = form.watch('signature_media')
                                return (
                                    <SignatureField
                                        {...field}
                                        onChange={(newImage) => {
                                            if (newImage)
                                                field.onChange(newImage.id)
                                            else field.onChange(undefined)

                                            form.setValue(
                                                'signature_media',
                                                newImage
                                            )
                                        }}
                                        placeholder="Signature of the provider that gives the fund"
                                        value={
                                            value
                                                ? (value as IMedia).download_url
                                                : value
                                        }
                                    />
                                )
                            }}
                        />

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
            className={cn('', className)}
            description={description}
            title={title}
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
