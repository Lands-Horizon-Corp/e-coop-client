import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import { IMedia } from '@/modules/media'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
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
            country_code: 'PH',
            reference_number: '',
            account_name: '',
            amount: 1,
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
                        name="bank_id"
                        label="Bank *"
                        render={({ field }) => (
                            <BankCombobox
                                {...field}
                                value={field.value}
                                placeholder="Select a bank"
                                onChange={(selectedBank) =>
                                    field.onChange(selectedBank.id)
                                }
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="account_name"
                        label="Account Name *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Account Name"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="reference_number"
                        label="Reference Number *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="example: CHK-20240526-00123"
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
                                placeholder="Amount"
                                disabled={isDisabled(field.name)}
                                onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                }
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="date_entry"
                        label="Date Entry"
                        className="relative"
                        description="mm/dd/yyyy"
                        descriptionClassName="absolute top-0 right-0"
                        render={({ field }) => (
                            <InputDate
                                {...field}
                                placeholder="Release Date"
                                className="block"
                                value={field.value ?? ''}
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="country_code"
                        label="Country Code *"
                        render={({ field }) => (
                            <CountryCombobox
                                {...field}
                                defaultValue={field.value}
                                disabled={isDisabled(field.name)}
                                onChange={(country) =>
                                    field.onChange(country.alpha2)
                                }
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="media_id"
                        label="Check Photo"
                        render={({ field }) => {
                            const value = form.watch('media')
                            return (
                                <ImageField
                                    {...field}
                                    placeholder="Upload Check Photo"
                                    disabled={isDisabled(field.name)}
                                    value={
                                        value
                                            ? (value as IMedia).download_url
                                            : value
                                    }
                                    onChange={(newImage) => {
                                        if (newImage)
                                            field.onChange(newImage.id)
                                        else field.onChange(undefined)

                                        form.setValue('media', newImage)
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
                                disabled={isDisabled(field.name)}
                                placeholder="Description..."
                                textEditorClassName="bg-background !max-w-none"
                            />
                        )}
                    />
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={checkRemittanceId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
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
            title={title}
            description={description}
            className={cn('', className)}
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
