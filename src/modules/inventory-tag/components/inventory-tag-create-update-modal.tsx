import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import ColorPicker from '@/components/pickers/color-picker'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateInventoryTag,
    useUpdateInventoryTagById,
} from '../inventory-tag.service'
import { IInventoryTag, IInventoryTagRequest } from '../inventory-tag.types'
import { InventoryTagSchema } from '../inventory-tag.validation'

type TInventoryTagFormValues = z.infer<typeof InventoryTagSchema>

export interface IInventoryTagFormProps
    extends
        IClassProps,
        IForm<
            Partial<IInventoryTagRequest>,
            IInventoryTag,
            Error,
            TInventoryTagFormValues
        > {
    inventoryTagId?: TEntityId
}

const InventoryTagCreateUpdateForm = ({
    className,
    ...formProps
}: IInventoryTagFormProps) => {
    const form = useForm<TInventoryTagFormValues>({
        resolver: standardSchemaResolver(InventoryTagSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            category: undefined,
            color: '',
            icon: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateInventoryTag({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Tag Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateInventoryTagById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Tag Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TInventoryTagFormValues>({
            form,
            autoSave: formProps.autoSave,
            readOnly: formProps.readOnly,
            hiddenFields: formProps.hiddenFields,
            disabledFields: formProps.disabledFields,
            defaultValues: formProps.defaultValues,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.inventoryTagId) {
            updateMutation.mutate({
                id: formProps.inventoryTagId,
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
    } = formProps.inventoryTagId ? updateMutation : createMutation

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
                            label="Tag Name"
                            name="name"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Tag Name"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Category"
                            name="category"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    autoComplete="off"
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    placeholder="Category"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Select Color"
                            name="color"
                            render={({ field }) => (
                                <ColorPicker
                                    alpha={true}
                                    className="mt-0 w-full"
                                    inputClassName="h-10 w-full"
                                    onChange={field.onChange}
                                    value={field.value ?? ''}
                                />
                            )}
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
                    submitText={formProps.inventoryTagId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const InventoryTagCreateUpdateFormModal = ({
    title = 'Create Tag',
    description = 'Fill out the form to add a new tag.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IInventoryTagFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <InventoryTagCreateUpdateForm
                {...formProps}
                onSuccess={(createdData) => {
                    formProps?.onSuccess?.(createdData)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default InventoryTagCreateUpdateForm
