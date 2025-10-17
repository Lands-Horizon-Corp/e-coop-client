import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { toInputDateString } from '@/helpers/date-utils'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import BankCombobox from '@/modules/bank/components/bank-combobox'
import { CurrencyInput } from '@/modules/currency'
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

import {
    useCreateOnlineRemittance,
    useUpdateOnlineRemittanceById,
} from '../../online-remittance.service'
import {
    IOnlineRemittance,
    IOnlineRemittanceRequest,
} from '../../online-remittance.types'
import { OnlineRemittanceSchema } from '../../online-remittance.validation'

type TFormValues = z.infer<typeof OnlineRemittanceSchema>

export interface IOnlineRemittanceFormProps
    extends IClassProps,
        IForm<
            Partial<IOnlineRemittanceRequest>,
            IOnlineRemittance,
            Error,
            TFormValues
        > {
    onlineRemittanceId?: TEntityId
}

const OnlineRemittanceCreateUpdateForm = ({
    onlineRemittanceId,
    className,
    ...formProps
}: IOnlineRemittanceFormProps) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(OnlineRemittanceSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            country_code: 'PH',
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

    const createMutation = useCreateOnlineRemittance({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateOnlineRemittanceById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFormValues>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        if (onlineRemittanceId) {
            updateMutation.mutate({ id: onlineRemittanceId, payload: data })
        } else {
            createMutation.mutate(data)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = onlineRemittanceId ? updateMutation : createMutation

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
                                onChange={(bank) => field.onChange(bank.id)}
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
                                placeholder="ex: OR-20240526-001"
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
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue) => {
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
                                value={field.value ?? ''}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Country Code *"
                        name="country_code"
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
                        label="Remittance Receipt"
                        name="media_id"
                        render={({ field }) => {
                            const value = form.watch('media')
                            return (
                                <ImageField
                                    {...field}
                                    onChange={(newImage) => {
                                        if (newImage)
                                            field.onChange(newImage.id)
                                        else field.onChange(undefined)

                                        form.setValue('media', newImage)
                                    }}
                                    placeholder="Upload Remittance Screenshot"
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
                                content={field.value ?? ''}
                                disabled={isDisabled(field.name)}
                                placeholder="Description..."
                                textEditorClassName="bg-background"
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
                    submitText={onlineRemittanceId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const OnlineRemittanceCreateUpdateFormModal = ({
    title = 'Create Online Remittance',
    description = 'Fill out the form to add a new online remittance.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IOnlineRemittanceFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <OnlineRemittanceCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default OnlineRemittanceCreateUpdateForm
