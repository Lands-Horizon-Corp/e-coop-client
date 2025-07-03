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

import { checkRemittanceSchema } from '@/validations/'

import {
    useCreateBatchCheckRemittance,
    useUpdateBatchCheckRemittance,
} from '@/hooks/api-hooks/use-check-remittance'

import {
    ICheckRemittance,
    ICheckRemittanceRequest,
    IClassProps,
    IForm,
    IMedia,
    TEntityId,
} from '@/types'

type TFormValues = z.infer<typeof checkRemittanceSchema>

export interface ICheckRemittanceFormProps
    extends IClassProps,
        IForm<
            Partial<ICheckRemittanceRequest>,
            ICheckRemittance,
            string,
            TFormValues
        > {
    checkRemittanceId?: TEntityId
}

const CheckRemittanceCreateUpdateForm = ({
    checkRemittanceId,
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onSuccess,
    onError,
}: ICheckRemittanceFormProps) => {
    const form = useForm<TFormValues>({
        resolver: zodResolver(checkRemittanceSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
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

    const createMutation = useCreateBatchCheckRemittance({ onSuccess, onError })
    const updateMutation = useUpdateBatchCheckRemittance({ onSuccess, onError })

    const onSubmit = form.handleSubmit((data) => {
        if (checkRemittanceId) {
            updateMutation.mutate({ id: checkRemittanceId, data })
        } else {
            createMutation.mutate(data)
        }
    })

    const { error, isPending, reset } = checkRemittanceId
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
                        render={({ field }) => (
                            <Input
                                type="date"
                                {...field}
                                placeholder="Release Date"
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
                        label="Check Photo"
                        render={({ field }) => {
                            const value = form.watch('media')
                            return (
                                <ImageField
                                    {...field}
                                    placeholder="Upload Check Photo"
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
                <Separator />
                <div className="space-y-2">
                    <FormErrorMessage errorMessage={error} />
                    <div className="flex items-center justify-end gap-x-2">
                        <Button
                            size="sm"
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
                            size="sm"
                            type="submit"
                            disabled={isPending}
                            className="w-full self-end px-8 sm:w-fit"
                        >
                            {isPending ? (
                                <LoadingSpinner />
                            ) : checkRemittanceId ? (
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
