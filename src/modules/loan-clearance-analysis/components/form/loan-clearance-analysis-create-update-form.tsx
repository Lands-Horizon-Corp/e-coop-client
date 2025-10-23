import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'
import { CurrencyInput } from '@/modules/currency'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    LoanClearanceAnalysisSchema,
    TLoanClearanceAnalysisSchema,
} from '../../loan-clearance-analysis.validation'

type TLoanClearanceAnalysisFormValues = TLoanClearanceAnalysisSchema & {
    fieldKey?: string
}
type ILoanClearanceAnalysis = TLoanClearanceAnalysisFormValues

export interface ILoanClearanceAnalysisFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanClearanceAnalysisFormValues>,
            ILoanClearanceAnalysis,
            Error,
            TLoanClearanceAnalysisFormValues
        > {
    loanTransactionId?: TEntityId
}

const LoanClearanceAnalysisCreateUpdateForm = ({
    className,
    loanTransactionId,
    onSuccess,
    readOnly,
    ...formProps
}: ILoanClearanceAnalysisFormProps) => {
    const form = useForm<TLoanClearanceAnalysisFormValues>({
        resolver: standardSchemaResolver(LoanClearanceAnalysisSchema),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            loan_transaction_id: loanTransactionId,
            regular_deduction_description: '',
            regular_deduction_amount: 0,
            balances_description: '',
            balances_amount: 0,
            balances_count: 0,
            ...formProps.defaultValues,
        },
    })

    const { formRef, isDisabled } =
        useFormHelper<TLoanClearanceAnalysisFormValues>({
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
                className={cn(
                    'flex w-full max-w-full min-w-0 flex-col gap-y-4',
                    className
                )}
                onSubmit={onSubmit}
                ref={formRef}
            >
                <fieldset className="space-y-4" disabled={readOnly}>
                    <FormFieldWrapper
                        control={form.control}
                        label="Regular Deduction Description"
                        name="regular_deduction_description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Regular Deduction Description"
                                rows={3}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        label="Regular Deduction Amount"
                        name="regular_deduction_amount"
                        render={({ field: { onChange, ...field } }) => (
                            <CurrencyInput
                                {...field}
                                disabled={isDisabled(field.name)}
                                onValueChange={(newValue = '') => {
                                    onChange(newValue)
                                }}
                                placeholder="0.00"
                            />
                        )}
                    />

                    <Separator />

                    <FormFieldWrapper
                        control={form.control}
                        label="Balances Description"
                        name="balances_description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                placeholder="Balances Description"
                                rows={3}
                            />
                        )}
                    />

                    <div className="grid gap-3 grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            label="Balances Amount"
                            name="balances_amount"
                            render={({ field: { onChange, ...field } }) => (
                                <CurrencyInput
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    onValueChange={(newValue = '') => {
                                        onChange(newValue)
                                    }}
                                    placeholder="0.00"
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            label="Balances Count"
                            name="balances_count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    disabled={isDisabled(field.name)}
                                    id={field.name}
                                    onChange={(e) => {
                                        const value =
                                            parseInt(e.target.value) || 0
                                        field.onChange(value)
                                    }}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            onSubmit()
                                            e.preventDefault()
                                        }
                                    }}
                                    placeholder="0"
                                />
                            )}
                        />
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    disableSubmit={!form.formState.isDirty}
                    onReset={() => {
                        form.reset()
                    }}
                    onSubmit={(e) => onSubmit(e)}
                    readOnly={readOnly}
                    resetButtonType="button"
                    submitButtonType="button"
                    submitText={
                        formProps.defaultValues?.id ||
                        formProps.defaultValues?.fieldKey
                            ? 'Update'
                            : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const LoanClearanceAnalysisCreateUpdateModal = ({
    title = 'Add Clearance Analysis',
    description = 'Add a new clearance analysis entry.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps?: ILoanClearanceAnalysisFormProps
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanClearanceAnalysisCreateUpdateForm
                {...formProps}
                onSuccess={(analysis) => {
                    formProps?.onSuccess?.(analysis)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanClearanceAnalysisCreateUpdateForm
