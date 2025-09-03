import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn('flex w-full flex-col gap-y-4', className)}
            >
                <fieldset
                    disabled={isPending || formProps.readOnly}
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
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
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
