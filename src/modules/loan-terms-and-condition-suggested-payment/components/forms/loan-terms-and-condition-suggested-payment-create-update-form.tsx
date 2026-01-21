import { useForm } from 'react-hook-form'
import z from 'zod'

import { standardSchemaResolver } from '@hookform/resolvers/standard-schema'

import { cn } from '@/helpers/tw-utils'

import FormFooterResetSubmit from '@/components/form-components/form-footer-reset-submit'
import Modal, { IModalProps } from '@/components/modals/modal'
import { Form } from '@/components/ui/form'
import FormFieldWrapper from '@/components/ui/form-field-wrapper'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

import { useFormHelper } from '@/hooks/use-form-helper'

import { IClassProps, IForm, TEntityId } from '@/types'

import {
    LoanTermsAndConditionSuggestedPaymentSchema,
    TLoanTermsAndConditionSuggestedPaymentSchema,
} from '../../loan-terms-and-condition-suggested-payment.validation'

type TLoanTermsAndConditionSuggestedPaymentFormValues =
    TLoanTermsAndConditionSuggestedPaymentSchema & {
        fieldKey?: string
    }

type ILoanTermsAndConditionSuggestedPaymentForForm = z.infer<
    typeof LoanTermsAndConditionSuggestedPaymentSchema
>

export interface ILoanTermsAndConditionSuggestedPaymentFormProps
    extends IClassProps,
        IForm<
            Partial<TLoanTermsAndConditionSuggestedPaymentFormValues>,
            ILoanTermsAndConditionSuggestedPaymentForForm,
            Error,
            TLoanTermsAndConditionSuggestedPaymentFormValues
        > {
    loanTransactionId?: TEntityId
}

const LoanTermsAndConditionSuggestedPaymentCreateForm = ({
    className,
    loanTransactionId,
    onSuccess,
    readOnly,
    ...formProps
}: ILoanTermsAndConditionSuggestedPaymentFormProps) => {
    const form = useForm<TLoanTermsAndConditionSuggestedPaymentFormValues>({
        resolver: standardSchemaResolver(
            LoanTermsAndConditionSuggestedPaymentSchema
        ),
        reValidateMode: 'onChange',
        mode: 'onSubmit',
        defaultValues: {
            loan_transaction_id: loanTransactionId,
            name: '',
            description: '',
            ...formProps.defaultValues,
        },
    })

    const { formRef, isDisabled } =
        useFormHelper<TLoanTermsAndConditionSuggestedPaymentFormValues>({
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
                <div className="space-y-4">
                    <FormFieldWrapper
                        control={form.control}
                        label="Name"
                        name="name"
                        render={({ field }) => (
                            <Input
                                {...field}
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        onSubmit()
                                        e.preventDefault()
                                    }
                                }}
                                placeholder="e.g., Monthly installment, Weekly payment"
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
                                className="min-h-[100px]"
                                disabled={isDisabled(field.name)}
                                id={field.name}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' && e.ctrlKey) {
                                        onSubmit()
                                        e.preventDefault()
                                    }
                                }}
                                placeholder="Describe the payment method terms and conditions..."
                            />
                        )}
                    />
                </div>

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
                        formProps.defaultValues?.fieldKey ? 'Update' : 'Create'
                    }
                />
            </form>
        </Form>
    )
}

export const LoanTermsAndConditionSuggestedPaymentCreateModal = ({
    title = 'Add Suggested Payment',
    description = 'Add a new suggested payment method.',
    className,
    formProps,
    ...props
}: IModalProps & {
    formProps: ILoanTermsAndConditionSuggestedPaymentFormProps
}) => {
    return (
        <Modal
            className={cn('!max-w-xl', className)}
            description={description}
            title={title}
            {...props}
        >
            <LoanTermsAndConditionSuggestedPaymentCreateForm
                {...formProps}
                onSuccess={(payment) => {
                    formProps.onSuccess?.(payment)
                    props.onOpenChange?.(false)
                }}
            />
        </Modal>
    )
}

export default LoanTermsAndConditionSuggestedPaymentCreateForm
