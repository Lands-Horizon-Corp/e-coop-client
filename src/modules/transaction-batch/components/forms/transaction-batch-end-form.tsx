import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { IMedia } from '@/modules/media'
import useActionSecurityStore from '@/store/action-security-store'

import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import SignatureField from '@/components/ui/signature-field'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm } from '@/types'

import { useTransactionBatchEndCurrentBatch } from '../../transaction-batch.service'
import {
    ITransactionBatchEndRequest,
    ITransactionBatchMinimal,
} from '../../transaction-batch.types'
import { TransactionBatchEndSchema } from '../../transaction-batch.validation'

type TTransactionBatchEndFormValues = z.infer<typeof TransactionBatchEndSchema>

export interface ITransactionBatchEndFormProps
    extends IClassProps,
        IForm<
            Partial<ITransactionBatchEndRequest>,
            ITransactionBatchMinimal,
            Error,
            TTransactionBatchEndFormValues
        > {}

const TransactionBatchEndForm = ({
    className,
    ...formProps
}: ITransactionBatchEndFormProps) => {
    const form = useForm<TTransactionBatchEndFormValues>({
        resolver: standardSchemaResolver(TransactionBatchEndSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            employee_by_signature_media_id: '',
            employee_by_name: '',
            employee_by_position: '',
            ...formProps.defaultValues,
        },
    })

    const { onOpenSecurityAction } = useActionSecurityStore()

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TTransactionBatchEndFormValues>({
            form,
            ...formProps,
            autoSave: false,
            preventExitOnDirty: false,
        })

    const {
        mutate: endBatch,
        error: rawError,
        isPending,
    } = useTransactionBatchEndCurrentBatch({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const error = serverRequestErrExtractor({ error: rawError })

    const onSubmit = form.handleSubmit(async (formData) => {
        onOpenSecurityAction({
            title: 'End Batch Confirmation',
            description: 'Type your password to end your transaction',
            onSuccess: () => endBatch(formData),
        })
    }, handleFocusError)

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
                    <FormFieldWrapper
                        control={form.control}
                        name="employee_by_signature_media_id"
                        label="Signature"
                        render={({ field }) => {
                            const value = form.watch(
                                'employee_by_signature_media'
                            )
                            return (
                                <SignatureField
                                    {...field}
                                    placeholder="Signature"
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
                                            'employee_by_signature_media',
                                            newImage
                                        )
                                    }}
                                    disabled={isDisabled(field.name)}
                                />
                            )
                        }}
                    />
                    <FormFieldWrapper
                        label="Employee Name"
                        control={form.control}
                        name="employee_by_name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                autoComplete="off"
                                placeholder="Employee"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="employee_by_position"
                        label="Your Position"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Your Position"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                </fieldset>
                <div>
                    <Separator className="my-2 sm:my-4" />
                    <FormErrorMessage errorMessage={error} />
                    <Button
                        size="sm"
                        type="submit"
                        disabled={isPending || formProps.readOnly}
                        className="mt-4 w-full self-end px-8"
                    >
                        {isPending ? <LoadingSpinner /> : 'End Batch'}
                    </Button>
                </div>
            </form>
        </Form>
    )
}

export const TransactionBatchEndFormModal = ({
    title = 'End Transaction Batch',
    description = 'Fill out the form to end this transaction batch.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ITransactionBatchEndFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <TransactionBatchEndForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default TransactionBatchEndForm
