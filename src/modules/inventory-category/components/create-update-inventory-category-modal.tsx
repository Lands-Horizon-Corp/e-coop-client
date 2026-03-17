import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'
import { cn } from '@/helpers/tw-utils'

import IconCombobox from '@/components/comboboxes/icon-combobox'
import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import { TIcon } from '@/components/icons'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    useCreateInventoryCategory,
    useUpdateInventoryCategoryById,
} from '../inventory-category.service'
import {
    IInventoryCategory,
    IInventoryCategoryRequest,
} from '../inventory-category.types'
import {
    InventoryCategorySchema,
    TInventoryCategorySchema,
} from '../inventory-category.validation'

export interface IInventoryCategoryFormProps
    extends
        IClassProps,
        IForm<
            Partial<IInventoryCategoryRequest>,
            IInventoryCategory,
            Error,
            TInventoryCategorySchema
        > {
    inventoryCategoryId?: TEntityId
}

const InventoryCategoryCreateUpdateForm = ({
    className,
    ...formProps
}: IInventoryCategoryFormProps) => {
    const form = useForm<TInventoryCategorySchema>({
        resolver: standardSchemaResolver(InventoryCategorySchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateInventoryCategory({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Category Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const updateMutation = useUpdateInventoryCategoryById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Category Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TInventoryCategorySchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((formData) => {
        if (formProps.inventoryCategoryId) {
            updateMutation.mutate({
                id: formProps.inventoryCategoryId,
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
    } = formProps.inventoryCategoryId ? updateMutation : createMutation

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
                    <FormFieldWrapper
                        control={form.control}
                        label="Category Name"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                placeholder="e.g. Raw Materials"
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
                                disabled={isDisabled(field.name)}
                                placeholder="Describe the category..."
                            />
                        )}
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
                    readOnly={formProps.readOnly}
                    submitText={
                        formProps.inventoryCategoryId ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const InventoryCategoryCreateUpdateModal = ({
    title = 'Inventory Category',
    description = 'Manage your inventory categories.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<IInventoryCategoryFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <InventoryCategoryCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default InventoryCategoryCreateUpdateForm
