import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers'
import { withToastCallbacks } from '@/helpers/callback-helper'
import { serverRequestErrExtractor } from '@/helpers/error-message-extractor'

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

import { useCreateCollateral, useUpdateCollateralById } from '../..'
import { ICollateral, ICollateralRequest } from '../../collateral.types'
import {
    CollateralSchema,
    TCollateralSchema,
} from '../../collateral.validation'

export interface ICollateralFormProps
    extends IClassProps,
        IForm<
            Partial<ICollateralRequest>,
            ICollateral,
            Error,
            TCollateralSchema
        > {
    collateralId?: TEntityId
}

const CollateralCreateUpdateForm = ({
    collateralId,
    className,
    ...formProps
}: ICollateralFormProps) => {
    const form = useForm<TCollateralSchema>({
        resolver: standardSchemaResolver(CollateralSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            ...formProps.defaultValues,
        },
    })

    const createMutation = useCreateCollateral({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Collateral Created',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })
    const updateMutation = useUpdateCollateralById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Collateral Updated',
                onSuccess: formProps.onSuccess,
                onError: formProps.onError,
            }),
        },
    })

    const { formRef, handleFocusError, isDisabled } =
        useFormHelper<TCollateralSchema>({
            form,
            ...formProps,
        })

    const onSubmit = form.handleSubmit((payload) => {
        if (collateralId) {
            updateMutation.mutate({ id: collateralId, payload })
        } else {
            createMutation.mutate(payload)
        }
    }, handleFocusError)

    const {
        error: rawError,
        isPending,
        reset,
    } = collateralId ? updateMutation : createMutation

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
                        label="Name *"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Collateral Name"
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
                                placeholder="Optional description"
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Icon *"
                        name="icon"
                        render={({ field }) => (
                            <IconCombobox
                                {...field}
                                disabled={isDisabled(field.name)}
                                value={field.value as TIcon}
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
                        reset?.()
                    }}
                    readOnly={formProps.readOnly}
                    submitText={collateralId ? 'Update' : 'Create'}
                />
            </form>
        </Form>
    )
}

export const CollateralCreateUpdateFormModal = ({
    title = 'Create Collateral',
    description = 'Fill out the form to add a new collateral.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: Omit<ICollateralFormProps, 'className'>
}) => {
    return (
        <Modal
            className={cn('', className)}
            description={description}
            title={title}
            {...props}
        >
            <CollateralCreateUpdateForm
                {...formProps}
                onSuccess={(data) => {
                    formProps?.onSuccess?.(data)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default CollateralCreateUpdateForm
