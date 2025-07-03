'use client'

import z from 'zod'

import { zodResolver } from '@hookform/resolvers/zod'

import { toInputDateString } from '@/utils'
import { Path, useForm } from 'react-hook-form'

import BankCombobox from '@/components/comboboxes/bank-combobox'
import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import Modal, { IModalProps } from '@/components/modals/modal'
import LoadingSpinner from '@/components/spinners/loading-spinner'
import TextEditor from '@/components/text-editor'
import { Button } from '@/components/ui/button'
import { Form } from '@/components/ui/form'
import FormErrorMessage from '@/components/ui/form-error-message'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'

import { cn } from '@/lib/utils'

import { onlineRemittanceSchema } from '@/validations/form-validation'

import {
    useCreateOnlineRemittance,
    useUpdateOnlineRemittance,
} from '@/hooks/api-hooks/use-online-remittance'

import {
    IClassProps,
    IForm,
    IMedia,
    IOnlineRemitance,
    IOnlineRemitanceRequest,
    TEntityId,
} from '@/types'

type TFormValues = z.infer<typeof onlineRemittanceSchema>

export interface IOnlineRemittanceFormProps
    extends IClassProps,
        IForm<
            Partial<IOnlineRemitanceRequest>,
            IOnlineRemitance,
            string,
            TFormValues
        > {
    onlineRemittanceId?: TEntityId
}

const OnlineRemittanceCreateUpdateForm = ({
    onlineRemittanceId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onSuccess,
    onError,
}: IOnlineRemittanceFormProps) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(onlineRemittanceSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            country_code: 'PH',
            reference_number: '',
            account_name: '',
            amount: 1,
            description: '',
            ...defaultValues,
            date_entry: toInputDateString(
                defaultValues?.date_entry ?? new Date()
            ),
        },
    })

    const createMutation = useCreateOnlineRemittance({ onSuccess, onError })
    const updateMutation = useUpdateOnlineRemittance({ onSuccess, onError })

    const onSubmit = form.handleSubmit((data) => {
        if (onlineRemittanceId) {
            updateMutation.mutate({ id: onlineRemittanceId, data })
        } else {
            createMutation.mutate(data)
        }
    })

    const { error, isPending, reset } = onlineRemittanceId
        ? updateMutation
        : createMutation

    const isDisabled = (field: Path<TFormValues>) =>
        readOnly || disabledFields?.includes(field) || false

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
                    <FormFieldWrapper
                        control={form.control}
                        name="bank_id"
                        label="Bank *"
                        render={({ field }) => (
                            <BankCombobox
                                {...field}
                                placeholder="Select a bank"
                                value={field.value}
                                onChange={(bank) => field.onChange(bank.id)}
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
                                placeholder="ex: OR-20240526-001"
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
                                type="text"
                                placeholder="Amount"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="date_entry"
                        label="Date Entry"
                        render={({ field }) => (
                            <Input
                                type="date"
                                {...field}
                                className="block [&::-webkit-calendar-picker-indicator]:hidden"
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
                                onChange={(country) =>
                                    field.onChange(country.alpha2)
                                }
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="media_id"
                        label="Remittance Receipt"
                        render={({ field }) => {
                            const value = form.watch('media')
                            return (
                                <ImageField
                                    {...field}
                                    placeholder="Upload Remittance Screenshot"
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
                                content={field.value ?? ''}
                                placeholder="Description..."
                                disabled={isDisabled(field.name)}
                                textEditorClassName="bg-background"
                            />
                        )}
                    />
                </fieldset>

                <Separator />

                <div className="space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={() => {
                                form.reset()
                                reset()
                            }}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            Reset
                        </Button>
                        <Button
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : onlineRemittanceId ? (
                                'Update'
                            ) : (
                                'Create'
                            )}
                        </Button>
                    </div>
                </div>
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
            title={title}
            description={description}
            className={cn('', className)}
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
