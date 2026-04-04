import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'
import { IMedia } from '@/modules/media/media.types'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import MapPicker from '@/components/map/map-picker'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateInventoryWarehouse,
    useUpdateInventoryWarehouseById,
} from '../inventory-warehouse.service'
import {
    IInventoryWarehouse,
    IInventoryWarehouseRequest,
    WAREHOUSE_TYPE,
} from '../inventory-warehouse.types'
import { InventoryWarehouseSchema } from '../inventory-warehouse.validation'

type TFormValues = z.infer<typeof InventoryWarehouseSchema>

export interface IInventoryWarehouseFormProps
    extends
        IClassProps,
        IForm<
            Partial<IInventoryWarehouseRequest>,
            IInventoryWarehouse,
            Error,
            TFormValues
        > {
    inventoryWarehouseId?: TEntityId
}

const InventoryWarehouseCreateUpdateForm = ({
    className,
    ...formProps
}: IInventoryWarehouseFormProps) => {
    const form = useForm<TFormValues>({
        resolver: standardSchemaResolver(InventoryWarehouseSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            type: 'Public',
            code: '',
            address: '',
            location: '',
            longitude: undefined,
            latitude: undefined,
            icon: '',
            media_id: undefined,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateInventoryWarehouse({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Warehouse Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateInventoryWarehouseById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Warehouse Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.inventoryWarehouseId) {
            updateMutation.mutate({
                id: formProps.inventoryWarehouseId,
                payload: formData,
            })
        } else {
            createMutation.mutate(formData)
        }
    }, handleFocusError)

    const {
        error: errorResponse,
        isPending,
        reset,
    } = formProps.inventoryWarehouseId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

    return (
        <Form {...form}>
            <form
                className={cn('flex w-full flex-col gap-y-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset
                    className="grid gap-4"
                    disabled={isPending || formProps.readOnly}
                >
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Warehouse Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Warehouse Name"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Type"
                            name="type"
                            render={({ field }) => (
                                <Select
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(val) => field.onChange(val)}
                                    value={field.value}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                    </SelectTrigger>

                                    <SelectContent>
                                        {WAREHOUSE_TYPE.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Code"
                            name="code"
                            render={({ field }) => (
                                <Input {...field} placeholder="Code" />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Address"
                            name="address"
                            render={({ field }) => (
                                <Input {...field} placeholder="Address" />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Location"
                            name="location"
                            render={({ field }) => (
                                <Input {...field} placeholder="Location" />
                            )}
                        />

                        <div className="flex flex-col row-span-2 space-y-4">
                            <div className="flex gap-x-2 items-center ">
                                <FormFieldWrapper
                                    className="grow"
                                    control={form.control}
                                    label="Latitude"
                                    name="latitude"
                                    render={({ field }) => (
                                        <div className="flex grow flex-col gap-y-2">
                                            <Input
                                                {...field}
                                                onChange={field.onChange}
                                                placeholder="latitude"
                                                value={field.value || ''}
                                            />
                                        </div>
                                    )}
                                />
                                <FormFieldWrapper
                                    className="grow"
                                    control={form.control}
                                    label="Longitude"
                                    name="longitude"
                                    render={({ field }) => (
                                        <div className="flex grow flex-col gap-y-2">
                                            <Input
                                                {...field}
                                                onChange={field.onChange}
                                                placeholder="Longitude"
                                                value={field.value || ''}
                                            />
                                        </div>
                                    )}
                                />
                            </div>
                            <MapPicker
                                onChange={(location) => {
                                    if (location) {
                                        form.setValue('latitude', location.lat)
                                        form.setValue('longitude', location.lng)
                                    } else {
                                        form.setValue('latitude', 0)
                                        form.setValue('longitude', 0)
                                    }
                                }}
                                placeholder="Click to select branch location"
                                title="Select Branch Location"
                                value={{
                                    lat: form.watch('latitude') || 14.780043,
                                    lng: form.watch('longitude') || 121.046351,
                                }}
                                variant="outline"
                            />
                        </div>

                        <FormFieldWrapper
                            className="flex-1"
                            control={form.control}
                            label="Icon"
                            name="icon"
                            render={({ field }) => (
                                <IconCombobox
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    placeholder="Select Icon"
                                    value={field.value as TIcon}
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Warehouse Image"
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

                        <FormFieldWrapper
                            control={form.control}
                            label="Description"
                            name="description"
                            render={({ field }) => <Textarea {...field} />}
                        />
                    </fieldset>
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty || isPending}
                    error={error}
                    isLoading={isPending}
                    onReset={() => {
                        form.reset()
                        reset()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={
                        formProps.inventoryWarehouseId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const InventoryWarehouseCreateUpdateModal = ({
    title = 'Create Warehouse',
    description = 'Fill out the form to add a new warehouse.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IInventoryWarehouseFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <InventoryWarehouseCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default InventoryWarehouseCreateUpdateForm
