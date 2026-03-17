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
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import ImageField from '@/components/ui/image-field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateInventoryBrand,
    useUpdateInventoryBrandById,
} from '../inventory-brand.service'
import {
    IInventoryBrand,
    IInventoryBrandRequest,
} from '../inventory-brand.types'
import { InventoryBrandSchema } from '../inventory-brand.validation'

type TInventoryBrandFormValues = z.infer<typeof InventoryBrandSchema>

export interface IInventoryBrandFormProps
    extends
        IClassProps,
        IForm<
            Partial<IInventoryBrandRequest>,
            IInventoryBrand,
            Error,
            TInventoryBrandFormValues
        > {
    inventoryBrandId?: TEntityId
}

const InventoryBrandCreateUpdateForm = ({
    className,
    ...formProps
}: IInventoryBrandFormProps) => {
    const form = useForm<TInventoryBrandFormValues>({
        resolver: standardSchemaResolver(InventoryBrandSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            media_id: undefined,
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateInventoryBrand({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Brand Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateInventoryBrandById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Brand Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TInventoryBrandFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.inventoryBrandId) {
            updateMutation.mutate({
                id: formProps.inventoryBrandId,
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
    } = formProps.inventoryBrandId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: errorResponse })

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
                    <fieldset className="space-y-3">
                        <FormFieldWrapper
                            control={form.control}
                            label="Brand Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Brand Name"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Brand Logo"
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
                                        placeholder="Upload Brand Logo"
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
                            label="Description"
                            name="description"
                            render={({ field }) => (
                                <Textarea
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Description"
                                />
                            )}
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
                        formProps.inventoryBrandId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const InventoryBrandCreateUpdateFormModal = ({
    title = 'Create Brand',
    description = 'Fill out the form to add a new brand.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IInventoryBrandFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <InventoryBrandCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default InventoryBrandCreateUpdateForm
