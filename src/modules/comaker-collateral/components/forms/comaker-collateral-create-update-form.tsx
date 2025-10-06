import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import CollateralCombobox from '@/modules/collateral/components/collateral-combobox'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    ComakerCollateralSchema,
    TComakerCollateralSchema,
} from '../../comaker-collateral.validation'

type TComakerCollateralFormValues = TComakerCollateralSchema & {
    fieldKey?: string
}

type IComakerCollateralForForm = z.infer<typeof ComakerCollateralSchema>

export interface IComakerCollateralFormProps
    extends IClassProps,
        IForm<
            Partial<TComakerCollateralFormValues>,
            IComakerCollateralForForm,
            Error,
            TComakerCollateralFormValues
        > {
    loanTransactionId?: TEntityId
}

const ComakerCollateralCreateUpdateForm = ({
    className,
    loanTransactionId,
    onSuccess,
    readOnly,
    ...formProps
}: IComakerCollateralFormProps) => {
    const form = useForm<TComakerCollateralFormValues>({
        resolver: standardSchemaResolver(ComakerCollateralSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            loan_transaction_id: loanTransactionId,
            collateral_id: '',
            amount: 0,
            months_count: 0,
            year_count: 0,
            ...formProps.defaultValues,
        },
    })

    const { formRef, firstError, isDisabled } =
        useFormHelper<TComakerCollateralFormValues>({
            form,
            readOnly,
            autoSave: false,
        })

    const onSubmit = form.handleSubmit((formData, e) => {
        e?.stopPropagation()
        e?.preventDefault()
        onSuccess?.(formData)
        form.reset()
    })

    return (
        <Form {...form}>
            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn(
                    'flex w-full max-w-full min-w-0 flex-col gap-y-4',
                    className
                )}
            >
                <div className="space-y-4">
                    <FormFieldWrapper
                        control={form.control}
                        name="collateral_id"
                        label="Collateral"
                        render={({ field }) => (
                            <CollateralCombobox
                                {...field}
                                placeholder="Select Collateral"
                                onChange={(collateral) => {
                                    field.onChange(collateral?.id)
                                    form.setValue('collateral', collateral)
                                }}
                                disabled={isDisabled(field.name)}
                            />
                        )}
                    />
                    <FormFieldWrapper
                        control={form.control}
                        name="amount"
                        label="Amount"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                disabled={isDisabled(field.name)}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0
                                    field.onChange(value)
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSubmit()
                                        e.preventDefault()
                                    }
                                }}
                            />
                        )}
                    />
                    <div className="grid grid-cols-2 gap-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="months_count"
                            label="Months Count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                        <FormFieldWrapper
                            control={form.control}
                            name="year_count"
                            label="Year Count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    type="number"
                                    min={0}
                                    disabled={isDisabled(field.name)}
                                />
                            )}
                        />
                    </div>
                    <FormFieldWrapper
                        control={form.control}
                        name="description"
                        label="Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Description"
                                disabled={isDisabled(field.name)}
                                className="min-h-24"
                            />
                        )}
                    />
                </div>

                <FormFooterResetSubmit
                    readOnly={readOnly}
                    resetButtonType="button"
                    submitButtonType="button"
                    error={firstError}
                    disableSubmit={!form.formState.isDirty}
                    submitText={
                        formProps.defaultValues?.fieldKey ? 'Update' : 'Create'
                    }
                    onSubmit={(e) => onSubmit(e)}
                    onReset={() => {
                        form.reset()
                    }}
                />
            </form>
        </Form>
    )
}

export const ComakerCollateralCreateUpdateModal = ({
    title = 'Add Comaker Collateral',
    description = 'Add a new comaker collateral entry.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: IComakerCollateralFormProps
}) => {
    return (
        <Modal
            title={title}
            description={description}
            className={cn('!max-w-xl', className)}
            {...props}
        >
            <ComakerCollateralCreateUpdateForm
                {...formProps}
                onSuccess={(collateral) => {
                    formProps.onSuccess?.(collateral)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}
