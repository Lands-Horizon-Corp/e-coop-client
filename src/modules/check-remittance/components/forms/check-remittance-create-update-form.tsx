import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import { CurrencyInput } from '@/modules/currency'
import { IMedia } from '@/modules/media'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import TextEditor from '@/components/text-editor'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import InputDate from '@/components/ui/input-date'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import { useCreateCheckRemittance, useUpdateCheckRemittanceById } from '../..'
import {
    ICheckRemittance,
    ICheckRemittanceRequest,
} from '../../check-remittance.types'
import { CheckRemittanceSchema } from '../../check-remittance.validation'

type TFormValues = z.infer<typeof CheckRemittanceSchema>

export interface ICheckRemittanceFormProps
    extends IClassProps,
        IForm<
            Partial<ICheckRemittanceRequest>,
            ICheckRemittance,
            Error,
            TFormValues
        > {
    checkRemittanceId?: TEntityId
}

const CheckRemittanceCreateUpdateForm = ({
    checkRemittanceId,
    className,
    ...formProps
}: ICheckRemittanceFormProps) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(CheckRemittanceSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            reference_number: '',
            account_name: '',
            amount: 0,
            description: '',
            ...formProps.defaultValues,
            date_entry: toInputDateString(
                formProps.defaultValues?.date_entry ?? new Date()
            ),
        },
    })

    const createMutation = useCreateCheckRemittance({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })
    const updateMutation = useUpdateCheckRemittanceById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFormValues>({
            form,
            ...formProps,
            autoSave: checkRemittanceId !== undefined,
        })

    const onSubmit = form.handleSubmit((payload) => {
        if (checkRemittanceId) {
            updateMutation.mutate({ id: checkRemittanceId, payload })
        } else {
            createMutation.mutate(payload)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = checkRemittanceId ? updateMutation : createMutation

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
                    <FormFieldWrapper
                        control={form.control}
                        label="Bank *"
                        name="bank_id"
                        render={({ field }) => (
                            <BankCombobox
                                {...field}
                                disabled={isDisabled(field.name)}
                                onChange={(selectedBank) =>
                                    field.onChange(selectedBank.id)
                                }
                                placeholder="Select a bank"
                                value={field.value}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Account Name *"
                        name="account_name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Account Name"
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Reference Number *"
                        name="reference_number"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="example: CHK-20240526-00123"
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
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="Amount"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        className="relative"
                        control={form.control}
                        description="mm/dd/yyyy"
                        descriptionClassName="absolute top-0 right-0"
                        label="Date Entry"
                        name="date_entry"
                        render={({ field }) => (
                            <InputDate
                                {...field}
                                className="block"
                                disabled={isDisabled(field.name)}
                                placeholder="Release Date"
                                value={field.value ?? ''}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        label="Check Photo"
                        name="media_id"
                        render={({ field }) => {
                            const value = form.watch('media')
                            return (
                                <ImageField
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onChange={(newImage) => {
                                        if (newImage)
                                            field.onChange(newImage.id)
                                        else field.onChange(undefined)

                                        form.setValue('media', newImage)
                                    }}
                                    placeholder="Upload Check Photo"
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
                                placeholder="Description..."
                                textEditorClassName="bg-background !max-w-none"
                            />
                        )}
                    />
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
                    submitText={checkRemittanceId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const CheckRemittanceCreateUpdateFormModal = ({
    title = 'Create Check Remittance',
    description = 'Fill out the form to add a new check remittance.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ICheckRemittanceFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <CheckRemittanceCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CheckRemittanceCreateUpdateForm
