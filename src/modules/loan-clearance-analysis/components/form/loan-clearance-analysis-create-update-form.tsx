import { useForm } from 'react-hook-form'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'

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
                ref={formRef}
                onSubmit={onSubmit}
                className={cn(
                    'flex w-full max-w-full min-w-0 flex-col gap-y-4',
                    className
                )}
            >
                <fieldset disabled={readOnly} className="space-y-4">
                    <FormFieldWrapper
                        control={form.control}
                        name="regular_deduction_description"
                        label="Regular Deduction Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Regular Deduction Description"
                                disabled={isDisabled(field.name)}
                                rows={3}
                            />
                        )}
                    />

                    <FormFieldWrapper
                        control={form.control}
                        name="regular_deduction_amount"
                        label="Regular Deduction Amount"
                        render={({ field }) => (
                            <Input
                                {...field}
                                id={field.name}
                                placeholder="0.00"
                                disabled={isDisabled(field.name)}
                                onChange={(e) => {
                                    const value =
                                        parseFloat(e.target.value) || 0
                                    field.onChange(value)
                                }}
                            />
                        )}
                    />

                    <Separator />

                    <FormFieldWrapper
                        control={form.control}
                        name="balances_description"
                        label="Balances Description"
                        render={({ field }) => (
                            <Textarea
                                {...field}
                                id={field.name}
                                placeholder="Balances Description"
                                disabled={isDisabled(field.name)}
                                rows={3}
                            />
                        )}
                    />

                    <div className="grid gap-3 grid-cols-2">
                        <FormFieldWrapper
                            control={form.control}
                            name="balances_amount"
                            label="Balances Amount"
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
                                />
                            )}
                        />

                        <FormFieldWrapper
                            control={form.control}
                            name="balances_count"
                            label="Balances Count"
                            render={({ field }) => (
                                <Input
                                    {...field}
                                    id={field.name}
                                    placeholder="0"
                                    disabled={isDisabled(field.name)}
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
                                />
                            )}
                        />
                    </div>
                </fieldset>

                <FormFooterResetSubmit
                    readOnly={readOnly}
                    resetButtonType="button"
                    submitButtonType="button"
                    disableSubmit={!form.formState.isDirty}
                    submitText={
                        formProps.defaultValues?.id ||
                        formProps.defaultValues?.fieldKey
                            ? 'Update'
                            : 'Create'
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
            title={title}
            description={description}
            className={cn('!max-w-xl', className)}
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
