import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media'

import { CountryCombobox } from '@/components/comboboxes/country-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateBillsAndCoins,
    useUpdateBillsAndCoinsById,
} from '../bill-and-coins.service'
import { IBillsAndCoin, IBillsAndCoinRequest } from '../bill-and-coins.types'

const billsAndCoinSchema = z.object({
    name: z.string().min(1, 'Name is required'),
    value: z.coerce.number().min(0, 'Value is required'),
    country_code: z.string().min(1, 'Country code is required'),
    media_id: z.string().optional(),
    media: z.any(),
    branch_id: z.string().optional(),
    organization_id: z.string().optional(),
})

type TBillsAndCoinFormValues = z.infer<typeof billsAndCoinSchema>

export interface IBillsAndCoinFormProps
    extends IClassProps,
        IForm<
            Partial<IBillsAndCoinRequest>,
            IBillsAndCoin,
            Error,
            TBillsAndCoinFormValues
        > {
    billsAndCoinId?: TEntityId
}

const BillsAndCoinCreateUpdateForm = ({
    billsAndCoinId,
    className,
    ...formProps
}: IBillsAndCoinFormProps) => {
    const form = useForm<TBillsAndCoinFormValues>({
        resolver: standardSchemaResolver(billsAndCoinSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            value: 0,
            country_code: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateBillsAndCoins({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })
    const updateMutation = useUpdateBillsAndCoinsById({
        options: {
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TBillsAndCoinFormValues>({
            form,
            ...formProps,
            autoSave: !!billsAndCoinId,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (billsAndCoinId) {
            updateMutation.mutate({ id: billsAndCoinId, payload: formData })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = billsAndCoinId ? updateMutation : createMutation

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
                            label="Name *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="Bill/Coin Name"
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="value"
                            label="Value *"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    step="0.01"
                                    placeholder="Value"
                                    autoComplete="off"
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
                            label="Bill/Coin Photo"
                            render={({ field }) => {
                                const value = form.watch('media')
                                return (
                                    <ImageField
                                        {...field}
                                        placeholder="Upload Bill/Coin Photo"
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
                    </fieldset>
                </fieldset>
                <FormFooterResetSubmit
                    error={error}
                    readOnly={formProps.readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={billsAndCoinId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const BillsAndCoinCreateUpdateFormModal = ({
    title = 'Create Bill or Coin',
    description = 'Fill out the form to add a new bill or coin.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IBillsAndCoinFormProps, 'className'>
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('', className)}
            {...props}
        >
            <BillsAndCoinCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default BillsAndCoinCreateUpdateForm
