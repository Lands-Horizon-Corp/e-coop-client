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

import { IForm, TEntityId } from '@/types'

import {
    useCreateInventoryHazard,
    useUpdateInventoryHazardById,
} from '../inventory-hazard.service'
import {
    IInventoryHazard,
    IInventoryHazardRequest,
} from '../inventory-hazard.types'
import {
    InventoryHazardSchema,
    TInventoryHazardSchema,
} from '../inventory-hazard.validation'

export interface IInventoryHazardFormProps extends IForm<
    Partial<IInventoryHazardRequest>,
    IInventoryHazard
> {
    inventoryHazardId?: TEntityId
}

const InventoryHazardCreateUpdateForm = ({
    className,
    ...formProps
}: IInventoryHazardFormProps & { className?: string }) => {
    const form = useForm<IInventoryHazardRequest>({
        resolver: standardSchemaResolver(InventoryHazardSchema),
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateInventoryHazard({
        options: withToastCallbacks({
            textSuccess: 'Hazard Created',
            onSuccess: formProps.onSuccess,
        }),
    })

    const updateMutation = useUpdateInventoryHazardById({
        options: withToastCallbacks({
            textSuccess: 'Hazard Updated',
            onSuccess: formProps.onSuccess,
        }),
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TInventoryHazardSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((data) => {
        if (formProps.inventoryHazardId) {
            updateMutation.mutate({
                id: formProps.inventoryHazardId,
                payload: data,
            })
        } else {
            createMutation.mutate(data)
        }
    }, handleFocusError)

    const isPending = createMutation.isPending || updateMutation.isPending
    const error = serverRequestErrExtractor({
        error: formProps.inventoryHazardId
            ? updateMutation.error
            : createMutation.error,
    })

    return (
        <Form {...form}>
            <form
                className={cn('flex flex-col gap-4', className)}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <FormFieldWrapper
                    control={form.control}
                    label="Hazard Name"
                    name="name"
                    render={({ field }) => (
                        <Input {...field} disabled={isDisabled(field.name)} />
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
                    label="Safety Guidelines"
                    name="description"
                    render={({ field }) => (
                        <Textarea
                            {...field}
                            disabled={isDisabled(field.name)}
                        />
                    )}
                />
                <FormFooterResetSubmit
                    error={error}
                    isLoading={isPending}
                    submitText={
                        formProps.inventoryHazardId
                            ? 'Update Hazard'
                            : 'Create Hazard'
                    }
                />
            </form>
        </Form>
    )
}

export const InventoryHazardCreateUpdateModal = ({
    formProps,
    ...props
}: IModalProps & { formProps?: IInventoryHazardFormProps }) => (
    <Modal
        description="Define hazard classifications and symbols."
        title="Inventory Hazard"
        {...props}
    >
        <InventoryHazardCreateUpdateForm
            {...formProps}
            onSuccess={(d) => {
                formProps?.onSuccess?.(d)
                props.onOpenChange?.(false)
            }}
        />
    </Modal>
)
