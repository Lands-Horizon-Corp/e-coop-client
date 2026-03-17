import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media/media.types'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateInventorySupplier,
    useUpdateInventorySupplierById,
} from '../inventory-supplier.service'
import {
    IInventorySupplier,
    IInventorySupplierRequest,
} from '../inventory-supplier.types'
import { InventorySupplierSchema } from '../inventory-supplier.validation'

type TFormValues = z.infer<typeof InventorySupplierSchema>

export interface IInventorySupplierFormProps
    extends
        IClassProps,
        IForm<
            Partial<IInventorySupplierRequest>,
            IInventorySupplier,
            Error,
            TFormValues
        > {
    inventorySupplierId?: TEntityId
}

const InventorySupplierCreateUpdateForm = ({
    className,
    ...formProps
}: IInventorySupplierFormProps) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(InventorySupplierSchema),
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            address: '',
            contact_number: '',
            longitude: undefined,
            latitude: undefined,
            icon: '',
            media_id: undefined,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateInventorySupplier({
        options: withToastCallbacks({
            textSuccess: 'Supplier Created',
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        }),
    })

    const updateMutation = useUpdateInventorySupplierById({
        options: withToastCallbacks({
            textSuccess: 'Supplier Updated',
            onSuccess: formProps.onSuccess,
            onError: formProps.onError,
        }),
    })

    const { formRef, handleFocusError } = useFormHelper<TFormValues>({
        form,
        autoSave: formProps.autoSave,
        readOnly: formProps.readOnly,
        hiddenFields: formProps.hiddenFields,
        disabledFields: formProps.disabledFields,
        defaultValues: formProps.defaultValues,
    })

    const onSubmit = form.handleSubmit((data) => {
        if (formProps.inventorySupplierId) {
            updateMutation.mutate({
                id: formProps.inventorySupplierId,
                payload: data,
            })
        } else {
            createMutation.mutate(data)
        }
    }, handleFocusError)

    const {
        error: errorResponse,
        isPending,
        reset,
    } = formProps.inventorySupplierId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset disabled={isPending || formProps.readOnly}>
                    <FormFieldWrapper
                        control={form.control}
                        label="Supplier Name"
                        name="name"
                        render={({ field }) => <Input {...field} />}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Contact Number"
                        name="contact_number"
                        render={({ field }) => <Input {...field} />}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Address"
                        name="address"
                        render={({ field }) => <Input {...field} />}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Description"
                        name="description"
                        render={({ field }) => <Textarea {...field} />}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Supplier Image"
                        name="media_id"
                        render={({ field }) => {
                            const value = form.watch('media')

                            return (
                                <ImageField
                                    {...field}
                                    onChange={(img) => {
                                        if (img) field.onChange(img.id)
                                        else field.onChange(undefined)

                                        form.setValue('media', img)
                                    }}
                                    value={
                                        value
                                            ? (value as IMedia).download_url
                                            : value
                                    }
                                />
                            )
                        }}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    submitText={
                        formProps.inventorySupplierId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const InventorySupplierCreateUpdateModal = ({
    title = 'Create Supplier',
    description = 'Fill out the form to add a supplier',
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IInventorySupplierFormProps, 'className'>
}) => {
    return (
        <Modal {...props} description={description} title={title}>
            <InventorySupplierCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default InventorySupplierCreateUpdateForm
