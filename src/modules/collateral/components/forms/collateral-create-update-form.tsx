import { Path, useForm } from 'react-hook-form'

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
    readOnly,
    className,
    defaultValues,
    disabledFields,
    onError,
    onSuccess,
}: ICollateralFormProps) => {
    const form = useForm<TCollateralSchema>({
        resolver: standardSchemaResolver(CollateralSchema),
        mode: 'onSubmit',
        reValidateMode: 'onChange',
        defaultValues: {
            name: '',
            description: '',
            icon: '',
            ...defaultValues,
        },
    })

    const createMutation = useCreateCollateral({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Status Created',
                onSuccess,
                onError,
            }),
        },
    })
    const updateMutation = useUpdateCollateralById({
        options: {
            ...withToastCallbacks({
                textSuccess: 'Loan Status Updated',
                onSuccess,
                onError,
            }),
        },
    })

    const onSubmit = form.handleSubmit((payload) => {
        if (collateralId) {
            updateMutation.mutate({ id: collateralId, payload })
        } else {
            createMutation.mutate(payload)
        }
    })

    const {
        error: rawError,
        isPending,
        reset,
    } = collateralId ? updateMutation : createMutation

    const error = serverRequestErrExtractor({ error: rawError })

    const isDisabled = (field: Path<TCollateralSchema>) =>
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
                        name="name"
                        label="Name *"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="Collateral Name"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Optional description"
                                autoComplete="off"
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="icon"
                        label="Icon *"
                        render={({ field }) => (
                            <IconCombobox
                                {...field}
                                value={field.value as TIcon}
                            />
                        )}
                    />
                </fieldset>

                <FormFooterResetSubmit
                    error={error}
                    readOnly={readOnly}
                    isLoading={isPending}
                    disableSubmit={!form.formState.isDirty}
                    submitText={collateralId ? 'Update' : 'Create'}
                    onReset={() => {
                        form.reset()
                        reset?.()
                    }}
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
            title={title}
            description={description}
            className={cn('', className)}
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
